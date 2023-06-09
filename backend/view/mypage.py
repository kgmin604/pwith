from flask import Flask, Blueprint, request, jsonify, redirect, url_for, session
from flask_login import login_user, current_user, logout_user, login_required
from backend.controller.member_mgmt import Member
from backend.controller.board_mgmt import studyPost
from backend.controller.board_mgmt import studyPost

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

        return jsonify(
            {'result' : result}
        )


@login_required
@mypage_bp.route('/account/email', methods = ['GET', 'POST'])
def changeEmail() :
    if request.method == 'POST' : # '완료' 버튼 클릭 시
        newEmail = request.get_json()['newEmail']

        # done = Member.changeEmail('a', newEmail)
        done = Member.changeEmail(current_user.getId(), newEmail)
        # done = Member.changeEmail('a', 'a@test.com') # dummy
        
        return jsonify({
            'done': done
        })
        
    else :
        return jsonify(
            {'status' : 'success'}
        )


@login_required
@mypage_bp.route('/writinglist', methods = ['GET', 'POST'])
def myPost() :
    if request.method == 'GET' :
        
        postType = request.args.get('type')

        writer = current_user.getId()
        # writer = 'a' # dummy

        if postType == 'community' :
            myPosts = studyPost.findByWriter(writer, 1)
        else : # 모든 예외에서도 study로 설정
            myPosts = studyPost.findByWriter(writer, 0)

        result = []

        for i in range(len(myPosts)) :
            myPost = {
                'id' : myPosts[i][0],
                'type' : myPosts[i][1],
                'title' : myPosts[i][2],
                'writer' : myPosts[i][3],
                'content' : myPosts[i][4],
                'curDate' : myPosts[i][5],
                'category' : myPosts[i][6],
                'likes' : myPosts[i][7],
                'views' : myPosts[i][8]
            }
            result.append(myPost)
        return jsonify(result)