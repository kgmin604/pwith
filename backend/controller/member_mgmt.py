from flask_login import UserMixin

from backend.controller import commit
from backend.controller import selectOne

class Member(UserMixin):

    def __init__(self, id, memId, pw, nickname, email, image, isAdmin):
        self._id = id
        self._memId = memId
        self._password = pw
        self._nickname = nickname
        self._email = email
        self._image = image
        self._isAdmin = isAdmin

    # ⛔ 정윤아 get_id()는 오버라이드한 거라 property 접근법으로 수정할 때 안 해도 돼 ~! ⛔

    def get_id(self): # UserMixin's get_id() override
        return str(self._id)

    @property
    def memberId(self):
        return self._memId

    @property
    def nickname(self):
        return str(self._nickname)

    @property
    def email(self):
        return str(self._email)
    
    @property
    def password(self):
        return self._password

    @staticmethod
    def findById(id):

        sql = f"SELECT * FROM member WHERE id = {id}"

        mem = selectOne(sql)

        if not mem:
            return None

        member = Member(mem[0], mem[1], mem[2], mem[3], mem[4], mem[5], mem[6])

        return member

    @staticmethod
    def findByMemberId(memId):

        sql = f"SELECT * FROM member WHERE memId = '{memId}'"

        mem = selectOne(sql)

        if not mem:
            return None

        member = Member(mem[0], mem[1], mem[2], mem[3], mem[4], mem[5], mem[6])

        return member
    
    @staticmethod
    def save(memId, pw, nickname, email):

        sql = f"INSERT INTO member(memId, password, nickname, email) VALUES ('{memId}', '{pw}', '{nickname}', '{email}')"

        done = commit(sql)

        return done

    @staticmethod
    def changePw(memId, oldPw, newPw):

        sql = f"UPDATE member SET password = '{newPw}' WHERE memId = '{memId}' and password = '{oldPw}'"

        done = commit(sql)

        return done

    @staticmethod
    def changeEmail(memId, newEmail):

        sql = f"UPDATE member SET email = '{newEmail}' WHERE memId = '{memId}'"

        done = commit(sql)

        return done

    @staticmethod
    def delete(memId):

        sql = f"DELETE FROM member WHERE memId = '{str(memId)}'"

        done = commit(sql)

        return done