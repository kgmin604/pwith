from backend.controller import commit, commitAndGetId, selectAll, selectOne

class MentoringRoom() :
    
    def __init__(self, id, name, mentoId, mentiId):
        self.__id = id
        self.__name = name
        self.__mento = mentoId
        self.__menti = mentiId
    
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

        sql = f"INSERT INTO mentoringRoom(name, mento, menti) VALUES('{roomName}', {mentoId}, {mentiId})"

        roomId = commitAndGetId(sql)

        # if done == 0 :
        #     mysql_db.rollback()

        return roomId

    @staticmethod
    def show(logUser) :

        sql = f"SELECT * FROM mentoringRoom WHERE mento = {logUser} or menti = {logUser}"

        result = selectAll(sql)

        return result

    # @staticmethod
    # def getMentiList(mentoId) : # 멘토링 참가자 조회

    #     sql = f"SELECT studentsList FROM mentor WHERE roomId = {mentoId}"

    #     studentsList = selectOne(sql)[0]

    #     return studentsList

    # @staticmethod
    # def addStudent(mento, mentiList) :
    #     mysql_db = conn_mysql()
    #     cursor_db = mysql_db.cursor()

    #     sql = f"UPDATE mento SET mentiList = '{mentiList}' WHERE mentoId = '{mento}'"

    #     done = cursor_db.execute(sql)

    #     mysql_db.commit()

    #     mysql_db.close()
        
    #     return done