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


# MongoDB Compass로 pwith_db 라는 데이터베이스 안에 ITnews_crawling, lecture_crawling, book_crawling이라는 collection 세 개 추가하기.
# mongoDB 없으면 설치해야 함.