from flask import Flask, session, Blueprint, request, jsonify
from flask_login import login_required, current_user
from datetime import datetime
import json

from backend import config
from backend.view import uploadFileS3, s3
from backend.controller.member_mgmt import Member
from backend.controller.studyroom_mgmt import StudyRoom
from backend.controller.mentoringroom_mgmt import MentoringRoom

studyroom_bp = Blueprint('studyRoom', __name__, url_prefix='/study-room')

@studyroom_bp.route('', methods=['GET'])
def listRoom() :

    loginId = current_user.get_id()
    loginMember = Member.findById(loginId)

    studyRooms = StudyRoom.findByMemberId(loginId)
    mentoringRooms = MentoringRoom.findByMemberId(loginId)

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
        'profileImage' : loginMember.image,
        'studyRoom' : studyRoomList,
        'mentoringRoom' : mentoringRoomList
    }

@studyroom_bp.route('', methods=['POST'])
def createRoom() :

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

    login_member = current_user.get_id()

    roomId = StudyRoom.save(roomName, datetime.now(), category, login_member, image, totalP)

    done = StudyRoom.addStudent(login_member, roomId)

    if done != 1 :
        return {
            'status' : 400,
            'message' : '실패',
            'data' : None
        }

    return {
        'data' : None
    }

@studyroom_bp.route('/<id>', methods=['GET'])
def showRoom(id) :
    
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
        'name' : room.name,
        'notice' : room.notice,
        'join_members' : join_members
    }