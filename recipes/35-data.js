/* 35 — Meetlat: live animerende lijn/vlak-grafiek */
(function () {
  var canvas = document.getElementById('mtChart'); if (!canvas || !canvas.getContext) { return; }
  var ctx = canvas.getContext('2d');
  var reduced = false; try { reduced = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  var dpr = Math.min(window.devicePixelRatio || 1, 2), W = 0, H = 0, raf = null;
  var N = 24, cur = [], tgt = [], seed = 7, lastSwap = 0;
  function cssvar(n, f) { var v = getComputedStyle(document.documentElement).getPropertyValue(n).trim(); return v || f; }
  function rng() { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; }
  function makeTargets() { var v = 0.5; for (var i = 0; i < N; i++) { v += (rng() - 0.5) * 0.28; v = Math.max(0.12, Math.min(0.92, v)); tgt[i] = v; } }
  function resize() { var r = canvas.getBoundingClientRect(); W = r.width; H = r.height; canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
  function px(i) { return 8 + (W - 16) * (i / (N - 1)); }
  function py(v) { return H - 12 - (H - 28) * v; }
  function draw(t) {
    var acc = cssvar('--accent', '#b6f23d'), acc2 = cssvar('--accent-2', '#4cc4ff'), line = cssvar('--line', 'rgba(255,255,255,.1)');
    ctx.clearRect(0, 0, W, H);
    /* grid */
    ctx.strokeStyle = line; ctx.lineWidth = 1;
    for (var g = 0; g <= 4; g++) { var yy = 12 + (H - 28) * g / 4; ctx.beginPath(); ctx.moveTo(8, yy); ctx.lineTo(W - 8, yy); ctx.stroke(); }
    /* ease */
    for (var i = 0; i < N; i++) { cur[i] += ((tgt[i] || 0.5) - cur[i]) * 0.08; }
    /* vlak */
    ctx.beginPath(); ctx.moveTo(px(0), py(cur[0]));
    for (i = 1; i < N; i++) { ctx.lineTo(px(i), py(cur[i])); }
    ctx.lineTo(px(N - 1), H - 8); ctx.lineTo(px(0), H - 8); ctx.closePath();
    var ag = ctx.createLinearGradient(0, 0, 0, H);
    ag.addColorStop(0, hexA(acc, 0.34)); ag.addColorStop(1, hexA(acc, 0));
    ctx.fillStyle = ag; ctx.fill();
    /* lijn */
    ctx.beginPath(); ctx.moveTo(px(0), py(cur[0]));
    for (i = 1; i < N; i++) { ctx.lineTo(px(i), py(cur[i])); }
    ctx.strokeStyle = acc; ctx.lineWidth = 2.2; ctx.lineJoin = 'round'; ctx.stroke();
    /* laatste punt pulse */
    var lx = px(N - 1), ly = py(cur[N - 1]);
    var pr = reduced ? 4 : 4 + 3 * (0.5 + 0.5 * Math.sin(t * 0.005));
    ctx.fillStyle = hexA(acc2, 0.25); ctx.beginPath(); ctx.arc(lx, ly, pr * 2, 0, 6.283); ctx.fill();
    ctx.fillStyle = acc2; ctx.beginPath(); ctx.arc(lx, ly, 3.4, 0, 6.283); ctx.fill();
  }
  function hexA(hex, a) { var h = hex.replace('#', ''); if (h.length === 3) { h = h.split('').map(function (c) { return c + c; }).join(''); } var n = parseInt(h, 16); return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')'; }
  for (var i = 0; i < N; i++) { cur[i] = 0.5; } makeTargets();
  resize(); window.addEventListener('resize', function () { resize(); draw(0); }, { passive: true });
  if (reduced) { for (i = 0; i < N; i++) { cur[i] = tgt[i]; } draw(0); return; }
  function loop(t) { if (t - lastSwap > 2600) { makeTargets(); lastSwap = t; } draw(t); raf = requestAnimationFrame(loop); }
  document.addEventListener('visibilitychange', function () { if (document.hidden) { if (raf) { cancelAnimationFrame(raf); raf = null; } } else if (!raf) { raf = requestAnimationFrame(loop); } });
  raf = requestAnimationFrame(loop);
})();
