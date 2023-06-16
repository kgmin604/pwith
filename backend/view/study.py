from flask import Flask, session, Blueprint, render_template, redirect, request, jsonify, url_for
from flask_login import login_required, current_user
from controller.board_mgmt import studyPost

study_bp = Blueprint('study', __name__, url_prefix='/study')

#페이지네이션, 스터디 메인 페이지, 마이페이지에서 멤버별로 글 보이게, 작성 페이지 프론트연결,

@study_bp.route('/main', methods=['GET'])
def show():
    if request.method == 'GET':

        searchType = request.args.get('type')
        searchValue = request.args.get('value')
        # print("서치타입")
        # print(searchType)
        # print("서치값")
        # print(searchValue)

        if (searchType is None) or (searchValue is None) : # 전체 글 출력
            result = studyPost.getStudy()
            return jsonify(result) # column 값 명시하기!!

        else : # 글 검색
            posts = []

            if int(searchType) == 0: # 제목으로 검색
                posts = studyPost.findByTitle(searchValue)
            else: # 글쓴이로 검색
                posts = studyPost.findByWriter(searchValue)

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
                        'views' : posts[i][8]
                    }
                    result.append(post)

            return jsonify(result)

@study_bp.route('/<int:id>', methods=['GET']) # 글 조회
def showDetail(id) :
    if request.method == 'GET' :

        toFront = {}

        post = studyPost.findById(id)
        toFront = {
            'title': post.getTitle(),
            'writer' : post.getWriter(),
            'content': post.getContent(),
            'curDate' : post.getCurDate(),
            'category' : post.getCategory(),
            'likes' : post.getLikes(),
            'views': post.getViews()
            #'totalP': post.getTotalP(),
            
        }

        return toFront



#글 작성 페이지
@study_bp.route("/create", methods=['POST'])
@login_required
def write():
    if request.method == 'POST':
        print("post\n")
        data = request.get_json(silent=True) # silent: parsing fail 에러 방지
        print(data)
        print("axios error\n")
        postType = 0
        title = data['title']
        # writer = session.get("id")      # 현재 사용자 id
        writer = current_user.getId()
        curDate = studyPost.curdate()      # 현재 시간
        content = data['content']
        category = data['category']
        likes = 0
        views = 0
        #joiningP = 0
        totalP = data['totalP']
        
        print(postType, title, writer, curDate, content, category, likes, views)
        studyPost.insertStudy(postType, title, writer, curDate, content, category, likes, views)
        
        
        return 'Response', 200
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