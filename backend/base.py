from backend import app, config
from backend.view import s3
from flask import request
from werkzeug.utils import secure_filename

from flask_socketio import SocketIO, emit

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

    #     # return {
    #     #     'result' : '파일 업로드 성공'
    #     # }
    
    # return {
    #     'status' : 404,
    #     'message' : '선택된 파일 없음',
    #     'data' : None
    # }
    
socketio = SocketIO(app, cors_allowed_origins="http://localhost:3000")

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
    app.run(host="127.0.0.1", port="5000")