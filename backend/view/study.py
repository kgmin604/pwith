from flask import Flask, session, Blueprint, render_template, redirect, request, jsonify, url_for
from flask_login import login_required, current_user
from controller.board_mgmt import studyPost

study_bp = Blueprint('study', __name__, url_prefix='/study')

#페이지네이션, 스터디 메인 페이지, 마이페이지에서 멤버별로 글 보이게, 작성 페이지 프론트연결,

@study_bp.route('/main', methods=['GET', 'POST'])
def show():
    if request.method == 'GET':

        searchType = request.args.get('type')
        print(searchType)
        searchValue = request.args.get('value')
        print(searchValue)

        if (searchType is None) or (searchValue is None) :
            data = jsonify(studyPost.getStudy())

            return data

        else :
            
            searchedPost = []

            if int(searchType) == 0:
                searchedPost = studyPost.findByTitle(searchValue)
            else:
                searchedPost = studyPost.findByWriter(searchValue)

            return jsonify(searchedPost)

    # else:

    #     data = request.get_json(silent=True)

    #     searchType = data['searchType']

    #     if searchType == 0:
    #         # title = '안녕'
    #         title = data['searchWord']
    #         searchedPost = studyPost.findByTitle(title)
    #     else :
    #         # writer = 'a'
    #         writer = data['searchWord']
    #         searchedPost = studyPost().findByWriter(writer)
        
    #     return jsonify(searchedPost)

# @study_bp.route('/main/search', methods=['GET']) # 일단 search 라우터 추가했음
# def search() :
#     if request.method == 'GET':

#         searchType = request.args.get('type')
#         print(searchType)
#         searchValue = request.args.get('value')
#         print(searchValue)
#         searchedPost = []

#         if int(searchType) == 0:
#             searchedPost = studyPost.findByTitle(searchValue)
#         else:
#             searchedPost = studyPost.findByWriter(searchValue)

#         return jsonify(searchedPost)

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