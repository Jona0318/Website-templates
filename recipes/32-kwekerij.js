/* 32 — Wildgroei: recursief groeiende planten op canvas */
(function () {
  var canvas = document.getElementById('groCanvas'); if (!canvas || !canvas.getContext) { return; }
  var ctx = canvas.getContext('2d');
  var reduced = false; try { reduced = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  var dpr = Math.min(window.devicePixelRatio || 1, 2), W = 0, H = 0, raf = null, p = 0;
  var stem = '#3f7d3a', leaf = '#7bbf4e', flower = '#d98a4e';
  function cssvar(n, f) { var v = getComputedStyle(document.documentElement).getPropertyValue(n).trim(); return v || f; }
  function ease(x) { return 1 - Math.pow(1 - x, 3); }
  function resize() { var r = canvas.getBoundingClientRect(); W = r.width; H = r.height; canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }

  function branch(x, y, ang, len, depth, g, seed) {
    if (depth <= 0 || len < 3) {
      if (g > 0.55) { ctx.fillStyle = leaf; ctx.globalAlpha = Math.min(1, (g - 0.55) / 0.3); ctx.beginPath(); ctx.ellipse(x, y, 7, 3.4, ang, 0, 6.283); ctx.fill(); ctx.globalAlpha = 1; }
      return;
    }
    var gl = len * Math.min(1, g * 1.25);
    var x2 = x + Math.cos(ang) * gl, y2 = y + Math.sin(ang) * gl;
    ctx.strokeStyle = stem; ctx.lineWidth = Math.max(0.8, depth * 0.7); ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x2, y2); ctx.stroke();
    if (g < 0.18) { return; }
    var ng = (g - 0.12) / 0.88;
    var spread = 0.42 + (((seed >> depth) & 7) / 7) * 0.22;
    var sway = Math.sin((seed + depth) * 1.3) * 0.06;
    branch(x2, y2, ang - spread + sway, len * 0.76, depth - 1, ng, seed);
    branch(x2, y2, ang + spread + sway, len * 0.74, depth - 1, ng, seed * 31 + 7);
    if (depth % 2 === 0) { branch(x2, y2, ang + sway * 2, len * 0.6, depth - 2, ng, seed * 17 + 3); }
    if (depth <= 2 && g > 0.85 && ((seed >> 1) & 3) === 0) { ctx.fillStyle = flower; ctx.beginPath(); ctx.arc(x2, y2, 4.5, 0, 6.283); ctx.fill(); }
  }
  function draw() {
    ctx.clearRect(0, 0, W, H);
    stem = cssvar('--accent', '#3f7d3a'); flower = cssvar('--accent-2', '#d98a4e');
    var g = ease(Math.min(1, p));
    var bases = [0.16, 0.40, 0.62, 0.84];
    for (var i = 0; i < bases.length; i++) {
      var bx = W * bases[i];
      var len = Math.min(H, W) * (0.085 + (i % 2) * 0.03);
      branch(bx, H, -Math.PI / 2 + (i - 1.5) * 0.04, len, 9, g, 1234 + i * 919);
    }
  }
  resize(); window.addEventListener('resize', function () { resize(); draw(); }, { passive: true });
  if (reduced) { p = 1; draw(); return; }
  function loop() { p += 0.012; draw(); if (p < 1.02) { raf = requestAnimationFrame(loop); } else { raf = null; } }
  /* start groeien zodra in beeld */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { if (!raf && p < 1) { raf = requestAnimationFrame(loop); } io.disconnect(); } }); }, { threshold: 0.05 });
    io.observe(canvas);
  } else { raf = requestAnimationFrame(loop); }
})();
