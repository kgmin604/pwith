from backend.controller import commit, selectAll, selectOne, rollback
from flask import Flask, jsonify

class alarm():
    def __init__(self, id, memId, oppId, contentId, reading):
        self.__id = id
        self.__memId = memId
        self.__oppId = oppId
        self.__contentId = contentId
        self.__reading = reading
    
    @staticmethod
    def getAllChatAlarm(memId):
        sql  = f"select * from chatAlarm where memId = '{memId}'"
        
        row = selectAll(sql)
        
        return row

    @staticmethod
    def getAllStudyReplyAlarm(memId):
        sql  = f"select * from replyStudyAlarm where memId = '{memId}'"
        
        row = selectAll(sql)
        
        return row

    @staticmethod
    def getAllQnaReplyAlarm(memId):
        sql  = f"select * from replyQnaAlarm where memId = '{memId}'"
        
        row = selectAll(sql)
        
        return row

    @staticmethod
    def getAllStudyAlarm(memId):
        sql  = f"select * from studyAlarm where memId = '{memId}'"
        
        row = selectAll(sql)
        
        return row
    
    @staticmethod
    def getChatAlarm(memId):
        sql  = f"select * from chatAlarm where memId = '{memId}' and reading = False"
        
        rows = selectAll(sql)
        
        result = []
        for row in rows:
            
            sql = f"select content from chat where id = '{row[3]}'"
            content = selectAll(sql)
        
            record = {
                'id': row[0],     # id에 해당하는 값
                'memId': row[1],   # name에 해당하는 값
                'oppId': row[2],    # age에 해당하는 값
                'contentId': row[3],
                'reading' : row[4],
                'type': '1',
                'content' : str(content[0][0])
            }
            result.append(record)

        return result

    @staticmethod
    def getStudyReplyAlarm(memId):
        sql  = f"select * from replyStudyAlarm where memId = '{memId}' and reading = False"
        
        rows = selectAll(sql)
        
        result = []
        for row in rows:
            
            sql = f"select content from replyStudy where id = '{row[3]}'"
            content = selectAll(sql)
        
            record = {
                'id': row[0],     # id에 해당하는 값
                'memId': row[1],   # name에 해당하는 값
                'oppId': row[2],    # age에 해당하는 값
                'contentId': row[3],
                'reading' : row[4],
                'type': '2',
                'content' : str(content[0][0])
            }
            result.append(record)

        return result

    @staticmethod
    def getQnaReplyAlarm(memId):
        sql  = f"select * from replyQnaAlarm where memId = '{memId}' and reading = False"
        
        rows = selectAll(sql)
        
        result = []
        for row in rows:
            
            sql = f"select content from replyQna where id = '{row[3]}'"
            content = selectAll(sql)
            
            record = {
                'id': row[0],     # id에 해당하는 값
                'memId': row[1],   # name에 해당하는 값
                'oppId': row[2],    # age에 해당하는 값
                'contentId': row[3],
                'reading' : row[4],
                'type': '3',
                'content' : str(content[0][0])
            }
            result.append(record)

        return result

    @staticmethod
    def getStudyAlarm(memId):
        sql  = f"select * from studyAlarm where memId = '{memId}' and reading = False"
        
        rows = selectAll(sql)
        
        result = []
        for row in rows:
            sql = f"select name from studyRoom where id = '{row[3]}'"
            content = selectAll(sql)
        
            record = {
                'id': row[0],     # id에 해당하는 값
                'memId': row[1],   # name에 해당하는 값
                'oppId': row[2],    # age에 해당하는 값
                'contentId': row[3],
                'reading' : row[4],
                'type': '4',
                'content' : str(content[0][0])
            }
            result.append(record)

        return result
    