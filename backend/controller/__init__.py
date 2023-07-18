from backend.model.db_mysql import conn_mysql
from datetime import datetime
    
def selectOne(sql) :

    mysql_db = conn_mysql()
    cursor_db = mysql_db.cursor()

    cursor_db.execute(sql)

    result = cursor_db.fetchone()

    mysql_db.close()
    
    return result

def selectAll(sql) :

    mysql_db = conn_mysql()
    cursor_db = mysql_db.cursor()

    cursor_db.execute(sql)

    result = cursor_db.fetchall()

    mysql_db.close()
    
    return result

def commit(sql) :

    mysql_db = conn_mysql()
    cursor_db = mysql_db.cursor()

    done = cursor_db.execute(sql)

    mysql_db.commit()

    mysql_db.close()

    return done

def commitAndGetId(sql) :

    mysql_db = conn_mysql()
    cursor_db = mysql_db.cursor()

    done = cursor_db.execute(sql)

    mysql_db.commit()

    if done == 1 :
        id = cursor_db.lastrowid

    mysql_db.close()

    return id

def rollback(sql) :

    mysql_db = conn_mysql()
    
    mysql_db.rollback()

    mysql_db.close()


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