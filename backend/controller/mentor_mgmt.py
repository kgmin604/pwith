from backend.model.db_mysql import conn_mysql

class Portfolio() :
    
    def __init__(self, writer, subject, image, brief, content):
        self.__writer = writer # 더던
        self.__subject = subject
        self.__image = image
        self.__brief = brief
        self.__content = content
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
    def create(writer, subject, image, brief, content) :
        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()

        sql = "INSERT INTO mento (mentoId, mentiList, subject, mentoPic, brief, content) VALUES (%s, null, %s, %s, %s, %s)"

        done = cursor_db.execute(sql, (writer, subject, image, brief, content,))

        mysql_db.commit()

        mysql_db.close()

        return done

    @staticmethod
    def loadAll() :
        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()

        sql = "SELECT * FROM mento"
        cursor_db.execute(sql)

        allP = cursor_db.fetchall() # tuple of tuple
        # print(allP)

        mysql_db.close()

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
            
        result = Portfolio(port[0], port[2], port[3], port[4], port[5]) # mentiList 외

        mysql_db.close()

        return result

    @staticmethod
    def update(mentoId, newSub, newImg, newBrf, newCnt) :
        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()

        sql = "UPDATE mento SET subject = %s, mentoPic = %s, brief = %s, content = %s WHERE mentoId = %s"

        done = cursor_db.execute(sql, (newSub, newImg, newBrf, newCnt, mentoId, ))

        mysql_db.commit()

        mysql_db.close()

        return done

    # 임시로 삭제 만들었음. 이후 끌어올리기로 대체.
    # on delete cascade 적용 안 돼서 무식하게 하는 중
    @staticmethod
    def delete(mentoId) :
        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()

        sql1 = f"DELETE FROM review WHERE mentoId = '{mentoId}'"
        done = cursor_db.execute(sql1)
        mysql_db.commit()

        sql2 = f"DELETE FROM mentoringRoom WHERE mentoId = '{mentoId}'"
        done = cursor_db.execute(sql2)
        mysql_db.commit()

        sql = f"DELETE FROM mento WHERE mentoId = '{mentoId}'"
        done = cursor_db.execute(sql)
        mysql_db.commit()

        mysql_db.close()

        return done

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


    @staticmethod
    def search(mentoId) : # 멘토 아이디로 검색
        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()

        sql = f"SELECT * FROM mento WHERE mentoId LIKE '%{mentoId}%'"

        cursor_db.execute(sql)
        result = cursor_db.fetchall()
        
        mysql_db.close()

        if not result :
            return None
        
        return result

