from backend.controller import commit, commitAndGetId, selectAll, selectOne
import pymysql

class Portfolio() :
    
    def __init__(self, id, mento, brief, mentoPic, content, date):
        self.__id = id
        self.__mento = mento
        self.__brief = brief
        self.__mentoPic = mentoPic
        self.__content = content
        self.__date = date
        # 끌어올리기 구현 시 ON/OFF or date 추가 - DB에도
    @property
    def mento(self) :
        return self.__mento
    @property
    def brief(self) :
        return self.__brief
    # @property
    # def subject(self) :
    #     return self.__subject
    @property
    def mentoPic(self) :
        return self.__mentoPic
    @property
    def content(self) :
        return self.__content

    @staticmethod
    def existsById(id) :
        sql = f"SELECT EXISTS (SELECT id FROM portfolio WHERE id = {id})"

        result = selectOne(sql)[0]
        print(result)

        return True if result == 1 else False

    @staticmethod
    def save(mentoId, mentoPic, brief, content, date, subjects) :

        sql1 = f"INSERT INTO portfolio(mento, mentoPic, brief, content, curDate) VALUES ({mentoId}, '{mentoPic}', '{brief}', '{content}', '{date}')"

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
            SELECT p.id, m.memId, m.nickname, p.mentoPic, p.brief, p.score, group_concat(subject)
            FROM portfolio p JOIN portfolioSubject ps ON p.id=ps.portfolio JOIN member m ON p.mento=m.id
            GROUP BY m.memId
            '''

        allP = selectAll(sql)

        return allP

    @staticmethod
    def searchByMento(value) : # 닉네임으로 검색

        sql =  f'''
            SELECT p.id, m.memId, m.nickname, p.mentoPic, p.brief, p.score, group_concat(subject)
            FROM portfolio p JOIN portfolioSubject ps ON p.id=ps.portfolio JOIN member m ON p.mento=m.id 
            WHERE m.nickname LIKE '%{value}%'
            GROUP BY m.memId
            '''

        result = selectAll(sql)

        if not result :
            return None
        
        return result

    @staticmethod
    def findById(id) : # 상세 조회

        sql = f'''
            SELECT m.memId, m.nickname, p.mentoPic, p.brief, p.content, p.score, group_concat(subject)
            FROM portfolio p JOIN portfolioSubject ps ON p.id=ps.portfolio JOIN member m ON p.mento=m.id
            WHERE p.id = {id}
            '''

        result = selectOne(sql)

        if not result[0] :
            return None

        return result

    @staticmethod
    def findMentoById(id) :

        sql = f'SELECT mento FROM portfolio WHERE id = {id}'

        result = selectOne(sql)

        if not result :
            return None
        
        return result[0]

    @staticmethod
    def update(id, newImg, newBrf, newCnt, subjects) :

        sql = f"UPDATE portfolio SET mentoPic = '{newImg}', brief = '{newBrf}', content = '{newCnt}' WHERE id = {id}"

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
    def getNmentoring() :

        sql = "SELECT mento, brief FROM portfolio LIMIT 5"

        allP = selectAll(sql)

        return allP


