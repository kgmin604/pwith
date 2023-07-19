from flask import Flask, Blueprint, request, jsonify, redirect, url_for
from backend.controller.member_mgmt import Member
import bcrypt

bp = Blueprint('join', __name__, url_prefix='')

@bp.route('/join', methods=['GET', 'POST'])
def join() :
    if request.method == 'GET' :
        return jsonify(
            {'status': 'success'}
        )
    else :
        data = request.get_json()

        if(data['requestType'] == 'checkId') : # 중복 확인
            if isDuplicated(data['memberId']) :
                return {'code':0} # 사용 불가
            else:
                return {'code':1} # 사용 가능

        memId = data['memberId']
        memPw = data['memberPw']
        memName = data['memberName']
        memEmail = data['memberEmail']

        # 중복 확인 한 번 더 진행 후 insert (다른 요청이므로)
        if isDuplicated(memId) is False :

            hashed_password = hashPassword(memPw)

            Member.save(memId, hashed_password, memName, memEmail)
            print(memId + '회원가입 성공')

            return jsonify(
                {'status': 'success'}
            )
        else :
            return jsonify(
                {'status': 'fail'} # 수정 필요
            )

def isDuplicated(memId) :
    if not Member.findByMemberId(memId) :
        return False
    else :
        return True

def hashPassword(pw):

    hashed_pw = bcrypt.hashpw(pw.encode('utf-8'), bcrypt.gensalt())

    return hashed_pw.decode('utf-8')
