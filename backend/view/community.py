import requests
from bs4 import BeautifulSoup
# from model.db_mongo import conn_mongodb

import pymongo

MONGO_HOST = 'localhost'

mongo_conn = pymongo.MongoClient('mongodb://%s' % MONGO_HOST)

def conn_mongodb() :
    try:
        mongo_conn.admin.command('ismaster')
        pwith_db = mongo_conn.pwith_db
    except:
        mongo_conn = pymongo.MongoClient('mongodb://%s' % MONGO_HOST)
        pwith_db = mongo_conn.pwith_db
    return pwith_db


header = {'User-Agent':'Mozilla/5.0'}
news_date = ''
news = {}

daum_url = 'https://news.daum.net/breakingnews/digital?page={}&regDate=20230613' # regDate 없애기

def connectUrl(url, page=1) :
    response = requests.get(url.format(page), headers=header)
    return BeautifulSoup(response.text, 'html.parser')

soup_date = connectUrl(daum_url, 1)
news_date = soup_date.select_one('.box_calendar > .screen_out').text

page = 1
newsId = 1

while True :
    soup = connectUrl(daum_url, page)

    url_tags = soup.select('.list_allnews > li > div > strong > a')

    for url_tag in url_tags :

        soup = connectUrl(url_tag.get('href'), page)
        url = url_tag.get('href')

        title = soup.select_one('.tit_view')
        img = soup.select_one('.link_figure > img')
        content = soup.select_one('.article_view')

        news = {
            'newsId' : newsId,
            'date' : news_date,
            'title' : title.text if title is not None else '',
            'content' : content.text.replace('\n', ' ') if content is not None else '',
            'img' : img.get('data-org-src') if img is not None else '',
            'url' : url
        }
        conn_mongodb().ITnews_crawling.insert_one(news)
        newsId += 1

    soup = connectUrl(daum_url, page)
    if not soup.select_one('.btn_page.btn_next') :
        print(soup.select_one('.btn_page.btn_next'))
        print("page : " + str(page) + " and break")
        break

    print("page : " + str(page))
    page += 1