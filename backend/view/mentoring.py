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

mento_bp = Blueprint('mentoring', __name__, url_prefix='/mentoring')

@mento_bp.route('', methods=['POST'])
def writePortfolio():
    
    data = request.get_json()

    subjects = data['subject']
    brief = data['brief']
    content = data['content']
    mentoPic = data['image']

    mento = current_user.get_id()

    date = datetime.now()

    done = Portfolio.save(mento, mentoPic, brief, content, date, subjects)

    if done == 1 :
        return {
            'data' : None
        }
    else :
        return {
            'status' : 400,
            'message' : '포트폴리오 존재',
            'data' : None
        }


@mento_bp.route('', methods = ['GET'])
def listPortfolios() :

    searchWord = request.args.get('search')

    if searchWord is None : # 전체 글 출력

        allP = Portfolio.findAll()

        result = []

        for p in allP :

            subjects = list(map(int, p[3].split(',')))

            result.append({
                'mento' : p[0],
                'mentoPic' : p[1],
                'brief' : p[2],
                'subject' : subjects,
                'score' : p[4]
            })

        return {
            'data' : result
        }

    else : # 검색

        searchResults = Portfolio.searchByMento(searchWord)

        result = []

        if searchResults is not None :

            for sr in searchResults :

                subjects = list(map(int, sr[3].split(',')))

                result.append({
                    'mento' : sr[0],
                    'mentoPic' : sr[1],
                    'brief' : sr[2],
                    'subject' : subjects,
                    'score' : sr[4]
                })

        return {
            'data' : result
        }


@mento_bp.route('/<mentoId>', methods = ['GET'])
def showDetail(mentoId) :
    if request.method == 'GET' :

        apply = request.args.get('apply')

        if apply == 'go' : # 멘토링 신청

            # 1. 룸 생성
            mentiId = current_user.get_id()
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

        portfolio = Portfolio.findByMento(mentoId)
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

@mento_bp.route('/<mentoId>/review', methods = ['POST', 'PUT', 'DELETE'])
def review(mentoId) :
    if request.method == 'POST' : # 후기 작성

        cnt = request.get_json()['content']

        writer = current_user.get_id()

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

        

@mento_bp.route('/update/<mentoId>', methods = ['GET', 'PUT'])
def modifyPortfolio(mentoId) :

    loginUser = current_user.get_id()
    
    if loginUser != mentoId : # 본인의 글에 접근한 게 아닐 때
        return jsonify({
            'status' : 'fail'
        })

    if request.method == 'GET' : # 작성 정보 띄우기

        detail = {}

        portfolio = Portfolio.findByMento(mentoId)

        detail = {
            'subject' : json.loads(portfolio.subject),
            'image' : portfolio.image,
            'brief' : portfolio.brief,
            'content' : portfolio.content
        }
        
        return jsonify(detail)

    else : # 'PUT'

        newPort = request.form

        file = request.files['image']
        image = file.read()
        
        # TODO string에서 list 형식으로 받아야 함. 현재는 str
        done = Portfolio.update(mentoId, image, newPort['brief'], newPort['content'], newPort['subject'])

        return jsonify({
            'done' : done # 성공 시 1, 실패 또는 변경 사항 없을 시 0
        })

@mento_bp.route('/delete/<mentoId>', methods = ['DELETE'])
def deletePortfolio(mentoId) :
    if request.method == 'DELETE' :
        
        loginUser = current_user.get_id()
        
        if loginUser != mentoId : # 본인의 글에 접근한 게 아닐 때
            return jsonify({
                'status' : 'fail'
            })

        done = 0
        done = Portfolio.delete(mentoId)

        return jsonify({
            'done' : done
        })