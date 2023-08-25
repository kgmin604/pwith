from flask import Blueprint, request, redirect, session
from flask_login import login_user
import requests
import json
from datetime import datetime

from backend import config
from backend.view import login_required_naver
from backend.controller.member_mgmt import Member
from backend.controller.refreshToken_mgmt import RefreshToken

oauth_bp = Blueprint('oauth', __name__, url_prefix = '')

@oauth_bp.route('/oauth/callback/google', methods = ['GET'])
def google_callback():
    
    code = request.args.get('code')

    token_endpoint = config.GOOGLE_TOKEN_ENDPOINT
    info_endpoint = config.GOOGLE_INFO_ENDPOINT
    client_id = config.GOOGLE_CLIENT_ID
    client_secret = config.GOOGLE_CLIENT_SECRET
    redirect_uri = config.GOOGLE_REDIRECT_URI
    grant_type = 'authorization_code'

    token_response = requests.post(token_endpoint,
        params = dict(code = code),
        data = dict(
            code = code,
            client_id = client_id,
            client_secret = client_secret,
            redirect_uri = redirect_uri,
            grant_type = grant_type
    ))

    access_token = token_response.json().get("access_token")
    # refresh_token = token_response.json().get("refresh_token")

    info_response = requests.get(
        info_endpoint,
        headers = {
            'Authorization' : f'Bearer {access_token}'
        }
    )
    info = info_response.json()
    print(info) ########### TODO 이거 확인해주면 됨!

    status = 200
    message = '성공'
    data = None

    # if info.get('resultcode') != '00' :
    #     return {
    #         'status' : 401,
    #         'message' : '인증 실패'
    #     }

    # valid access token

    status, message = checkJoin(info.get('response'), refresh_token)

    if status == 200 : # login

        is_exist = RefreshToken.existsByMember(message.id)

        if is_exist == False :
            RefreshToken.save(message.id, refresh_token, datetime.now())

        data = {
            'id' : message.email.split('@')[0],
            'nickname' : message.nickname
        }
        message = '성공'
        access_token_return = access_token
        # refresh_token_return = refresh_token

    # return {
    #     'status' : status,
    #     'message' : message,
    #     'data' : data,
    #     'access_token' : access_token_return,
    #     'refresh_token' : refresh_token_return
    # }


def checkJoin_google(data, refresh_token) :

    sns_type = 'GOOGLE'

    sns_id = data.get('id')
    member = Member.findBySns(sns_id, sns_type)
    if member is not None :
        return 200, member

    # email = data.get('email')
    # if Member.existsByEmail(email) :
    #     return 409, '이메일 중복'

    # nickname = data.get('nickname')

    nickname = data.get('name') # google은 nickname이 없는 듯
        
    image = data.get('picture')
    if image is None :
        image = 'https://pwith-bucket.s3.ap-northeast-2.amazonaws.com/profile/default_user.jpg'

    member_id = Member.saveOauth(nickname, email, image, sns_id, sns_type)

    member = Member.findById(member_id)

    return 200, member

@oauth_bp.route('/oauth/callback/naver', methods = ['GET'])
def naver_callback():
    
    code = request.args.get('code')

    token_endpoint = config.NAVER_TOKEN_ENDPOINT
    info_endpoint = config.NAVER_INFO_ENDPOINT
    client_id = config.NAVER_CLIENT_ID
    client_secret = config.NAVER_CLIENT_SECRET
    redirect_uri = config.NAVER_REDIRECT_URI
    grant_type = 'authorization_code'

    token_response = requests.get(token_endpoint, params = dict(
        code = code,
        client_id = client_id,
        client_secret = client_secret,
        grant_type = grant_type
    ))

    access_token = token_response.json().get("access_token")
    refresh_token = token_response.json().get("refresh_token")

    info_response = requests.get(
        info_endpoint,
        headers = {
            'Authorization' : f'Bearer {access_token}'
        }
    )
    info = info_response.json()

    status = 200
    message = '성공'
    data = None

    if info.get('resultcode') != '00' :
        return {
            'status' : 401,
            'message' : '인증 실패'
        }

    # valid access token

    status, message = checkJoin(info.get('response'), refresh_token)

    if status == 200 : # login

        is_exist = RefreshToken.existsByMember(message.id)

        if is_exist == False :
            RefreshToken.save(message.id, refresh_token, datetime.now())

        data = {
            'id' : message.email.split('@')[0],
            'nickname' : message.nickname
        }
        message = '성공'
        access_token_return = access_token
        refresh_token_return = refresh_token

    return {
        'status' : status,
        'message' : message,
        'data' : data,
        'access_token' : access_token_return,
        'refresh_token' : refresh_token_return
    }

def checkJoin(data, refresh_token) :

    sns_type = 'NAVER'

    sns_id = data.get('id')
    member = Member.findBySns(sns_id, sns_type)
    if member is not None :
        return 200, member

    email = data.get('email')
    if Member.existsByEmail(email) :
        return 409, '이메일 중복'

    nickname = data.get('nickname')
        
    image = data.get('profile_image')
    if image is None :
        image = 'https://pwith-bucket.s3.ap-northeast-2.amazonaws.com/profile/default_user.jpg'

    member_id = Member.saveOauth(nickname, email, image, sns_id, sns_type)

    member = Member.findById(member_id)

    return 200, member

@oauth_bp.route('/login-require-test')
@login_required_naver
def login_require_test(loginMember, new_token) :
    
    if loginMember is None :
        return {
            'status' : '401',
            'message' : '로그인이 필요합니다,',
            'data' : None
        }

    if new_token is not None :
        return {
            'data' : {
                'writer' : loginMember.nickname,
                'content' : '로그인 권한 테스트'
            },
            'access_token' : new_token
        }

    return {
        'writer' : loginMember.nickname,
        'content' : '로그인 권한 테스트'
    }

@oauth_bp.route('/logout/oauth')
@login_required_naver
def logoutOauth(loginMember, new_token) :
    RefreshToken.deleteByMember(loginMember.id)
    # TODO sns 토큰 삭제
    # TODO header 삭제
    return {
        'message' : '로그아웃 성공'
    }