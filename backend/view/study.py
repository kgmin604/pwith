from flask import Flask, session, Blueprint, render_template, redirect, request, jsonify, url_for
from flask_login import login_required, current_user
from backend.controller.study_mgmt import studyPost
from backend.controller.replyStudy_mgmt import ReplyStudy
from backend.controller.studyroom_mgmt import StudyRoom
from backend.view import findNickName, getFormattedDate, mainFormattedDate, formatDateToString, getProfileImage, nicknameToId
from datetime import datetime
import json

study_bp = Blueprint('study', __name__, url_prefix='/study')

@study_bp.route('', methods=['GET'])
def show():
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
            roomId = studyPost.findRoomId(study[0])
            rec = {
                'id' : study[0],
                'title' : study[1],
                'image' : studyPost.getRoomImage(roomId)
            }
            recStudy.append(rec)
        #return {
        #    'rec' : recStudy # by. 경민
        #}
        
    search = request.args.get('search')
    print("search")     
    print(search)       
    if search is None:
        posts = []
        result = []
        page = 0

        page = request.args.get('page')

        # 전체 글 출력
        posts = studyPost.getStudy()
        requiredPage = len(list(posts)) // 10 + 1   # 전체 페이지 수

        for i in range(int(page)):  # 전체 페이지 수 만큼 각 페이지당 studyList 가져오기
            studyList = studyPost.pagenation(i+1, 10)   # 매개변수: 현재 페이지, 한 페이지 당 게시글 수

        for i in range(len(posts)):
            post = {
                'id': i+1,
                'studyId': posts[i][0],
                'title': posts[i][1],
                'writerId': posts[i][2],
                'writerNick': findNickName(posts[i][2]),
                # 'image' : getProfileImage(current_user.get_id()),
                'curDate': posts[i][3],
                'likes': posts[i][5],
                'views': posts[i][6]
            }
            post['curDate'] = mainFormattedDate(posts[i][3])

            result.append(post)

        return{
            'posts': result,
            'num': requiredPage,
            'rec' : recStudy
        }
        
    else:
        
        posts = []
        
        searchType = request.args.get('type')
        searchValue = request.args.get('value')
        
        result = []
        page = 0

        page = request.args.get('page')
        print(page)
        

        if not page :
            page = 0
        #     return jsonify(result)

        page = int(page)

        if int(searchType) == 0: # 제목으로 검색
            posts = studyPost.findByTitle(searchValue)
        elif int(searchType) == 1 : # 글쓴이로 검색
            posts = studyPost.findByWriter(searchValue)
            
        if posts is None:   
            requiredPage = 0
        else:
            requiredPage = len(list(posts)) // 10 + 1   # 전체 페이지 수
        result = []
        print(posts)

        if posts is None :
            pass # 결과 없을 시 empty list
        else :
            for i in range(page):  # 전체 페이지 수 만큼 각 페이지당 studyList 가져오기
                requiredPage = len(list(posts)) // 10 + 1   # 전체 페이지 수
                studyList = studyPost.pagenation(i+1, 10)   # 매개변수: 현재 페이지, 한 페이지 당 게시글 수
                
            for i in range(len(posts)) :
                post = {
                    'id' : i+1,
                    'studyId' : posts[i][0],
                    'title' : posts[i][1],
                    'writerId': posts[i][2],
                    'writerNick': findNickName(posts[i][2]),
                    # 'image' : getProfileImage(current_user.get_id()),
                    'curDate' : posts[i][3],
                    'likes' : posts[i][5],
                    'views' : posts[i][6]
                }
                post['curDate'] = mainFormattedDate(formatDateToString(posts[i][3]))
                
                result.append(post)

        return {
            'posts' : result,
            'num': requiredPage,
            'rec' : recStudy
            }


@study_bp.route('/<int:id>', methods=['GET'])
def showDetail(id) :     # 글 조회

        memId = current_user.get_id()
        apply = request.args.get('apply')

        if apply == 'go' : # 스터디 신청
            roomId = studyPost.findRoomId(id)

            # studentsList_string = StudyRoom.getStudentList(roomId)

            # newStudentList = ''

            #if not studentsList_string :
            #    newStudentList = f'["{current_user.get_id()}"]'
                # newStudentList = f'["a"]' # dummmmmmmmmmmmmmy
            #else :
            #    studentsList = json.loads(studentsList_string) # list
            #    studentsList.append(current_user.get_id())
            #    # studentsList.append("a") # dummmmmmmmmmmmmmy
            #    newStudentList = str(studentsList)
            #    newStudentList = newStudentList.replace("\'", "\"")

            done = StudyRoom.addStudent(current_user.get_id(), roomId)
            print(done)
            
            print("apply")
            # studyAlarm 에 추가
            
            post = studyPost.findById(id)
            studyPost.insertStudyAlarm(post.writer, current_user.get_id(), roomId)


        result = {}

        post = studyPost.findById(id)

        postDate = getFormattedDate(formatDateToString(post.curDate))
        
        roomId= studyPost.findRoomId(id) #roomName 조회위해서 미리 변수로 리턴받음

        isApplied = None
        try : # 익명의 경우
            isApplied = f'"{current_user.get_id()}"' in StudyRoom.getStudentList(roomId)
            # print("ISAPPLIED" + str(isApplied))
        except Exception as ex:
            isApplied = False
            # print("에러 발생 : " + str(ex))

        liked = 0
        try : # 익명의 경우
            liked = studyPost.findLike(current_user.get_id(), id)
        except Exception as ex :
            liked = False

        print("curDAte : ")
        print(post.curDate)
        print(getFormattedDate(formatDateToString(post.curDate)))
        result = {
            'isApplied' : isApplied,
            'title': post.title,
            'writer' : findNickName(post.writer),
            'writerImage': getProfileImage(current_user.get_id()),
            'content': post.content,
            'curDate' : getFormattedDate(formatDateToString(post.curDate)),
            'likes' : post.likes,
            'liked' : liked,
            'views': post.views,
            'roomId' : roomId,
            'roomTitle' : studyPost.getRoomName(roomId),
            'totalP': studyPost.getTotalP(roomId),
            'joinP' : studyPost.getJoinP(roomId),
            'roomImage' : studyPost.getRoomImage(roomId)
            }
        
        viewresult = studyPost.updateViews(id)
        # print(viewresult)

        replyList = ReplyStudy.showReplies(id) # 댓글 조회

        replyResult = []

        for reply in replyList :

            date = formatDateToString(reply[3])

            replyResult.append({
                'id' : reply[0],
                'writer' : findNickName(reply[1]),
                'content' : reply[2],
                'date' : getFormattedDate(date),
                'profileImage': getProfileImage(memId)
            })

        return {
            'post' : result,
            'reply' : replyResult
        }
        
@study_bp.route('/update/<int:id>', methods = ['PATCH'])
def updatePost(id):   # 게시글 수정
        id = request.get_json()['postId']
        postContent = request.get_json()['content']
        
        try :
            done = studyPost.updateStudy(id, postContent)
        except Exception as ex :
            print("에러 이유 : " + str(ex))
            done = 0

        return {
            'data': None
        }
         
@study_bp.route('/<int:id>', methods = ['DELETE'])
def deletePost(id): # 게시글 삭제
    id = request.get_json()['postId']
    # print(id)
    
    try :
        done = studyPost.deleteStudy(id)
    except Exception as ex :
        # print("에러 이유 : " + str(ex))
        done = 0

    return {
        'data': None
    }

@study_bp.route('/<int:studyId>', methods = ['POST'])
def replyPost(studyId) :        # 댓글 작성
    cnt = request.get_json()['content']

    writer = current_user.get_id()

    date = datetime.now()

    try :
        replyId = ReplyStudy.writeReply(writer, cnt, date, studyId)
        # studyReplyAlarm 에 추가
        post = studyPost.findById(studyId)
        studyPost.insertReplyAlarm(post.writer, writer, replyId)
        print("insert alarm")
        
    except Exception as ex:
        print("에러 이유 : " + str(ex))
        replyId = 0
        
        return{
            'status': 400,
            'data' : None,
            'message' : "댓글을 달 수 없습니다."
        }
    return {
        'id' : replyId, 
        'date' : formatDateToString(date)
    }

@study_bp.route('/<int:studyId>/<int:replyId>', methods = ['PATCH'])
def replyPatch(studyId) :    # 댓글 수정

        replyId = request.get_json()['id']
        # print(replyId)
        newContent = request.get_json()['content']

        try :
            done = ReplyStudy.modifyReply(replyId, newContent)
        except Exception as ex :
            print("에러 이유 : " + str(ex))
            done = 0

        if done == 0:
            return{
                'status': 400,
                'data' : None,
                'message' : "댓글을 수정할 수 없습니다."
            }
        else:
            return {
                'id' : replyId, 
                'date' : formatDateToString(date)
            }

@study_bp.route('/<int:studyId>/<int:replyId>', methods = ['DELETE'])
def replyDelete(studyId) :     # 댓글 삭제

        replyId = request.get_json()['id']

        try :
            done = ReplyStudy.removeReply(replyId)
        except Exception as ex :
            print("에러 이유 : " + str(ex))
            done = 0

        return {
            'data': None
        }

@login_required
@study_bp.route("/create", methods=['GET', 'POST'])
def write():        # 글 작성
    if request.method == 'GET' :
        result = []

        roomList = studyPost.getMyStudyList(current_user.get_id())
        # roomList = studyPost.getMyStudyList('a')

        for room in roomList :
            result.append({
                'value' : room[0],
                'label' : room[1]
            })

        # print(result)
        return {
            'result' : result
        }

    else :

        data = request.get_json(silent=True)


        title = data['title']
        writer = current_user.get_id()
        curDate = studyPost.curdate()
        content = data['content']
        likes = 0
        views = 0
        roomId = data['roomId']
        
        done =studyPost.insertStudy(title, writer, curDate, content, likes, views, roomId)
        
        return {
            'data': None
        }
    
@login_required
@study_bp.route('/<int:id>/like', methods=['GET', 'POST'])
def like(id):
    memId = current_user.get_id()
    post = studyPost.findById(id)
    
    if request.method=='POST':
        postId = request.get_json()['postId']
        
        print(memId, postId)
        studyPost.Like(memId, id)
        
        likes = post.likes
        liked = studyPost.findLike(memId, id)
        
        return {
            'likes' : likes,
            'liked' : liked
        }

        
    # if request.method == 'GET':
    #    likes = post.likes
    #    liked = studyPost.findLike(memId, id)
    #    return jsonify({
    #        'likes' : likes,
    #        'liked' : liked
    #    })
    return {'message': 'Invalid request method'}   # 추가: POST 요청 이외의 다른 요청에 대한 처리 로직
        

