from flask import Flask, session, Blueprint, request, jsonify
from flask_login import login_required, current_user
from datetime import datetime
import json

from backend.view import uploadFileS3
from backend.controller.studyroom_mgmt import StudyRoom
from backend.controller.mentoringroom_mgmt import MentoringRoom

studyroom_bp = Blueprint('studyRoom', __name__, url_prefix='/study-room')

@studyroom_bp.route('', methods=['GET'])
def listRoom() :

    login_member = current_user.get_id()

    studyRooms = StudyRoom.findByMemberId(login_member)
    mentoringRooms = MentoringRoom.findByMemberId(login_member)

    studyRoomList = []
    mentoringRoomList = []

    for room in studyRooms :
        studyRoomList.append({
            'id' : room.id,
            'name' : room.name,
            'leader' : room.leader,
            'image' : room.image
        })

    for room in mentoringRooms :
        mentoringRoomList.append({
            'id' : room.id,
            'name' : room.name,
            'mento' : room.mento,
            'image' : room.mentoPic
        })

    return {
        'studyRoom' : studyRoomList,
        'mentoringRoom' : mentoringRoomList
    }

@studyroom_bp.route('', methods=['POST'])
def createRoom() :

    file = request.files['image']
    image = uploadFileS3(file)

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
