import requests
from bs4 import BeautifulSoup
# from model.db_mongo import conn_mongodb


# import pymongo

# MONGO_HOST = 'localhost'

# mongo_conn = pymongo.MongoClient('mongodb://%s' % MONGO_HOST)

# def conn_mongodb() :
#     try:
#         mongo_conn.admin.command('ismaster')
#         pwith_db = mongo_conn.pwith_db
#     except:
#         mongo_conn = pymongo.MongoClient('mongodb://%s' % MONGO_HOST)
#         pwith_db = mongo_conn.pwith_db
#     return pwith_db



header = {'User-Agent':'Mozilla/5.0'}
news_date = ''
# news_title = []
# news_img = []
# news_content = []
# news_url = []
news = {}

page = 0
daum_url = 'https://news.daum.net/breakingnews/digital?page={}'

def connectUrl(url, page=1) :
    response = requests.get(url.format(page), headers=header)
    return BeautifulSoup(response.text, 'html.parser')

soup = connectUrl(daum_url, 1)
news_date = soup.select_one('.box_calendar > .screen_out').text
len_page = len(soup.select('.num_page'))

for page in range(1, len_page + 1) :

    soup = connectUrl(daum_url, page)

    url_tags = soup.select('.list_allnews > li > div > strong > a')

    for url_tag in url_tags :

        soup = connectUrl(url_tag.get('href'), page)
        # news_url.append(url_tag.get('href'))
        url = url_tag.get('href')

        title = soup.select_one('.tit_view')
        img = soup.select_one('.link_figure > img')
        content = soup.select_one('.article_view')

        # news_title.append(title.text) if title is not None else news_title.append('')
        # news_content.append(content.text.replace('\n', ' ')) if content is not None else news_content.append('')
        # news_img.append(img.get('data-src')) if img is not None else news_img.append('')

        news = {
            'date' : news_date,
            'title' : title.text if title is not None else '',
            'content' : content.text.replace('\n', ' ') if content is not None else '',
            'img' : img.get('data-org-src') if img is not None else '',
            'url' : url
        }
        conn_mongodb().ITnews_crawling.insert_one(news)