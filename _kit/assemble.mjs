// assemble.mjs — pure (browser-veilige) HTML-assemblage van een recept.
// Geen node-imports: zowel _kit/build.mjs (server) als de browser-personalizer
// (studio.html) gebruiken assemble() zodat er één bron van waarheid is.
import { sections } from './sections.mjs';

const a = (s) => String(s == null ? '' : s);
const attr = (s) => a(s).replace(/"/g, '&quot;');

export function buildHeader(r) {
  const nav = r.nav || [];
  const links = nav.map((n) => `<li><a href="${attr(n.href)}">${a(n.label)}</a></li>`).join('');
  const cta = r.headerCta ? `<a class="btn btn-primary btn-cta-text js-magnetic" href="${attr(r.headerCta.href)}">${a(r.headerCta.label)}</a>` : '';
  const mark = r.brand.mark || a(r.brand.name).trim().charAt(0);
  return `<header class="header" id="header">
  <div class="container header-bar">
    <a class="brand" href="#top" aria-label="${attr(r.brand.name)} — naar boven">
      <span class="mark" aria-hidden="true">${a(mark)}</span>
      <span>${a(r.brand.name)}<small>${a(r.brand.tagline || '')}</small></span>
    </a>
    <nav class="header-nav" aria-label="Hoofdmenu">
      <ul class="header-links">${links}</ul>
      <div class="header-actions">
        ${cta}
        <button class="menu-toggle" id="menuToggle" type="button" aria-expanded="false" aria-controls="menuOverlay" aria-label="Menu openen"><span></span><span></span></button>
      </div>
    </nav>
  </div>
</header>`;
}

export function buildMenu(r) {
  const nav = r.nav || [];
  const items = nav.map((n, i) => `<li><a href="${attr(n.href)}"><span class="idx">${('0' + (i + 1)).slice(-2)}</span>${a(n.label)}</a></li>`).join('');
  const b = r.brand;
  // adres linkt naar de contact-sectie; recepten mogen die anders noemen (bv. "praktisch")
  const contact = (r.sections || []).find((s) => s.use === 'contact');
  const contactHref = '#' + (contact?.id || (contact?.data && contact.data.id) || 'contact');
  return `<div class="menu-overlay" id="menuOverlay" aria-hidden="true" role="dialog" aria-modal="true" aria-label="Navigatie">
  <button class="menu-overlay__close" id="menuClose" type="button" aria-label="Menu sluiten"></button>
  <div class="container">
    <ul class="menu-list">${items}</ul>
    <div class="menu-foot">
      ${b.email ? `<a href="mailto:${attr(b.email)}">${a(b.email)}</a>` : ''}
      ${b.tel ? `<a href="tel:${attr((b.tel || '').replace(/[^+\d]/g, ''))}">${a(b.tel)}</a>` : ''}
      ${b.address ? `<a href="${attr(contactHref)}">${a(b.address)}</a>` : ''}
    </div>
  </div>
</div>`;
}

export function buildFooter(r) {
  const b = r.brand;
  const f = r.footer || {};
  const cols = (f.columns || []).map((c) => `<div class="footer-col"><h3>${a(c.title)}</h3><ul>${(c.links || []).map((l) => `<li><a href="${attr(l.href)}">${a(l.label)}</a></li>`).join('')}</ul></div>`).join('');
  return `<footer class="footer ${f.dark ? 'dark' : ''}" aria-label="Footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <a class="brand" href="#top" aria-label="${attr(b.name)}"><span class="mark" aria-hidden="true">${a(b.mark || a(b.name).charAt(0))}</span><span>${a(b.name)}<small>${a(b.tagline || '')}</small></span></a>
        <p>${a(f.blurb || '')}</p>
      </div>
      ${cols}
    </div>
    <div class="footer-bottom">
      <span>&copy; <span data-year>2026</span> ${a(b.name)}${f.bottom ? ' — ' + a(f.bottom) : ''}</span>
      <a class="naar-boven" href="#top">Naar boven <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M8 14V2M3 7l5-5 5 5"/></svg></a>
    </div>
  </div>
</footer>`;
}

export function buildThemeCss(r) {
  const t = r.theme || {};
  const fonts = r.fonts || {};
  const lines = Object.entries(t).map(([k, v]) => `${k}:${v};`);
  if (fonts.serif) lines.push(`--font-serif:"${fonts.serif}",Georgia,serif;`);
  if (fonts.grotesk) lines.push(`--font-grotesk:"${fonts.grotesk}","Helvetica Neue",Arial,sans-serif;`);
  if (fonts.mono) lines.push(`--font-mono:"${fonts.mono}",ui-monospace,monospace;`);
  return `:root{${lines.join('')}}`;
}

// Bouwt de volledige, zelfstandige HTML. `r.customCss`/`r.customJs` moeten al
// als string aanwezig zijn (sidecar-bestanden vooraf ingeladen door de caller).
export function assemble(r, coreCss, coreJs) {
  const ctx = { brand: r.brand || {} };
  const body = (r.sections || []).map((s) => {
    const fn = sections[s.use];
    if (!fn) throw new Error(`Onbekende sectie: "${s.use}"`);
    // De sectie-wrapper is {use, id, data}: hijs een id op de wrapper door naar
    // de data, zodat <section id="..."> klopt en de nav-ankers werken.
    const data = s.data
      ? (s.id != null && s.data.id == null ? { ...s.data, id: s.id } : s.data)
      : s;
    return fn(data, ctx);
  }).join('\n');

  const meta = r.meta || {};
  return `<!DOCTYPE html>
<html lang="nl" class="js no-anim">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${a(meta.title || r.title)}</title>
${meta.description ? `<meta name="description" content="${attr(meta.description)}">` : ''}
${meta.themeColor ? `<meta name="theme-color" content="${attr(meta.themeColor)}">` : ''}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
${r.fonts?.googleHref ? `<link href="${attr(r.fonts.googleHref)}" rel="stylesheet">` : ''}
<script>
(function(){var h=document.documentElement;h.classList.remove('no-js');try{if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){h.classList.remove('no-anim');h.classList.add('anim-ok');}}catch(e){}})();
</script>
<style>
${coreCss}
${buildThemeCss(r)}
${r.customCss || ''}
</style>
</head>
<body id="top">
<a class="skip-link" href="#main">Direct naar inhoud</a>
<div class="scroll-progress" id="scrollProgress" aria-hidden="true"></div>
<div class="intro" id="intro" aria-hidden="true"><b>${a(r.brand.name)}</b><span>${a(r.brand.tagline || r.title)}</span></div>
${buildHeader(r)}
${buildMenu(r)}
<main id="main">
${body}
</main>
${buildFooter(r)}
<script>
${coreJs}
</script>
${r.customJs ? `<script>\n${r.customJs}\n</script>` : ''}
</body>
</html>
`;
}
