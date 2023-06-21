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
        # try :
        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()

        sql = f"INSERT INTO reply(writer, content, curDate, type, postNum) VALUES('{writer}', '{content}', '{curDate}', {type}, {postNum})"

        done = cursor_db.execute(sql)

        if done == 0 :
            mysql_db.rollback()

        mysql_db.commit()

        pk_sql = "SELECT LAST_INSERT_ID()"

        cursor_db.execute(pk_sql)

        result = cursor_db.fetchone()
        pk = result[0]

        mysql_db.close()
        
        return pk

    @staticmethod
    def modifyReply(id, newCnt) :
        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()

        sql = f"UPDATE reply SET content = '{newCnt}' WHERE replyId = {id}"

        done = cursor_db.execute(sql)

        if done == 0 :
            mysql_db.rollback()
        
        mysql_db.commit()
        mysql_db.close()

        return done

    @staticmethod
    def removeReply(id) :
        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()

        sql = f"DELETE FROM reply WHERE replyId = {id}"

        done = cursor_db.execute(sql)

        if done == 0 :
            mysql_db.rollback()

        mysql_db.commit()
        mysql_db.close()

        return done

    @staticmethod
    def showReply(type, postId) :
        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()

        sql = f"SELECT replyId, writer, content, curDate FROM reply WHERE type = {type} and postNum = {postId}"

        done = cursor_db.execute(sql)

        result = cursor_db.fetchall()

        mysql_db.close()

        return result