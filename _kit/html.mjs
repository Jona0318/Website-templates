// html.mjs — dependency-vrije structurele HTML-controle. Vangt de correctheids-
// bugs die een validator markeert en die echt stuk gaan in de browser:
//   · dubbele id-attributen (breekt getElementById, labels, ankers, ARIA)
//   · interne verwijzingen (href="#x", for, aria-labelledby/-describedby/-controls)
//     die naar een niet-bestaande id wijzen
// Voor volledige spec-validatie kun je later html-validate toevoegen; dit is de
// snelle, betrouwbare regressiewacht in de stijl van verify.mjs.
//
//   node _kit/html.mjs
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

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

// Strip <script>/<style>/comments — daar staan geen DOM-id's of -ankers.
function dom(html) {
  return html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '');
}

const errors = [];

for (const file of pages()) {
  const html = dom(readFileSync(join(ROOT, file), 'utf8'));

  // verzamel id's + tel duplicaten
  const ids = new Map();
  for (const m of html.matchAll(/\bid\s*=\s*("([^"]*)"|'([^']*)')/gi)) {
    const id = (m[2] ?? m[3] ?? '').trim();
    if (id) ids.set(id, (ids.get(id) || 0) + 1);
  }
  for (const [id, n] of ids) {
    if (n > 1) errors.push(`${file}: id="${id}" komt ${n}× voor (moet uniek zijn)`);
  }

  // controleer interne verwijzingen naar id's
  const refs = [];
  for (const m of html.matchAll(/\bhref\s*=\s*("#([^"]*)"|'#([^']*)')/gi)) {
    const t = (m[2] ?? m[3] ?? '').trim();
    if (t) refs.push(t); // href="#" (leeg) overslaan
  }
  for (const attr of ['for', 'aria-labelledby', 'aria-describedby', 'aria-controls']) {
    for (const m of html.matchAll(new RegExp(`\\b${attr}\\s*=\\s*("([^"]*)"|'([^']*)')`, 'gi'))) {
      const val = (m[2] ?? m[3] ?? '').trim();
      // labelledby/describedby/controls mogen meerdere id's bevatten
      for (const t of val.split(/\s+/)) if (t) refs.push(t);
    }
  }
  for (const t of refs) {
    if (!ids.has(t)) errors.push(`${file}: verwijzing naar #${t} maar geen element met die id`);
  }
}

if (errors.length) {
  console.error(`FOUT: ${errors.length} structureel HTML-probleem(en):`);
  for (const e of errors) console.error('  ✗ ' + e);
  process.exit(1);
}
console.log(`OK: structurele HTML gecontroleerd op ${pages().length} pagina's (id's uniek, interne ankers kloppen).`);
