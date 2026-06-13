# Template Galerij — 24 kant-en-klare websites

Een verzameling van **24 complete, responsive website-templates**, elk met een eigen stijl — waaronder **9 premium designs** met volledige animatie-choreografie, **twee flagships** die de beste features uit de hele galerij combineren (donker: Studio Kaap, licht: Buitenplaats) en **vier signature-templates** met dieper uitgewerkte interactiviteit. De twee nieuwste signatures zetten de stap naar **echte `<canvas>`-rendering**: een live animerende sterrenhemel met een maanfase berekend uit de datum, en een generatief stroomveld dat de bezoeker zelf stuurt en als PNG kan downloaden. Pure HTML/CSS/JavaScript — **geen build-tools of dependencies nodig**.

Open `index.html` in je browser voor de **overzichtspagina**, en klik door naar elke template.

## 🗂️ De templates

| # | Map | Type | Bijzonderheden |
|---|---|---|---|
| 01 | `templates/01-business/` | Bedrijf / Corporate | **Meerdere pagina's** (home, over, diensten, contact, 404), dark mode, prijzen, FAQ |
| 02 | `templates/02-portfolio/` | Portfolio | Donker, creatief, projectgrid |
| 03 | `templates/03-saas/` | SaaS / Software | Prijzen met maand/jaar-schakelaar, FAQ-accordion |
| 04 | `templates/04-restaurant/` | Restaurant | Menu, galerij, reserveringsformulier |
| 05 | `templates/05-agency/` | Agency / Studio | Grote typografie, cases, statistieken |
| 06 | `templates/06-blog/` | Blog / Magazine | Uitgelicht artikel, artikelgrid, nieuwsbrief |
| 07 | `templates/07-webshop/` | Webshop | Productgrid, categorieën, werkende winkelmand-teller |
| 08 | `templates/08-fotografie/` | Fotografie | Minimalistische galerij met categorie-filter |
| 09 | `templates/09-event/` | Event / Congres | Countdown-timer, sprekers, programma, tickets |
| 10 | `templates/10-cv/` | CV / Resumé | One-page CV met animerende vaardigheidsbalken |
| 11 | `templates/11-architectuur/` | ★ Architectuur Studio | Preloader, parallax, scroll-gedreven manifest, magnetische knop |
| 12 | `templates/12-hotel/` | ★ Boutique Hotel | Boekingsbalk, gouden details, quote-carrousel, Ken Burns-hero |
| 13 | `templates/13-fintech/` | ★ Fintech / Bank | 3D-tilt bankpas, live transactiefeed, bento-grid, glasmorfisme |
| 14 | `templates/14-fashion/` | ★ Fashion / Maison | Curtain-reveal, asymmetrisch grid, lookbook met scroll-snap |
| 15 | `templates/15-wellness/` | ★ Wellness / Spa | Adem-widget, boogmaskers, tekenende tijdlijn, serene animaties |
| 16 | `templates/16-bouw/` | ★ ZZP Metselaar | Zwart/blauw/grijs blueprint-stijl, zelftekenende troffel-SVG, voor/na-slider, projectfilter |
| 17 | `templates/17-koffie/` | ★ Koffiebranderij | Crème/karamel-huisstijl, stoom-animaties, brandgraad-meters, zelftekenende procestijdlijn, abonnement-toggle |
| 18 | `templates/18-gym/` | ★ Boxing Gym | Zwart/acid-geel, knallende stapeltypografie, dubbele kinetische marquee, duotone-foto's, lesrooster-tabs met ARIA |
| 19 | `templates/19-studio/` | ✦ **Flagship** — Studio Kaap | Combineert de sterkste features: preloader, scroll-gedreven manifest, bento-grid, 3D-tilt, voor/na-slider, tekenende tijdlijn, snelheidsreactieve marquee, FAQ-accordion, live studioklok, filmkorrel, duotone-team, prijs-toggle, carrousel |
| 20 | `templates/20-buitenplaats/` | ✦ **Flagship** — Buitenplaats | De lichte, serif-gedreven tegenpool: curtain-reveal, boogmaskers, meeschuivende hover-previews bij diensten, projectfilter, schets-naar-tuin-slider, seizoenstijdlijn, groene duotones, FAQ, live klok, papierkorrel |
| 21 | `templates/21-letterstudio/` | ✦ **Signature** — Letterstudio | Paars/lila (#6260ff · #e4e4ff) interactief specimen-lab: bewerkbaar proefwoord + sliders, scroll-morfend variabel font met live wght/opsz-uitlezing, glyph-raster met reuze-preview, licentie-toggle, vier pure CSS-showcases (geen stockfoto's) |
| 22 | `templates/22-museum/` | ✦ **Signature** — Museum KADE | Blauw/zachtroze (#3447aa · #fbeaeb): live open-status berekend uit openingstijden, sleepbare collectiestrook met scroll-snap, volwaardige lightbox (focus-trap, Esc, pijlen), agenda, tarieven, vrienden-tiers, tickets-banner |
| 23 | `templates/23-sterrenwacht/` | ✦ **Signature** — Sterrenwacht Meridiaan | Nachtblauw/goud (#070b18 · #f0b94c): **canvas-sterrenhemel** met depth-parallax, twinkeling en vallende sterren; **bouw-je-eigen-sterrenbeeld** door sterren te verbinden (undo/wis/nieuwe hemel); **maanfase live berekend** uit de datum (synodische maand) en correct getekend op canvas; hemel-vanavond-panelen, agenda, tarief-toggle, FAQ, reserveringsformulier |
| 24 | `templates/24-atelier/` | ✦ **Signature** — Atelier Ruis | Papier/ultramarijn (#f4f1ea · #1b29ff): live **stroomveld-canvas** als pronkstuk — stuur dichtheid, turbulentie en vloei met sliders, kies uit vier paletten en **download je compositie als PNG**; elke werk-thumbnail is een eigen generatief programma (flow, moiré, cirkels, voronoi); scroll-oplichtend manifest, tekenende proces-tijdlijn, pakket-toggle, FAQ, contact |

> ★ = premium template: volledige animatie-choreografie (entrance, scroll-reveals, parallax, micro-interacties), no-JS fallback en `prefers-reduced-motion`-ondersteuning.
> ✦ = flagship/signature: het hoogste niveau in de galerij. De signatures 23–24 gebruiken bovendien echte canvas-rendering met `requestAnimationFrame`, dpr-scaling en pauze buiten beeld / bij verborgen tab.

## 📁 Structuur

```
template/
├── index.html              <- galerij / overzichtspagina
├── README.md
└── templates/
    ├── 01-business/        <- meerdere pagina's + losse css/ en js/
    │   ├── index.html, about.html, services.html, contact.html, 404.html
    │   ├── css/style.css
    │   └── js/main.js
    ├── 02-portfolio/index.html
    ├── 03-saas/index.html
    ├── 04-restaurant/index.html
    ├── 05-agency/index.html
    ├── 06-blog/index.html
    ├── 07-webshop/index.html
    ├── 08-fotografie/index.html
    ├── 09-event/index.html
    └── 10-cv/index.html
```

> Template 01 (Bedrijf) bestaat uit meerdere pagina's met losse CSS/JS-bestanden.
> Templates 02 t/m 18 zijn elk **één zelfstandig `index.html`-bestand** (CSS en JS inline) — makkelijk te kopiëren en hergebruiken.

## 🚀 Lokaal bekijken

Dubbelklik `index.html`, of start een lokale server voor de beste ervaring:

```bash
# Python
python -m http.server 8000

# Node
npx serve
```

Open daarna `http://localhost:8000`.

## 🎨 Aanpassen

- Elke template gebruikt **CSS-variabelen** bovenaan (`:root { ... }`) voor kleuren — pas die aan voor een eigen kleurstelling.
- Vervang placeholdernamen, teksten en afbeeldingen door je eigen content.
- Afbeeldingen zijn placeholders van Unsplash; vervang de `src`-URL's door eigen beelden.
- Formulieren tonen demo-meldingen; koppel je eigen backend/endpoint om ze echt te laten versturen.

Alle templates zijn responsive (mobiel/tablet/desktop) en bevatten standaard onderdelen zoals een navigatie met mobiel menu, secties, knoppen en een footer.
