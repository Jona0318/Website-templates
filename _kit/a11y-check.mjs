// a11y-check.mjs — runs axe-core (WCAG 2.0/2.1 A & AA) against the gallery and
// the premium template previews via headless Chrome (CDP). Fails (exit 1) on any
// serious/critical violation. Dependency: axe-core (devDependency) + a Chrome/Chromium
// binary at CHROME_BIN / CHROME_PATH (or a sensible default).
//
//   CHROME_BIN=/path/to/chrome node _kit/a11y-check.mjs [page.html ...]
import { spawn } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const axeSrc = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');

const CANDIDATES = [
  process.env.CHROME_BIN,
  process.env.CHROME_PATH,
  '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium-browser',
  '/usr/bin/chromium',
].filter(Boolean);
const CHROME = CANDIDATES.find((p) => existsSync(p));
if (!CHROME) { console.error('FOUT: geen Chrome/Chromium gevonden. Zet CHROME_BIN.'); process.exit(2); }

const args = process.argv.slice(2);
const pages = args.length ? args : [
  'index.html',
  'templates/156-vesper/index.html',
  'templates/157-seraphine/index.html',
  'templates/158-eclat/index.html',
];

const PORT = 9399;
const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${PORT}`, '--disable-gpu', '--hide-scrollbars', '--no-sandbox', '--no-first-run', '--no-default-browser-check', 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let id = 0;
function send(ws, method, params = {}) {
  return new Promise((res) => {
    const i = ++id;
    const on = (ev) => { const m = JSON.parse(ev.data); if (m.id === i) { ws.removeEventListener('message', on); res(m.result); } };
    ws.addEventListener('message', on);
    ws.send(JSON.stringify({ id: i, method, params }));
  });
}

let blocking = 0;
try {
  for (let k = 0; k < 80; k++) { try { await (await fetch(`http://127.0.0.1:${PORT}/json/version`)).json(); break; } catch {} await sleep(150); }
  for (const rel of pages) {
    const fileUrl = 'file://' + join(ROOT, rel);
    const tab = await (await fetch(`http://127.0.0.1:${PORT}/json/new?${encodeURIComponent(fileUrl)}`, { method: 'PUT' })).json();
    const ws = new WebSocket(tab.webSocketDebuggerUrl);
    await new Promise((r) => ws.addEventListener('open', r, { once: true }));
    await send(ws, 'Page.enable'); await send(ws, 'Runtime.enable');
    await send(ws, 'Page.navigate', { url: fileUrl }); await sleep(1800);
    await send(ws, 'Runtime.evaluate', { expression: axeSrc });
    const r = await send(ws, 'Runtime.evaluate', {
      expression: "axe.run(document, {runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa']}}).then(r=>JSON.stringify(r.violations.map(v=>({id:v.id,impact:v.impact,help:v.help,n:v.nodes.length,targets:v.nodes.slice(0,4).map(x=>x.target.join(' '))}))))",
      awaitPromise: true, returnByValue: true,
    });
    const viol = JSON.parse((r.result && r.result.value) || '[]');
    const serious = viol.filter((v) => v.impact === 'serious' || v.impact === 'critical');
    console.log(`\n${rel}`);
    if (!viol.length) console.log('  ✓ 0 violations (WCAG 2.1 A/AA)');
    else viol.forEach((v) => {
      console.log(`  ${v.impact === 'serious' || v.impact === 'critical' ? '✗' : '·'} [${v.impact}] ${v.id} — ${v.help} (${v.n})`);
      v.targets.forEach((t) => console.log('      · ' + t));
    });
    blocking += serious.length;
    await send(ws, 'Target.closeTarget', { targetId: tab.id }).catch(() => {});
    ws.close();
  }
  console.log(`\na11y-check: ${pages.length} page(s) · ${blocking} blocking (serious/critical) violation(s)`);
} catch (e) {
  console.error('FOUT:', e.message); blocking = blocking || 1;
} finally {
  chrome.kill();
  setTimeout(() => process.exit(blocking ? 1 : 0), 300);
}
