from backend.controller import commit, commitAndGetId, selectAll, selectOne

class Refund() :
    def __init__(self, id, memId, bank, account, balance, curDate, checked):
        self.__id = id
        self.__memId = memId
        self.__bank = bank
        self.__account = account
        self.__balance = balance
        self.__curDate = curDate
        self.__checked = checked
    @property
    def id(self) :
        return self.__id
    @property
    def memId(self) :
        return self.__memId
    @property
    def bank(self) :
        return self.__bank
    @property
    def account(self) :
        return self.__account
    @property
    def balance(self) :
        return self.__balance
    @property
    def curDate(self) :
        return self.__curDate
    @property
    def checked(self) :
        return self.__checked
    
    @staticmethod
    def save(memId, bank, account, balance, curDate) :

        sql = f"INSERT INTO refund(memId, bank, account, balance, curDate) VALUE ({memId}, '{bank}', '{account}', {balance}, '{curDate}')"

        done = commit(sql)
        
        return done
    
    def getAllInfo():
        sql = f"select member.memId, bank, account, balance, curDate, checked from refund, member where refund.memId = member.id"
        
        rows = selectAll(sql)
        
        return rows
    