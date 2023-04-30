from flask import Flask, Blueprint, request, jsonify, redirect, url_for
from controller.member_mgmt import Member

bp = Blueprint('join', __name__, url_prefix='')

@bp.route('/join', methods=['GET', 'POST'])
def join() :
    if request.method == 'GET' :
        return jsonify(
            {'status': 'success'}
        )
    else :
        data = request.get_json(silent=True) # silent: parsing fail 에러 방지

        memId = data['memberId']
        memPw = data['memberPw']
        pwChk = data['pwChk']
        memName = data['memberName']
        memEmail = data['memberEmail']
        print(memId, memPw, pwChk, memName, memEmail)
        
        if isDuplicated(memId) : # 버튼 클릭 시 동작하도록
            return 'using_id'
        else :
            Member.insert(memId, memPw, memName, memEmail)

        return jsonify(
            {'status': 'success'}
        )


def isDuplicated(memId) : # id 중복 검사 -> 프론트 버튼 구현
    if not Member.findById(memId) :
        return False
    else :
        return True

def checkPassword(pw, pwChk) : # 비밀번호 확인 -> 프론트 구현?
    if pw == pwChk :
        return True
    else :
        return False
