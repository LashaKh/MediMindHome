from bs4 import BeautifulSoup
import re

html = open("public/healthycore.html").read()
soup = BeautifulSoup(html, "html.parser")

for text in soup.stripped_strings:
    if len(text) > 3 and not re.search(r'[\u10D0-\u10FF]', text):
        if "function" not in text and "{" not in text and "}" not in text:
            print(repr(text))
