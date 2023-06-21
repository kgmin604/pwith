from flask import Flask, session, Blueprint, render_template, redirect, request, jsonify, url_for
from flask_login import login_required, current_user
from controller.board_mgmt import studyPost
from controller.community_mgmt import QNAPost

main_bp = Blueprint('pwithmain', __name__, url_prefix='')

@main_bp.route('/', methods = ['GET', 'POST'])
def showStudy():
    if request.method == 'POST':
        posts = studyPost.getNStudy()
        studyList = []

        for i in range(len(posts)) :
            post = {
                'id' : posts[i][0],
                'title' : posts[i][1],
            }
            studyList.append(post)
        print(studyList)
        return jsonify(studyList)
        