from backend.controller import commit, selectAll, selectOne, rollback
from flask import Flask, jsonify

class Alarm():
    def __init__(self, id, memId, oppId, contentId, contentType, reading):
        self.__id = id
        self.__memId = memId
        self.__oppId = oppId
        self.__contentId = contentId
        self.__contentType = contentType
        self.__reading = reading
    
    @staticmethod
    def insertAlarm(memId, oppId, contentid, contentType):
        sql = f"insert into alarm (memId, oppId, contentId, contentType) values ('{memId}', '{oppId}', '{contentid}', '{contentType}')"
        
        done = commit(sql)
        
        return done
    
    @staticmethod
    def getAlarm(memId):
        sql  = f"select * from alarm where memId = '{memId}' order by id desc"
        
        rows = selectAll(sql)
        
        result = []
        for row in rows:
            if row[4] == 1:
                # studyRoom name
                sql = f"select name from studyRoom where id = '{row[3]}'"
                done = selectOne(sql)
                content = str(done[0][0])
                
                contentId = row[3]
            if row[4] == 2:
                # mentoring 
                print(row)
                sql = f"select id from mentoringRoom where id = '{row[3]}'"
                room = selectOne(sql)
                print(room)
                content = "/mentoring-room/" + str(room[0])
                
                contentId = row[3]
            if row[4] == 3:
                #study reply content
                sql = f"select content from replyStudy where id = {row[3]}"
                done = selectOne(sql)
                content = str(done[0])
                
                sql = f"select studyId from replyStudy where replyStudy.id = {row[3]}"
                done = selectOne(sql)
                contentId = done[0]
                
            if row[4] == 4:
                #qna reply content
                sql = f"select content from replyQna where id = '{row[3]}'"
                cdone = selectOne(sql)
                content = str(done[0])
                
                sql = f"select qnaId from qna, replyQna where replyQna.id = {row[3]}"
                done = selectOne(sql)
                contentId = done[0]
                
            if row[4] == 5:
                #chat content
                sql = f"select content from chat where id = '{row[3]}'"
                done = selectOne(sql)
                content = str(done[0])
                
                contentId = row[3]
            if row[4] == 6:
                # mentoring 
                # sql = f"select id from mentoringRoom where id = '{row[3]}'"
                # room = selectOne(sql)
                content = "멘토링룸이 삭제되었습니다"
                contentId = row[3]
            
            print(contentId)
            record = {
                'id': row[0],     
                'memId': row[1],   
                'oppId': row[2],    
                'contentId': contentId,
                'contentType': row[4],
                'reading' : row[5],
                'content' : content
            }
            result.append(record)
        print(result)
        print("====result=====")
        return result
    
    
    @staticmethod
    def readAlarm():
        sql  = f"update alarm set reading = 1 "
        
        done = commit(sql)
        
    @staticmethod
    def chkAlarm():

        sql  = f"SELECT COUNT(reading) FROM alarm WHERE reading = false"
        
        unread_count = selectOne(sql)[0]

        return unread_count > 0