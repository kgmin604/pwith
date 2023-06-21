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
        
        print(data)
        postType = data.get('type')
        memId = current_user.getId()
        oppId = data.get('oppId')
        
        #print('postType = ' + str(postType)) # 형변환 추가-kgm
        #print('oppId = ' + oppId)
        
        if postType == 0:  # 상대방과의 채팅목록 가져오기
            #print("post msglist")
            chatlist = chat.getMyChat(memId, oppId)
            msgList =[]
            
            for chats in chatlist:
                chatting_data = {
                    'sender' : chats[1],
                    'receiver': chats[2],
                    'content'  : chats[3],
                    'date' : chats[4]
                }
                chatting_data['date'] = chat.getFormattedDate(chats[4])
                
                msgList.append(chatting_data)
            #print(chatlist)
            return jsonify(msgList)
        
        if postType == 1:  # 쪽지 보내기
            print("type = 1")
            content = data['content']
            curDate = chat.curdate()
            chat.insertChat(memId, oppId, content, curDate)
            print("insert 완.")
            return 'Response', 200
            
        
        if postType == 2:
            print("type = 2")
            oppChk = chat.chkOppId(oppId)
            if oppChk == True:  #oppId가 유효한 경우 result = 1
                result = 1
            else :
                result = 0
            print(result)
            return jsonify({'result' : result})
        return 'error', 200
        
    if request.method == 'GET':     #전체 채팅목록 가져오기 (current_user id와 관련있는 채팅 모두)
        print("Get request")
        
        postMemId = current_user.getId()
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
            chatting_data['date'] = chat.getFormattedDate(chatting[4])  #date 출력 형식 변경
            toFront.append(chatting_data)
        print(toFront)
        return jsonify(toFront)
