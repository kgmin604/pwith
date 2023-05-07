import requests
from bs4 import BeautifulSoup

# 🍒 다음 뉴스 크롤링

header = {'User-Agent':'Mozilla/5.0'}
news_title = []
news_img = []
news_content = []

page = 0
daum_url = 'https://news.daum.net/breakingnews/digital?page={}'

def connectUrl(url, page=1) :
    response = requests.get(url.format(page), headers=header)
    # print(url.format(page))
    return BeautifulSoup(response.text, 'html.parser')

len_page = len(connectUrl(daum_url, 1).select('.num_page'))

for page in range(1, len_page + 1) :

    soup = connectUrl(daum_url, page)

    url_tags = soup.select('.list_allnews > li > div > strong > a')

    for url_tag in url_tags :

        soup = connectUrl(url_tag.get('href'), page)

        title = soup.select_one('.tit_view')
        img = soup.select_one('.link_figure > img')
        content = soup.select_one('.article_view')

        news_title.append(title.text) if title is not None else news_title.append('')
        news_content.append(content.text.replace('\n', ' ')) if content is not None else news_content.append('')
        news_img.append(img.get('data-src')) if img is not None else news_img.append('')

print(news_title)

# 🍒 네이버 뉴스 크롤링

# header = {'User-Agent':'Mozilla/5.0'}
# news_title = []
# news_img = []
# news_content = []
# category_list = [731, 226, 227, 230, 732, 283, 229, 228]

# page = 0
# category = 0
# naver_url = 'https://news.naver.com/main/list.naver?mode=LS2D&mid=shm&sid1=105&sid2={0}&page={1}'

# def connectUrl(url, category=731, page=1) :
#     response = requests.get(url.format(category, page), headers=header)
#     # print(url.format(category, page))
#     return BeautifulSoup(response.text, 'html.parser')

# for ctg in category_list : # category 변경

#     soup = connectUrl(naver_url)
#     len_page = len(soup.select('.paging > a')) + 1

#     for page in range(1, len_page + 1) : # page 변경

#         soup = connectUrl(naver_url, ctg, page)

#         url_tags = soup.select('.newsflash_body > ul > li > dl > dt:nth-child(1) > a')

#         for url_tag in url_tags : # 상세 기사 페이지

#             soup = connectUrl(url_tag.get('href'), ctg, page)

#             title = soup.select_one('#title_area')
#             img = soup.select_one('#img1')
#             content = soup.select_one('#dic_area')
            
#             news_title.append(title.text) if title is not None else news_title.append('')
#             news_content.append(content.text) if content is not None else news_content.append('')
#             news_img.append(img.get('data-src')) if img is not None else news_img.append('')

# print(news_title)