import re
import html

content = open("public/healthycore.html").read()

# We only care about text inside the body
body_match = re.search(r'<body>(.*?)</body>', content, re.DOTALL | re.IGNORECASE)
if not body_match:
    print("No body found")
    exit()

body = body_match.group(1)

# Remove script and style tags
body = re.sub(r'<script.*?>.*?</script>', '', body, flags=re.DOTALL | re.IGNORECASE)
body = re.sub(r'<style.*?>.*?</style>', '', body, flags=re.DOTALL | re.IGNORECASE)
# Remove comments
body = re.sub(r'<!--.*?-->', '', body, flags=re.DOTALL)

# Extract text not in tags
texts = re.split(r'<[^>]+>', body)
for t in texts:
    t = html.unescape(t.strip())
    # If the text has letters and no Georgian letters
    if re.search(r'[A-Za-z]', t) and not re.search(r'[\u10D0-\u10FF]', t):
        if len(t) > 2 and 'var ' not in t and 'Reveal.' not in t and 'ENG' not in t:
            print(repr(t))

