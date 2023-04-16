from flask import Flask, render_template, request, jsonify, make_response
# from flask_cors import CORS

app = Flask(__name__)
# CORS(app)


@app.route("/join", methods=['GET', 'POST'])
def join() :
    if request.method == 'GET' :
        response_body = {
            "id": "hele",
            "pw": "pw",
            "pwchk": "pwchk",
            "name": "scy",
            "email":"email"
        }
        return response_body
    else :
        data = request.get_json(silent=True)
        account = {
            'id': data['memberId'],
            'pw': data['memberPw'],
            'chk': data['pwChk'],
            'name': data['memberName'],
            'email': data['memberEmail']
            }
        print(account)
        return jsonify(
            {'status': 'success'}
        )

# if __name__ == '__main__' :
#     app.run(debug=True)