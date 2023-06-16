from flask import Flask, Blueprint, request, jsonify, redirect, url_for, session
from flask_login import login_user, current_user, login_required
from controller.chat_mgmt import chat

chat_bp = Blueprint('chat', __name__, url_prefix='mypage/chat')

@chat_bp.route('', method=['POST'])
@login_required
def send():
    data = request.get_json(silent=True) # silent: parsing fail 에러 방지
    
    postType = data['type']
    memId = current_user.getId()
    oppId = data['oppId']
    
    if postType ==1 :       # 쪽지 보내기
        content = data['content']
        curDate = chat.getCurDate()
        chat.insertChat(memId, oppId, content, curDate)
        
    elif postType ==0 :     # 상대방과의 채팅목록 가져오기
        chat.getMyChat()
        
        
@chat_bp.route('', method = ['GET'])
@login_required
def show():
    if request.method == 'GET' :        # 전체 쪽지 목록 가져오기

        toFront = {}

        toFront = {
            'oppId': chat.getReceiver(),
            'content': chat.getContent(),
            'date': chat.getCurDate()
        }

        return toFront