from model.db_mysql import conn_mysql

class Portfolio() :
    
    def __init__(self, writer, subject, image, content):
        self.__writer = writer # 더던
        self.__subject = subject
        self.__image = image
        self.__content = content
        # 끌어올리기 구현 시 ON/OFF or date 추가 - DB에도
    
    @property # getter 함수를 다음과 같이 정의 for 은닉
    def writer(self) :
        return str(self.__writer)

    @property
    def subject(self) :
        return str(self.__subject)

    @property
    def image(self) :
        return str(self.__image) # link ?

    @property
    def content(self) :
        return str(self.__content)

    @staticmethod
    def create(writer, subject, image, content) :
        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()

        sql = f"INSERT INTO mento(mentoId, mentiList, subject, mentoPic, content) VALUES ('{writer}', null, '{subject}', '{image}', '{content}')"
        done = cursor_db.execute(sql)

        mysql_db.commit() ### print None
        return done

    @staticmethod
    def loadAll() :
        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()

        sql = "SELECT * FROM mento"
        cursor_db.execute(sql)

        allP = cursor_db.fetchall() # tuple of tuple
        # print(allP)
        return allP

    @staticmethod
    def findById(mentoId) :
        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()

        sql = f"SELECT * FROM mento WHERE mentoId = '{mentoId}'"
        cursor_db.execute(sql)

        port = cursor_db.fetchone()
        
        if not port :
            return None

        result = Portfolio(port[0], port[2], port[3], port[4]) # mentiList 제외
        return result

    @staticmethod
    def update(mentoId, newSub, newImg, newCnt) :
        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()

        sql = f"UPDATE mento SET subject = '{newSub}', mentoPic = '{newImg}', content = '{newCnt}' WHERE mentoId = '{mentoId}'"
        done = cursor_db.execute(sql)

        mysql_db.commit()

        return done




    ## menti list에 추가 구현