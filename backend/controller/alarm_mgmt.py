from backend.controller import commit, selectAll, selectOne, rollback
from flask import Flask, jsonify

class alarm():
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
            if row[4] == 2:
                # mentoring 
                sql = f"select brief from portfolio where id = '{row[3]}'"
            if row[4] == 3:
                #study reply content
                sql = f"select content from replyStudy where id = '{row[3]}'"
            if row[4] == 4:
                #qna reply content
                sql = f"select content from replyQna where id = '{row[3]}'"
            if row[4] == 5:
                #chat content
                sql = f"select content from chat where id = '{row[3]}'"
            
            content = selectOne(sql)
        
            record = {
                'id': row[0],     
                'memId': row[1],   
                'oppId': row[2],    
                'contentId': row[3],
                'contentType': row[4],
                'reading' : row[5],
                'content' : str(content[0][0])
            }
            result.append(record)
        print(result)
        print("====result=====")
        return result