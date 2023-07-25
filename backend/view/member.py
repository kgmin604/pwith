from flask import Flask, Blueprint, request, jsonify, session, current_app
from flask_login import login_user, current_user, logout_user, login_required
from flask_mail import Message
import bcrypt
import random

from backend.controller.member_mgmt import Member
from backend import config

member_bp = Blueprint('member', __name__, url_prefix='/member')

@member_bp.route('/join/email', methods=['POST'])
def sendEmail() :

    data = request.get_json()

    email = data['email']

    if Member.existsByEmail(email) :
        return {
                'status' : 400,
                'message' : '중복된 이메일',
                'data' : None
        }

    recipients = []
    recipients.append(email)
    sender = config.MAIL_USERNAME

    message = Message('Pwith 이메일 인증 코드', sender = sender, recipients = recipients)

    auth_number = random.randint(100000, 999999)
    message.html = '다음 <b>인증번호</b>를 입력하세요. ' + str(auth_number)

    mail = current_app.extensions.get('mail')

    mail.send(message)

    return {
        'auth' : str(auth_number)
    }

    
def isDuplicated(memId) :
    if not Member.findByMemberId(memId) :
        return False
    else :
        return True

@member_bp.route('/join', methods=['POST'])
def join() :
    
    data = request.get_json()

    memId = data['id']
    memPw = data['password']
    memName = data['nickname']
    memEmail = data['email']

    if Member.existsById(memId) :
        return {
            'status' : 400,
            'message' : '중복된 아이디',
            'data' : None
        }

    if Member.existsByNickname(memName) :
        return {
            'status' : 400,
            'message' : '중복된 닉네임',
            'data' : None
        }

    if Member.existsByEmail(memEmail) :
        return {
            'status' : 400,
            'message' : '중복된 이메일',
            'data' : None
        }

    hashed_password = hashPassword(memPw)

    Member.save(memId, hashed_password, memName, memEmail)

    return {
        'data' : None
    }



def hashPassword(pw):

    hashed_pw = bcrypt.hashpw(pw.encode('utf-8'), bcrypt.gensalt())

    return hashed_pw.decode('utf-8')

@member_bp.route('/login', methods=['GET', 'POST'])
def login() :
    if request.method == 'GET' :
        return jsonify(
            {'status': 'success'}
        )
    else :
        data = request.get_json()

        memId = data['memberId']
        memPw = data['memberPw']
        res = {
            'code': 0,
            'id':'',
            'name':'',
            'email':''
        }

        mem = Member.findByMemberId(memId)

        if not mem :
            res['code']=400
            # res['message'] = '없는 아이디'
            # print('wrong id')
            return res

        hashed_password = mem._password
        isVerified = verifyPassword(memPw, hashed_password)

        if (isVerified is False) :
            res['code'] = 400
            # res['message'] = '잘못된 비밀번호'
            return res

        login_user(mem)
        
        res['code'] = 401
        res['id'] = mem._memId
        res['name'] = mem._nickname
        res['email'] = mem._email

        print('로그인 성공')
        return res

@login_required
@member_bp.route('/logout')
def logout() :
    logout_user() # True 반환
    print('로그아웃 성공')
    
    return jsonify(
        {'status':'success'}
    )

def verifyPassword(pw, hashed_pw) :
    return bcrypt.checkpw(pw.encode('utf-8'), hashed_pw.encode('utf-8'))