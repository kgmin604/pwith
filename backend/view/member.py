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

@member_bp.route('/login', methods=['POST'])
def login() :

    data = request.get_json()

    memId = data['id']
    memPw = data['password']

    member = Member.findByMemberId(memId)

    if not member :
        return {
            'status' : 404,
            'message' : '없는 아이디',
            'data' : None
        }

    hashed_password = member.password
    isVerified = verifyPassword(memPw, hashed_password)

    if isVerified == False :
        return {
            'status' : 400,
            'message' : '잘못된 비밀번호',
            'data' : None
        }

    login_user(member)
    
    return {
        'id' : member.memId,
        'nickname' : member.nickname
    }

@login_required
@member_bp.route('/logout', methods=['GET'])
def logout() :

    result = logout_user()

    if result == True :
        return {
            'data' : None
        }
    else :
        return {
            'status' : 401,
            'message' : '로그아웃 불가'
        }

def hashPassword(pw):
    hashed_pw = bcrypt.hashpw(pw.encode('utf-8'), bcrypt.gensalt())
    return hashed_pw.decode('utf-8')

def verifyPassword(pw, hashed_pw) :
    return bcrypt.checkpw(pw.encode('utf-8'), hashed_pw.encode('utf-8'))