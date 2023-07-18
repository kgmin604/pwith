from backend.model.db_mysql import conn_mysql
from backend.controller import commit, selectAll, selectOne
from datetime import datetime
from flask import Flask, jsonify

class chat(): 
    def __init__(self, sender, receiver, content, curDate):
        self.sender = sender
        self.receiver = receiver
        self.content = content
        self.curDate = curDate
        
    def insertChat(sender, receiver, content, curDate):
        sql = f"INSERT INTO chat ( sender, receiver, content, curDate ) VALUES ('{str(sender)}', '{str(receiver)}', '{str(content)}', '{str(curDate)}' )"
        done = commit(sql)
        
        return done
    
    def getMyChat(memId, oppId):
        sql = f"select distinct * from chat where (sender = '{str(memId)}' and receiver = '{str(oppId)}') or (sender = '{str(oppId)}' and receiver = '{str(memId)}') order by curDate desc"
        
        rows = selectAll(sql)
        print(rows)
        
        return rows
        
    def getAllChat(memId):
        sql = f"select  * from chat where sender = '{str(memId)}' or receiver = '{str(memId)}' group by receiver order by curDate desc"

        rows = selectAll(sql)
        
        return rows
    
    def chkOppId(oppId):
        sql = f"select memId from member"
        
        memIdList = selectAll(sql)
        
        for memId in memIdList:
            memId = memId[0]  # 튜플의 첫 번째 요소만 가져옴
            print(memId)
        
            if oppId == memId:
                #print("oppId =", oppId)
                return True
                
        return False
            
    
    def curdate():  # date 구하는 함수
        now = datetime.now()
        return str(now)
    
    def getSender(self):
        return self.sender
    
    def getReceiver(self):
        return self.receiver
    
    def getContent(self):
        return self.content
    
    def getCurDate(self):
        return self.curDate
    
    def getFormattedDate(curDate):
        formatted_datetime = curDate.strftime("%Y-%m-%d %H:%M:%S")
        return formatted_datetime  # 출력 예: 2023-06-21 14:30:45