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

    mentoId = MentoringRoom.findById(id)['room'].mento
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

    mentoId = MentoringRoom.findById(id)['room'].mento
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

    room = info['room']
    mentoId = room.mento
    mentiId = room.menti

    if not info['mentoPic']:

        location = s3.get_bucket_location(Bucket=config.S3_BUCKET_NAME)["LocationConstraint"]
        
        mentoPic = f"https://{config.S3_BUCKET_NAME}.s3.{location}.amazonaws.com/studyroom/default_study_image_{randint(1, 3)}.jpg"

    else:
        mentoPic = info['mentoPic']

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
                'image' : mentoPic
            },
            'chat' : chats
        },
        'access_token' : new_token
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