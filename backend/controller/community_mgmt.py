from model.db_mysql import conn_mysql
from datetime import datetime

class QNAPost() :
    def __init__(self, postType, title, writer, content, curDate, category, likes, views):
        self.postType = postType
        self.title = title
        self.writer = writer
        self.content = content
        self.curDate = curDate
        self.category = category
        self.likes = likes
        self.views = views
        
    @staticmethod
    def insertQNA(postType, title, writer, curDate, content, category, likes, views):    # insert data
        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()
        
        sql = f"INSERT INTO post ( postType, title, writer, curDate, content, category, likes, views )VALUES ('{int(postType)}', '{str(title)}', '{str(writer)}', '{str(curDate)}', '{str(content)}', '{int(category)}', '{int(likes)}', '{int(views)}')"
        done = cursor_db.execute(sql)
        mysql_db.commit() 
        mysql_db.close()
        return done
    
    @staticmethod
    def deleteQNA(postId):
        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()
        
        sql = f"DELETE FROM post WHERE postID = '{str(postId)}'"
        done = cursor_db.execute(sql)
        if done ==0:
            mysql_db.rollback()
        
        mysql_db.commit() 
        mysql_db.close()
        
        return done
        
    @staticmethod
    def updateQNA(postId, content):
        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()
        
        sql = f"UPDATE post SET content = '{str(content)}' WHERE postId = '{str(postId)}'"
        done = cursor_db.execute(sql)
        if done ==0:
            mysql_db.rollback()
            
        mysql_db.commit() 
        mysql_db.close()
        
        return done
    

    def curdate():  # date 구하는 함수
        now = datetime.now()
        return str(now)
    
    @staticmethod
    def getQNA():   # QNA 게시글 넘겨주는 함수
        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()
        
        sql = "select * from post where postType = 1 order by curDate desc"
        cursor_db.execute(sql)
        rows = cursor_db.fetchall()
  
        # mysql_db.close()
        return rows
    
    @staticmethod
    def findByWriter(writer, postType) : # 글쓴이로 검색 & 내 글 목록

        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()
        
        sql = f"SELECT * FROM post WHERE writer = '{writer}' and postType = {postType} order by curDate desc"
        
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

        sql = f"SELECT * FROM post WHERE title = '{title}' and postType = {postType} order by curDate desc"

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

        post = QNAPost(res[1], res[2], res[3], res[4], res[5], res[6], res[7], res[8])
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
    def toggleLike(memId, postId):
        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()

        sql = "SELECT liked FROM liked WHERE memberId = %s AND postId = %s"
        cursor_db.execute(sql, (str(memId), str(postId)))
        liked = cursor_db.fetchone()
        print(liked)

        if liked is None:
            sql = "INSERT INTO liked (memberId, postId, liked) VALUES (%s, %s, %s)"
            likeType = 0
            cursor_db.execute(sql, (str(memId), str(postId), True))
            mysql_db.commit()
        else:
            liked_value = liked[0]
            if liked_value == True:
                sql = "UPDATE liked SET liked = False WHERE memberId = %s AND postId = %s"
                likeType = 1
                print(likeType)
            else:
                sql = "UPDATE liked SET liked = True WHERE memberId = %s AND postId = %s"
                likeType = 0
                print(likeType)
            cursor_db.execute(sql, (str(memId), str(postId)))
            mysql_db.commit()
            mysql_db.close()

        QNAPost.updateLikes(postId, likeType)
        
        
    @staticmethod
    def updateLikes(postId, likeType):
        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()

        if likeType == 1:
            sql = f"UPDATE post SET likes = likes - 1 WHERE postId = '{str(postId)}'"
        elif likeType == 0:
            sql = f"UPDATE post SET likes = likes + 1 WHERE postId = '{str(postId)}'"
        cursor_db.execute(sql)
        mysql_db.commit()

        mysql_db.close()
        
    @staticmethod
    def pagenation(page, per_page):     # 게시글 10개 씩 페이지네이션 하는 함수
        offset = (page - 1) * per_page  # 페이지의 시작 위치 계산
        
        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()

        sql = f"SELECT * FROM post where postType = 0 LIMIT {per_page} OFFSET {offset}"
        cursor_db.execute(sql)
        results = cursor_db.fetchall()
        mysql_db.close()
        
        return(results)

    @staticmethod
    def get3QNA():
        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()
        
        sql = "select * from post where postType = 1 ORDER BY curDate desc LIMIT 3"
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

    @staticmethod
    def getViews(id) :
        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()

        sql = f"SELECT views from post where postId = '{str(id)}'"

        cursor_db.execute(sql)
        row = cursor_db.fetchone() 
        print(row[0])
        # print("likes = "+str(likes))
        
        if row is not None:
            views = row[0]
            mysql_db.close()
            return int(views)
        else:
            mysql_db.close()
            return 0
    
    def getCurDate(self) :
        return str(self.curDate)
    
    def getWriter(self):
        return str(self.writer)
    
    def getCategory(self):
        return int(self.category)
    
    @staticmethod
    def getLikes(id):
        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()

        sql = f"SELECT likes from post where postId = '{str(id)}'"

        cursor_db.execute(sql)
        row = cursor_db.fetchone() 
        print(row[0])
        # print("likes = "+str(likes))
        
        if row is not None:
            likes = row[0]
            mysql_db.close()
            return int(likes)
        else:
            mysql_db.close()
            return 0
    
    @staticmethod
    def getLiked(memId, postId):
        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()

        sql = f"SELECT liked from liked where memberId = '{str(memId)}' and postId = '{str(postId)}'"

        cursor_db.execute(sql)
        row = cursor_db.fetchone() 
        # print(row)
        if row is not None:
            likes = row[0]
            mysql_db.close()
            return int(likes)
        else:
            mysql_db.close()
            return 0
    