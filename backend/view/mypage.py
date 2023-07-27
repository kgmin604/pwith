from flask import Flask, Blueprint, request, session
from flask_login import login_user, current_user, login_required
import bcrypt

from backend.controller.member_mgmt import Member
from backend.controller.study_mgmt import studyPost
from backend.controller.study_mgmt import studyPost

mypage_bp = Blueprint('mypage', __name__, url_prefix='/mypage')

@login_required
@mypage_bp.route('/account', methods=['GET'])
def showAccount() :

    id = current_user.get_id()
    loginMember = Member.findById(id)

    memId = loginMember.memId
    memNick = loginMember.nickname
    memEmail = loginMember.email
    memImage = loginMember.image

    return {
        'id' : memId,
        'nickname' : memNick,
        'email' : memEmail,
        'image' : memImage
    }

@login_required
@mypage_bp.route('/account/password', methods = ['PATCH'])
def changePassword() :

    data = request.get_json()

    oldPw = data['oldPw']
    newPw = data['newPw']

    id = current_user.get_id()

    loginMember = Member.findById(id)

    hashed_pw = loginMember.password
    isVerified = verifyPassword(oldPw, hashed_pw)

    if isVerified == False :
        return {
            'status' : 400,
            'message' : '잘못된 비밀번호',
            'data' : None
        }

    hashed_new_pw = hashPassword(newPw)

    result = Member.updatePassword(id, hashed_new_pw)

    # TODO result로 예외 처리 (다른 함수도)

    return {
        'data' : None
    }

@login_required
@mypage_bp.route('/account/nickname', methods = ['PATCH'])
def changeNickname() :

    newNick = request.get_json()['newNick']

    id = current_user.get_id()

    result = Member.updateNickname(id, newNick)
    
    return {
        'data' : newNick
    }

@login_required
@mypage_bp.route('/account/image', methods = ['PATCH']) # TODO
def changeImage() :

    id = current_user.get_id()

    result = Member.updateImage(id, newNick)
    
    return {
        'data' : None
    }

@login_required
@mypage_bp.route('/writinglist', methods = ['GET', 'POST'])
def myPost() :
    if request.method == 'GET' :
        
        postType = request.args.get('type')

        writer = current_user.get_id()
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



def hashPassword(pw):
    hashed_pw = bcrypt.hashpw(pw.encode('utf-8'), bcrypt.gensalt())
    return hashed_pw.decode('utf-8')

def verifyPassword(pw, hashed_pw) : # return boolean
    return bcrypt.checkpw(pw.encode('utf-8'), hashed_pw.encode('utf-8'))