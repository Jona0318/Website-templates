// seo.mjs — genereert sitemap.xml + robots.txt uit templates.json (+ recipes/).
// usage: node _kit/seo.mjs   (optioneel: BASE_URL als 1e argument)
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BASE = (process.argv[2] || 'https://template-rh4.pages.dev').replace(/\/+$/, '');

const data = JSON.parse(readFileSync(join(ROOT, 'templates.json'), 'utf8'));
const templates = data.templates || [];
const lastmod = data.generated || new Date().toISOString().slice(0, 10);

// recept-slugs = templates die in de Studio personaliseerbaar zijn
const recipeSlugs = readdirSync(join(ROOT, 'recipes'))
  .filter((f) => f.endsWith('.json') && !f.startsWith('_'))
  .map((f) => f.replace(/\.json$/, ''));

const urls = [];
const add = (loc, priority) => urls.push({ loc: BASE + loc, priority });

add('/', '1.0');
add('/studio.html', '0.8');
recipeSlugs.forEach((slug) => add('/studio.html?t=' + slug, '0.6'));
templates.forEach((t) => add('/' + (t.path || ('templates/' + t.slug + '/')).replace(/^\/+/, ''), '0.7'));

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>
    <loc>${u.loc.replace(/&/g, '&amp;')}</loc>
    <lastmod>${lastmod}</lastmod>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;

const robots = `User-agent: *
Allow: /

Sitemap: ${BASE}/sitemap.xml
`;

writeFileSync(join(ROOT, 'sitemap.xml'), xml);
writeFileSync(join(ROOT, 'robots.txt'), robots);
console.log('sitemap.xml geschreven:', urls.length, 'URLs · robots.txt geschreven · base', BASE);
