from flask_login import current_user
from flask import Blueprint, request
import bcrypt
import requests

from backend.controller.member_mgmt import Member
from backend.controller.study_mgmt import studyPost
from backend.controller.community_mgmt import QNAPost
from backend.controller.replyStudy_mgmt import ReplyStudy
from backend.controller.replyQna_mgmt import ReplyQna
from backend.view import formatYMD, uploadFileS3, login_required
from backend import config

mypage_bp = Blueprint('mypage', __name__, url_prefix='/mypage')

@mypage_bp.route('/account', methods=['GET'])
@login_required
def showAccount(loginMember, new_token) : # 회원 정보

    memId = loginMember.memId
    memNick = loginMember.nickname
    memEmail = loginMember.email
    memImage = loginMember.image
    
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
def changePassword(loginMember, new_token) : # 비밀번호 수정

    provider = request.cookies.get('provider')
    if provider is not None:
        return {
            'status' : 404,
            'message' : '소셜 계정',
            'data' : None,
            'access_token' : new_token
        }

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
def changeNickname(loginMember, new_token) : # 닉네임 수정

    newNick = request.get_json()['newNick']

    Member.updateNickname(loginMember.id, newNick)
    
    return {
        'data' : newNick,
        'access_token' : new_token
    }

@mypage_bp.route('/account/image', methods = ['PATCH'])
@login_required
def changeImage(loginMember, new_token) : # 프로필 사진 수정

    image = request.files['newImage']
    newImage = uploadFileS3(image, "profile")
    
    Member.updateImage(loginMember.id, newImage)
    
    return {
        'data' : newImage,
        'access_token' : new_token
    }

@mypage_bp.route('/account', methods = ['DELETE'])
@login_required
def deleteAccount(loginMember, new_token) : # 회원 탈퇴 (일반 + 소셜) -> TODO 정윤 DB 수정 후 마무리

    provider = request.cookies.get('provider')
    access_token = request.cookies.get('access_token')

    if provider is None: # Session

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

        logout_user()
        
        Member.deleteById(loginMember.id)

        return {
            'data' : None,
            'access_token' : new_token
        }

    else: # OAuth

        if provider == 'NAVER':
            resp = requests.post(
                config.NAVER_TOKEN_ENDPOINT,
                params = {
                    'grant_type' : 'delete',
                    'service_provider' : 'NAVER',
                    'client_id' : config.NAVER_CLIENT_ID,
                    'client_secret' : config.NAVER_CLIENT_SECRET,
                    'access_token' : access_token
                },
                headers = {
                    'Content-type' : 'application/x-www-form-urlencoded'
                }
            )
        elif provider == 'KAKAO':
            resp = requests.post(
                config.KAKAO_DELETE_ENDPOINT,
                headers = {
                    'Authorization' : f'Bearer {access_token}'
                }
            )
        elif provider == 'GOOGLE':
            resp = requests.post(
                config.GOOGLE_DELETE_ENDPOINT,
                params = {
                    'token' : access_token
                },
                headers = {
                    'Content-type' : 'application/x-www-form-urlencoded'
                }
            )
        Member.deleteById(loginMember.id)

        return {
            'status' : 200,
            'message' : 'logout',
            'data' : None
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