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

book_url = 'https://www.yes24.com/24/Category/Display/{}{}?ParamSortTp=05&PageNumber={}' # 국내도서- IT/모바일 - 네트워크/해킹/보안.

def connectUrl(url, category='', sub_category = '', page = 1) :
    response = requests.get(url.format(category, sub_category, page), headers=header)
    return BeautifulSoup(response.text, 'html.parser')

conn_mongodb().book_crawling.delete_many({})
page = 1
sub_category_format = '00'
sub_category_num = 1
category = '001001003025'
    
for i in range(10):
    soup = connectUrl(book_url, category)
    print('-------------category_num-----------------')
    print(sub_category_format+str(sub_category_num))
    first_category = soup.select_one('#cateSubWrap > .cateSubRgt > .cateTit_sub > .cateTit_txt').get_text(strip=True)
    
    page = 1
    if sub_category_num >= 10 : 
        sub_category_format = '0'
    soup = connectUrl(book_url, category, sub_category_format+str(sub_category_num), page)
    print(sub_category_format+str(sub_category_num))
    second_category = soup.select_one('.cateSubRgt > .cateTit_sub > .cateTit_txt').get_text(strip=True)
    print(second_category)
    
    while page != 3 :
        
            
        prod_items = soup.select('.cCont_listArea .clearfix .cCont_goodsSet')
        
        if prod_items:
            for item in prod_items:
                #print(item)      
                url = item.select_one('.goods_img > .goods_imgSet > .imgBdr > a').get('href')
                complete_url = "https://www.yes24.com" + url
                img = item.select_one('.goods_img > .goods_imgSet > .imgBdr > a > img').get('src')
                title = item.select_one('.goods_info > .goods_name > a').get_text(strip=True)
                comment = item.select_one('div.goods_info > div.goods_name > span.gd_nameE').get_text(strip=True)
                auth = item.select_one('.goods_info > .goods_pubGrp > .goods_auth > a')
                if auth is not None:
                    writer = auth.get_text(strip=True)
                else:
                    writer = item.select_one('.goods_info > .goods_pubGrp > .goods_auth').get_text(strip=True)
                publisher = item.select_one('.goods_info > .goods_pubGrp > .goods_pub').get_text(strip=True)
            
                data = {
                'title': title,
                'writer': writer,
                'url' : complete_url,
                'img' : img,
                'comment': comment,
                'publisher' : publisher,
                'first_category' : first_category,
                'second_category' : second_category,
                'type' : 'book'
                }
                print(img)
                conn_mongodb().book_crawling.insert_one(data)

                # 업데이트할 내용 설정
                # update_data = {"$set": {"img": img}}
                # conn_mongodb().book_crawling.update_many({},update_data)
                
        else:
            
            print('상품 목록을 찾을 수 없습니다.')
            
            
        sub_category = soup.select('.cateSubListArea.clearfix > dl')

        print("page : " + str(page))
        page += 1
        
    sub_category_num +=1
        