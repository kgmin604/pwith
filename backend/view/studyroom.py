from flask import Flask, session, Blueprint, request, jsonify
from flask_login import current_user
from datetime import datetime
from bardapi import Bard
import json
import os

from backend import config
from backend.view import uploadFileS3, s3, login_required, findNickName
from backend.controller.member_mgmt import Member
from backend.controller.studyroom_mgmt import StudyRoom
from backend.controller.mentoringroom_mgmt import MentoringRoom

studyroom_bp = Blueprint('studyRoom', __name__, url_prefix='/study-room')

@studyroom_bp.route('', methods=['GET'])
@login_required
def listRoom(loginMember, new_token) :

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
def createRoom(loginMember, new_token) :

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

@studyroom_bp.route('/<id>', methods=['GET'])
@login_required
def showRoom(loginMember, new_token, id) :
    
    room = StudyRoom.findById(id)

    members = StudyRoom.findMemberByRoomId(id)

    join_members = []

    for m in members :

        join_members.append({
            'memId' : m.memId,
            'nickname' : m.nickname,
            'image' : m.image
        })

    return {
        'data' : {
            'name' : room.name,
            'notice' : room.notice,
            'leader' : findNickName(room.leader),
            'image' : room.image,
            'join_members' : join_members
        },
        'access_token' : new_token
    }
    
@studyroom_bp.route('/<id>/code-bard', methods=['POST'])
@login_required
def codeBard(id, loginMember, new_token) :
    
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
    
@studyroom_bp.route('/live/<id>', methods=['GET'])
@login_required
def studyStart(loginMember, new_token, id):
    
    room = StudyRoom.findById(id)
    members = StudyRoom.findMemberByRoomId(id)

    return{
        'data' : None,
        'access_token' : new_token
    }