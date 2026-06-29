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
import { sections as sectionRenderers } from './sections.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const __dir = dirname(fileURLToPath(import.meta.url));
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

// 2 · alle recepten parsebaar (geparste objecten bewaren voor veldvalidatie)
const recipeDir = join(ROOT, 'recipes');
const recipeFiles = readdirSync(recipeDir).filter((f) => f.endsWith('.json') && !f.startsWith('_'));
const recipes = new Map(); // bestandsnaam → geparst object
for (const f of recipeFiles) {
  try { recipes.set(f, JSON.parse(readFileSync(join(recipeDir, f), 'utf8'))); }
  catch (e) { err(`recipes/${f} is niet parsebaar — ${e.message}`); }
}

// 2b · veldvalidatie van recepten (dependency-vrij; spiegelt _kit/recipe.schema.json)
const VALID_USE = new Set(Object.keys(sectionRenderers));
const VALID_SCHEME = new Set(['light', 'dark', 'light+dark']);
const KNOWN_TOP = new Set([
  '$schema', 'id', 'slug', 'title', 'sector', 'scheme', 'meta', 'theme',
  'fonts', 'brand', 'nav', 'headerCta', 'sections', 'footer',
  'customCss', 'customJs', 'customCssFile', 'customJsFile',
]);
const byId = new Map(templates.map((t) => [t.id, t]));
const bySlug = new Map(templates.map((t) => [t.slug, t]));

for (const [f, r] of recipes) {
  const at = `recipes/${f}`;
  // verplichte velden + types
  if (!Number.isInteger(r.id)) err(`${at}: 'id' ontbreekt of is geen geheel getal`);
  if (typeof r.slug !== 'string' || !r.slug) err(`${at}: 'slug' ontbreekt`);
  if (typeof r.title !== 'string' || !r.title) err(`${at}: 'title' ontbreekt`);
  if (typeof r.sector !== 'string' || !r.sector) err(`${at}: 'sector' ontbreekt`);
  if (!VALID_SCHEME.has(r.scheme)) err(`${at}: 'scheme' moet light | dark | light+dark zijn (kreeg ${JSON.stringify(r.scheme)})`);
  if (!r.brand || typeof r.brand.name !== 'string' || !r.brand.name) err(`${at}: 'brand.name' ontbreekt`);
  if (!Array.isArray(r.sections) || r.sections.length === 0) {
    err(`${at}: 'sections' ontbreekt of is leeg`);
  } else {
    r.sections.forEach((s, i) => {
      if (!s || typeof s !== 'object') { err(`${at}: sectie[${i}] is geen object`); return; }
      if (!s.use) err(`${at}: sectie[${i}] mist 'use'`);
      else if (!VALID_USE.has(s.use)) err(`${at}: sectie[${i}] gebruikt onbekend type '${s.use}' (zie _kit/sections.mjs)`);
    });
  }
  // onbekende top-level sleutels → waarschijnlijk een typefout
  for (const k of Object.keys(r)) {
    if (!KNOWN_TOP.has(k)) warn(`${at}: onbekende sleutel '${k}' (typefout? niet in recipe.schema.json)`);
  }
  // bestandsnaam ↔ slug
  if (r.slug && f !== `${r.slug}.json`) warn(`${at}: bestandsnaam komt niet overeen met slug '${r.slug}'`);
  // consistentie met templates.json (id/slug/scheme/sector op twee plekken)
  const t = bySlug.get(r.slug);
  if (t) {
    if (t.id !== r.id) err(`${at}: id ${r.id} ≠ templates.json id ${t.id} voor slug '${r.slug}'`);
    // 'light+dark' in de galerij = toggle-template; recept bouwt vanuit één basis (light óf dark) → toegestaan
    if (t.scheme !== 'light+dark' && t.scheme !== r.scheme) err(`${at}: scheme '${r.scheme}' ≠ templates.json '${t.scheme}' voor '${r.slug}'`);
    if (t.sector !== r.sector) warn(`${at}: sector '${r.sector}' ≠ templates.json '${t.sector}' voor '${r.slug}'`);
  } else if (byId.has(r.id) && byId.get(r.id).slug !== r.slug) {
    err(`${at}: id ${r.id} hoort in templates.json bij slug '${byId.get(r.id).slug}', niet '${r.slug}'`);
  }
}

// 2c · het schema-enum mag niet stilletjes afwijken van de echte dispatcher
try {
  const schema = JSON.parse(readFileSync(join(__dir, 'recipe.schema.json'), 'utf8'));
  const schemaUses = new Set(schema.properties?.sections?.items?.properties?.use?.enum || []);
  for (const u of VALID_USE) if (!schemaUses.has(u)) err(`recipe.schema.json mist sectietype '${u}' dat _kit/sections.mjs wél kent`);
  for (const u of schemaUses) if (!VALID_USE.has(u)) err(`recipe.schema.json noemt sectietype '${u}' dat _kit/sections.mjs niet (meer) kent`);
} catch (e) {
  err(`recipe.schema.json niet leesbaar/parsebaar — ${e.message}`);
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
