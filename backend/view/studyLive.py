from flask import Flask, render_template, Blueprint
from flask_socketio import SocketIO, emit

app = Flask(__name__)
socketio = SocketIO(app)

studyroom_bp = Blueprint('studyroom', __name__, url_prefix='/study-room')

@studyroom_bp.route('/live/<id>', methods=['GET'])
def live(id):
    return render_template('live.html', room_id=id)

@socketio.on('join_room')
def join_room(room_id):
    emit('welcome', room=room_id)

@socketio.on('offer')
def handle_offer(offer, room_id):
    emit('offer', offer, room=room_id)

@socketio.on('answer')
def handle_answer(answer, room_id):
    emit('answer', answer, room=room_id)

@socketio.on('ice')
def handle_ice(ice, room_id):
    emit('ice', ice, room=room_id)

if __name__ == "__main__":
    socketio.run(app, host='127.0.0.1', port=5000)
