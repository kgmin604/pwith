from model.db_mysql import conn_mysql
import json

class StudyRoom() :
    
    def __init__(self, roomName, category, leader, joinP, totalP):
        self.__roomName = roomName
        self.__category = category
        self.__leader = leader
        self.__joinP = joinP
        self.__totalP = totalP
    
    @property
    def roomName(self) :
        return str(self.__roomName)

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
        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()

        sql = f"INSERT INTO studyRoom(roomName, category, leader, totalP) VALUES('{roomName}', {category}, '{leader}', {totalP})"

        done = cursor_db.execute(sql)

        mysql_db.commit()

        mysql_db.close()

        return done

    @staticmethod
    def show(logUser) :
        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()

        sql = f"SELECT * FROM studyRoom WHERE leader = '{logUser}'"
        cursor_db.execute(sql)

        result = cursor_db.fetchall()

        mysql_db.close()
        
        return result

    @staticmethod
    def getStudentList(roomId) : # 스터디룸 참가자 조회
        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()

        sql = f"SELECT studentsList FROM studyRoom WHERE roomId = {roomId}"

        cursor_db.execute(sql)

        studentsList = cursor_db.fetchone()[0]
        # print(studentsList)

        mysql_db.close()

        return studentsList

    @staticmethod
    def addStudent(id, students) : # 스터디룸 참가자 추가
        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()

        sql = f"UPDATE studyRoom SET studentsList = '{students}' WHERE roomId = {id}"

        done = cursor_db.execute(sql)
        # print(done)

        mysql_db.commit()

        mysql_db.close()
        
        return done