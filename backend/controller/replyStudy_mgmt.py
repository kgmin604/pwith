from backend.controller import commit, commitAndGetId, selectOne, selectAll

class ReplyStudy :
    def __init__(self, id, writer, content, curDate, studyId) :
        self.id = id
        self.writer = writer
        self.content = content
        self.curDate = curDate
        self.studyId = studyId

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