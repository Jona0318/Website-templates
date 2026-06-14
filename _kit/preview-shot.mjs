// Capture 760x475 JPEG hero-crop previews (matches existing previews/*.jpg).
// Usage: node _kit/preview-shot.mjs <slug> [<slug> ...]
import { spawn } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = 9345;
const ROOT = resolve(process.cwd());
const slugs = process.argv.slice(2);
const W = 1440, H = 900, SCALE = 760 / 1440; // -> 760x475 output
const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${PORT}`, '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1', '--force-prefers-reduced-motion', `--window-size=${W},${H}`, '--no-first-run', '--no-default-browser-check', 'about:blank'], { stdio: 'ignore' });
const sleep = ms => new Promise(r => setTimeout(r, ms));
let id = 0;
function send(ws, method, params = {}) { return new Promise(res => { const i = ++id; const on = ev => { const m = JSON.parse(ev.data); if (m.id === i) { ws.removeEventListener('message', on); res(m.result); } }; ws.addEventListener('message', on); ws.send(JSON.stringify({ id: i, method, params })); }); }
try {
  for (let k = 0; k < 40; k++) { try { await (await fetch(`http://127.0.0.1:${PORT}/json/version`)).json(); break; } catch {} await sleep(150); }
  for (const slug of slugs) {
    const fileUrl = 'file:///' + join(ROOT, 'templates', slug, 'index.html').replace(/\\/g, '/');
    const tab = await (await fetch(`http://127.0.0.1:${PORT}/json/new?${encodeURIComponent(fileUrl)}`, { method: 'PUT' })).json();
    const ws = new WebSocket(tab.webSocketDebuggerUrl); await new Promise(r => ws.addEventListener('open', r, { once: true }));
    await send(ws, 'Page.enable'); await send(ws, 'Runtime.enable');
    await send(ws, 'Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: false });
    await send(ws, 'Page.navigate', { url: fileUrl }); await sleep(2600);
    await send(ws, 'Runtime.evaluate', { expression: 'window.scrollTo(0,0)' }); await sleep(500);
    const shot = await send(ws, 'Page.captureScreenshot', { format: 'jpeg', quality: 82, clip: { x: 0, y: 0, width: W, height: H, scale: SCALE } });
    const out = join(ROOT, 'previews', slug + '.jpg');
    writeFileSync(out, Buffer.from(shot.data, 'base64')); console.log('wrote', out, Buffer.from(shot.data, 'base64').length + 'B');
    await send(ws, 'Target.closeTarget', { targetId: tab.id }).catch(() => {});
    ws.close();
  }
} catch (e) { console.error('ERR', e.message); } finally { chrome.kill(); setTimeout(() => process.exit(0), 300); }
