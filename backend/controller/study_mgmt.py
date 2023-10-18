from backend.controller import commit, selectAll, selectOne, rollback
from datetime import datetime
from flask import Flask, jsonify

class studyPost() :
    def __init__(self, id, title, writer, curDate, content, likes, views, roomId):
        self.__id = id
        self.__title = title
        self.__writer = writer
        self.__curDate = curDate
        self.__content = content
        self.__likes = likes
        self.__views = views
        self.__roomId = roomId
        
    @property
    def id(self) :
        return self.__id
    @property
    def title(self) :
        return self.__title
    @property
    def writer(self):
        return self.__writer
    @property
    def curDate(self) :
        return self.__curDate
    @property
    def content(self) :
        return self.__content
    @property
    def likes(self):
        return self.__likes
    @property
    def views(self):
        return self.__views
    @property
    def roomId(self):
        return self.__roomId

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
    def getStudy(category):     # study 글 전체를 최신순으로 가져오는 함수
        
        if category <11 :
            sql = f"select study.* from study, studyRoom WHERE study.roomId = studyRoom.id and studyRoom.category ='{int(category)}' ORDER BY study.curDate DESC"
        else :
            sql = f"select * from study ORDER BY curDate DESC"
        
        rows = selectAll(sql)
        
        return rows

    @staticmethod
    def findById(id) : # 게시글 ID로 검색
        sql = f"SELECT * FROM study WHERE id = '{int(id)}'"
     
        res = selectOne(sql) # tuple
   
        print(res)
        if not res :
            return None

        post = studyPost(res[0], res[1], res[2], res[3], res[4], res[5], res[6], res[7])
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
    def findByWriter(writer) : # 글쓴이로 검색

        sql = f"SELECT * FROM study, member WHERE writer = member.id and member.nickname LIKE '%{writer}%' "
        
        posts = selectAll(sql)
        
        if not posts :
            return None
        
        return posts

    @staticmethod
    def findByTitle(title) :

        sql = f"SELECT * FROM study WHERE title LIKE '%{title}%' "

        posts = selectAll(sql)
        print(posts)
        print("sql")
        
        if not posts :
            return None
        
        return posts

    @staticmethod
    def findByWriterId(writer_id) :

        sql = f"SELECT * FROM study WHERE writer = {writer_id} ORDER BY curDate DESC"

        posts = selectAll(sql)
        
        result = []
        for p in posts :
            result.append(studyPost(p[0],p[1],p[2],p[3],p[4],p[5],[6],p[7]))

        return result
    
    @staticmethod
    def updateStudy(postId, content, title):   # study 게시글 내용 수정
        sql = f"UPDATE study SET content = '{str(content)}', title ='{str(title)}' WHERE id = '{str(postId)}'"
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
    def findLike(memId, postId):
        sql = f"select id from studyLike where memberId = '{int(memId)}' and studyId = '{int(postId)}' "
        
        rows = selectOne(sql)
        
        if rows is None:
            return False    # 좋아요 없는 상태
        else:
            return True     # 좋아요 있는 상태
    
    @staticmethod
    def Like(memId, postId):      # toggle like
        
        liked = studyPost.findLike(memId, postId)
        
        if liked is False:
            # insert studyLike
            sql = f"insert into studyLike(memberId, studyId) values ('{(memId)}', '{(postId)}')"
            done = commit(sql)

            studyPost.updateLikes(liked, postId)
           
        else:
            # delete studyLike
            sql = f"delete from studyLike where memberId = '{(memId)}' and studyId = '{(postId)}'"
            done = commit(sql)

            studyPost.updateLikes(liked, postId)
            
    @staticmethod
    def updateLikes(liked, postId):
        if liked is False:
            sql = f"update study set likes = likes +1 where id = '{str(postId)}'"
            done = commit(sql)
        else:
            sql = f"UPDATE study SET likes = likes - 1 WHERE id = '{str(postId)}'"
            update_done = commit(sql)
                  
    def getNStudy(num):     # study 게시글 일부만 가져오기
        sql = f"select id, title from study ORDER BY  RAND() LIMIT {int(num)} "
      
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
    
    def getRoomImage(roomId):   # roomImage studyRoom 에서 받아오기
        sql = f"select image from studyRoom where studyRoom.id = '{str(roomId)}'"
        
        roomImage = selectOne(sql)
        
        return roomImage[0]
    
    
    
    # def getLiked(memId, postId):      # 좋아요 여부 받아오기
    #    sql = f"SELECT liked from liked where memberId = '{str(memId)}' and postId = '{str(postId)}'"
    #    row = selectOne(sql)
    

    def getRoomName(roomId):    # 스터디룸 이름 받아오기
        sql = f"select name from studyRoom where id = '{str(roomId)}'"
        
        row = selectOne(sql)
        
        roomName = row[0]
        return str(roomName)
        
    def insertReplyAlarm(memId, oppId, id):
        sql = f"insert into replyStudyAlarm (memId, oppId, contentId) values ('{memId}', '{oppId}', '{id}')"
        
        done = commit(sql)
        
        return done
        
    def insertStudyAlarm(memId, oppId, id):
        sql = f"insert into studyAlarm (memId, oppId, contentId) values ('{memId}', '{oppId}', '{id}')"
        
        done = commit(sql)
        
        return done
    
    def getLikes(id):
        sql = f"select likes from study where id = '{id}'"
        row = selectOne(sql)
        likes = row[0]
        
        return likes
        