from backend.controller import commit, commitAndGetId, selectOne, selectAll

class ReplyQna :
    def __init__(self, id, writer, content, curDate, qnaId) :
        self.__id = id
        self.__writer = writer
        self.__content = content
        self.__curDate = curDate
        self.__qnaId = qnaId
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
        return self.__qnaId

    @staticmethod
    def writeReply(writer, content, curDate, qnaId) :

        content = content.replace("\'", "\"")

        sql = f"INSERT INTO replyQna(writer, content, curDate, qnaId) VALUES({writer}, '{content}', '{curDate}', {qnaId})"

        replyId = commitAndGetId(sql)

        return replyId

    @staticmethod
    def modifyReply(id, newCnt) :

        newCnt = newCnt.replace("\'", "\"")

        sql = f"UPDATE replyQna SET content = '{newCnt}' WHERE id = {id}"

        done = commit(sql)
        
        return done

    @staticmethod
    def removeReply(id) :

        sql = f"DELETE FROM replyQna WHERE id = {id}"

        done = commit(sql)

        return done

    @staticmethod
    def showReplies(qnaId) :

        sql = f"SELECT * FROM replyQna WHERE qnaId = {qnaId}"

        result = selectAll(sql)

        return result

    @staticmethod
    def findByWriterId(writer_id) :

        sql = f"SELECT * FROM replyQna WHERE writer = {writer_id} ORDER BY curDate DESC"

        replies = selectAll(sql)

        result = []

        for r in replies : 
            result.append(ReplyQna(r[0], r[1], r[2], r[3], r[4]))

        return result