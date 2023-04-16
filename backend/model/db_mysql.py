import pymysql

MYSQL_HOST = 'localhost'
MYSQL_PORT = 3306
MYSQL_USER = 'root'
MYSQL_PW = '1234'
MYSQL_DB = 'pwith_db'

MYSQL_CONN = pymysql.connect(
    host=MYSQL_HOST,
    port=MYSQL_PORT,
    user=MYSQL_USER,
    passwd=MYSQL_PW,
    db=MYSQL_DB,
    charset='utf8'
)

def conn_mysql():
    if not MYSQL_CONN.open:
        MYSQL_CONN.ping(reconnect=True)
    return MYSQL_CONN