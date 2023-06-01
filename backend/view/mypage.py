from flask import Flask, Blueprint, request, jsonify, redirect, url_for, session
from flask_login import login_user, current_user, logout_user, login_required
from controller.member_mgmt import Member
from controller.board_mgmt import studyPost

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
        #newEmail = request.get_json()

        # result = Member.changeEmail(current_user.getId(), newEmail)
        done = Member.changeEmail('test', 'test@test.com') # dummy
        
        return jsonify(done) # 성공 여부
        
    else :
        return jsonify(
            {'status' : 'success'}
        )


@login_required
@mypage_bp.route('/writinglist', methods = ['GET', 'POST'])
def myPost() :
    if request.method == 'GET' :
        # writer = current_user.getId()
        writer = 'test' # dummy
        
        myPosts = studyPost.findByWriter(writer)

        result = []
        # print(myPosts[0][2])
        # print('길이 : ')
        # print(len(myPosts))
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

    else :
        data = request.get_json()
        listType = data['type']

        if listType == 0 :
            # study
            pass
        else :
            # community
            pass