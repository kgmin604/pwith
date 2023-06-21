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

        news_db = conn_mongodb().ITnews_crawling.find().limit(3)
        for i in range(3) :

            title = news_db[i]['title']
            date = news_db[i]['date']
            url = news_db[i]['url']

            formatted_date = datetime.strptime(date, '%Y년 %m월 %d일').strftime('%Y-%m-%d')

            news.append({
                'title' : title,
                'date' : formatted_date,
                'url' : url
            })
        
        qna_db = QNAPost.get3QNA()
        for i in range(3) :

            postId = qna_db[i][0]
            title = qna_db[i][2]

            date = qna_db[i][5]
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

        # page = request.args.get('page')
        # date = request.args.get('date')

        # print(date)

        result = []

        news_list = conn_mongodb().ITnews_crawling.find()
        # news_list = conn_mongodb().ITnews_crawling.find({'date': date})

        for i in range(10) :
            news = news_list[i]
            result.append({
                'date': news['date'],
                'title' : news['title'],
                'brief' : news['brief'],
                'img' : news['img'],
                'url' : news['url']
            })
            
        return jsonify(result) # 일단 15개만 넘김 (pagination&date 표현 방식 결정 후 보완)
        
    # 추후 검색 구현할 때 POST 방식 추가

'''
@community_bp.route('/it/<int:newsId>', methods=['GET', 'POST'])
def readNews(newsId) :
    if request.method == 'GET' : # postman 테스트 완.

        news = conn_mongodb().ITnews_crawling.find_one({'newsId': newsId})
        
        if not news : # 없을 시
            return jsonify({
                'status' : 'fail'
            })

        return jsonify({
            'date': news['date'],
            'title': news['title'],
            'content': news['content'],
            'img': news['img'],
            'url': news['url']
        })
    else : # 좋아요
        mysql_db = conn_mysql()
        cursor_db = mysql_db.cursor()
        
        sql_update = f'UPDATE it_news SET likes = likes + 1 WHERE newsId = {newsId}'

        cursor_db.execute(sql_update)
        mysql_db.commit()

        sql_select = f"SELECT likes FROM it_news WHERE newsId = {newsId}"
        cursor_db.execute(sql_select)

        likes = cursor_db.fetchone()[0]

        mysql_db.close()
        
        return jsonify({
            'likes' : likes
        })
'''

#QNA main 페이지

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
                        'views' : posts[i][8],
                        'liked' : posts[i][9]
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
    
    
#  게시글 상세페이지 
@community_bp.route('/qna/<int:id>', methods=['GET']) # 글 조회
def showDetail(id) :
    if request.method == 'GET' :

        toFront = {}

        post = QNAPost.findById(id)
        toFront = {
            'title': post.getTitle(),
            'writer' : post.getWriter(),
            'content': post.getContent(),
            'curDate' : post.getCurDate(),
            'category' : post.getCategory(),
            'likes' : post.getLikes(),
            'views': post.getViews(),
            'liked': post.getLiked()
            
        }
        toFront['curDate'] = QNAPost.getFormattedDate(toFront['curDate'])
        
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
