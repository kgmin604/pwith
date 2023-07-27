from backend import s3, app, config
from flask import request
from werkzeug.utils import secure_filename

@app.route('/imgupload', methods=['POST'])
def upload_file():

    file = request.files['file']

    if file:

        filename = secure_filename(file.filename)

        s3.upload_fileobj(file, config.S3_BUCKET_NAME, filename)

        return {
            'result' : '파일 업로드 성공'
        }
    
    return {
        'status' : 404,
        'message' : '선택된 파일 없음',
        'data' : None
    }

if __name__ == "__main__": # 해당 파일을 실행했을 경우
    app.run(host="127.0.0.1", port="5000")