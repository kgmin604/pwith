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

    if provider == 'naver' : # OAuth Naver
        loginMember, new_token = checkLoginNaver(access_token, refresh_token)
    
    elif provider == 'kakao' : # OAuth Kakao
        loginMember, new_token = checkLoginKakao(access_token, refresh_token)

    elif provider == 'google' : # OAuth Google
        loginMember, new_token = checkLoginGoogle(access_token, refresh_token)
    
    return loginMember, new_token

def custom_login_required(func):
    @wraps(func)
    def checkLogin(*args, **kwargs):

        loginMember = None
        new_token = None

        provider = request.cookies.get('provider')
        access_token = request.cookies.get('access_token')
        refresh_token = request.cookies.get('refresh_token')

        if provider is None : # session login

            if not current_user.is_authenticated :
                return current_app.login_manager.unauthorized()

            else :
                id = current_user.get_id()
                loginMember = Member.findById(id)

        elif provider == 'naver' : # OAuth Naver
            loginMember, new_token = checkLoginNaver(access_token, refresh_token)
        
        elif provider == 'kakao' : # OAuth Kakao
            loginMember, new_token = checkLoginKakao(access_token, refresh_token)

        elif provider == 'google' : # OAuth Google
            loginMember, new_token = checkLoginGoogle(access_token, refresh_token)

        if loginMember is None :
            return current_app.login_manager.unauthorized()

        kwargs['loginMember'] = loginMember
        kwargs['new_token'] = new_token

        return func(*args, **kwargs)

    return checkLogin

login_required = custom_login_required

def checkLoginGoogle(access_token, refresh_token) :

    loginMember, new_token = None, None

    resp = requests.get(
        config.GOOGLE_INFO_ENDPOINT,
        headers = {
            'Authorization' : f'Bearer {access_token}'
        }
    )
    result = resp.json()
    print(result) ###
    
    if result.get('error') is None : # access 유효

        sns_id = result.get('id')
        loginMember = Member.findBySns(sns_id, 'GOOGLE')

    elif result.get('error').get('code') == 401 : # access 만료 / refresh 오류

        member_id = RefreshToken.findMemberByToken(refresh_token)
        if member_id is None :
            loginMember = None
        else :
            loginMember = Member.findById(member_id)
        new_token = updateAccessToken(refresh_token, 'GOOGLE')

    return loginMember, new_token

def checkLoginNaver(access_token, refresh_token) :

    loginMember, new_token = None, None

    resp = requests.get(
        config.NAVER_INFO_ENDPOINT,
        headers = {
            'Authorization' : f'Bearer {access_token}'
        }
    )
    result = resp.json()
    
    if result.get('resultcode') == '00' : # access 유효

        sns_id = result.get('response').get('id')
        loginMember = Member.findBySns(sns_id, 'NAVER')

    elif result.get('resultcode') == '024' : # access 만료 / refresh 오류

        member_id = RefreshToken.findMemberByToken(refresh_token)
        if member_id is None :
            loginMember = None
        else :
            loginMember = Member.findById(member_id)
        new_token = updateAccessToken(refresh_token, 'NAVER')
    
    return loginMember, new_token

def checkLoginKakao(access_token, refresh_token) :

    loginMember, new_token = None, None

    resp = requests.get(
        config.KAKAO_VALIDATION_ENDPOINT,
        headers = {
            'Authorization' : f'Bearer {access_token}'
        }
    )
    result = resp.json()

    if result.get('id') is not None : # access 유효
        sns_id = result.get('id')
        loginMember = Member.findBySns(sns_id, 'KAKAO')

    elif result.get('code') == '-401' : # access 만료 / refresh 오류
        
        member_id = RefreshToken.findMemberByToken(refresh_token)
        if member_id is None :
            loginMember = None
        else :
            loginMember = Member.findById(member_id)
        new_token = updateAccessToken(refresh_token, 'KAKAO')
    
    return loginMember, new_token

def updateAccessToken(refresh_token, provider) :

    token_endpoint = getattr(config, f'{provider}_TOKEN_ENDPOINT')
    client_id = getattr(config, f'{provider}_CLIENT_ID')
    client_secret = getattr(config, f'{provider}_CLIENT_SECRET')

    data = dict(
        client_id = client_id,
        client_secret = client_secret,
        refresh_token = refresh_token,
        grant_type = 'refresh_token'
    )

    if provider == 'NAVER' :
        resp = requests.get(token_endpoint, params = data)
    elif provider == 'KAKAO' :
        resp = requests.post(token_endpoint, data = data)
    elif provider == 'GOOGLE' :
        resp = requests.post(token_endpoint, data = data) ### TODO check

    return resp.json().get('access_token')

def formatDateToString(date): # 타입 변경 datetime -> string
    return datetime.strftime(date, "%Y-%m-%d %H:%M:%S")

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