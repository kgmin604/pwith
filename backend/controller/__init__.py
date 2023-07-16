from backend.model.db_mysql import conn_mysql
    
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