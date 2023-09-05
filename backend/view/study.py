from flask import Flask, session, Blueprint, render_template, redirect, request, jsonify, url_for
from flask_login import login_required, current_user
from backend.controller.study_mgmt import studyPost
from backend.controller.replyStudy_mgmt import ReplyStudy
from backend.controller.studyroom_mgmt import StudyRoom
from backend.controller.member_mgmt import Member
from backend.view import findNickName, getFormattedDate, mainFormattedDate, formatDateToString, getProfileImage, nicknameToId
from backend.view import login_required
from datetime import datetime
import json

study_bp = Blueprint('study', __name__, url_prefix='/study')

    
@study_bp.route('', methods=['GET'])
def show(): 
    
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
        
    search = request.args.get('search')
    if search == None : # 임시 예외 처리 (프론트 수정 완료되면 지우면 됩니다) - 채영
        search = 0      # (PS. 주석 정리도 부탁해요) 😘
      
    if int(search) == 0:
        print(search)
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

@study_bp.route('/<int:id>/apply', methods=['POST']) # 스터디 신청
@login_required
def applyStudy(id,  loginMember, new_token ) :


    roomId = studyPost.findRoomId(id)
    done = StudyRoom.addStudent(loginMember.id, roomId)
    print(done)
    
    post = studyPost.findById(id) 
    studyPost.insertStudyAlarm(post.writer, loginMember.id, roomId)

    return {
        'data' : None,
        'access_token' : new_token
    }

@study_bp.route('/<int:id>', methods=['GET'])
@login_required
def showDetail(id, loginMember, new_token) :     # 글 조회

        memId = loginMember.id

        result = {}

        post = studyPost.findById(id)

        postDate = getFormattedDate(formatDateToString(post.curDate))
        
        roomId= studyPost.findRoomId(id) #roomName 조회위해서 미리 변수로 리턴받음
        
        studentList = StudyRoom.findMemberByRoomId(roomId)
        
        print(studentList)
        for member in studentList:
            if loginMember is None:
                isApplied = False
            elif Member.findById(memId) == member:
                isApplied = True
            else:
                isApplied = False
                
        print("isApplied")
        print(isApplied)

        liked = 0
        try : # 익명의 경우
            liked = studyPost.findLike(memId, id)
        except Exception as ex :
            liked = False

        result = {
            'isApplied' : isApplied,
            'title': post.title,
            'writer' : findNickName(post.writer),
            # 'writerImage': getProfileImage(current_user.get_id()),
            'content': post.content,
            'curDate' : postDate,
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
                'profileImage': getProfileImage(reply[1])
            })

        return {
            'data' : {
                'post' : result,
                'reply' : replyResult
            },
            'access_token' : new_token
        }
        
@study_bp.route('/<int:id>', methods = ['PATCH'])
@login_required
def updatePost(id, loginMember, new_token):   # 게시글 수정
        # id = request.get_json()['postId']
        postContent = request.get_json()['content']
        postTitle = request.get_json()['title']
        
        try :
            done = studyPost.updateStudy(id, postContent, postTitle)
        except Exception as ex :
            print("에러 이유 : " + str(ex))
            done = 0

        return {
            'data': None,
            'access_token' : new_token
        }
         
@study_bp.route('/<int:id>', methods = ['DELETE'])
@login_required
def deletePost(id, loginMember, new_token): # 게시글 삭제

    try :
        done = studyPost.deleteStudy(id)
    except Exception as ex :
        print("에러 이유 : " + str(ex))
        done = 0

    return {
        'data': None,
        'access_token' : new_token
    }

@study_bp.route('/<int:studyId>', methods = ['POST'])
@login_required
def replyPost(studyId,  loginMember, new_token ) :        # 댓글 작성
    cnt = request.get_json()['content']

    writer = loginMember.id

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
            'message' : "댓글을 달 수 없습니다.",
            'access_token' : new_token
        }
    return {
        'data': {
            'id' : replyId, 
            'date' : formatDateToString(date)
        },
        'access_token' : new_token
    }

@study_bp.route('/<int:studyId>/<int:replyId>', methods = ['PATCH'])
@login_required
def replyPatch(studyId,  loginMember, new_token ) :    # 댓글 수정

        replyId = request.get_json()['replyId']
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
                'message' : "댓글을 수정할 수 없습니다.",
                'access_token' : new_token
            }
        else:
            return {
                'data':None,
                'access_token' : new_token
            }

@study_bp.route('/<int:studyId>/<int:replyId>', methods = ['DELETE'])
@login_required
def replyDelete(studyId,  loginMember, new_token ) :     # 댓글 삭제

        replyId = request.get_json()['replyId']

        try :
            done = ReplyStudy.removeReply(replyId)
        except Exception as ex :
            print("에러 이유 : " + str(ex))
            done = 0

        return {
            'data': None,
            'access_token' : new_token
        }

@study_bp.route("", methods=['GET', 'POST'])
@login_required
def write( loginMember, new_token ):        # 글 작성
    if request.method == 'GET' :
        result = []

        roomList = studyPost.getMyStudyList(loginMember.id)
        # roomList = studyPost.getMyStudyList('a')

        for room in roomList :
            result.append({
                'value' : room[0],
                'label' : room[1]
            })

        # print(result)
        return {
            'result' : result,
            'access_token' : new_token
        }

    else :

        data = request.get_json(silent=True)


        title = data['title']
        writer = loginMember.id
        curDate = studyPost.curdate()
        content = data['content']
        likes = 0
        views = 0
        roomId = data['roomId']
        
        done =studyPost.insertStudy(title, writer, curDate, content, likes, views, roomId)
        
        return {
            'data': None,
            'access_token' : new_token
        }
    
@study_bp.route('/<int:id>/like', methods=['POST'])
@login_required
def like(id, loginMember, new_token ):
    memId = loginMember.id
    post = studyPost.findById(id)

    postId = request.get_json()['postId']
    
    print(memId, postId)
    studyPost.Like(memId, id)
    
    likes = studyPost.getLikes(id)
    liked = studyPost.findLike(memId, id)
    print(likes)
    print(liked)
    
    return {
        'data': {
            'likes' : likes,
            'liked' : liked
        },
        'access_token' : new_token
    }
 

