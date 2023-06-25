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
        
        # 추천 스터디 3개
        recommend = request.args.get('recommend')
        print("recommend")
        print(recommend)
        print("recommend")
        if recommend is not None:
            print("recommend")
            recStudy=[]
            recommendStudy = studyPost.getNStudy(3)
            for study in recommendStudy:
                rec = {
                    'id' : study[0],
                    'title' : study[1]
                }
                recStudy.append(rec)
            return jsonify({
                'rec' : recStudy # by. 경민
            })
                

        searchType = request.args.get('type')
        searchValue = request.args.get('value')
        
        result = []
        page = 0

        page = request.args.get('page')

        if not page :
            return jsonify(result)

        page = int(page)


        if (searchType is None) or (searchValue is None) : # 전체 글 출력
            posts = studyPost.getStudy()
            requiredPage = len(list(posts)) // 10 + 1   # 전체 페이지 수

            for i in range(page):  # 전체 페이지 수 만큼 각 페이지당 studyList 가져오기
                studyList = studyPost.pagenation(i+1, 10)   # 매개변수: 현재 페이지, 한 페이지 당 게시글 수

            for row in studyList:
                post = {
                    'id': row[0],
                    'title': row[2],
                    'writer': row[3],
                    'curDate': row[5],
                    'likes': row[7],
                    'views': row[8]
                }
                post['curDate'] = studyPost.mainFormattedDate(row[5])

                result.append(post)

            return jsonify({
                'posts': result,
                'num': requiredPage,
                #'rec' : recStudy
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
                for i in range(page):  # 전체 페이지 수 만큼 각 페이지당 studyList 가져오기
                    requiredPage = len(list(posts)) // 10 + 1   # 전체 페이지 수
                    studyList = studyPost.pagenation(i+1, 10)   # 매개변수: 현재 페이지, 한 페이지 당 게시글 수
                    
                for i in range(len(posts)) :
                    post = {
                        'id' : posts[i][0],
                        'title' : posts[i][2],
                        'writer' : posts[i][3],
                        'curDate' : posts[i][5],
                        'likes' : posts[i][7],
                        'views' : posts[i][8]
                    }
                    post['curDate'] = studyPost.mainFormattedDate(posts[i][5])
                    
                    result.append(post)

            return jsonify({
                'posts' : result,
                'num': page
                #'rec' : recStudy
                })
            

@study_bp.route('/<int:id>', methods=['GET', 'PUT', 'DELETE']) # 글 조회 수정 삭제
def showDetail(id) :
    if request.method == 'GET' :    # 글 조회

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

        isApplied = None
        try : # 익명의 경우
            isApplied = f'"{current_user.getId()}"' in StudyRoom.getStudentList(roomId)
            # print("ISAPPLIED" + str(isApplied))
        except Exception as ex:
            isApplied = False
            # print("에러 발생 : " + str(ex))

        liked = 0
        try : # 익명의 경우
            liked = studyPost.getLiked(current_user.getId(), id)
        except Exception as ex :
            liked = False

        result = {
            'isApplied' : isApplied,
            'title': post.getTitle(),
            'writer' : post.getWriter(),
            'content': post.getContent(),
            'curDate' : postDate,
            'likes' : studyPost.getLikes(id),
            'liked' : liked,
            'views': post.getViews(),
            'roomId' : roomId,
            'roomTitle' : studyPost.getRoomName(roomId),
            'totalP': studyPost.getTotalP(roomId),
            'joinP' : studyPost.getJoinP(roomId)
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
        
    if request.method == 'PUT':     # 게시글 수정
        id = request.get_json()['postId']
        postContent = request.get_json()['content']
        
        try :
            done = studyPost.updateStudy(id, postContent)
        except Exception as ex :
            print("에러 이유 : " + str(ex))
            done = 0

        return jsonify({
            'done' : done
        })
        
    if request.method == 'DELETE':      # 게시글 삭제
        id = request.get_json()['postId']
        
        try :
            done = studyPost.deleteStudy(id)
        except Exception as ex :
            print("에러 이유 : " + str(ex))
            done = 0

        return jsonify({
            'done' : done
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
    memId = current_user.getId()
    if request.method=='POST':
        postId = request.get_json()['postId']
        
        print(memId, postId)
        studyPost.toggleLike(memId, postId)
        print("liked")
        
    if request.method == 'GET':
        likes = studyPost.getLikes(id)
        liked = studyPost.getLiked(memId, id)
        return jsonify({
            'likes' : likes,
            'liked' : liked
        })
    return jsonify({'message': 'Invalid request method'})   # 추가: POST 요청 이외의 다른 요청에 대한 처리 로직
        

