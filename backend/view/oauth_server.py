from flask import Blueprint, request, redirect
from flask_login import login_user
import requests
import json

from backend import config
from backend.controller.member_mgmt import Member

oauth_bp = Blueprint('oauth', __name__, url_prefix = '')

@oauth_bp.route('/oauth/callback/google', methods = ['GET'])
def google_callback(): # access token
    
    code = request.args.get('code')

    token_endpoint = config.GOOGLE_TOKEN_ENDPOINT
    client_id = config.GOOGLE_CLIENT_ID
    client_secret = config.GOOGLE_CLIENT_SECRET
    redirect_uri = config.GOOGLE_REDIRECT_URI
    grant_type = 'authorization_code'

    resp = requests.post(token_endpoint, data = dict(
        code = code,
        client_id = client_id,
        client_secret = client_secret,
        redirect_uri = redirect_uri,
        grant_type = grant_type
    ))

    # json.loads(resp.text).get_json
    # token = json.loads(resp.text).get('access_token')

    # login_user() TODO

    return json.loads(resp.text) # str to json

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

    if info.get('resultcode') == '00' :

        status, message = join_naver(info.get('response'))

        if status == 200 :
            login_user(message)
            data = {
                'id' : message.email.split('@')[0],
                'nickname' : message.nickname
            }
            message = '성공'
    else :
        status = 401
        message = '인증 실패'

    return {
        'status' : status,
        'message' : message,
        'data' : data
    }


def join_naver(data) :

    sns_id = data.get('id')
    member = Member.findBySnsId(sns_id)
    if member is not None :
        return 200, member

    email = data.get('email')
    if Member.existsByEmail(email) :
        return 409, '이메일 중복'

    nickname = data.get('nickname')
        
    image = data.get('profile_image')
    if image is None :
        image = 'https://pwith-bucket.s3.ap-northeast-2.amazonaws.com/profile/default_user.jpg'

    member_id = Member.save_oauth(nickname, email, image, sns_id)
    member = Member.findById(member_id)

    return 200, member