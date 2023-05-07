import pymysql

# MYSQL_HOST = '192.168.165.10'
MYSQL_HOST = 'localhost'
MYSQL_PORT = 3306
# MYSQL_USER = 'pwith'
MYSQL_USER = 'root'
MYSQL_PW = '1234'
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

# sql = '''
# CREATE TABLE member
# (
#     memId VARCHAR(10),
#     memPw VARCHAR(20) NOT NULL,
#     memName VARCHAR(10) NOT NULL,
#     memEmail VARCHAR(20) NOT NULL,
#     isMento BOOLEAN,
#     joinStudy JSON,
#     feedback JSON,
#     PRIMARY KEY(memId)
# );
# '''
# cyson_db = mysql_conn.cursor()
# cyson_db.execute(sql)
# mysql_conn.commit()

# DB는 mysql 터미널에서 CREATE DATABASE pwith_db; 명령어로 만들었고, 위 주석 실행해서 member 테이블 만들었음