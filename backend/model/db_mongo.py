import pymongo

MONGO_HOST = 'localhost'

mongo_conn = pymongo.MongoClient('mongodb://%s' % MONGO_HOST)

def conn_mongodb() :
    try:
        mongo_conn.admin.command('ismaster')
        pwith_db = mongo_conn.pwith_db
    except:
        mongo_conn = pymongo.MongoClient('mongodb://%s' % MONGO_HOST)
        pwith_db = mongo_conn.pwith_db
    return pwith_db


# 컴퓨터에 MongoDB 없으면 설치해야 해.
# MongoDB Compass로 pwith_db라는 데이터베이스 생성하고 ITnews_crawling, lecture_crawling, book_crawling이라는 collection 세 개 추가하기

# 추가로, pymysql 모듈 설치했듯 pymongo 모듈도 설치해야 해. venv 가상환경에서 pip install pymongo 입력하기.