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
        print(memId, memPw)
        res = {'code': 0, 'id':'', 'name':''}

        mem = Member.findById(memId)

        if not mem :
            print('no member')
            res['code']=400
            return res

        login_user(mem) # session 생성
        print('yes member')
        res['code']=401
        res['id'] = mem.getId()
        res['name'] = mem.getName()

        print(current_user.getName()) # current_user로 해당 계정 접근 가능 🚨
        return res

@login_required
@bp.route('/logout')
def logout() :
    logout_user() # session 삭제
    print("로그아웃이야~!~!~!!~~!")
    # return redirect(url_for('home'))
    return ''