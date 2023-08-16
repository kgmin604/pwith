import requests
from bs4 import BeautifulSoup
from json import loads, decoder
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
# lecture_title = []
# lecture_tag = []
# lecture_link = []
# lecture_category = []

inflearn_url = 'https://www.inflearn.com/courses/it-programming?order=popular&page={}' # 개발/프로그래밍 인기순 정렬.

def connectUrl(url, page=1) :
    response = requests.get(url.format(page), headers=header)
    return BeautifulSoup(response.text, 'html.parser')

conn_mongodb().lecture_crawling.delete_many({})
page = 1
while page != 63 :
    soup = connectUrl(inflearn_url, page)
    print("connect success")

    lectures = soup.select('.course_card_front')

    for lecture in lectures :

        link = 'https://www.inflearn.com' + lecture.get('href')
        
        img = lecture.select_one('.card-image > .image.is_thumbnail > .swiper-lazy')
        img_url = img.get('data-src') if img else ''

        info = lecture.select_one('.course-data').get('fxd-data')
        
        try:
            info = loads(info) # string to json
        except decoder.JSONDecodeError as e: # json.decoder.JSONDecodeError
            print("JSONDecodeError occurred: ", e)
            continue

        title = info['course_title'] 
        instructor = info['seq0_instructor_name']
        first_category = info['first_category'].split(',')
        second_category = info['second_category'].split(',')
        tags = info['skill_tag'].split(',') # 또는 literal_eval() 사용

        print(page, title)
        # lecture_title.append(title)
        # lecture_tag.append(tags)
        # lecture_link.append(link)

        lec = {
            'title' : title,
            'instructor' : instructor,
            'first_category' : first_category,
            'second_category' : second_category,
            'tags' : tags,
            'link' : link,
            'img' : img_url
        }

        conn_mongodb().lecture_crawling.insert_one(lec)
        
    #soup.select_one('.pagenation-next').get('fxd-data')

    # if not soup.select_one('.pagenation-next').get('fxd-data') :
    #     print("page : " + str(page) + " and break")
    #     break

    print("page : " + str(page))
    page += 1