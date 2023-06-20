from flask import Flask, session, Blueprint, render_template, redirect, request, jsonify, url_for
from flask_login import login_required, current_user
from controller.board_mgmt import studyPost
from controller.reply_mgmt import Reply
from datetime import datetime

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
            result = []
            posts = studyPost.getStudy()
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
                        'views' : posts[i][8]
                    }
                result.append(post)
            return result

        else : # 글 검색
            posts = []

            if int(searchType) == 0: # 제목으로 검색
                posts = studyPost.findByTitle(searchValue, 0)
            else: # 글쓴이로 검색
                posts = studyPost.findByWriter(searchValue, 0)

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

@study_bp.route('/<int:id>', methods = ['POST', 'PUT', 'DELETE'])
def reply(id) :
    if request.method == 'POST' : # 댓글 작성

        cnt = request.get_json()['content']

        # writer = current_user.getId()
        writer = 'a' # dummy !!

        date = datetime.now()

        try :
            pk = Reply.writeReply(writer, cnt, date, 0, id)
        except Exception as ex:
            print("에러 이유 : " + str(ex))
            pk = 0

        return jsonify({
            'replyId' : pk # 0 is fail
        })

    elif request.method == 'PUT' : # 댓글 수정

        id = request.get_json()['replyId']
        newContent = request.get_json()['content']

        try :
            done = Reply.modifyReply(id, newContent)
        except Exception as ex :
            print("에러 이유 : " + str(ex))
            done = 0

        return jsonify({
            'done' : done
        })

    else : # 댓글 삭제

        id = request.get_json()['replyId']

        try :
            done = Reply.removeReply(id)
        except Exception as ex :
            print("에러 이유 : " + str(ex))
            done = 0

        return jsonify({
            'done' : done
        })


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