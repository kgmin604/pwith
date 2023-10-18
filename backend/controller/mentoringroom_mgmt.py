from backend.controller import commit, commitAndGetId, selectAll, selectOne
from backend.controller.mentor_mgmt import Portfolio

class MentoringRoom() :
    def __init__(self, id, name, curDate, mentoId, mentiId, notice, total, cnt_o, cnt_i, cnt_r, portfolio):
        self.__id = id
        self.__name = name
        self.__curDate = curDate
        self.__mento = mentoId
        self.__menti = mentiId
        self.__notice = notice
        self.__lesson_cnt = total
        self.__mento_cnt = cnt_o
        self.__menti_cnt = cnt_i
        self.__refund_cnt = cnt_r
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
    def lesson_cnt(self) :
        return self.__lesson_cnt
    @property
    def mento_cnt(self) :
        return self.__mento_cnt
    @property
    def menti_cnt(self) :
        return self.__menti_cnt
    @property
    def refund_cnt(self) :
        return self.__refund_cnt
    @property
    def portfolio(self) :
        return self.__portfolio

    @staticmethod
    def save(roomName, date, mentoId, mentiId, portId) :

        sql = f"INSERT INTO mentoringRoom(name, curDate, mento, menti, portfolio) VALUES('{roomName}', '{date}', {mentoId}, {mentiId}, {portId})"

        roomId = commitAndGetId(sql)

        return roomId

    @staticmethod
    def existsById(roomId): # 방이 존재하는지

        sql = f"SELECT EXISTS (SELECT id FROM mentoringRoom WHERE id = {id})"

        result = selectOne(sql)[0]

        return True if result == 1 else False

    @staticmethod
    def findById(roomId): # 멘토링룸 + 포폴

        sql = f"SELECT * FROM mentoringRoom mr JOIN portfolio p ON mr.portfolio = p.id \
            WHERE mr.id = {roomId}"

        r = selectOne(sql)

        if not r :
            return None

        room = MentoringRoom(r[0],r[1],r[2],r[3],r[4],r[5],r[6],r[7],r[8],r[9],r[10])
        portfolio = Portfolio(r[11],r[12],r[13],r[14],r[15],r[16],r[17],r[18],r[19],r[20],r[21])

        return {
            'room': room,
            'portfolio': portfolio
        }

    @staticmethod
    def findByMemberId(memberId) : # 참여한 멘토링룸 + 포폴

        sql = f"SELECT * FROM mentoringRoom mr JOIN portfolio p ON mr.portfolio = p.id \
            WHERE mr.mento = {memberId} OR mr.menti = {memberId} ORDER BY mr.curDate DESC"

        rooms = selectAll(sql)

        result = []
        for r in rooms :
            item = {}
            
            room = MentoringRoom(r[0],r[1],r[2],r[3],r[4],r[5],r[6],r[7],r[8],r[9],r[10])
            portfolio = Portfolio(r[11],r[12],r[13],r[14],r[15],r[16],r[17],r[18],r[19],r[20],r[21])

            item['room'] = room
            item['portfolio'] = portfolio

            result.append(item)

        return result

    @staticmethod
    def findMentoById(id):

        sql = f"SELECT mento FROM mentoringRoom WHERE id = {id}"

        result = selectOne(sql)[0]

        if not result :
            return None
        
        return result

    @staticmethod
    def existsByMentoMenti(mento_id, menti_id) : # 첫수업인지 -> 삭제

        sql = f"SELECT EXISTS (SELECT id FROM mentoringRoom WHERE mento = {mento_id} AND menti = {menti_id})"

        result = selectOne(sql)[0]

        return True if result == 1 else False

    @staticmethod
    def updateMentoCheck(id) : # 멘토 수업 횟수 증가

        sql = f"UPDATE mentoringRoom SET mento_cnt = mento_cnt + 1 WHERE id = {id}"

        done = commit(sql)

        return done

    @staticmethod
    def updateMentiCheck(id) : # 멘티 수업 횟수 증가

        sql = f"UPDATE mentoringRoom SET menti_cnt = menti_cnt + 1 WHERE id = {id}"

        done = commit(sql)

        return done
        
    @staticmethod
    def updateLessonCnt(id, cnt) : # 수업 횟수 증가

        sql = f"UPDATE mentoringRoom SET lesson_cnt = lesson_cnt + {cnt} WHERE id = {id}"

        done = commit(sql)

        return done


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