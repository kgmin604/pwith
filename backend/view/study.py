from flask import Flask, session, Blueprint, render_template, redirect, request, jsonify, url_for
from flask_login import login_required, current_user
from backend.controller.study_mgmt import studyPost
from backend.controller.replyStudy_mgmt import ReplyStudy
from backend.controller.studyroom_mgmt import StudyRoom
from backend.controller.member_mgmt import Member
from backend.controller.alarm_mgmt import Alarm
from backend.view import findNickName, getFormattedDate, mainFormattedDate, formatDateToString, getProfileImage, nicknameToId
from backend.view import login_required
from datetime import datetime
import json

study_bp = Blueprint('study', __name__, url_prefix='/study')

@study_bp.route('/recommend', methods=['GET'])
def recommend():
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
        
        
    return{
        'rec' : recStudy
    }    
    
@study_bp.route('', methods=['GET'])
def showPosts(): 
        
    result = []

    search = request.args.get('search')
    
    page = request.args.get('page')
    page = int(page) if page else 0

    if int(search) == 0: # 검색 x

        category = request.args.get('category')
        category = int(category) if category else 11

        # 전체 글
        posts = studyPost.getByCategoryAndPage(category, page, 10)

        # 전체 페이지 수
        post_cnt = studyPost.countByCategory(category)
        required_page = post_cnt // 10 + 1

    elif int(search) == 1: # 검색 o

        searchType = request.args.get('type')
        searchValue = request.args.get('value')
        
        if int(searchType) == 0: # 제목으로 검색
            posts = studyPost.findByTitleAndPage(searchValue, page, 10)
            post_cnt = studyPost.countBySearchTitle(searchValue)

        elif int(searchType) == 1 : # 글쓴이로 검색
            posts = studyPost.findByWriterAndPage(searchValue, page, 10)
            post_cnt = studyPost.countBySearchWriter(searchValue)

        required_page = post_cnt // 10 + 1

    if not posts:
        return {
            'posts': result,
            'num': required_page,
        }

    postOrder = 1
    for post in posts:
        result.append({
            'id': postOrder,
            'studyId': post.id,
            'title': post.title,
            'writerId': post.writer,
            'writerNick': findNickName(post.writer),
            'curDate': mainFormattedDate(post.curDate),
            'likes': post.likes,
            'views': post.views
        })
        postOrder += 1

    return {
        'posts' : result,
        'num': required_page
    }

@study_bp.route('/<int:id>/apply', methods=['POST']) # 스터디 신청
@login_required
def applyStudy(id,  loginMember, new_token ) :


    roomId = studyPost.findRoomId(id)
    done = StudyRoom.addStudent(loginMember.id, roomId)
    print(done)
    
    post = studyPost.findById(id) 
    Alarm.insertAlarm(post.writer, loginMember.id, roomId, 1)
    print("studyRoom alarm")

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
            # 'writerImage': getProfileImage(current_user.id),
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
def updatePost(id, loginMember, new_token): # 게시글 수정
        
    postContent = request.get_json()['content']
    postTitle = request.get_json()['title']
    
    studyPost.updateStudy(id, postContent, postTitle)

    return {
        'data': None,
        'access_token' : new_token
        }
         
@study_bp.route('/<int:id>', methods = ['DELETE'])
@login_required
def deletePost(id, loginMember, new_token): # 게시글 삭제

    studyPost.deleteStudy(id)

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
        Alarm.insertAlarm(post.writer, writer, replyId, 3)
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
def replyPatch(studyId, replyId, loginMember, new_token ) :    # 댓글 수정

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
def replyDelete(studyId, replyId, loginMember, new_token ) :     # 댓글 삭제

        try :
            done = ReplyStudy.removeReply(replyId)
        except Exception as ex :
            print("에러 이유 : " + str(ex))
            done = 0

        return {
            'data': None,
            'access_token' : new_token
        }

@study_bp.route('/create', methods=['GET', 'POST'])
@login_required
def write(loginMember, new_token): # 글 작성

    if request.method == 'GET' :

        result = []

        roomList = studyPost.getMyStudyList(loginMember.id)

        for room in roomList :
            result.append({
                'value' : room[0],
                'label' : room[1]
            })

        return {
            'data' : {
                'result' : result
            },
            'access_token' : new_token
        }
    else : # POST

        data = request.get_json()

        title = data['title']
        content = data['content']
        roomId = data['roomId']
        writer = loginMember.id
        curDate = datetime.now()
        likes = 0
        views = 0
        
        studyPost.insertStudy(title, writer, curDate, content, likes, views, roomId)
        
        return {
            'data': None,
            'access_token': new_token
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
 

