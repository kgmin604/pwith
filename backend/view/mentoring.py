import json
from flask import Flask, session, Blueprint, request, jsonify
from flask_login import login_required, current_user
from controller.mentor_mgmt import Portfolio

mento_bp = Blueprint('mento', __name__, url_prefix='/mentoring')

@mento_bp.route('/main', methods = ['GET', 'POST'])
def showAll() :
    if request.method == 'GET' :
        allP = Portfolio.loadAll()
        allP = list(allP) # tuple to list for change

        result = []

        for i in range(len(allP)) :
            allP[i] = list(allP[i])

            # allP[i][1] = json.loads(allP[i][1]) # mentiList
            # allP[i][2] = json.loads(allP[i][2]) # subject string to json

            result.append({
                'writer' : allP[i][0],
                'subject' : json.loads(allP[i][2]),
                'image' : allP[i][3],
                'brief' : allP[i][4],
                'content' : allP[i][5]
            })

        # print('==변환 후==')
        # print(result)

        return jsonify(result)

@mento_bp.route('/<mentoId>', methods = ['GET', 'POST'])
def showDetail(mentoId) :
    if request.method == 'GET' :

        detail = {}

        portfolio = Portfolio.findById(mentoId)

        detail = {
            'writer' : portfolio.writer, # @property instead getter
            'subject' : json.loads(portfolio.subject),
            'image' : portfolio.image,
            'brief' : portfolio.brief,
            'content' : portfolio.content
        }
        
        return jsonify(detail)

    else : # 1:1 쪽지 버튼 & 후기
        pass

@mento_bp.route('/create', methods = ['GET', 'POST'])
def writePortfolio() :
    if request.method == 'POST' :
        portfolioInfo = request.get_json(silent=True)

        writer = current_user.getId()
        subject = portfolioInfo['subject']
        image = portfolioInfo['image']
        brief = portfolioInfo['brief']
        content = portfolioInfo['content']

        try :
            result = Portfolio.create(writer, subject, image, brief, content)
        except Exception as ex:
            print("예외 발생 : " + str(ex))
            result = 0

        return jsonify({
            'done' : result
            })

@mento_bp.route('/update/<mentoId>', methods = ['GET', 'PUT'])
def modifyPortfolio(mentoId) :

    loginUser = current_user.getId()
    # loginUser = 'q' # dummmmmmmmmy
    
    if loginUser != mentoId : # 본인의 글에 접근한 게 아닐 때
        return jsonify({
            'status' : 'fail'
        })

    if request.method == 'GET' : # 작성 정보 띄우기

        detail = {}

        portfolio = Portfolio.findById(mentoId)

        detail = {
            'subject' : json.loads(portfolio.subject),
            'image' : portfolio.image,
            'brief' : portfolio.brief,
            'content' : portfolio.content
        }
        
        return jsonify(detail)

    else : # request.method == 'PUT'

        newPort = request.get_json()
        
        done = Portfolio.update(mentoId, newPort['subject'], newPort['image'], newPort['brief'], newPort['content'])

        return jsonify({
            'done' : done # 성공 시 1, 실패 또는 변경 사항 없을 시 0
        })