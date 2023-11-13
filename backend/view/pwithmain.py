from flask import Blueprint, request
from flask_login import current_user
from backend.controller.study_mgmt import studyPost
from backend.controller.mentor_mgmt import Portfolio
from backend.controller.community_mgmt import QNAPost
from backend.controller.alarm_mgmt import Alarm
from backend.model.db_mongo import conn_mongodb
from backend.view import findNickName, login_required

main_bp = Blueprint('pwithmain', __name__, url_prefix='')

@main_bp.route('/check', methods=['GET'])
@login_required
def chkLogin(loginMember, new_token):

    isSocial = False
    if request.cookies.get('provider') in ['GOOGLE', 'NAVER', 'KAKAO']:
        isSocial = True
        
    unread = Alarm.chkAlarm()
    #unread = True

    return {
        'status': 200,
        'message': '로그인 상태',
        'data': {
            'id': loginMember.memId,
            'nickname': loginMember.nickname,
            'isSocial': isSocial,
            'unread' : unread
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
@login_required
def showalarm(loginMember, new_token):
    # 알림창
    
    #chatAlarm 에서 memId = current_user.id 인 것 select
    #studyReplyAlarm 에서 memId = current_user.id 인 것 select
    #qnaReplyAlarm 에서 memId = current_user.id 인 것 select
    #studyAlarm 에서 memId = current_user.id 인 것 select
    
    memId = loginMember.id
    
    
    post = []
    alarmList = []
    alarmLists = []
    
    alarmLists = Alarm.getAlarm(memId)
    
    #print(alarmList)
    for row in alarmLists:
       #print(row)
       post = {
           #'id' : row['id'],
           'contentId' : row['contentId'],
           'type': row['contentType'],
           'content' : row['content'],
       }
        
       alarmList.append(post)
        
    # unread 여부 확인

    Alarm.readAlarm()
    # print(unread)
    
    # print(alarmList)
    
    return{
       'data': {
           'alarmList' : alarmList
       },
       'access_token' : new_token
    }
    
    
    # 전체 검색 페이지네이션, 책, 강의  id 추가 - 정윤
@main_bp.route('/search', methods = ['GET'])      # 전체 검색
def search():
    
    searchValue = ""
        
    searchType = request.args.get('type')
    searchValue = request.args.get('value')
    searchCategory = request.args.get('search')
    
    print(searchType, searchValue, searchCategory)
    
    if searchType == None:
        searchType = ""
    
    print(searchType, searchValue, searchCategory)
    result = []
    page = 0

    page = request.args.get('page')
    print(page)
    

    if not page :
        page = 0
    #     return jsonify(result)

    page = int(page)
    posts = []
    
    
    if searchCategory == "study":
        if int(searchType) == 0: # 제목으로 검색
            studyposts = studyPost.findByTitle(searchValue)
        elif int(searchType) == 1 : # 글쓴이로 검색
            studyposts = studyPost.findByWriter(searchValue)
            print("study select")
            
        if studyposts is not None:
            for i in range(len(studyposts)) :
                post = {
                    'id' : i+1,
                    'postId' : studyposts[i][0],
                    'title' : studyposts[i][1],
                    'nickname': findNickName(studyposts[i][2]),
                }
                posts.append(post)
                
    if searchCategory == "qna":
        if int(searchType) == 0: # 제목으로 검색
            qnaposts = QNAPost.findByTitle(searchValue)
            print("qna select")
            print(qnaposts)
            
        elif int(searchType) == 1 : # 글쓴이로 검색
            qnaposts = QNAPost.findByWriter(searchValue)
            print("qna select")
            
        if qnaposts is not None:
            for i in range(len(qnaposts)) :
                post = {
                    'id' : i+1,
                    'postId' : qnaposts[i][0],
                    'title' : qnaposts[i][1],
                    'nickname': findNickName(qnaposts[i][2]),
                }
                posts.append(post)
            
    if searchCategory == "portfolio":
        if int(searchType) == 0: # 제목으로 검색
            portfolioposts = Portfolio.findByTitle(searchValue)
            
        elif int(searchType) == 1 : # 글쓴이로 검색
            portfolioposts = Portfolio.findByMento(searchValue)
            print("portfolio select")
            
        if portfolioposts is not None:
            for i in range(len(portfolioposts)) :
                post = {
                    'id' : i+1,
                    'postId' : portfolioposts[i][0],
                    'title' : portfolioposts[i][2],
                    'nickname': findNickName(portfolioposts[i][1]),
                }
                posts.append(post)
            
    if searchCategory == "book":
        if int(searchType) == 0: # 제목으로 검색
            regex = f".*{searchValue}.*"
            
            bookposts =  conn_mongodb().book_crawling.find({'title' : {'$regex' : regex }})
            print("=========book=========")
            
        elif int(searchType) == 1 : # 글쓴이로 검색
            bookposts = []
            
        if bookposts is not None:
            i=0
            for book in bookposts:
                posts.append({
                    'id': i,
                    'title' : book['title'],
                    'instructor' : book['writer'],
                    'link' : book['url'],
                    'image': book['img'],
                    'type' : book['type']
                })
                i+=1
        
    if searchCategory == "lecture":
        if int(searchType) == 0: # 제목으로 검색
            regex = f".*{searchValue}.*"
            
            lectureposts = conn_mongodb().lecture_crawling.find({'title' : {'$regex' : regex}})
            print("=========lecture===========")
            
        elif int(searchType) == 1 : # 글쓴이로 검색
            lectureposts = []
        
        if lectureposts is not None:
            i=0
            for lecture in lectureposts:
                posts.append({
                    'id' : i,
                    'title' : lecture['title'],
                    'instructor' : lecture['instructor'],
                    'link' : lecture['link'],
                    'image': lecture['img'],
                    'type' : lecture['type']
                })
                i+=1
            
        
    
    if posts is None:   
        requiredPage = 0
    else:
        requiredPage = len(list(posts)) // 10 + 1   # 전체 페이지 수
    if len(posts) % 10 == 0 : 
        requiredPage -=1
    result = []
    #print(posts)

    if posts is None :
        pass # 결과 없을 시 empty list
    else :
        print("posts is not None")
        print(page)

        print(requiredPage)
        print(len(posts))
            # searchList = studyPost.pagenation(i+1, 10)   # 매개변수: 현재 페이지, 한 페이지 당 게시글 수
        for j in range(min(len(posts), 10)):
            
            print(posts[page-1 + j])       
            result.append(posts[page-1 + j])
            
    return {
        'data':{
            'searchList' : result,
            'totalPage': requiredPage
        }
    
    }
        