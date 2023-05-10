from flask import Flask, flask_login, session, Blueprint, render_template, redirect, request, jsonify, url_for
from flask_login import login_required
from controller.community_mgmt import bootPost, QNAPost

bp = Blueprint('community', __name__, url_prefix='')

#글 작성 페이지
@bp.route("/community/bootcamp/create", method=["GET", "POST"])
@login_required
def write():
    if request.method == 'GET' :
        return jsonify(
            {'status': 'success'}
        )
    else :
        data = request.get_json(silent=True) # silent: parsing fail 에러 방지
        
    index = 0

    bootID = bootPost.incIndex(index)     #index 자동으로 1씩 증가
    title = data['title']
    writer = session.get("id")      # 현재 사용자 id
    curDate = ['cur_date']      # 현재 시간
    content = ['content']
    category = data['category']
    views = bootPost.incView(views)
    likes = bootPost.incLikes(likes)
    
    print(bootID, title, writer, curDate, content, category, views, likes)
    bootPost.insertboot(bootID, title, writer, curDate, content, category, views, likes)
    
    index += 1 #다음 studyPost 에는 index 1증가하기 위함
    
    
# update 
@bp.route('/community/bootcamp/update')
@login_required
def update():
    if request.method == 'GET' :
        return jsonify(
            {'status': 'success'}
        )
    else :
        data = request.get_json(silent=True) # silent: parsing fail 에러 방지
        
    title = data['title']
    writer = session.get("id")      # 현재 사용자 id
    curDate = ['cur_date']      # 현재 시간
    content = ['content']
    category = data['category']
    
    bootPost.updateStudy(title, writer, curDate, content, category)

#delete
@bp.route('/community/bootcamp/delete')
@login_required
def delete():
    if request.method == 'GET' :
        return jsonify(
            {'status': 'success'}
        )
    else :
        data = request.get_json(silent=True) # silent: parsing fail 에러 방지
        
    bootID = data[bootID]
    bootPost.deleteStudy(bootID)