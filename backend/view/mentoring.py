from flask import Blueprint, request
from flask_login import current_user
from datetime import datetime
import json

from backend.controller.member_mgmt import Member
from backend.controller.mentor_mgmt import Portfolio
from backend.controller.review_mgmt import Review
from backend.controller.mentoringroom_mgmt import MentoringRoom
from backend.controller.chat_mgmt import chat
from backend.view import uploadFileS3, login_required, findSocialLoginMember, payKakao, payKakaoSuccess, findNickName, formatYMDHM

mento_bp = Blueprint('mentoring', __name__, url_prefix='/mentoring')

@mento_bp.route('', methods=['POST']) # 포폴 작성
@login_required
def writePortfolio(loginMember, new_token):

    if Portfolio.existsByMentoId(loginMember.id):
        return {
            'status' : 400,
            'message' : '포트폴리오 존재',
            'data' : None,
            'access_token' : new_token
        }

    image = request.files['mentoPic']
    mentoPic = uploadFileS3(image, 'mentoring')

    data_str = request.form['data']
    data = json.loads(data_str)

    brief = data['brief']
    content = data['content']
    tuition = data['tuition']
    subjects = data['subject']
    duration = 1 # TODO DB 컬럼 삭제 후 수정 (현재는 임시)
    if subjects == []:
        return {
            'status' : 404,
            'message' : '불충분한 입력',
            'data' : None,
            'access_token' : new_token
        }

    date = datetime.now()

    Portfolio.save(loginMember.id, mentoPic, brief, content, date, tuition, duration, subjects)

    return {
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
    page = request.args.get('page')

    if searchWord is None :
        portfolios = Portfolio.findPaging(int(page) * 12 if page else 0)
    else : # 검색
        portfolios = Portfolio.searchByMento(searchWord, int(page) * 12 if page else 0)

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
        'portfolioList' : portfolioList,
        'isNext' : False if len(portfolioList) < 12 else True
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

    mentoId = portfolio[10]
    mentiId = loginMember.id
    isJoining = MentoringRoom.existsByMentoMenti(mentoId, mentiId)

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
        'subject' : list(map(int, portfolio[9].split(','))),
        'isJoining' : isJoining
    }

    return {
        'data' : result,
        'access_token' : new_token
    }

@mento_bp.route('/<id>', methods = ['PATCH']) # 포폴 수정
@login_required
def modifyPortfolio(loginMember, new_token, id) :

    if not Portfolio.existsById(id):
        return {
            'status' : 400,
            'message' : '없는 포트폴리오',
            'data' : None,
            'access_token' : new_token
        }

    if not Portfolio.existsByIdAndMento(id, loginMember.id):
        return {
            'status' : 403,
            'message' : '권한 없는 사용자',
            'data' : None,
            'access_token' : new_token
        }

    image = request.files['mentoPic']
    mentoPic = uploadFileS3(image, 'mentoring')

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

    if not Portfolio.existsById(id):
        return {
            'status' : 400,
            'message' : '없는 포트폴리오',
            'data' : None,
            'access_token' : new_token
        }

    if not Portfolio.existsByIdAndMento(id, loginMember.id):
        return {
            'status' : 403,
            'message' : '권한 없는 사용자',
            'data' : None,
            'access_token' : new_token
        }

    Portfolio.updateDeleted(id)

    return {
        'data' : None,
        'access_token' : new_token
    }

@mento_bp.route('/<id>/state', methods = ['PATCH']) # ON/OFF
@login_required
def changeState(loginMember, new_token, id) :

    if not Portfolio.existsById(id):
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

@mento_bp.route('/<id>/review', methods = ['GET']) # 후기 조회
@login_required
def showReview(loginMember, new_token, id):

    if not Portfolio.existsById(id):
        return {
            'status' : 400,
            'message' : '없는 포트폴리오',
            'data' : None,
            'access_token' : new_token
        }

    mentoId = Portfolio.findMentoById(id)

    reviews = Review.findByMentoId(mentoId)

    result = []

    for review in reviews:
        result.append({
            'writer': findNickName(review.writer),
            'content': review.content,
            'score': review.score,
            'date': formatYMDHM(review.curDate)
        })

    return {
        'data' : result,
        'access_token' : new_token
    }

tids = {}
classes = {}
@mento_bp.route('/<id>/apply', methods=['POST']) # 멘토링 신청 + 결제
@login_required
def applyMentoring(loginMember, new_token, id) :

    if not Portfolio.existsById(id):
        return {
            'status' : 400,
            'message' : '없는 포트폴리오',
            'data' : None,
            'access_token' : new_token
        }
    
    mentiId = loginMember.id
    mentoId = Portfolio.findMentoById(id)
    if mentiId == mentoId:
        return {
            'status' : 403,
            'message' : '권한 없는 사용자',
            'data' : None,
            'access_token' : new_token
        }

    # 1. 결제
    global tids, classes

    class_cnt = request.get_json()['classes']

    portfolio_tuition = Portfolio.findById(id)[5] # TODO refactoring

    item_name = f'{findNickName(mentoId)} 멘토링 수업료'
    total_tuition = class_cnt * portfolio_tuition
    response = payKakao(id, loginMember, item_name, total_tuition, True)
    # print(response)

    if response.get('code', None):
        return {
            'status': 404,
            'message': '결제 실패',
            'data': None,
            'access_token': new_token
        }

    classes[loginMember.id] = class_cnt
    tids[loginMember.id] = response['tid']

    redirect_url = response['next_redirect_pc_url']

    return {
        'data': {
            'pay_url': redirect_url
        },
        'access_token': new_token
    }

@mento_bp.route('/<id>/pay/success', methods=['GET']) # 결제 성공 시 방 생성 & 쪽지 전송
@login_required
def applySuccess(loginMember, new_token, id):

    global tids, classes

    pg_token = request.args.get('pg_token')

    response = payKakaoSuccess(loginMember, pg_token, tids.get(loginMember.id, ''))

    if response.get('code', None):
        return {
            'status': 404,
            'message': '결제 승인 요청 실패',
            'data': None,
            'access_token': new_token
        }

    # 2. 룸 생성
    mentiId = loginMember.id
    mentoId = Portfolio.findMentoById(id)

    mentiNick = loginMember.nickname
    mentoNick = findNickName(mentoId)

    roomName = f"멘토 {mentoNick}와 멘티 {mentiNick}의 공부방"

    roomId = MentoringRoom.save(roomName, datetime.now(), mentoId, mentiId, id)

    # 3. 멘토링룸 링크 생성
    room_url = "http://localhost:3000/mentoringroom/" + str(roomId)

    # 4. 쪽지 전송
    menticontent = f"<a href={room_url}>스터디룸</a>으로 입장해주세요."
    mentocontent = f"[{mentiNick}]님과 멘토링을 진행합니다."
    
    chat.insertChat(mentiId, mentoId, mentocontent, datetime.now())
    chat.insertChat(mentoId, mentiId, menticontent, datetime.now())

    # 5. 수업 횟수 증가
    MentoringRoom.updateLessonCnt(roomId, classes.get(mentiId, 0))

    del tids[mentiId]
    del classes[mentiId]

    return {
        'data': None,
        'access_token': new_token
    }