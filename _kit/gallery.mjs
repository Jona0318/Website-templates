// gallery.mjs — genereert de inline galerij-data in index.html uit templates.json
// templates.json is de bron van waarheid; deze data wordt geïnlined zodat de
// galerij ook via dubbelklik (file://) werkt — geen fetch/CORS nodig.
// usage: node _kit/gallery.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const jsonPath = join(ROOT, 'templates.json');
const htmlPath = join(ROOT, 'index.html');

const j = JSON.parse(readFileSync(jsonPath, 'utf8'));
const list = j.templates.slice().sort((a, b) => a.id - b.id);

const rows = list.map((t) => {
  const c = t.card || {};
  const num = t.slug.split('-')[0];                 // displaynummer uit de slug ('01', '101')
  const grad = c.grad || (t.palette || []).slice(0, 2);
  const row = [
    num,                          // 0 displaynummer
    t.slug,                       // 1 slug/map
    c.title || t.name || t.slug,  // 2 kaarttitel
    c.blurb || t.note || '',      // 3 korte omschrijving
    t.tier,                       // 4 tier
    c.emoji || '•',               // 5 emoji
    grad[0] || '#1a1a1a',         // 6 gradient van
    grad[1] || '#333333',         // 7 gradient tot
    c.tags || [],                 // 8 display-tags
    t.scheme || 'dark',           // 9 licht/donker (light | dark | light+dark)
    t.sector || 'algemeen'        // 10 sector
  ];
  return '    ' + JSON.stringify(row);
}).join(',\n');

const block =
  '  /* @gallery:start — GEGENEREERD uit templates.json door _kit/gallery.mjs. NIET handmatig bewerken. */\n' +
  '  var T = [\n' + rows + '\n  ];\n' +
  '  /* @gallery:end */';

let html = readFileSync(htmlPath, 'utf8');
const marked = /[ \t]*\/\* @gallery:start[\s\S]*?\/\* @gallery:end \*\//;
const raw = /[ \t]*var T = \[[\s\S]*?\];/;

if (marked.test(html)) {
  html = html.replace(marked, block);
} else if (raw.test(html)) {
  html = html.replace(raw, block);
} else {
  console.error('FOUT: kon noch markers noch "var T = [...]" vinden in index.html');
  process.exit(1);
}

writeFileSync(htmlPath, html);
console.log('index.html bijgewerkt:', list.length, 'templates uit templates.json gegenereerd.');
