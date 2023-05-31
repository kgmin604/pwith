from model.db_mysql import conn_mysql

class Portfolio() :
    
    def __init__(self, writer, subject, image, content):
        self.writer = writer
        self.subject = subject
        self.image = image
        self.content = content
        # 끌어올리기 구현 시 ON/OFF or date 추가 - DB에도
    
    @staticmethod
    def create(writer, subject, image, content) :
        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()
        sql = f"INSERT INTO mento(mentoId, mentiList, subject, mentoPic, content) VALUES ('{writer}', '{subject}', '{image}', '{content}')" ## str
        cursor_db.execute(sql)
        mysql_db.commit()
        return None

    @staticmethod
    def loadAll() :
        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()

        sql = "SELECT * FROM mento"
        cursor_db.execute(sql)

        allP = cursor_db.fetchall()
        return allP

    @staticmethod
    def findById(mentoId) :
        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()

        sql = f"SELECT * FROM mento WHERE mentoId = {mentoId}"
        cursor_db.execute(sql)

        pf = cursor_db.fetchone()
        return pf

    ## update 구현