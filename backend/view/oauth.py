from flask import Blueprint, request, redirect
from urllib.parse import urlencode
import requests
import json

from backend import config

oauth_bp = Blueprint('oauth', __name__, url_prefix = '')

@oauth_bp.route('/oauth/callback/google', methods = ['GET'])
def google_callback(): # access token 받기
    
    code = request.args.get('code')

    token_endpoint = config.GOOGLE_TOKEN_ENDPOINT
    client_id = config.GOOGLE_CLIENT_ID
    client_secret = config.GOOGLE_CLIENT_SECRET
    redirect_uri = config.GOOGLE_REDIRECT_URI
    grant_type = 'authorization_code'

    resp = requests.post(token_endpoint, data = dict(
        code = code,
        client_id = client_id,
        client_secret = client_secret,
        redirect_uri = redirect_uri,
        grant_type = grant_type
    ))

    return json.loads(resp.text) # str to json