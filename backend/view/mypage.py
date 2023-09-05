from flask_login import current_user
from flask import Blueprint, request
import bcrypt

from backend.controller.member_mgmt import Member
from backend.controller.study_mgmt import studyPost
from backend.controller.community_mgmt import QNAPost
from backend.controller.replyStudy_mgmt import ReplyStudy
from backend.controller.replyQna_mgmt import ReplyQna
from backend.view import formatYMD, uploadFileS3, login_required

mypage_bp = Blueprint('mypage', __name__, url_prefix='/mypage')

@mypage_bp.route('/account', methods=['GET'])
@login_required
def showAccount(loginMember, new_token) :

    memId = loginMember.memId
    memNick = loginMember.nickname
    memEmail = loginMember.email
    memImage = loginMember.image
    
    if memId is None :
        memId = memEmail.split('@')[0]

    return {
        'data' : {
            'id' : memId,
            'nickname' : memNick,
            'email' : memEmail,
            'image' : memImage
        },
        'access_token' : new_token
    }

@mypage_bp.route('/account/password', methods = ['PATCH'])
@login_required
def changePassword(loginMember, new_token) : # TODO 소셜 비활성화

    data = request.get_json()

    oldPw = data['oldPw']
    newPw = data['newPw']

    hashed_pw = loginMember.password
    isVerified = verifyPassword(oldPw, hashed_pw)

    if isVerified == False :
        return {
            'status' : 400,
            'message' : '잘못된 비밀번호',
            'data' : None,
            'access_token' : new_token
        }

    hashed_new_pw = hashPassword(newPw)

    Member.updatePassword(loginMember.id, hashed_new_pw)

    return {
        'data' : None,
        'access_token' : new_token
    }

@mypage_bp.route('/account/nickname', methods = ['PATCH'])
@login_required
def changeNickname(loginMember, new_token) :

    newNick = request.get_json()['newNick']

    Member.updateNickname(loginMember.id, newNick)
    
    return {
        'data' : newNick,
        'access_token' : new_token
    }

@mypage_bp.route('/account/image', methods = ['PATCH'])
@login_required
def changeImage(loginMember, new_token) :

    image = request.files['newImage']
    newImage = uploadFileS3(image, "profile")
    
    Member.updateImage(loginMember.id, newImage)
    
    return {
        'data' : newImage,
        'access_token' : new_token
    }

@mypage_bp.route('/account', methods = ['DELETE']) # TODO 소셜 탈퇴
@login_required
def deleteAccount(loginMember, new_token) :

    password = request.get_json()['password']

    hashed_pw = loginMember.password
    isVerified = verifyPassword(password, hashed_pw)

    if isVerified == False :
        return {
            'status' : 400,
            'message' : '잘못된 비밀번호',
            'data' : None,
            'access_token' : new_token
        }
    
    Member.deleteById(loginMember.id)

    return {
        'data' : None,
        'access_token' : new_token
    }

@mypage_bp.route('/writing-list/<category>', methods = ['GET'])
@login_required
def listMyPosts(loginMember, new_token, category) :

    if category == 'study' :
        posts = studyPost.findByWriterId(loginMember.id)
    else :
        posts = QNAPost.findByWriterId(loginMember.id)

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
        'data' : result,
        'access_token' : new_token
    }

@mypage_bp.route('/comment-list/<category>', methods = ['GET'])
@login_required
def listMyComments(loginMember, new_token, category) :

    if category == 'study' :
        replies = ReplyStudy.findByWriterId(loginMember.id)
    else :
        replies = ReplyQna.findByWriterId(loginMember.id)

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
        'data' : result,
        'access_token' : new_token
    }


def hashPassword(pw):
    hashed_pw = bcrypt.hashpw(pw.encode('utf-8'), bcrypt.gensalt())
    return hashed_pw.decode('utf-8')

def verifyPassword(pw, hashed_pw) : # return boolean
    return bcrypt.checkpw(pw.encode('utf-8'), hashed_pw.encode('utf-8'))