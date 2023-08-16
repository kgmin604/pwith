import requests
from bs4 import BeautifulSoup
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

kyobo_url = 'https://product.kyobobook.co.kr/category/KOR/33#?page={}&type=best&per=20' # 국내도서-컴퓨터/IT 베스트셀러.

def connectUrl(url, page=1) :
    response = requests.get(url.format(page), headers=header)
    return BeautifulSoup(response.text, 'html.parser')

page = 1
while page != 63 :
    soup = connectUrl(kyobo_url, page)
    print("connect success")
            
            
    prod_items = soup.find_all('div', class_='prod_info_box')
    prod_link = soup.find_all('div', class_= 'prod_thumb_box')
    
    if prod_items:
        for item in prod_items:
            title = item.select_one('.prod_name').get_text(strip=True)
            writer = item.select_one('.prod_author').get_text(strip=True)
            date = item.select_one('.prod_author > .date')
            
            data = {
            'title': title,
            'writer': writer,
            'date': date
            }
            #print(date)
            
            conn_mongodb().book_crawling.insert_one(data)
            
    else:
        print('상품 목록을 찾을 수 없습니다.')
        
    if prod_link:
        for item in prod_link:
            url = item.select_one('.prod_link').get('href')
            img = item.select_one('.prod_link > .img_box > img')
            
            data['url'] = url
            data['img_url'] = img

            conn_mongodb().book_crawling.insert_one(data)
        # conn_mongodb().book_crawling.insert_one(book)
        
    if not soup.select_one('.btn_page.next') :
        print("page : " + str(page) + " and break")
        break

    print("page : " + str(page))
    page += 1
        