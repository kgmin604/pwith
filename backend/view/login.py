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

        mem = Member.findById(memId)
        if not mem :
            print('no member')
            return ''

        login_user(mem) # session 생성
        print('yes member')
        memName = mem.name
        return memName


@login_required
@bp.route('/logout')
def logout() :
    logout_user() # session 삭제
    # return redirect(url_for('home'))
    return ''