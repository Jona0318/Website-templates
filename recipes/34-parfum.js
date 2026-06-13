/* 34 — Sillage: opstijgende rook/inkt-diffusie */
(function () {
  var canvas = document.getElementById('slCanvas'); if (!canvas || !canvas.getContext) { return; }
  var ctx = canvas.getContext('2d');
  var reduced = false; try { reduced = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  var dpr = Math.min(window.devicePixelRatio || 1, 2), W = 0, H = 0, raf = null, parts = [];
  function cssvar(n, f) { var v = getComputedStyle(document.documentElement).getPropertyValue(n).trim(); return v || f; }
  function toRgb(hex, f) { var h = (hex || f).replace('#', ''); if (h.length === 3) { h = h.split('').map(function (c) { return c + c; }).join(''); } var n = parseInt(h, 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
  var COL = [[201, 162, 75], [201, 138, 122], [240, 230, 214]];
  function resize() { var r = canvas.getBoundingClientRect(); W = r.width; H = r.height; canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
  function spawn() { var c = COL[Math.floor(Math.random() * COL.length)]; parts.push({ x: W * (0.5 + (Math.random() - 0.5) * 0.16), y: H * 0.94, vx: (Math.random() - 0.5) * 0.3, vy: -(0.5 + Math.random() * 0.7), r: 14 + Math.random() * 26, life: 0, max: 200 + Math.random() * 160, col: c, seed: Math.random() * 6.28 }); }
  function draw(t) {
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'lighter';
    if (!reduced) { for (var k = 0; k < 3; k++) { if (parts.length < 240) { spawn(); } } }
    for (var i = parts.length - 1; i >= 0; i--) {
      var p = parts[i];
      if (!reduced) { p.life++; p.y += p.vy; p.x += p.vx + Math.sin(p.y * 0.012 + p.seed) * 0.5; p.vy *= 0.998; p.r += 0.22; }
      var lp = p.life / p.max; var a = Math.sin(Math.min(1, lp) * Math.PI) * 0.16;
      var g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
      g.addColorStop(0, 'rgba(' + p.col[0] + ',' + p.col[1] + ',' + p.col[2] + ',' + a.toFixed(3) + ')');
      g.addColorStop(1, 'rgba(' + p.col[0] + ',' + p.col[1] + ',' + p.col[2] + ',0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill();
      if (p.life > p.max || p.y < -p.r) { parts.splice(i, 1); }
    }
    ctx.globalCompositeOperation = 'source-over';
  }
  function staticPlume() {
    ctx.clearRect(0, 0, W, H); ctx.globalCompositeOperation = 'lighter';
    for (var i = 0; i < 60; i++) { var t = i / 60; var c = COL[i % COL.length]; var x = W * 0.5 + Math.sin(t * 9) * W * 0.06 * t; var y = H * (0.92 - t * 0.8); var r = 16 + t * 70; var a = (1 - t) * 0.12; var g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a.toFixed(3) + ')'); g.addColorStop(1, 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill(); }
    ctx.globalCompositeOperation = 'source-over';
  }
  COL = [toRgb(cssvar('--accent', '#c9a24b'), '#c9a24b'), toRgb(cssvar('--accent-2', '#c98a7a'), '#c98a7a'), toRgb(cssvar('--ink', '#f0e6d6'), '#f0e6d6')];
  resize(); window.addEventListener('resize', function () { resize(); if (reduced) { staticPlume(); } }, { passive: true });
  if (reduced) { staticPlume(); return; }
  function loop(t) { draw(t); raf = requestAnimationFrame(loop); }
  document.addEventListener('visibilitychange', function () { if (document.hidden) { if (raf) { cancelAnimationFrame(raf); raf = null; } } else if (!raf) { raf = requestAnimationFrame(loop); } });
  raf = requestAnimationFrame(loop);
})();
