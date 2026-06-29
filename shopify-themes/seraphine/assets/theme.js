/* Premium webshop theme — dependency-free interactions
   nav · cart drawer (AJAX) · predictive search · variant picker · sticky add-to-cart · gallery · reveal
   Progressive enhancement: every feature degrades to a normal page/form if JS or a node is missing. */
(function () {
  'use strict';

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  /* ---- Shopify money formatter (standard) ---- */
  function formatMoney(cents, format) {
    if (typeof cents === 'string') cents = cents.replace('.', '');
    var fmt = format || window.themeMoney || '€{{amount_with_comma_separator}}';
    var pat = /\{\{\s*(\w+)\s*\}\}/;
    function num(n, precision, thousands, decimal) {
      n = (Math.abs(n) / 100).toFixed(precision);
      var parts = n.split('.');
      var whole = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands);
      var dec = parts[1] ? decimal + parts[1] : '';
      return whole + dec;
    }
    var value;
    switch ((fmt.match(pat) || [])[1]) {
      case 'amount': value = num(cents, 2, ',', '.'); break;
      case 'amount_no_decimals': value = num(cents, 0, ',', '.'); break;
      case 'amount_with_comma_separator': value = num(cents, 2, '.', ','); break;
      case 'amount_no_decimals_with_comma_separator': value = num(cents, 0, '.', ','); break;
      case 'amount_with_space_separator': value = num(cents, 2, ' ', ','); break;
      case 'amount_no_decimals_with_space_separator': value = num(cents, 0, ' ', ''); break;
      case 'amount_with_apostrophe_separator': value = num(cents, 2, "'", '.'); break;
      default: value = num(cents, 2, ',', '.');
    }
    return fmt.replace(pat, value);
  }

  ready(function () {
    var body = document.body;

    /* ---------------- Mobile navigation ---------------- */
    var navToggle = document.querySelector('[data-nav-toggle]');
    var nav = document.querySelector('[data-site-nav]');
    if (navToggle && nav) {
      navToggle.addEventListener('click', function () {
        var open = nav.classList.toggle('is-open');
        navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    }

    /* ---------------- Quantity steppers (product, cart, drawer) ---------------- */
    document.addEventListener('click', function (e) {
      var btn = e.target.closest && e.target.closest('[data-qty-step]');
      if (!btn) return;
      var wrap = btn.closest('[data-quantity]');
      var input = wrap && wrap.querySelector('input');
      if (!input) return;
      var step = parseInt(btn.getAttribute('data-qty-step'), 10);
      var min = parseInt(input.getAttribute('min'), 10); if (isNaN(min)) min = 1;
      input.value = Math.max(min, (parseInt(input.value, 10) || min) + step);
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });

    /* ---------------- Product gallery thumbnail swap ---------------- */
    var mainMedia = document.querySelector('[data-gallery-main]');
    if (mainMedia) {
      document.querySelectorAll('[data-gallery-thumb]').forEach(function (thumb) {
        thumb.addEventListener('click', function () {
          var full = thumb.getAttribute('data-full');
          if (full) mainMedia.src = full;
        });
      });
    }

    /* ---------------- Cart drawer ---------------- */
    var drawer = document.querySelector('[data-cart-drawer]');
    var overlay = document.querySelector('[data-cart-overlay]');
    var lastFocus = null;

    function setCartCount(n) {
      document.querySelectorAll('[data-cart-count]').forEach(function (el) { el.textContent = '(' + n + ')'; });
    }
    function openCart() {
      if (!drawer) return;
      lastFocus = document.activeElement;
      drawer.classList.add('is-open');
      drawer.setAttribute('aria-hidden', 'false');
      if (overlay) { overlay.hidden = false; requestAnimationFrame(function () { overlay.classList.add('is-open'); }); }
      body.classList.add('drawer-open');
      var c = drawer.querySelector('[data-cart-close]'); if (c) c.focus();
    }
    function closeCart() {
      if (!drawer || !drawer.classList.contains('is-open')) return;
      drawer.classList.remove('is-open');
      drawer.setAttribute('aria-hidden', 'true');
      if (overlay) { overlay.classList.remove('is-open'); setTimeout(function () { overlay.hidden = true; }, 320); }
      body.classList.remove('drawer-open');
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }
    function refreshCart(open) {
      return fetch(window.location.pathname + '?sections=cart-drawer', { headers: { 'Accept': 'application/json' } })
        .then(function (r) { return r.json(); })
        .then(function (data) {
          var html = data['cart-drawer'];
          if (html != null) {
            var doc = new DOMParser().parseFromString(html, 'text/html');
            var fresh = doc.querySelector('[data-cart-contents]');
            var live = document.querySelector('[data-cart-contents]');
            if (fresh && live) live.innerHTML = fresh.innerHTML;
            var src = doc.querySelector('[data-cart-count-source]');
            if (src) setCartCount(src.getAttribute('data-count'));
          }
          if (open) openCart();
        })
        .catch(function () { if (open) window.location.href = '/cart'; });
    }
    function changeLine(line, qty) {
      if (!line) return;
      fetch('/cart/change.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ line: parseInt(line, 10), quantity: qty })
      }).then(function () { return refreshCart(false); });
    }

    document.addEventListener('click', function (e) {
      if (!e.target.closest) return;
      if (e.target.closest('[data-cart-open]') && drawer) { e.preventDefault(); openCart(); }
      if (e.target.closest('[data-cart-close]')) { e.preventDefault(); closeCart(); }
      var rem = e.target.closest('[data-cart-remove]');
      if (rem) { e.preventDefault(); changeLine(rem.getAttribute('data-line'), 0); }
    });
    if (overlay) overlay.addEventListener('click', closeCart);
    document.addEventListener('change', function (e) {
      var input = e.target.closest && e.target.closest('[data-cart-qty]');
      if (!input) return;
      changeLine(input.getAttribute('data-line'), Math.max(0, parseInt(input.value, 10) || 0));
    });

    /* add to cart -> drawer */
    document.addEventListener('submit', function (e) {
      var form = e.target;
      if (!form.matches || !form.matches('#product-form')) return;
      if (!drawer) return; /* no enhanced drawer -> normal submit */
      e.preventDefault();
      var btn = form.querySelector('[type="submit"]');
      if (btn) { btn.classList.add('is-loading'); btn.disabled = true; }
      fetch('/cart/add.js', { method: 'POST', headers: { 'Accept': 'application/json' }, body: new FormData(form) })
        .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
        .then(function (res) {
          if (btn) { btn.classList.remove('is-loading'); btn.disabled = false; }
          if (res.ok) refreshCart(true);
        })
        .catch(function () { if (btn) { btn.classList.remove('is-loading'); btn.disabled = false; } form.submit(); });
    });

    /* ---------------- Predictive search ---------------- */
    var searchPanel = document.querySelector('[data-search-panel]');
    var searchInput = searchPanel && searchPanel.querySelector('[data-search-input]');
    var searchResults = searchPanel && searchPanel.querySelector('[data-search-results]');
    function openSearch() {
      if (!searchPanel) return;
      searchPanel.hidden = false;
      requestAnimationFrame(function () { searchPanel.classList.add('is-open'); });
      if (searchInput) searchInput.focus();
    }
    function closeSearch() {
      if (!searchPanel || !searchPanel.classList.contains('is-open')) return;
      searchPanel.classList.remove('is-open');
      setTimeout(function () { searchPanel.hidden = true; }, 320);
    }
    document.addEventListener('click', function (e) {
      if (!e.target.closest) return;
      if (e.target.closest('[data-search-open]') && searchPanel) { e.preventDefault(); openSearch(); }
      if (e.target.closest('[data-search-close]')) { e.preventDefault(); closeSearch(); }
    });
    if (searchInput && searchResults) {
      var t = null;
      searchInput.addEventListener('input', function () {
        var q = searchInput.value.trim();
        clearTimeout(t);
        if (q.length < 2) { searchResults.innerHTML = ''; return; }
        t = setTimeout(function () {
          var url = '/search/suggest.json?q=' + encodeURIComponent(q) + '&resources[type]=product&resources[limit]=6';
          fetch(url, { headers: { 'Accept': 'application/json' } })
            .then(function (r) { return r.json(); })
            .then(function (data) {
              var items = (((data.resources || {}).results || {}).products) || [];
              if (!items.length) { searchResults.innerHTML = '<p class="search-results__empty">' + (window.themeStrings && window.themeStrings.noResults || 'No results.') + '</p>'; return; }
              var html = items.map(function (p) {
                var img = p.image || (p.featured_image && p.featured_image.url) || '';
                return '<a class="search-result" href="' + p.url + '">' +
                  (img ? '<img src="' + img + '" alt="" width="48" height="60" loading="lazy">' : '') +
                  '<span>' + p.title + '</span></a>';
              }).join('');
              html += '<a class="search-results__all" href="/search?q=' + encodeURIComponent(q) + '">' + (window.themeStrings && window.themeStrings.viewAll || 'View all results') + ' →</a>';
              searchResults.innerHTML = html;
            })
            .catch(function () {});
        }, 250);
      });
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { closeCart(); closeSearch(); }
    });

    /* ---------------- Variant picker + dynamic price/availability ---------------- */
    var pForm = document.querySelector('#product-form');
    var variantsEl = document.querySelector('[data-variants]');
    if (pForm && variantsEl) {
      var variants = [];
      try { variants = JSON.parse(variantsEl.textContent); } catch (err) { variants = []; }
      var idInput = pForm.querySelector('[name="id"]');
      var priceEl = document.querySelector('[data-product-price]');
      var stickyPrice = document.querySelector('[data-sticky-price]');
      var addBtn = pForm.querySelector('[data-add-btn]');

      function selectedOptions() {
        var opts = [];
        pForm.querySelectorAll('[data-option-index]').forEach(function (group) {
          var idx = parseInt(group.getAttribute('data-option-index'), 10);
          var checked = group.querySelector('input:checked') || group.querySelector('select');
          if (checked) opts[idx] = checked.value;
        });
        return opts;
      }
      function priceHTML(v) {
        if (v.compare_at_price && v.compare_at_price > v.price) {
          return '<span class="price__sale">' + formatMoney(v.price) + '</span> <s class="price__compare">' + formatMoney(v.compare_at_price) + '</s>';
        }
        return formatMoney(v.price);
      }
      function update() {
        var opts = selectedOptions();
        var v = variants.filter(function (x) {
          return x.options.every(function (o, i) { return o === opts[i]; });
        })[0];
        if (!v) {
          if (addBtn) { addBtn.disabled = true; addBtn.textContent = addBtn.getAttribute('data-unavailable') || 'Unavailable'; }
          return;
        }
        if (idInput) idInput.value = v.id;
        var html = priceHTML(v);
        if (priceEl) priceEl.innerHTML = html;
        if (stickyPrice) stickyPrice.innerHTML = html;
        if (addBtn) {
          addBtn.disabled = !v.available;
          addBtn.textContent = v.available ? (addBtn.getAttribute('data-add') || 'Add to cart') : (addBtn.getAttribute('data-soldout') || 'Sold out');
        }
      }
      pForm.addEventListener('change', function (e) {
        if (e.target.closest('[data-option-index]')) update();
      });
    }

    /* ---------------- Sticky add-to-cart ---------------- */
    var stickyBar = document.querySelector('[data-sticky-atc]');
    var anchorBtn = document.querySelector('#product-form [data-add-btn]');
    if (stickyBar && anchorBtn && 'IntersectionObserver' in window) {
      var sObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          stickyBar.classList.toggle('is-visible', !en.isIntersecting && en.boundingClientRect.top < 0);
        });
      }, { threshold: 0 });
      sObs.observe(anchorBtn);
    }

    /* ---------------- Reveal on scroll ---------------- */
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var items = document.querySelectorAll('[data-reveal]');
    if (!reduced && 'IntersectionObserver' in window && items.length) {
      var rObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('is-in'); rObs.unobserve(e.target); }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
      items.forEach(function (el) { rObs.observe(el); });
    } else {
      items.forEach(function (el) { el.classList.add('is-in'); });
    }
  });
})();
