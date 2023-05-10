from model.db_mysql import conn_mysql

class bootPost() :
    def __init__(self, bootID, title, writer, curDate, content, category, views, likes):
        self.bootID = bootID
        self.title = title
        self.writer = writer
        self.curDate = curDate
        self.content = content
        self.category = category
        self.views = views
        self.likes = likes
        
    @staticmethod
    def insertStudy(bootID, title, writer, curDate, content, category, views, likes):
        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()
        
        sql = f"INSERT INTO study VALUES ('{bootID}', '{str(title)}', '{str(writer)}', '{curDate}', '{str(content)}', '{str(category)}', '{views}', '{joiningP}', '{totalP}')"
        cursor_db.execute(sql)
        mysql_db.commit() 
        
    @staticmethod
    def deleteStudy(bootID):
        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()
        
        sql = f"DELETE FROM study WHERE studyID = " + bootID
        cursor_db.execute(sql)
        mysql_db.commit() 
        
    @staticmethod
    def updateStudy(bootID, title, curDate, content, views, category, joiningP, totalP):
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
    def incLikes(likes):        #가입자 1씩 증가하는 함수
        return likes+1