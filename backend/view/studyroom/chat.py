from flask import Blueprint
from backend import socketio

# studyroom_bp = Blueprint('studyRoom', __name__, url_prefix='/study-room')

@socketio.on('enter')
def enterRoom(json):
    print("enter room" + str(json))
    # roomId = session.get('room')
    # join_room(roomId)
    # socketio.emit('in', 'asdf', room = roomId) # session.get('nickname'), cnt

# @socketio.on("sendTo")
# def sendMessage():
#     print("send message")

# @socketio.on("leave")
# def leaveRoom():
#     socketio.emit("out", 'qwer', 123)

# @socketio.on("disconnecting")
# def disconnecting():
#     socketio.emit("out", 'asdfasdf', 123)