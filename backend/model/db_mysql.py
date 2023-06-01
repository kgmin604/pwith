import pymysql

MYSQL_HOST = 'pwith-db.ci3orq0jhzyy.ap-northeast-2.rds.amazonaws.com'
MYSQL_PORT = 3306
MYSQL_USER = 'admin'
MYSQL_PW = 'pwith1234'
MYSQL_DB = 'pwith_db'

mysql_conn = pymysql.connect(
    host=MYSQL_HOST,
    port=MYSQL_PORT,
    user=MYSQL_USER,
    passwd=MYSQL_PW,
    db=MYSQL_DB,
    charset='utf8'
)

def conn_mysql():
    if not mysql_conn.open:
        mysql_conn.ping(reconnect=True)
    return mysql_conn