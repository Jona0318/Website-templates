/* GULDEN — De Gulden Courant · preview-logica (framework-vrij) */
(function () {
  'use strict';
  var root = document.documentElement;
  var anim = root.classList.contains('anim');
  var eur = new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' });

  /* ── productindex (spiegelt de statische HTML; in Shopify komt dit uit Liquid) ── */
  var PRODUCTS = {
    'nova-x3':        { naam: 'Koptelefoon Nova X3',        merk: 'Nova',       prijs: 249.95, oud: 299.95, img: 'img/koptelefoon.jpg',    cat: 'tech audio koptelefoon noise cancelling' },
    'chrono-staal':   { naam: 'Chronograaf Staal 42 mm',    merk: 'Hanze',      prijs: 329.00, oud: null,   img: 'img/chronograaf.jpg',    cat: 'fashion horloge chronograaf' },
    'sneaker-vlucht': { naam: 'Sneaker Vlucht — Zwart',     merk: 'Vlucht',     prijs: 129.95, oud: null,   img: 'img/sneaker-zwart.jpg',  cat: 'fashion schoenen sneaker' },
    'smartwatch-puur':{ naam: 'Smartwatch Puur — Wit',      merk: 'Puur',       prijs: 199.00, oud: 249.00, img: 'img/smartwatch-wit.jpg', cat: 'tech smartwatch horloge' },
    'camera-kiek':    { naam: 'Instantcamera Kiek Retro',   merk: 'Kiek',       prijs: 94.95,  oud: null,   img: 'img/instantcamera.jpg',  cat: 'tech camera foto polaroid' },
    'rugzak-dagmars': { naam: 'Rugzak Dagmars 22 L',        merk: 'Dagmars',    prijs: 79.95,  oud: null,   img: 'img/rugzak.jpg',         cat: 'fashion tassen rugzak school' },
    'zonnebril-noir': { naam: 'Zonnebril Klassiek — Zwart', merk: 'Noir',       prijs: 149.00, oud: null,   img: 'img/zonnebril.jpg',      cat: 'fashion zonnebril zomer' },
    'lotion-atelier': { naam: 'Bodylotion Nº 3 — 250 ml',   merk: 'Atelier Nº 3', prijs: 24.95, oud: null,  img: 'img/bodylotion.jpg',     cat: 'beauty huidverzorging lotion' },
    'kokosolie-coco': { naam: 'Kokosolie Glans — 200 ml',   merk: 'Coco',       prijs: 18.95,  oud: null,   img: 'img/kokosolie.jpg',      cat: 'beauty haarverzorging olie' },
    'tempo-schoen':   { naam: 'Hardloopschoen Tempo',       merk: 'Tempo',      prijs: 139.95, oud: 169.95, img: 'img/hardloopschoen.jpg', cat: 'sport hardlopen schoenen' },
    'smartwatch-sport':{ naam: 'Smartwatch Sport — Zwart',  merk: 'Puur',       prijs: 279.00, oud: null,   img: 'img/smartwatch-zwart.jpg', cat: 'sport tech smartwatch' },
    'speaker-blok':   { naam: 'Speaker Blok — Draagbaar',   merk: 'Blok',       prijs: 119.95, oud: 149.95, img: 'img/speaker.jpg',        cat: 'tech audio speaker bluetooth' },
    'telefoon-vonk':  { naam: 'Smartphone Vonk 128 GB',     merk: 'Vonk',       prijs: 699.00, oud: null,   img: 'img/smartphone.jpg',     cat: 'tech telefonie smartphone' },
    'boek-milk':      { naam: 'Milk and Honey — Rupi Kaur', merk: 'Boeken',     prijs: 19.99,  oud: null,   img: 'img/boek.jpg',           cat: 'boeken literatuur poëzie' },
    'sneaker-sprint': { naam: 'Sneaker Sprint — Multi',     merk: 'Vlucht',     prijs: 99.95,  oud: 139.95, img: 'img/sneaker-multi.jpg',  cat: 'sport fashion sneaker' }
  };

  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }

  /* ═══ 1 · Editie, dateline & deadlines ═══ */
  var nu = new Date();
  function isoWeek(d) {
    var t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    var dag = t.getUTCDay() || 7;
    t.setUTCDate(t.getUTCDate() + 4 - dag);
    var jaarStart = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
    return Math.ceil((((t - jaarStart) / 864e5) + 1) / 7);
  }
  var editie = String(isoWeek(nu)).padStart(2, '0');
  $$('.editie-ref').forEach(function (el) { el.textContent = editie; });

  var datumFmt = new Intl.DateTimeFormat('nl-NL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  var dl = $('#dateline');
  if (dl) {
    var d = datumFmt.format(nu);
    dl.textContent = d.charAt(0).toUpperCase() + d.slice(1);
  }

  var dagFmt = new Intl.DateTimeFormat('nl-NL', { weekday: 'long' });
  function tikDeadline() {
    var el = $('#deadline'); if (!el) return;
    var n = new Date();
    var cutoff = new Date(n); cutoff.setHours(23, 0, 0, 0);
    if (n >= cutoff) cutoff.setDate(cutoff.getDate() + 1);
    var rest = cutoff - n;
    var u = Math.floor(rest / 36e5), m = Math.ceil((rest % 36e5) / 6e4);
    if (m === 60) { u += 1; m = 0; }
    el.textContent = u > 0 ? (u + ' u ' + m + ' m') : (m + ' m');
    var bezorg = new Date(cutoff); bezorg.setDate(bezorg.getDate() + 1);
    var morgen = new Date(n); morgen.setDate(morgen.getDate() + 1);
    var label = bezorg.toDateString() === morgen.toDateString() ? 'morgen in huis' : dagFmt.format(bezorg) + ' in huis';
    var zin = el.parentNode;
    if (zin) {
      var na = el.nextSibling;
      if (na && na.nodeType === 3) na.textContent = ' — ' + label;
    }
  }
  tikDeadline(); setInterval(tikDeadline, 30e3);

  function tikDeal() {
    var el = $('#dealKlok'); if (!el) return;
    var n = new Date();
    var eind = new Date(n); eind.setHours(24, 0, 0, 0);
    var rest = Math.max(0, eind - n);
    var h = Math.floor(rest / 36e5), m = Math.floor((rest % 36e5) / 6e4), s = Math.floor((rest % 6e4) / 1e3);
    function p(x) { return String(x).padStart(2, '0'); }
    el.textContent = p(h) + ':' + p(m) + ':' + p(s);
  }
  tikDeal(); setInterval(tikDeal, 1e3);

  /* ═══ 2 · Tijdsbalk-rotatie ═══ */
  (function () {
    var box = $('#tbBerichten'); if (!box) return;
    var items = $$('span', box); if (items.length < 2) return;
    var i = 0;
    setInterval(function () {
      items[i].classList.remove('is-actief');
      i = (i + 1) % items.length;
      items[i].classList.add('is-actief');
    }, 4200);
  })();

  /* ═══ 3 · Sticky-condensatie ═══ */
  (function () {
    var head = $('#masthead'); if (!head) return;
    var tikt = false;
    function meet() {
      tikt = false;
      var y = window.scrollY || 0;
      if (y > 130) head.classList.add('is-compact');
      else if (y < 50) head.classList.remove('is-compact');
    }
    window.addEventListener('scroll', function () {
      if (!tikt) { tikt = true; requestAnimationFrame(meet); }
    }, { passive: true });
    meet();
  })();

  /* ═══ 4 · Ticker ═══ */
  (function () {
    var groep = $('#tickerGroep'); if (!groep) return;
    var dub = groep.cloneNode(true);
    dub.setAttribute('aria-hidden', 'true');
    dub.removeAttribute('id');
    $$('a', dub).forEach(function (a) { a.setAttribute('tabindex', '-1'); });
    groep.parentNode.appendChild(dub);
    function snelheid() {
      var b = Math.max(groep.scrollWidth, 600);
      groep.parentNode.style.setProperty('--dur', Math.round(b / 52) + 's');
    }
    snelheid();
    window.addEventListener('resize', snelheid, { passive: true });
  })();

  /* ═══ 5 · Winkelwagen (kassabon) ═══ */
  var cart = {};
  try { cart = JSON.parse(localStorage.getItem('gulden_cart') || '{}') || {}; } catch (e) { cart = {}; }
  Object.keys(cart).forEach(function (id) { if (!PRODUCTS[id] || !(cart[id] > 0)) delete cart[id]; });

  var GRATIS_VANAF = 25, BEZORGING = 2.95;
  var drawer = $('#cartDrawer'), scherm = $('#scherm'), badgeFlap = $('#cartFlap');
  var bonLijst = $('#bonLijst'), bonLeeg = $('#bonLeeg');
  var laatsteFocus = null;
  if (drawer) drawer.removeAttribute('hidden');

  function bewaar() { try { localStorage.setItem('gulden_cart', JSON.stringify(cart)); } catch (e) {} }
  function aantalTotaal() { return Object.keys(cart).reduce(function (n, id) { return n + cart[id]; }, 0); }
  function subtotaal() { return Object.keys(cart).reduce(function (n, id) { return n + cart[id] * PRODUCTS[id].prijs; }, 0); }

  function flipBadge(n) {
    if (!badgeFlap) return;
    badgeFlap.textContent = n;
    if (anim) {
      badgeFlap.classList.remove('is-flip');
      void badgeFlap.offsetWidth;
      badgeFlap.classList.add('is-flip');
    }
  }

  function renderBon() {
    if (!bonLijst) return;
    bonLijst.innerHTML = '';
    var ids = Object.keys(cart);
    if (bonLeeg) bonLeeg.hidden = ids.length > 0;
    ids.forEach(function (id) {
      var p = PRODUCTS[id];
      var li = document.createElement('li');
      li.className = 'bon-item';
      li.innerHTML =
        '<div class="bon-regel"><span class="bon-naam">' + p.naam + '</span>' +
        '<span class="bon-stippen" aria-hidden="true"></span>' +
        '<b class="bon-prijs">' + eur.format(p.prijs * cart[id]) + '</b></div>' +
        '<div class="bon-sub2">' +
        '<button class="bon-step" data-stap="-1" aria-label="Eén minder">−</button>' +
        '<span class="bon-aantal cijfers">' + cart[id] + '</span>' +
        '<button class="bon-step" data-stap="1" aria-label="Eén meer">+</button>' +
        '<button class="bon-weg">Verwijder</button></div>';
      $$('.bon-step', li).forEach(function (k) {
        k.addEventListener('click', function () { wijzig(id, parseInt(k.getAttribute('data-stap'), 10)); });
      });
      $('.bon-weg', li).addEventListener('click', function () { wijzig(id, -cart[id]); });
      bonLijst.appendChild(li);
    });

    var sub = subtotaal(), n = aantalTotaal();
    var gratis = sub >= GRATIS_VANAF;
    var verzend = n === 0 ? 0 : (gratis ? 0 : BEZORGING);
    var subEl = $('#bonSub'), verEl = $('#bonVerzend'), totEl = $('#bonTotaal');
    if (subEl) subEl.textContent = eur.format(sub);
    if (verEl) verEl.textContent = n === 0 ? '—' : (gratis ? 'Gratis' : eur.format(BEZORGING));
    if (totEl) totEl.textContent = eur.format(sub + verzend);

    var vm = $('#vmVul'), vmT = $('#vmTekst');
    if (vm) vm.style.setProperty('--vul', Math.min(100, (sub / GRATIS_VANAF) * 100).toFixed(1) + '%');
    if (vmT) {
      vmT.innerHTML = gratis && n > 0
        ? '<b>✓ Gratis bezorging</b> — uw bestelling komt morgen'
        : 'Nog <b>' + eur.format(Math.max(0, GRATIS_VANAF - sub)) + '</b> tot gratis bezorging';
    }

    var balk = $('#kassabalk');
    if (balk) {
      balk.hidden = false;
      balk.classList.toggle('is-zichtbaar', n > 0);
      document.body.classList.toggle('heeft-kassabalk', n > 0 && window.innerWidth <= 768);
      var t = $('#kbTeller'), tot = $('#kbTotaal');
      if (t) t.textContent = n;
      if (tot) tot.textContent = eur.format(sub + verzend);
    }
    flipBadge(n);
  }

  function wijzig(id, delta) {
    cart[id] = (cart[id] || 0) + delta;
    if (cart[id] <= 0) delete cart[id];
    bewaar(); renderBon();
  }

  function voegToe(id, knop) {
    if (!PRODUCTS[id]) return;
    wijzig(id, 1);
    if (knop) {
      var em = $('em', knop);
      var kaal = !em && !$('svg', knop);
      var oud = em ? em.textContent : knop.textContent;
      knop.classList.add('is-toegevoegd');
      if (em) em.textContent = '✓ Toegevoegd';
      else if (kaal) knop.textContent = '✓ Toegevoegd';
      setTimeout(function () {
        knop.classList.remove('is-toegevoegd');
        if (em) em.textContent = oud;
        else if (kaal) knop.textContent = oud;
      }, 1500);
    }
  }

  document.addEventListener('click', function (e) {
    var knop = e.target.closest('[data-add]');
    if (knop) { e.preventDefault(); voegToe(knop.getAttribute('data-add'), knop); }
  });

  /* drawer openen/sluiten */
  function zetScherm(open, hoog) {
    if (!scherm) return;
    scherm.hidden = !open;
    scherm.classList.toggle('is-hoog', !!hoog);
  }
  function openDrawer() {
    if (!drawer) return;
    laatsteFocus = document.activeElement;
    sluitMenu();
    var dat = $('#bonDatum');
    if (dat) {
      dat.textContent = new Intl.DateTimeFormat('nl-NL', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date());
    }
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    zetScherm(true, true);
    document.body.style.overflow = 'hidden';
    var s = $('#drawerSluit'); if (s) s.focus();
  }
  function sluitDrawer() {
    if (!drawer || !drawer.classList.contains('is-open')) return;
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    zetScherm(false, false);
    document.body.style.overflow = '';
    if (laatsteFocus && laatsteFocus.focus) laatsteFocus.focus();
  }
  var cartKnop = $('#cartKnop');
  if (cartKnop) cartKnop.addEventListener('click', openDrawer);
  var drawerSluit = $('#drawerSluit');
  if (drawerSluit) drawerSluit.addEventListener('click', sluitDrawer);
  var kassabalk = $('#kassabalk');
  if (kassabalk) kassabalk.addEventListener('click', openDrawer);

  /* ═══ 6 · Mega-menu ═══ */
  var menu = $('#megaMenu'), menuKnop = $('#menuKnop');
  function openMenu() {
    if (!menu) return;
    menu.hidden = false;
    menuKnop.setAttribute('aria-expanded', 'true');
    var mh = $('#masthead');
    if (mh) menu.style.top = (mh.getBoundingClientRect().bottom) + 'px';
    menu.style.position = 'fixed';
    zetScherm(true, false);
  }
  function sluitMenu() {
    if (!menu || menu.hidden) return;
    menu.hidden = true;
    menuKnop.setAttribute('aria-expanded', 'false');
    if (!drawer || !drawer.classList.contains('is-open')) zetScherm(false, false);
  }
  if (menuKnop) menuKnop.addEventListener('click', function () {
    if (menu.hidden) openMenu(); else sluitMenu();
  });
  if (scherm) scherm.addEventListener('click', function () { sluitMenu(); sluitDrawer(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { sluitMenu(); sluitDrawer(); sluitLade(); }
  });

  /* ═══ 7 · Zoeklade ═══ */
  var zoekVeld = $('#zoekVeld'), zoekLade = $('#zoekLade'), zlLijst = $('#zlLijst'), zoekForm = $('#zoekForm');
  var PLACEHOLDERS = ['Zoek in 24.512 artikelen…', 'Probeer ‘airfryer’…', 'Probeer ‘LEGO Technic’…', 'Probeer ‘OLED tv’…', 'Probeer ‘zonnebrand’…'];
  (function () {
    if (!zoekVeld) return;
    var i = 0;
    setInterval(function () {
      if (document.activeElement === zoekVeld || zoekVeld.value) return;
      i = (i + 1) % PLACEHOLDERS.length;
      zoekVeld.setAttribute('placeholder', PLACEHOLDERS[i]);
    }, 3400);
  })();

  function markeer(tekst, term) {
    if (!term) return tekst;
    var veilig = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return tekst.replace(new RegExp('(' + veilig + ')', 'ig'), '<mark>$1</mark>');
  }
  function renderZoek(term) {
    if (!zlLijst) return;
    var t = (term || '').trim().toLowerCase();
    var ids = Object.keys(PRODUCTS).filter(function (id) {
      if (!t) return true;
      var p = PRODUCTS[id];
      return (p.naam + ' ' + p.merk + ' ' + p.cat).toLowerCase().indexOf(t) !== -1;
    }).slice(0, 5);
    var kop = $('#zlResultKop');
    if (kop) kop.textContent = t ? 'Resultaten voor ‘' + term.trim() + '’' : 'Uit de index van editie ' + editie;
    zlLijst.innerHTML = '';
    if (!ids.length) {
      zlLijst.innerHTML = '<li class="zl-leeg">Niets gevonden — probeer een andere zoekterm.</li>';
      return;
    }
    ids.forEach(function (id, i) {
      var p = PRODUCTS[id];
      var li = document.createElement('li');
      li.innerHTML =
        '<div class="zl-item">' +
        '<b class="zl-nr">' + String(i + 1).padStart(2, '0') + '</b>' +
        '<img src="' + p.img + '" alt="" loading="lazy">' +
        '<span class="zl-naam">' + markeer(p.naam, t) + '</span>' +
        '<b class="zl-prijs">' + eur.format(p.prijs) + '</b>' +
        '<button class="plusknop plusknop-klein" data-add="' + id + '" aria-label="' + p.naam + ' in winkelwagen">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2"/></svg></button>' +
        '</div>';
      zlLijst.appendChild(li);
    });
  }
  function openLade() {
    if (!zoekLade) return;
    renderZoek(zoekVeld.value);
    zoekLade.hidden = false;
    zoekVeld.setAttribute('aria-expanded', 'true');
  }
  function sluitLade() {
    if (!zoekLade || zoekLade.hidden) return;
    zoekLade.hidden = true;
    zoekVeld.setAttribute('aria-expanded', 'false');
  }
  if (zoekVeld) {
    zoekVeld.addEventListener('focus', openLade);
    zoekVeld.addEventListener('input', function () { openLade(); });
    document.addEventListener('click', function (e) {
      if (zoekForm && !zoekForm.contains(e.target)) sluitLade();
    });
    zoekForm.addEventListener('submit', function (e) { e.preventDefault(); openLade(); });
    $$('#zlTermen button').forEach(function (k) {
      k.addEventListener('click', function () {
        zoekVeld.value = k.getAttribute('data-term');
        zoekVeld.focus();
        renderZoek(zoekVeld.value);
      });
    });
  }

  /* ═══ 8 · Koerslijst-preview ═══ */
  (function () {
    var panel = $('#koersPreview'); if (!panel) return;
    var img = $('#kpImg'), pos = $('#kpPos'), naam = $('#kpNaam'), prijs = $('#kpPrijs'), knop = $('#kpKnop');
    var fijn = window.matchMedia('(pointer:fine)').matches;
    if (!fijn) return;
    var actief = null;
    $$('.koers-rij').forEach(function (rij, i) {
      function toon() {
        var id = rij.getAttribute('data-id');
        var p = PRODUCTS[id]; if (!p) return;
        if (actief) actief.classList.remove('is-actief');
        actief = rij; rij.classList.add('is-actief');
        pos.textContent = String(i + 1).padStart(2, '0');
        naam.textContent = p.naam;
        prijs.textContent = eur.format(p.prijs);
        if (knop) {
          knop.setAttribute('data-add', id);
          knop.setAttribute('aria-label', p.naam + ' in winkelwagen');
        }
        if (img.getAttribute('src') !== p.img) {
          img.classList.add('is-wissel');
          var nieuw = new Image();
          nieuw.onload = function () {
            img.src = p.img;
            img.classList.remove('is-wissel');
          };
          nieuw.src = p.img;
        }
      }
      rij.addEventListener('mouseenter', toon);
      rij.addEventListener('focusin', toon);
      if (i === 0) toon();
    });
  })();

  /* ═══ 9 · Nieuwsbrief-coupon ═══ */
  (function () {
    var form = $('#nieuwsbrief'); if (!form) return;
    var mail = $('#nbMail'), fout = $('#nbFout'), ok = $('#nbSucces');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var geldig = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail.value.trim());
      fout.hidden = geldig;
      ok.hidden = !geldig;
      if (geldig) form.hidden = true;
    });
  })();

  /* ═══ 10 · Reveal ═══ */
  (function () {
    var els = $$('[data-rv]');
    els.forEach(function (el) {
      var d = el.getAttribute('data-d');
      if (d) el.style.setProperty('--d', d);
    });
    if (!anim || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('in-beeld'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in-beeld'); io.unobserve(en.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });
    els.forEach(function (el) { io.observe(el); });
  })();

  renderBon();
})();
