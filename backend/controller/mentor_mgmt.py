from model.db_mysql import conn_mysql

class Portfolio() :
    
    def __init__(self, writer, subject, image, content):
        self.writer = writer
        self.subject = subject
        self.image = image
        self.content = content
        # 끌어올리기 구현 시 ON/OFF or date 추가 - DB에도
    
    def getWriter(self) :
        return str(self.writer)
        
    def getSubject(self) :
        return str(self.subject)

    def getImage(self) :
        return str(self.image) # link ?

    def getContent(self) :
        return str(self.content)

    @staticmethod
    def create(writer, subject, image, content) :
        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()
        sql = f"INSERT INTO mento(mentoId, mentiList, subject, mentoPic, content) VALUES ('{writer}', '{subject}', '{image}', '{content}')" ## str
        done = cursor_db.execute(sql) ### print
        mysql_db.commit() ### print
        return done ## or, commit result (?)

    @staticmethod
    def loadAll() :
        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()

        sql = "SELECT * FROM mento"
        cursor_db.execute(sql)

        allP = cursor_db.fetchall()
        print(type(allP)) ###
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