from backend.controller import commit, commitAndGetId, selectAll, selectOne
import pymysql

class Portfolio() :
    
    def __init__(self, id, mento, brief, mentoPic, content, curDate, tuition, duration, isOpen, isDeleted, score):
        self.__id = id
        self.__mento = mento
        self.__brief = brief
        self.__mentoPic = mentoPic
        self.__content = content
        self.__curDate = curDate
        self.__tuition = tuition
        self.__duration = duration
        self.__isOpen = isOpen
        self.__isDeleted = isDeleted
        self.__score = score
    @property
    def id(self) :
        return self.__id
    @property
    def mento(self) :
        return self.__mento
    @property
    def brief(self) :
        return self.__brief
    @property
    def mentoPic(self) :
        return self.__mentoPic
    @property
    def content(self) :
        return self.__content
    @property
    def curDate(self) :
        return self.__curDate
    @property
    def tuition(self) :
        return self.__tuition
    @property
    def duration(self) :
        return self.__duration
    @property
    def isOpen(self) :
        return self.__isOpen
    @property
    def isDeleted(self) :
        return self.__isDeleted
    @property
    def score(self) :
        return self.__score

    @staticmethod
    def existsById(id) : # 글이 존재하는지
        sql = f"SELECT EXISTS (SELECT id FROM portfolio WHERE id = {id} and isDeleted = false)"

        result = selectOne(sql)[0]

        return True if result == 1 else False

    @staticmethod
    def existsByMentoId(id) : # 본인 글이 존재하는지
        sql = f"SELECT EXISTS (SELECT id FROM portfolio WHERE mento = {id} and isDeleted = false)"

        result = selectOne(sql)[0]

        return True if result == 1 else False

    @staticmethod
    def save(mentoId, mentoPic, brief, content, date, tuition, duration, subjects) :

        sql1 = f"INSERT INTO portfolio(mento, mentoPic, brief, content, curDate, tuition, duration) VALUES ({mentoId}, '{mentoPic}', '{brief}', '{content}', '{date}', {tuition}, {duration})"

        try :
            portfolioId = commitAndGetId(sql1)
        except pymysql.err.IntegrityError as ex:
            return 0

        for subject in subjects :

            sql2 = f"INSERT INTO portfolioSubject(portfolio, subject) VALUES({portfolioId}, {subject})"

            done = commit(sql2)

        return done

    @staticmethod
    def findPaging(page=0) : # 전체 목록 조회 + 페이징
        sql = f'''
            SELECT p.id, m.memId, m.nickname, p.mentoPic, p.brief, p.tuition, p.duration, p.score, group_concat(subject)
            FROM portfolio p JOIN portfolioSubject ps ON p.id=ps.portfolio JOIN member m ON p.mento=m.id
            WHERE p.isOpen = true AND p.isDeleted = false
            GROUP BY p.id
            ORDER BY p.curDate DESC
            LIMIT {page}, 12
            '''
        result = selectAll(sql)

        return result

    @staticmethod
    def searchByMento(value, page=0) : # 닉네임으로 검색 + 페이징

        sql =  f'''
            SELECT p.id, m.memId, m.nickname, p.mentoPic, p.brief, p.tuition, p.duration, p.score, group_concat(subject)
            FROM portfolio p JOIN portfolioSubject ps ON p.id=ps.portfolio JOIN member m ON p.mento=m.id 
            WHERE p.isOpen = true AND p.isDeleted = false AND m.nickname LIKE '%{value}%'
            GROUP BY p.id
            ORDER BY p.curDate DESC
            LIMIT {page}, 12
            '''
        result = selectAll(sql)
        
        return result

    @staticmethod
    def findById(id) : # 상세 조회

        sql = f'''
            SELECT m.memId, m.nickname, p.mentoPic, p.brief, p.content, p.tuition, p.duration, p.isOpen, p.score, group_concat(subject), m.id
            FROM portfolio p
                JOIN portfolioSubject ps ON p.id = ps.portfolio
                JOIN member m ON p.mento = m.id
            WHERE p.id = {id} AND p.isDeleted = false
            '''
        result = selectOne(sql)
        
        if not result[0] :
            return None

        return result

    @staticmethod
    def existsByIdAndMento(id, mentoId) :

        sql = f'SELECT EXISTS (SELECT id FROM portfolio WHERE id = {id} AND mento = {mentoId} AND isDeleted = false)'

        result = selectOne(sql)[0]

        return True if result == 1 else False

    @staticmethod
    def findMentoById(id) :

        sql = f'SELECT mento FROM portfolio WHERE id = {id} AND isDeleted = false'

        result = selectOne(sql)[0]

        if not result :
            return None
        
        return result

    @staticmethod
    def updateState(id, date) :

        sql = f"UPDATE portfolio SET isOpen = !isOpen, curDate = '{date}' WHERE id = {id}"

        done = commit(sql)
        
        return done

    @staticmethod
    def update(id, newImg, newBrf, newCnt, newTuit, newDur, subjects) :

        newCnt = newCnt.replace("\'", "\"")
        newBrf = newBrf.replace("\'", "\"")

        sql = f"UPDATE portfolio SET mentoPic = '{newImg}', brief = '{newBrf}', content = '{newCnt}', tuition = '{newTuit}', duration = '{newDur}' WHERE id = {id}"

        commit(sql)

        sql2 = f"DELETE FROM portfolioSubject WHERE portfolio = {id}"

        commit(sql2)

        for subject in subjects :

            sql3 = f"INSERT INTO portfolioSubject(portfolio, subject) VALUES({id}, {subject})"

            done = commit(sql3)

        return done

    @staticmethod
    def updateDeleted(id) : # 삭제 대신 isDeleted

        sql = f"UPDATE portfolio SET isDeleted = true WHERE id = {id}"

        done = commit(sql)

        return done

    @staticmethod
    def updateScore(portfolioId) : # 평균 별점 업데이트

        average_score = Portfolio.calculateAverageScore(portfolioId)
        
        sql = f"UPDATE portfolio SET score = {average_score} WHERE id = {portfolioId}"

        return commit(sql)
    
    def calculateAverageScore(portfolioId): # 평균 별점 계산하기

        sql = f"SELECT avg(score) FROM review WHERE portfolio = {portfolioId}"

        return selectOne(sql)[0]

    @staticmethod
    def findByMentoId(mento_id) :

        sql = f"SELECT id FROM portfolio WHERE mento = {mento_id} and isDeleted = false"

        result = selectOne(sql)

        if not result :
            return None

        return result[0]
    
    @staticmethod
    def findByTitle(title) :
        
        sql = f"SELECT id, mento, brief FROM portfolio WHERE brief LIKE '%{title}%'"
        
        listP = selectAll(sql)
        
        return listP
        
    @staticmethod
    def findByMento(mento) : 
        
        sql = f"SELECT portfolio.id, mento, brief FROM member, portfolio WHERE member.id = portfolio.mento and member.nickname LIKE '%{mento}%'"
        
        listP = selectAll(sql)
        
        return listP

    @staticmethod
    def getNmentoring() :

        sql = "SELECT mento, brief FROM portfolio LIMIT 5"

        allP = selectAll(sql)

        return allP


