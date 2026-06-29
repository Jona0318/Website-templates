// links.mjs — controleert dat élke interne link en asset-verwijzing in de site
// daadwerkelijk op schijf bestaat. Dependency-vrij; bedoeld voor CI én lokaal.
//
//   node _kit/links.mjs
//
// Gecontroleerd: href/src/srcset/poster/data-* die naar een lokaal pad wijzen,
// plus url(...) in inline <style> en style="". Externe links (http/https),
// anchors (#...), mailto:/tel:/javascript: en data:-URI's worden overgeslagen.
// Exit 1 bij een gebroken verwijzing, anders 0.
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

// Verzamel alle HTML-bestanden die we als bron beschouwen.
function htmlFiles() {
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

// Trek kandidaat-verwijzingen uit een stuk HTML.
function refsFrom(htmlRaw) {
  // <script>-blokken zijn JS, geen HTML-attributen — verwijder ze zodat
  // string-concatenatie als 'previews/' + slug niet als link telt.
  const html = htmlRaw.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  const refs = [];
  const attr = /\b(?:href|src|poster)\s*=\s*("([^"]*)"|'([^']*)')/gi;
  let m;
  while ((m = attr.exec(html))) refs.push(m[2] ?? m[3] ?? '');
  // srcset: kommagescheiden "url descriptor"
  const srcset = /\bsrcset\s*=\s*("([^"]*)"|'([^']*)')/gi;
  while ((m = srcset.exec(html))) {
    const val = m[2] ?? m[3] ?? '';
    for (const part of val.split(',')) {
      const url = part.trim().split(/\s+/)[0];
      if (url) refs.push(url);
    }
  }
  // url(...) in CSS (inline <style> en style="")
  const cssUrl = /url\(\s*(['"]?)([^'")]+)\1\s*\)/gi;
  while ((m = cssUrl.exec(html))) refs.push(m[2]);
  return refs;
}

function isExternal(ref) {
  // %23 is een ge-encode '#': url(#filter)-fragmenten (SVG) tellen als anchor.
  const decoded = ref.replace(/%23/gi, '#');
  return (
    decoded === '' ||
    decoded.startsWith('#') ||
    /^[a-z][a-z0-9+.-]*:/i.test(decoded) // http:, https:, mailto:, tel:, data:, javascript: ...
  );
}

const broken = [];
let checked = 0;

for (const file of htmlFiles()) {
  const abs = join(ROOT, file);
  const html = readFileSync(abs, 'utf8');
  const base = dirname(abs);
  for (const raw of refsFrom(html)) {
    const ref = raw.trim();
    if (isExternal(ref)) continue;
    // strip query/hash
    const clean = ref.split('#')[0].split('?')[0];
    if (!clean) continue;
    const target = clean.startsWith('/')
      ? join(ROOT, clean.slice(1))
      : resolve(base, clean);
    checked++;
    let ok = existsSync(target);
    // map-verwijzingen ("foo/") moeten een index.html bevatten
    if (ok && statSync(target).isDirectory()) {
      ok = existsSync(join(target, 'index.html'));
    }
    if (!ok) broken.push(`${file} → ${ref}`);
  }
}

if (broken.length) {
  console.error(`FOUT: ${broken.length} gebroken interne verwijzing(en):`);
  for (const b of broken) console.error('  ✗ ' + b);
  process.exit(1);
}
console.log(`OK: ${checked} interne verwijzingen gecontroleerd, geen gebroken links.`);
