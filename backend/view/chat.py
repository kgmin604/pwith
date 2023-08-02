from flask import Flask, Blueprint, request, jsonify, redirect, url_for, session, render_template
from flask_login import login_user, current_user, login_required
from backend.controller.chat_mgmt import chat
from backend.view import IdtoMemId, nicknameToId, findNickName, getFormattedDate, mainFormattedDate, formatDateToString

chat_bp = Blueprint('chat', __name__, url_prefix='/mypage/chat')

@login_required
@chat_bp.route('/list', methods=['POST'])
def showList():     # 1:1 채팅 목록 가져오기

    data = request.get_json(silent=True)  # silent: parsing fail 에러 방지
    memId = current_user.get_id()
    oppId = nicknameToId(data.get('oppId'))
    
    
    #print('postType = ' + str(postType)) # 형변환 추가-kgm
    #print('oppId = ' + oppId)
    
# 상대방과의 채팅목록 가져오기
    #print("post msglist")
    print(memId)
    chatlist = chat.getMyChat(memId, oppId)
    msgList =[]
    
    for chats in chatlist:
        chatting_data = {
            'sender' : findNickName((chats[1])),
            'receiver': findNickName((chats[2])),
            'content'  : chats[3],
            'date' : chats[4]
        }
        chatting_data['date'] = formatDateToString(chats[4])
        
        msgList.append(chatting_data)
    #print(chatlist)
    return {
            'data': msgList
            }
        

@login_required
@chat_bp.route('', methods=['POST'])
def send():     # 쪽지 보내기
    data = request.get_json(silent=True)  # silent: parsing fail 에러 방지
        
    print(data)
    # postType = data.get('type')
    memId = current_user.get_id()
    print(memId)
    oppId = data.get('oppId')
    print(oppId)
    
    oppChk = chat.chkOppId(oppId)
    if oppChk == True:  #oppId가 유효한 경우 result = 1
        
        content = data['content']
        curDate = chat.curdate()
        oppId = data['oppId']
        oppNickId = nicknameToId(oppId)
        print(str(oppId), memId)
        chat.insertChat(memId, str(oppNickId), content, curDate)
        chatId = chat.getOneChat(memId, str(oppNickId))
        print(chatId)
        # chatAlarm 에 추가
        chat.insertChatAlarm(oppNickId, memId, chatId)
        
        return {
            'data': None
        }
    else:   # oppId 유효하지 않은 경우
        return {
            "status": 400,
            "data" : None,
            "message" : "상대방 아이디를 찾을 수 없습니다."
            }
        
        
@login_required
@chat_bp.route('', methods=['GET'])
def showAllChat():     #전체 채팅목록 가져오기 (current_user id와 관련있는 채팅 모두)
    postMemId = current_user.get_id()
    chat_data = []
    chattings = chat.getAllChat(postMemId)

    print(chattings)
    for chatting in chattings:
        chatting_data = {
            'oppId': findNickName((chatting[1])),
            'content': chatting[2],
            'date': chatting[3]
        }
        #print(chatting_data)
        chatting_data['date'] = formatDateToString(chatting[3])  #date 출력 형식 변경
        chat_data.append(chatting_data)
    print(chat_data)
    return {
            'data' : chat_data
        }
