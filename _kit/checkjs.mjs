// checkjs.mjs — syntaxcheck van ALLE inline <script>-blokken in een HTML-bestand.
// Templates hebben er minstens twee: het animatie-opt-in in <head> én de IIFE
// met de echte app-logica onderaan. Controleer ze daarom allemaal, niet alleen
// het eerste blok. usage: node _kit/checkjs.mjs <file>
import fs from 'node:fs';
import { execSync } from 'node:child_process';

const file = process.argv[2];
if (!file) { console.error('usage: node _kit/checkjs.mjs <file>'); process.exit(2); }

const html = fs.readFileSync(file, 'utf8');
// alle inline scripts (zonder src=) met hun positie in het bestand
const blocks = [];
const re = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
let m;
while ((m = re.exec(html)) !== null) {
  if (/\bsrc\s*=/.test(m[1])) { continue; }          // externe scripts overslaan
  const line = html.slice(0, m.index).split('\n').length; // 1-based regelnummer
  blocks.push({ code: m[2], line });
}

if (blocks.length === 0) { console.log('no inline script in', file); process.exit(0); }

let failed = 0;
blocks.forEach((b, i) => {
  const tmp = `${file}.checkjs.${i}.cjs`;
  fs.writeFileSync(tmp, b.code);
  try {
    execSync('node --check ' + JSON.stringify(tmp), { stdio: 'pipe' });
  } catch (e) {
    failed++;
    console.log(`JS ERR ${file} (blok ${i + 1}, regel ~${b.line})`);
    console.log(e.stderr?.toString() || e.message);
  } finally {
    fs.unlinkSync(tmp);
  }
});

if (failed === 0) { console.log(`JS OK ${file} (${blocks.length} blok${blocks.length === 1 ? '' : 'ken'})`); }
process.exit(failed === 0 ? 0 : 1);
