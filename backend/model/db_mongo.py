import pymongo

MONGO_SERVER = 'mongodb+srv://pwith:pwith1234@cluster0.ezfau5x.mongodb.net/'

mongo_conn = pymongo.MongoClient(MONGO_SERVER)

def conn_mongodb() :
    try:
        mongo_conn.admin.command('ismaster')
    except:
        mongo_conn = pymongo.MongoClient(MONGO_SERVER)
    finally:
        pwith_db = mongo_conn.pwith_db
    return pwith_db
