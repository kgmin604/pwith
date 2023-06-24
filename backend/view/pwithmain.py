from flask import Flask, session, Blueprint, render_template, redirect, request, jsonify, url_for
from flask_login import login_required, current_user
from controller.board_mgmt import studyPost
from controller.mentor_mgmt import Portfolio
from model.db_mongo import conn_mongodb

main_bp = Blueprint('pwithmain', __name__, url_prefix='')

@main_bp.route('/', methods = ['GET', 'POST'])
def showStudy():
    if request.method == 'POST':
        
        chk = request.get_json()['chkSession']
        
        if chk == 0:
            studyList = []
            newsList = []
            mentoringList = []

            posts = studyPost.getNStudy(5)
            for post in posts :
                post = {
                    'id' : posts[0],
                    'title' : posts[1],
                }
                studyList.append(post)
            # print(studyList)

            news_db = conn_mongodb().ITnews_crawling.find().sort('_id', -1).limit(5)
            for news in news_db :
                newsList.append({
                    'title' : news['title'],
                    'url' : news['url']
                })
                
            mentorings = Portfolio.getNmentoring()
            for portfolio in mentorings:
                portfolio = {
                    'id' : mentorings[0],
                    'brief' : mentorings[1]
                }
                mentoringList.append(portfolio)

            return jsonify({
                'study' : studyList,
                'news' : newsList,
                'mentoring' : mentoringList
            })
        