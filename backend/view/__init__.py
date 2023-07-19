from backend.controller import selectAll, selectOne, commit
from datetime import datetime

def getFormattedDate(curDate):      # 날짜 포맷 상세시간까지
    date_object = datetime.strptime(curDate, "%Y-%m-%d %H:%M:%S")
    formatted_datetime = date_object.strftime("%Y-%m-%d %H:%M:%S")
    
    return formatted_datetime

def formatDateToString(date):      # datetime type to string
    return datetime.strftime(date, "%Y-%m-%d %H:%M:%S")


def mainFormattedDate(curDate):     # 날짜 포맷 월/일 만
    if isinstance(curDate, str):        
        curDate = datetime.strptime(curDate, "%Y-%m-%d %H:%M:%S")
        
    formatted_date = curDate.strftime("%m-%d")
    
    return formatted_date


def nicknameToId(memId):
        sql = f"select id from member where nickname = '{str(memId)}'"
        id = selectOne(sql)
        
        return id[0]
    
def IdtoMemId(id):
    sql = f"select memId from member where id = '{str(id)}'"
    id = selectOne(sql)
    
    return id[0]

def findNickName(id):
    sql = f"select nickname from member where id = '{str(id)}'"
    nickname = selectOne(sql)
    
    return nickname[0]