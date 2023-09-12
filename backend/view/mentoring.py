from flask import Blueprint, request
from flask_login import current_user
from datetime import datetime
import json

from backend.controller.member_mgmt import Member
from backend.controller.mentor_mgmt import Portfolio
from backend.controller.mentoringroom_mgmt import MentoringRoom
from backend.controller.chat_mgmt import chat
from backend.view import uploadFileS3, login_required, findSocialLoginMember

mento_bp = Blueprint('mentoring', __name__, url_prefix='/mentoring')

@mento_bp.route('', methods=['POST']) # 포폴 작성
@login_required
def writePortfolio(loginMember, new_token):

    image = request.files['mentoPic']
    mentoPic = uploadFileS3(image, "mentoring")

    data_str = request.form['data']
    data = json.loads(data_str)

    brief = data['brief']
    content = data['content']
    tuition = data['tuition']
    duration = data['duration']
    subjects = data['subject']

    date = datetime.now()

    done = Portfolio.save(loginMember.id, mentoPic, brief, content, date, tuition, duration, subjects)

    if done == 1 :
        return {
            'data' : None,
            'access_token' : new_token
        }
    else :
        return {
            'status' : 400,
            'message' : '포트폴리오 존재',
            'data' : None,
            'access_token' : new_token
        }

@mento_bp.route('', methods = ['GET']) # 포폴 목록
def listPortfolio() :

    # 1. my portfolio
    myPortfolioId = None

    loginMember = current_user # chk session
    if loginMember.is_anonymous : # chk tokens
        loginMember, new_token = findSocialLoginMember()
        
    if loginMember != None :
        myPortfolioId = Portfolio.findByMentoId(loginMember.id)

    # 2. portfolio list
    searchWord = request.args.get('search')

    if searchWord is None :
        portfolios = Portfolio.findAll()
    else :
        portfolios = Portfolio.searchByMento(searchWord)

    portfolioList = []

    for p in portfolios :

        subjects = list(map(int, p[8].split(',')))

        portfolioList.append({
            'id' : p[0],
            'mentoId' : p[1],
            'mentoNick' : p[2],
            'mentoPic' : p[3],
            'brief' : p[4],
            'tuition' : p[5],
            'duration' : p[6],
            'score' : p[7],
            'subject' : subjects
        })

    result = {
        'myPortfolio' : myPortfolioId,
        'portfolioList' : portfolioList
    }

    return result

@mento_bp.route('/<id>', methods = ['GET']) # 포폴 상세
@login_required
def showPortfolio(loginMember, new_token, id) :

    portfolio = Portfolio.findById(id)
    
    if not portfolio:
        return {
            'status' : 400,
            'message' : '없는 포트폴리오',
            'data' : None,
            'access_token' : new_token
        }

    result = {
        'mentoId' : portfolio[0],
        'mentoNick' : portfolio[1],
        'mentoPic' : portfolio[2],
        'brief' : portfolio[3],
        'content' : portfolio[4],
        'tuition' : portfolio[5],
        'duration' : portfolio[6],
        'isOpen' : portfolio[7],
        'score' : portfolio[8],
        'subject' : list(map(int, portfolio[9].split(',')))
    }

    isNotFirst = MentoringRoom.existsByMentoMenti(portfolio[10], loginMember.id)

    result.update({'isFirst' : not isNotFirst})

    return {
        'data' : result,
        'access_token' : new_token
    }

    # 후기 관련 파트
    # review_list = Review.showReview(mentoId)
    # review = []

    # for rev in review_list :
    #     review.append({
    #         'reviewId' : rev[0],
    #         'menti' : rev[1],
    #         'review' : rev[2]
    #     })

    # return jsonify({
    #     'portfolio' : detail,
    #     'review' : review
    # })

@mento_bp.route('/<id>', methods = ['PATCH']) # 포폴 수정
@login_required
def modifyPortfolio(loginMember, new_token, id) :

    if Portfolio.existsById(id) == False:
        return {
            'status' : 400,
            'message' : '없는 포트폴리오',
            'data' : None,
            'access_token' : new_token
        }

    image = request.files['mentoPic']
    mentoPic = uploadFileS3(image, "mentoring")

    data_str = request.form['data']
    data = json.loads(data_str)

    brief = data['brief']
    content = data['content']
    tuition = data['tuition']
    duration = data['duration']
    subjects = data['subject']
    
    Portfolio.update(id, mentoPic, brief, content, tuition, duration, subjects)

    return {
        'data' : None,
        'access_token' : new_token
    }

@mento_bp.route('/<id>', methods = ['DELETE']) # 포폴 삭제
@login_required
def deletePortfolio(loginMember, new_token, id) :

    if Portfolio.existsById(id) == False:
        return {
            'status' : 400,
            'message' : '없는 포트폴리오',
            'data' : None,
            'access_token' : new_token
        }

    Portfolio.delete(id)

    return {
        'data' : None,
        'access_token' : new_token
    }

@mento_bp.route('/<id>/state', methods = ['PATCH']) # ON/OFF
@login_required
def changeState(loginMember, new_token, id) :

    if Portfolio.existsById(id) == False:
        return {
            'status' : 400,
            'message' : '없는 포트폴리오',
            'data' : None,
            'access_token' : new_token
        }

    Portfolio.updateState(id, datetime.now())

    return {
        'data' : None,
        'access_token' : new_token
    }

@mento_bp.route('/<id>/apply', methods=['POST'])
@login_required
def applyMentoring(loginMember, new_token, id) :

    if Portfolio.existsById(id) == False:
        return {
            'status' : 400,
            'message' : '없는 포트폴리오',
            'data' : None,
            'access_token' : new_token
        }
    
    # 1. 룸 생성
    mentiId = loginMember.id
    mentoId = Portfolio.findMentoById(id)

    mentiNick = loginMember.nickname
    mentoNick = Member.findById(mentoId).nickname

    roomName = f"멘토 {mentoNick}와 멘티 {mentiNick}의 공부방"

    roomId = MentoringRoom.save(roomName, datetime.now(), mentoId, mentiId)

    # 2. 멘토링룸 링크 생성
    url = "http://localhost:3000/mentoringroom/" + str(roomId)

    # 3. 쪽지 전송
    menticontent = f"{url}\n다음 스터디룸으로 입장해주세요."
    mentocontent = f"[{mentiNick}]님이 멘토링을 신청하셨습니다.\n수락하시겠습니까?"
    
    done = chat.insertChat(mentiId, mentoId, mentocontent, datetime.now())
    done = chat.insertChat(mentoId, mentiId, menticontent, datetime.now())

    return {
        'data' : None,
        'access_token' : new_token
    }

''' 후기 관련 파트
@mento_bp.route('/<mentoId>/review', methods = ['POST', 'PUT', 'DELETE'])
def review(mentoId) :
    if request.method == 'POST' : # 후기 작성

        cnt = request.get_json()['content']

        writer = current_user.id

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
'''