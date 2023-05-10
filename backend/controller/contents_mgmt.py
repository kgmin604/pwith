# 일단 여기에 작성하긴 했으나, IT뉴스와는 달리 실시간으로 업로드할 필요는 없으므로 크게 몇 번 크롤링해서 데이터만 추출

import requests
from bs4 import BeautifulSoup
from json import loads

header = {'User-Agent':'Mozilla/5.0'}
lecture_title = []
lecture_tag = []
lecture_link = []
lecture_category = []

url = 'https://www.inflearn.com/courses/it-programming/programming-lang?order=popular&page={}' # 프로그래밍 언어 category. 인기순 정렬.
# url = 'https://www.inflearn.com/courses/it-programming?order=popular&page={}' # 모든 강의 크롤링 후, tag로 우리 기준대로 분류하기

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

        title = loads(info)['course_title']
        tags = loads(info)['skill_tag'].split(',') # 또는 literal_eval() 사용

        lecture_title.append(title)
        lecture_tag.append(tags)
        lecture_link.append(link)

    if not soup.select_one('.pagination-next') : # '다음 페이지' 아이콘 없을 때 (=마지막 페이지)
        break
    
    pg += 1

print(lecture_title)