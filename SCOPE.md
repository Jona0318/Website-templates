# SCOPE — Workflow-test feature: `template-stats`

## Doel
Een kleine, geïsoleerde test-feature bouwen om de vier-fasen workflow (`/brainstorm` → `/tickets` → `/plan` → `/build`) één keer end-to-end te doorlopen, zonder de bestaande galerij, templates of `_kit/`-pipeline te raken.

## In scope
- Eén nieuw, zelfstandig Node-script: `tools/template-stats.mjs`.
- Het script leest **read-only** `templates.json` in en print een klein overzicht naar stdout:
  - totaal aantal templates
  - aantal templates per `tier` (basis, premium, flagship, signature, aanpasbaar, maatwerk, grafisch, editorial)
  - aantal templates per `sector`
- Script is uitvoerbaar via `node tools/template-stats.mjs` (geen npm-script-koppeling nodig, geen wijziging aan `package.json`).
- Eén klein, hand-matig of script-based sanity-check dat bevestigt dat de output klopt (bijv. som van tier-counts == totaal).
- Eén ticket, minimale scope — puur bedoeld om de workflow te beproeven.

## Non-goals
- Geen wijzigingen aan `index.html`, `templates.json`, `_kit/*`, templates of recipes.
- Geen koppeling aan `npm run check` (`verify`/`html`/`links`/`a11y`) — hoeft niet groen te zijn voor dit ticket.
- Geen UI/HTML-output, geen build-stap, geen persistente output-bestanden.
- Geen git-operaties door de assistent (gebruiker commit zelf, per vaste afspraak).
- Geen uitbreiding naar een "echte" productfeature — dit dient alleen om de workflow te testen.

## Requirements
**Functioneel**
- Script leest `templates.json` vanaf de repo-root (pad relatief t.o.v. het script bepalen, niet t.o.v. CWD).
- Output toont: totaal, per-tier telling, per-sector telling, leesbaar in de terminal (platte tekst of eenvoudige tabel).
- Som van per-tier-tellingen moet gelijk zijn aan het totaal (interne consistentie-check, faalt zichtbaar als dat niet klopt).

**Niet-functioneel**
- Zero dependencies (gebruikt alleen Node's `fs`/`path`, geen npm-package toegevoegd).
- Puur lezend — het script mag nooit `templates.json` of enig ander bestand wijzigen.
- Volledig geïsoleerd: alleen nieuwe bestanden onder `tools/`, geen wijzigingen aan bestaande bestanden.

## Aannames (te bevestigen)
1. `tools/` is een geschikte, nieuwe map naast `_kit/` — er bestaat nog geen `tools/`-map met een andere betekenis.
2. Node-versie: geen specifieke versie-eis; ESM (`type: module` staat al in `package.json`), dus `.mjs` met `import` is consistent met de rest van de repo.
3. "Klein sanity-check" mag een simpele `console.assert` / handmatige `throw` in hetzelfde script zijn — geen apart testframework nodig (er is nu geen test-runner in dit project).
4. Output-formaat is vrij (leesbare tekst in de terminal) — geen vast format vereist door de gebruiker.

## Risico's & open vragen
- **Risico:** vrijwel nihil — het script is puur lezend en geïsoleerd, raakt geen bestaande functionaliteit.
- **Open vraag:** geen; scope is bewust minimaal gehouden zodat de workflow-test niet vastloopt op productbeslissingen.

## Success-criteria
- `tools/template-stats.mjs` bestaat en draait zonder fouten via `node tools/template-stats.mjs`.
- Output toont totaal, tier-verdeling en sector-verdeling die overeenkomen met de data in `templates.json`.
- Interne consistentie-check (som tiers == totaal) slaagt.
- Geen enkel ander bestand in de repo is gewijzigd.
- De vier fases van de workflow (brainstorm → tickets → plan → build) zijn allemaal doorlopen met expliciete goedkeuring bij elke stop-gate.
