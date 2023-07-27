from flask_login import UserMixin

from backend.controller import commit
from backend.controller import selectOne

class Member(UserMixin):

    def __init__(self, id, memId, pw, nickname, email, image, isAdmin):
        self.__id = id
        self.__memId = memId
        self.__password = pw
        self.__nickname = nickname
        self.__email = email
        self.__image = image
        self.__isAdmin = isAdmin

    def get_id(self): # UserMixin's get_id() override
        return str(self.__id)

    @property
    def memId(self):
        return self.__memId

    @property
    def password(self):
        return self.__password

    @property
    def nickname(self):
        return self.__nickname

    @property
    def email(self):
        return self.__email
    
    @property
    def image(self):
        return self.__image

    @staticmethod
    def existsByEmail(email) : # for 이메일 중복 체크

        sql = f"SELECT EXISTS (SELECT id FROM member WHERE email = '{email}')"

        result = selectOne(sql)[0]

        return True if result == 1 else False

    @staticmethod
    def existsById(memId) : # for 아이디 중복 체크

        sql = f"SELECT EXISTS (SELECT id FROM member WHERE memId = '{memId}')"

        result = selectOne(sql)[0]

        return True if result == 1 else False

    @staticmethod
    def existsByNickname(nickname) : # for 닉네임 중복 체크

        sql = f"SELECT EXISTS (SELECT id FROM member WHERE nickname = '{nickname}')"

        result = selectOne(sql)[0]

        return True if result == 1 else False

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
    def updatePassword(id, newPw):

        sql = f"UPDATE member SET password = '{newPw}' WHERE id = {id}"

        done = commit(sql)

        return done

    @staticmethod
    def updateNickname(id, newNick):

        sql = f"UPDATE member SET nickname = '{newNick}' WHERE id = {id}"

        done = commit(sql)

        return done

    @staticmethod
    def updateImage(id, newImage):

        sql = f"UPDATE member SET image = '{newImage}' WHERE id = {id}"

        done = commit(sql)

        return done

    @staticmethod
    def delete(memId):

        sql = f"DELETE FROM member WHERE memId = '{str(memId)}'"

        done = commit(sql)

        return done