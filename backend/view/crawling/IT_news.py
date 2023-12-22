import requests
from bs4 import BeautifulSoup
from backend.model.db_mongo import conn_mongodb

def connectUrl(url, page, date) :
    header = {'User-Agent':'Mozilla/5.0'}

    response = requests.get(url.format(page, date), headers=header)

    return BeautifulSoup(response.text, 'html.parser')

def crawlingNews(date):

    daum_url = 'https://news.daum.net/breakingnews/digital?page={0}&regDate={1}'

    page = 1

    soup_date = connectUrl(daum_url, page, date)
    news_date = soup_date.select_one('.box_calendar > .screen_out').text

    while True :
        soup = connectUrl(daum_url, page, date)

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