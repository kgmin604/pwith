from backend.controller import commit, commitAndGetId, selectAll, selectOne
import pymysql

class Portfolio() :
    
    def __init__(self, id, mento, brief, mentoPic, content, curDate, tuition, duration, isOpen, score):
        self.__id = id
        self.__mento = mento
        self.__brief = brief
        self.__mentoPic = mentoPic
        self.__content = content
        self.__curDate = curDate
        self.__tuition = tuition
        self.__duration = duration
        self.__isOpen = isOpen
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
    def score(self) :
        return self.__score

    @staticmethod
    def existsById(id) :
        sql = f"SELECT EXISTS (SELECT id FROM portfolio WHERE id = {id})"

        result = selectOne(sql)[0]

        return True if result == 1 else False

    @staticmethod
    def save(mentoId, mentoPic, brief, content, date, tuition, duration, subjects) :

        sql1 = f"INSERT INTO portfolio(mento, mentoPic, brief, content, curDate, tuition, duration) VALUES ({mentoId}, '{mentoPic}', '{brief}', '{content}', '{date}', {tuition}, {duration})"

        try :
            portfolioId = commitAndGetId(sql1)
        except pymysql.err.IntegrityError as ex:
            # print(f"SQL 예외 발생: {ex}")
            return 0

        for subject in subjects :

            sql2 = f"INSERT INTO portfolioSubject(portfolio, subject) VALUES({portfolioId}, {subject})"

            done = commit(sql2)

        return done

    @staticmethod
    def findAll() : # 전체 목록 조회

        sql = '''
            SELECT p.id, m.memId, m.nickname, p.mentoPic, p.brief, p.tuition, p.duration, p.score, group_concat(subject)
            FROM portfolio p JOIN portfolioSubject ps ON p.id=ps.portfolio JOIN member m ON p.mento=m.id
            WHERE p.isOpen = true
            GROUP BY p.id
            ORDER BY p.curDate DESC
            '''
        result = selectAll(sql)

        return result

    @staticmethod
    def searchByMento(value) : # 닉네임으로 검색

        sql =  f'''
            SELECT p.id, m.memId, m.nickname, p.mentoPic, p.brief, p.tuition, p.duration, p.score, group_concat(subject)
            FROM portfolio p JOIN portfolioSubject ps ON p.id=ps.portfolio JOIN member m ON p.mento=m.id 
            WHERE p.isOpen = true AND m.nickname LIKE '%{value}%'
            GROUP BY p.id
            ORDER BY p.curDate DESC
            '''
        result = selectAll(sql)
        
        return result

    @staticmethod
    def findById(id) : # 상세 조회

        sql = f'''
            SELECT m.memId, m.nickname, p.mentoPic, p.brief, p.content, p.tuition, p.duration, p.isOpen, p.score, group_concat(subject), m.id
            FROM portfolio p JOIN portfolioSubject ps ON p.id=ps.portfolio JOIN member m ON p.mento=m.id
            WHERE p.id = {id}
            '''
        result = selectOne(sql)

        if not result :
            return None

        return result

    @staticmethod
    def findMentoById(id) :

        sql = f'SELECT mento FROM portfolio WHERE id = {id}'

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

        sql = f"UPDATE portfolio SET mentoPic = '{newImg}', brief = '{newBrf}', content = '{newCnt}', tuition = '{newTuit}', duration = '{newDur}' WHERE id = {id}"

        commit(sql)

        sql2 = f"DELETE FROM portfolioSubject WHERE portfolio = {id}"

        commit(sql2)

        for subject in subjects :

            sql3 = f"INSERT INTO portfolioSubject(portfolio, subject) VALUES({id}, {subject})"

            done = commit(sql3)

        return done

    @staticmethod
    def delete(id) :

        sql = f"DELETE FROM portfolio WHERE id = {id}"

        commit(sql)

        sql2 = f"DELETE FROM portfolioSubject WHERE portfolio = {id}"

        done = commit(sql2)

        return done

    @staticmethod
    def findByMentoId(mento_id) :

        sql = f"SELECT id FROM portfolio WHERE mento = {mento_id}"

        result = selectOne(sql)

        if not result :
            return None

        return result[0]

    @staticmethod
    def getNmentoring() :

        sql = "SELECT mento, brief FROM portfolio LIMIT 5"

        allP = selectAll(sql)

        return allP


