from flask import Flask, session, Blueprint, render_template, redirect, request, jsonify, url_for
from flask_login import login_required
from controller.board_mgmt import studyPost

bp = Blueprint('study', __name__, url_prefix='')

#페이지네이션, 스터디 메인 페이지, 마이페이지에서 멤버별로 글 보이게, 작성 페이지 프론트연결,

@bp.route('/study', methods=['GET', 'POST'])
def show():
    if request.method =='GET':
        data = request.get_json(silent=True)
        
        data=jsonify(studyPost.getStudy()) 
        return data
    else:
        return jsonify(
            {'status : success'}
        )


#글 작성 페이지
@bp.route('/study/create', methods=['GET', 'POST'])
@login_required
def write():
    if request.method == 'GET' :
        return jsonify(
            {'status': 'success'}
        )
    else :
        data = request.get_json(silent=True) # silent: parsing fail 에러 방지
        
        index = 0
        view = 0
        joinP = 0
        
        studyID = studyPost.incIndex(index)     #index 자동으로 1씩 증가
        title = data['title']
        # writer = session.get("id")      # 현재 사용자 id
        curDate = studyPost.curdate()      # 현재 시간
        content = data['content']
        # category = data['category']
        views = studyPost.incView(view)
        joiningP = studyPost.incJoningP(joinP)
        totalP = data['totalP']
        
        # print(studyID, title, writer, curDate, content, category, views, joiningP, totalP)
        # studyPost.insertStudy(studyID, title, writer, curDate, content, category, views, joiningP, totalP)
        # print(studyID, title,  curDate, content, views, totalP)
        
        # 테스트용!!!!!!!! (totalP 는 실제 입력값 없음 디폴트 50으로 설정될거임)
        studypost1 = studyPost(studyID, title, content, views, totalP)
        studypost1.insertStudy(studyID, title, content, views, totalP)
        print(studypost1)
        
        print(studyID, title, content, totalP)
        
        index += 1 #다음 studyPost 에는 index 1증가하기 위함
        views += 1
        joiningP += 1
        
        return jsonify(
            {'status': 'success'}
        )
"""
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
    totalP = ['totalP']
    
    studyPost.updateStudy(title, writer, curDate, content, category, totalP)

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
"""