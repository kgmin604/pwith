from flask import Flask, render_template, request, jsonify, make_response
from view import join, login
from flask_login import LoginManager
# from flask_cors import CORS

app = Flask(__name__)
app.secret_key = 'cf7822958fb4032d2c973d58a88fceb6a2a6c3f02ce3167338cb2004478ecfa7'
# CORS(app)

app.register_blueprint(join.bp)
app.register_blueprint(login.bp)

login_manager = LoginManager()
login_manager.init_app(app)

@login_manager.user_loader
def loadUser(memId) : # 사용자 정보 조회
    return Member.findById(memId)

# login_required로 요청된 기능에서 로그인되어 있지 않은 경우
@login_manager.unauthorized_handler
def unauthorized() :
    return redirect('/')

@app.route('/')
def home() :
    return redirect('/')

### 🚨 flask-react 테스트용 코드 🚨 ###
# @app.route("/join", methods=['GET', 'POST'])
# def join() :
#     if request.method == 'GET' :
#         response_body = {
#             "id": "hele",
#             "pw": "pw",
#             "pwchk": "pwchk",
#             "name": "scy",
#             "email":"email"
#         }
#         return response_body
#     else :
#         data = request.get_json(silent=True) # silent: parsing fail 에러 방지
#         account = {
#             'id': data['memberId'],
#             'pw': data['memberPw'],
#             'chk': data['pwChk'],
#             'name': data['memberName'],
#             'email': data['memberEmail']
#             }
#         print(account)
#         return jsonify(
#             {'status': 'success'}
#         )
#### 🚨 여기까지 🚨 ###

# if __name__ == "__main__":
#     app.run(host="127.0.0.1", port="5000")