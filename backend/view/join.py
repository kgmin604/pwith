
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
#         data = request.get_json(silent=True)
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
#         # return redirect(url_for('/join'))