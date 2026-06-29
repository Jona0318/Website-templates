// verify.mjs — bewaakt de invarianten die de galerij & site consistent houden.
// Draait dependency-vrij en is bedoeld voor CI én lokaal vóór een commit.
//
//   node _kit/verify.mjs
//
// Errors (exit 1): structurele gaten die de site breken — een template uit
//   templates.json zonder map, een ontbrekende download-zip, een recept zonder
//   bijbehorende template, of niet-parsebare JSON.
// Warnings (exit 0): kwaliteitsgaten die de site niet breken — een ontbrekende
//   preview-afbeelding (kaart valt terug op een leeg vlak) of een wees-bestand
//   in previews/ of downloads/ zonder entry in templates.json.
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const warnings = [];
const err = (msg) => errors.push(msg);
const warn = (msg) => warnings.push(msg);

// 1 · templates.json parsebaar
let data;
try {
  data = JSON.parse(readFileSync(join(ROOT, 'templates.json'), 'utf8'));
} catch (e) {
  console.error('FOUT: templates.json is niet parsebaar —', e.message);
  process.exit(1);
}
const templates = data.templates || [];
const slugSet = new Set(templates.map((t) => t.slug));

// 2 · alle recepten parsebaar
const recipeDir = join(ROOT, 'recipes');
const recipeFiles = readdirSync(recipeDir).filter((f) => f.endsWith('.json') && !f.startsWith('_'));
for (const f of recipeFiles) {
  try { JSON.parse(readFileSync(join(recipeDir, f), 'utf8')); }
  catch (e) { err(`recipes/${f} is niet parsebaar — ${e.message}`); }
}

// 3 · per template: map, index.html, download-zip, preview
for (const t of templates) {
  const slug = t.slug;
  if (!slug) { err(`template id ${t.id ?? '?'} mist een slug`); continue; }

  const tplDir = join(ROOT, 'templates', slug);
  if (!existsSync(join(tplDir, 'index.html'))) {
    err(`templates/${slug}/index.html ontbreekt`);
  }

  // download: expliciete override (bv. Shopify) of de conventie downloads/<slug>.zip
  const dl = t.download || ('downloads/' + slug + '.zip');
  if (!existsSync(join(ROOT, dl))) {
    err(`download ontbreekt voor ${slug}: ${dl}`);
  }

  if (!existsSync(join(ROOT, 'previews', slug + '.jpg'))) {
    warn(`preview ontbreekt: previews/${slug}.jpg (kaart toont geen voorbeeld)`);
  }
}

// 4 · elk recept-slug heeft een bijbehorende template
for (const f of recipeFiles) {
  const slug = f.replace(/\.json$/, '');
  if (!slugSet.has(slug)) {
    warn(`recept recipes/${f} heeft geen entry in templates.json (slug ${slug})`);
  }
  if (!existsSync(join(ROOT, 'templates', slug, 'index.html'))) {
    err(`recept recipes/${f} verwijst naar ontbrekende templates/${slug}/index.html`);
  }
}

// 5 · wees-bestanden: previews/zips zonder entry in templates.json
const dlOverrides = new Set(templates.map((t) => t.download).filter(Boolean).map((p) => p.replace(/^downloads\//, '')));
for (const file of readdirSync(join(ROOT, 'previews')).filter((f) => f.endsWith('.jpg'))) {
  if (!slugSet.has(file.replace(/\.jpg$/, ''))) { warn(`wees-preview zonder template: previews/${file}`); }
}
for (const file of readdirSync(join(ROOT, 'downloads')).filter((f) => f.endsWith('.zip'))) {
  const base = file.replace(/\.zip$/, '');
  if (!slugSet.has(base) && !dlOverrides.has(file)) { warn(`wees-download zonder template: downloads/${file}`); }
}

// rapport
for (const w of warnings) { console.log('  WAARSCHUWING:', w); }
for (const e of errors) { console.log('  FOUT:', e); }
console.log(
  `\nverify: ${templates.length} templates · ${recipeFiles.length} recepten · ` +
  `${errors.length} fout(en) · ${warnings.length} waarschuwing(en)`
);
process.exit(errors.length ? 1 : 0);
