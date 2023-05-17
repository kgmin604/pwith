from flask import Flask, Blueprint, request, jsonify, redirect, url_for, session
from flask_login import login_user, current_user, logout_user, login_required
from controller.member_mgmt import Member

mypage_bp = Blueprint('mypage', __name__, url_prefix='/mypage/account')

# 프론트 구현 전이라 일단 더미값으로 입력.
# postman 정상 동작은 확인.
@login_required
@mypage_bp.route('/changepw', methods = ['GET', 'POST'])
def changePw() :
    if request.method == 'GET' :
        print('비밀번호변경!!!!!!!!!!!!!!!!!!!')
        return jsonify(
            {'status': 'success'}
        )   

    # else :
        # print('post비번변경')
        # memId = current_user.getName()
        memId = 'a'
        oldPw = 'a' # 프론트에서 받아오기
        newPw = 'aaaaaa' # 프론트에서 받아오기

        Member.changePw(memId, oldPw, newPw)

        return jsonify(
            {'status': 'success'}
        )