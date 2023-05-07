from flask import Flask, Blueprint, request, jsonify, redirect, url_for, session
from flask_login import login_user, current_user, logout_user, login_required
from controller.member_mgmt import Member

bp = Blueprint('login', __name__, url_prefix='')

@bp.route('/login', methods=['GET', 'POST'])
def login() :
    if request.method == 'GET' :
        return jsonify(
            {'status': 'success'}
        )
    else :
        data = request.get_json(silent=True)

        memId = data['memberId']
        memPw = data['memberPw']
        res = {'code': 0, 'id':'', 'name':''}

        mem = Member.findById(memId)

        if not mem :
            res['code']=400
            # print('no member')
            return res

        login_user(mem)
        res['code']=401
        res['id'] = mem.getId()
        res['name'] = mem.getName()
        # print('yes member')

        print(current_user.getName() + '님 환영해요.') # current_user로 해당 계정 접근 가능 🚨
        return res

@login_required
@bp.route('/logout')
def logout() :
    logout_user() # True 반환
    print('로그아웃 성공')
    return jsonify(
        {'status':'success'}
    )