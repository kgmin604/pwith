import requests
from bs4 import BeautifulSoup

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