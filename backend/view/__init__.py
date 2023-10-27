from datetime import datetime
from werkzeug.utils import secure_filename
from botocore.client import Config
from functools import wraps
from flask import request, current_app
from flask_login import current_user
import requests
import boto3

from backend.controller import selectAll, selectOne, commit
from backend.controller.member_mgmt import Member
from backend.controller.refreshToken_mgmt import RefreshToken
from backend import config

s3 = boto3.client(
    's3',
    aws_access_key_id = config.S3_ACCESS_KEY,
    aws_secret_access_key = config.S3_SECRET_KEY,
    config = Config(signature_version = 's3v4')
)

def uploadFileS3(file, dir="image"):

    image_url = ""

    if file:

        filename = dir + "/" + secure_filename(file.filename)

        s3.upload_fileobj(file, config.S3_BUCKET_NAME, filename)

        location = s3.get_bucket_location(Bucket=config.S3_BUCKET_NAME)["LocationConstraint"]

        image_url = f"https://{config.S3_BUCKET_NAME}.s3.{location}.amazonaws.com/{filename}"

    return image_url

def findSocialLoginMember() :
    loginMember = None
    new_token = None

    provider = request.cookies.get('provider')
    access_token = request.cookies.get('access_token')
    refresh_token = request.cookies.get('refresh_token')

    if not provider or not access_token or not refresh_token:
        return loginMember, new_token

    loginMember, new_token = checkToken(access_token, refresh_token, provider)
    
    return loginMember, new_token

def custom_login_required(func):
    @wraps(func)
    def checkLogin(*args, **kwargs):

        loginMember = None
        new_token = None

        provider = request.cookies.get('provider')
        access_token = request.cookies.get('access_token')
        refresh_token = request.cookies.get('refresh_token')

        if provider is None :

            if not current_user.is_authenticated : # not login
                return current_app.login_manager.unauthorized()

            else : # session login
                loginMember = current_user

        elif provider in ['GOOGLE', 'NAVER', 'KAKAO']: # OAuth
            loginMember, new_token = checkToken(access_token, refresh_token, provider)

        if loginMember is None :
            return current_app.login_manager.unauthorized()

        kwargs['loginMember'] = loginMember
        kwargs['new_token'] = new_token

        return func(*args, **kwargs)

    return checkLogin

login_required = custom_login_required

def checkToken(access_token, refresh_token, provider) :

    loginMember, new_token = None, None

    resp = requests.get(
        getattr(config, f'{provider}_VALIDATION_ENDPOINT' if provider == 'KAKAO' else f'{provider}_INFO_ENDPOINT'),
        headers = {
            'Authorization' : f'Bearer {access_token}'
        }
    )
    result = resp.json()

    conditions = {
        'GOOGLE': (result.get('error') is None, result.get('error', {}).get('code') == 401),
        'KAKAO': (result.get('id') is not None, result.get('code') == '-401'),
        'NAVER': (result.get('resultcode') == '00', result.get('resultcode') == '024')
    }

    if conditions.get(provider)[0]: # access 유효
        sns_id = result.get('response').get('id') if provider == 'NAVER' else result.get('id')
        loginMember = Member.findBySns(sns_id, provider)

    elif conditions.get(provider)[1]: # access 만료 / refresh 오류
        member_id = RefreshToken.findMemberByToken(refresh_token)
        loginMember = Member.findById(member_id) if member_id is not None else None
        new_token = updateAccessToken(refresh_token, provider)

    return loginMember, new_token

def updateAccessToken(refresh_token, provider) :

    print("==updateAccessToken==")

    token_endpoint = getattr(config, f'{provider}_TOKEN_ENDPOINT')
    client_secret = getattr(config, f'{provider}_CLIENT_SECRET')
    client_id = getattr(config, f'{provider}_CLIENT_ID')

    data = dict(
        client_id = client_id,
        client_secret = client_secret,
        refresh_token = refresh_token,
        grant_type = 'refresh_token'
    )

    if provider == 'NAVER':
        resp = requests.get(token_endpoint, params = data)
    elif provider == 'KAKAO':
        resp = requests.post(token_endpoint, data = data)
    elif provider == 'GOOGLE': # TODO TEST & REFACTOR
        resp = requests.post(token_endpoint,
            headers = {
                'Content-type' : 'application/x-www-form-urlencoded;'
            },
            data = {
                'client_id': client_id,
                'client_secret': client_secret,
                'refresh_token': refresh_token,
                'grant_type': 'refresh_token',
                'access_type': 'offline'
            }
        )
        print(resp.json())

    return resp.json().get('access_token')

def payKakao(roomId, loginMember, item_name, total_tuition, isApply=False):

    # TODO refactoring

    cid = config.KAKAO_PAY_CID
    ready_url = config.KAKAO_PAY_READY
    admin_key = config.KAKAO_PAY_ADMIN_KEY

    if isApply:
        success_url = config.KAKAO_PAY_SUCCESS_APPLY.format(roomId)
        cancel_url = config.KAKAO_PAY_CANCEL_APPLY.format(roomId)
        fail_url = config.KAKAO_PAY_FAIL_APPLY.format(roomId)
    else:
        success_url = config.KAKAO_PAY_SUCCESS.format(roomId)
        cancel_url = config.KAKAO_PAY_CANCEL.format(roomId)
        fail_url = config.KAKAO_PAY_FAIL.format(roomId)

    response = requests.post(
        ready_url,
        headers = {
            'Authorization' : f'KakaoAK {admin_key}',
            'Content-type': 'application/x-www-form-urlencoded;charset=utf-8'
        },
        data = dict(
            cid = cid,
            partner_order_id = '1000', ## TODO update
            partner_user_id = loginMember.id,
            item_name = item_name,
            quantity = '1',
            tax_free_amount = 0,
            total_amount = total_tuition,
            approval_url = success_url,
            cancel_url = cancel_url,
            fail_url = fail_url
        )
    ).json()
    return response

def payKakaoSuccess(loginMember, pg_token, tid):

    cid = config.KAKAO_PAY_CID
    admin_key = config.KAKAO_PAY_ADMIN_KEY
    approve_url = config.KAKAO_PAY_APPROVE

    response = requests.post(
        approve_url,
        headers = {
            'Authorization' : f'KakaoAK {admin_key}',
            'Content-type': 'application/x-www-form-urlencoded;charset=utf-8'
        },
        data = dict(
            cid = cid,
            tid = tid,
            partner_order_id = '1000', ## TODO update
            partner_user_id = loginMember.id,
            pg_token = pg_token
        )
    ).json()
    return response

def formatDateToString(date): # 타입 변경 datetime -> string
    return datetime.strftime(date, "%Y-%m-%d %H:%M:%S")

def formatYMDHM(date): # datetime -> string 년-월-일 시:분
    return datetime.strftime(date, "%Y-%m-%d %H:%M")

def getFormattedDate(curDate): # 날짜 포맷 년-월-일-상세시간
    date_object = datetime.strptime(curDate, "%Y-%m-%d %H:%M:%S")

    formatted_datetime = date_object.strftime("%y-%m-%d %H:%M")
    
    return formatted_datetime

def mainFormattedDate(curDate): # 날짜 포맷 월-일
    if isinstance(curDate, str):        
        curDate = datetime.strptime(curDate, "%Y-%m-%d %H:%M:%S")
        
    formatted_date = curDate.strftime("%m-%d")
    
    return formatted_date
    
def formatYMD(curDate): # 날짜 포맷 년-월-일
    if isinstance(curDate, str):        
        curDate = datetime.strptime(curDate, "%Y-%m-%d %H:%M:%S")
        
    formatted_date = curDate.strftime("%Y-%m-%d")
    
    return formatted_date

def nicknameToId(memId):
        sql = f"select id from member where nickname = '{str(memId)}' or memId = '{str(memId)}'"
        
        id = selectOne(sql)
        
        return id[0]
    
def IdtoMemId(id):
    sql = f"select memId from member where id = '{str(id)}'"

    id = selectOne(sql)
    
    return id[0]

def findNickName(id):
    sql = f"select nickname from member where id = '{str(id)}'"

    nickname = selectOne(sql)
    
    return nickname[0]

def getProfileImage(memId): # profileImage member 에서 받아오기
        sql = f"select image from member where member.id = '{str(memId)}'"
        
        profileImage = selectOne(sql)
        
        return str(profileImage[0])