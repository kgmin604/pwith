from backend.model.db_mysql import conn_mysql
from backend.controller import commit, selectAll, selectOne, rollback
from datetime import datetime

class QNAPost() :
    def __init__(self, id, title, writer, content, curDate, category, likes, views):
        self._id = id
        self._title = title
        self._writer = writer
        self._content = content
        self._curDate = curDate
        self._category = category
        self._likes = likes
        self._views = views
        
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
    def findLike(memId, postId):
        sql = f"select id from qnaLike where memberId = '{int(memId)}' and qnaId = '{int(postId)}' "
        
        rows = selectOne(sql)
        
        if rows is None:
            return False    # 좋아요 없는 상태
        else:
            return True     # 좋아요 있는 상태
    
    @staticmethod
    def Like(memId, postId):      # toggle like
        
        liked = QNAPost.findLike(memId, postId)
        
        if liked is False:
            # insert qnaLike
            sql = f"insert into qnaLike(memberId, qnaId) values ('{(memId)}', '{(postId)}')"
            done = commit(sql)

            QNAPost.updateLikes(liked, postId)
           
        else:
            # delete qnaLike
            sql = f"delete from qnaLike where memberId = '{(memId)}' and qnaId = '{(postId)}'"
            done = commit(sql)

            QNAPost.updateLikes(liked, postId)
            
    @staticmethod
    def updateLikes(liked, postId):
        if liked is False:
            sql = f"update qna set likes = likes +1 where id = '{str(postId)}'"
            done = commit(sql)
        else:
            sql = f"UPDATE qna SET likes = likes - 1 WHERE id = '{str(postId)}'"
            update_done = commit(sql)
             
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
    
    @property
    def title(self) :
        return str(self._title)
    @property
    def cContent(self) :
        return self._content
    @property
    def views(self) :
        return self._views
    @property
    def curDate(self) :
        return self._curDate
    @property
    def writer(self):
        return self._writer
    @property
    def category(self):
        return self._category
    @property
    def likes(self):
        return self._likes
    
   # @staticmethod
   # def getLiked(memId, postId):
   #     sql = f"SELECT liked from liked where memberId = '{str(memId)}' and postId = '{str(postId)}'"
    