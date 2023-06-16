from flask import Flask, session, Blueprint, render_template, redirect, request, jsonify, url_for
from flask_login import login_required, current_user
from controller.board_mgmt import studyPost
from controller.community_mgmt import QNAPost

main_bp = Blueprint('pwithmain', __name__, url_prefix='')

@main_bp.route('/', methods = ['GET'])
def showStudy():
    if request.method == 'GET':
        posts = studyPost.getNStudy()
        studyList = []
        
        for i in range(len(posts)) :
            post = {
                'id' : posts[i][0],
                'title' : posts[i][2],
            }
            studyList.append(post)
        return jsonify(studyList)

def showQNA():
     if request.method == 'GET':
        posts = QNAPost.getNQNA()
        QNAList = []
        
        for i in range(len(posts)) :
            post = {
                'id' : posts[i][0],
                'title' : posts[i][2],
            }
            QNAList.append(post)

        return jsonify(QNAList)
        
def showIT():
    if request.method == 'GET' :
        post = []