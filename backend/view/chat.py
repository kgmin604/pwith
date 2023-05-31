from flask import Flask, Blueprint, request, jsonify, redirect, url_for, session
from flask_login import login_user, current_user, login_required
from controller.chat_mgmt import chat

chat_bp = Blueprint('chat', __name__, url_prefix='')

@chat_bp.route('/send', method=['GET', 'POST'])
@login_required
def send():
    if request.method == 'GET' :
        return jsonify(
            {'status': 'success'}
        )
    else :
        data = request.get_json(silent=True) # silent: parsing fail 에러 방지
        sender = current_user.getId()
        content = data['content']
        
        
@chat_bp.route('/receive', method = ['GET'])
@login_required
def show():
    if request.method == 'GET' :

        toFront = {}

       # post = chat.findById(id)

        toFront = {
            'sender': chat.getSender(),
            'receive': chat.getReceiver(),
            'content': chat.getContent(),
            'curdate': chat.getCurDate()
        }

        return toFront