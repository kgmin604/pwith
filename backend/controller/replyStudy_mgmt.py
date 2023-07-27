from backend.controller import commit, commitAndGetId, selectOne, selectAll

class ReplyStudy :
    def __init__(self, id, writer, content, curDate, studyId) :
        self.__id = id
        self.__writer = writer
        self.__content = content
        self.__curDate = curDate
        self.__studyId = studyId
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
    def curDate(self) :
        return self.__curDate
    @property
    def postId(self) :
        return self.__studyId

    @staticmethod
    def writeReply(writer, content, curDate, studyId) :

        sql = f"INSERT INTO replyStudy(writer, content, curDate, studyId) VALUES({writer}, '{content}', '{curDate}', {studyId})"

        replyId = commitAndGetId(sql)

        return replyId

    @staticmethod
    def modifyReply(id, newCnt) :

        sql = f"UPDATE replyStudy SET content = '{newCnt}' WHERE id = {id}"

        done = commit(sql)
        
        return done

    @staticmethod
    def removeReply(id) :

        sql = f"DELETE FROM replyStudy WHERE id = {id}"

        done = commit(sql)

        return done

    @staticmethod
    def showReplies(studyId) :

        sql = f"SELECT id, writer, content, curDate FROM replyStudy WHERE studyId = {studyId}"

        result = selectAll(sql)

        return result

    @staticmethod
    def findByWriterId(writer_id) :

        sql = f"SELECT * FROM replyStudy WHERE writer = {writer_id} ORDER BY curDate DESC"

        replies = selectAll(sql)

        result = []

        for r in replies : 
            result.append(ReplyStudy(r[0], r[1], r[2], r[3], r[4]))

        return result