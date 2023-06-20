from flask import Flask, Blueprint, request, jsonify, redirect, url_for, session
from flask_login import login_user, current_user, logout_user, login_required
from controller.member_mgmt import Member

bp = Blueprint('login', __name__, url_prefix='')

# @bp.route('/', methods=['POST']) # 테스트 전
# def chkSession() :
#     if request.method == 'POST' :
#         memInfo = {
#             'id': None,
#             'name': None,
#             'email': None
#         }
#         chk = request.get_json()['chkSession']

#         if chk == 1:
#             if current_user.is_anonymous :
#                 print('익명')
#             else :
#                 memInfo['id'] = current_user.getId()
#                 memInfo['name'] = current_user.getName()
#                 memInfo['email'] = current_user.getEmail()
#                 print('전달 완료')

#         return jsonify(memInfo)

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
        res['email'] = mem.getEmail()
        # print('login 성공')

        print('이름 ' + current_user.getName() + '님 로그인 성공')
        return res

@login_required
@bp.route('/logout')
def logout() :
    logout_user() # True 반환
    print('로그아웃 성공')
    
    return jsonify(
        {'status':'success'}
    )