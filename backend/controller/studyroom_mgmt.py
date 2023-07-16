from backend.model.db_mysql import conn_mysql
import json
from backend.controller import commit, selectAll, selectOne, commitAndGetId

class StudyRoom() :
    
    def __init__(self, roomName, category, leader, image, joinP, totalP):
        self.__id = id
        self.__name = roomName
        self.__category = category
        self.__leader = leader
        self.__image = image
        self.__joinP = joinP
        self.__totalP = totalP
    
    @property
    def name(self) :
        return str(self.__name)

    @property
    def category(self) :
        return int(self.__category)

    @property
    def leader(self) :
        return str(self.__leader)

    @property
    def joinP(self) :
        return str(self.__joinP)

    @property
    def totalP(self) :
        return int(self.__totalP)

    @staticmethod
    def create(roomName, category, leader, totalP) :

        sql1 = f"INSERT INTO studyRoom(name, category, leader, totalP) VALUES('{roomName}', {category}, {leader}, {totalP})"

        roomId = commitAndGetId(sql1)

        sql2 = f"INSERT INTO studyMember(member, room) VALUES({leader}, {roomId})"

        done = commit(sql2)

        return done

    @staticmethod
    def show(logUser) :

        result = []

        sql1 = f"SELECT room FROM studyMember WHERE member = '{logUser}'"

        rooms = selectAll(sql1) # id 형태

        for room in rooms :
            
            roomId = room[0]

            sql2 = f"SELECT * FROM studyRoom WHERE id = {roomId}"

            roomInfo = selectOne(sql2)

            result.append(roomInfo)
        
        return result

    @staticmethod
    def getStudentList(roomId) : # 스터디룸 참가자 조회

        sql = f"SELECT studentsList FROM studyRoom WHERE roomId = {roomId}"

        studentsList = selectOne(sql)[0]

        return studentsList

    @staticmethod
    def addStudent(id, students) : # 스터디룸 참가자 추가
        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()

        # 참가자 리스트 업뎃
        sql = f"UPDATE studyRoom SET studentsList = '{students}' WHERE roomId = {id}"

        done = cursor_db.execute(sql)
        # print(done)

        mysql_db.commit()


        # 참가자 수 업뎃
        sql = f"UPDATE studyRoom SET joinP = joinP + 1 WHERE roomId = {id}"

        done = cursor_db.execute(sql)
        # print(done)

        mysql_db.commit()

        mysql_db.close()
        
        return done

