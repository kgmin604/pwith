from model.db_mysql import conn_mysql

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
    def showAll() :
        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()

        sql = "SELECT * FROM studyRoom"
        cursor_db.execute(sql)

        result = cursor_db.fetchall()

        mysql_db.close()
        
        return result