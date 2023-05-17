# 일단 여기에 작성하긴 했으나, IT뉴스와는 달리 실시간으로 업로드할 필요는 없으므로 크게 몇 번 크롤링해서 데이터만 추출

import requests
from bs4 import BeautifulSoup
from json import loads, decoder
from model.db_mongo import conn_mongodb

conn_mongodb().lecture_crawling.delete_many({})

header = {'User-Agent':'Mozilla/5.0'}
# lecture_title = []
# lecture_tag = []
# lecture_link = []
# lecture_category = []

url = 'https://www.inflearn.com/courses/it-programming?order=popular&page={}' # 개발/프로그래밍 인기순 정렬.

def connectUrl(url, page=1) :
    response = requests.get(url.format(page), headers=header)
    return BeautifulSoup(response.text, 'html.parser')

pg = 1
while True :
    soup = connectUrl(url, pg)

    lectures = soup.select('.course_card_front')

    for lecture in lectures :

        link = 'https://www.inflearn.com' + lecture.get('href')

        info = lecture.select_one('.course-data').get('fxd-data')
        
        try:
            info = loads(info) # string to json
        except decoder.JSONDecodeError as e: # json.decoder.JSONDecodeError
            print("JSONDecodeError occurred: ", e)
            continue

        title = info['course_title'] 
        first_category = info['first_category'].split(',')
        second_category = info['second_category'].split(',')
        tags = info['skill_tag'].split(',') # 또는 literal_eval() 사용

        print(pg, title)
        # lecture_title.append(title)
        # lecture_tag.append(tags)
        # lecture_link.append(link)

        lec = {
            'title' : title,
            'first_category' : first_category,
            'second_category' : second_category,
            'tags' : tags,
            'link' : link
        }

        conn_mongodb().lecture_crawling.insert_one(lec)

    if not soup.select_one('.pagination-next') : # '다음 페이지' 아이콘 없을 때 (=마지막 페이지)
        break
    
    pg += 1