from backend.model.db_mysql import conn_mysql
import json
from backend.controller import commit, selectAll, selectOne, commitAndGetId

class StudyRoom() :
    def __init__(self, id, name, category, leader, image, joinP, totalP, notice):
        self.__id = id
        self.__name = name
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
        SELECT sr.id, sr.name, sr.category, sr.leader, sr.image, sr.joinP, sr.totalP, sr.notice
        FROM studyRoom sr JOIN studyMember sm ON sr.id=sm.room
        WHERE sm.member = {member_id}
        ORDER BY sr.curDate DESC
        '''
        rooms = selectAll(sql)

        result = []
        for r in rooms :
            result.append(StudyRoom(r[0],r[1],r[2],r[3],r[4],r[5],r[6],r[7]))
        
        return result

    @staticmethod
    def getStudentList(roomId) : # 스터디룸 참가자 조회

        sql = f"SELECT studentsList FROM studyRoom WHERE roomId = {roomId}"

        studentsList = selectOne(sql)[0]

        return studentsList
