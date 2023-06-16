from flask import Flask, session, Blueprint, render_template, redirect, request, jsonify, url_for
from flask_login import login_required, current_user
from controller.board_mgmt import studyPost
from controller.community_mgmt import QNAPost

main_bp = Blueprint('', __name__, url_prefix='/')

@main_bp.route('/', method = ['GET'])
def showStudy():
    if request.method == 'GET':
        posts = studyPost.getNStudy()
        result = []
        
        for i in range(len(posts)) :
            post = {
                'id' : posts[i][0],
                'title' : posts[i][2],
            }
            result.append(post)

        return jsonify(result)

def showQNA():
     if request.method == 'GET':
        posts = QNAPost.getNQNA()
        result = []
        
        for i in range(len(posts)) :
            post = {
                'id' : posts[i][0],
                'title' : posts[i][2],
            }
            result.append(post)

        return jsonify(result)
        
def showIT():
    if request.method == 'GET' :
        post = []