from backend.model.db_mysql import conn_mysql

class Review :
    def __init__(self, id, writer, content, mento) :
        self.__id = id
        self.__writer = writer
        self.__content = content
        self.__mento = mento

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
    def showReview(mentoId) :

        sql = f"SELECT * FROM review WHERE mento = '{mentoId}'"

        reviews = selectAll(sql)

        return reviews

    @staticmethod
    def writeReview(writer, content, mento) :
        
        sql = f"INSERT INTO review(writer, content, mento) VALUES({writer}, '{content}', {mento})"

        reviewId = commitAndGetId(sql)

        # if done == 0 :
        #     mysql_db.rollback()

        return reviewId

    @staticmethod
    def modifyReview(id, newCnt) :

        sql = f"UPDATE review SET content = '{newCnt}' WHERE id = {id}"

        done = commit(sql)

        if done == 0 :
            mysql_db.rollback()
        
        return done

    @staticmethod
    def removeReview(id) :

        sql = f"DELETE FROM review WHERE id = {id}"

        done = commit(sql)

        if done == 0 :
            mysql_db.rollback()

        return done
