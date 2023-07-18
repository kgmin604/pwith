from backend.model.db_mysql import conn_mysql
from backend.controller import commit, selectAll, selectOne, rollback
from datetime import datetime

class QNAPost() :
    def __init__(self, id, title, writer, content, curDate, category, likes, views):
        self.id = id
        self.title = title
        self.writer = writer
        self.content = content
        self.curDate = curDate
        self.category = category
        self.likes = likes
        self.views = views
        
    @staticmethod
    def insertQNA(title, writer, curDate, content, category, likes, views):     # qna 글 생성
        
        sql = f"INSERT INTO qna ( title, writer, curDate, content, category, likes, views) VALUES ( '{str(title)}', '{str(writer)}', '{str(curDate)}', '{str(content)}', '{int(category)}','{int(likes)}', '{int(views)}')"
        
        done = commit(sql)

        return done
    
    @staticmethod
    def updateQna(postId, content):   # qna 게시글 내용 수정
        sql = f"UPDATE qna SET content = '{str(content)}' WHERE id = '{str(postId)}'"
        done = commit(sql)
        if done ==0:
            rollback()
            
        return done
    
    @staticmethod
    def deleteQna(qnaID):   # Qna 게시글 삭제
        sql = f"DELETE from qna WHERE id = '{str(qnaID)}'"
        done = commit(sql)
        if done ==0:
            rollback()
        
        return done

    def curdate():  # date 구하는 함수
        now = datetime.now()
        return str(now)
    
    @staticmethod
    def getQNA():   # QNA 게시글 넘겨주는 함수
        sql = "select * from qna order by curDate desc"
        rows = selectAll(sql)
  
        # mysql_db.close()
        return rows
    
    @staticmethod
    def findByWriter(writer) : # 글쓴이로 검색 & 내 글 목록
        sql = f"SELECT * FROM qna WHERE writer = '{writer}' order by curDate desc"

        posts = selectAll(sql) # tuple의 tuple
     
        if not posts :
            return None
        
        return posts
    
    @staticmethod
    def findByTitle(title) : # 제목으로 검색
       
        sql = f"SELECT * FROM qna WHERE title = '{title}' order by curDate desc"

        posts = selectAll(sql) # page 만들 시 fetchmany() 사용
   
        print(posts)
        if not posts :
            return None
        
        return posts
    
    @staticmethod
    def findById(id) : # 게시글 ID로 검색
        sql = f"SELECT * FROM qna WHERE  id = {id}"
        res = selectOne(sql) # tuple
     
        if not res :
            return None

        post = QNAPost(res[0],res[1], res[2], res[3], res[4], res[5], res[6], res[7])
        return post
    
    @staticmethod
    def updateViews(postId):    # 조회수 1 증가

        sql = f"UPDATE  qna  SET views = views+1  WHERE id = '{str(postId)}'"

        done = commit(sql)
        return done
    
    @staticmethod
    def toggleLike(memId, postId):      # toggle like
        sql = f"SELECT qnaLike FROM liked WHERE memberId = '{int(memId)}'  AND postId = '{int(postId)}'"
    
        liked = selectOne(sql)

        if liked is None:
            sql = f"INSERT INTO qnaLike (memberId, postId, liked) VALUES ('{int(memId)}', '{int(postId)}')"
            likeType = 0
            done = commit(sql)
        else:
            liked_value = liked[0]
            if liked_value == True:
                sql = f"UPDATE qnaLike SET qnaLike = False WHERE memberId = '{int(memId)}' AND postId = '{int(postId)}'"
                likeType = 1
                print(likeType)
            else:
                sql = f"UPDATE qnaLike SET qnaLike = True WHERE memberId = '{int(memId)}' AND postId = '{int(postId)}'"
                likeType = 0
                print(likeType)
                
            done = commit(sql)

        QNAPost.updateLikes(postId, likeType)
        
        
    @staticmethod
    def updateLikes(postId, likeType):      # 게시글에 실제 좋아요 수 반영
        if likeType == 1:
            sql = f"UPDATE qna SET likes = likes - 1 WHERE id = '{str(postId)}'"
        elif likeType == 0:
            sql = f"UPDATE qna SET likes = likes + 1 WHERE id = '{str(postId)}'"
        
        done = commit(sql)
        return done
        
    @staticmethod
    def pagenation(page, per_page):     # 게시글 10개씩 페이지네이션 하는 함수
        offset = (page - 1) * per_page  # 페이지의 시작 위치 계산
        

        sql = f"SELECT * FROM qna order by curDate desc LIMIT {per_page} OFFSET {offset}"
        results = selectAll(sql)

        return(results)

    @staticmethod
    def get3QNA():
        sql = "select * from qna ORDER BY curDate desc LIMIT 3"

        rows = selectAll(sql)
       
        return rows
    
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
    
   # @staticmethod
   # def getLiked(memId, postId):
   #     sql = f"SELECT liked from liked where memberId = '{str(memId)}' and postId = '{str(postId)}'"
    