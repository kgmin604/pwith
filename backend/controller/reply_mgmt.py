from model.db_mysql import conn_mysql

class Reply :
    def __init__(self, writer, content, curDate, type, postNum) :
        self.writer = writer
        self.content = content
        self.curDate = curDate
        self.type = type
        self.postNum = postNum

    @staticmethod
    def writeReply(writer, content, curDate, type, postNum) :
        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()
        sql = f"INSERT INTO reply(writer, content, curDate, type, postNum) VALUES('{writer}', '{content}', '{curDate}', {type}, {postNum})"

        done = cursor_db.execute(sql)
        mysql_db.commit()
        
        mysql_db.close()

        return done

    @staticmethod
    def modifyReply(content) :
        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()
        sql = f"UPDATE reply SET content='{content}' WHERE "

        done = cursor_db.execute(sql)
        mysql_db.commit()
        
        mysql_db.close()

        return done