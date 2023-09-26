from flask import Blueprint, request, redirect, session
from flask_login import login_user
import requests
import json
from datetime import datetime

from backend import config
from backend.view import login_required
from backend.controller.member_mgmt import Member
from backend.controller.refreshToken_mgmt import RefreshToken

oauth_bp = Blueprint('oauth', __name__, url_prefix = '')

@oauth_bp.route('/oauth/callback/<provider>', methods = ['GET'])
def oauth_callback(provider):

    if provider not in ['google', 'naver', 'kakao']:
        return {
            'status' : 404,
            'message' : '제공하지 않는 리소스 서버',
            'data' : None
        }

    provider = str.upper(provider)

    code = request.args.get('code')

    token_endpoint = getattr(config, f'{provider}_TOKEN_ENDPOINT')
    info_endpoint = getattr(config, f'{provider}_INFO_ENDPOINT')
    client_id = getattr(config, f'{provider}_CLIENT_ID')
    client_secret = getattr(config, f'{provider}_CLIENT_SECRET')
    redirect_uri = getattr(config, f'{provider}_REDIRECT_URI')
    grant_type = 'authorization_code'

    token_response = ''
    if provider == 'NAVER':
        token_response = requests.get(token_endpoint, params = dict(
            code = code,
            client_id = client_id,
            client_secret = client_secret,
            grant_type = grant_type
        ))
    else:
        token_response = requests.post(token_endpoint, 
            headers = {
                'Content-type' : 'application/x-www-form-urlencoded;charset=utf-8'
            },
            data = dict(
                code = code,
                client_id = client_id,
                client_secret = client_secret,
                grant_type = grant_type,
                redirect_uri = redirect_uri
            )
        )

    access_token = token_response.json().get('access_token')
    refresh_token = token_response.json().get('refresh_token')

    info_response = requests.get(
        info_endpoint,
        headers = {
            'Authorization' : f'Bearer {access_token}',
            'Content-type' : 'application/x-www-form-urlencoded;charset=utf-8'
        }
    )
    info = info_response.json()

    status = 200
    message = '성공'
    data = None

    if (provider == 'KAKAO' and info.get('code') is not None) or \
       (provider == 'GOOGLE' and info.get('error') is not None) or \
       (provider == 'NAVER' and info.get('resultcode') != '00'):
        return {
            'status': 401,
            'message': '인증 실패',
            'data': None
        }

    # valid access token
    
    status, message = checkJoin(info.get('response') if provider == 'NAVER' else info, provider)

    if status == 200 : # login

        is_exist = RefreshToken.existsByMember(message.id)

        if not is_exist: # 첫 요청에서만 저장
            RefreshToken.save(message.id, refresh_token, datetime.now())
        elif provider == 'KAKAO':
            RefreshToken.deleteByMember(message.id)
            RefreshToken.save(message.id, refresh_token, datetime.now())
        elif provider == 'GOOGLE':
            refresh_token = RefreshToken.findTokenByMemberId(message.id)

        data = {
            'id' : message.memId,
            'nickname' : message.nickname,
            'isSocial' : True
        }
        message = '성공'

    return {
        'status' : status,
        'message' : message,
        'data' : data,
        'token' : {
            'provider' : provider,
            'access_token' : access_token,
            'refresh_token' : refresh_token
        }
    }

def checkJoin(data, sns_type) :

    sns_id = data.get('id')
    member = Member.findBySns(sns_id, sns_type)
    if member is not None :
        # login
        return 200, member

    # join
    if sns_type == 'NAVER':
        email = data.get('email')
        nickname = data.get('nickname')
        image = data.get('profile_image')

    elif sns_type == 'KAKAO':
        account = data.get('kakao_account')
        email = account.get('email')
        profile = account.get('profile')
        nickname = profile.get('nickname')
        image = profile.get('profile_image_url')

    elif sns_type == 'GOOGLE':
        email = data.get('email')
        nickname = data.get('name')
        image = data.get('picture')

    if Member.existsByEmail(email) :
        return 409, '이메일 중복'
        
    if image is None :
        image = 'https://pwith-bucket.s3.ap-northeast-2.amazonaws.com/profile/default_user.jpg'

    member_id = Member.saveOauth(nickname, email, image, sns_id, sns_type)

    member = Member.findById(member_id)

    return 200, member