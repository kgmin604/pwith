from flask import Flask, Blueprint, request, jsonify, redirect, url_for, session
from flask_login import login_user, current_user, login_required
from controller.chat_mgmt import chat

chat_bp = Blueprint('chat', __name__, url_prefix='/chat')

@chat_bp.route('', method=['POST'])
@login_required
def send():
    data = request.get_json(silent=True) # silent: parsing fail 에러 방지
    sender = current_user.getId()
    receiver = data['receiver']
    content = data['content']
    curDate = chat.getCurDate()
    #chat.insertChat(sender, content, curDate)
        
        
@chat_bp.route('', method = ['GET'])
@login_required
def show():
    if request.method == 'GET' :

        toFront = {}

       # post = chat.findById(id)

        toFront = {
            'sender': chat.getSender(),
            'receiver': chat.getReceiver(),
            'content': chat.getContent(),
            'curdate': chat.getCurDate()
        }

        return toFront