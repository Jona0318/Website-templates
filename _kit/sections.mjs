// Sectie-bibliotheek: elke functie krijgt (data, ctx) en geeft HTML terug.
// ctx = { brand:{name,tagline,email,tel,address}, idx:<auto> }
// Voeg hier nieuwe sectietypes toe; recepten verwijzen ernaar via "use".

const a = (s) => String(s == null ? '' : s);
const attr = (s) => a(s).replace(/"/g, '&quot;');
const list = (x) => Array.isArray(x) ? x : [];

function ctas(items = []) {
  if (!items.length) return '';
  return `<div class="hero-cta">${items.map((c) =>
    `<a class="btn ${c.primary ? 'btn-primary' : 'btn-ghost'} js-magnetic" href="${attr(c.href || '#')}">${a(c.label)}${c.primary ? `
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M2 8h12M9 3l5 5-5 5"/></svg>` : ''}</a>`).join('')}</div>`;
}

const pad = (n) => ('0' + n).slice(-2);

export const sections = {
  hero(d = {}) {
    const layout = d.layout || 'left';
    const strip = list(d.stats).length
      ? `<div class="hero-strip">${list(d.stats).map((s) => `<div class="hero-stat"><b>${a(s.value)}</b><span>${a(s.label)}</span></div>`).join('')}
          ${d.clock ? `<div class="hero-stat" style="margin-left:auto"><b><span data-clock>--:--</span></b><span>${a(d.clock)}</span></div>` : ''}</div>`
      : '';
    const copy = `${d.eyebrow ? `<p class="eyebrow">${a(d.eyebrow)}</p>` : ''}
    <h1>${a(d.title)}</h1>
    ${d.lead ? `<p class="hero-lead">${a(d.lead)}</p>` : ''}
    ${ctas(d.ctas)}
    ${strip}`;
    if (layout === 'split') {
      return `<section class="hero hero--split" id="${attr(d.id || 'top')}" aria-label="Introductie">
  <div class="container">
    <div class="hero-copy">${copy}</div>
    <div class="hero-visual" data-tilt aria-hidden="true"><span class="glyph">${a(d.glyph || '◆')}</span></div>
  </div>
</section>`;
    }
    const cls = layout === 'center' ? 'hero hero--center' : layout === 'media' ? 'hero hero--media hero--center' : 'hero';
    return `<section class="${cls}" id="${attr(d.id || 'top')}" aria-label="Introductie">
  <div class="container">
    ${copy}
  </div>
</section>`;
  },

  features(d = {}) {
    const head = `<div class="section-head" data-rv>
      ${d.eyebrow ? `<p class="eyebrow">${a(d.eyebrow)}</p>` : ''}
      <h2>${a(d.title)}</h2>
      ${d.intro ? `<p>${a(d.intro)}</p>` : ''}
    </div>`;
    const body = d.layout === 'rows'
      ? `<div class="feature-rows">
      ${list(d.items).map((it, i) => `<div class="feature-row" data-rv>
        <span class="rnum">${pad(i + 1)}</span>
        <h3>${a(it.title)}</h3>
        <p>${a(it.text)}</p>
      </div>`).join('')}
    </div>`
      : `<div class="feature-grid ${d.columns === 2 ? 'cols-2' : d.columns === 4 ? 'cols-4' : ''}">
      ${list(d.items).map((it, i) => `<article class="feature" data-rv ${i ? `data-d=".${i * 7}s"` : ''}>
        ${it.icon ? `<span class="ico" aria-hidden="true">${a(it.icon)}</span>` : ''}
        <h3>${a(it.title)}</h3>
        <p>${a(it.text)}</p>
      </article>`).join('')}
    </div>`;
    return `<section class="section ${d.variant === 'alt' ? 'section--alt' : ''}" ${d.id ? `id="${attr(d.id)}"` : ''} aria-label="${attr(d.eyebrow || 'Diensten')}">
  <div class="container">
    ${head}
    ${body}
  </div>
</section>`;
  },

  showcase(d = {}) {
    return `<section class="section ${d.variant === 'alt' ? 'section--alt' : ''}" ${d.id ? `id="${attr(d.id)}"` : ''} aria-label="${attr(d.title || 'Werk')}">
  <div class="container">
    <div class="section-head" data-rv>
      ${d.eyebrow ? `<p class="eyebrow">${a(d.eyebrow)}</p>` : ''}
      <h2>${a(d.title)}</h2>
      ${d.intro ? `<p>${a(d.intro)}</p>` : ''}
    </div>
    <div class="showcase-grid">
      ${list(d.items).map((it, i) => `<article class="showcase-item" data-rv ${i ? `data-d=".${i * 6}s"` : ''}>
        <div class="showcase-thumb" data-tilt aria-hidden="true">${it.tag ? `<span class="tag">${a(it.tag)}</span>` : ''}<span class="glyph">${a(it.glyph || '◆')}</span></div>
        <div class="showcase-cap"><h3>${a(it.title)}</h3><span>${a(it.meta || '')}</span></div>
      </article>`).join('')}
    </div>
  </div>
</section>`;
  },

  steps(d = {}) {
    return `<section class="section ${d.variant === 'alt' ? 'section--alt' : ''}" ${d.id ? `id="${attr(d.id)}"` : ''} aria-label="${attr(d.title || 'Werkwijze')}">
  <div class="container">
    <div class="section-head" data-rv>
      ${d.eyebrow ? `<p class="eyebrow">${a(d.eyebrow)}</p>` : ''}
      <h2>${a(d.title)}</h2>
      ${d.intro ? `<p>${a(d.intro)}</p>` : ''}
    </div>
    <div class="steps">
      <div class="steps-rail" aria-hidden="true"></div>
      <div class="steps-line" data-timeline-line aria-hidden="true"></div>
      ${list(d.items).map((it, i) => `<div class="step" data-rv><div class="snum">${a(it.num || ('Stap ' + pad(i + 1)))}</div><h3>${a(it.title)}</h3><p>${a(it.text)}</p></div>`).join('')}
    </div>
  </div>
</section>`;
  },

  quote(d = {}) {
    return `<section class="section ${d.dark ? 'dark' : (d.variant === 'alt' ? 'section--alt' : '')}" ${d.id ? `id="${attr(d.id)}"` : ''} aria-label="Citaat">
  <div class="container">
    <div class="quote-block" data-rv>
      <p>${a(d.text)}</p>
      ${d.who ? `<p class="who">${a(d.who)}</p>` : ''}
    </div>
  </div>
</section>`;
  },

  testimonials(d = {}) {
    return `<section class="section ${d.variant === 'alt' ? 'section--alt' : ''}" ${d.id ? `id="${attr(d.id)}"` : ''} aria-label="${attr(d.title || 'Wat klanten zeggen')}">
  <div class="container">
    <div class="section-head" data-rv>
      ${d.eyebrow ? `<p class="eyebrow">${a(d.eyebrow)}</p>` : ''}
      <h2>${a(d.title)}</h2>
      ${d.intro ? `<p>${a(d.intro)}</p>` : ''}
    </div>
    <div class="testi-grid">
      ${list(d.items).map((it, i) => `<figure class="testi" data-rv ${i ? `data-d=".${i * 7}s"` : ''}>
        <div class="stars" aria-hidden="true">${a(it.stars || '★★★★★')}</div>
        <blockquote>${a(it.quote)}</blockquote>
        <figcaption class="who"><span class="av" aria-hidden="true">${a((it.name || '?').trim().charAt(0))}</span><span><b>${a(it.name)}</b><span>${a(it.role || '')}</span></span></figcaption>
      </figure>`).join('')}
    </div>
  </div>
</section>`;
  },

  logos(d = {}) {
    const items = list(d.items);
    const row = items.map((x) => `<span>${a(x)}</span>`).join('');
    return `<div class="logos" aria-label="${attr(d.label || 'Vertrouwd door')}">
  <div class="logos-track" aria-hidden="true">${row}${row}</div>
</div>`;
  },

  split(d = {}) {
    return `<section class="section ${d.variant === 'alt' ? 'section--alt' : ''}" ${d.id ? `id="${attr(d.id)}"` : ''} aria-label="${attr(d.title || 'Over')}">
  <div class="container split">
    <div data-rv>
      ${d.eyebrow ? `<p class="eyebrow">${a(d.eyebrow)}</p>` : ''}
      <h2 style="font-family:var(--font-serif);font-weight:500;font-size:clamp(1.9rem,4.4vw,3.1rem);letter-spacing:-.015em;margin:1rem 0 1rem">${a(d.title)}</h2>
      ${list(d.paragraphs).map((p) => `<p class="muted" style="margin-bottom:1rem">${a(p)}</p>`).join('')}
      ${list(d.points).length ? `<ul>${list(d.points).map((p) => `<li>${a(p)}</li>`).join('')}</ul>` : ''}
      ${d.cta ? ctas([{ ...d.cta, primary: true }]) : ''}
    </div>
    <div class="split-panel" data-rv data-d=".1s" data-tilt aria-hidden="true"><span class="glyph">${a(d.glyph || '◆')}</span></div>
  </div>
</section>`;
  },

  stats(d = {}) {
    return `<section class="stats section" aria-label="In cijfers">
  <div class="container stats-grid">
    ${list(d.items).map((s) => `<div class="stat"><div class="num"><span data-target="${attr(s.target)}">0</span>${s.suffix ? `<sup>${a(s.suffix)}</sup>` : ''}</div><div class="lab">${a(s.label)}</div></div>`).join('')}
  </div>
</section>`;
  },

  pricing(d = {}) {
    const hasToggle = list(d.modes).length === 2;
    const gid = (d.id || 'prijzen') + '-grid';
    return `<section class="section ${d.variant === 'alt' ? 'section--alt' : ''}" ${d.id ? `id="${attr(d.id)}"` : ''} aria-label="${attr(d.title || 'Tarieven')}">
  <div class="container">
    <div class="section-head center" data-rv>
      ${d.eyebrow ? `<p class="eyebrow">${a(d.eyebrow)}</p>` : ''}
      <h2>${a(d.title)}</h2>
      ${d.intro ? `<p>${a(d.intro)}</p>` : ''}
    </div>
    ${hasToggle ? `<div class="price-toggle-wrap" data-rv>
      <div class="price-toggle" data-toggle-group="${attr(gid)}" role="group" aria-label="Tarieftype">
        ${d.modes.map((m, i) => `<button type="button" data-mode="${attr(m.key)}" aria-pressed="${i === 0 ? 'true' : 'false'}">${a(m.label)}</button>`).join('')}
      </div>
    </div>` : ''}
    <div class="price-grid" id="${attr(gid)}">
      ${list(d.plans).map((p, i) => `<div class="price-card${p.featured ? ' price-card--featured' : ''}" data-rv ${i ? `data-d=".${i * 8}s"` : ''}>
        ${p.badge ? `<span class="price-badge">${a(p.badge)}</span>` : ''}
        <h3>${a(p.name)}</h3>
        <p class="p-voor">${a(p.voor)}</p>
        <div class="price-prijs">
          <span class="bedrag" data-toggle-value ${hasToggle ? d.modes.map((m) => `data-${attr(m.key)}="${attr(p.prijs[m.key])}"`).join(' ') : ''}>${a(hasToggle ? p.prijs[d.modes[0].key] : p.prijs)}</span>
          <span class="per" data-toggle-value ${hasToggle ? d.modes.map((m) => `data-${attr(m.key)}="${attr(p.per[m.key])}"`).join(' ') : ''}>${a(hasToggle ? p.per[d.modes[0].key] : p.per)}</span>
        </div>
        <ul>${list(p.features).map((f) => `<li>${a(f)}</li>`).join('')}</ul>
        <a class="btn ${p.featured ? 'btn-primary' : 'btn-ghost'}" href="${attr(p.cta?.href || '#contact')}">${a(p.cta?.label || 'Kies')}</a>
      </div>`).join('')}
    </div>
    ${d.note ? `<p class="section-head center" data-rv style="margin:clamp(1.6rem,3vw,2.4rem) auto 0;font-size:.82rem;color:var(--muted);max-width:64ch">${a(d.note)}</p>` : ''}
  </div>
</section>`;
  },

  faq(d = {}) {
    return `<section class="section ${d.variant === 'alt' ? 'section--alt' : ''}" ${d.id ? `id="${attr(d.id)}"` : ''} aria-label="Veelgestelde vragen">
  <div class="container faq-grid">
    <div class="faq-head" data-rv>
      ${d.eyebrow ? `<p class="eyebrow">${a(d.eyebrow)}</p>` : ''}
      <h2>${a(d.title || 'Veel <em>gevraagd</em>')}</h2>
      ${d.intro ? `<p>${a(d.intro)}</p>` : ''}
    </div>
    <div class="faq-list" data-rv data-d=".1s">
      ${list(d.items).map((it, i) => `<div class="faq-item">
        <button class="faq-q" type="button" aria-expanded="false"><span class="idx">${('0' + (i + 1)).slice(-2)}</span>${a(it.q)}<span class="faq-x" aria-hidden="true"></span></button>
        <div class="faq-a"><div class="faq-a-inner"><p>${a(it.an)}</p></div></div>
      </div>`).join('')}
    </div>
  </div>
</section>`;
  },

  contact(d = {}, ctx = {}) {
    const b = ctx.brand || {};
    const fields = list(d.fields).length ? d.fields : [
      { name: 'naam', label: 'Naam', type: 'text', required: true, half: true },
      { name: 'email', label: 'E-mail', type: 'email', required: true, half: true },
      { name: 'bericht', label: 'Bericht', type: 'textarea', required: true }
    ];
    const fieldHtml = fields.map((f) => {
      const inner = f.type === 'textarea'
        ? `<textarea id="f-${attr(f.name)}" name="${attr(f.name)}" ${f.required ? 'required' : ''} ${f.placeholder ? `placeholder="${attr(f.placeholder)}"` : ''}></textarea>`
        : f.type === 'select'
          ? `<select id="f-${attr(f.name)}" name="${attr(f.name)}" ${f.required ? 'required' : ''}><option value="" selected disabled>${a(f.placeholder || 'Kies…')}</option>${list(f.options).map((o) => `<option>${a(o)}</option>`).join('')}</select>`
          : `<input id="f-${attr(f.name)}" name="${attr(f.name)}" type="${attr(f.type || 'text')}" ${f.required ? 'required' : ''} ${f.placeholder ? `placeholder="${attr(f.placeholder)}"` : ''}>`;
      return `<div class="field ${f.half ? '' : 'field--full'}"><label for="f-${attr(f.name)}">${a(f.label)}</label>${inner}${f.required ? `<span class="fout">${a(f.error || 'Vul dit veld in.')}</span>` : ''}</div>`;
    }).join('');
    return `<section class="section ${d.dark ? 'dark' : (d.variant === 'alt' ? 'section--alt' : '')}" ${d.id ? `id="${attr(d.id)}"` : ''} aria-label="Contact">
  <div class="container contact-grid">
    <div class="contact-head" data-rv>
      ${d.eyebrow ? `<p class="eyebrow">${a(d.eyebrow)}</p>` : ''}
      <h2>${a(d.title || 'Neem <em>contact</em> op')}</h2>
      ${d.intro ? `<p>${a(d.intro)}</p>` : ''}
      <div class="contact-info">
        ${b.email ? `<div class="ci-rij"><span class="ico" aria-hidden="true">✉</span><a href="mailto:${attr(b.email)}">${a(b.email)}</a></div>` : ''}
        ${b.tel ? `<div class="ci-rij"><span class="ico" aria-hidden="true">☎</span><a href="tel:${attr((b.tel || '').replace(/[^+\d]/g, ''))}">${a(b.tel)}</a></div>` : ''}
        ${b.address ? `<div class="ci-rij"><span class="ico" aria-hidden="true">⌖</span><span>${a(b.address)}</span></div>` : ''}
      </div>
    </div>
    <form class="contact-form" data-validate novalidate data-rv data-d=".1s">
      <div class="form-grid">${fieldHtml}</div>
      <div class="form-onder">
        <button class="btn btn-primary js-magnetic" type="submit">${a(d.submit || 'Versturen')}
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M2 8h12M9 3l5 5-5 5"/></svg>
        </button>
        <p class="form-status" role="status" aria-live="polite"></p>
      </div>
      <div class="form-success" aria-hidden="true">
        <div class="check-ring"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M4 12l5 5L20 6"/></svg></div>
        <h3>${a(d.successTitle || 'Bericht ontvangen!')}</h3>
        <p>${a(d.successText || 'Bedankt — we reageren snel.')}</p>
      </div>
    </form>
  </div>
</section>`;
  },

  cta(d = {}) {
    return `<section class="section" aria-label="Oproep">
  <div class="container">
    <div class="cta" data-rv>
      <h2>${a(d.title)}</h2>
      ${d.text ? `<p>${a(d.text)}</p>` : ''}
      ${ctas(d.ctas)}
    </div>
  </div>
</section>`;
  },

  manifest(d = {}) {
    return `<section class="section ${d.dark ? 'dark' : 'section--alt'}" ${d.id ? `id="${attr(d.id)}"` : ''} aria-label="Manifest">
  <div class="container">
    ${d.eyebrow ? `<p class="eyebrow" data-rv>${a(d.eyebrow)}</p>` : ''}
    <p class="manifest-text" style="font-family:var(--font-serif);font-weight:500;font-size:clamp(1.7rem,4.2vw,3.2rem);line-height:1.26;letter-spacing:-.015em;max-width:24ch;margin-top:1.4rem">${a(d.text)}</p>
    ${d.sign ? `<p data-rv style="margin-top:2.2rem;font-family:var(--font-mono);font-size:.74rem;letter-spacing:.12em;text-transform:uppercase;color:var(--muted)">${a(d.sign)}</p>` : ''}
  </div>
</section>`;
  },

  zigzag(d = {}) {
    var head = (d.title || d.eyebrow) ? `<div class="section-head" data-rv>${d.eyebrow ? `<p class="eyebrow">${a(d.eyebrow)}</p>` : ''}${d.title ? `<h2>${a(d.title)}</h2>` : ''}${d.intro ? `<p>${a(d.intro)}</p>` : ''}</div>` : '';
    return `<section class="section ${d.variant === 'alt' ? 'section--alt' : ''}" ${d.id ? `id="${attr(d.id)}"` : ''} aria-label="${attr(d.title || 'Uitgelicht')}">
  <div class="container">
    ${head}
    <div class="zigzag">
      ${list(d.items).map((it) => `<div class="zz-row" data-rv>
        <div class="zz-media" data-tilt aria-hidden="true"><span class="glyph">${a(it.glyph || '◆')}</span></div>
        <div class="zz-copy">${it.eyebrow ? `<p class="eyebrow">${a(it.eyebrow)}</p>` : ''}<h3>${a(it.title)}</h3>${it.text ? `<p>${a(it.text)}</p>` : ''}${list(it.points).length ? `<ul>${list(it.points).map((p) => `<li>${a(p)}</li>`).join('')}</ul>` : ''}</div>
      </div>`).join('')}
    </div>
  </div>
</section>`;
  },

  bento(d = {}) {
    return `<section class="section ${d.variant === 'alt' ? 'section--alt' : ''}" ${d.id ? `id="${attr(d.id)}"` : ''} aria-label="${attr(d.title || 'Overzicht')}">
  <div class="container">
    <div class="section-head" data-rv>${d.eyebrow ? `<p class="eyebrow">${a(d.eyebrow)}</p>` : ''}<h2>${a(d.title)}</h2>${d.intro ? `<p>${a(d.intro)}</p>` : ''}</div>
    <div class="bento">
      ${list(d.items).map((it, i) => `<article class="feature" data-rv ${i ? `data-d=".${i * 6}s"` : ''}>${it.icon ? `<span class="ico" aria-hidden="true">${a(it.icon)}</span>` : ''}<h3>${a(it.title)}</h3><p>${a(it.text)}</p></article>`).join('')}
    </div>
  </div>
</section>`;
  },

  gallery(d = {}) {
    return `<section class="section ${d.variant === 'alt' ? 'section--alt' : ''}" ${d.id ? `id="${attr(d.id)}"` : ''} aria-label="${attr(d.title || 'Galerij')}">
  <div class="container">
    <div class="section-head" data-rv>${d.eyebrow ? `<p class="eyebrow">${a(d.eyebrow)}</p>` : ''}<h2>${a(d.title)}</h2>${d.intro ? `<p>${a(d.intro)}</p>` : ''}</div>
    <div class="gallery" data-rv>
      ${list(d.items).map((it) => `<div class="tile"><span class="glyph" aria-hidden="true">${a(it.glyph || '◇')}</span>${it.tag ? `<span class="tag">${a(it.tag)}</span>` : ''}</div>`).join('')}
    </div>
  </div>
</section>`;
  },

  team(d = {}) {
    return `<section class="section ${d.variant === 'alt' ? 'section--alt' : ''}" ${d.id ? `id="${attr(d.id)}"` : ''} aria-label="${attr(d.title || 'Team')}">
  <div class="container">
    <div class="section-head" data-rv>${d.eyebrow ? `<p class="eyebrow">${a(d.eyebrow)}</p>` : ''}<h2>${a(d.title)}</h2>${d.intro ? `<p>${a(d.intro)}</p>` : ''}</div>
    <div class="team-grid">
      ${list(d.items).map((it, i) => `<article class="member" data-rv ${i ? `data-d=".${i * 6}s"` : ''}><div class="ph" aria-hidden="true">${a((it.name || '?').trim().charAt(0))}</div><h3>${a(it.name)}</h3><span class="role">${a(it.role || '')}</span></article>`).join('')}
    </div>
  </div>
</section>`;
  },

  timeline(d = {}) {
    return `<section class="section ${d.variant === 'alt' ? 'section--alt' : ''}" ${d.id ? `id="${attr(d.id)}"` : ''} aria-label="${attr(d.title || 'Tijdlijn')}">
  <div class="container">
    <div class="section-head" data-rv>${d.eyebrow ? `<p class="eyebrow">${a(d.eyebrow)}</p>` : ''}<h2>${a(d.title)}</h2>${d.intro ? `<p>${a(d.intro)}</p>` : ''}</div>
    <div class="timeline">
      ${list(d.items).map((it) => `<div class="tl-item" data-rv><span class="yr">${a(it.year)}</span><div><h3>${a(it.title)}</h3><p>${a(it.text)}</p></div></div>`).join('')}
    </div>
  </div>
</section>`;
  },

  marquee(d = {}) {
    var row = list(d.items).map((x) => `<span>${a(x)}</span>`).join('');
    return `<div class="marquee ${d.outline ? 'marquee--outline' : ''}" aria-label="${attr(d.label || 'Slogan')}">
  <div class="marquee-track2" aria-hidden="true">${row}${row}</div>
</div>`;
  },

  banner(d = {}) {
    return `<section class="section" aria-label="${attr(d.title || 'Oproep')}">
  <div class="container">
    <div class="banner" data-rv>
      <div><h2>${a(d.title)}</h2>${d.text ? `<p>${a(d.text)}</p>` : ''}</div>
      ${d.cta ? `<a class="btn js-magnetic" href="${attr(d.cta.href || '#')}">${a(d.cta.label)}</a>` : ''}
    </div>
  </div>
</section>`;
  },

  tabs(d = {}) {
    var base = (d.id || 'tabs');
    var tabsArr = list(d.tabs);
    var head = tabsArr.map((t, i) => `<button type="button" role="tab" id="${attr(base)}-t${i}" aria-controls="${attr(base)}-p${i}" aria-selected="${i === 0 ? 'true' : 'false'}">${a(t.label)}</button>`).join('');
    var panels = tabsArr.map((t, i) => `<div class="tab-panel ${i === 0 ? 'is-active' : ''}" id="${attr(base)}-p${i}" role="tabpanel" aria-labelledby="${attr(base)}-t${i}">
      <div><h3>${a(t.title)}</h3>${t.text ? `<p>${a(t.text)}</p>` : ''}</div>
      ${list(t.points).length ? `<ul>${list(t.points).map((p) => `<li>${a(p)}</li>`).join('')}</ul>` : '<div></div>'}
    </div>`).join('');
    return `<section class="section ${d.variant === 'alt' ? 'section--alt' : ''}" ${d.id ? `id="${attr(d.id)}"` : ''} aria-label="${attr(d.title || 'Overzicht')}">
  <div class="container">
    <div class="section-head" data-rv>${d.eyebrow ? `<p class="eyebrow">${a(d.eyebrow)}</p>` : ''}<h2>${a(d.title)}</h2>${d.intro ? `<p>${a(d.intro)}</p>` : ''}</div>
    <div data-tabs data-rv>
      <div class="tabs-head" role="tablist">${head}</div>
      ${panels}
    </div>
  </div>
</section>`;
  },

  metrics(d = {}) {
    return `<section class="section ${d.variant === 'alt' ? 'section--alt' : ''}" ${d.id ? `id="${attr(d.id)}"` : ''} aria-label="${attr(d.title || 'In cijfers')}" data-countup>
  <div class="container">
    ${(d.title || d.eyebrow) ? `<div class="section-head" data-rv>${d.eyebrow ? `<p class="eyebrow">${a(d.eyebrow)}</p>` : ''}${d.title ? `<h2>${a(d.title)}</h2>` : ''}${d.intro ? `<p>${a(d.intro)}</p>` : ''}</div>` : ''}
    <div class="metrics-grid">
      ${list(d.items).map((m) => `<div class="metric" data-rv><div class="num"><span data-target="${attr(m.target)}">0</span>${m.suffix ? `<sup>${a(m.suffix)}</sup>` : ''}</div><div class="lab">${a(m.label)}</div></div>`).join('')}
    </div>
  </div>
</section>`;
  },

  comparison(d = {}) {
    var cols = list(d.columns);
    var hi = typeof d.highlight === 'number' ? d.highlight : -1;
    var thead = `<tr><th></th>${cols.map((c, i) => `<th class="${i === hi ? 'col-hi' : ''}">${a(c)}</th>`).join('')}</tr>`;
    var rows = list(d.rows).map((r) => `<tr><th>${a(r.label)}</th>${list(r.cells).map((cell, i) => {
      var val = cell === true ? '<span class="yes">✓</span>' : cell === false ? '—' : a(cell);
      return `<td class="${i === hi ? 'col-hi' : ''}">${val}</td>`;
    }).join('')}</tr>`).join('');
    return `<section class="section ${d.variant === 'alt' ? 'section--alt' : ''}" ${d.id ? `id="${attr(d.id)}"` : ''} aria-label="${attr(d.title || 'Vergelijking')}">
  <div class="container">
    <div class="section-head" data-rv>${d.eyebrow ? `<p class="eyebrow">${a(d.eyebrow)}</p>` : ''}<h2>${a(d.title)}</h2>${d.intro ? `<p>${a(d.intro)}</p>` : ''}</div>
    <div class="compare-wrap" data-rv><table class="compare"><thead>${thead}</thead><tbody>${rows}</tbody></table></div>
  </div>
</section>`;
  },

  // escape hatch voor unieke, hand-geschreven secties (canvas, bespoke layout, …)
  custom(d = {}) {
    return a(d.html);
  }
};
