import json
from flask import Flask, session, Blueprint, request, jsonify
from flask_login import login_required, current_user
from controller.mentor_mgmt import Portfolio

mento_bp = Blueprint('mento', __name__, url_prefix='/mentoring')

@mento_bp.route('/main', methods = ['GET', 'POST']) # postman test 완.
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
                'writer' : allP[i][0], # @property instead getter
                'subject' : json.loads(allP[i][2]),
                'image' : allP[i][3],
                'content' : allP[i][4]
            })

        print('==변환 후==')
        print(result)

        return jsonify(result)

@mento_bp.route('/create', methods = ['GET', 'POST']) # postman test 완 with dummy
def writePortfolio() :
    if request.method == 'POST' :
        portfolioInfo = request.get_json(silent=True)

        # <from front>

        # writer = current_user.getId()
        # subject = portfolioInfo['subject'] # list를 string으로 받기
        # image = portfolioInfo['image']
        # content = portfolioInfo['content']

        writer = 'park'
        subject = '["subject"]'
        image = 'urlurl2'
        content = 'content2'

        try :
            result = Portfolio.create(writer, subject, image, content)
        except Exception as ex: # sql error
            print(ex)
            result = 0

        return jsonify(result) # 0 fail, 1 success

@mento_bp.route('/<mentoId>', methods = ['GET', 'POST']) # postman test 완.
def showDetail(mentoId) :
    if request.method == 'GET' :

        detail = {}

        portfolio = Portfolio.findById(mentoId)

        # to front
        detail = {
            'writer' : portfolio.writer, # @property instead getter
            'subject' : json.loads(portfolio.subject),
            'image' : portfolio.image,
            'content' : portfolio.content
        }
        
        return jsonify(detail)