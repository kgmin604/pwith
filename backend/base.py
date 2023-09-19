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

socketio = SocketIO(app, manage_session=False, cors_allowed_origins='*')

if __name__ == "__main__": # 해당 파일을 실행했을 경우
    # app.run(host="127.0.0.1", port="5000")
    # socketio.run(app, host="127.0.0.1", port=5000)
    socketio.run(app, host="127.0.0.1", port=5000)

@socketio.on('connect')
def test_connect():
    print("========CONNECT========")

@socketio.on('disconnect')
def test_disconnect():
    print('========DISCONNECT========')

@socketio.on('enter')
def enterRoom(data):
    print("======ENTERROOM======")
    roomId = data['roomId']
    print(roomId)
    join_room(roomId)
    print(rooms())

# def authenticated_only(f):
#     @functools.wraps(f)
#     def wrapped(*args, **kwargs):
#         if not current_user.is_authenticated:
#             disconnect()
#         else:
#             print(current_user.id)
#             return f(*args, **kwargs)
#     return wrapped

# @authenticated_only
@socketio.on("sendTo")
def sendMessage(data):
    print("======SENDMSG======")
    
    roomId = data['roomId']
    message = data['message']
    sender = data['sender']

    now = datetime.now()

    conn_mongodb().studyroom_chat.insert_one({
        'sender': sender,
        'content': message,
        'createdAt': now,
        'roomId': roomId
    })

    formatted_now = formatYMDHM(now)
    emit('sendFrom', {'sender': sender, 'content': message, 'date': formatted_now}, to = roomId)

@socketio.on("leave")
def leaveRoom(data):
    print("=======LEAVEROOM=======")
    roomId = data['roomId']
    print(roomId)
    leave_room(roomId)

@socketio.on("sendToRoom")
def sendMessage(data):
    print("======SENDMSGROOM======")
    
    roomId = data['roomId']
    message = data['message']
    sender = data['sender']

    now = datetime.now()
    formatted_now = formatYMDHM(now)

    emit('sendFromRoom', {'sender': sender, 'content': message, 'date': formatted_now}, to = roomId)

@socketio.on('join_room')
def join_room(roomId):
    print("======조인룸======")
    emit('welcome', room=roomId)

@socketio.on('offer')
def handle_offer(offer, roomId):
    emit('offer', offer, room=roomId)

@socketio.on('answer')
def handle_answer(answer, roomId):
    emit('answer', answer, room=roomId)

@socketio.on('ice')
def handle_ice(ice, roomId):
    emit('ice', ice, room=roomId)
