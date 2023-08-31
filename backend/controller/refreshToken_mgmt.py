from backend.controller import commit, selectOne

class RefreshToken():
    def __init__(self, id, member_id, token, create_at):
        self.__id = id
        self.__member_id = member_id
        self.__token = token
        self.__create_at = create_at
    @property
    def id(self):
        return self.__id
    @property
    def member_id(self):
        return self.__member_id
    @property
    def token(self):
        return self.__token
    @property
    def create_at(self):
        return self.__create_at

    @staticmethod
    def save(member_id, token, date) :

        sql = f"INSERT INTO refreshToken(member, token, create_at) VALUES({member_id}, '{token}', '{date}')"

        done = commit(sql)
        
        return done

    @staticmethod
    def findMemberByToken(token) :

        sql = f"SELECT member FROM refreshToken WHERE token = '{token}'"

        try :
            member_id = selectOne(sql)[0]
        except :
            member_id = None

        return member_id

    @staticmethod
    def findTokenByMemberId(member_id) :

        sql = f"SELECT token FROM refreshToken WHERE member = {member_id}"

        try :
            token = selectOne(sql)[0]
        except :
            token = None
        
        return token

    @staticmethod
    def existsByToken(token) : # for what ?

        sql = f"SELECT EXISTS (SELECT id FROM refreshToken WHERE token = '{token}')"

        result = selectOne(sql)[0]

        return True if result == 1 else False

    @staticmethod
    def existsByMember(member_id) :

        sql = f"SELECT EXISTS (SELECT id FROM refreshToken WHERE member = {member_id})"

        result = selectOne(sql)[0]

        return True if result == 1 else False

    @staticmethod
    def deleteByMember(member_id):

        sql = f"DELETE FROM refreshToken WHERE member = {member_id}"

        done = commit(sql)

        return done