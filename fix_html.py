import re

with open("public/healthycore.html", "r", encoding="utf-8") as f:
    html = f.read()

# Remove all lang-ka spans and their contents
html = re.sub(r'<span class="lang-ka"[^>]*>.*?</span>', '', html, flags=re.DOTALL)
# Remove all lang-en span tags (keeping their contents)
html = re.sub(r'<span class="lang-en"[^>]*>', '', html)
html = html.replace('</span>', '')

# BUT wait! What if there are legit <span> tags?
# Let's count them before we do this.
