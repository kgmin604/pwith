from flask import Flask, render_template, request, jsonify, make_response, redirect
from flask_login import LoginManager
from view import join, login, study, mypage, communityBoard
from controller.member_mgmt import Member

# from flask_cors import CORS

app = Flask(__name__)
app.secret_key = 'cf7822958fb4032d2c973d58a88fceb6a2a6c3f02ce3167338cb2004478ecfa7'
# CORS(app)

app.register_blueprint(join.bp)
app.register_blueprint(login.bp)
app.register_blueprint(study.bp)
app.register_blueprint(mypage.mypage_bp)
app.register_blueprint(communityBoard.community_bp)

login_manager = LoginManager()
login_manager.init_app(app)
 
# 로그인 되어있는지 판단하기 전에 사용자 정보 조회
@login_manager.user_loader
def loadUser(memId) : # logout 시 호출됨. why? 🚨
    print(memId)
    print(Member.findById(memId))
    return Member.findById(memId)

# login_required로 요청된 기능에서 로그인되어 있지 않은 경우
@login_manager.unauthorized_handler
def unauthorized() :
    return redirect('/')

@app.route('/')
def home() :
    return redirect('/')

# if __name__ == "__main__":
#     app.run(host="127.0.0.1", port="5000")