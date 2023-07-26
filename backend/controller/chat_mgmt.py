from backend.model.db_mysql import conn_mysql
from backend.controller import commit, selectAll, selectOne
from datetime import datetime
from flask import Flask, jsonify

class chat(): 
    def __init__(self, sender, receiver, content, curDate):
        self._sender = sender
        self._receiver = receiver
        self._content = content
        self._curDate = curDate
        
    def insertChat(sender, receiver, content, curDate):

        sql = f"INSERT INTO chat(sender, receiver, content, curDate) VALUES ({sender}, {receiver}, '{content}', '{curDate}')"

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
        sql = f"select id from member"
        
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
    
    @property
    def sender(self):
        return self._sender
    @property
    def receiver(self):
        return self._receiver
    @property
    def content(self):
        return self._content
    @property
    def curDate(self):
        return self._curDate
    