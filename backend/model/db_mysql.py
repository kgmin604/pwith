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

#sql = '''
#CREATE TABLE member
#(
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

##🚨 study 테이블 수정으로 여기서부터 실행해서 기존 테이블 삭제 후 테이블 새로 만들어주세요~! - 정윤

#sql = 'drop table study;'

#pwith_db = mysql_conn.cursor()
#pwith_db.execute(sql)
#mysql_conn.commit()

#💙 study 테이블 생성

#sql = '''
# CREATE TABLE study
# (
#     studyID	INT AUTO_INCREMENT PRIMARY KEY,
#     title	    VARCHAR(50) NOT NULL,
#     writer	VARCHAR(10),	
#     curDate	DATE,	
#     content	VARCHAR(500) NOT NULL,	
#     category	INT,	
#     views	    INT DEFAULT 0,	
#     joiningP	INT DEFAULT 0,	
#     totalP	INT	DEFAULT 50,
#     FOREIGN KEY (writer)
#     REFERENCES member(memId) ON UPDATE CASCADE
#     );
#'''

#pwith_db = mysql_conn.cursor()
#pwith_db.execute(sql)
#mysql_conn.commit()

#💙 qna 테이블 생성

#sql = '''
# CREATE TABLE QNA
# (
#     QNAID	INT AUTO_INCREMENT PRIMARY KEY,
#     title	    VARCHAR(50) NOT NULL,
#     writer	VARCHAR(10),	
#     curDate	DATE,	
#     content	VARCHAR(500) NOT NULL,	
#     category	INT,	
#     views	    INT DEFAULT 0,	
#     likes     INT DEFAULT 0,
#     FOREIGN KEY (writer)
#     REFERENCES member(memId) ON UPDATE CASCADE
#     );
#'''

#pwith_db = mysql_conn.cursor()
#pwith_db.execute(sql)
#mysql_conn.commit()

# DB는 mysql 터미널에서 CREATE DATABASE pwith_db; 명령어로 만들었고, 위 주석 실행해서 member 테이블 만들었음


