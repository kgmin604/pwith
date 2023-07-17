from backend.controller import commit, commitAndGetId, selectAll, selectOne

class Portfolio() :
    
    def __init__(self, id, mento, brief, mentoPic, content, date):
        self.__id = id
        self.__mento = mento
        self.__brief = brief
        self.__mentoPic = mentoPic
        self.__content = content
        self.__date = date
        # 끌어올리기 구현 시 ON/OFF or date 추가 - DB에도
    
    @property # getter 함수를 다음과 같이 정의 for 은닉
    def writer(self) :
        return str(self.__writer)

    @property
    def brief(self) :
        return str(self.__brief)

    @property
    def subject(self) :
        return str(self.__subject)

    @property
    def image(self) :
        return self.__image

    @property
    def content(self) :
        return str(self.__content)


    @staticmethod
    def create(mentoId, mentoPic, brief, content, date, subjects) :

        sql1 = f"INSERT INTO portfolio(mento, mentoPic, brief, content, curDate) VALUES ({mentoId}, '{mentoPic}', '{brief}', '{content}', '{date}')"

        portfolioId = commitAndGetId(sql1)

        for subject in subjects :

            sql2 = f"INSERT INTO portfolioSubject(portfolio, subject) VALUES({portfolioId}, {subject})"

            done = commit(sql2)

        return done

    @staticmethod
    def loadAll() :

        sql = "SELECT * FROM portfolio"

        allP = selectAll(sql)

        return allP

    @staticmethod
    def findByMento(mentoId) :

        sql = f"SELECT * FROM portfolio WHERE mento = '{mentoId}'"

        port = selectOne(sql)

        if not port :
            return None
            
        result = Portfolio(port[0], port[1], port[2], port[3], port[4], port[5])

        return result

    @staticmethod
    def update(mentoId, newImg, newBrf, newCnt, subjects) :

        sql = f"UPDATE portfolio SET mentoPic = {newImg}, brief = {newBrf}, content = {newCnt} WHERE mento = {mentoId}"

        portfolioId = commitAndGetId(sql)

        for subject in subjects :

            sql2 = f"INSERT INTO portfolioSubject(portfolio, subject) VALUES({portfolioId}, {subject})"

            done = commit(sql2)

        return done

    @staticmethod
    def delete(mentoId) : # TODO test

        sql = f"DELETE FROM portfolio WHERE mento = '{mentoId}'"

        done = commit(sql)

        return done

    @staticmethod
    def search(mentoId) : # 멘토 아이디로 검색

        sql = f"SELECT * FROM portfolio WHERE mento LIKE '%{mentoId}%'"

        result = selectAll(sql)        

        if not result :
            return None
        
        return result

    @staticmethod
    def getNmentoring() :
        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()

        sql = "SELECT mentoId, brief FROM mento LIMIT 5"
        cursor_db.execute(sql)

        allP = cursor_db.fetchall() # tuple of tuple
        # print(allP)

        mysql_db.close()

        return allP


