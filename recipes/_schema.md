# Recept-formaat

Een recept is één JSON-bestand in `recipes/` dat `_kit/build.mjs` uitvouwt tot een **zelfstandig** `templates/<slug>/index.html` (core.css + core.js worden ingelined — geen runtime-dependency).

Bouwen: `node _kit/build.mjs 25-makelaar.json` (of `node _kit/build.mjs all`).
Screenshot: `node _kit/shot.mjs "file:///G:/template/templates/25-makelaar/index.html" "G:/template/screenshots/25-makelaar.png"`.

## Top-level velden
| veld | uitleg |
|---|---|
| `id`, `slug`, `title`, `sector`, `scheme` | metadata (zoals in `templates.json`) |
| `meta` | `{ title, description, themeColor }` |
| `theme` | object met `:root`-overrides (semantische tokens, zie hieronder). Voor donkere sites: zet `--bg`, `--ink`, `--surface`, `--line*` donker. |
| `fonts` | `{ googleHref, serif, grotesk, mono }` |
| `brand` | `{ name, tagline, email, tel, address, mark? }` — `mark` is optioneel (anders eerste letter) |
| `nav` | `[ { href, label } ]` (vult desktop-links én overlay-menu) |
| `headerCta` | `{ href, label }` |
| `sections` | geordende lijst `[ { use, id?, data } ]` |
| `footer` | `{ blurb, bottom, dark?, columns:[ { title, links:[ {href,label} ] } ] }` |
| `customCss`, `customJs` | optioneel — eigen CSS/JS ingelined ná de core (escape hatch) |

## Thema-tokens (uit core.css; overschrijf in `theme`)
`--bg --bg-2 --surface --ink --muted --faint --line --line-strong --accent --accent-2 --accent-soft --on-accent` en de donkere paneel-set `--dark-bg --dark-surface --dark-ink --dark-muted --dark-line`. Plus `--radius`.

## Beschikbare secties (`use`)
- **hero** — `{ eyebrow, title(HTML), lead, ctas:[{href,label,primary}], clock?, stats:[{value,label}] }`
- **features** — `{ eyebrow, title, intro, variant?, items:[{icon,title,text}] }`
- **split** — `{ eyebrow, title, paragraphs:[], points:[], cta:{href,label}, glyph, variant? }`
- **stats** — `{ items:[{target,suffix?,label}] }` (telt op in beeld)
- **pricing** — `{ eyebrow, title, intro, note?, modes?:[{key,label}], plans:[{name,voor,prijs,per,features:[],featured?,badge?,cta}] }`. Mét `modes` (2 stuks) wordt `prijs`/`per` een object per mode → toggle. Zonder `modes` zijn het strings.
- **faq** — `{ eyebrow, title, intro, items:[{q,an}] }`
- **contact** — `{ eyebrow, title, intro, dark?, submit, successTitle, successText, fields:[{name,label,type,required?,half?,placeholder?,options?,error?}] }`
- **manifest** — `{ eyebrow, text, sign, dark? }` (woorden lichten op bij scroll)
- **cta** — `{ title, text, ctas:[] }`
- **custom** — `{ html }` — ruwe HTML voor unieke/bespoke secties (bijv. een canvas-pronkstuk). Combineer met `customCss`/`customJs`.

## Werkwijze (goedkoopste pad)
1. Kopieer een bestaand recept dat qua sector dichtbij ligt.
2. Pas `theme`, `fonts`, `brand`, teksten en sectiekeuze aan.
3. Voor iets unieks: voeg een `custom`-sectie + `customCss`/`customJs` toe.
4. `node _kit/build.mjs <recept>.json` → registreer in `index.html`, `templates.json`, `README.md` → screenshot.

> Voor signature-pronkstukken (canvas e.d.) blijft losse, hand-geschreven `templates/NN/index.html` prima — niet alles hoeft via een recept. De generator is voor het herhaalbare 70%.
