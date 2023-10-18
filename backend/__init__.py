# __name__ = "backend"

from flask import Flask, jsonify, Response, request, redirect
from flask_login import login_required as original_login_required
from flask_login import LoginManager, current_user
from flask_mail import Mail
from flask_socketio import SocketIO
from functools import wraps
from botocore.client import Config
import boto3 
import json

from backend.view import member, study, studyroom, mypage, mentoring, mentoringroom, community, pwithmain, chat, oauth_server, oauth_member
from backend.controller.member_mgmt import Member
from backend import config

def create_app() :

    app = Flask(__name__)

    app.secret_key = config.SECRET_KEY

    app.config['MAIL_SERVER'] = config.MAIL_SERVER
    app.config['MAIL_PORT'] = config.MAIL_PORT
    app.config['MAIL_USERNAME'] = config.MAIL_USERNAME
    app.config['MAIL_PASSWORD'] = config.MAIL_PASSWORD
    app.config['MAIL_USE_TLS'] = config.MAIL_USE_TLS
    app.config['MAIL_USE_SSL'] = config.MAIL_USE_SSL

    app.register_blueprint(member.member_bp)
    app.register_blueprint(study.study_bp)
    app.register_blueprint(studyroom.studyroom_bp)
    app.register_blueprint(mypage.mypage_bp)
    app.register_blueprint(community.community_bp)
    app.register_blueprint(mentoring.mento_bp)
    app.register_blueprint(mentoringroom.mentoringroom_bp)
    app.register_blueprint(pwithmain.main_bp)
    app.register_blueprint(chat.chat_bp)
    app.register_blueprint(oauth_server.oauth_bp)
    app.register_blueprint(oauth_member.oauth_member_bp)

    @app.after_request
    def final_return(resp) :

        # if resp.json.get('message') == 'redirect' : # redirect
        #     url = resp.json.get('data')
        #     print('REDIRECT!')
        #     response = redirect(url)
        #     response.headers['Access-Control-Allow-Origin'] = '*'
        #     return response

        response = app.response_class(
            response = json.dumps({
                'status' : resp.json.get('status', 200),
                'message' : resp.json.get('message', '성공'),
                'data' : resp.json.get('data', resp.json)
            }),
            status = resp.json.get('status', 200),
            mimetype = 'application/json'
        )

        if resp.json.get('message') == 'logout' : # logout
            response.set_cookie('provider', value='', path='/', expires=0)
            response.set_cookie('access_token', value='', path='/', expires=0)
            response.set_cookie('refresh_token', value='', path='/', expires=0)
        
        if resp.json.get('access_token') is not None : # new access token
            access_token = resp.json.get('access_token')
            response.set_cookie('access_token', value=access_token, path='/')

        if resp.json.get('token') is not None : # social login

            token = resp.json.get('token')

            provider = token.get('provider')
            access_token = token.get('access_token')
            refresh_token = token.get('refresh_token')

            response.set_cookie('provider', value=provider, path='/', httponly=True, secure=True)
            response.set_cookie('access_token', value=access_token, path='/', httponly=True, secure=True)
            response.set_cookie('refresh_token', value=refresh_token, path='/', httponly=True, secure=True)

        return response

    return app
    
app = create_app()

mail = Mail(app)

login_manager = LoginManager()
login_manager.init_app(app)

@login_manager.user_loader
def loadUser(id) : # 로그인 되어있는지 판단하기 전 사용자 정보 조회
    return Member.findById(id)

@login_manager.unauthorized_handler
def unauthorized() : # login_required로 요청된 기능에서 로그인되어 있지 않은 경우
    # login_manager.login_view = "users.login" -> 프론트에서 처리
    return {
        'status' : 401,
        'message' : '로그인 필요',
        'data' : None
    }