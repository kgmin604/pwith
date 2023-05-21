from model.db_mysql import conn_mysql
from datetime import datetime
from flask import Flask, jsonify

class studyPost() :
    
    def __init__(self, title, writer, curDate, content, category, views, joiningP, totalP):
        self.title = title
        self.writer = writer
        self.curDate = curDate
        self.content = content
        self.category = category
        self.views = views
        self.joningP = joiningP
        self.totalP = totalP
    
    
    @staticmethod
    def insertStudy( title, writer, curDate, content, category, views, joiningP, totalP):   # insert data
        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()
        
        sql = f"INSERT INTO study ( title, writer, curDate, content, category, views, joiningP, totalP )VALUES ('{str(title)}', '{str(writer)}', '{str(curDate)}', '{str(content)}', '{int(category)}', '{int(views)}', '{int(joiningP)}', '{int(totalP)}')"
        done = cursor_db.execute(sql)
        mysql_db.commit() 
        return done
        
    '''    
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
        '''
     
    
    @staticmethod
    def incViews(writer):     #조회수 1씩 증가하는 함수
        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()
        
        sql = f"select views from study, member where studyID = member.memId and member.memId = ( %s );"
        cursor_db.execute(sql, writer)
        row = cursor_db.fetchone()
        if row is None:  # better: if not row
          views = 0
        else:
            views = row[0]
        return views
    
    @staticmethod
    def incJoningP(writer):        #가입자 1씩 증가하는 함수
        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()
        
        sql = f"select joiningP from study, member where studyID = member.memId and member.memId = (%s);"
        cursor_db.execute(sql, writer)
        row = cursor_db.fetchone()
        if row is None:  # better: if not row
          joiningP = 0
        else:
            joiningP = row[0]
        return joiningP
    
    @staticmethod
    def curdate():  # date 구하는 함수
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
    def findById(id) : # 정윤이 테스트 방식에 맞추어 네 개의 값만 전달함 - 채영

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

    @staticmethod
    def findByWriter(writer) : # 글쓴이로 검색 & 내 글 목록에서 사용 - 채영

        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()
        
        sql = f"SELECT * FROM study WHERE writer = '{writer}'"

        cursor_db.execute(sql)
        posts = cursor_db.fetchall() # tuple의 tuple

        if not posts :
            return None
            
        return posts

    @staticmethod
    def findByTitle(title) : # 제목으로 검색
        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()

        sql = f"SELECT * FROM study WHERE title = '{title}'"

        cursor_db.execute(sql)
        posts = cursor_db.fetchall() # page 만들 시 fetchmany() 사용

        if not posts :
            return None
        
        return posts


    # getter 함수 만듦 - 채영
    def getTitle(self) :
        return str(self.title)

    def getContent(self) :
        return str(self.content)

    def getViews(self) :
        return int(self.views)

    def getTotalP(self) :
        return int(self.totalP)