from datetime import datetime
from werkzeug.utils import secure_filename
from botocore.client import Config
import boto3

from backend.controller import selectAll, selectOne, commit
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