# __init__.py : 초기화 코드 실행 또는 __all__ 변수 설정

# __name__ = "backend"

from flask import Flask, redirect
from flask_login import LoginManager
from backend.view import join, login, study, studyroom, mypage, communityBoard, mentoring, pwithmain, chat
# from flask_cors import CORS

# CORS(app)

def create_app() :

    app = Flask(__name__)

    app.secret_key = 'cf7822958fb4032d2c973d58a88fceb6a2a6c3f02ce3167338cb2004478ecfa7'

    app.register_blueprint(join.bp)
    app.register_blueprint(login.bp)
    app.register_blueprint(study.study_bp)
    app.register_blueprint(studyroom.studyroom_bp)
    app.register_blueprint(mypage.mypage_bp)
    app.register_blueprint(communityBoard.community_bp)
    app.register_blueprint(mentoring.mento_bp)
    app.register_blueprint(pwithmain.main_bp)
    app.register_blueprint(chat.chat_bp)

    return app
    
app = create_app()

login_manager = LoginManager()
login_manager.init_app(app)

@login_manager.user_loader
def loadUser(memId) : # 로그인 되어있는지 판단하기 전 사용자 정보 조회
    print(memId)
    return Member.findById(memId)

@login_manager.unauthorized_handler
def unauthorized() : # login_required로 요청된 기능에서 로그인되어 있지 않은 경우
    # login_manager.login_view = "users.login"
    return redirect('/')