// build.mjs — vouwt een recept uit tot een zelfstandig templates/<slug>/index.html
// usage: node _kit/build.mjs recipes/25-makelaar.json   (of: node _kit/build.mjs all)
// De pure assemblage zit in ./assemble.mjs (gedeeld met de browser-personalizer).
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { assemble } from './assemble.mjs';

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dir, '..');

export function build(recipePath) {
  const r = JSON.parse(readFileSync(recipePath, 'utf8'));
  const coreCss = readFileSync(join(__dir, 'core.css'), 'utf8');
  const coreJs = readFileSync(join(__dir, 'core.js'), 'utf8');
  // sidecar custom CSS/JS (handiger dan inline in JSON voor grotere blokken)
  if (r.customCssFile) { r.customCss = (r.customCss || '') + '\n' + readFileSync(join(ROOT, r.customCssFile), 'utf8'); }
  if (r.customJsFile) { r.customJs = (r.customJs || '') + '\n' + readFileSync(join(ROOT, r.customJsFile), 'utf8'); }

  const html = assemble(r, coreCss, coreJs);

  const outDir = join(ROOT, 'templates', r.slug);
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, 'index.html');
  writeFileSync(outPath, html);
  return { outPath, lines: html.split('\n').length };
}

// CLI
const arg = process.argv[2];
if (arg) {
  if (arg === 'all') {
    const dir = join(ROOT, 'recipes');
    readdirSync(dir).filter((f) => f.endsWith('.json') && !f.startsWith('_')).forEach((f) => {
      const res = build(join(dir, f));
      console.log('built', res.outPath, '(' + res.lines + ' regels)');
    });
  } else {
    const res = build(arg.startsWith('recipes') || arg.includes('/') || arg.includes('\\') ? arg : join(ROOT, 'recipes', arg));
    console.log('built', res.outPath, '(' + res.lines + ' regels)');
  }
}
