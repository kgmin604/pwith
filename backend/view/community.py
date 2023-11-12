from flask import Flask, session, Blueprint, render_template, redirect, request, jsonify, url_for
from datetime import datetime
from backend.model.db_mongo import conn_mongodb
from backend.controller.community_mgmt import QNAPost
from backend.controller.replyQna_mgmt import ReplyQna
from backend.controller.alarm_mgmt import Alarm
from backend.view import findNickName, getFormattedDate, mainFormattedDate, formatDateToString, getProfileImage
from backend.view import login_required

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

    conts_db = conn_mongodb().lecture_crawling.find().sort('_id', -1).limit(3)
    for n in conts_db :

        title = n['title']
        type = n['type']
        url = n['link']

        # formatted_date = datetime.strptime(date, '%Y년 %m월 %d일').strftime('%Y-%m-%d')

        conts.append({
            'title' : title,
            'type' : type,
            'url' : url
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
        
        page = request.args.get('page')
        category = request.args.get('category')

        if category is None:
            category = 11

        posts = QNAPost.getQNA(int(category))
        
        requiredPage = len(list(posts)) // 10 + 1   # 전체 페이지 수
        
        for i in range(int(page)):  # 전체 페이지 수 만큼 각 페이지당 studyList 가져오기
            QNAList = QNAPost.pagenation(i+1, 10)   # 매개변수: 현재 페이지, 한 페이지 당 게시글 수
        
        for i in range(len(posts)):
            post = {
                    'id' : ((int(page)-1)*10)+i+1,
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
                    'id': ((int(page)-1)*10)+i+1,
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
@login_required
def showDetail(id, loginMember, new_token) :
    if request.method == 'GET' :

        result = {}

        post = QNAPost.findById(id)

        if not post :
            return result
        
        viewresult = QNAPost.updateViews(id)
        liked = 0
        try : # 익명의 경우
            liked = QNAPost.findLike(loginMember.id, id)
        except Exception as ex :
            liked = False

        result = {
            'title': post.title,
            'writer' : findNickName(post.writer),
            # 'writerImage' : getProfileImage(post.writer),
            'content': post.content,
            'curDate' : getFormattedDate(formatDateToString(post.curDate)),
            'likes' : post.likes,
            'liked' : liked,
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
                'profileImage' : getProfileImage(reply[1])
            })
        
        return {
            'data' : {
                'post' : result,
                'reply' : replyResult
            },
            'access_token' : new_token
        }
        
@community_bp.route('/qna/<int:id>', methods = ['PATCH'])
@login_required
def updatePost(id, loginMember, new_token):
    if request.method == 'PATCH':     # 게시글 수정
        id = request.get_json()['postId']
        postContent = request.get_json()['content']
        title = request.get_json()['title']
        
        try :
            done = QNAPost.updateQna(id, postContent, title)
        except Exception as ex :
            print("에러 이유 : " + str(ex))
            done = 0

        return {
            'data': None,
            'access_token' : new_token
        }
        
@community_bp.route('/qna/<int:id>', methods = ['DELETE'])
@login_required
def deletePost(id, loginMember, new_token):
    
    id = request.get_json()['postId']
    
    try :
        done = QNAPost.deleteQna(id)
    except Exception as ex :
        print("에러 이유 : " + str(ex))
        done = 0

    return {
        'data' : None,
        'access_token' : new_token
    }

@community_bp.route('/qna/<int:id>', methods = ['POST'])
@login_required
def replyPost(id, loginMember, new_token) :      # 댓글 작성

        cnt = request.get_json()['content']

        writer = loginMember.id

        date = datetime.now()

        try :
            pk = ReplyQna.writeReply(writer, cnt, date, id)
            # qnaReplyAlarm 에 추가
            post = QNAPost.findById(id)
            
            Alarm.insertAlarm(post.__writer, writer, pk, 4)
            
        except Exception as ex:
            print("에러 이유 : " + str(ex))
            pk = 0

        return {
            'data' : {
                'id' : pk, # 0 is fail
                'date' : formatDateToString(date)
            },
            'access_token' : new_token
        }

@community_bp.route('/qna/<int:id>/<int:replyId>', methods = ['PATCH'])
@login_required
def replyPatch(id, replyId, loginMember, new_token) :  # 댓글 수정

        newContent = request.get_json()['content']

        try :
            done = ReplyQna.modifyReply(replyId, newContent)
        except Exception as ex :
            print("에러 이유 : " + str(ex))
            done = 0

        return {
            'data' : None,
            'access_token' : new_token
        }

@community_bp.route('/qna/<int:id>/<int:replyId>', methods = ['DELETE'])
@login_required
def replyDelete(id, replyId, loginMember, new_token) : # 댓글 삭제

        try :
            done = ReplyQna.removeReply(replyId)
        except Exception as ex :
            print("에러 이유 : " + str(ex)) 
            done = 0

        return {
            'done' : None,
            'access_token' : new_token
        }
    


@community_bp.route("/qna", methods=['POST'])
@login_required
def write(loginMember, new_token):

    data = request.get_json(silent=True)
    
    title = data['title']
    writer = loginMember.id
    curDate = QNAPost.curdate()
    content = data['content']
    category = data['category']
    likes = 0
    views = 0
    
    # print(postType, title, writer, curDate, content, category, likes, views)
    done = QNAPost.insertQNA(title, writer, curDate, content, category, likes, views)
    
    return {
        'done' : None,
        'access_token' : new_token
    }
        
@community_bp.route('/qna/<int:id>/like', methods=['POST'])
@login_required
def like(id, loginMember, new_token):
    memId = loginMember.id
    post = QNAPost.findById(id)
    
    postId = request.get_json()['postId']
    
    print(memId, postId)
    QNAPost.Like(memId, postId)
    print("liked")
    likes = QNAPost.getLikes(id)
    liked = QNAPost.findLike(memId, id)
    
    print(likes)
    print(liked)
    
    return {
        'data' : {
            'likes' : likes,
            'liked' : liked
        },
        'access_token' : new_token
    }
   
   
   # 카테고리 : first, second == null -> 전체 결과
@community_bp.route('/contents/lecture', methods=['GET'])
def listLectures() :
    page = 0
    result = []

    page = request.args.get('page')

    if not page :
        return {
            'result' : result
        }

    page = int(page)
    
    all_lectureList = conn_mongodb().lecture_crawling.find()
    requiredPage = len(list(all_lectureList)) // 10 + 1
    
    lectureList = conn_mongodb().lecture_crawling.find().skip((page-1)*32).limit(32)

    cnt = 0
    
    for lecture in lectureList :
        if cnt == 32:
            cnt = 0
        else:
            cnt += 1
        result.append({
            'title' : lecture['title'],
            'instructor' : lecture['instructor'],
            'first_category' : lecture['first_category'],
            'second_category' : lecture['second_category'],
            'tags' : lecture['tags'],
            'link' : lecture['link'],
            'image': lecture['img'],
            'type' : lecture['type']
        })
        
    if cnt != 0 :
        isNext = True
    else:
        isNext = False
    
    return {
        'isNext' : isNext,
        'lecture' : result
    }
    
@community_bp.route('/contents/book', methods=['GET'])
def listBooks() :
    page = 0
    result = []

    page = request.args.get('page')

    if not page :
        return {
            'result' : result
        }

    page = int(page)
    
    all_bookList = conn_mongodb().book_crawling.find()
    requiredPage = len(list(all_bookList)) // 10 + 1

    bookList = conn_mongodb().book_crawling.find().sort('_id', -1).skip((page-1)*32).limit(32)
    
    cnt = 0
    for book in bookList :
        if cnt == 32:
            cnt = 0
        else:
            cnt += 1
        result.append({
            'title' : book['title'],
            'writer' : book['writer'],
            'publisher' : book['publisher'],
            'first_category' : book['first_category'],
            'second_category' : book['second_category'],
            'category' : 'IT 모바일',
            'link' : book['url'],
            'image': book['img'],
            'type' : book['type']
        })
        
    if cnt != 0 :
        isNext = True
    else:
        isNext = False
        
    
    return {
        'isNext' : isNext,
        'book' : result
    }