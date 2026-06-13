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

> Bijna elke sectie accepteert `id` (anker), `eyebrow`, `title` (HTML, mag `<em>`), `intro` en `variant:"alt"` (afwisselende achtergrond). Wissel sectietypes én volgorde af zodat templates structureel verschillen — niet alleen van kleur.

**Hero & koppen**
- **hero** — `{ layout?, eyebrow, title, lead, ctas:[{href,label,primary}], clock?, glyph?, stats:[{value,label}] }`. `layout`: `"left"` (default), `"center"`, `"split"` (tekst + visueel paneel, gebruikt `glyph`), `"media"` (full-bleed gradient-achtergrond).
- **marquee** — `{ items:[...], outline? }` — kinetische tekstband (grote letters).
- **logos** — `{ items:[...], label? }` — lopende logo-/merkenstrip.
- **banner** — `{ title, text, cta:{href,label} }` — accent-CTA-band.
- **cta** — `{ title, text, ctas:[] }`
- **quote** — `{ text(HTML), who, dark? }` — groot statement/citaat.
- **manifest** — `{ eyebrow, text, sign, dark? }` — woorden lichten op bij scroll.

**Inhoud-blokken**
- **features** — `{ layout?, columns?, items:[{icon,title,text}] }`. `layout`: `"cards"` (default grid) of `"rows"` (genummerde editorial-rijen). `columns`: 2/3/4.
- **bento** — `{ items:[{icon,title,text}] }` — asymmetrisch raster (eerste tegel groot).
- **zigzag** — `{ items:[{eyebrow?,title,text,points:[],glyph}] }` — alternerende media/tekst-rijen.
- **split** — `{ eyebrow, title, paragraphs:[], points:[], cta, glyph }` — tekst + paneel.
- **tabs** — `{ id, tabs:[{label,title,text,points:[]}] }` — interactieve tabs (pijltjestoetsen werken).
- **steps** — `{ items:[{num?,title,text}] }` — proces met tekenende lijn.
- **timeline** — `{ items:[{year,title,text}] }` — historie met jaartallen.
- **comparison** — `{ columns:[...], highlight?, rows:[{label,cells:[…|true|false]}] }` — vergelijkingstabel (`true`→✓, `false`→—).

**Bewijs & mensen**
- **showcase** — `{ items:[{tag,glyph,title,meta}] }` — werk/case-tegels (3D-tilt, hue-variatie).
- **gallery** — `{ items:[{glyph,tag}] }` — masonry-tegels.
- **team** — `{ items:[{name,role}] }` — personen (initialen-avatar).
- **testimonials** — `{ items:[{quote,name,role,stars?}] }` — quote-kaarten.
- **stats** — `{ items:[{target,suffix?,label}] }` — accent-band, telt op.
- **metrics** — `{ eyebrow?, title?, items:[{target,suffix?,label}] }` — lichte cijfers-variant (geen band), telt op.

**Conversie**
- **pricing** — `{ note?, modes?:[{key,label}], plans:[{name,voor,prijs,per,features:[],featured?,badge?,cta}] }`. Mét `modes` (2) worden `prijs`/`per` objecten per mode → toggle; zonder `modes` zijn het strings.
- **faq** — `{ items:[{q,an}] }`
- **contact** — `{ dark?, submit, successTitle, successText, fields:[{name,label,type,required?,half?,placeholder?,options?,error?}] }`
- **custom** — `{ html }` — ruwe HTML voor unieke/bespoke secties. Combineer met `customCss`/`customJs` (of `customCssFile`/`customJsFile`).

### Voorbeeldcomposities (zelfde kit, andere opzet)
- *Studio (licht)*: hero `split` → logos → zigzag → showcase → steps → metrics → testimonials → pricing → faq → cta → contact
- *Agency (donker)*: hero `center` → marquee → showcase → quote → tabs → stats → team → testimonials → pricing → faq → contact
- *Product/SaaS*: hero `media` → features → steps → comparison → split → metrics → pricing → faq → banner → contact

## Werkwijze (goedkoopste pad)
1. Kopieer een bestaand recept dat qua sector dichtbij ligt.
2. Pas `theme`, `fonts`, `brand`, teksten en sectiekeuze aan.
3. Voor iets unieks: voeg een `custom`-sectie + `customCss`/`customJs` toe.
4. `node _kit/build.mjs <recept>.json` → registreer in `index.html`, `templates.json`, `README.md` → screenshot.

> Voor signature-pronkstukken (canvas e.d.) blijft losse, hand-geschreven `templates/NN/index.html` prima — niet alles hoeft via een recept. De generator is voor het herhaalbare 70%.
