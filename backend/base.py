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



@socketio.on('connect',namespace='/study-live')
def test_connect():
    print("========CONNECT live========")
    
@socketio.on('enter',namespace='/study-live')
def enterRoom(data):
    print("======ENTERROOM study-live======")
    roomId = data['roomId']
    print(roomId)
    join_room(roomId)
    print(rooms())

@socketio.on("send",namespace='/study-live')
def sendMessage(data):
    print("======SENDMSG study-live======")
    roomId = data['roomId']
    message = data['message']
    sender = data['sender']

    now = datetime.now()
    formatted_now = formatYMDHM(now)

    emit('sendFrom', {'sender': sender, 'content': message, 'date': formatted_now}, to = roomId)
    print(roomId, message, sender, formatted_now)


@socketio.on("leave",namespace='/study-live')
def leaveRoom(data):
    print("=======LEAVEROOM study-live=======")
    roomId = data['roomId']
    print(roomId)
    leave_room(roomId)
    print(rooms())

    
@socketio.on("codeSend",namespace='/study-live')
def sendCode(data):
    print("======SENDCODE live======")
    print(data)
    roomId = data['roomId']
    language=data['language']
    code = data['code']
    sender = data['sender']

    now = datetime.now()
    formatted_now = formatYMDHM(now)

    emit('codeUploadFrom', {'sender': sender, 'language':language, 'code': code}, to = roomId)
    
@socketio.on('connect',namespace='/mentoring-live')
def test_connect():
    print("========CONNECT mentoring - live========")

@socketio.on("send",namespace='/mentoring-live')
def sendMessage(data):
    print("======SENDMSG mentoring - live======")
    roomId = data['roomId']
    message = data['message']
    sender = data['sender']

    now = datetime.now()
    formatted_now = formatYMDHM(now)

    emit('sendFrom', {'sender': sender, 'content': message, 'date': formatted_now}, to = roomId)


@socketio.on("leave",namespace='/mentoring-live')
def leaveRoom(data):
    print("=======LEAVEROOM mentoring - live=======")
    roomId = data['roomId']
    print(roomId)
    leave_room(roomId)
    print(rooms())

@socketio.on('enter',namespace='/mentoring-live')
def enterRoom(data):
    print("======ENTERROOM mentoring - live======")
    roomId = data['roomId']
    print(roomId)
    join_room(roomId)
    print(rooms())
    
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

