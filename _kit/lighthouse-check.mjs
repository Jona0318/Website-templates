// lighthouse-check.mjs — runs Lighthouse (desktop) against the gallery and the
// premium template previews from a tiny built-in static server, and fails (exit 1)
// if accessibility / best-practices / SEO drop below threshold. Performance is
// reported but never fails the build (it varies per runner). Dependencies:
// lighthouse + chrome-launcher (devDependencies) + a Chrome binary (CHROME_BIN/PATH).
//
//   CHROME_BIN=/path/to/chrome node _kit/lighthouse-check.mjs [page.html ...]
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import { createServer } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.webp': 'image/webp', '.zip': 'application/zip' };

const THRESHOLDS = { accessibility: 0.95, 'best-practices': 0.9, seo: 0.9 }; // performance = report-only

const args = process.argv.slice(2);
const pages = args.length ? args : [
  'index.html',
  'templates/156-vesper/index.html',
  'templates/157-seraphine/index.html',
  'templates/158-eclat/index.html',
];

const server = createServer((req, res) => {
  let p = decodeURIComponent((req.url || '/').split('?')[0]);
  if (p.endsWith('/')) p += 'index.html';
  const file = join(ROOT, p);
  if (!file.startsWith(ROOT) || !existsSync(file)) { res.writeHead(404); res.end('not found'); return; }
  try {
    res.writeHead(200, { 'Content-Type': MIME[extname(file)] || 'application/octet-stream' });
    res.end(readFileSync(file));
  } catch { res.writeHead(500); res.end('error'); }
});
await new Promise((r) => server.listen(0, r));
const port = server.address().port;

const chrome = await chromeLauncher.launch({
  chromeFlags: ['--headless=new', '--no-sandbox', '--disable-gpu', '--hide-scrollbars'],
  chromePath: process.env.CHROME_BIN || process.env.CHROME_PATH || undefined,
});

let failures = 0;
try {
  for (const pg of pages) {
    const url = `http://localhost:${port}/${pg}`;
    const result = await lighthouse(url, {
      port: chrome.port,
      output: 'json',
      logLevel: 'error',
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      formFactor: 'desktop',
      screenEmulation: { disabled: true },
      throttlingMethod: 'provided',
    });
    const c = result.lhr.categories;
    const pct = (cat) => Math.round((c[cat].score || 0) * 100);
    const bad = [];
    for (const [cat, min] of Object.entries(THRESHOLDS)) {
      if ((c[cat].score || 0) < min) { bad.push(`${cat} ${pct(cat)}<${min * 100}`); failures++; }
    }
    console.log(`${pg}  perf=${pct('performance')} a11y=${pct('accessibility')} bp=${pct('best-practices')} seo=${pct('seo')}` + (bad.length ? `  ✗ ${bad.join(', ')}` : '  ✓'));
  }
} finally {
  await chrome.kill();
  server.close();
}
console.log(`\nlighthouse: ${pages.length} page(s) · ${failures} threshold failure(s) (performance is report-only)`);
process.exit(failures ? 1 : 0);
