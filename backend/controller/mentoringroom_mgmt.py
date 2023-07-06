from backend.model.db_mysql import conn_mysql

class MentoringRoom() :
    
    def __init__(self, roomName, mentoId, mentiId):
        self.__roomName = roomName
        self.__mentoId = mentoId
        self.__mentiId = mentiId
    
    @property
    def roomName(self) :
        return str(self.__roomName)

    @property
    def mentoId(self) :
        return str(self.__mentoId)

    @property
    def mentiId(self) :
        return str(self.__mentiId)

    @staticmethod
    def create(roomName, mentoId, mentiId) :
        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()

        sql = f"INSERT INTO mentoringRoom(roomName, mentoId, mentiId) VALUES('{roomName}', '{mentoId}', '{mentiId}')"

        done = cursor_db.execute(sql)

        if done == 0 :
            mysql_db.rollback()

        mysql_db.commit()

        pk_sql = "SELECT LAST_INSERT_ID()"

        cursor_db.execute(pk_sql)

        result = cursor_db.fetchone()
        pk = result[0]

        mysql_db.close()

        return pk

    @staticmethod
    def show(logUser) :
        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()

        sql = f"SELECT * FROM mentoringRoom WHERE mentoId = '{logUser}' or mentiId = '{logUser}'"
        cursor_db.execute(sql)

        result = cursor_db.fetchall()

        mysql_db.close()
        
        return result

    @staticmethod
    def getMentiList(mentoId) : # 멘토링 참가자 조회
        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()

        sql = f"SELECT studentsList FROM mentor WHERE roomId = {mentoId}"

        cursor_db.execute(sql)

        studentsList = cursor_db.fetchone()[0]
        # print(studentsList)

        mysql_db.close()

        return studentsList

    @staticmethod
    def addStudent(mento, mentiList) :
        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()

        sql = f"UPDATE mento SET mentiList = '{mentiList}' WHERE mentoId = '{mento}'"

        done = cursor_db.execute(sql)

        mysql_db.commit()

        mysql_db.close()
        
        return done