from flask import Flask, session, Blueprint, render_template, redirect, request, jsonify, url_for
from flask_login import login_required, current_user
# from controller.community_mgmt import bootPost, QNAPost
from model.db_mongo import conn_mongodb
from model.db_mysql import conn_mysql
# from view.community import conn_mongodb
from controller.community_mgmt import QNAPost

community_bp = Blueprint('community', __name__, url_prefix='/community')
 
@community_bp.route('/it', methods=['GET', 'POST'])
def listNews() :
    if request.method == 'GET' :

        result = []

        news_list = conn_mongodb().ITnews_crawling.find()

        for i in range(15) :
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