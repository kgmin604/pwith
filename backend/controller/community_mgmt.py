from model.db_mysql import conn_mysql
from datetime import datetime

class QNAPost() :
    def __init__(self, postType, title, writer, content, curDate, category, likes, liked, views):
        self.postType = postType
        self.title = title
        self.writer = writer
        self.content = content
        self.curDate = curDate
        self.category = category
        self.likes = likes
        self.liked = liked
        self.views = views
        
    @staticmethod
    def insertQNA(postType, title, writer, curDate, content, category, likes, views):    # insert data
        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()
        
        sql = f"INSERT INTO post ( postType, title, writer, curDate, content, category, views, likes )VALUES ('{int(postType)}', '{str(title)}', '{str(writer)}', '{str(curDate)}', '{str(content)}', '{int(category)}', '{int(views)}', '{int(likes)}')"
        done = cursor_db.execute(sql)
        mysql_db.commit() 
        mysql_db.close()
        return done
    
    @staticmethod
    def incViews(writer):     #조회수 1씩 증가하는 함수
        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()
        
        sql = f"select views from post, member where QNAID = member.memId and member.memId = ( %s );"
        cursor_db.execute(sql, writer)
        row = cursor_db.fetchone()
        mysql_db.close()
        if row is None:  # better: if not row
          views = 0
        else:
            views = row[0]
        mysql_db.close()
        return views+1
    
    @staticmethod
    def incLikes(writer):     #좋아요 1씩 증가하는 함수
        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()
        
        sql = f"select likes from post, member where QNAID = member.memId and member.memId = ( %s );"
        cursor_db.execute(sql, writer)
        row = cursor_db.fetchone()
        mysql_db.close()
        if row is None:  # better: if not row
          likes = 0
        else:
            likes = row[0]
            
        mysql_db.close()
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
  
        mysql_db.close()
        return rows
    
    @staticmethod
    def findByWriter(writer, postType) : # 글쓴이로 검색 & 내 글 목록

        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()
        
        sql = f"SELECT * FROM post WHERE writer = '{writer}' and postType = {postType}"
        
        cursor_db.execute(sql)
        posts = cursor_db.fetchall() # tuple의 tuple
        
        mysql_db.close()

        if not posts :
            return None
        
        return posts
    
    @staticmethod
    def findByTitle(title, postType) : # 제목으로 검색
        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()

        sql = f"SELECT * FROM post WHERE title = '{title}' and postType = {postType}"

        cursor_db.execute(sql)
        posts = cursor_db.fetchall() # page 만들 시 fetchmany() 사용
        
        mysql_db.close()
        print(posts)
        if not posts :
            return None
        
        return posts
    
    @staticmethod
    def findById(id) : # 게시글 ID로 검색

        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()

        sql = f"SELECT * FROM post WHERE postType = 1 and postId = {id}"
        cursor_db.execute(sql)
        res = cursor_db.fetchone() # tuple
        mysql_db.close()
        print(res)
        if not res :
            return None

        post = QNAPost(1, res[2], res[3], res[4], res[5], res[6], res[7], res[8], res[9])
        return post
    
    @staticmethod
    def updateViews(postId):
        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()

        sql = f"UPDATE  post  SET views = views+1  WHERE postId = '{str(postId)}'"

        cursor_db.execute(sql)
        mysql_db.commit()
        
        mysql_db.close()
        return 'view inc'

    @staticmethod
    def get3QNA():
        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()
        
        sql = "select * from post where postType = 1 ORDER BY curDate LIMIT 3"
        cursor_db.execute(sql)
        rows = cursor_db.fetchall()
        print(rows)
        mysql_db.close()
        return rows
    
    @staticmethod
    def getFormattedDate(curDate):
        formatted_datetime = curDate.strftime("%Y-%m-%d %H:%M:%S")
        return formatted_datetime  # 출력 예: 2023-06-21 14:30:45
    
    def getTitle(self) :
        return str(self.title)

    def getContent(self) :
        return str(self.content)

    def getViews(self) :
        return int(self.views)
    
    def getCurDate(self) :
        return str(self.curDate)
    
    def getWriter(self):
        return str(self.writer)
    
    def getCategory(self):
        return int(self.category)
    
    def getLikes(self):
        return int(self.likes)
    
    def getViews(self):
        return int(self.views)
    
    def getLiked(self):
        return bool(self.liked)