import fs from 'node:fs';

const site='/Users/toko/Desktop/MediMind Landing Page';
const svgData=file=>'data:image/svg+xml;base64,'+fs.readFileSync(`${site}/public/deck-assets/${file}`).toString('base64');
const darkLogo=svgData('logo-horizontal-dark.svg');
const lightLogo=svgData('logo-horizontal-light.svg');
const icon=svgData('logo-icon-light.svg');
const fontData=file=>'data:font/woff2;base64,'+fs.readFileSync(`${site}/node_modules/${file}`).toString('base64');

// Use the site's approved palette, keeping the existing responsive reading layout.
export function brandTheme(layout){
  const palette={
    '#172f37':'#1f2937','#576c71':'#475569','#fffefaee':'#ffffffed','#fffefa':'#ffffff',
    '#d9e3df':'#e2e8f0','#d9f3e4':'#e7f2fc','#175843':'#2b6cb0','#b04e24':'#3182ce',
    '#142f38':'#1a365d','#ffba82':'#bee3f8','#f4f5f0':'#f8fafc','#14644e':'#2b6cb0',
    '#9b4623':'#1a365d','#d56b30':'#3182ce','#e5f2ee':'#f1f5f9','#b6ccc6':'#bee3f8',
    '#bdd6ca':'#bee3f8','#e5eeea':'#e2e8f0','#24434a':'#234875','#a9c2ba':'#b8cbe0',
    '#45605d':'#35577f','#dbf2e5':'#e1effa','#eef2ed':'#f1f5f9','#dce5df':'#cbd5e1',
    '#bccdc5':'#cbd5e1','#bce4cd':'#bee3f8','#deebe5':'#e2e8f0','#bdd3cb':'#cbd5e1',
    '#4b686b':'#456990','#ffcca5':'#bee3f8','#b9cdc5':'#cbd5e1','#e7eee6':'#edf2f9',
    '#eaf4ed':'#edf5fc','#a54723':'#2b6cb0','#507961':'#2b6cb0','#b8d6c4':'#3182ce',
    '#edf4ed':'#edf5fc','#254d3a':'#1a365d','#edf0eb':'#edf2f9','#e9eeea':'#f1f5f9',
    '#edf2ea':'#edf2f9','#174735':'#1a365d','#fbfcf7':'#f8fafc','#f3f5ed':'#eef2f7',
    '#41634d':'#2b6cb0','#1a5540':'#1a365d','#e3f0e2':'#e7f2fc','#315938':'#1a365d',
    '#e7eee3':'#edf2f9','#dfeadc':'#e2edf9','#152824':'#1f2937','#f1f4ec':'#f1f5f9',
    '#14392f':'#1a365d','#254a3a':'#1a365d','#945024':'#2b6cb0'
  };
  const themed=layout.replace(/#[0-9a-f]{6,8}\b/gi,value=>palette[value.toLowerCase()]||value)
    .replaceAll('Georgia,serif','"Fraunces Variable",Georgia,serif')
    .replaceAll('ui-monospace,monospace','"IBM Plex Mono",ui-monospace,monospace');
  return `
/* Embedded font licenses:
${fs.readFileSync(`${site}/node_modules/@fontsource-variable/fraunces/LICENSE`,'utf8')}
${fs.readFileSync(`${site}/node_modules/@fontsource/ibm-plex-mono/LICENSE`,'utf8')}
*/
@font-face{font-family:"Fraunces Variable";font-style:normal;font-weight:100 900;font-display:swap;src:url("${fontData('@fontsource-variable/fraunces/files/fraunces-latin-wght-normal.woff2')}") format("woff2")}
@font-face{font-family:"IBM Plex Mono";font-style:normal;font-weight:400;font-display:swap;src:url("${fontData('@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2')}") format("woff2")}
${themed}
:root{--emr-primary:#1a365d;--emr-secondary:#2b6cb0;--emr-accent:#3182ce;--emr-light-accent:#bee3f8;--emr-gradient-primary:linear-gradient(135deg,#1a365d 0%,#2b6cb0 50%,#3182ce 100%)}
.brand{display:block;line-height:1}.brand img{display:block;width:215px;max-width:100%;height:auto}.sidetitle{font-family:"IBM Plex Mono",monospace;font-size:10px;letter-spacing:1.8px;margin-top:15px}.sidebar{background:linear-gradient(180deg,#1a365d,#122b4b)}
.cover{background:radial-gradient(ellipse at 100% 0%,rgba(49,130,206,.36),transparent 65%),linear-gradient(135deg,#0f1f3a 0%,#1a365d 58%,#2b6cb0 100%);border:1px solid #2b6cb0;box-shadow:0 18px 45px -30px rgba(26,54,93,.65)}
.cover::before{content:"";position:absolute;inset:0;pointer-events:none;background-image:linear-gradient(rgba(190,227,248,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(190,227,248,.035) 1px,transparent 1px);background-size:52px 52px}
.cover>*{position:relative;z-index:1}.cover-brand{margin:0 0 32px}.cover-brand img{display:block;width:255px;max-width:75%;height:auto}.cover-brand .logo-print{display:none}.cover h1{font-weight:450;letter-spacing:-1.8px}.cover h1 em{color:#bee3f8}.eyebrow,.chapter-label,.card small,.navgroup,.stamp{font-family:"IBM Plex Mono",monospace}.eyebrow{font-weight:400;letter-spacing:1.5px}.stat strong{color:#bee3f8;font-variant-numeric:lining-nums}.card{transition:border-color .15s ease,box-shadow .15s ease}.card:hover{box-shadow:0 5px 18px -12px rgba(49,130,206,.6)}
.chapter h1,.chapter h2,.directory-title,.launch-guide h2{color:#1a365d}.chapter-tools button:first-child,#print{background:var(--emr-gradient-primary);border-color:#2b6cb0;color:white;box-shadow:inset 0 0 0 1px rgba(190,227,248,.15)}.chapter-tools button:first-child:hover,#print:hover{background:#2b6cb0}.readingbar{background:var(--emr-gradient-primary)}.launch-guide{margin-top:28px;border:1px solid #cbd5e1;background:white}.footer{border-top:1px solid #e2e8f0;font-family:"IBM Plex Mono",monospace;font-size:10px;letter-spacing:.5px}.navmeta{font-family:"IBM Plex Mono",monospace;font-size:10px}
@media(max-width:800px){.cover-brand{margin-bottom:24px}.cover-brand img{width:205px;max-width:88%}.cover h1{font-size:40px;line-height:1.13;letter-spacing:-1.1px}.cover .eyebrow{font-size:9px;letter-spacing:1px}.stat span{font-size:9px}.brand img{width:210px}}
@media(max-width:360px){.cover{padding:27px 20px}.cover h1{font-size:34px}.stats{grid-template-columns:1.2fr 1fr 1fr;gap:7px}.stat strong{font-size:24px}}
@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}.card{transition:none}}
@media print{.cover{background:#f1f5f9!important;box-shadow:none;border:0}.cover::before{display:none}.cover-brand .logo-screen{display:none}.cover-brand .logo-print{display:block}.cover h1,.cover h1 em,.cover p,.cover .eyebrow,.cover .stamp,.cover .stat strong,.cover .stat span{color:#1a365d}.cover h1{font-size:40pt}}
`;
}

export function brandMarkup(html){
  return html
    .replace('</head>',`<meta name="theme-color" content="#1a365d"><link rel="icon" type="image/svg+xml" href="${icon}"></head>`)
    .replace(/(<a class="brand"[^>]*>)[\s\S]*?<\/a>/,`$1<img src="${darkLogo}" alt="MediMind" width="320" height="80"></a>`)
    .replace('<div class="cover">',`<div class="cover"><div class="cover-brand"><img class="logo-screen" src="${darkLogo}" alt="MediMind" width="320" height="80"><img class="logo-print" src="${lightLogo}" alt="MediMind" width="320" height="80"></div>`)
    .replace('The marketing working library','Marketing playbook')
    .replace('MediMind × B11 / Complete working edition','B11 / MARKETING PLAYBOOK')
    .replace('Every prompt, answered separately. A connected marketing library built around MediMind’s hospital operating system, its buyers, its current evidence and its next stage.','Research, positioning, campaigns and conversion copy for MediMind’s next stage of growth.')
    .replace(/<strong>\d+k<\/strong><span>WORDS OF WORKING MATERIAL<\/span>/,'<strong>138</strong><span>MARKETING SECTIONS</span>')
    .replace(/<span class="statuspill">Working output<\/span>/g,'')
    .replace(/<div class="navmeta">[\s\S]*?<\/div>/,'<div class="navmeta">MediMind · B11<br>September 2026</div>')
    .replace(/<footer class="footer">[\s\S]*?<\/footer>/,'<footer class="footer">MediMind · B11 Marketing Playbook · September 2026</footer>');
}
