from flask import Flask, Blueprint, request, jsonify, redirect, url_for, session
from flask_login import login_user, current_user, logout_user, login_required
from backend.controller.member_mgmt import Member
import bcrypt

bp = Blueprint('login', __name__, url_prefix='')
"""
@bp.route('/', methods=['POST']) # 테스트 전
def chkSession() :
    if request.method == 'POST' :
        memInfo = {
            'id': None,
            'name': None,
            'email': None
        }
        chk = request.get_json()['chkSession']

        if chk == 1:
            if current_user.is_anonymous :
                print('익명')
            else :
                memInfo['id'] = current_user.get_id()
                memInfo['name'] = current_user.getName()
                memInfo['email'] = current_user.getEmail()
                print('전달 완료')

        return jsonify(memInfo)
"""

@bp.route('/login', methods=['GET', 'POST'])
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

        hashed_password = mem.getPassword()
        isVerified = verifyPassword(memPw, hashed_password)

        if (isVerified is False) :
            res['code'] = 400
            # res['message'] = '잘못된 비밀번호'
            return res

        login_user(mem)
        
        res['code'] = 401
        res['id'] = mem.getMemberId()
        res['name'] = mem.getNickname()
        res['email'] = mem.getEmail()

        print('로그인 성공')
        return res

@login_required
@bp.route('/logout')
def logout() :
    logout_user() # True 반환
    print('로그아웃 성공')
    
    return jsonify(
        {'status':'success'}
    )

def verifyPassword(pw, hashed_pw) :
    return bcrypt.checkpw(pw.encode('utf-8'), hashed_pw.encode('utf-8'))