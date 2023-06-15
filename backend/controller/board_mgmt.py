from model.db_mysql import conn_mysql
from datetime import datetime
from flask import Flask, jsonify

class studyPost() :
    
    def __init__(self, type, title, writer, curDate, content, category, likes, views):
        self.type = type
        self.title = title
        self.writer = writer
        self.curDate = curDate
        self.content = content
        self.category = category
        self.likes = likes
        self.views = views

    @staticmethod
    def insertStudy( type, title, writer, curDate, content, category, likes, views):   # insert data
        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()
        
        sql = f"INSERT INTO post ( postType, title, writer, curDate, content, category, likes, views )VALUES ('{int(type)}', '{str(title)}', '{str(writer)}', '{str(curDate)}', '{str(content)}', '{int(category)}', '{int(likes)}', '{int(views)}')"
        done = cursor_db.execute(sql)
        mysql_db.commit() 
        mysql_db.close()
        return done
     
    
    @staticmethod
    def incViews(writer):     #조회수 1씩 증가하는 함수
        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()
        
        sql = f"select views from post, member where postId.writer = member.memId and member.memId = ( %s );"
        cursor_db.execute(sql, writer)
        row = cursor_db.fetchone()
        mysql_db.close()
        if row is None:  # better: if not row
          views = 0
        else:
            views = row[0]
        return views+1
    
    @staticmethod
    def incLikes(writer):        #가입자 1씩 증가하는 함수
        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()
        
        sql = f"select likes from post, member where postId.writer = member.memId and member.memId = (%s);"
        cursor_db.execute(sql, writer)
        row = cursor_db.fetchone()
        mysql_db.close()
        if row is None:  # better: if not row
          joiningP = 0
        else:
            joiningP = row[0]
        return joiningP+1
    
    @staticmethod
    def curdate():  # date 구하는 함수
        now = datetime.now()
        return now.date()
    
    @staticmethod
    def getStudy():
        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()

        sql = "select * from post"
        cursor_db.execute(sql)
        rows = cursor_db.fetchall()
        mysql_db.close()
        # print(rows)
        
        return rows

    @staticmethod
    def findById(id) : # 정윤이 테스트 방식에 맞추어 네 개의 값만 전달함 - 채영

        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()

        sql = f"SELECT * FROM post WHERE postId = {id}"
        cursor_db.execute(sql)
        res = cursor_db.fetchone() # tuple
        mysql_db.close()
        print(res)
        if not res :
            return None

        post = studyPost(res[1], res[2], res[3], res[4], res[5], res[6], res[7])
        return post

    @staticmethod
    def findByWriter(writer) : # 글쓴이로 검색 & 내 글 목록에서 사용

        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()
        
        sql = f"SELECT * FROM post WHERE writer = '{writer}'"
        print('writer로 검색')
        cursor_db.execute(sql)
        posts = cursor_db.fetchall() # tuple의 tuple
        
        mysql_db.close()

        if not posts :
            return None
        
        return posts

    @staticmethod
    def findByTitle(title) : # 제목으로 검색
        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()

        sql = f"SELECT * FROM post WHERE title = '{title}'"

        cursor_db.execute(sql)
        posts = cursor_db.fetchall() # page 만들 시 fetchmany() 사용
        
        mysql_db.close()
        print(posts)
        if not posts :
            return None
        
        return posts


    def getTitle(self) :
        return str(self.title)

    def getContent(self) :
        return str(self.content)

    def getViews(self) :
        return int(self.views)

    #def getTotalP(self) :
    #    return int(self.totalP)
    
    def getCurDate(self) :
        return datetime(self.curDate)
    
    def getWriter(self):
        return str(self.writer)
    
    def getCategory(self):
        return int(self.category)
    
    def getLikes(self):
        return int(self.likes)
    
    def getViews(self):
        return int(self.views)
        
        '''    
    @staticmethod
    def deleteStudy(studyID):
        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()
        
        sql = f"DELETE FROM post WHERE postID = " + studyID
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