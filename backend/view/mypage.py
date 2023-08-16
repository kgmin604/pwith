from flask_login import current_user, login_required
from flask import Blueprint, request
import bcrypt

from backend.controller.member_mgmt import Member
from backend.controller.study_mgmt import studyPost
from backend.controller.community_mgmt import QNAPost
from backend.controller.replyStudy_mgmt import ReplyStudy
from backend.controller.replyQna_mgmt import ReplyQna
from backend.view import formatYMD, uploadFileS3

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
@mypage_bp.route('/account/image', methods = ['PATCH'])
def changeImage() :

    image = request.files['newImage']
    newImage = uploadFileS3(image, "profile")
    
    id = current_user.get_id()

    result = Member.updateImage(id, newImage)
    
    return {
        'data' : newImage
    }

@login_required
@mypage_bp.route('/account', methods = ['DELETE'])
def deleteAccount() :

    password = request.get_json()['password']

    id = current_user.get_id()

    loginMember = Member.findById(id)

    hashed_pw = loginMember.password
    isVerified = verifyPassword(password, hashed_pw)

    if isVerified == False :
        return {
            'status' : 400,
            'message' : '잘못된 비밀번호',
            'data' : None
        }
    
    result = Member.deleteById(id)

    return {
        'data' : None
    }

@login_required
@mypage_bp.route('/writing-list/<category>', methods = ['GET'])
def listMyPosts(category) :

    login_id = current_user.get_id()

    if category == 'study' :
        posts = studyPost.findByWriterId(login_id)
    else :
        posts = QNAPost.findByWriterId(login_id)

    result = []

    for post in posts :
        myPost = {
            'id' : post.id,
            'title' : post.title,
            'date' : formatYMD(post.curDate),
            'content' : post.content,
            'like_cnt' : post.likes
        }
        result.append(myPost)
    
    return {
        'data' : result
    }

@login_required
@mypage_bp.route('/comment-list/<category>', methods = ['GET'])
def listMyComments(category) :

    login_id = current_user.get_id()

    if category == 'study' :
        replies = ReplyStudy.findByWriterId(login_id)
    else :
        replies = ReplyQna.findByWriterId(login_id)

    result = []

    for reply in replies :
        myReply = {
            'id' : reply.id,
            'date' : formatYMD(reply.curDate),
            'content' : reply.content,
            'postId' : reply.postId
        }
        result.append(myReply)
    
    return {
        'data' : result
    }


def hashPassword(pw):
    hashed_pw = bcrypt.hashpw(pw.encode('utf-8'), bcrypt.gensalt())
    return hashed_pw.decode('utf-8')

def verifyPassword(pw, hashed_pw) : # return boolean
    return bcrypt.checkpw(pw.encode('utf-8'), hashed_pw.encode('utf-8'))