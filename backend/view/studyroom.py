from flask import Flask, session, Blueprint, request, jsonify
from flask_login import login_required, current_user
from datetime import datetime
from controller.studyroom_mgmt import StudyRoom

studyroom_bp = Blueprint('studyRoom', __name__, url_prefix='/studyroom')

@studyroom_bp.route('', methods=['GET', 'POST'])
def showRoom() :
    if request.method == 'GET' :

        logUser = current_user.getId()

        rooms = StudyRoom.show(logUser)

        studyRoomList = []
        mentoringRoomList = []

        for room in rooms :
            studyRoomList.append({
                'roomId' : room[0],
                'title' : room[1],
                'category' : room[2],
                'leader' : room[3],
                'joinP' : room[5],
                'totalP' : room[6]
            })

        return jsonify({
            'studyRoom' : studyRoomList,
            'mentoringRoom' : mentoringRoomList
            })

@studyroom_bp.route('/create', methods=['GET', 'POST'])
def createRoom() :
    if request.method == 'GET' :
        pass
    else :
        info = request.get_json()

        title = info['title']
        category = info['category']
        totalP = info['totalP']
        leader = current_user.getId()

        done = StudyRoom.create(title, category, leader, totalP)

        return jsonify({
            'done' : done
        })
