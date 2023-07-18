from backend.model.db_mysql import conn_mysql
from backend.controller import commit, selectAll, selectOne, rollback
from datetime import datetime
from flask import Flask, jsonify

class studyPost() :
    
    def __init__(self, id, title, writer, curDate, content, category, likes, views, roomId):
        self.id = id
        self.title = title
        self.writer = writer
        self.curDate = curDate
        self.content = content
        self.category = category
        self.likes = likes
        self.views = views
        self.roomId = roomId

    @staticmethod
    def insertStudy(title, writer, curDate, content, likes, views, roomId):     #스터디 글 생성
        
        sql = f"INSERT INTO study (  title, writer, curDate, content, likes, views, roomId) VALUES ( '{str(title)}', '{str(writer)}', '{str(curDate)}', '{str(content)}', '{int(likes)}', '{int(views)}', '{int(roomId)}')"
        
        done = commit(sql)

        return done
     
    @staticmethod
    def getMyStudyList(writer):     # 내가 만든 스터디룸 리스트 반환하는 함수
        sql = f"select id, name from studyRoom where leader = '{int(writer)}'"

        rows = selectAll(sql)

        return rows
    
    @staticmethod
    def curdate():  # date 구하는 함수
        now = datetime.now()
        return str(now)
    
    @staticmethod
    def getStudy():     # study 글 전체를 최신순으로 가져오는 함수
        sql = "select * from study ORDER BY curDate DESC"
        
        rows = selectAll(sql)
        
        return rows

    @staticmethod
    def findById(id) : # 게시글 ID로 검색

        
        sql = f"SELECT * FROM study WHERE id = {id}"
     
        res = selectOne # tuple
   
        print(res)
        if not res :
            return None

        post = studyPost(res[1], res[2], res[3], res[4], res[5], res[7], res[8])
        return post

    @staticmethod
    def findRoomId(id) : # 하나의 스터디글에 해당하는 스터디룸 찾기
        sql = f"SELECT roomId FROM study WHERE id = {id}"

        roomId = selectOne(sql)[0]

        # print(roomId)
        if not roomId :
            return None

        return roomId

    @staticmethod
    def findByWriter(writer) : # 글쓴이로 검색 & 내 글 목록


        sql = f"SELECT * FROM study WHERE writer LIKE '%{writer}%' "
        
        posts = selectAll(sql) # tuple의 tuple
        
        if not posts :
            return None
        
        return posts

    @staticmethod
    def findByTitle(title) : # 제목으로 검색
        sql = f"SELECT * FROM study WHERE title LIKE '%{title}%' "

        posts = selectAll(sql) # page 만들 시 fetchmany() 사용
        
        print(posts)
        if not posts :
            return None
        
        return posts
    
    @staticmethod
    def updateStudy(postId, content):   # study 게시글 내용 수정
        sql = f"UPDATE study SET content = '{str(content)}' WHERE id = '{str(postId)}'"
        done = commit(sql)
        if done ==0:
            rollback()
            
        return done
    
    @staticmethod
    def deleteStudy(studyID):   # study 게시글 삭제
        sql = f"DELETE from study WHERE id = '{str(studyID)}'"
        done = commit(sql)
        if done ==0:
            rollback()
        
        return done
    
    @staticmethod
    def updateViews(postId):    # 조회수 1 증가

        sql = f"UPDATE  study  SET views = views+1  WHERE id = '{str(postId)}'"

        done = commit(sql)
        return done
    
    @staticmethod
    def toggleLike(memId, postId):      # toggle like
        sql = f"SELECT liked FROM studyLike WHERE memberId = '{int(memId)}'  AND postId = '{int(postId)}'"
    
        liked = selectOne(sql)

        if liked is None:
            sql = f"INSERT INTO studyLike (memberId, postId, liked) VALUES ('{int(memId)}', '{int(postId)}')"
            likeType = 0
            done = commit(sql)
        else:
            liked_value = liked[0]
            if liked_value == True:
                sql = "UPDATE liked SET studyLike = False WHERE memberId = '{int(memId)}' AND postId = '{int(postId)}'"
                likeType = 1
                print(likeType)
            else:
                sql = "UPDATE liked SET studyLike = True WHERE memberId = '{int(memId)}' AND postId = '{int(postId)}'"
                likeType = 0
                print(likeType)
                
            done = commit(sql)

        studyPost.updateLikes(postId, likeType)
        
        
    @staticmethod
    def updateLikes(postId, likeType):      # 게시글에 실제 좋아요 수 반영
        if likeType == 1:
            sql = f"UPDATE study SET likes = likes - 1 WHERE id = '{str(postId)}'"
        elif likeType == 0:
            sql = f"UPDATE study SET likes = likes + 1 WHERE id = '{str(postId)}'"
        
        done = commit(sql)
        return done
        
    def getNStudy(num):     # study 게시글 일부만 가져오기
        sql = f"select id, title from study ORDER BY curDate DESC LIMIT {int(num)} "
      
        rows = selectAll(sql)
        
        return rows
    
    @staticmethod
    def pagenation(page, per_page):     # 게시글 10개씩 페이지네이션 하는 함수
        offset = (page - 1) * per_page  # 페이지의 시작 위치 계산
        

        sql = f"SELECT * FROM study order by curDate desc LIMIT {per_page} OFFSET {offset}"
        results = selectAll(sql)

        return(results)
    
    def getTotalP(roomId) :   # totalP studyRoom 에서 받아오기 (roomId 같은 걸로)
        sql = f"SELECT totalP from studyRoom where studyRoom.id = '{str(roomId)}'"

        totalP = selectOne(sql)
        
        return int(totalP[0])
    
    def getJoinP(roomId):      # joinP studyRoom 에서 받아오기
        sql = f"SELECT joinP from studyRoom where studyRoom.id = '{str(roomId)}'"

        joinP = selectOne(sql)
        
        return int(joinP[0])
    

    def getTitle(self) :
        return str(self.title)

    def getContent(self) :
        return str(self.content)

    def getCurDate(self) :
        return str(self.curDate)
    
    def getWriter(self):
        return str(self.writer)
    
    def getLikes(self):
        return int(self.likes)
    
    def getViews(self):
        return int(self.views)
    
    # def getLiked(memId, postId):      # 좋아요 여부 받아오기
    #    sql = f"SELECT liked from liked where memberId = '{str(memId)}' and postId = '{str(postId)}'"
    #    row = selectOne(sql)
    
    def getFormattedDate(curDate):      # 날짜 포맷 상세 시간까지
        if isinstance(curDate, str):
            curDate = datetime.strptime(curDate, "%Y-%m-%d %H:%M:%S")
        formatted_datetime = curDate.strftime("%Y-%m-%d %H:%M:%S")
        return formatted_datetime
    
    def mainFormattedDate(curDate):     # 날짜 포맷 월/일 만
        if isinstance(curDate, str):
            curDate = datetime.strptime(curDate, "%Y-%m-%d %H:%M:%S")
        formatted_date = curDate.strftime("%m-%d")
        return formatted_date
    

    def getRoomName(roomId):    # 스터디룸 이름 받아오기
        
        sql = f"select roomName from studyRoom where roomId = '{str(roomId)}'"
        
        row = selectOne(sql)
        
        roomName = row[0]
        return str(roomName)
        
        
        