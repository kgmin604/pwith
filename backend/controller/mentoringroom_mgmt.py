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
        room = MentoringRoom(r[0],r[1],r[2],r[3],r[4],r[5],r[6],r[7],r[8],r[9],r[10])

        if room.portfolio is not None:
            mentoPic = Portfolio.findPicById(room.portfolio)
        else:
            mentoPic = None

        return {
            'room': room,
            'mentoPic': mentoPic
        }

    @staticmethod
    def findByMemberId(memberId) : # 참여한 멘토링룸

        sql = f"SELECT * FROM mentoringRoom WHERE mento = {memberId} OR menti = {memberId} ORDER BY curDate DESC"

        rooms = selectAll(sql)

        result = []
        for r in rooms :
            item = {}
            
            room = MentoringRoom(r[0],r[1],r[2],r[3],r[4],r[5],r[6],r[7],r[8],r[9],r[10])
            item['room'] = room
            
            if room.portfolio:
                item['mentoPic'] = Portfolio.findPicById(room.portfolio)
            else:
                item['mentoPic'] = None
            result.append(item)

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