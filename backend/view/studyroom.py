from flask import Flask, session, Blueprint, request, jsonify
from flask_login import current_user
from datetime import datetime
from bardapi import Bard
import json
import os

from backend import config
from backend.view import uploadFileS3, s3, login_required, findNickName, formatYMDHM
from backend.model.db_mongo import conn_mongodb
from backend.controller.member_mgmt import Member
from backend.controller.studyroom_mgmt import StudyRoom
from backend.controller.mentoringroom_mgmt import MentoringRoom

studyroom_bp = Blueprint('studyRoom', __name__, url_prefix='/study-room')

@studyroom_bp.route('', methods=['GET'])
@login_required
def listRoom(loginMember, new_token) : # 룸 목록 조회

    studyRooms = StudyRoom.findByMemberId(loginMember.id)
    mentoringRooms = MentoringRoom.findByMemberId(loginMember.id)

    studyRoomList = []
    mentoringRoomList = []

    for room in studyRooms :
        studyRoomList.append({
            'id' : room.id,
            'name' : room.name,
            'leader' : room.leader,
            'image' : room.image,
            'joinP' : room.joinP
        })

    for room in mentoringRooms :
        mentoringRoomList.append({
            'id' : room.id,
            'name' : room.name,
            'mento' : room.mento,
            'image' : room.mentoPic
        })

    return {
        'data' : {
            'profileImage' : loginMember.image,
            'studyRoom' : studyRoomList,
            'mentoringRoom' : mentoringRoomList
        },
        'access_token' : new_token
    }

@studyroom_bp.route('', methods=['POST'])
@login_required
def createRoom(loginMember, new_token) : # 룸 생성

    default_image = request.args.get('image')

    if not default_image :

        file = request.files['image']
        image = uploadFileS3(file, "studyroom")
    else :

        location = s3.get_bucket_location(Bucket=config.S3_BUCKET_NAME)["LocationConstraint"]
        
        image = f"https://{config.S3_BUCKET_NAME}.s3.{location}.amazonaws.com/studyroom/default_study_image_{str(default_image)}.jpg"

    data_str = request.form['data']
    data = json.loads(data_str)

    roomName = data['roomName']
    category = data['category']
    totalP = data['totalP']

    roomId = StudyRoom.save(roomName, datetime.now(), category, loginMember.id, image, totalP)

    done = StudyRoom.addStudent(loginMember.id, roomId)

    if done != 1 :
        return {
            'status' : 400,
            'message' : '실패',
            'data' : None,
            'access_token' : new_token
        }

    return {
        'data' : None,
        'access_token' : new_token
    }

@studyroom_bp.route('/<id>', methods=['PATCH'])
@login_required
def updateNotice(loginMember, new_token, id) : # 공지 수정

    leaderId = StudyRoom.findById(id).leader
    if loginMember.id != leaderId :
        return {
            'status' : 403,
            'message' : '권한 없는 사용자',
            'data' : None,
            'access_token' : new_token
        }

    new_notice = request.get_json()['notice']

    StudyRoom.updateNotice(id, new_notice)

    return {
        'data' : None,
        'access_token' : new_token
    }

@studyroom_bp.route('/<id>', methods=['GET'])
@login_required
def showRoom(loginMember, new_token, id) : # 룸 준비 페이지
    
    room = StudyRoom.findById(id)

    join_members = []
    members = StudyRoom.findMemberByRoomId(id)

    for m in members :
        join_members.append({
            'memId' : m.memId,
            'nickname' : m.nickname,
            'image' : m.image
        })
    '''
    chats = []
    chatList = conn_mongodb().studyroom_chat.find({'roomId':int(id)})

    for c in chatList:
        chats.append({
            'sender' : c['sender'], #['nickname'], TODO TEST
            'content' : c['content'],
            'date' : formatYMDHM(c['createdAt'])
        })
    '''
    return {
        'data' : {
            'name' : room.name,
            'notice' : room.notice,
            'leader' : findNickName(room.leader),
            'image' : room.image,
            'join_members' : join_members
            # 'chat' : chats
        },
        'access_token' : new_token
    }
    
@studyroom_bp.route('/live/<id>', methods=['GET'])
@login_required
def studyStart(loginMember, new_token, id): # 룸 상세
    
    room = StudyRoom.findById(id)
    members = StudyRoom.findMemberByRoomId(id)

    return{
        'data' : None,
        'access_token' : new_token
    }
    
@studyroom_bp.route('/<id>/code-bard', methods=['POST'])
@login_required
def codeBard(id, loginMember, new_token) : # 코드 리뷰
    
    data = request.get_json(silent=True)
    question = data['text']
    

    bard = Bard(token=config.BARD_TOKEN)
    response = bard.get_answer(question)['content']
    
    return{
        'data' : {
            'answer': response
        },
        'access_token' : new_token
    }