import re
html = open("public/healthycore.html").read()

# Let's find any text that isn't inside a span, script, style, or tag
# But wait, it's easier to check what's new. I'll print the first 20 lines of the body.
body = html[html.find('<body>'):]
print(body[:1000])

