from flask import Blueprint
from urllib.parse import urlencode

from backend import config

oauth_member_bp = Blueprint('oauth_member', __name__, url_prefix='/member')

@oauth_member_bp.route('/login/auth/<provider>', methods = ['GET'])
def login_oauth(provider):

    if provider not in ['google', 'naver', 'kakao']:
        return {
            'status' : 404,
            'message' : '제공하지 않는 리소스 서버',
            'data' : None
        }

    provider = str.upper(provider)

    authorize_endpoint = getattr(config, f'{provider}_AUTHORIZE_ENDPOINT')
    redirect_uri = getattr(config, f'{provider}_REDIRECT_URI')
    client_id = getattr(config, f'{provider}_CLIENT_ID')
    scope = getattr(config, f'{provider}_SCOPE')
    response_type = 'code'

    if provider == 'KAKAO':
        query_param = urlencode(dict(
            redirect_uri = redirect_uri,
            client_id = client_id,
            response_type = response_type,
            scope = scope
        ))
    elif provider == 'NAVER':
        query_param = urlencode(dict(
            redirect_uri = redirect_uri,
            client_id = client_id,
            response_type = response_type
        ))
    elif provider == 'GOOGLE':
        query_param = urlencode(dict(
            redirect_uri = redirect_uri,
            client_id = client_id,
            scope = scope,
            response_type = response_type,
            access_type = 'offline'
            # prompt = 'consent' # only for development env
        ))

    authorize_redirect = f'{authorize_endpoint}?{query_param}'
    
    return {
        'auth_url' : authorize_redirect
    }