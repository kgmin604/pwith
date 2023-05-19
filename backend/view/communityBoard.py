from flask import Flask, session, Blueprint, render_template, redirect, request, jsonify, url_for
from flask_login import login_required
# from controller.community_mgmt import bootPost, QNAPost
from model.db_mongo import conn_mongodb
# from view.community import conn_mongodb

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


#글 작성 페이지
# @community_bp.route("/bootcamp/create", methods=['GET', 'POST'])
# @login_required
# def write():
#     if request.method == 'GET' :
#         return jsonify(
#             {'status': 'success'}
#         )
#     else :
#         data = request.get_json(silent=True) # silent: parsing fail 에러 방지
        
#     index = 0

#     bootID = bootPost.incIndex(index)     #index 자동으로 1씩 증가
#     title = data['title']
#     writer = session.get("id")      # 현재 사용자 id
#     curDate = ['cur_date']      # 현재 시간
#     content = ['content']
#     category = data['category']
#     views = bootPost.incView(views)
#     likes = bootPost.incLikes(likes)
    
#     print(bootID, title, writer, curDate, content, category, views, likes)
#     bootPost.insertboot(bootID, title, writer, curDate, content, category, views, likes)
    
#     index += 1 #다음 studyPost 에는 index 1증가하기 위함
    
    
# # update 
# @community_bp.route('/bootcamp/update', methods=['GET', 'POST'])
# @login_required
# def update():
#     if request.method == 'GET' :
#         return jsonify(
#             {'status': 'success'}
#         )
#     else :
#         data = request.get_json(silent=True) # silent: parsing fail 에러 방지
        
#     title = data['title']
#     writer = session.get("id")      # 현재 사용자 id
#     curDate = ['cur_date']      # 현재 시간
#     content = ['content']
#     category = data['category']
    
#     bootPost.updateStudy(title, writer, curDate, content, category)

# #delete
# @community_bp.route('/bootcamp/delete', methods=['GET', 'POST'])
# @login_required
# def delete():
#     if request.method == 'GET' :
#         return jsonify(
#             {'status': 'success'}
#         )
#     else :
#         data = request.get_json(silent=True) # silent: parsing fail 에러 방지
        
#     bootID = data[bootID]
#     bootPost.deleteStudy(bootID)