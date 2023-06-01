from flask import Flask, Blueprint, request, jsonify, redirect, url_for, session
from flask_login import login_user, current_user, logout_user, login_required
from controller.member_mgmt import Member

mypage_bp = Blueprint('mypage', __name__, url_prefix='/mypage')

@login_required
@mypage_bp.route('/account/changepw', methods = ['GET', 'POST'])
def changePw() :
    if request.method == 'GET' :
        print('비밀번호변경!!!!!!!!!!!!!!!!!!!')
        return jsonify(
            {'status': 'success'}
        )   
    else :
        data = request.get_json()
        
        memId = current_user.getId()
        oldPw = data['oldPw']
        newPw = data['newPw']

        result = Member.changePw(memId, oldPw, newPw)

        return result


@login_required
@mypage_bp.route('/account/email', methods = ['GET', 'POST'])
def changeEmail() :
    if request.method == 'POST' : # '완료' 버튼 클릭 시
        #newEmail = request.get_json()

        # 현재 이메일 입력 안하는 방식
        # result = Member.changeEmail(current_user.getId(), newEmail)
        Member.changeEmail('test', 'today@test.com')

        # return result
        return ''
        
    else :
        return jsonify(
            {'status' : 'success'}
        )


@login_required
@mypage_bp.route('/writinglist', methods = ['GET', 'POST'])
def myPost() : # DB에 writer 저장 전.

    writer = current_user.getId()
    
    myPost = studyPost.findByWriter(writer)

    return myPost