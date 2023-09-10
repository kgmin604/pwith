from backend import app, config, socketio
from backend.view import s3
from flask import request
from werkzeug.utils import secure_filename

from flask_socketio import SocketIO

# @app.route('/socket.io/', methods=['GET', 'POST'])
# def socketioTest():
#     print("=================")

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
    
# socketio = SocketIO(app, cors_allowed_origins="http://localhost:3000")

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
    # socketio.run(app)
    pass

@socketio.on('connect')
def test_connect():
    print("========CONNECT========")

@socketio.on('disconnect')
def test_disconnect():
    print('========DISCONNECT========')

@socketio.on('enter')
def enterRoom(): # data는 json type
    print("======ENTERROOM======")