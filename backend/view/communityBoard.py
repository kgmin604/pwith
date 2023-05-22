from flask import Flask, session, Blueprint, render_template, redirect, request, jsonify, url_for
from flask_login import login_required, current_user
# from controller.community_mgmt import bootPost, QNAPost
from model.db_mongo import conn_mongodb
# from view.community import conn_mongodb
from controller.community_mgmt import QNAPost

community_bp = Blueprint('community', __name__, url_prefix='/community')

# postman 테스트 완료
@community_bp.route('/it', methods=['GET', 'POST']) # /it?page=1 방식 제안하기
def listNews() :
    if request.method == 'GET' :

        ten_news = []

        print(conn_mongodb().ITnews_crawling.find()[0])
        news_list = conn_mongodb().ITnews_crawling.find()
        # for news in news_list :
        #     news['title']
        #     news['content']
        #     news['img']
        #     news['url']

        for i in range(10) :
            news = news_list[i]
            ten_news.append({
                'title' : news['title'],
                'content' : news['content'],
                'img' : news['img'],
                'url' : news['url']
            })
            # ten_news.append(news)
            
        return ten_news # 일단 10개만 넘김 (pagination 결정 후 보완)
        
    # 추후 검색 구현할 때 POST 방식 추가



# @community_bp.route('/it/<num>', methods=['GET', 'POST'])
# def readNews() : # 구현 전
#     if request.method == 'GET' :
#         # 내용 띄우기
#         return jsonify(
#             {'status': 'success'}
#         )
#     else :
#         # 좋아요, 댓글 등


#QNA main 페이지

# @community_bp.route('/main', methods=['GET', 'POST'])
# def show():
#    if request.method =='GET':     # 글 가져와서 화면에 띄우기
#        data = request.get_json(silent=True)
#        
#        data = jsonify(QNAPost.getQNA()) 
#        return data
#    else: # 글 검색 postman 테스트 완. - 채영

#        title = '안녕' # (제목) 검색어 전달될 예정
#        searchedPost = QNAPost.findByTitle(title)

        # writer = 'a' # (글쓴이) 검색어 전달될 예정
        # searchedPost = QNAPost().findByWriter(writer)
        
#        return list(searchedPost)

    
# QNA 글 작성 페이지

@community_bp.route("/QNA/create", methods=['GET', 'POST'])
@login_required
def write():
    if request.method == 'GET' :
        return jsonify(
            {'status': 'success'}
        )
    else :
        data = request.get_json(silent=True) # silent: parsing fail 에러 방지

        title = data['title']
        # writer = session.get("id")      # 현재 사용자 id
        writer = current_user.getId()
        curDate = QNAPost.curdate()      # 현재 시간
        content = data['content']
        category = data['category']
        views = QNAPost.incViews(writer)
        likes = QNAPost.incLikes(writer)

        print(title, writer, curDate, content, category, views, likes)
        QNAPost.insertQNA( title, writer, curDate, content, category, views, likes)
    
    
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