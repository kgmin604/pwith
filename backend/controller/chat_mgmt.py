from model.db_mysql import conn_mysql
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
        return done
    
    def getMyChat(memId, oppId):
        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()
        
        sql = f"select * from chat where sender = '{str(memId)}' and receiver = '{str(oppId)}'"
        cursor_db.execute(sql)
        
        rows = cursor_db.fetchall()
        
        return rows
        
    def getAllChat(memId):
        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()
        
        sql = f"select * from chat where sender = 'a' or receiver = 'a'"

        cursor_db.execute(sql)
        rows = cursor_db.fetchall()
        print(rows)
        
        # mysql_db.close()
        # print(rows)
        
        return rows
    
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