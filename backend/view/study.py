from flask import Flask, session, Blueprint, render_template, redirect, request, jsonify, url_for
from flask_login import login_required, current_user
from controller.board_mgmt import studyPost

study_bp = Blueprint('study', __name__, url_prefix='/study')
# blueprint의 url_prefix를 'study'로 설정함으로써 중복 제거 제안합니다! - 채영

#페이지네이션, 스터디 메인 페이지, 마이페이지에서 멤버별로 글 보이게, 작성 페이지 프론트연결,

@study_bp.route('/main', methods=['GET', 'POST'])
def show():
    if request.method =='GET':
        data = request.get_json(silent=True)
        
        data = jsonify(studyPost.getStudy()) 
        return data

    else: # 글 검색 postman 테스트 완. - 채영

        title = '안녕' # (제목) 검색어 전달될 예정
        searchedPost = studyPost.findByTitle(title)

        # writer = 'a' # (글쓴이) 검색어 전달될 예정
        # searchedPost = studyPost().findByWriter(writer)
        
        return list(searchedPost)

# postman 테스트 완. - 채영
@study_bp.route('/<int:id>', methods=['GET']) # 글 조회
def showDetail(id) :
    if request.method == 'GET' :

        toFront = {}

        post = studyPost.findById(id)

        toFront = {
            'title': post.getTitle(),
            'content': post.getContent(),
            'views': post.getViews(),
            'totalP': post.getTotalP()
        }

        return toFront



#글 작성 페이지
@study_bp.route('/create', methods=['GET', 'POST'])
@login_required
def write():
    if request.method == 'GET' :
        return jsonify(
            {'status': 'success'}
        )
    else :
        data = request.get_json(silent=True) # silent: parsing fail 에러 방지
        
        type = 0
        title = data['title']
        # writer = session.get("id")      # 현재 사용자 id
        writer = current_user.getId()
        curDate = studyPost.curdate()      # 현재 시간
        content = data['content']
        category = data['category']
        likes = 0
        views = 0
        #joiningP = 0
        #totalP = data['totalP']
        
        print(type, title, writer, curDate, content, category, likes, views)
        studyPost.insertStudy( type, title, writer, curDate, content, category, likes, views)
        
        
        return jsonify(
            {'status': 'success'}
        )
"""
# update 
@study_bp.route('/update')
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
@study_bp.route('/delete')
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