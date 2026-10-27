import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const dictionary = JSON.parse(read('scripts/hospitals-i18n/ru.json'));
const normalize = value => value.replace(/\s+/g, ' ').trim();
const keys = new Set(Object.keys(dictionary).map(normalize));
const missing = new Set();
const check = value => { if (!keys.has(normalize(value))) missing.add(normalize(value)); };
const checkMarkup = source => {
  for (const match of source.replace(/<!--[\s\S]*?-->/g, '').matchAll(/<(span|text|tspan)\b[^>]*class="[^"]*\blang-en\b[^"]*"[^>]*>([\s\S]*?)<\/\1>/g)) { if (!match[2].includes('${')) check(match[2]); }
};
checkMarkup(read('public/hospitals.html'));
for (const file of fs.readdirSync(path.join(root, 'public/deck-assets')).filter(name => name.startsWith('hospitals-') && name.endsWith('.js') && name !== 'hospitals-russian.js')) {
  const source = read('public/deck-assets/' + file);
  checkMarkup(source);
  const ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
  function visit(node) {
    if (ts.isArrayLiteralExpression(node) && node.elements.length === 2 && node.elements.every(ts.isStringLiteralLike) && /[ა-ჰ]/.test(node.elements[1].text)) check(node.elements[0].text);
    if (ts.isCallExpression(node) && ['t', 'copy'].includes(node.expression.getText(ast)) && node.arguments.length && ts.isStringLiteralLike(node.arguments[0])) check(node.arguments[0].text);
    ts.forEachChild(node, visit);
  }
  visit(ast);
}
if (missing.size) { console.error('Missing Russian translations:', [...missing]); process.exitCode = 1; }
else console.log(`PASS: static slide, template and generated bilingual copy covered by ${keys.size} Russian entries.`);
// Generated assets must match a rebuild without introducing a new change.
