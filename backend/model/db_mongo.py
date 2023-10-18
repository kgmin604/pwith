import pymongo

MONGO_SERVER = 'mongodb+srv://pwith:pwith1234@cluster0.ezfau5x.mongodb.net/'

def conn_mongodb() :
    try:
        mongo_conn = pymongo.MongoClient(MONGO_SERVER)
        mongo_conn.admin.command('ismaster')
    except:
        print("pymongo exception")
        mongo_conn = pymongo.MongoClient(MONGO_SERVER)
    finally:
        pwith_db = mongo_conn.pwith_db
    return pwith_db