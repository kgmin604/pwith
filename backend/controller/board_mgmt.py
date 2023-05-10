from model.db_mysql import conn_mysql
from datetime import datetime

class studyPost() :
    def __init__(self, studyID, title, writer, curDate, content, category, views, joiningP, totalP):
        self.studyID = studyID
        self.title = title
        self.writer = writer
        self.curDate = curDate
        self.content = content
        self.category = category
        self.views = views
        self.joningP = joiningP
        self.totalP = totalP
        
    @staticmethod
    def insertStudy(studyID, title, writer, curDate, content, category, views, joiningP, totalP):
        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()
        
        sql = f"INSERT INTO study VALUES ('{studyID}', '{str(title)}', '{str(writer)}', '{curDate}', '{str(content)}', '{str(category)}', '{views}', '{joiningP}', '{totalP}')"
        cursor_db.execute(sql)
        mysql_db.commit() 
        
    @staticmethod
    def deleteStudy(studyID):
        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()
        
        sql = f"DELETE FROM study WHERE studyID = " + studyID
        cursor_db.execute(sql)
        mysql_db.commit() 
        
    @staticmethod
    def updateStudy(studyID, title, curDate, content, views, category, joiningP, totalP):
        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()
        
        sql = f"UPDATE study set title = " +title + "curDate = " + curDate + "content = " + content+ "views =" + views +"category = "+category+"joiningP = "+joiningP +"totalP = "+ totalP +  "WHERE studyID = " + studyID
        cursor_db.execute(sql)
        mysql_db.commit() 
        
    @staticmethod
    def incIndex(id):       #인덱스 1씩 증가하는 함수
        return id+1
    
    @staticmethod
    def incView(views):     #조회수 1씩 증가하는 함수
        return views+1
    
    @staticmethod
    def incJoningP(joningP):        #가입자 1씩 증가하는 함수
        return joningP+1
    
    @staticmethod
    def curdate():
        now = datetime.now()
        return now.date()
    
    @staticmethod
    def getStudy():
        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()
        
        sql = "select * from study"
        cursor_db.execute(sql)
        rows = cursor_db.fetchall()
        print(rows)
        mysql_db.commit() 