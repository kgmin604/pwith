import requests
from bs4 import BeautifulSoup
# from model.db_mongo import conn_mongodb

import pymongo

MONGO_SERVER = 'mongodb+srv://pwith:pwith1234@cluster0.ezfau5x.mongodb.net/'

mongo_conn = pymongo.MongoClient(MONGO_SERVER)

def conn_mongodb() :
    try:
        mongo_conn.admin.command('ismaster')
        pwith_db = mongo_conn.pwith_db
    except:
        mongo_conn = pymongo.MongoClient(MONGO_SERVER)
        pwith_db = mongo_conn.pwith_db
    return pwith_db

header = {'User-Agent':'Mozilla/5.0'}

# date = '20230620'
daum_url = 'https://news.daum.net/breakingnews/digital?page={}&regDate=20230622'

def connectUrl(url, page=1) :
    response = requests.get(url.format(page), headers=header)
    return BeautifulSoup(response.text, 'html.parser')

soup_date = connectUrl(daum_url, 1)
news_date = soup_date.select_one('.box_calendar > .screen_out').text

page = 1

while True :
    soup = connectUrl(daum_url, page)

    '''
    url_tags = soup.select('.list_allnews > li > div > strong > a')

    for url_tag in url_tags :

        soup = connectUrl(url_tag.get('href'), page)
        url = url_tag.get('href')

        title = soup.select_one('.tit_view')
        img = soup.select_one('.link_figure > img')
        content = soup.select_one('.article_view')

        news = {
            # 'newsId' : newsId,
            'date' : news_date,
            'title' : title.text if title is not None else '',
            'brief' : content.text.replace('\n', ' ') if content is not None else '',
            'img' : img.get('data-org-src') if img is not None else '',
            'url' : url
        }
        conn_mongodb().ITnews_crawling.insert_one(news)
        # newsId += 1
    '''

    all_news = soup.select('.list_allnews > li')

    for one_news in all_news :

        title = one_news.select_one('.cont_thumb > .tit_thumb > .link_txt')
        img = one_news.select_one('.link_thumb > img')
        brief = one_news.select_one('.cont_thumb > .desc_thumb > .link_txt')
        url = one_news.select_one('.cont_thumb > .tit_thumb > a')

        news = {
            'date' : news_date,
            'title' : title.text if title else '',
            'brief' : brief.text if brief else '',
            'img' : img.get('src') if img else '',
            'url' : url.get('href') if url else '',
        }
        conn_mongodb().ITnews_crawling.insert_one(news)

    if not soup.select_one('.btn_page.btn_next') :
        print("page : " + str(page) + " and break")
        break

    print("page : " + str(page))
    page += 1