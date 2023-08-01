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
    
    # rows 리스트의 각 요소들에 있는 "date" 키를 기준으로 정렬하는 함수
        
    def getAllChat(memId):
        sql = f"select  id, receiver, content, curDate from chat where sender = '{str(memId)}' group by receiver"
        sql2 = f"select id, sender, content, curDate from chat where receiver = '{str(memId)}' group by sender" 

        rows1 = selectAll(sql)
        rows2 = selectAll(sql2)
        
        rows = rows1+rows2
        print(rows)
        
        def get_datetime_key(row):
            return row[3]
        
        sorted_rows = sorted(rows, key=get_datetime_key, reverse=True)
        return sorted_rows
    
    
    def chkOppId(oppId):
        sql = f"select id from member where nickname = '{str(oppId)}'"
        
        memId = selectOne(sql)
        
        if memId is not None:
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
    