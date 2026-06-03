#!/usr/bin/env node
// Print the VISIBLE English slide text of a deck file, to compare two versions.
// Excludes: <style> blocks, <script> blocks, <aside class="notes"> (speaker notes),
// and hidden lang-ka spans. Strips tags, collapses whitespace, one phrase per line.
import { readFileSync } from 'node:fs';

let s = readFileSync(process.argv[2], 'utf8');

// Drop blocks we don't want to compare (CSS, JS, speaker notes)
s = s.replace(/<style[\s\S]*?<\/style>/gi, '');
s = s.replace(/<script[\s\S]*?<\/script>/gi, '');
s = s.replace(/<aside class="notes">[\s\S]*?<\/aside>/gi, '');

// Drop hidden Georgian twins so we compare English only
s = s.replace(/<span class="lang-ka"[^>]*>[\s\S]*?<\/span>/gi, '');

// Keep only the body
const bodyStart = s.indexOf('<body');
if (bodyStart >= 0) s = s.slice(bodyStart);

// Strip all tags, decode a few entities, normalize whitespace per line
s = s.replace(/<[^>]+>/g, '\n');
s = s.replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/&middot;/g, '·').replace(/&mdash;/g, '—');

for (let line of s.split('\n')) {
  line = line.replace(/\s+/g, ' ').trim();
  if (line.length >= 3) console.log(line);
}
