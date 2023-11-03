from backend.controller import commit, commitAndGetId, selectAll, selectOne

class Review :
    def __init__(self, id, writer, content, score, curDate, mento, room) :
        self.__id = id
        self.__writer = writer
        self.__content = content
        self.__score = score
        self.__curDate = curDate
        self.__mento = mento
        self.__room = room
    @property
    def id(self) :
        return self.__id
    @property
    def writer(self) :
        return self.__writer
    @property
    def content(self) :
        return self.__content
    @property
    def score(self) :
        return self.__score
    @property
    def curDate(self) :
        return self.__curDate
    @property
    def mento(self) :
        return self.__mento
    @property
    def room(self) :
        return self.__room
        
    @staticmethod
    def findByMentoId(mentoId) :

        sql = f"SELECT * FROM review WHERE mento = '{mentoId}' ORDER BY curDate DESC"

        reviews = selectAll(sql)

        result = []
        
        for r in reviews:
            result.append(Review(r[0],r[1],r[2],r[3],r[4],r[5],r[6]))

        return result

    @staticmethod
    def save(writerId, content, score, curDate, mentoId, roomId):
        
        sql = f"INSERT INTO review(writer, content, score, curDate, mento, room) VALUES({writerId}, '{content}', {score}, '{curDate}', {mentoId}, {roomId})"

        reviewId = commitAndGetId(sql)

        return reviewId

    @staticmethod
    def update(id, newCnt, newScore) :

        sql = f"UPDATE review SET content = '{newCnt}', score = {newScore} WHERE id = {id}"

        done = commit(sql)

        return done

    @staticmethod
    def delete(id) :

        sql = f"DELETE FROM review WHERE id = {id}"

        done = commit(sql)

        return done

    @staticmethod
    def findByIdAndRoom(id, roomId) :

        sql = f"SELECT * FROM review WHERE id = {id} AND room = {roomId}"

        r = selectOne(sql)

        if not r :
            return None

        review = Review(r[0],r[1],r[2],r[3],r[4],r[5],r[6])

        return review

    @staticmethod
    def findByRoom(roomId):

        sql = f"SELECT * FROM review WHERE room = {roomId}"

        r = selectOne(sql)

        if not r :
            return None

        review = Review(r[0],r[1],r[2],r[3],r[4],r[5],r[6])

        return review


    @staticmethod
    def existsByWriterAndRoom(roomId, writerId):

        sql = f"SELECT EXISTS (SELECT id FROM review WHERE writer = {writerId} AND room = {roomId})"

        result = selectOne(sql)[0]

        return True if result == 1 else False