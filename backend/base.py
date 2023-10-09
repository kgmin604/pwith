from backend import app, config
from backend.model.db_mongo import conn_mongodb
from backend.view import s3, findSocialLoginMember, formatYMDHM
from backend.controller.member_mgmt import Member

import functools
from werkzeug.utils import secure_filename
from datetime import datetime
from flask import request, session
from flask_login import current_user
from flask_socketio import SocketIO, join_room, leave_room, rooms, emit, disconnect

socketio = SocketIO(app, cors_allowed_origins='*')

if __name__ == "__main__": # 해당 파일을 실행했을 경우
    # app.run(host="127.0.0.1", port="5000")
    socketio.run(app, host="127.0.0.1", port=5000)

@socketio.on('connect', namespace='/study-ready')
def test_connect():
    print("========스터디룸 준비 페이지 연결========")
    print(rooms())

@socketio.on('connect', namespace='/mentoring-ready')
def test_connect():
    print("========멘토링룸 준비 페이지 연결========")
    print(rooms())

@socketio.on('disconnect', namespace='/study-ready')
def test_disconnect():
    print('========스터디룸 준비 페이지 연결 해제========')
    print(rooms())

@socketio.on('disconnect', namespace='/mentoring-ready')
def test_disconnect():
    print('========멘토링룸 준비 페이지 연결 해제========')
    print(rooms())

@socketio.on('enter', namespace='/study-ready')
def enterRoom(data):
    print("======스터디룸 준비 페이지 입장======")
    roomId = data['roomId']
    join_room('s'+str(roomId))
    print(rooms())

@socketio.on('enter', namespace='/mentoring-ready')
def enterRoom(data):
    print("======멘토링룸 준비 페이지 입장======")
    roomId = data['roomId']
    join_room('m'+str(roomId))
    print(rooms())

@socketio.on("sendTo", namespace='/study-ready')
def sendMessage(data):
    print("======스터디룸 메시지 전송======")
    roomId = data['roomId']
    message = data['message']
    sender = data['sender']

    now = datetime.now()
    formatted_now = formatYMDHM(now)

    conn_mongodb().studyroom_chat.insert_one({
        'sender': sender,
        'content': message,
        'createdAt': now,
        'roomId': roomId
    })
    emit('sendFrom', {'sender': sender, 'content': message, 'date': formatted_now}, to = 's'+str(roomId))

@socketio.on("sendTo", namespace='/mentoring-ready')
def sendMessage(data):
    print("======멘토링룸 메시지 전송======")
    roomId = data['roomId']
    message = data['message']
    sender = data['sender']

    now = datetime.now()
    formatted_now = formatYMDHM(now)

    conn_mongodb().mentoringroom_chat.insert_one({
        'sender': sender,
        'content': message,
        'createdAt': now,
        'roomId': roomId
    })
    emit('sendFrom', {'sender': sender, 'content': message, 'date': formatted_now}, to = 'm'+str(roomId))

@socketio.on("leave", namespace='/study-ready')
def leaveRoom(data):
    print("=======스터디룸 준비 페이지 나감=======")
    roomId = data['roomId']
    leave_room('s'+str(roomId))
    print(rooms())

@socketio.on("leave", namespace='/mentoring-ready')
def leaveRoom(data):
    print("=======멘토링룸 준비 페이지 나감=======")
    roomId = data['roomId']
    leave_room('m'+str(roomId))
    print(rooms())

# @socketio.on('connect', namespace='/live')
# def test_connect():
#     print("========CONNECT live========")
#     print(rooms())

# @socketio.on('disconnect', namespace='/live')
# def test_disconnect():
#     print('========DISCONNECT live========')
#     print(rooms())

# @socketio.on("sendToRoom", namespace='/live')
# def sendMessage(data):
#     print("======SENDMSGROOM======")
    
#     roomId = data['roomId']
#     message = data['message']
#     sender = data['sender']

#     now = datetime.now()
#     formatted_now = formatYMDHM(now)

#     emit('sendFromRoom', {'sender': sender, 'content': message, 'date': formatted_now}, to = roomId)

# @socketio.on('join_room', namespace='/live')
# def joinroom(roomId):
#     print("======조인룸======")
#     join_room(roomId)
#     print(rooms())
#     emit('welcome', to=roomId)

# @socketio.on('offer', namespace='/live')
# def handle_offer(offer):
#     print("======offer=======")
#     emit('offer', offer)

# @socketio.on('answer', namespace='/live')
# def handle_answer(answer):
#     print("======answer=======")
#     emit('answer', answer)

# @socketio.on('ice', namespace='/live')
# def handle_ice(ice):
#     print("======ice=======")
#     emit('ice', ice)
