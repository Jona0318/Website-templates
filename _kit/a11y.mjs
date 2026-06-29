// a11y.mjs — lichtgewicht, dependency-vrije toegankelijkheids-linter die de
// invarianten bewaakt waar de a11y-sweep op heeft gestuurd. Géén volledige
// WCAG-audit (gebruik daarvoor axe/pa11y), maar een snelle regressiewacht.
//
//   node _kit/a11y.mjs            # alle pagina's
//   node _kit/a11y.mjs --strict   # warnings tellen ook als fout (exit 1)
//
// Errors (exit 1): structurele basis die altijd hoort te kloppen —
//   ontbrekend <html lang>, lege/ontbrekende <title>, geen viewport-meta,
//   een <img> zonder alt-attribuut.
// Warnings (exit 0, tenzij --strict): zachtere signalen — geen of meerdere
//   <h1>, of een knop/link zonder toegankelijke naam.
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const STRICT = process.argv.includes('--strict');

function pages() {
  const out = ['index.html', 'studio.html'];
  const tdir = join(ROOT, 'templates');
  if (existsSync(tdir)) {
    for (const d of readdirSync(tdir)) {
      const p = join('templates', d, 'index.html');
      if (existsSync(join(ROOT, p))) out.push(p);
    }
  }
  return out;
}

// HTML met <script>/<style>/<svg>/comments gestript — voor tekst- en naamchecks.
function stripped(html) {
  return html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi, ' '); // SVG's zijn aria-hidden iconen
}

const hasAttr = (tag, name) => new RegExp(`\\b${name}\\s*=`, 'i').test(tag);
const attrVal = (tag, name) => {
  const m = tag.match(new RegExp(`\\b${name}\\s*=\\s*("([^"]*)"|'([^']*)')`, 'i'));
  return m ? (m[2] ?? m[3] ?? '') : null;
};

const errors = [];
const warnings = [];

for (const file of pages()) {
  const html = readFileSync(join(ROOT, file), 'utf8');
  const err = (m) => errors.push(`${file}: ${m}`);
  const warn = (m) => warnings.push(`${file}: ${m}`);

  // 1 · <html lang>
  const htmlTag = (html.match(/<html\b[^>]*>/i) || [''])[0];
  const lang = attrVal(htmlTag, 'lang');
  if (!lang || !lang.trim()) err('<html> mist een (gevuld) lang-attribuut');

  // 2 · <title>
  const title = (html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i) || [])[1];
  if (!title || !title.trim()) err('lege of ontbrekende <title>');

  // 3 · viewport-meta
  if (!/<meta\b[^>]*name\s*=\s*["']viewport["'][^>]*>/i.test(html))
    err('ontbrekende <meta name="viewport">');

  // 4 · elke <img> heeft een alt-attribuut (mag leeg zijn voor decoratief)
  let imgNoAlt = 0;
  for (const m of html.matchAll(/<img\b[^>]*>/gi)) {
    if (!hasAttr(m[0], 'alt')) imgNoAlt++;
  }
  if (imgNoAlt) err(`${imgNoAlt} <img> zonder alt-attribuut`);

  // 5 · precies één <h1> (warning)
  const h1 = (html.match(/<h1\b/gi) || []).length;
  if (h1 === 0) warn('geen <h1> gevonden');
  else if (h1 > 1) warn(`${h1} <h1>-elementen (verwacht 1)`);

  // 6 · knoppen/links met een toegankelijke naam (warning)
  const s = stripped(html);
  let unnamed = 0;
  for (const re of [/<a\b[^>]*>([\s\S]*?)<\/a>/gi, /<button\b[^>]*>([\s\S]*?)<\/button>/gi]) {
    for (const m of s.matchAll(re)) {
      const tag = m[0].slice(0, m[0].indexOf('>') + 1);
      // een <a> zonder href is geen link/control maar een anker-target → overslaan
      if (/^<a\b/i.test(tag) && !hasAttr(tag, 'href')) continue;
      const text = m[1].replace(/<[^>]*>/g, '').replace(/&[a-z#0-9]+;/gi, ' ').trim();
      const named =
        text.length > 0 ||
        attrVal(tag, 'aria-label') ||
        attrVal(tag, 'aria-labelledby') ||
        attrVal(tag, 'title') ||
        hasAttr(tag, 'aria-hidden');
      if (!named) unnamed++;
    }
  }
  if (unnamed) warn(`${unnamed} link(s)/knop(pen) zonder toegankelijke naam`);
}

for (const w of warnings) console.warn('  ⚠ ' + w);
if (errors.length) {
  console.error(`\nFOUT: ${errors.length} toegankelijkheidsprobleem(en):`);
  for (const e of errors) console.error('  ✗ ' + e);
  process.exit(1);
}
const tail = warnings.length ? ` (${warnings.length} warning(s))` : '';
if (STRICT && warnings.length) {
  console.error(`\n--strict: ${warnings.length} warning(s) als fout behandeld.`);
  process.exit(1);
}
console.log(`OK: a11y-basis gecontroleerd op ${pages().length} pagina's${tail}.`);
