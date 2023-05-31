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



#pwith_db = mysql_conn.cursor()
#pwith_db.execute(sql)
#mysql_conn.commit()



# DB는 mysql 터미널에서 CREATE DATABASE pwith_db; 명령어로 만들었고, 위 주석 실행해서 member 테이블 만들었음


