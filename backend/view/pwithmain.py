from flask import Blueprint, request
from flask_login import current_user
from backend.controller.study_mgmt import studyPost
from backend.controller.mentor_mgmt import Portfolio
from backend.controller.community_mgmt import QNAPost
from backend.controller.alarm_mgmt import alarm
from backend.model.db_mongo import conn_mongodb
from backend.view import findNickName, login_required

main_bp = Blueprint('pwithmain', __name__, url_prefix='')

@main_bp.route('/', methods=['GET'])
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
    
@main_bp.route('/search', methods = ['GET'])      # 전체 검색
def search():
        
    searchType = request.args.get('type')
    searchValue = request.args.get('value')
    
    result = []
    bookList = []
    lectureList = []
    studyList = []
    qnaList = []
    portfolioList = []
    page = 0

    page = request.args.get('page')
    print(page)
    

    if not page :
        page = 0
    #     return jsonify(result)

    page = int(page)
    posts, studyposts, qnaposts, portfolioposts, bookposts, lectureposts = [], [], [], [], [], []

    if int(searchType) == 0: # 제목으로 검색
        studyposts = studyPost.findByTitle(searchValue)
        qnaposts = QNAPost.findByTitle(searchValue)
        portfolioposts = Portfolio.findByTitle(searchValue)
        
        regex = f".*{searchValue}.*"
        
        bookposts =  conn_mongodb().book_crawling.find({'title' : {'$regex' : regex }})
        print("=========book=========")
        # print(bookposts[0])
        lectureposts = conn_mongodb().lecture_crawling.find({'title' : {'$regex' : regex}})
        print("=========lecture===========")
        
        
    elif int(searchType) == 1 : # 글쓴이로 검색
        studyposts = studyPost.findByWriter(searchValue)
        print("study select")
        qnaposts = QNAPost.findByWriter(searchValue)
        print("qna select")
        print(qnaposts)
        portfolioposts = Portfolio.findByMento(searchValue)
        print("portfolio select")
        print(portfolioposts)
    
    if studyposts is not None:
        for i in range(len(studyposts)) :
            post = {
                'id' : i+1,
                'postId' : studyposts[i][0],
                'title' : studyposts[i][1],
                'writerId': studyposts[i][2],
            }
            studyList.append(post)
        
    if qnaposts is not None:
        for i in range(len(qnaposts)) :
            post = {
                'id' : i+1,
                'postId' : qnaposts[i][0],
                'title' : qnaposts[i][1],
                'writerId': qnaposts[i][2],
            }
            qnaList.append(post)
        
    if portfolioposts is not None:
        for i in range(len(portfolioposts)) :
            post = {
                'id' : i+1,
                'postId' : portfolioposts[i][0],
                'title' : portfolioposts[i][1],
                'writerId': portfolioposts[i][2],
            }
            portfolioList.append(post)
        
    if bookposts is not None:
        
        for book in bookposts:
            bookList.append({
            'title' : book['title'],
            'instructor' : book['writer'],
            'link' : book['url'],
            'image': book['img'],
            'type' : book['type']
            })
            
        
        
    if lectureposts is not None:
        for lecture in lectureposts:
            lectureList.append({
            'title' : lecture['title'],
            'instructor' : lecture['instructor'],
            'link' : lecture['link'],
            'image': lecture['img'],
            'type' : lecture['type']
            })
            
        
    
    if posts is None:   
        requiredPage = 0
    else:
        requiredPage = len(list(posts)) // 10 + 1   # 전체 페이지 수
    result = []
    print(posts)

    if posts is None :
        pass # 결과 없을 시 empty list
    else :
        for i in range(page):  # 전체 페이지 수 만큼 각 페이지당 studyList 가져오기
            requiredPage = len(list(posts)) // 10 + 1   # 전체 페이지 수
            studyList = studyPost.pagenation(i+1, 10)   # 매개변수: 현재 페이지, 한 페이지 당 게시글 수
            
        print(studyList)
        print(qnaList)
        print(portfolioList)
        print(bookList)
        print(lectureList)

    return {
        'studyposts' : studyList,
        'qnaposts' : qnaList,
        'portfolioposts' : portfolioList,
        'bookposts' : bookList,
        'lectureposts' : lectureList,
        'num': requiredPage
        }
        