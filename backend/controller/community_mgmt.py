from backend.model.db_mysql import conn_mysql
from backend.controller import commit, selectAll, selectOne, rollback
from datetime import datetime

class QNAPost() :
    def __init__(self, id, title, writer, curDate, content, category, likes, views):
        self.__id = id
        self.__title = title
        self.__writer = writer
        self.__curDate = curDate
        self.__content = content
        self.__likes = likes
        self.__views = views
        self.__category = category
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
    def content(self) :
        return self.__content
    @property
    def curDate(self) :
        return self.__curDate
    @property
    def category(self):
        return self.__category
    @property
    def likes(self):
        return self.__likes
    @property
    def views(self) :
        return self.__views
        
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
        sql = f"SELECT * FROM qna, member WHERE qna.writer = member.id and member.nickname LIKE '%{writer}%' order by curDate desc"

        posts = selectAll(sql) # tuple의 tuple
     
        if not posts :
            return None
        
        return posts

    @staticmethod
    def findByWriterId(writer_id) :

        sql = f"SELECT * FROM qna, member WHERE writer= membr.id and member.nickname = '{str(writer_id)}' ORDER BY curDate DESC"

        posts = selectAll(sql)
        
        result = []
        for p in posts :
            result.append(QNAPost(p[0],p[1],p[2],p[3],p[4],p[5],p[6],p[7]))
        
        return result

    @staticmethod
    def findByTitle(title) : # 제목으로 검색
       
        sql = f"SELECT * FROM qna WHERE title LIKE '%{title}%' order by curDate desc"

        posts = selectAll(sql) # page 만들 시 fetchmany() 사용
        
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

    
   # @staticmethod
   # def getLiked(memId, postId):
   #     sql = f"SELECT liked from liked where memberId = '{str(memId)}' and postId = '{str(postId)}'"
    