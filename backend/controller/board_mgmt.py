from model.db_mysql import conn_mysql
from datetime import datetime
from flask import Flask, jsonify

class studyPost() :
    
    def __init__(self, postType, title, writer, content, curDate, likes, views):
        self.postType = postType
        self.title = title
        self.writer = writer
        self.curDate = curDate
        self.content = content
        self.likes = likes
        self.views = views

    @staticmethod
    def insertStudy(postType, title, writer, curDate, content, likes, views, roomId):
        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()
        
        sql = f"INSERT INTO post ( postType, title, writer, curDate, content, likes, views, roomId) VALUES ('{int(postType)}', '{str(title)}', '{str(writer)}', '{str(curDate)}', '{str(content)}', '{int(likes)}', '{int(views)}', '{int(roomId)}')"
        
        done = cursor_db.execute(sql)

        mysql_db.commit() 

        mysql_db.close()

        return done
     
    @staticmethod
    def getMyStudyList(writer):     # 내가 만든 스터디룸 리스트 반환하는 함수
        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()

        sql = f"select roomId, roomName from studyRoom where leader = '{writer}'"

        cursor_db.execute(sql)

        rows = cursor_db.fetchall()

        mysql_db.close()
        #print(rows)
        
        return rows
    
    @staticmethod
    def curdate():  # date 구하는 함수
        now = datetime.now()
        return str(now)
    
    @staticmethod
    def getStudy():
        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()

        sql = "select * from post where postType = 0"
        cursor_db.execute(sql)
        rows = cursor_db.fetchall()
        mysql_db.close()
        # print(rows)
        
        return rows

    @staticmethod
    def findById(id) : # 게시글 ID로 검색

        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()

        sql = f"SELECT * FROM post WHERE postType = 0 and postId = {id}"
        cursor_db.execute(sql)
        res = cursor_db.fetchone() # tuple
        mysql_db.close()
        print(res)
        if not res :
            return None

        post = studyPost(res[1], res[2], res[3], res[4], res[5], res[7], res[8])
        return post

    @staticmethod
    def findRoomId(id) : # 스터디글에 해당하는 스터디룸 찾기
        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()

        sql = f"SELECT roomId FROM post WHERE postType = 0 and postId = {id}"

        cursor_db.execute(sql)

        roomId = cursor_db.fetchone()[0]

        mysql_db.close()
        
        print(roomId)
        if not roomId :
            return None

        return roomId

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
    def updateViews(postId):
        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()

        sql = f"UPDATE  post  SET views = views+1  WHERE postId = '{str(postId)}'"

        cursor_db.execute(sql)
        mysql_db.commit()
        
        mysql_db.close()
        return 'view inc'
    
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


    def getTitle(self) :
        return str(self.title)

    def getContent(self) :
        return str(self.content)

    def getViews(self) :
        return int(self.views)

    def getTotalP() :   # totalP studyRoom 에서 받아오기 (roomId 같은 걸로)
        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()

        sql = f"SELECT totalP from studyRoom, post where studyRoom.roomId = post.postId"

        cursor_db.execute(sql)
        totalP = cursor_db.fetchone() 
        
        mysql_db.close()
        return int(totalP)
    
    def getCurDate(self) :
        return str(self.curDate)
    
    def getWriter(self):
        return str(self.writer)
    
    def getCategory(self):
        return int(self.category)
    
    def getLikes(id):
        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()

        sql = f"SELECT likes from post where postId = '{str(id)}'"

        cursor_db.execute(sql)
        row = cursor_db.fetchone() 
        # print(row)
        likes = row[0]
        # print("likes = "+str(likes))
        
        mysql_db.close()
        return int(likes)
    
    def getViews(self):
        return int(self.views)
    
    
    def getFormattedDate(curDate):
        if isinstance(curDate, str):
            curDate = datetime.strptime(curDate, "%Y-%m-%d %H:%M:%S")
        formatted_datetime = curDate.strftime("%Y-%m-%d %H:%M:%S")
        return formatted_datetime
    
    def getNStudy():
        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()

        sql = "select postId, title from post where postType = 0 ORDER BY curDate DESC LIMIT 5 "
        cursor_db.execute(sql)
        rows = cursor_db.fetchall()
        mysql_db.close()
        # print(rows)
        
        return rows
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

        studyPost.updateLikes(postId, likeType)
        
        
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
        
    def getRoomId(postId):
        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()
        
        sql = f"select roomId from post where postId = '{str(postId)}'"
        cursor_db.execute(sql)
        row = cursor_db.fetchone()
        mysql_db.close()
        
        roomId = row[0]
        return int(roomId)
    
    def getRoomName(roomId):
        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()
        
        sql = f"select roomName from studyRoom where roomId = '{str(roomId)}'"
        cursor_db.execute(sql)
        row = cursor_db.fetchone()
        mysql_db.close()
        
        roomName = row[0]
        return str(roomName)
        
        
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