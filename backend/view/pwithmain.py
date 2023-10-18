from flask import Blueprint, request
from flask_login import current_user
from backend.controller.study_mgmt import studyPost
from backend.controller.mentor_mgmt import Portfolio
from backend.controller.alarm_mgmt import alarm
from backend.model.db_mongo import conn_mongodb
from backend.view import findNickName, login_required

main_bp = Blueprint('pwithmain', __name__, url_prefix='')

@main_bp.route('/check', methods=['GET'])
@login_required
def chkLogin(loginMember, new_token):

    isSocial = False
    if request.cookies.get('provider') in ['GOOGLE', 'NAVER', 'KAKAO']:
        isSocial = True

    return {
        'status': 200,
        'message': '로그인 상태',
        'data': {
            'id': loginMember.memId,
            'nickname': loginMember.nickname,
            'isSocial': isSocial
        }
    }

@main_bp.route('/list', methods = ['GET'])
def showStudy():
    
        studyList = []
        newsList = []
        mentoringList = []
        contentsList = []

        posts = studyPost.getNStudy(5)
        for post in posts :
            post = {
                'id' : post[0],
                'title' : post[1],
            }
            studyList.append(post)
        # print(studyList)

        news_db = conn_mongodb().ITnews_crawling.find().sort('_id', -1).limit(5)
        for news in news_db :
            newsList.append({
                'title' : news['title'],
                'url' : news['url']
            })
            
        mentorings = Portfolio.getNmentoring()
        for portfolio in mentorings:
            portfolio = {
                'id' : portfolio[0],
                'brief' : portfolio[1]
            }
            mentoringList.append(portfolio)
            
        book_db = conn_mongodb().book_crawling.aggregate([
            { "$sample": { "size": 2 } }
        ])

        for book in book_db :
            contentsList.append({
                'title' : book['title'],
                'img' : book['img'],
                'url' : book['url']
            })
            
        lecture_db = conn_mongodb().lecture_crawling.aggregate([
            { "$sample": { "size": 2 } }
        ])
        for lecture in lecture_db :
            contentsList.append({
                'title' : lecture['title'],
                'img' : lecture['img'],
                'url' : lecture['link']
            })

        return {
            'study' : studyList,
            'news' : newsList,
            'mentoring' : mentoringList,
            'contents' : contentsList
        }
        
@main_bp.route('/alarm', methods = ['GET'])
def showalarm():
    # 알림창
    
    #chatAlarm 에서 memId = current_user.id 인 것 select
    #studyReplyAlarm 에서 memId = current_user.id 인 것 select
    #qnaReplyAlarm 에서 memId = current_user.id 인 것 select
    #studyAlarm 에서 memId = current_user.id 인 것 select
    
    memId = current_user.id
    
    chat = alarm.getChatAlarm(memId)
    studyReply = alarm.getStudyReplyAlarm(memId)
    qnaReply = alarm.getQnaReplyAlarm(memId)
    study = alarm.getStudyAlarm(memId)
    
    totalAlarm = chat+studyReply+qnaReply+study
    post = []
    alarmList = []
    
    print(totalAlarm)
    print(chat)
    print(studyReply)
    
    
    
    for row in totalAlarm:
        print(row)
        post = {
            'id' : row['id'],
            'type' : row['type'],
            'memId': row['memId'],
            'memNick' : findNickName(row['memId']),
            'oppId': row['oppId'],
            'oppNick' : findNickName(row['oppId']),
            'contentId' : row['contentId'],
            'content' : row['content'],
            'reading' : row['reading']
        }
        
        alarmList.append(post)
        
        
    
    
    #return{
    #    'alarmList': alarmList
    #}
    
# @main_bp.route('/', methods = ['GET'])      # 전체 검색
# def search():
    
#     search = request.args.get('search')
    
#     if int(search) == 1:
        
#         searchType = request.args.get('type')
#         searchValue = request.args.get('value')
        
        