from flask import Blueprint, request
from datetime import datetime
from bardapi import Bard
from random import randint
import json
import os

from backend import config
from backend.view import uploadFileS3, s3, login_required, findNickName, formatYMDHM
from backend.model.db_mongo import conn_mongodb
from backend.controller.member_mgmt import Member
from backend.controller.mentoringroom_mgmt import MentoringRoom

mentoringroom_bp = Blueprint('mentoringRoom', __name__, url_prefix='/mentoring-room')

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

# TODO 결제할 때마다 mr.lesson_cnt += p.duration
# TODO 환급할 때마다 mr.refund_cnt += 환급 횟수

@mentoringroom_bp.route('/<id>/lesson', methods=['GET'])
@login_required
def checkLesson(id, loginMember, new_token):

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

    isMentoChk = request.args.get('isMento')

    if isMentoChk == True:
        MentoringRoom.updateMentoCheck(id)
    elif isMentoChk == False:
        MentoringRoom.updateMentiCheck(id)
    else:
        pass

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


# 후기 관련 파트
    # review_list = Review.showReview(mentoId)
    # review = []

    # for rev in review_list :
    #     review.append({
    #         'reviewId' : rev[0],
    #         'menti' : rev[1],
    #         'review' : rev[2]
    #     })

    # return jsonify({
    #     'portfolio' : detail,
    #     'review' : review
    # })


@mentoringroom_bp.route('/<mentoId>/review', methods = ['POST', 'PUT', 'DELETE'])
def review(mentoId) :
    if request.method == 'POST' : # 후기 작성

        cnt = request.get_json()['content']

        writer = current_user.id

        try :
            pk = Review.writeReview(writer, cnt, mentoId)
        except Exception as ex:
            print("에러 이유 : " + str(ex))
            pk = 0

        return jsonify({
            'reviewId' : pk # 0 is fail
        })

    elif request.method == 'PUT' : # 후기 수정

        reviewId = request.get_json()['reviewId']
        newContent = request.get_json()['content']

        try :
            done = Review.modifyReview(reviewId, newContent)
        except Exception as ex :
            print("에러 이유 : " + str(ex))
            done = 0

        return jsonify({
            'done' : done
        })

    else : # 후기 삭제

        reviewId = request.get_json()['reviewId']

        try :
            done = Review.removeReview(reviewId)
        except Exception as ex :
            print("에러 이유 : " + str(ex))
            done = 0

        return jsonify({
            'done' : done
        })