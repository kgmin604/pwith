from flask import Flask, session, Blueprint, render_template, redirect, request, jsonify, url_for
from flask_login import login_required, current_user
from controller.board_mgmt import studyPost
from controller.reply_mgmt import Reply
from datetime import datetime

study_bp = Blueprint('study', __name__, url_prefix='/study')

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
                        'views' : posts[i][9],
                        'liked' : posts[i][9]
                    }
                post['curDate'] = studyPost.getFormattedDate(posts[i][5])
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
                        'views' : posts[i][9],
                        'liked' : posts[i][9]
                    }
                    post['curDate'] = studyPost.getFormattedDate(posts[i][5])
                    
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
            'likes' : studyPost.getLikes(id),
            'views': post.getViews(),
            'liked': post.getLiked(),
        }
        toFront['curDate'] = studyPost.getFormattedDate(toFront['curDate'])
        
        viewresult = studyPost.updateViews(id)
        # print(viewresult)
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

@login_required
@study_bp.route("/create", methods=['GET', 'POST'])
def write():
    if request.method == 'GET' :
        roomList = studyPost.getMyStudyList(writer)
        print(roomList)
        return jsonify({
            'roomList' : roomList
        })

    else :
        data = request.get_json(silent=True)

        postType = 0
        title = data['title']
        writer = current_user.getId()
        curDate = studyPost.curdate()
        content = data['content']
        likes = 0
        views = 0
        
        studyPost.insertStudy(postType, title, writer, curDate, content, likes, views)
        
        return jsonify({
            'done' : done
        })
    
@login_required
@study_bp.route('/<int:id>/like', methods=['GET', 'POST'])
def like(id):
    if request.method=='POST':
        postId = request.get_json()['postId']
        post = studyPost.findById(id)
        liked = studyPost.toggleLike(id)
        return jsonify({
            'liked' : liked
        })
        
    if request.method == 'GET':
        likes = studyPost.getLikes(id)
        return jsonify({
            'likes' : likes
            })
        
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