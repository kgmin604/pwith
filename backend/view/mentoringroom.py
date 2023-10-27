from flask import Blueprint, request
from datetime import datetime
from bardapi import Bard
from random import randint
import requests
import json
import os

from backend import config
from backend.view import uploadFileS3, s3, login_required, findNickName, formatYMDHM, payKakao, payKakaoSuccess
from backend.model.db_mongo import conn_mongodb
from backend.controller.member_mgmt import Member
from backend.controller.mentoringroom_mgmt import MentoringRoom
from backend.controller.review_mgmt import Review

mentoringroom_bp = Blueprint('mentoringRoom', __name__, url_prefix='/mentoring-room')

tids = {}
classes = {}
@mentoringroom_bp.route('/<id>/pay', methods=['POST'])
@login_required
def payTuition(loginMember, new_token, id) : # 결제

    global tids, classes

    info = MentoringRoom.findById(id)

    if not info:
        return {
            'status' : 400,
            'message' : '없는 멘토링룸',
            'data' : None,
            'access_token' : new_token
        }
    room = info['room']
    portfolio = info['portfolio']

    if loginMember.id != room.menti :
        return {
            'status' : 403,
            'message' : '권한 없는 사용자',
            'data' : None,
            'access_token' : new_token
        }

    class_cnt = request.get_json()['classes']

    item_name = f'{findNickName(room.mento)} 멘토링 수업료'
    total_tuition = class_cnt * portfolio.tuition
    response = payKakao(id, loginMember, item_name, total_tuition)
    print(response)

    classes[loginMember.id] = class_cnt
    tids[loginMember.id] = response['tid']

    redirect_url = response['next_redirect_pc_url']
    
    return {
        'data': {
            'pay_url': redirect_url
        },
        'access_token': new_token
    }

@mentoringroom_bp.route('/<id>/pay/success', methods=['GET'])
@login_required
def paySuccess(loginMember, new_token, id):

    global tids, classes

    pg_token = request.args.get('pg_token')

    response = payKakaoSuccess(loginMember, pg_token, tids.get(loginMember.id, ''))
    print(response)

    if response.get('code', None):
        return {
            'status': 404,
            'message': '결제 승인 요청 실패',
            'data': None,
            'access_token': new_token
        }

    MentoringRoom.updateLessonCnt(id, classes.get(loginMember.id, 0))

    del tids[loginMember.id]
    del classes[loginMember.id]

    return {
        'data': None,
        'access_token': new_token
    }

# TODO 환급할 때마다 mr.refund_cnt += 환급 횟수
@mentoringroom_bp.route('/<id>', methods=['PATCH'])
@login_required
def updateNotice(loginMember, new_token, id) : # 공지 수정

    info = MentoringRoom.findById(id)

    if not info:
        return {
            'status' : 400,
            'message' : '없는 멘토링룸',
            'data' : None,
            'access_token' : new_token
        }

    mentoId = info['room'].mento
    if loginMember.id != mentoId :
        return {
            'status' : 403,
            'message' : '권한 없는 사용자',
            'data' : None,
            'access_token' : new_token
        }

    new_notice = request.get_json()['notice']

    MentoringRoom.updateNotice(id, new_notice)

    return {
        'data' : None,
        'access_token' : new_token
    }

@mentoringroom_bp.route('/<id>', methods=['DELETE']) # TODO 결제 관련 코드 추가
@login_required
def deleteRoom(loginMember, new_token, id) : # 룸 삭제

    info = MentoringRoom.findById(id)

    if not info:
        return {
            'status' : 400,
            'message' : '없는 멘토링룸',
            'data' : None,
            'access_token' : new_token
        }

    mentoId = info['room'].mento
    if loginMember.id != mentoId :
        return {
            'status' : 403,
            'message' : '권한 없는 사용자',
            'data' : None,
            'access_token' : new_token
        }

    MentoringRoom.delete(id)

    return {
        'data' : None,
        'access_token' : new_token
    }

@mentoringroom_bp.route('/<id>', methods=['GET'])
@login_required
def showRoom(loginMember, new_token, id) : # 룸 준비 페이지
    
    info = MentoringRoom.findById(id)

    if not info:
        return {
            'status' : 400,
            'message' : '없는 멘토링룸',
            'data' : None,
            'access_token' : new_token
        }

    # 1. room
    room = info['room']
    mentoId = room.mento
    mentiId = room.menti

    portfolio = info['portfolio']

    if loginMember.id not in [mentoId, mentiId]:
        return {
            'status' : 403,
            'message' : '권한 없는 사용자',
            'data' : None,
            'access_token' : new_token
        }

    m = Member.findById(mentoId)
    mento = {
        'memId' : m.memId,
        'nickname' : m.nickname,
        'image' : m.image
    }

    m = Member.findById(mentiId)
    menti = {
        'memId' : m.memId,
        'nickname' : m.nickname,
        'image' : m.image
    }

    # 2. chat
    chats = []
    chatList = conn_mongodb().mentoringroom_chat.find({'roomId':int(id)})

    for c in chatList:
        chats.append({
            'sender' : c['sender'],
            'content' : c['content'],
            'date' : formatYMDHM(c['createdAt'])
        })

    # 3. review
    review = None
    if rv:= Review.findByRoom(id):
        review = {
            'id' : rv.id,
            'content' : rv.content,
            'date' : formatYMDHM(rv.curDate),
            'score' : rv.score
        }
    
    return {
        'data' : {
            'room' : {
                'id' : id,
                'name' : room.name,
                'notice' : room.notice if room.notice else '',
                'mento' : mento,
                'menti' : menti,
                'image' : portfolio.mentoPic
            },
            'review' : review,
            'chat' : chats,
            'lesson' : {
                'total' : room.lesson_cnt,
                'mento' : room.mento_cnt,
                'menti' : room.menti_cnt,
                'refund' : room.refund_cnt
            }
        },
        'access_token' : new_token
    }

@mentoringroom_bp.route('/<id>/lesson', methods=['GET'])
@login_required
def checkLesson(id, loginMember, new_token): # 수업 횟수 체크

    info = MentoringRoom.findById(id)

    if not info:
        return {
            'status' : 400,
            'message' : '없는 멘토링룸',
            'data' : None,
            'access_token' : new_token
        }

    room = info['room']
    if loginMember.id not in [room.mento, room.menti]:
        return {
            'status' : 403,
            'message' : '권한 없는 사용자',
            'data' : None,
            'access_token' : new_token
        }

    checkFrom = request.args.get('check')

    if checkFrom == 'mento':
        MentoringRoom.updateMentoCheck(id)
    elif checkFrom == 'menti':
        MentoringRoom.updateMentiCheck(id)

    return {
        'data': None
    }

@mentoringroom_bp.route('/<id>/out', methods=['DELETE']) # TODO 결제 관련 코드 추가
@login_required
def studyOut(id, loginMember, new_token) : # 스터디 그만두기
    pass

    # if not MentoringRoom.existByMemberAndRoom(loginMember.id, id):
    #     return {
    #         'status': 403,
    #         'message': '탈퇴 대상자 아님',
    #         'data': None,
    #         'access_token': new_token
    #     }
    
    # done = MentoringRoom.deleteStudent(loginMember.id, id)
    
    # if done == 0 :
    #     return {
    #         'status' : 400,
    #         'message' : "스터디를 삭제할 수 없습니다.",
    #         'data' : None,
    #         'access_token' : new_token
    #     }
    # else: 
    #     return {
    #         'data' : None,
    #         'access_token' : new_token
    #     }

@mentoringroom_bp.route('/<id>', methods=['POST'])
@login_required
def writeReview(id, loginMember, new_token) : # 후기 작성

    info = MentoringRoom.findById(id)

    if not info:
        return {
            'status' : 400,
            'message' : '없는 멘토링룸',
            'data' : None,
            'access_token' : new_token
        }

    room = info['room']
    if loginMember.id != room.menti :
        return {
            'status' : 403,
            'message' : '권한 없는 사용자',
            'data' : None,
            'access_token' : new_token
        }

    if Review.existsByWriterAndRoom(id, loginMember.id) :
        return {
            'status' : 409,
            'message' : '이미 후기 존재',
            'data' : None,
            'access_token' : new_token
        }

    data = request.get_json()
    content = data['content']
    score = data['score']

    key = Review.save(loginMember.id, content, score, datetime.now(), room.mento, id)

    return {
        'reviewId' : key,
        'access_token' : new_token
    }

@mentoringroom_bp.route('/<id>/<reviewId>', methods=['PATCH'])
@login_required
def updateReview(id, reviewId, loginMember, new_token) : # 후기 수정

    review = Review.findByIdAndRoom(reviewId, id)
    if not review:
        return {
            'status' : 400,
            'message' : '없는 후기',
            'data' : None,
            'access_token' : new_token
        }
    if loginMember.id != review.writer :
        return {
            'status' : 403,
            'message' : '권한 없는 사용자',
            'data' : None,
            'access_token' : new_token
        }

    data = request.get_json()
    newContent = data['content']
    newScore = data['score']

    Review.update(reviewId, newContent, newScore)

    return {
        'data': None,
        'access_token' : new_token
    }

@mentoringroom_bp.route('/<id>/<reviewId>', methods=['DELETE'])
@login_required
def deleteReview(id, reviewId, loginMember, new_token) : # 후기 삭제

    review = Review.findByIdAndRoom(reviewId, id)
    if not review:
        return {
            'status' : 400,
            'message' : '없는 후기',
            'data' : None,
            'access_token' : new_token
        }
    if loginMember.id != review.writer :
        return {
            'status' : 403,
            'message' : '권한 없는 사용자',
            'data' : None,
            'access_token' : new_token
        }

    Review.delete(reviewId)

    return {
        'data': None,
        'access_token' : new_token
    }