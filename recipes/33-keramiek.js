/* 33 — Draaischijf: vorm zelf een vaas op de draaischijf */
(function () {
  var canvas = document.getElementById('klCanvas'); if (!canvas || !canvas.getContext) { return; }
  var ctx = canvas.getContext('2d');
  var wheel = document.getElementById('klWheel');
  var reduced = false; try { reduced = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  var dpr = Math.min(window.devicePixelRatio || 1, 2), W = 0, H = 0, raf = null, t0 = 0;
  var N = 46, profile = [], topF = 0.10, botF = 0.86;
  function cssvar(n, f) { var v = getComputedStyle(document.documentElement).getPropertyValue(n).trim(); return v || f; }

  function defaultProfile() {
    var ctrl = [[0, 0.40], [0.10, 0.30], [0.24, 0.60], [0.42, 0.80], [0.58, 0.78], [0.74, 0.55], [0.90, 0.42], [1, 0.46]];
    var arr = [];
    for (var i = 0; i < N; i++) {
      var t = i / (N - 1), r = 0.5;
      for (var k = 0; k < ctrl.length - 1; k++) { if (t >= ctrl[k][0] && t <= ctrl[k + 1][0]) { var f = (t - ctrl[k][0]) / (ctrl[k + 1][0] - ctrl[k][0]); var e = f * f * (3 - 2 * f); r = ctrl[k][1] + (ctrl[k + 1][1] - ctrl[k][1]) * e; break; } }
      arr.push(r);
    }
    return arr;
  }
  function randomize() {
    var p = defaultProfile();
    for (var i = 0; i < N; i++) { p[i] = Math.max(0.14, Math.min(0.95, p[i] + (Math.sin(i * 0.7 + Math.random() * 6) * 0.12) + (Math.random() - 0.5) * 0.1)); }
    for (var s = 0; s < 2; s++) { p = smooth(p); }
    profile = p; redraw();
  }
  function smooth(p) { var q = p.slice(); for (var i = 1; i < N - 1; i++) { q[i] = (p[i - 1] + p[i] * 2 + p[i + 1]) / 4; } return q; }

  function resize() { var r = canvas.getBoundingClientRect(); W = r.width; H = r.height; canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
  function geom() { return { cx: W / 2, top: H * topF, bot: H * botF, maxR: W * 0.30 }; }

  function buildPath(g) {
    ctx.beginPath();
    var i, t, y, r;
    for (i = 0; i < N; i++) { t = i / (N - 1); y = g.top + (g.bot - g.top) * t; r = profile[i] * g.maxR; if (i === 0) { ctx.moveTo(g.cx + r, y); } else { ctx.lineTo(g.cx + r, y); } }
    for (i = N - 1; i >= 0; i--) { t = i / (N - 1); y = g.top + (g.bot - g.top) * t; r = profile[i] * g.maxR; ctx.lineTo(g.cx - r, y); }
    ctx.closePath();
  }

  function draw(t) {
    var g = geom(); ctx.clearRect(0, 0, W, H);
    var clay = cssvar('--accent', '#b5532e');
    /* draaischijf */
    ctx.fillStyle = cssvar('--bg-2', '#e8ddd0');
    ctx.beginPath(); ctx.ellipse(g.cx, g.bot + 10, g.maxR * 1.35, g.maxR * 0.34, 0, 0, 6.283); ctx.fill();
    ctx.strokeStyle = cssvar('--line', 'rgba(0,0,0,.1)'); ctx.lineWidth = 1; ctx.stroke();
    /* romp met cilindrische arcering */
    ctx.save(); buildPath(g); ctx.clip();
    var grad = ctx.createLinearGradient(g.cx - g.maxR, 0, g.cx + g.maxR, 0);
    grad.addColorStop(0, shade(clay, -0.5)); grad.addColorStop(0.42, shade(clay, 0.18)); grad.addColorStop(0.6, shade(clay, 0.05)); grad.addColorStop(1, shade(clay, -0.55));
    ctx.fillStyle = grad; ctx.fillRect(g.cx - g.maxR - 4, g.top - 30, g.maxR * 2 + 8, g.bot - g.top + 60);
    /* draaiende glans */
    var hx = g.cx + Math.sin((reduced ? 0.6 : t * 0.0014)) * g.maxR * 0.55;
    var hg = ctx.createLinearGradient(hx - g.maxR * 0.5, 0, hx + g.maxR * 0.5, 0);
    hg.addColorStop(0, 'rgba(255,255,255,0)'); hg.addColorStop(0.5, 'rgba(255,255,255,.4)'); hg.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = hg; ctx.fillRect(g.cx - g.maxR, g.top - 30, g.maxR * 2, g.bot - g.top + 60);
    ctx.restore();
    /* contour + rand-ellipsen */
    buildPath(g); ctx.strokeStyle = shade(clay, -0.35); ctx.lineWidth = 1.4; ctx.stroke();
    var rTop = profile[0] * g.maxR;
    ctx.beginPath(); ctx.ellipse(g.cx, g.top, rTop, rTop * 0.26, 0, 0, 6.283); ctx.fillStyle = shade(clay, -0.4); ctx.fill();
    ctx.beginPath(); ctx.ellipse(g.cx, g.top, rTop * 0.84, rTop * 0.2, 0, 0, 6.283); ctx.fillStyle = shade(clay, -0.7); ctx.fill();
  }
  function shade(hex, amt) {
    var h = hex.replace('#', ''); if (h.length === 3) { h = h.split('').map(function (c) { return c + c; }).join(''); }
    var n = parseInt(h, 16), r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    function m(x) { return Math.max(0, Math.min(255, Math.round(amt < 0 ? x * (1 + amt) : x + (255 - x) * amt))); }
    return 'rgb(' + m(r) + ',' + m(g) + ',' + m(b) + ')';
  }
  function redraw() { draw(reduced ? 600 : (performance && performance.now ? performance.now() : 0)); }

  function shape(e) {
    var r = canvas.getBoundingClientRect();
    var cx2 = (e.touches && e.touches[0] ? e.touches[0].clientX : e.clientX) - r.left;
    var cy2 = (e.touches && e.touches[0] ? e.touches[0].clientY : e.clientY) - r.top;
    var g = geom();
    var ty = (cy2 - g.top) / (g.bot - g.top); if (ty < 0 || ty > 1) { return; }
    var idx = Math.round(ty * (N - 1));
    var target = Math.max(0.12, Math.min(0.96, Math.abs(cx2 - g.cx) / g.maxR));
    for (var i = 0; i < N; i++) { var w = Math.exp(-Math.pow(i - idx, 2) / 8); profile[i] = profile[i] * (1 - w) + target * w; }
    if (wheel) { wheel.classList.add('touched'); }
    if (reduced) { redraw(); }
  }
  var dragging = false;
  canvas.addEventListener('pointerdown', function (e) { dragging = true; canvas.setPointerCapture && canvas.setPointerCapture(e.pointerId); shape(e); });
  canvas.addEventListener('pointermove', function (e) { if (dragging) { shape(e); } });
  window.addEventListener('pointerup', function () { dragging = false; });

  var nieuw = document.getElementById('klNieuw'); if (nieuw) { nieuw.addEventListener('click', randomize); }
  var reset = document.getElementById('klReset'); if (reset) { reset.addEventListener('click', function () { profile = defaultProfile(); redraw(); }); }

  profile = defaultProfile();
  resize(); window.addEventListener('resize', function () { resize(); redraw(); }, { passive: true });
  if (reduced) { redraw(); return; }
  function loop(t) { draw(t); raf = requestAnimationFrame(loop); }
  document.addEventListener('visibilitychange', function () { if (document.hidden) { if (raf) { cancelAnimationFrame(raf); raf = null; } } else if (!raf) { raf = requestAnimationFrame(loop); } });
  raf = requestAnimationFrame(loop);
})();
