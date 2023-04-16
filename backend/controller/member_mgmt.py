from flask_login import UserMixin
from model.db_mysql import conn_mysql

class Member(UserMixin):

    def __init__(self, memId, pw, name, email):
        self.id = memId
        self.pw = pw
        self.name = name
        self.email = email

    def get_id(self):
        return str(self.id)

    @staticmethod
    def findById(memId):
        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()
        sql = f"SELECT * FROM member WHERE memId = '{str(memId)}'"
        # print (sql)
        cursor_db.execute(sql)
        mem = cursor_db.fetchone()
        if not mem:
            return None

        member = Member(mem[0], mem[1], mem[2])
        return member

    @staticmethod
    def insert(memId, pw, name, email):
        mem = Member.findById(memId)
        if mem == None :
            mysql_db = conn_mysql()
            cursor_db = mysql_db.cursor()
            # sql = f"INSERT INTO member(memId, memPw, memName, memEmail) VALUES ('{memId}', '{pw}', '{name}', '{email}')"
            sql = f"INSERT INTO member(memId, memPw, memName, memEmail) VALUES ('{str(memId)}', '{str(pw)}', '{str(name)}', '{str(email)}')"
            cursor_db.execute(sql)
            mysql_db.commit()
            return Member.findById(memId)
        else :
            return mem

    @staticmethod
    def delete(memId):
        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()
        sql = f"DELETE FROM member WHERE memId = '{str(memId)}'"
        done = cursor_db.execute(sql)
        mysql_db.commit()
        return done