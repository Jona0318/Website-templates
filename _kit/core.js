/* ============================================================
   CORE.JS — gedeelde gedragslaag voor gegenereerde templates
   Generiek: werkt op classes/ids/data-attributen, geen pagina-config nodig.
   Wordt door _kit/build.mjs in elke template ge-inlined.
   ============================================================ */
(function () {
  'use strict';
  var doc = document, root = doc.documentElement;
  var reduced = false; try { reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  var finePointer = false; try { finePointer = window.matchMedia('(pointer:fine)').matches; } catch (e) {}

  /* intro + loaded */
  function start() { root.classList.add('loaded'); requestAnimationFrame(function () { root.classList.add('drawn'); }); }
  var intro = doc.getElementById('intro');
  if (root.classList.contains('anim-ok') && intro) {
    var seen = false; try { seen = sessionStorage.getItem('intro_seen') === '1'; } catch (e) {}
    if (seen) { intro.classList.add('is-done'); intro.style.display = 'none'; start(); }
    else {
      requestAnimationFrame(function () { intro.classList.add('is-active'); });
      setTimeout(function () { intro.classList.add('is-done'); start(); try { sessionStorage.setItem('intro_seen', '1'); } catch (e) {} }, 1500);
      setTimeout(function () { if (intro) { intro.style.display = 'none'; } }, 2500);
    }
  } else { start(); }

  /* header hide-on-scroll + solid */
  var header = doc.getElementById('header');
  var lastY = window.pageYOffset || 0;
  function updateHeader() {
    var y = window.pageYOffset || 0;
    if (header) {
      header.classList.toggle('is-solid', y > 24);
      if (y > lastY && y > 400 && !menuOpen) { header.classList.add('is-hidden'); } else { header.classList.remove('is-hidden'); }
    }
    lastY = y;
  }

  /* overlay-menu */
  var menuOverlay = doc.getElementById('menuOverlay');
  var menuToggle = doc.getElementById('menuToggle');
  var menuClose = doc.getElementById('menuClose');
  var menuOpen = false;
  function setMenu(open) {
    menuOpen = open;
    if (menuOverlay) { menuOverlay.classList.toggle('is-open', open); menuOverlay.setAttribute('aria-hidden', open ? 'false' : 'true'); }
    if (menuToggle) { menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false'); }
    doc.body.style.overflow = open ? 'hidden' : '';
    if (open && menuClose) { menuClose.focus(); } else if (!open && menuToggle) { menuToggle.focus(); }
  }
  if (menuToggle) { menuToggle.addEventListener('click', function () { setMenu(true); }); }
  if (menuClose) { menuClose.addEventListener('click', function () { setMenu(false); }); }
  if (menuOverlay) { menuOverlay.addEventListener('click', function (e) { if (e.target.closest('a')) { setMenu(false); } }); }
  doc.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menuOpen) { setMenu(false); } });

  /* reveal */
  if (root.classList.contains('anim-ok') && 'IntersectionObserver' in window) {
    var rvObs = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (en.isIntersecting) { var d = en.target.getAttribute('data-d'); if (d) { en.target.style.setProperty('--d', d); } en.target.classList.add('in-view'); rvObs.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    Array.prototype.forEach.call(doc.querySelectorAll('[data-rv]'), function (el) { rvObs.observe(el); });
  }

  /* count-up */
  function formatInt(n) { n = Math.round(n); return n >= 10000 ? n.toLocaleString('nl-NL') : String(n); }
  function runCount(scope) {
    Array.prototype.forEach.call(scope.querySelectorAll('[data-target]'), function (el, i) {
      var target = parseFloat(el.getAttribute('data-target')) || 0;
      if (reduced) { el.textContent = formatInt(target); return; }
      var dur = 1600, startT = null;
      function tick(t) { if (startT === null) { startT = t; } var p = Math.min((t - startT) / dur, 1); var e = 1 - Math.pow(1 - p, 4); el.textContent = formatInt(target * e); if (p < 1) { requestAnimationFrame(tick); } }
      el.textContent = '0'; setTimeout(function () { requestAnimationFrame(tick); }, 80 + i * 90);
    });
  }
  Array.prototype.forEach.call(doc.querySelectorAll('.stats, [data-countup]'), function (sec) {
    if ('IntersectionObserver' in window && !reduced) {
      var o = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { runCount(sec); o.unobserve(en.target); } }); }, { threshold: 0.4 });
      o.observe(sec);
    } else { runCount(sec); }
  });

  /* live klok (elk element met data-clock) */
  function updateClocks() {
    var els = doc.querySelectorAll('[data-clock]'); if (!els.length) { return; }
    var label;
    try { label = new Intl.DateTimeFormat('nl-NL', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Europe/Amsterdam' }).format(new Date()); }
    catch (e) { var d = new Date(); label = ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2); }
    Array.prototype.forEach.call(els, function (el) { el.textContent = label; });
  }
  updateClocks(); setInterval(updateClocks, 30000);

  /* footer-jaar */
  Array.prototype.forEach.call(doc.querySelectorAll('[data-year]'), function (el) { el.textContent = String(new Date().getFullYear()); });

  /* prijs-/modus-toggle (data-toggle-group container, knoppen data-mode, bedragen/labels data-<mode>) */
  Array.prototype.forEach.call(doc.querySelectorAll('[data-toggle-group]'), function (group) {
    var btns = Array.prototype.slice.call(group.querySelectorAll('button[data-mode]'));
    var scope = doc.getElementById(group.getAttribute('data-toggle-group')) || doc;
    var values = Array.prototype.slice.call(scope.querySelectorAll('[data-toggle-value]'));
    var switching = false;
    function setMode(mode) {
      if (switching) { return; } switching = true;
      btns.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-mode') === mode ? 'true' : 'false'); });
      var dur = reduced ? 0 : 240;
      values.forEach(function (el) { if (el.classList.contains('bedrag')) { el.classList.add('switching'); } });
      setTimeout(function () {
        values.forEach(function (el) { var n = el.getAttribute('data-' + mode); if (n !== null) { el.innerHTML = n; } el.classList.remove('switching'); });
        switching = false;
      }, dur);
    }
    btns.forEach(function (btn) { btn.addEventListener('click', function () { if (btn.getAttribute('aria-pressed') !== 'true') { setMode(btn.getAttribute('data-mode')); } }); });
  });

  /* FAQ */
  Array.prototype.forEach.call(doc.querySelectorAll('.faq-list'), function (faqList) {
    var items = Array.prototype.slice.call(faqList.querySelectorAll('.faq-item'));
    faqList.classList.add('faq-ready');
    function setFaq(item, open) { item.classList.toggle('open', open); var b = item.querySelector('.faq-q'); if (b) { b.setAttribute('aria-expanded', open ? 'true' : 'false'); } }
    items.forEach(function (item) {
      var btn = item.querySelector('.faq-q'); if (!btn) { return; }
      btn.addEventListener('click', function () { var was = item.classList.contains('open'); items.forEach(function (it) { setFaq(it, false); }); if (!was) { setFaq(item, true); } });
    });
    if (items[0]) { setFaq(items[0], true); }
  });

  /* contact-formulieren */
  Array.prototype.forEach.call(doc.querySelectorAll('form[data-validate]'), function (form) {
    var statusEl = form.querySelector('.form-status');
    function setInvalid(input, invalid) { var f = input.closest('.field'); if (f) { f.classList.toggle('invalid', invalid); } input.setAttribute('aria-invalid', invalid ? 'true' : 'false'); }
    function validate(input) {
      var v = (input.value || '').trim(), ok = true;
      if (input.type === 'email') { ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); }
      else if (input.type === 'number') { var n = parseFloat(v); var mn = parseFloat(input.min), mx = parseFloat(input.max); ok = !isNaN(n) && (isNaN(mn) || n >= mn) && (isNaN(mx) || n <= mx); }
      else if (input.tagName === 'SELECT') { ok = v !== ''; }
      else if (input.hasAttribute('required')) { ok = v.length > 0; }
      setInvalid(input, !ok); return ok;
    }
    var inputs = Array.prototype.slice.call(form.querySelectorAll('input, select, textarea')).filter(function (i) { return i.hasAttribute('required') || i.type === 'email'; });
    inputs.forEach(function (input) {
      input.addEventListener('blur', function () { validate(input); });
      input.addEventListener('input', function () { var f = input.closest('.field'); if (f && f.classList.contains('invalid')) { validate(input); } });
      if (input.tagName === 'SELECT') { input.addEventListener('change', function () { validate(input); }); }
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var allOk = true, firstBad = null;
      inputs.forEach(function (input) { if (!validate(input)) { allOk = false; if (!firstBad) { firstBad = input; } } });
      if (!allOk) { if (statusEl) { statusEl.textContent = 'Controleer de gemarkeerde velden.'; } if (firstBad) { firstBad.focus(); } return; }
      form.classList.add('sent');
      var success = form.querySelector('.form-success'); if (success) { success.setAttribute('aria-hidden', 'false'); }
      if (statusEl) { statusEl.textContent = 'Verzonden.'; }
    });
  });

  /* tabs */
  Array.prototype.forEach.call(doc.querySelectorAll('[data-tabs]'), function (root2) {
    var tabs = Array.prototype.slice.call(root2.querySelectorAll('[role="tab"]'));
    var panels = Array.prototype.slice.call(root2.querySelectorAll('.tab-panel'));
    function select(i) {
      tabs.forEach(function (t, j) { t.setAttribute('aria-selected', j === i ? 'true' : 'false'); });
      panels.forEach(function (p, j) { p.classList.toggle('is-active', j === i); });
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { select(i); });
      t.addEventListener('keydown', function (e) {
        var n = tabs.length, idx = i;
        if (e.key === 'ArrowRight') { idx = (i + 1) % n; } else if (e.key === 'ArrowLeft') { idx = (i - 1 + n) % n; } else { return; }
        e.preventDefault(); tabs[idx].focus(); select(idx);
      });
    });
  });

  /* magnetische knoppen */
  if (finePointer && !reduced) {
    Array.prototype.forEach.call(doc.querySelectorAll('.js-magnetic'), function (btn) {
      var MAX = 6;
      btn.addEventListener('mousemove', function (e) {
        var r = btn.getBoundingClientRect();
        btn.style.transform = 'translate(' + (((e.clientX - (r.left + r.width / 2)) / (r.width / 2)) * MAX).toFixed(1) + 'px,' + (((e.clientY - (r.top + r.height / 2)) / (r.height / 2)) * MAX).toFixed(1) + 'px)';
      }, { passive: true });
      btn.addEventListener('mouseleave', function () { btn.style.transform = ''; }, { passive: true });
    });
  }

  /* 3D-tilt */
  if (finePointer && !reduced) {
    Array.prototype.forEach.call(doc.querySelectorAll('[data-tilt]'), function (card) {
      var tx = 0, ty = 0, cx = 0, cy = 0, raf = null, MAXT = 6;
      function loop() { cx += (tx - cx) * 0.1; cy += (ty - cy) * 0.1; card.style.transform = 'perspective(900px) rotateX(' + cy.toFixed(2) + 'deg) rotateY(' + cx.toFixed(2) + 'deg)'; if (Math.abs(tx - cx) > 0.02 || Math.abs(ty - cy) > 0.02) { raf = requestAnimationFrame(loop); } else { raf = null; } }
      function s() { if (raf === null) { raf = requestAnimationFrame(loop); } }
      card.addEventListener('pointermove', function (e) { var r = card.getBoundingClientRect(); tx = Math.max(-MAXT, Math.min(MAXT, ((e.clientX - r.left) / r.width - 0.5) * MAXT * 2)); ty = Math.max(-MAXT, Math.min(MAXT, -((e.clientY - r.top) / r.height - 0.5) * MAXT * 2)); s(); }, { passive: true });
      card.addEventListener('pointerleave', function () { tx = 0; ty = 0; s(); }, { passive: true });
    });
  }

  /* manifest woord-oplichting (.manifest-text) */
  var manifests = [];
  Array.prototype.forEach.call(doc.querySelectorAll('.manifest-text'), function (m) {
    if (reduced) { return; }
    var raw = m.textContent.trim().split(/\s+/); m.textContent = '';
    var words = [];
    raw.forEach(function (w, i) { var s = doc.createElement('span'); s.className = 'mw'; s.textContent = w; s.style.transition = 'opacity .4s var(--ease)'; s.style.opacity = '.22'; m.appendChild(s); if (i < raw.length - 1) { m.appendChild(doc.createTextNode(' ')); } words.push(s); });
    m.__words = words; manifests.push(m);
  });

  /* scroll-loop */
  var progress = doc.getElementById('scrollProgress');
  var timelines = Array.prototype.slice.call(doc.querySelectorAll('[data-timeline-line]'));
  var ticking = false;
  function frame() {
    ticking = false;
    updateHeader();
    var vh = window.innerHeight || doc.documentElement.clientHeight;
    if (progress) { var sc = doc.documentElement.scrollHeight - vh; progress.style.transform = 'scaleX(' + Math.max(0, Math.min(1, sc > 0 ? (window.pageYOffset || 0) / sc : 0)).toFixed(4) + ')'; }
    manifests.forEach(function (m) {
      var r = m.getBoundingClientRect(); var prog = Math.max(0, Math.min(1, (vh * 0.85 - r.top) / (r.height + vh * 0.45)));
      var lit = Math.floor(prog * m.__words.length);
      for (var i = 0; i < m.__words.length; i++) { m.__words[i].style.opacity = i < lit ? '1' : '.22'; }
    });
    if (!reduced) {
      timelines.forEach(function (line) {
        var host = line.parentElement; if (!host) { return; }
        var r = host.getBoundingClientRect(); var start = vh * 0.8, end = vh * 0.45;
        var pp = Math.min(Math.max((start - r.top) / (r.height + (start - end)), 0), 1);
        line.style.height = (pp * 100).toFixed(2) + '%';
      });
    }
  }
  function tick() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
  window.addEventListener('scroll', tick, { passive: true }); window.addEventListener('resize', tick, { passive: true });
  frame();
})();
