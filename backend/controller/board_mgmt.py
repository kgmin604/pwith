from model.db_mysql import conn_mysql
from datetime import datetime
from flask import Flask, jsonify

class studyPost() :
    """
    def __init__(self, studyID, title, writer, curDate, content, category, views, joiningP, totalP):
        self.studyID = studyID
        self.title = title
        self.writer = writer
        self.curDate = curDate
        self.content = content
        self.category = category
        self.views = views
        self.joningP = joiningP
        self.totalP = totalP
    
    
    @staticmethod
    def insertStudy(studyID, title, writer, curDate, content, category, views, joiningP, totalP):
        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()
        
        sql = f"INSERT INTO study VALUES ('{studyID}', '{str(title)}', '{str(writer)}', '{curDate}', '{str(content)}', '{str(category)}', '{views}', '{joiningP}', '{totalP}')"
        cursor_db.execute(sql)
        mysql_db.commit() 
        
    @staticmethod
    def deleteStudy(studyID):
        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()
        
        sql = f"DELETE FROM study WHERE studyID = " + studyID
        cursor_db.execute(sql)
        mysql_db.commit() 
        
    @staticmethod
    def updateStudy(studyID, title, curDate, content, views, category, joiningP, totalP):
        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()
        
        sql = f"UPDATE study set title = " +title + "curDate = " + curDate + "content = " + content+ "views =" + views +"category = "+category+"joiningP = "+joiningP +"totalP = "+ totalP +  "WHERE studyID = " + studyID
        cursor_db.execute(sql)
        mysql_db.commit() 
        """
    
    # 테스트용 !!!!!!!!!!!!!!!!!!!!!!
    def __init__(self, studyID, title, content, views, totalP):
        self.studyID = studyID
        self.title = title
        self.content = content
        self.views = views
        self.totalP = totalP
        
    # 테스트용 네 개 필드만 채우기
    @staticmethod
    def insertStudy(studyID, title, content, views, totalP):
        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()
        
        # sql = f"INSERT INTO study ( studyID, title, content, views ) VALUES ( %s, %s, %s, %s);"
        sql = f"INSERT INTO study ( studyID, title, content, views ) VALUES ( {int(studyID)}, '{title}', '{content}', {int(views)});"
        # print(sql)
        # val = (studyID, title, content, views)
        
        # cursor_db.execute(sql, val)
        done = cursor_db.execute(sql)
        mysql_db.commit()
        return done
        
    @staticmethod
    def incIndex(id):       #인덱스 1씩 증가하는 함수
        return id+1
    
    @staticmethod
    def incView(views):     #조회수 1씩 증가하는 함수
        return views+1
    
    @staticmethod
    def incJoningP(joningP):        #가입자 1씩 증가하는 함수
        return joningP+1
    
    @staticmethod
    def curdate():
        now = datetime.now()
        return now.date()
    
    @staticmethod
    def getStudy():
        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()
        
        sql = "select * from study"
        cursor_db.execute(sql)
        rows = cursor_db.fetchall()
        # print(rows)
        # mysql_db.commit() # table에 변경 사항 없으면 commit() 없어도 되는 것으로 알고 있습니다! - 채영
        
        
        return rows

    @staticmethod
    def findById(id) : # 정윤 테스트 방식 맞추어 네 개의 값만 전달 - 채영

        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()

        sql = f"SELECT * FROM study WHERE studyId = {id}"
        cursor_db.execute(sql)
        res = cursor_db.fetchone() # tuple
        print(res)
        if not res :
            return None

        post = studyPost(res[0], res[1], res[4], res[6], res[8])
        return post

    # getter 함수 만듦 - 채영
    def getTitle(self) :
        return str(self.title)

    def getContent(self) :
        return str(self.content)

    def getViews(self) :
        return int(self.views)

    def getTotalP(self) :
        return int(self.totalP)