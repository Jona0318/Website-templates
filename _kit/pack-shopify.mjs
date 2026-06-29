// pack-shopify.mjs — bouwt per Shopify-thema een upload-klare downloads/<name>-shopify-theme.zip
// De zip bevat ALLEEN de 7 standaard Online Store 2.0-mappen, ZONDER root-prefix
// (Shopify verwacht config/, layout/, … op de zip-root). Dependency-vrij: Node zlib.
// usage: node _kit/pack-shopify.mjs [naam]   (geen arg = alle thema's)
import { readFileSync, writeFileSync, readdirSync, statSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { deflateRawSync } from 'node:zlib';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const THEMES = join(ROOT, 'shopify-themes');
const OUT = join(ROOT, 'downloads');
const THEME_DIRS = ['assets', 'config', 'layout', 'locales', 'sections', 'snippets', 'templates'];

/* CRC32 */
const CRC = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) { c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1); } t[n] = c >>> 0; }
  return t;
})();
function crc32(buf) {
  let c = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) { c = CRC[(c ^ buf[i]) & 0xFF] ^ (c >>> 8); }
  return (c ^ 0xFFFFFFFF) >>> 0;
}

function walk(dir, base, acc) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) { walk(full, base, acc); }
    else { acc.push({ name: relative(base, full).split('\\').join('/'), data: readFileSync(full) }); }
  }
  return acc;
}

// bouwt een ZIP-buffer; paden staan op de root (geen prefix)
function makeZip(files) {
  const locals = [], central = [];
  let offset = 0;
  for (const f of files) {
    const nameBuf = Buffer.from(f.name);
    const crc = crc32(f.data);
    const comp = deflateRawSync(f.data);
    const lh = Buffer.alloc(30);
    lh.writeUInt32LE(0x04034b50, 0); lh.writeUInt16LE(20, 4); lh.writeUInt16LE(0, 6);
    lh.writeUInt16LE(8, 8); lh.writeUInt16LE(0, 10); lh.writeUInt16LE(0x21, 12);
    lh.writeUInt32LE(crc, 14); lh.writeUInt32LE(comp.length, 18); lh.writeUInt32LE(f.data.length, 22);
    lh.writeUInt16LE(nameBuf.length, 26); lh.writeUInt16LE(0, 28);
    locals.push(lh, nameBuf, comp);
    const ch = Buffer.alloc(46);
    ch.writeUInt32LE(0x02014b50, 0); ch.writeUInt16LE(20, 4); ch.writeUInt16LE(20, 6); ch.writeUInt16LE(0, 8);
    ch.writeUInt16LE(8, 10); ch.writeUInt16LE(0, 12); ch.writeUInt16LE(0x21, 14);
    ch.writeUInt32LE(crc, 16); ch.writeUInt32LE(comp.length, 20); ch.writeUInt32LE(f.data.length, 24);
    ch.writeUInt16LE(nameBuf.length, 28); ch.writeUInt32LE(offset, 42);
    central.push(ch, nameBuf);
    offset += lh.length + nameBuf.length + comp.length;
  }
  const localBuf = Buffer.concat(locals);
  const centralBuf = Buffer.concat(central);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(files.length, 8); eocd.writeUInt16LE(files.length, 10);
  eocd.writeUInt32LE(centralBuf.length, 12); eocd.writeUInt32LE(localBuf.length, 16);
  return Buffer.concat([localBuf, centralBuf, eocd]);
}

const only = process.argv[2];
const names = readdirSync(THEMES).filter((d) => statSync(join(THEMES, d)).isDirectory() && (!only || d === only));
if (only && names.length === 0) { console.error('thema niet gevonden:', only); process.exit(1); }
mkdirSync(OUT, { recursive: true });

let total = 0;
for (const name of names) {
  const files = [];
  for (const sub of THEME_DIRS) {
    const dir = join(THEMES, name, sub);
    if (existsSync(dir)) { walk(dir, join(THEMES, name), files); }
  }
  files.sort((a, b) => a.name.localeCompare(b.name));
  const zip = makeZip(files);
  writeFileSync(join(OUT, name + '-shopify-theme.zip'), zip);
  total += zip.length;
  console.log('wrote downloads/' + name + '-shopify-theme.zip (' + files.length + ' files, ' + (zip.length / 1024).toFixed(0) + ' KB)');
}
console.log(names.length, 'thema(s) gepackt,', (total / 1024 / 1024).toFixed(2), 'MB totaal.');
