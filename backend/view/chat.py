from flask import Flask, Blueprint, request, jsonify, redirect, url_for, session, render_template
from backend.controller.chat_mgmt import chat
from backend.controller.alarm_mgmt import alarm
from backend.view import IdtoMemId, nicknameToId, findNickName, getFormattedDate, mainFormattedDate, formatDateToString
from backend.view import login_required

chat_bp = Blueprint('chat', __name__, url_prefix='/mypage/chat')

@chat_bp.route('/list', methods=['POST'])
@login_required
def showList(loginMember, new_token):     # 1:1 채팅 목록 가져오기

    data = request.get_json(silent=True)  # silent: parsing fail 에러 방지
    memId = loginMember.id
    nickname = nicknameToId(data.get('nickname'))
    
    
    #print('postType = ' + str(postType)) # 형변환 추가-kgm
    #print('oppId = ' + oppId)
    
# 상대방과의 채팅목록 가져오기
    #print("post msglist")
    print(memId)
    chatlist = chat.getMyChat(memId, nickname)
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
    print(chatting_data)
    return {
            'data': msgList,
            'access_token' : new_token
            }
        

@chat_bp.route('', methods=['POST'])
@login_required
def send(loginMember, new_token):     # 쪽지 보내기
    data = request.get_json(silent=True)  # silent: parsing fail 에러 방지
        
    print(data)
    # postType = data.get('type')
    memId = loginMember.id
    print(memId)
    nickname = data.get('nickname')
    print(nickname)
    
    oppChk = chat.chkOppId(nickname)
    if oppChk == True:  #oppId가 유효한 경우 result = 1
        
        content = data['content']
        curDate = datetime.now()
        nickname = data['nickname']
        oppNickId = nicknameToId(nickname)
        print(str(nickname), memId)
        chat.insertChat(memId, str(oppNickId), content, curDate)
        chatId = chat.getOneChat(memId, str(oppNickId))
        print(chatId)
        # chatAlarm 에 추가
        alarm.insertAlarm(oppNickId, memId, chatId, 5)
        
        return {
            'data': None,
            'access_token' : new_token
        }
    else:   # oppId 유효하지 않은 경우
        return {
            "status": 400,
            "data" : None,
            "message" : "상대방 아이디를 찾을 수 없습니다.",
            'access_token' : new_token
            }
        
        
@chat_bp.route('', methods=['GET'])
@login_required
def showAllChat(loginMember, new_token):     #전체 채팅목록 가져오기 (current_user id와 관련있는 채팅 모두)
    postMemId = loginMember.id
    chat_data = []
    chattings = chat.getAllChat(postMemId)

    for chatting in chattings:
        chatting_data = {
            'nickname': findNickName((chatting[0])),
            'content': chatting[1],
            'date': chatting[2]
        }
        #print(chatting_data)
        chatting_data['date'] = formatDateToString(chatting[2])  #date 출력 형식 변경
        chat_data.append(chatting_data)
    # print(chat_data)
    return {
            'data' : chat_data,
            'access_token' : new_token
        }
