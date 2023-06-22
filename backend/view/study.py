from flask import Flask, session, Blueprint, render_template, redirect, request, jsonify, url_for
from flask_login import login_required, current_user
from controller.board_mgmt import studyPost
from controller.reply_mgmt import Reply
from controller.studyroom_mgmt import StudyRoom
from datetime import datetime
import json

study_bp = Blueprint('study', __name__, url_prefix='/study')

@study_bp.route('/main', methods=['GET'])
def show():
    if request.method == 'GET':

        searchType = request.args.get('type')
        searchValue = request.args.get('value')

        if (searchType is None) or (searchValue is None) : # 전체 글 출력
            result = []
            page = 0

            page = request.args.get('page')

            if not page :
                return jsonify(result)

            page = int(page)

            posts = studyPost.getStudy()
            requiredPage = len(list(posts)) // 10 + 1   # 전체 페이지 수

            for i in range(page) :  # 전체 페이지 수 만큼 각 페이 당 studyList 가져오기
                studyList = studyPost.pagenation(i+1, 10)   # 매개변수 : 현재 페이지, 한 페이지 당 게시글 수

            for i in range(len(studyList)):
                post = {
                        'id' : posts[i][0],
                        'title' : posts[i][2],
                        'writer' : posts[i][3],
                        'curDate' : posts[i][5],
                        'likes' : posts[i][7],
                        'views' : posts[i][8]
                    }
                post['curDate'] = studyPost.getFormattedDate(posts[i][5])

                result.append(post)

            return jsonify({
                'posts' : result,
                'num' : requiredPage
            })

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
                        'views' : posts[i][8],
                    }
                    post['curDate'] = studyPost.getFormattedDate(posts[i][5])
                    
                    result.append(post)

            return jsonify(result)

@study_bp.route('/<int:id>', methods=['GET']) # 글 조회
def showDetail(id) :
    if request.method == 'GET' :

        apply = request.args.get('apply')

        if apply == 'go' : # 스터디 신청
            roomId = studyPost.findRoomId(id)

            studentsList_string = StudyRoom.getStudentList(roomId)

            newStudentList = ''

            if not studentsList_string :
                newStudentList = f'["{current_user.getId()}"]'
                # newStudentList = f'["a"]' # dummmmmmmmmmmmmmy
            else :
                studentsList = json.loads(studentsList_string) # list
                studentsList.append(current_user.getId())
                # studentsList.append("a") # dummmmmmmmmmmmmmy
                newStudentList = str(studentsList)
                newStudentList = newStudentList.replace("\'", "\"")

            done = StudyRoom.addStudent(roomId, newStudentList)


        result = {}

        post = studyPost.findById(id)

        postDate = studyPost.getFormattedDate(post.getCurDate())
        
        roomId= studyPost.getRoomId(id) #roomName 조회위해서 미리 변수로 리턴받음
        
        isApplied = f'"{current_user.getId()}"' in StudyRoom.getStudentList(roomId)

        result = {
            'isApplied' : isApplied,
            'title': post.getTitle(),
            'writer' : post.getWriter(),
            'content': post.getContent(),
            'curDate' : postDate,
            'likes' : studyPost.getLikes(id),
            'views': post.getViews(),
            'roomId' : roomId,
            'roomTitle' : studyPost.getRoomName(roomId)
        }
        
        viewresult = studyPost.updateViews(id)
        # print(viewresult)

        replyList = Reply.showReply(0, id) # 댓글 조회

        replyResult = []

        for reply in replyList :

            date = studyPost.getFormattedDate(reply[3])

            replyResult.append({
                'commentId' : reply[0],
                'writer' : reply[1],
                'comment' : reply[2],
                'date' : date
            })

        return jsonify({
            'post' : result,
            'reply' : replyResult
        })

@study_bp.route('/<int:id>', methods = ['POST', 'PUT', 'DELETE'])
def reply(id) :
    if request.method == 'POST' : # 댓글 작성

        cnt = request.get_json()['content']

        writer = current_user.getId()

        date = datetime.now()

        try :
            pk = Reply.writeReply(writer, cnt, date, 0, id)
        except Exception as ex:
            print("에러 이유 : " + str(ex))
            pk = 0

        return jsonify({
            'replyId' : pk, # 0 is fail
            'date' : studyPost.getFormattedDate(date)
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
        result = []

        roomList = studyPost.getMyStudyList(current_user.getId())
        # roomList = studyPost.getMyStudyList('a')

        for room in roomList :
            result.append({
                'value' : room[0],
                'label' : room[1]
            })

        # print(result)
        return jsonify(result)

    else :

        data = request.get_json(silent=True)

        postType = 0
        title = data['title']
        writer = current_user.getId()
        curDate = studyPost.curdate()
        content = data['content']
        likes = 0
        views = 0
        roomId = data['roomId']
        
        done =studyPost.insertStudy(postType, title, writer, curDate, content, likes, views, roomId)
        
        return jsonify({
            'done' : done
        })
    
@login_required
@study_bp.route('/<int:id>/like', methods=['GET', 'POST'])
def like(id):
    if request.method=='POST':
        memId = current_user.getId()
        postId = request.get_json()['postId']
        
        print(memId, postId)
        studyPost.toggleLike(memId, postId)
        print("liked")
        
    if request.method == 'GET':
        likes = studyPost.getLikes(id)
        return jsonify({
            'likes' : likes
        })
    return jsonify({'message': 'Invalid request method'})   # 추가: POST 요청 이외의 다른 요청에 대한 처리 로직
        
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