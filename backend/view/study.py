from flask import Flask, flask_login, session, Blueprint, render_template, redirect, request, jsonify, url_for
from flask_login import login_required
from controller.board_mgmt import studyPost

bp = Blueprint('study', __name__, url_prefix='')

#글 작성 페이지
@bp.route("/study", method=["GET", "POST"])
@login_required
def write():
    if request.method == 'GET' :
        return jsonify(
            {'status': 'success'}
        )
    else :
        data = request.get_json(silent=True) # silent: parsing fail 에러 방지
        
    index = 0
    views = 0
    joiningP = 0
    
    studyID = studyPost.incIndex(index)     #index 자동으로 1씩 증가
    title = data['title']
    writer = session.get("id")      # 현재 사용자 id
    curDate = ['cur_date']      # 현재 시간
    content = ['content']
    category = data['category']
    views = studyPost.incView(views)
    joiningP = studyPost.incJoningP(joiningP)
    totalP = ['totalP']
    
    print(studyID, title, writer, curDate, content, category, views, joiningP, totalP)
    studyPost.insertStudy(studyID, title, writer, curDate, content, category, views, joiningP, totalP)
    
    index += 1 #다음 studyPost 에는 index 1증가하기 위함
    views += 1
    joiningP += 1
    
# update 
@bp.route('/study/update')
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
    views = studyPost.incView(views)
    joiningP = studyPost.incJoningP(joiningP)
    totalP = ['totalP']
    
    studyPost.updateStudy(title, writer, curDate, content, category, views, joiningP, totalP)

#delete
@bp.route('/study/delete')
@login_required
def delete():
    if request.method == 'GET' :
        return jsonify(
            {'status': 'success'}
        )
    else :
        data = request.get_json(silent=True) # silent: parsing fail 에러 방지
        
    studyID = data[studyID]
    studyPost.deleteStudy(studyID)