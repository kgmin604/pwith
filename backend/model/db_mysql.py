import pymysql

# MYSQL_HOST = '192.168.165.10'
MYSQL_HOST = 'localhost'
MYSQL_PORT = 3306
# MYSQL_USER = 'pwith'
MYSQL_USER = 'root'
# MYSQL_PW = '1234'
MYSQL_PW = '0604'
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


# CREATE TABLE STUDY
# (
#     studyID	INT,
#     title	    VARCHAR(50),
#     writer	VARCHAR(10),	
#     curDate	DATE,	
#     content	VARCHAR(500),	
#     category	VARCHAR(20),	
#     views	    INT,	
#     joiningP	INT,	
#     totalP	INT	DEFAULT 50,
#     FOREIGN KEY (writer)
#     REFERENCES member(memName) ON UPDATE CASCADE


## !!!!!!!!!!!!!!!!!!!!!!!!! 테스트용 (날짜, 카테고리, 가입인원 등등 빠짐) !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
# sql = '''
# CREATE TABLE study
# (
#     studyID	INT,
#     title	    VARCHAR(50),
#     content	VARCHAR(500),		
#     views	    INT,	
#     totalP	INT	DEFAULT 50
#);
# '''

#pwith_db = mysql_conn.cursor()
#pwith_db.execute(sql)
#mysql_conn.commit()
#!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!여기까지 (느낌표 안에 있는 부분만 주석 해제하고 실행해주세여~) - 정윤 

# DB는 mysql 터미널에서 CREATE DATABASE pwith_db; 명령어로 만들었고, 위 주석 실행해서 member 테이블 만들었음


