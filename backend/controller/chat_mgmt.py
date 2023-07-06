from backend.model.db_mysql import conn_mysql
from datetime import datetime
from flask import Flask, jsonify

class chat(): 
    def __init__(self, sender, receiver, content, curDate):
        self.sender = sender
        self.receiver = receiver
        self.content = content
        self.curDate = curDate
        
    def insertChat(sender, receiver, content, curDate):
        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()
        
        sql = f"INSERT INTO chat ( sender, receiver, content, curDate ) VALUES ('{str(sender)}', '{str(receiver)}', '{str(content)}', '{str(curDate)}' )"
        done = cursor_db.execute(sql)
        mysql_db.commit() 
        mysql_db.close()
        print("insert 완")
        return done
    
    def getMyChat(memId, oppId):
        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()
        print(memId , oppId)
        
        sql = f"select distinct * from chat where (sender = '{str(memId)}' and receiver = '{str(oppId)}') or (sender = '{str(oppId)}' and receiver = '{str(memId)}') order by curDate desc"
        cursor_db.execute(sql)
        
        rows = cursor_db.fetchall()
        mysql_db.close()
        print(rows)
        
        return rows
        
    def getAllChat(memId):
        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()
        
        sql = f"select  * from chat where sender = '{str(memId)}' or receiver = '{str(memId)}' group by receiver order by curDate desc"

        cursor_db.execute(sql)
        rows = cursor_db.fetchall()
        print(rows)
        
        mysql_db.close()
        
        return rows
    
    def chkOppId(oppId):
        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()
        
        sql = f"select memId from member"
        cursor_db.execute(sql)
        memIdList = cursor_db.fetchall()
        #print(memIdList)
        mysql_db.close()
        
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