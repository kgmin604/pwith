import json
import base64
import pymysql
from flask import Flask, session, Blueprint, request, jsonify
from flask_login import login_required, current_user
from backend.controller.mentor_mgmt import Portfolio
from backend.controller.review_mgmt import Review
from backend.controller.mentoringroom_mgmt import MentoringRoom
from backend.controller.chat_mgmt import chat
from backend.model.db_mysql import conn_mysql
from datetime import datetime

# from PIL import Image 

mento_bp = Blueprint('mento', __name__, url_prefix='/mentoring')

@mento_bp.route('/main', methods = ['GET', 'POST'])
def showAll() :
    if request.method == 'GET' :

        searchValue = request.args.get('value')

        if searchValue is None : # 전체 글 출력

            allP = Portfolio.loadAll()
            allP = list(allP) # tuple to list for change

            result = []

            for i in range(len(allP)) :
                allP[i] = list(allP[i])

                result.append({
                    'writer' : allP[i][0],
                    'subject' : json.loads(allP[i][2]),
                    'image' : base64.b64encode(allP[i][3]).decode('utf-8'),
                    'brief' : allP[i][4],
                    'content' : allP[i][5]
                })

            return jsonify(result)

        else : # 검색

            mentos = Portfolio.search(searchValue)

            result = []

            if mentos is None :
                pass # 결과 없을 시 empty list
            else :
                for i in range(len(mentos)) :
                    mento = {
                        'writer' : mentos[i][0],
                        'subject' : json.loads(mentos[i][2]),
                        'image' : base64.b64encode(mentos[i][3]).decode('utf-8'),
                        'brief' : mentos[i][4],
                        'content' : mentos[i][5]
                    }
                    
                    result.append(mento)

            return jsonify(result)


@mento_bp.route('/<mentoId>', methods = ['GET'])
def showDetail(mentoId) :
    if request.method == 'GET' :

        apply = request.args.get('apply')

        if apply == 'go' : # 멘토링 신청

            # 1. 룸 생성
            mentiId = current_user.getId()
            roomName = str(mentoId) + "와 " + str(mentiId) + "의 공부방"

            roomId = MentoringRoom.create(roomName, mentoId, mentiId)

            # 2. 멘토링룸 쪽지로 전송

            url = "http://localhost:3000/mentoringroom/" + str(roomId)

            # 3. 쪽지 전송
            menticontent = url + '\n' + "다음 스터디룸으로 입장해주세요."
            mentocontent = '"' + mentiId + '"님이 멘토링을 신청하셨습니다.' + '\n' + ' 수락하시겠습니까?'
            
            done = chat.insertChat(mentiId, mentoId, mentocontent, datetime.now())
            done = chat.insertChat(mentoId, mentiId, menticontent, datetime.now())

            return jsonify({
                'status' : 'success' # 필없
            })


        detail = {}

        portfolio = Portfolio.findById(mentoId)
        review_list = Review.showReview(mentoId)
        review = []

        for rev in review_list :
            review.append({
                'reviewId' : rev[0],
                'menti' : rev[1],
                'review' : rev[2]
            })
        # print(type(base64.b64encode(@bytes@).decode('utf-8')))
        detail = {
            'mento' : portfolio.writer, # @property instead getter
            'subject' : json.loads(portfolio.subject),
            'image' : base64.b64encode(portfolio.image).decode('utf-8'),
            'brief' : portfolio.brief,
            'content' : portfolio.content
        }

        return jsonify({
            'portfolio' : detail,
            'review' : review
        })

@mento_bp.route('/<mentoId>', methods = ['POST', 'PUT', 'DELETE'])
def review(mentoId) :
    if request.method == 'POST' : # 후기 작성

        cnt = request.get_json()['content']

        writer = current_user.getId()

        try :
            pk = Review.writeReview(writer, cnt, mentoId)
        except Exception as ex:
            print("에러 이유 : " + str(ex))
            pk = 0

        return jsonify({
            'reviewId' : pk # 0 is fail
        })

    elif request.method == 'PUT' : # 후기 수정

        reviewId = request.get_json()['reviewId']
        newContent = request.get_json()['content']

        try :
            done = Review.modifyReview(reviewId, newContent)
        except Exception as ex :
            print("에러 이유 : " + str(ex))
            done = 0

        return jsonify({
            'done' : done
        })

    else : # 후기 삭제

        reviewId = request.get_json()['reviewId']

        try :
            done = Review.removeReview(reviewId)
        except Exception as ex :
            print("에러 이유 : " + str(ex))
            done = 0

        return jsonify({
            'done' : done
        })

@mento_bp.route('/create', methods=['GET', 'POST'])
def writePortfolio():
    if request.method == 'POST':

        portfolioInfo = request.form

        writer = current_user.getId()
        subject = portfolioInfo['subject']
        brief = portfolioInfo['brief']
        content = portfolioInfo['content']

        file = request.files['image']
        image = file.read()

        try:
            result = Portfolio.create(writer, subject, image, brief, content)
        except Exception as e:
            print(f"예외 발생: {e}")
            # connection.rollback()
            result = 0
        return jsonify({
            'done': result
        })

'''
        # print(image)
        img_bytes = image.read() # bytes
        print(img_bytes)
        # img_str = str(img_bytes)
        # img_str = img_str.replace("\'", "\"")
        # img_bytes = bytes(img_str, 'utf-8')
        # print(type(img_bytes))
        # print(type(img_bytes))################### <class 'bytes'> ###############
        # img_encode = base64.b64encode(img_bytes).decode('utf-8')
        # img_encode = base64.b64decode(img_str).encode('utf-8')
        # img_encode = base64.b64decode(img_bytes)
        # img_encode = base64.b64encode(portfolio.image).decode('utf-8') # 원본
        # print(img_encode)

        try:
            result = Portfolio.create(writer, subject, img_bytes, brief, content)
            # result = Portfolio.create(writer, subject, img, brief, content)
        except Exception as ex:
            print("예외 발생: " + str(ex))
            result = 0
        return jsonify({
            'done': result
            # 'done': 0
        })
'''

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

        newPort = request.form

        file = request.files['image']
        image = file.read()
        
        done = Portfolio.update(mentoId, newPort['subject'], image, newPort['brief'], newPort['content'])

        return jsonify({
            'done' : done # 성공 시 1, 실패 또는 변경 사항 없을 시 0
        })

@mento_bp.route('/delete/<mentoId>', methods = ['DELETE'])
def deletePortfolio(mentoId) :
    if request.method == 'DELETE' :
        
        loginUser = current_user.getId()
        # loginUser = 'q' # dummmmmmmmmy
        
        if loginUser != mentoId : # 본인의 글에 접근한 게 아닐 때
            return jsonify({
                'status' : 'fail'
            })

        done = 0
        done = Portfolio.delete(mentoId)

        return jsonify({
            'done' : done
        })