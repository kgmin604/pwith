from backend.model.db_mysql import conn_mysql
from backend.controller import commit, selectAll, selectOne
from datetime import datetime
from flask import Flask, jsonify

class chat(): 
    def __init__(self, id, sender, receiver, content, curDate):
        self.__id = id
        self.__sender = sender
        self.__receiver = receiver
        self.__content = content
        self.__curDate = curDate
        
    @property
    def id(self):
        return self.__id
    @property
    def sender(self):
        return self.__sender
    @property
    def receiver(self):
        return self.__receiver
    @property
    def content(self):
        return self.__content
    @property
    def curDate(self):
        return self.__curDate
        
    def insertChat(sender, receiver, content, curDate):

        sql = f"INSERT INTO chat(sender, receiver, content, curDate) VALUES ({sender}, {receiver}, '{content}', '{curDate}')"

        done = commit(sql)
        
        return done
    
    def getOneChat(sender, receiver):
        
        print(sender, receiver)
        sql = f"select * from chat where sender = '{int(sender)}' and receiver = '{int(receiver)}' order by curDate desc "
        
        chatId = selectOne(sql)
        print(chatId[0])
        return chatId[0]
    
    def getMyChat(memId, oppId):
        sql = f"select  * from chat where (sender = '{str(memId)}' and receiver = '{str(oppId)}') or (sender = '{str(oppId)}' and receiver = '{str(memId)}') order by curDate desc"
        
        rows = selectAll(sql)
        
        return rows
    
    # rows 리스트의 각 요소들에 있는 "date" 키를 기준으로 정렬하는 함수
        
    def getAllChat(memId):
        # sql = f"select CASE WHEN sender = '{memId}' THEN receiver WHEN receiver = '{memId}' THEN sender END AS other_user, content, curDate from chat WHERE sender = '{memId}' OR receiver = '{memId}' group by other_user"
        sql = f'''SELECT
                    other_user,
                    content,
                    curDate
                FROM (
                    SELECT
                        CASE WHEN sender = '{memId}' THEN receiver ELSE sender END AS other_user,
                        content,
                        curDate,
                        ROW_NUMBER() OVER (PARTITION BY CASE WHEN sender = '{memId}' THEN receiver ELSE sender END ORDER BY curDate DESC) AS rn
                    FROM chat
                    WHERE sender = '{memId}' OR receiver = '{memId}'
                ) AS chat_with_rn
                WHERE rn = 1
                ORDER BY curDate desc'''

        rows = selectAll(sql)
        
        print(rows)
        
        return rows
    
    
    def chkOppId(oppId):
        sql = f"select id from member where nickname = '{str(oppId)}'"
        
        memId = selectOne(sql)
        
        if memId is not None:
            return True
                
        return False
            
    
    def curdate():  # date 구하는 함수
        now = datetime.now()
        return str(now)
    
    
    def insertChatAlarm(memId, oppId, id):
            sql = f"insert into chatAlarm (memId, oppId, contentId) values ('{memId}', '{oppId}', '{id}')"
            
            done = commit(sql)
            
            return done
    