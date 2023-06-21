from flask import Flask, session, Blueprint, render_template, redirect, request, jsonify, url_for
from flask_login import login_required, current_user
from datetime import datetime
# from controller.community_mgmt import bootPost, QNAPost
from model.db_mongo import conn_mongodb
from model.db_mysql import conn_mysql
# from view.community import conn_mongodb
from controller.community_mgmt import QNAPost

community_bp = Blueprint('community', __name__, url_prefix='/community')

@community_bp.route('/main', methods = ['GET'])
def communityMain() :
    if request.method == 'GET' :

        news = []
        conts = []
        qna = []

        news_db = conn_mongodb().ITnews_crawling.find().sort('_id', -1).limit(3)
        for n in news_db :

            title = n['title']
            date = n['date']
            url = n['url']

            formatted_date = datetime.strptime(date, '%Y년 %m월 %d일').strftime('%Y-%m-%d')

            news.append({
                'title' : title,
                'date' : formatted_date,
                'url' : url
            })
        
        qna_db = QNAPost.get3QNA()
        for q in qna_db :

            postId = q[0]
            title = q[2]

            date = q[5]
            formatted_date = date.strftime("%Y-%m-%d")

            qna.append({
                'postId' : postId,
                'title' : title,
                'date' : formatted_date
            })

        # dummmmmmmmmmmmmmmy
        conts.append({
            'title' : '자바 ORM 표준 JPA 프로그래밍 - 기본편',
            'type' : 'lecture',
            'url' : 'https://www.inflearn.com/course/ORM-JPA-Basic/dashboard'
        })
        conts.append({
            'title' : '윤성우의 열혈 C++ 프로그래밍',
            'type' : 'book',
            'url' : 'https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=6960708'
        })
        conts.append({
            'title' : '스프링 MVC 1편 - 백엔드 웹 개발 핵심 기술',
            'type' : 'lecture',
            'url' : 'https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81-mvc-1/dashboard'
        })
        # dummmmmmmmmmmmmmmy

        return jsonify({
            'news' : news,
            'qna' : qna,
            'contents' : conts
        })
 
@community_bp.route('/it', methods=['GET', 'POST'])
def listNews() :
    if request.method == 'GET' :

        page = 0
        result = []

        page = request.args.get('page')
        date = request.args.get('date')

        if not page or not date :
            return jsonify(result)

        page = int(page)
        formatted_date = f'{date[:4]}년 {date[4:6]}월 {date[6:]}일'


        all_newsList = conn_mongodb().ITnews_crawling.find({'date':formatted_date}).sort('_id', -1)
        requiredPage = len(list(all_newsList)) // 10 + 1

        newsList = conn_mongodb().ITnews_crawling.find({'date':formatted_date}).sort('_id', -1).skip((page-1)*10).limit(10)

        for news in newsList :
            result.append({
                'date': news['date'],
                'title' : news['title'],
                'brief' : news['brief'],
                'img' : news['img'],
                'url' : news['url']
            })
        
        return jsonify({
            'page' : requiredPage,
            'news' : result
        })
        
    # 추후 검색 구현할 때 POST 방식 추가

@community_bp.route('/qna/main', methods=['GET', 'POST'])
def show():
    if request.method =='GET':     # 글 가져와서 화면에 띄우기
        
        searchType = request.args.get('type')
        searchValue = request.args.get('value')
        # print("서치타입")
        # print(searchType)
        # print("서치값")
        # print(searchValue)

        if (searchType is None) or (searchValue is None) : # 전체 글 출력
            result = []
            posts = QNAPost.getQNA()
            for i in range(len(posts)):
                post = {
                        'id' : posts[i][0],
                        'type' : posts[i][1],
                        'title' : posts[i][2],
                        'writer' : posts[i][3],
                        'content' : posts[i][4],
                        'curDate' : posts[i][5],
                        'category' : posts[i][6],
                        'likes' : posts[i][7],
                        'views' : posts[i][8],
                        'liked' : posts[i][9]
                    }
                post['curDate'] = QNAPost.getFormattedDate(posts[i][5])
                result.append(post)
            return jsonify(result)

        else : # 글 검색
            posts = []

            if int(searchType) == 0: # 제목으로 검색
                posts = QNAPost.findByTitle(searchValue, 1)
            else: # 글쓴이로 검색
                posts = QNAPost.findByWriter(searchValue, 1)

            result = []

            if posts is None :
                pass # 결과 없을 시 empty list
            else :
                for i in range(len(posts)) :
                    post = {
                        'id' : posts[i][0],
                        'type' : posts[i][1],
                        'title' : posts[i][2],
                        'writer' : posts[i][3],
                        'content' : posts[i][4],
                        'curDate' : posts[i][5],
                        'category' : posts[i][6],
                        'likes' : posts[i][7],
                        'views' : posts[i][9],
                        'liked' : posts[i][8]
                    }
                    post['curDate'] = QNAPost.getFormattedDate(posts[i][5])
                    
                    result.append(post)

            return jsonify(result)

    
# QNA 글 작성 페이지

@community_bp.route("/qna/create", methods=['GET', 'POST'])
@login_required
def write():
    if request.method == 'POST':
        print("post\n")
        data = request.get_json(silent=True) # silent: parsing fail 에러 방지
        print(data)
        
        postType = 1
        title = data['title']
        # writer = session.get("id")      # 현재 사용자 id
        writer = current_user.getId()
        curDate = QNAPost.curdate()      # 현재 시간
        content = data['content']
        category = data['category']
        likes = 0
        views = 0
        
        print(postType, title, writer, curDate, content, category, likes, views)
        QNAPost.insertQNA(postType, title, writer, curDate, content, category, likes, views)
        
        
        return 'Response', 200
    
@community_bp.route('/qna/<int:id>', methods=['GET']) # 글 조회
def showDetail(id) :
    if request.method == 'GET' :

        toFront = {}

        post = QNAPost.findById(id)

        if not post :
            return toFront

        toFront = {
            'title': post.getTitle(),
            'writer' : post.getWriter(),
            'content': post.getContent(),
            'curDate' : post.getCurDate(),
            'category' : post.getCategory(),
            'likes' : post.getLikes(),
            'liked': post.getLiked(),
            'views': post.getViews()
        }
        viewresult = QNAPost.updateViews(id)
        # toFront['curDate'] = QNAPost.getFormattedDate(toFront['curDate'])
        
        return toFront
    
# # update 페이지 . 글 수정
# @community_bp.route('/QNA/update', methods=['GET', 'POST'])
# @login_required
# def update():
#     if request.method == 'GET' :
#         return jsonify(
#             {'status': 'success'}
#         )
#     else :
#         data = request.get_json(silent=True) # silent: parsing fail 에러 방지
        
#         title = data['title']
#         writer = session.get("id")      # 현재 사용자 id
#         curDate = ['cur_date']      # 현재 시간
#         content = ['content']
#         category = data['category']
    
#         QNAPost.updateStudy(title, writer, curDate, content, category)

# #delete 페이지 글 삭제
# @community_bp.route('/QNA/delete', methods=['GET', 'POST'])
# @login_required
# def delete():
#     if request.method == 'GET' :
#         return jsonify(
#             {'status': 'success'}
#         )
#     else :
#         data = request.get_json(silent=True) # silent: parsing fail 에러 방지
        
#         QNAID = data[QNAID]
#         QNAPost.deleteQNA(QNAID)
