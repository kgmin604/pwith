from flask import Flask, Blueprint, request, jsonify, redirect, url_for, session
from flask_login import login_user, current_user, logout_user, login_required
from controller.member_mgmt import Member

bp = Blueprint('login', __name__, url_prefix='')

@bp.route('/', methods=['GET', 'POST']) # 테스트 전
def chkSession() :
    if request.method == 'POST' :
        return jsonify({
            'status': 'success'
        })
    else :
        memInfo = {
            'id': '',
            'name': ''
        }
        data = request.get_json(silent=True)

        if data['chkSession'] == 1:
            if current_user.is_anonymous :
                print('익명')
            else :
                memInfo['id'] = current_user.getId()
                memInfo['name'] = current_user.getName()
                print('전달 완료')

        return memInfo

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
        res = {
            'code': 0,
            'id':'',
            'name':'',
            'email':''
        }

        mem = Member.findByIdPw(memId, memPw)

        if not mem :
            res['code']=400
            # print('wrong id or wrong pw')
            return res

        login_user(mem)
        res['code'] = 401
        res['id'] = mem.getId()
        res['name'] = mem.getName()
        # print('login 성공')

        print(current_user.getName() + '님 환영해요.')
        return res

@login_required
@bp.route('/logout')
def logout() :
    logout_user() # True 반환
    print('로그아웃 성공')
    return jsonify(
        {'status':'success'}
    )