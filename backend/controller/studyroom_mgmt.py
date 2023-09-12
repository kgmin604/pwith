from backend.model.db_mysql import conn_mysql
from backend.controller import commit, selectAll, selectOne, commitAndGetId
from backend.controller.member_mgmt import Member
import json

class StudyRoom() :
    def __init__(self, id, name, date, category, leader, image, joinP, totalP, notice):
        self.__id = id
        self.__name = name
        self.__date = date
        self.__category = category
        self.__leader = leader
        self.__image = image
        self.__joinP = joinP
        self.__totalP = totalP
        self.__notice = notice
    @property
    def id(self) :
        return self.__id
    @property
    def name(self) :
        return self.__name
    @property
    def date(self) :
        return self.__date
    @property
    def category(self) :
        return self.__category
    @property
    def leader(self) :
        return self.__leader
    @property
    def image(self) :
        return self.__image
    @property
    def joinP(self) :
        return self.__joinP
    @property
    def totalP(self) :
        return self.__totalP
    @property
    def notice(self) :
        return self.__notice

    @staticmethod
    def save(roomName, date, category, leader, image, totalP) :

        sql1 = f"INSERT INTO studyRoom(name, curDate, category, leader, image, totalP) VALUES('{roomName}', '{date}', {category}, {leader}, '{image}', {totalP})"

        roomId = commitAndGetId(sql1)

        return roomId

    @staticmethod
    def addStudent(member, roomId) :

        try :
            # 1. 멤버 추가
            sql = f"INSERT INTO studyMember(member, room) VALUES({member}, {roomId})"
            done = commit(sql)
        except : 
            return 0

        # 2. 참가자 수 증가
        sql2 = f"UPDATE studyRoom SET joinP = joinP + 1 WHERE id = {roomId}"
        done = commit(sql2)
        
        return done

    @staticmethod
    def findByMemberId(member_id) :

        sql = f'''
        SELECT sr.id, sr.name, sr.curDate, sr.category, sr.leader, sr.image, sr.joinP, sr.totalP, sr.notice
        FROM studyRoom sr JOIN studyMember sm ON sr.id=sm.room
        WHERE sm.member = {member_id}
        ORDER BY sr.curDate DESC
        '''
        rooms = selectAll(sql)

        result = []
        for r in rooms :
            result.append(StudyRoom(r[0],r[1],r[2],r[3],r[4],r[5],r[6],r[7],r[8]))
        
        return result

    @staticmethod
    def findById(id) :

        sql = f'SELECT * FROM studyRoom WHERE id = {id}'

        res = selectOne(sql)

        if not res :
            return None

        room = StudyRoom(res[0],res[1],res[2],res[3],res[4],res[5],res[6],res[7],res[8])

        return room

    @staticmethod
    def findMemberByRoomId(roomId) : # 참가자 조회

        sql = f"SELECT m.id, m.memId, m.password, m.nickname, m.email, m.image, m.isAdmin FROM studyMember sm, member m WHERE sm.member = m.id AND sm.room = {roomId}"

        res = selectAll(sql)

        result = []
        for r in res :
            result.append(Member(r[0],r[1],r[2],r[3],r[4],r[5],r[6]))

        return result

    @staticmethod
    def updateNotice(roomId, notice) : # 공지 수정

        sql = f"UPDATE studyRoom SET notice='{notice}' WHERE id = {roomId}"

        done = commit(sql)

        return done

    @staticmethod
    def delete(roomId) : # 삭제

        sql = f"DELETE FROM studyRoom WHERE id = {roomId}"

        done = commit(sql)

        return done