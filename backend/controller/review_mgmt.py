from model.db_mysql import conn_mysql

class Review :
    def __init__(self, writer, content, mentoId) :
        self.__writer = writer
        self.__content = content
        self.__mentoId = mentoId

    @property
    def writer(self) :
        return str(self.__writer)

    @property
    def content(self) :
        return str(self.__content)

    @property
    def mentoId(self) :
        return str(self.__mentoId)

    @staticmethod
    def writeReview(writer, content, mentoId) :
        
        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()

        sql = f"INSERT INTO review(writer, content, mentoId) VALUES('{writer}', '{content}', '{mentoId}')"

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
    def modifyReview(id, newCnt) :
        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()

        sql = f"UPDATE review SET content = '{newCnt}' WHERE reviewId = {id}"

        done = cursor_db.execute(sql)

        if done == 0 :
            mysql_db.rollback()
        
        mysql_db.commit()
        mysql_db.close()

        return done

    @staticmethod
    def removeReview(id) :
        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()

        sql = f"DELETE FROM review WHERE reviewId = {id}"

        done = cursor_db.execute(sql)

        if done == 0 :
            mysql_db.rollback()

        mysql_db.commit()
        mysql_db.close()

        return done
