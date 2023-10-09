from backend.controller import commit, commitAndGetId, selectAll, selectOne
from backend.controller.mentor_mgmt import Portfolio

class MentoringRoom() :
    def __init__(self, id, name, curDate, mentoId, mentiId, notice, portfolio):
        self.__id = id
        self.__name = name
        self.__curDate = curDate
        self.__mento = mentoId
        self.__menti = mentiId
        self.__notice = notice
        self.__portfolio = portfolio
    @property
    def id(self) :
        return self.__id
    @property
    def name(self) :
        return self.__name
    @property
    def curDate(self) :
        return self.__curDate
    @property
    def mento(self) :
        return self.__mento
    @property
    def menti(self) :
        return self.__menti
    @property
    def notice(self) :
        return self.__notice
    @property
    def portfolio(self) :
        return self.__portfolio

    @staticmethod
    def save(roomName, date, mentoId, mentiId) :

        sql = f"INSERT INTO mentoringRoom(name, curDate, mento, menti) VALUES('{roomName}', '{date}', {mentoId}, {mentiId})"

        roomId = commitAndGetId(sql)

        return roomId

    @staticmethod
    def findById(roomId): # 멘토링룸 + 포폴 이미지

        sql = f"SELECT * FROM mentoringRoom WHERE id = {roomId}"

        r = selectOne(sql)
        if not r :
            return None
        room = MentoringRoom(r[0],r[1],r[2],r[3],r[4],r[5],r[6])

        if room.portfolio is not None:
            mentoPic = Portfolio.findPicById(room.portfolio)
        else:
            mentoPic = None

        return {
            'room': room,
            'mentoPic': mentoPic
        }

    @staticmethod
    def findByMemberId(member_id) :

        sql = f'''
        SELECT mr.id, mr.name, mr.curDate, mr.mento, mr.menti, p.mentoPic
        FROM mentoringRoom mr JOIN portfolio p ON mr.mento = p.mento
        WHERE mr.mento = {member_id} OR mr.menti = {member_id}
        ORDER BY mr.curDate DESC
        '''
        rooms = selectAll(sql)

        result = []
        for r in rooms :
            result.append(MentoringRoom(r[0],r[1],r[2],r[3],r[4],r[5]))

        return result

    @staticmethod
    def existsByMentoMenti(mento_id, menti_id) :

        sql = f"SELECT EXISTS (SELECT id FROM mentoringRoom WHERE mento = {mento_id} AND menti = {menti_id})"

        result = selectOne(sql)[0]
        print(result)

        return True if result == 1 else False

    @staticmethod
    def updateNotice(roomId, notice) : # 공지 수정

        sql = f"UPDATE mentoringRoom SET notice='{notice}' WHERE id = {roomId}"

        done = commit(sql)

        return done

    @staticmethod
    def delete(roomId) : # 삭제

        sql = f"DELETE FROM mentoringRoom WHERE id = {roomId}"

        done = commit(sql)

        return done


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