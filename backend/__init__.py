# from flask import Flask
# from backend.view import login, study, studyroom, mypage, communityBoard, mentoring, pwithmain, chat
# from flask_login import LoginManager
# from flask_restx import Api, Resource, reqparse

# print("이름!!!!" + str(__name__))
# app = Flask(__name__)
# app.secret_key = 'cf7822958fb4032d2c973d58a88fceb6a2a6c3f02ce3167338cb2004478ecfa7'
# # CORS(app)

# api = Api(app, version='1.0', title='pwith-API', description='Swagger document', doc='/api-docs')

# test_api = api.namespace('test', description='join API')

# from backend.view import join
# app.register_blueprint(join.bp)
# app.register_blueprint(login.bp)
# app.register_blueprint(study.study_bp)
# app.register_blueprint(studyroom.studyroom_bp) ###
# app.register_blueprint(mypage.mypage_bp)
# app.register_blueprint(communityBoard.community_bp)
# app.register_blueprint(mentoring.mento_bp)
# app.register_blueprint(pwithmain.main_bp) ###
# app.register_blueprint(chat.chat_bp)

# login_manager = LoginManager()
# login_manager.init_app(app)


# # 로그인 되어있는지 판단하기 전에 사용자 정보 조회
# @login_manager.user_loader
# def loadUser(memId) :
#     print(memId)
#     # print(Member.findById(memId))
#     return Member.findById(memId)

# # login_required로 요청된 기능에서 로그인되어 있지 않은 경우
# @login_manager.unauthorized_handler
# def unauthorized() :
#     # login_manager.login_view = "users.login"
#     return redirect('/')