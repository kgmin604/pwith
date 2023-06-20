from flask import Flask, Blueprint, request, jsonify, redirect, url_for, session, render_template
from flask_login import login_user, current_user, login_required
from controller.chat_mgmt import chat

chat_bp = Blueprint('chat', __name__, url_prefix='/mypage/chat')

@login_required
@chat_bp.route('', methods=['GET', 'POST'])
def send():
    if request.method == 'POST':
        print("Post request")
        data = request.get_json(silent=True)  # silent: parsing fail 에러 방지
        
        postType = data.get('type')
        memId = data.get('memId')
        oppId = data.get('oppID')
        
        print(postType)
        print(oppId)
        
        if postType == '1':  # 쪽지 보내기
            content = data['content']
            curDate = chat.curdate()
            chat.insertChat(memId, oppId, content, curDate)
            print("insert 완.")
            return 'Response', 200
            
        if postType == '0':  # 상대방과의 채팅목록 가져오기
            chatlist = chat.getMyChat(memId, oppId)
            print(chatlist)
            return jsonify(chatlist)
    
        return 'Response', 200
        
    if request.method == 'GET':
        print("Get request")
        data = request.get_json(silent=True)  # silent: parsing fail 에러 방지
        postMemId = data.get('memId')
        toFront = []
        chattings = chat.getAllChat(postMemId)
        print("memid = " + postMemId)
        print(chattings)
        for chatting in chattings:
            chatting_data = {
                'oppId': chatting[2],
                'content': chatting[3],
                'date': chatting[4]
            }
            #print(chatting_data)
            toFront.append(chatting_data)
        print(toFront)
        return jsonify(toFront)
