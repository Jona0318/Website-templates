/* live thema-editor (template 28) — injecteert een paneel dat de :root-tokens
   live aanpast. Toont meteen hoe "aanpasbaar" de gedeelde kern is. */
(function () {
  var root = document.documentElement, doc = document;
  function setVar(k, v) { root.style.setProperty(k, v); }
  function hexToRgba(hex, al) { var h = hex.replace('#', ''); if (h.length === 3) { h = h.split('').map(function (c) { return c + c; }).join(''); } var n = parseInt(h, 16); return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + al + ')'; }
  function lum(hex) { var h = hex.replace('#', ''); if (h.length === 3) { h = h.split('').map(function (c) { return c + c; }).join(''); } var n = parseInt(h, 16); return (0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255; }
  function applyAccent(a, b) { setVar('--accent', a); setVar('--accent-2', b); setVar('--accent-soft', hexToRgba(a, 0.10)); setVar('--on-accent', lum(a) > 0.62 ? '#16140f' : '#ffffff'); }

  var PRESETS = [
    { a: '#4f46e5', b: '#ec4899' }, { a: '#0ea5e9', b: '#f59e0b' }, { a: '#16a34a', b: '#84cc16' },
    { a: '#e11d48', b: '#fb923c' }, { a: '#7c3aed', b: '#22d3ee' }, { a: '#111827', b: '#6b7280' }
  ];
  var LIGHT = { '--bg': '#f7f7f5', '--bg-2': '#eeeeec', '--surface': '#ffffff', '--ink': '#18181b', '--muted': 'rgba(24,24,27,.62)', '--faint': 'rgba(24,24,27,.40)', '--line': 'rgba(24,24,27,.12)', '--line-strong': 'rgba(24,24,27,.24)', '--dark-bg': '#101012', '--dark-surface': '#1b1b1f', '--dark-ink': '#f4f4f5', '--dark-muted': 'rgba(244,244,245,.62)', '--dark-line': 'rgba(244,244,245,.14)' };
  var DARK = { '--bg': '#0e0e11', '--bg-2': '#151519', '--surface': '#17171c', '--ink': '#f4f4f5', '--muted': 'rgba(244,244,245,.62)', '--faint': 'rgba(244,244,245,.40)', '--line': 'rgba(244,244,245,.12)', '--line-strong': 'rgba(244,244,245,.22)', '--dark-bg': '#08080a', '--dark-surface': '#151519', '--dark-ink': '#f4f4f5', '--dark-muted': 'rgba(244,244,245,.62)', '--dark-line': 'rgba(244,244,245,.14)' };
  function applyMode(m) { var set = m === 'donker' ? DARK : LIGHT; Object.keys(set).forEach(function (k) { setVar(k, set[k]); }); }
  var FONTS = { a: { serif: '"Schibsted Grotesk",sans-serif', grotesk: '"Plus Jakarta Sans",sans-serif' }, b: { serif: '"Fraunces",Georgia,serif', grotesk: '"Inter",sans-serif' } };
  function applyFont(f) { setVar('--font-serif', FONTS[f].serif); setVar('--font-grotesk', FONTS[f].grotesk); }

  /* paneel bouwen */
  var wrap = doc.createElement('div'); wrap.className = 'thx'; wrap.setAttribute('aria-label', 'Thema aanpassen');
  wrap.innerHTML =
    '<span class="thx-toast" id="thxToast" role="status">CSS gekopieerd ✓</span>' +
    '<div class="thx-panel" id="thxPanel" hidden>' +
      '<div class="thx-row"><span>Accentkleur</span><div class="thx-swatches" id="thxSwatches"></div></div>' +
      '<div class="thx-row"><span>Modus</span><div class="thx-seg" id="thxMode"><button type="button" data-val="licht" aria-pressed="true">Licht</button><button type="button" data-val="donker" aria-pressed="false">Donker</button></div></div>' +
      '<div class="thx-row"><span>Hoeken</span><div class="thx-range"><input type="range" id="thxRadius" min="0" max="28" value="16" aria-label="Hoekafronding"><output id="thxRadiusOut">16px</output></div></div>' +
      '<div class="thx-row"><span>Lettertype</span><div class="thx-seg" id="thxFont"><button type="button" data-val="a" aria-pressed="true">Grotesk</button><button type="button" data-val="b" aria-pressed="false">Serif</button></div></div>' +
      '<button class="thx-copy" id="thxCopy" type="button">Kopieer CSS-variabelen</button>' +
    '</div>' +
    '<button class="thx-fab" id="thxFab" type="button" aria-expanded="false" aria-controls="thxPanel">✦ <span class="lbl">Thema</span></button>';
  doc.body.appendChild(wrap);

  var fab = doc.getElementById('thxFab'), panel = doc.getElementById('thxPanel');
  fab.addEventListener('click', function () { var willOpen = panel.hasAttribute('hidden'); if (willOpen) { panel.removeAttribute('hidden'); } else { panel.setAttribute('hidden', ''); } fab.setAttribute('aria-expanded', willOpen ? 'true' : 'false'); });
  doc.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !panel.hasAttribute('hidden')) { panel.setAttribute('hidden', ''); fab.setAttribute('aria-expanded', 'false'); } });

  var sw = doc.getElementById('thxSwatches');
  PRESETS.forEach(function (p, i) {
    var b = doc.createElement('button'); b.className = 'thx-sw'; b.type = 'button';
    b.style.background = 'linear-gradient(135deg,' + p.a + ' 58%,' + p.b + ' 58%)';
    b.setAttribute('aria-label', 'Accent ' + (i + 1)); b.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
    b.addEventListener('click', function () { applyAccent(p.a, p.b); Array.prototype.forEach.call(sw.children, function (c, ci) { c.setAttribute('aria-pressed', ci === i ? 'true' : 'false'); }); });
    sw.appendChild(b);
  });

  function bindSeg(id, fn) { var seg = doc.getElementById(id); if (!seg) { return; } var btns = seg.querySelectorAll('button'); Array.prototype.forEach.call(btns, function (btn) { btn.addEventListener('click', function () { Array.prototype.forEach.call(btns, function (b) { b.setAttribute('aria-pressed', 'false'); }); btn.setAttribute('aria-pressed', 'true'); fn(btn.getAttribute('data-val')); }); }); }
  bindSeg('thxMode', applyMode);
  bindSeg('thxFont', applyFont);

  var rad = doc.getElementById('thxRadius'), radOut = doc.getElementById('thxRadiusOut');
  rad.addEventListener('input', function () { setVar('--radius', rad.value + 'px'); if (radOut) { radOut.textContent = rad.value + 'px'; } });

  var copy = doc.getElementById('thxCopy'), toast = doc.getElementById('thxToast');
  copy.addEventListener('click', function () {
    var keys = ['--bg', '--bg-2', '--surface', '--ink', '--muted', '--line', '--line-strong', '--accent', '--accent-2', '--accent-soft', '--on-accent', '--radius'];
    var cs = getComputedStyle(root);
    var txt = ':root{\n' + keys.map(function (k) { return '  ' + k + ': ' + (root.style.getPropertyValue(k) || cs.getPropertyValue(k)).trim() + ';'; }).join('\n') + '\n}';
    function done() { if (toast) { toast.classList.add('show'); setTimeout(function () { toast.classList.remove('show'); }, 1700); } }
    if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(txt).then(done, done); } else { done(); }
  });
})();
