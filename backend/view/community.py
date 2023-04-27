import requests
from bs4 import BeautifulSoup

header = {'User-Agent':'Mozilla/5.0'}
news_title = []
news_content = []

for page in range(1, 3) :

    daum_url = f'https://news.daum.net/breakingnews/digital?page={page}'

    response = requests.get(daum_url, headers=header)

    soup = BeautifulSoup(response.text, 'html.parser')

    url_tags = soup.select('.list_allnews > li > div > strong > a')

    for url_tag in url_tags :
        url = url_tag.get('href')

        response = requests.get(url, headers=header)

        soup = BeautifulSoup(response.text, 'html.parser')

        title = soup.select('.tit_view')[0].text
        content = soup.select('.article_view')[0].text.replace('\n', ' ')

        news_title.append(title)
        news_content.append(content)

print(news_title)