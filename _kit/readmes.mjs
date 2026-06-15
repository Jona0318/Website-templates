// readmes.mjs — genereert een README.md per template uit templates.json
// zodat elke map zelfstandig bruikbaar is. usage: node _kit/readmes.mjs
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const j = JSON.parse(readFileSync(join(ROOT, 'templates.json'), 'utf8'));

const TIERS = {
  basis: 'Basis', premium: 'Premium', flagship: 'Flagship', signature: 'Signature',
  aanpasbaar: 'Aanpasbaar', maatwerk: 'Maatwerk', grafisch: 'Grafisch', editorial: 'Editorieel'
};
const SCHEME = { light: 'licht', dark: 'donker', 'light+dark': 'licht én donker' };
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

let n = 0;
for (const t of j.templates) {
  const dir = join(ROOT, 'templates', t.slug);
  if (!existsSync(dir)) { continue; }
  const c = t.card || {};
  const blurb = c.blurb || t.note || '';
  const mech = (t.mechanics || []).length ? '\n- **Technieken:** ' + t.mechanics.join(', ') : '';
  const fonts = (t.fonts || []).length ? '\n- **Lettertypen:** ' + t.fonts.join(', ') : '';
  const md =
`# ${c.title || t.name || t.slug}

${blurb}

- **Tier:** ${TIERS[t.tier] || t.tier}
- **Sector:** ${cap(t.sector || 'algemeen')}
- **Sfeer:** ${SCHEME[t.scheme] || t.scheme}${fonts}${mech}

## Gebruiken

Open \`index.html\` rechtstreeks in je browser — geen build-tools of dependencies nodig.
Een lokale server werkt ook: \`python -m http.server\` of \`npx serve\`.

Dit bestand maakt deel uit van de [Template Galerij](../../index.html).

## Licentie

MIT — zie [LICENSE](../../LICENSE) in de hoofdmap.
`;
  writeFileSync(join(dir, 'README.md'), md);
  n++;
}
console.log('README.md gegenereerd voor', n, 'templates.');
