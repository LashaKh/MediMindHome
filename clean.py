import re

def clean_html(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        html = f.read()

    # Remove the language toggle button block
    # It has <div style="position:absolute; top:40px; right:40px; ...">...</div><style>...</style><script>...</script>
    toggle_regex = r'<div style="position:absolute; top:40px; right:40px;.*?<script>document\.body\.classList\.add\(\'lang-active-en\'\);</script>\n*'
    html = re.sub(toggle_regex, '', html, flags=re.DOTALL)

    # We also have the Georgian Text Fitting Rules inside a <style> block, which got corrupted.
    # Let's remove the entire Georgian Text Fitting Rules block.
    # The block might be inside the main <style> or a separate one.
    # Looking at my previous code, it was inside the existing <style> tag.
    # Let's remove everything from /* Georgian Text Fitting Rules */ to the end of the style tag, or up to the </style>.
    # Actually, the replacement just inserted it into the <style>.
    # Let's just strip out all `span.lang-ka` tags and unwrap `span.lang-en` tags globally first to fix the CSS.
    html = re.sub(r'<span class="lang-ka"[^>]*>.*?</span>', '', html, flags=re.DOTALL)
    html = re.sub(r'<span class="lang-en">(.*?)</span>', r'\1', html, flags=re.DOTALL)

    # Let's also remove the Georgian Text Fitting Rules block from CSS cleanly:
    html = re.sub(r'\s*/\* Georgian Text Fitting Rules \*/.*?(?=</style>)', '\n', html, flags=re.DOTALL)

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(html)

clean_html("public/healthycore.html")
