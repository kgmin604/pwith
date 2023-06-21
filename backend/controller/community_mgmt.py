from model.db_mysql import conn_mysql
from datetime import datetime

class QNAPost() :
    def __init__(self, postType, title, writer, curDate, content, category, likes, views):
        self.postTyep = postType
        self.title = title
        self.writer = writer
        self.curDate = curDate
        self.content = content
        self.category = category
        self.views = views
        self.likes = likes
        
    @staticmethod
    def insertQNA(postType, title, writer, curDate, content, category, likes, views):    # insert data
        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()
        
        sql = f"INSERT INTO post ( postType, title, writer, curDate, content, category, views, likes )VALUES ('{int(postType)}', '{str(title)}', '{str(writer)}', '{str(curDate)}', '{str(content)}', '{int(category)}', '{int(views)}', '{int(likes)}')"
        done = cursor_db.execute(sql)
        mysql_db.commit() 
        return done
    
    @staticmethod
    def incViews(writer):     #조회수 1씩 증가하는 함수
        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()
        
        sql = f"select views from post, member where QNAID = member.memId and member.memId = ( %s );"
        cursor_db.execute(sql, writer)
        row = cursor_db.fetchone()
        if row is None:  # better: if not row
          views = 0
        else:
            views = row[0]
        return views+1
    
    @staticmethod
    def incLikes(writer):     #좋아요 1씩 증가하는 함수
        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()
        
        sql = f"select likes from post, member where QNAID = member.memId and member.memId = ( %s );"
        cursor_db.execute(sql, writer)
        row = cursor_db.fetchone()
        if row is None:  # better: if not row
          likes = 0
        else:
            likes = row[0]
        return likes+1
        

    def curdate():  # date 구하는 함수
        now = datetime.now()
        return str(now)
    
    @staticmethod
    def getQNA():   # QNA 게시글 넘겨주는 함수
        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()
        
        sql = "select * from post where postType = 1"
        cursor_db.execute(sql)
        rows = cursor_db.fetchall()
  
        
        return rows