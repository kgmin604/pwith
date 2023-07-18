from backend.controller import commit, commitAndGetId, selectOne, selectAll

class ReplyQna :
    def __init__(self, id, writer, content, curDate, qnaId) :
        self.id = id
        self.writer = writer
        self.content = content
        self.curDate = curDate
        self.qnaId = qnaId

    @staticmethod
    def writeReply(writer, content, curDate, qnaId) :

        sql = f"INSERT INTO replyQna(writer, content, curDate, qnaId) VALUES({writer}, '{content}', '{curDate}', {qnaId})"

        replyId = commitAndGetId(sql)

        return replyId

    @staticmethod
    def modifyReply(id, newCnt) :

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