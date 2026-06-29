/* Éclat — lightweight, dependency-free interactions */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    // Mobile navigation toggle
    var toggle = document.querySelector('[data-nav-toggle]');
    var nav = document.querySelector('[data-site-nav]');
    if (toggle && nav) {
      toggle.addEventListener('click', function () {
        var open = nav.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    }

    // Quantity steppers
    document.querySelectorAll('[data-quantity]').forEach(function (wrap) {
      var input = wrap.querySelector('input');
      if (!input) return;
      wrap.querySelectorAll('[data-qty-step]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var step = parseInt(btn.getAttribute('data-qty-step'), 10);
          var min = parseInt(input.getAttribute('min'), 10) || 1;
          var val = (parseInt(input.value, 10) || min) + step;
          input.value = Math.max(min, val);
          input.dispatchEvent(new Event('change', { bubbles: true }));
        });
      });
    });

    // Product gallery thumbnail swap
    var mainMedia = document.querySelector('[data-gallery-main]');
    if (mainMedia) {
      document.querySelectorAll('[data-gallery-thumb]').forEach(function (thumb) {
        thumb.addEventListener('click', function () {
          var full = thumb.getAttribute('data-full');
          if (full) mainMedia.src = full;
        });
      });
    }

    // Reveal-on-scroll (respects reduced-motion via CSS fallback)
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var items = document.querySelectorAll('[data-reveal]');
    if (!reduced && 'IntersectionObserver' in window && items.length) {
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('is-in'); obs.unobserve(e.target); }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
      items.forEach(function (el) { obs.observe(el); });
    } else {
      items.forEach(function (el) { el.classList.add('is-in'); });
    }
  });
})();
