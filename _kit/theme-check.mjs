// theme-check.mjs — runs Shopify theme-check over the premium Online Store 2.0
// themes and fails (exit 1) on any ERROR-severity offense. Warnings are printed
// but do not fail the build. Dependency: @shopify/theme-check-node (devDependency).
//
//   node _kit/theme-check.mjs                 # default: vesper seraphine eclat
//   node _kit/theme-check.mjs vesper linea    # explicit theme list
import { themeCheckRun } from '@shopify/theme-check-node';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const themes = args.length ? args : ['vesper', 'seraphine', 'eclat'];

let totalErrors = 0;
let totalWarnings = 0;
for (const t of themes) {
  const root = join(ROOT, 'shopify-themes', t);
  let res;
  try {
    res = await themeCheckRun(root);
  } catch (e) {
    console.log(`  FOUT: theme-check kon ${t} niet draaien — ${e.message}`);
    totalErrors++;
    continue;
  }
  const offenses = res.offenses || [];
  const errors = offenses.filter((o) => o.severity === 0);
  const warnings = offenses.filter((o) => o.severity === 1);
  totalWarnings += warnings.length;
  console.log(`${t}: ${errors.length} error(s), ${warnings.length} warning(s)`);
  for (const o of errors) {
    totalErrors++;
    const file = (o.uri || '').split('/shopify-themes/' + t + '/').pop();
    console.log(`  ERROR  ${file}  ::  ${o.message}`);
  }
}

console.log(`\ntheme-check: ${themes.length} thema('s) · ${totalErrors} fout(en) · ${totalWarnings} waarschuwing(en)`);
process.exit(totalErrors ? 1 : 0);
