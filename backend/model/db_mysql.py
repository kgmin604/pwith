import pymysql

MYSQL_HOST = 'pwith-db.ci3orq0jhzyy.ap-northeast-2.rds.amazonaws.com'
MYSQL_PORT = 3306
MYSQL_USER = 'admin'
MYSQL_PW = 'pwith1234'
MYSQL_DB = 'pwith_db'

mysql_conn = None  # 전역 변수로 선언

def conn_mysql():
    global mysql_conn  # 전역 변수를 사용하기 위해 global 키워드 사용
    if mysql_conn is None:  # mysql_conn이 None인 경우에만 초기화
        mysql_conn = pymysql.connect(
            host=MYSQL_HOST,
            port=MYSQL_PORT,
            user=MYSQL_USER,
            passwd=MYSQL_PW,
            db=MYSQL_DB,
            charset='utf8'
        )
    elif not mysql_conn.open:  # mysql_conn이 열려있지 않은 경우에는 재연결 시도
        mysql_conn.ping(reconnect=True)
    return mysql_conn


# def conn_mysql():
#     if not mysql_conn.open:
#         mysql_conn.ping(reconnect=True)
#     return mysql_conn