from flask import Blueprint
from urllib.parse import urlencode

from backend import config

oauth_member_bp = Blueprint('oauth_member', __name__, url_prefix='/member')

@oauth_member_bp.route('/login/auth/google', methods = ['GET'])
def login_oauth():

    # if target not in ['google', 'kakao']:
    #     return abort(404)

    # target = str.upper(target)
    
    authorize_endpoint = config.GOOGLE_AUTHORIZE_ENDPOINT
    client_id = config.GOOGLE_CLIENT_ID
    redirect_uri = config.GOOGLE_REDIRECT_URI
    scope = config.GOOGLE_SCOPE
    response_type = 'code'

    query_param = urlencode(dict(
        redirect_uri = redirect_uri,
        client_id = client_id,
        scope = scope,
        response_type = response_type,
        access_type = 'offline',
        # prompt = 'consent' # only for development env
    ))

    authorize_redirect = f'{authorize_endpoint}?{query_param}'

    '''
    return {
        'message' : 'redirect',
        'data' : authorize_redirect
    }
    '''
    return {
        'auth_url' : authorize_redirect
    }

@oauth_member_bp.route('/login/auth/naver', methods = ['GET'])
def login_naver():
    
    authorize_endpoint = config.NAVER_AUTHORIZE_ENDPOINT
    client_id = config.NAVER_CLIENT_ID
    redirect_uri = config.NAVER_REDIRECT_URI
    response_type = 'code'

    query_param = urlencode(dict(
        redirect_uri = redirect_uri,
        client_id = client_id,
        response_type = response_type
    ))

    authorize_redirect = f'{authorize_endpoint}?{query_param}'
    
    '''
     return {
         'message' : 'redirect',
         'data' : authorize_redirect
     }
    '''
    
    return {
        'auth_url' : authorize_redirect
    }
