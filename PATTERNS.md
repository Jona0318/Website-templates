# PATTERNS.md — bouwblokken-bibliotheek

Doel: één plek met de **herbruikbare patronen** uit de galerij, zodat een nieuwe template bouwen = *kiezen + aanpassen* in plaats van vanaf nul verzinnen. Dit verlaagt de tokenkost: lees dit bestand + [`templates.json`](templates.json) en kopieer gericht uit de genoemde bron-template.

> Conventie geldt voor **premium / flagship / signature** (templates 11–24). De basistemplates (01–10) zijn eenvoudiger.

---

## 0 · Werkwijze voor een nieuwe template (goedkoopste pad)

1. Zoek in `templates.json` de dichtstbijzijnde template op **sector** + **mechanics** + **scheme**.
2. Kopieer dat `index.html` als startpunt.
3. Vervang **palette** (`:root`-variabelen), **fonts** (de Google-Fonts `<link>` + `--font-*`), merknaam, teksten.
4. Voeg/verwijder secties; elke sectie is een zelfstandig `<section class="section">`-blok.
5. Hergebruik de helpers hieronder ongewijzigd (ze zijn defensief en framework-vrij).

Vaste structuur: één zelfstandig `index.html` (CSS in `<style>`, JS in één IIFE onderaan). Alleen `01-business` is multi-page met losse `css/` en `js/`.

---

## 1 · De gedeelde "shell" (skelet van elke premium+ template)

Volgorde in `<body>`: `skip-link` → `scroll-progress` → `intro` → `header` → `menu-overlay` → `main` (secties) → `footer` → `<script>`.

**`:root`-stramien** (altijd aanpassen per template):
```css
:root{
  /* kleuren */ --bg; --tekst; --tekst-zacht; --lijn; --accent; --accent-2;
  /* easing */  --ease:cubic-bezier(.22,1,.36,1); --ease-hard:cubic-bezier(.7,0,.2,1);
  /* fonts */   --font-serif; --font-grotesk; --font-mono;
  /* maat */    --header-h:74px; --gutter:clamp(1.25rem,4.5vw,4.5rem); --maxw:1440px; --radius:18px;
}
@property --ang{ syntax:'<angle>'; inherits:false; initial-value:0deg; } /* voor draaiende conic-randen */
```

Vaste helper-classes: `.container` (max-width + gutter), `.section` (verticale ritme-padding), `.eyebrow` (mono kapitaaltjes-label), `.section-head`, `.btn`/`.btn-primary`/`.btn-ghost`, `.sr-only`, `.dot-pulse`.

Beste complete shell om uit te kopiëren: **23-sterrenwacht** (donker) of **24-atelier** (licht). Voor type-zwaar werk: **21-letterstudio**.

---

## 2 · Animatie opt-in (reduced-motion-veilig) — ALTIJD meenemen

In `<head>`, vóór de CSS. Zonder JS blijft alles zichtbaar (`html.no-anim` houdt eindstaten); animaties komen alleen aan als de gebruiker geen reduced-motion wil.
```html
<html lang="nl" class="js no-anim">
<script>
(function () {
  var h = document.documentElement; h.classList.remove('no-js');
  try { if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches){ h.classList.remove('no-anim'); h.classList.add('anim-ok'); } }
  catch (e) {}
})();
</script>
```
CSS-patroon: standaard = eindstaat zichtbaar; bewegingen onder `html.anim-ok …`. Voorbeeld: `html.anim-ok [data-rv]{opacity:0;transform:translateY(30px);…}` en `.in-view{opacity:1;transform:none}`. Bron: alle 11–24.

---

## 3 · JS-helpers (kopieer 1-op-1; staan in de IIFE)

**Reveal-systeem** (`[data-rv]`, optioneel `data-d` delay):
```js
if (root.classList.contains('anim-ok') && 'IntersectionObserver' in window) {
  var rvObs = new IntersectionObserver(function (es){ es.forEach(function(en){
    if(en.isIntersecting){ var d=en.target.getAttribute('data-d'); if(d) en.target.style.setProperty('--d',d);
      en.target.classList.add('in-view'); rvObs.unobserve(en.target);} });
  }, { threshold:0.12, rootMargin:'0px 0px -8% 0px' });
  document.querySelectorAll('[data-rv]').forEach(function(el){ rvObs.observe(el); });
}
```

**Eén scroll-rAF-loop** (header + progress + scroll-effecten in één frame):
```js
var ticking=false;
function onScrollFrame(){ ticking=false; updateHeader(); /* + progress, manifest, timeline … */ }
function requestTick(){ if(!ticking){ ticking=true; requestAnimationFrame(onScrollFrame); } }
addEventListener('scroll',requestTick,{passive:true}); addEventListener('resize',requestTick,{passive:true}); onScrollFrame();
```

**Sticky header** hide-on-scroll-down + `is-solid`: zie `updateHeader()` in 19–24.
**Overlay-menu** (`setMenu(open)`: toggelt `is-open`, `aria-hidden`, body-overflow, focus; Esc sluit). Bron: 21–24.

**Generieke slider-binding** (vulkleur + uitlezing + apply):
```js
function bindSlider(input,out,format,apply){ if(!input) return;
  function u(){ var v=parseFloat(input.value); if(isNaN(v))return;
    var mn=parseFloat(input.min)||0, mx=parseFloat(input.max)||100;
    input.style.setProperty('--fill', (mx>mn?((v-mn)/(mx-mn))*100:0).toFixed(1)+'%');
    if(out) out.textContent=format(v); apply(v); }
  input.addEventListener('input',u); u();
}
```
Bron: **21-letterstudio** (font-assen), **24-atelier** (stroomveld-parameters).

**FAQ-accordion** (single-open, `grid-template-rows:0fr→1fr`): `faqList.classList.add('faq-ready')`, klik togglet `.open` + `aria-expanded`. Bron: 19–24.

**Formulier-validatie** (per veld, `.invalid` + succes-overlay `.sent`): regex e-mail `/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/`. Bron: 21, 23, 24.

**Count-up stats** (`[data-target]`, easeOutQuart, start via IO threshold 0.4): bron 19, 23, 24.

**Live klok** (`Intl.DateTimeFormat('nl-NL',{hour,minute,timeZone:'Europe/Amsterdam'})`, `setInterval 30s`): bron 19–24.

**Magnetische knop** (`.js-magnetic`, alleen `pointer:fine` + niet reduced): bron 21, 24.

**3D-tilt** (`[data-tilt]`, lerp naar doelhoek): bron 13, 19, 24.

---

## 4 · Canvas-patroon (signature-niveau, "nog hoger")

Boilerplate dat in elke canvas-template terugkomt — **devicePixelRatio-scaling**, **lazy init via IO**, **pauze bij verborgen tab**, **statische fallback bij reduced-motion**:
```js
var dpr = Math.min(window.devicePixelRatio || 1, 2), W=0, H=0, raf=null;
function resize(){ var r=canvas.getBoundingClientRect(); W=r.width; H=r.height;
  canvas.width=Math.round(W*dpr); canvas.height=Math.round(H*dpr); ctx.setTransform(dpr,0,0,dpr,0,0); }
function loop(t){ draw(t); raf=requestAnimationFrame(loop); }
function ensure(){ if(!reduced && raf===null) raf=requestAnimationFrame(loop); }
function stop(){ if(raf){ cancelAnimationFrame(raf); raf=null; } }
document.addEventListener('visibilitychange',function(){ document.hidden?stop():ensure(); });
// init pas als in beeld (canvas heeft dan afmetingen):
new IntersectionObserver(function(es){ es.forEach(function(en){ if(en.isIntersecting){ resize(); reduced?draw(0):ensure(); io.disconnect(); } }); },{threshold:0.1}).observe(canvas);
```
Deterministische pseudo-random (zodat een seed reproduceerbaar is):
```js
function rng(seed){ var s=seed>>>0; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }
```

Concrete pronkstukken (bron + waar te lenen):
- **Sterrenhemel met parallax + vallende sterren** → 23, IIFE `heroSky()`.
- **Klik-en-verbind sterrenbeeld** (hit-test op dichtstbijzijnde ster, undo/wis/regenereer) → 23, IIFE `builder()`.
- **Maanfase uit datum** (synodische maand 29,530588853; verlichting `(1-cos(2π·fase))/2`; terminator als **scanline-fill**, geen rechte rand) → 23, IIFE `moon()`.
- **Generatief stroomveld** (gelaagd sinus-"noise" → hoek; deeltjes accumuleren; sliders sturen dichtheid/turbulentie/vloei) → 24, IIFE `veld()`.
- **PNG-export** → 24: `canvas.toDataURL('image/png')` + tijdelijke `<a download>`.
- **Generatieve thumbnails** (4 algoritmes: flow / moiré / cirkels / voronoi, elk geseed) → 24, `drawThumb()`.

> Canvas alleen tainten als je géén cross-origin beelden tekent (placeholders zijn nu pure code → `toDataURL` werkt). Teken je Unsplash-beelden op canvas, dan breekt export.

---

## 5 · Toggle-componenten (prijs / modus) — zeer herbruikbaar

`data-<mode>`-attributen op de bedragen, knoppen met `aria-pressed`, korte fade bij wissel (`.switching`). Eén functie `setMode(mode)`. Bron: 03 (maand/jaar), 17 (abonnement), 19/20/21/22/23/24. Kopieer uit **24** (`pakToggle`) of **23** (`tariefToggle`).

---

## 6 · Stijl- en schrijfregels (consistentie = herbruikbaarheid)

- **Taal**: alle UI-teksten in het Nederlands. Verzin een plausibel, fictief NL-merk met echt-ogend adres/telefoon/mail.
- **Plaatsbeelden**: liever pure CSS/canvas-composities dan stockfoto's (zie 21, 24). Gebruik je foto's: Unsplash-URL's als placeholder, vervangbaar via `src`.
- **Toegankelijkheid**: `:focus-visible`, `aria-*` op menu/accordion/toggles, `sr-only` waar nodig, `prefers-reduced-motion` overal gerespecteerd, skip-link.
- **Performance**: één rAF-scrollloop; canvas pauzeert buiten beeld; `passive:true` op scroll/resize/pointer-listeners.
- **Typografie**: meestal serif-display + grotesk-body + mono-labels. Zie `fonts` per template in `templates.json`.
- **Detail-accenten** die de "premium"-look maken: korrel-overlay (SVG-noise, `opacity ~.04`), `dot-pulse` status, conic-gradient rand via `@property --ang`, scroll-progress balk, intro-gordijn (sessie-eenmalig via `sessionStorage`).

---

## 7 · Snelle index van pronkstukken per template

| Mechanic | Beste bron |
|---|---|
| Canvas-sterrenhemel / sterrenbeeld / maanfase | 23 |
| Generatief stroomveld + PNG-export + generatieve thumbnails | 24 |
| Variabel font, editable proeftekst, glyph-raster | 21 |
| Live open-status, sleepbare strip, lightbox (focus-trap) | 22 |
| Bento, 3D-tilt, glasmorfisme, live feed | 13 / 19 |
| Voor/na-slider, zelftekenende SVG | 16 / 19 / 20 |
| Curtain-reveal, boogmaskers, duotone | 14 / 20 |
| Velocity-marquee, schedule-tabs | 18 / 19 |
| Adem-widget, tekenende tijdlijn | 15 |
| Countdown, sprekers/programma | 09 |
| Winkelmand-teller, categorie-filter | 07 / 08 |

Voor het volledige overzicht (sector, kleuren, fonts, secties): **`templates.json`**.
