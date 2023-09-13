from backend import app, config#, socketio
from backend.model.db_mongo import conn_mongodb
from backend.view import s3, findSocialLoginMember, formatYMDHM, login_required
from backend.controller.member_mgmt import Member

import functools
from werkzeug.utils import secure_filename
from datetime import datetime
from flask import request, session
from flask_login import current_user
from flask_socketio import SocketIO, join_room, leave_room, emit, disconnect

@app.route('/imgupload', methods=['POST'])
def upload_file():

    file = request.files['file']

    if file:

        filename = secure_filename(file.filename)

        s3.upload_fileobj(file, config.S3_BUCKET_NAME, filename)

    location = s3.get_bucket_location(Bucket=config.S3_BUCKET_NAME)["LocationConstraint"]

    return {
        'data' : f"https://{config.S3_BUCKET_NAME}.s3.{location}.amazonaws.com/{filename}.jpg"
    }
    
# @socketio.on('join_room')
# def join_room(roomId):
#     socketio.join_room(roomId)
#     socketio.emit('welcome', room=roomId)

# @socketio.on('offer')
# def handle_offer(offer, roomId):
#     socketio.emit('offer', offer, room=roomId)

# @socketio.on('answer')
# def handle_answer(answer, roomId):
#     socketio.emit('answer', answer, room=roomId)

# @socketio.on('ice')
# def handle_ice(ice, roomId):
#     socketio.emit('ice', ice, room=roomId)

if __name__ == "__main__": # 해당 파일을 실행했을 경우
    # app.run(host="127.0.0.1", port="5000")
    # socketio.run(app, host="127.0.0.1", port=5000)
    socketio.run(app)

socketio = SocketIO(app, manage_session=False, cors_allowed_origins=['http://localhost:3000'])

@socketio.on('connect')
def test_connect():
    print("========CONNECT========")

@socketio.on('disconnect')
def test_disconnect():
    print('========DISCONNECT========')

@socketio.on('enter')
def enterRoom(data):
    print("======ENTERROOM======")
    print(data)
    roomId = data['roomId']
    print(roomId)
    join_room(roomId)
    # done()
    # emit('in', {'nickname': socket['nickname']}, to=roomId)

# def authenticated_only(f):
#     @functools.wraps(f)
#     def wrapped(*args, **kwargs):
#         if not current_user.is_authenticated:
#             disconnect()
#         else:
#             print(current_user.id)
#             return f(*args, **kwargs)
#     return wrapped

# @login_required
# @authenticated_only
@socketio.on("sendTo")
def sendMessage(data):
    print("======SENDMSG======")
    
    roomId = data['roomId']
    message = data['message']
    sender = data['sender']

    # loginId = current_user.get_id()
    # if loginId is None :
    #     loginMember, new_token = findSocialLoginMember()
    # else :
    #     loginMember = Member.findById(loginId)

    now = datetime.now()

    conn_mongodb().studyroom_chat.insert_one({
        'sender': sender,
        'content': message,
        'createdAt': now,
        'roomId': roomId
    })

    formatted_now = formatYMDHM(now)
    emit('sendFrom', {'sender': sender, 'content': message, 'date': formatted_now})

@socketio.on("leave")
def leaveRoom(data):
    roomId = data['roomId']
    print(roomId)
    leave_room(roomId)
    # done()
    # socketio.emit("out", 'qwer', 123)