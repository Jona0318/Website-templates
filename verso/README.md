# Verso — narrative analytics landingspagina

Een één-pagina landingspagina voor het fictieve product **Verso**: _de
briefing-laag voor je datastack_. Elke ochtend zet Verso je metrics om in een
geschreven briefing die je hele team leest.

Editorial-tech art direction, gebouwd rond `#6260FF` (indigo) en `#E4E4FF`
(lila). Eén bold signature-moment — **data wordt tekst** — de rest rustig en
gedisciplineerd.

## Stack

- **Vite + React + TypeScript** (strict)
- **motion** (Framer Motion) voor scroll-gekoppelde reveals
- **lenis** voor smooth scroll (uitgeschakeld bij `prefers-reduced-motion`)
- Self-hosted fonts via `@fontsource`: **Fraunces** (display), **Hanken
  Grotesk** (body/UI), **JetBrains Mono** (labels/data)

## Het signature-moment

In de hero staan links de ruwe signalen (cijfers + sparklines). Op scroll
dimmen die en vormt zich rechts — woord voor woord, gekoppeld aan de
scroll-voortgang — de geschreven ochtendbriefing. Letterlijk: data → typografie.

- Desktop: scroll-gestuurd via `useScroll` / `useTransform` in een sticky hero.
- Mobiel: compacte gestapelde variant (signalen boven, briefing onder) met een
  ingetogen reveal.
- `prefers-reduced-motion`: meteen de eindstaat, zonder animatie.

## Toegankelijkheid

WCAG 2.1 AA-contrast, volledige toetsenbordbediening (nav, mobiel menu, FAQ-
accordion, CTA's), zichtbare `focus-visible`-ring, skip-link, correcte
koppenhiërarchie en gerespecteerde reduced-motion.

## Ontwikkelen

```bash
npm install
npm run dev      # dev-server
npm run build    # type-check + productiebuild
npm run preview  # bekijk de build
```

## Structuur

```
src/
  styles/        tokens.css · globals.css · app.css
  lib/           useLenis · useMediaQuery · Reveal · MagneticButton
  components/    Nav · Hero · Signature · Sparkline · Problem · HowItWorks ·
                 Features · Briefing · SocialProof · Impact · Pricing · Faq ·
                 FinalCta · Footer
  content.ts     alle Nederlandse copy op één plek
  App.tsx
```
