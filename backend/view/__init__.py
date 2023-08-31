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

def custom_login_required(func):
    @wraps(func)
    def checkLogin(*args, **kwargs):

        loginMember = None
        new_token = None

        access_token = request.cookies.get('access_token')
        refresh_token = request.cookies.get('refresh_token')

        if access_token is None : # session login

            if not current_user.is_authenticated :
                return current_app.login_manager.unauthorized()

            else :
                id = current_user.get_id()
                loginMember = Member.findById(id)

        else : # OAuth Naver

            resp = requests.get(
                config.NAVER_INFO_ENDPOINT,
                headers = {
                    'Authorization' : f'Bearer {access_token}'
                }
            )

            result = resp.json()
            
            if result.get('resultcode') == '00' : # access 유효

                sns_id = result.get('response').get('id')

                loginMember = Member.findBySns(sns_id, 'NAVER') ## TODO sns_type 수정

            elif result.get('resultcode') == '024' : # access 만료 / refresh 오류

                member_id = RefreshToken.findMemberByToken(refresh_token)

                if member_id is None :
                    return current_app.login_manager.unauthorized()

                loginMember = Member.findById(member_id)
                new_token = updateAccessToken(refresh_token)

        kwargs['loginMember'] = loginMember
        kwargs['new_token'] = new_token

        return func(*args, **kwargs)

    return checkLogin

login_required = custom_login_required

def updateAccessToken(refresh_token) :

    resp = requests.get(config.NAVER_TOKEN_ENDPOINT, params = dict(
        client_id = config.NAVER_CLIENT_ID,
        client_secret = config.NAVER_CLIENT_SECRET,
        refresh_token = refresh_token,
        grant_type = 'refresh_token'
    ))

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