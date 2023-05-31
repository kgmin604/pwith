from mentor_mgmt import Portfolio

mento_bp = Blueprint('mento', __name__, url_prefix='/mentoring')

@mento_bp.route('/', methods = ['GET', 'POST'])
def showAll() :
    if request.method == 'GET' :
        allP = Portfolio.loadAll()
        print('allP : ')
        print(allP)
        return allP
    # else :

@mento_bp.route('/create', methods = ['GET', 'POST'])
def writePortfolio() :
    if request.method == 'POST' :
        portfolioInfo = request.get_json(silent=True)

        writer = current_user.getId()
        subject = portfolioInfo['subject']
        image = portfolioInfo['image']
        content = portfolioInfo['content']

        result = Portfolio.create(writer, subject, image, content)

        return result # 0 fail, 1 success (?)

@mento_bp.route('/<mentoId>', methods = ['GET', 'POST'])
def showDetail(mentoId) :
    if request.method == 'GET' :

        detail = {}

        portfolio = Portfolio.findById(mentoId)

        detail = {
            'writer' : portfolio.getWriter(),
            'subject' : portfolio.getSubject(),
            'image' : portfolio.getImage(),
            'content' : portfolio.getContent()
        }
        
        return detail