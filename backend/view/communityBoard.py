from flask import Flask, session, Blueprint, render_template, redirect, request, jsonify, url_for
from flask_login import login_required, current_user
from datetime import datetime
from backend.model.db_mongo import conn_mongodb
from backend.model.db_mysql import conn_mysql
from backend.controller.community_mgmt import QNAPost
from backend.controller.study_mgmt import studyPost
from backend.controller.replyQna_mgmt import ReplyQna
from backend.view import findNickName, getFormattedDate, mainFormattedDate, formatDateToString, getProfileImage

community_bp = Blueprint('community', __name__, url_prefix='/community')

@community_bp.route('', methods = ['GET'])
def communityMain() :
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
        title = q[1]

        date = q[3]
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

    return {
        'news' : news,
        'qna' : qna,
        'contents' : conts
    }
 
@community_bp.route('/it', methods=['GET'])
def listNews() :
    page = 0
    result = []

    page = request.args.get('page')
    date = request.args.get('date')

    if not page or not date :
        return {
            'result' : result
        }

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
    
    return {
        'page' : requiredPage,
        'news' : result
    }

@community_bp.route('/qna', methods=['GET'])
def show():     # 전체 글 출력
    search = request.args.get('search')
    print(search)
    
    if search is None:
        posts = []
        result = []
        page = 0
        posts = QNAPost.getQNA()
        
        page = request.args.get('page')

        requiredPage = len(list(posts)) // 10 + 1   # 전체 페이지 수
        
        for i in range(int(page)):  # 전체 페이지 수 만큼 각 페이지당 studyList 가져오기
            QNAList = QNAPost.pagenation(i+1, 10)   # 매개변수: 현재 페이지, 한 페이지 당 게시글 수
        
        for i in range(len(posts)):
            post = {
                    'id' : i+1,
                    'qnaId' : posts[i][0],
                    'title' : posts[i][1],
                    'writer' : findNickName(posts[i][2]),
                    'curDate' : posts[i][3],
                    'category' : posts[i][5],
                    'likes' : posts[i][6],
                    'views' : posts[i][7]
                    }
            post['curDate'] = mainFormattedDate(posts[i][3])
            result.append(post)
        return { 
                'posts' : result,
                'page': requiredPage
            }
    
    else:
        print("search")
        
        searchType = request.args.get('type')
        searchValue = request.args.get('value')
        posts = []
        result = []
        page = 0
        
        print(searchType, searchValue)

        if int(searchType) == 0: # 제목으로 검색
            posts = QNAPost.findByTitle(searchValue)
        elif int(searchType) == 1: # 글쓴이로 검색
            posts = QNAPost.findByWriter(searchValue)
            
        page = request.args.get('page')

        if posts is None :
            requiredPage = 0
            pass # 결과 없을 시 empty list
        else :
            requiredPage = len(list(posts)) // 10 + 1   # 전체 페이지 수
            
            for i in range(int(page)):  # 전체 페이지 수 만큼 각 페이지당 studyList 가져오기
                requiredPage = len(list(posts)) // 10 + 1   # 전체 페이지 수
                QNAList = QNAPost.pagenation(i+1, 10)   # 매개변수: 현재 페이지, 한 페이지 당 게시글 수
            
            for i in range(len(posts)) :
                post = {
                    'id': i+1,
                    'qnaId' : posts[i][0],
                    'title' : posts[i][1],
                    'writer' : findNickName(posts[i][2]),
                    'content' : posts[i][4],
                    'curDate' : posts[i][3],
                    'category' : posts[i][5],
                    'likes' : posts[i][6],
                    'views' : posts[i][7]
                }
                post['curDate'] = mainFormattedDate(posts[i][3])
                
                result.append(post)

        return {
            'posts' : result,
            'num': requiredPage
            }


@community_bp.route('/qna/<int:id>', methods=['GET']) # 글 조회
def showDetail(id) :
    if request.method == 'GET' :

        result = {}

        post = QNAPost.findById(id)

        if not post :
            return result
        
        viewresult = QNAPost.updateViews(id)

        result = {
            'title': post.title,
            'writer' : findNickName(post.writer),
            'writerImage' : getProfileImage(current_user.get_id()),
            'content': post.content,
            'curDate' : getFormattedDate(formatDateToString(post.curDate)),
            'likes' : post.likes,
            'liked' : QNAPost.findLike(current_user.get_id(), id),
            'views': post.views
        }
        
        # toFront['curDate'] = QNAPost.getFormattedDate(toFront['curDate'])

        replyList = ReplyQna.showReplies(id) # 댓글 조회 

        replyResult = []

        for reply in replyList :

            date = formatDateToString(reply[3])

            replyResult.append({
                'id' : reply[0],
                'writer' : findNickName(reply[1]),
                'content' : reply[2],
                'date' : getFormattedDate(date),
                'image' : getProfileImage(current_user.get_id())
            })
        
        return {
            'post' : result,
            'reply' : replyResult
        }
        
@community_bp.route('/qna/update/<int:id>', methods = ['PATCH'])
def updatePost(id):
    if request.method == 'PATCH':     # 게시글 수정
        id = request.get_json()['postId']
        postContent = request.get_json()['content']
        
        try :
            done = QNAPost.updateQNA(id, postContent)
        except Exception as ex :
            print("에러 이유 : " + str(ex))
            done = 0

        return {
            'data': None
        }
        
@community_bp.route('/qna/delete/<int:id>', methods = ['DELETE'])
def deletePost(id):
    if request.method == 'DELETE':      # 게시글 삭제
        id = request.get_json()['postId']
        
        try :
            done = QNAPost.deleteQNA(id)
        except Exception as ex :
            print("에러 이유 : " + str(ex))
            done = 0

        return {
            'done' : None
        }

@community_bp.route('/qna/<int:id>', methods = ['POST'])
def replyPost(id) :      # 댓글 작성

        cnt = request.get_json()['content']

        writer = current_user.get_id()

        date = datetime.now()

        try :
            pk = ReplyQna.writeReply(writer, cnt, date, id)
            # qnaReplyAlarm 에 추가
            post = QNAPost.findById(id)
            
            QNAPost.insertReplyAlarm(post.__writer, writer, pk)
            
        except Exception as ex:
            print("에러 이유 : " + str(ex))
            pk = 0

        return {
            'id' : pk, # 0 is fail
            'date' : formatDateToString(date)
        }

@community_bp.route('/qna/<int:id>/<int:replyId>', methods = ['PATCH'])
def replyPatch(id) :  # 댓글 수정
        replyId = request.get_json()['id']
        newContent = request.get_json()['content']

        try :
            done = ReplyQna.modifyReply(replyId, newContent)
        except Exception as ex :
            print("에러 이유 : " + str(ex))
            done = 0

        return {
            'done' : None
        }

@community_bp.route('/qna/<int:id>/<int:replyId>', methods = ['DELETE'])
def replyDelete(id) : # 댓글 삭제

        replyId = request.get_json()['id']

        try :
            done = ReplyQna.removeReply(replyId)
        except Exception as ex :
            print("에러 이유 : " + str(ex))
            done = 0

        return {
            'done' : None
        }
    

@login_required
@community_bp.route("/qna/create", methods=['POST'])
def write():
    if request.method == 'POST':
        # print("post\n")
        data = request.get_json(silent=True)
        # print(data)
        
        title = data['title']
        writer = current_user.get_id()
        curDate = QNAPost.curdate()
        content = data['content']
        category = data['category']
        likes = 0
        views = 0
        
        # print(postType, title, writer, curDate, content, category, likes, views)
        done = QNAPost.insertQNA(title, writer, curDate, content, category, likes, views)
        
        return {
            'done' : None
        }
        
@login_required
@community_bp.route('/qna/<int:id>/like', methods=['POST'])
def like(id):
    memId = current_user.get_id()
    post = studyPost.findById(id)
    
    if request.method=='POST':
        postId = request.get_json()['postId']
        
        print(memId, postId)
        QNAPost.Like(memId, postId)
        print("liked")
        likes = post.likes
        liked = QNAPost.findLike(memId, id)
        return {
            'likes' : likes,
            'liked' : liked
        }
   