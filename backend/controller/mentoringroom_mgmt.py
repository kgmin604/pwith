from backend.controller import commit, commitAndGetId, selectAll, selectOne

class MentoringRoom() :
    def __init__(self, id, name, mentoId, mentiId, mentoPic):
        self.__id = id
        self.__name = name
        self.__mento = mentoId
        self.__menti = mentiId
        self.__mentoPic = mentoPic
    @property
    def id(self) :
        return self.__id
    @property
    def name(self) :
        return self.__name
    @property
    def mento(self) :
        return self.__mento
    @property
    def menti(self) :
        return self.__menti
    @property
    def mentoPic(self) :
        return self.__mentoPic

    @staticmethod
    def save(roomName, date, mentoId, mentiId) :

        sql = f"INSERT INTO mentoringRoom(name, curDate, mento, menti) VALUES('{roomName}', '{date}', {mentoId}, {mentiId})"

        roomId = commitAndGetId(sql)

        return roomId

    @staticmethod
    def findByMemberId(member_id) :

        sql = f'''
        SELECT mr.id, mr.name, mr.mento, mr.menti, p.mentoPic
        FROM mentoringRoom mr JOIN portfolio p ON mr.mento = p.mento
        WHERE mr.mento = {member_id} OR mr.menti = {member_id}
        ORDER BY mr.curDate DESC
        '''
        rooms = selectAll(sql)

        result = []
        for r in rooms :
            result.append(MentoringRoom(r[0],r[1],r[2],r[3],r[4]))

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