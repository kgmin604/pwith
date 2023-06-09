from flask import Flask, session, Blueprint, render_template, redirect, request, jsonify, url_for
from flask_login import login_required, current_user
from datetime import datetime
# from backend.controller.community_mgmt import bootPost, QNAPost
from backend.model.db_mongo import conn_mongodb
from backend.model.db_mysql import conn_mysql
# from backend.view.community import conn_mongodb
from backend.controller.community_mgmt import QNAPost
from backend.controller.board_mgmt import studyPost
from backend.controller.reply_mgmt import Reply

community_bp = Blueprint('community', __name__, url_prefix='/community')

@community_bp.route('/main', methods = ['GET'])
def communityMain() :
    if request.method == 'GET' :

        news = []
        conts = []
        qna = []

        news_db = conn_mongodb().ITnews_crawling.find().sort('_id', -1).limit(3)
        for n in news_db :

            title = n['title']
            date = n['date']
            url = n['url']

            formatted_date = datetime.strptime(date, '%Y년 %m월 %d일').strftime('%Y-%m-%d')

            news.append({
                'title' : title,
                'date' : formatted_date,
                'url' : url
            })
        
        qna_db = QNAPost.get3QNA()
        for q in qna_db :

            postId = q[0]
            title = q[2]

            date = q[5]
            formatted_date = date.strftime("%Y-%m-%d")

            qna.append({
                'postId' : postId,
                'title' : title,
                'date' : formatted_date
            })

        # dummmmmmmmmmmmmmmy
        conts.append({
            'title' : '자바 ORM 표준 JPA 프로그래밍 - 기본편',
            'type' : 'lecture',
            'url' : 'https://www.inflearn.com/course/ORM-JPA-Basic/dashboard'
        })
        conts.append({
            'title' : '윤성우의 열혈 C++ 프로그래밍',
            'type' : 'book',
            'url' : 'https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=6960708'
        })
        conts.append({
            'title' : '스프링 MVC 1편 - 백엔드 웹 개발 핵심 기술',
            'type' : 'lecture',
            'url' : 'https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81-mvc-1/dashboard'
        })
        # dummmmmmmmmmmmmmmy

        return jsonify({
            'news' : news,
            'qna' : qna,
            'contents' : conts
        })
 
@community_bp.route('/it', methods=['GET', 'POST'])
def listNews() :
    if request.method == 'GET' :

        page = 0
        result = []

        page = request.args.get('page')
        date = request.args.get('date')

        if not page or not date :
            return jsonify(result)

        page = int(page)
        formatted_date = f'{date[:4]}년 {date[4:6]}월 {date[6:]}일'


        all_newsList = conn_mongodb().ITnews_crawling.find({'date':formatted_date}).sort('_id', -1)
        requiredPage = len(list(all_newsList)) // 10 + 1

        newsList = conn_mongodb().ITnews_crawling.find({'date':formatted_date}).sort('_id', -1).skip((page-1)*10).limit(10)

        for news in newsList :
            result.append({
                'date': news['date'],
                'title' : news['title'],
                'brief' : news['brief'],
                'img' : news['img'],
                'url' : news['url']
            })
        
        return jsonify({
            'page' : requiredPage,
            'news' : result
        })
    # 추후 검색 구현할 때 POST 방식 추가

@community_bp.route('/qna/main', methods=['GET', 'POST'])
def show():
    if request.method =='GET':
        
        searchType = request.args.get('type')
        searchValue = request.args.get('value')

        if (searchType is None) or (searchValue is None) : # 전체 글 출력
            result = []
            posts = QNAPost.getQNA()
            for i in range(len(posts)):
                post = {
                        'id' : posts[i][0],
                        'title' : posts[i][2],
                        'writer' : posts[i][3],
                        'curDate' : posts[i][5],
                        # 'category' : posts[i][6],
                        'likes' : posts[i][7],
                        'views' : posts[i][8]
                        }
                post['curDate'] = QNAPost.mainFormattedDate(posts[i][5])
                result.append(post)
            return jsonify(result)

        else : # 글 검색
            posts = []

            if int(searchType) == 0: # 제목으로 검색
                posts = QNAPost.findByTitle(searchValue, 1)
            else: # 글쓴이로 검색
                posts = QNAPost.findByWriter(searchValue, 1)

            result = []

            if posts is None :
                pass # 결과 없을 시 empty list
            else :
                for i in range(len(posts)) :
                    post = {
                        'id' : posts[i][0],
                        'type' : posts[i][1],
                        'title' : posts[i][2],
                        'writer' : posts[i][3],
                        # 'content' : posts[i][4],
                        'curDate' : posts[i][5],
                        # 'category' : posts[i][6],
                        'likes' : posts[i][7],
                        'views' : posts[i][8]
                    }
                    post['curDate'] = QNAPost.mainFormattedDate(posts[i][5])
                    
                    result.append(post)

            return jsonify(result)
    
@community_bp.route('/qna/<int:id>', methods=['GET']) # 글 조회
def showDetail(id) :
    if request.method == 'GET' :

        result = {}

        post = QNAPost.findById(id)

        if not post :
            return result
        
        viewresult = QNAPost.updateViews(id)

        result = {
            'title': post.getTitle(),
            'writer' : post.getWriter(),
            'content': post.getContent(),
            'curDate' : post.getCurDate(),
            'likes' : QNAPost.getLikes(id),
            'liked' : QNAPost.getLiked(current_user.getId(), id),
            'views': post.getViews()
        }
        
        # toFront['curDate'] = QNAPost.getFormattedDate(toFront['curDate'])

        replyList = Reply.showReply(1, id) # 댓글 조회

        replyResult = []

        for reply in replyList :

            date = studyPost.getFormattedDate(reply[3])

            replyResult.append({
                'commentId' : reply[0],
                'writer' : reply[1],
                'comment' : reply[2],
                'date' : date
            })
        
        return jsonify({
            'post' : result,
            'reply' : replyResult
        })
        
@community_bp.route('/qna/update/<int:id>', methods = ['PUT'])
def updatePost(id):
    if request.method == 'PUT':     # 게시글 수정
        id = request.get_json()['postId']
        postContent = request.get_json()['content']
        
        try :
            done = QNAPost.updateQNA(id, postContent)
        except Exception as ex :
            print("에러 이유 : " + str(ex))
            done = 0

        return jsonify({
            'done' : done
        })
        
@community_bp.route('/qna/delete/<int:id>', methods = ['DELETE'])
def deletePost(id):
    if request.method == 'DELETE':      # 게시글 삭제
        id = request.get_json()['postId']
        
        try :
            done = QNAPost.deleteQNA(id)
        except Exception as ex :
            print("에러 이유 : " + str(ex))
            done = 0

        return jsonify({
            'done' : done
        })

@community_bp.route('/qna/<int:id>', methods = ['POST', 'PUT', 'DELETE'])
def reply(id) :
    if request.method == 'POST' : # 댓글 작성

        cnt = request.get_json()['content']

        writer = current_user.getId()
        # writer = 'bb' # dummmmmmmmmmmmmmmmmmmmmmy

        date = datetime.now()

        try :
            pk = Reply.writeReply(writer, cnt, date, 1, id)
        except Exception as ex:
            print("에러 이유 : " + str(ex))
            pk = 0

        return jsonify({
            'replyId' : pk, # 0 is fail
            'date' : studyPost.getFormattedDate(date)
        })

    elif request.method == 'PUT' : # 댓글 수정

        replyId = request.get_json()['replyId']
        newContent = request.get_json()['content']

        try :
            done = Reply.modifyReply(replyId, newContent)
        except Exception as ex :
            print("에러 이유 : " + str(ex))
            done = 0

        return jsonify({
            'done' : done
        })

    else : # 댓글 삭제

        replyId = request.get_json()['replyId']

        try :
            done = Reply.removeReply(replyId)
        except Exception as ex :
            print("에러 이유 : " + str(ex))
            done = 0

        return jsonify({
            'done' : done
        })
    

@login_required
@community_bp.route("/qna/create", methods=['GET', 'POST'])
def write():
    if request.method == 'POST':
        # print("post\n")
        data = request.get_json(silent=True)
        # print(data)
        
        postType = 1
        title = data['title']
        writer = current_user.getId()
        curDate = QNAPost.curdate()
        content = data['content']
        category = data['category']
        likes = 0
        views = 0
        
        # print(postType, title, writer, curDate, content, category, likes, views)
        done = QNAPost.insertQNA(postType, title, writer, curDate, content, category, likes, views)
        
        return jsonify({
            'done' : done
        })
        
@login_required
@community_bp.route('/qna/<int:id>/like', methods=['GET', 'POST'])
def like(id):
    memId = current_user.getId()
    if request.method=='POST':
        postId = request.get_json()['postId']
        
        print(memId, postId)
        liked = QNAPost.toggleLike(memId, postId)
        print("liked")
        
        
    if request.method == 'GET':
        likes = QNAPost.getLikes(id)
        liked = QNAPost.getLiked(memId, id)
        return jsonify({
            'likes' : likes,
            'liked' : liked
        })
    return jsonify({'message': 'Invalid request method'})   # 추가: POST 요청 이외의 다른 요청에 대한 처리 로직
      