from flask import Flask, session, Blueprint, request, jsonify
from flask_login import login_required, current_user
from datetime import datetime
from controller.studyroom_mgmt import StudyRoom
from controller.mentoringroom_mgmt import MentoringRoom

studyroom_bp = Blueprint('studyRoom', __name__, url_prefix='/studyroom')

@studyroom_bp.route('', methods=['GET', 'POST'])
def showRoom() :
    if request.method == 'GET' :

        # logUser = current_user.getId()
        logUser = 'q'

        study_rooms = StudyRoom.show(logUser)
        mentoring_rooms = MentoringRoom.show(logUser)

        studyRoomList = []
        mentoringRoomList = []

        for r1 in study_rooms :
            studyRoomList.append({
                'roomId' : r1[0],
                'title' : r1[1],
                'category' : r1[2],
                'leader' : r1[3],
                'joinP' : r1[5],
                'totalP' : r1[6]
            })

        for r2 in mentoring_rooms :
            mentoringRoomList.append({
                'roomId' : r2[0],
                'title' : r2[1]
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
