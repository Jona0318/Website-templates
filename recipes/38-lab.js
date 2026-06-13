/* 38 — Synaps: neuraal deeltjesnetwerk dat op de cursor reageert */
(function () {
  var canvas = document.getElementById('sy2Canvas'); if (!canvas || !canvas.getContext) { return; }
  var ctx = canvas.getContext('2d');
  var reduced = false; try { reduced = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  var fine = false; try { fine = matchMedia('(pointer:fine)').matches; } catch (e) {}
  var dpr = Math.min(window.devicePixelRatio || 1, 2), W = 0, H = 0, raf = null, nodes = [], D = 130;
  var mouse = { x: -999, y: -999, on: false };
  function cssvar(n, f) { var v = getComputedStyle(document.documentElement).getPropertyValue(n).trim(); return v || f; }
  function toRgb(hex, f) { var h = (hex || f).replace('#', ''); if (h.length === 3) { h = h.split('').map(function (c) { return c + c; }).join(''); } var n = parseInt(h, 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
  var acc, acc2;
  function make() { var n = Math.max(28, Math.min(120, Math.round(W * H / 13000))); nodes = []; for (var i = 0; i < n; i++) { nodes.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4, r: 1 + Math.random() * 2 }); } }
  function resize() { var r = canvas.getBoundingClientRect(); W = r.width; H = r.height; canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); make(); }
  function draw() {
    acc = toRgb(cssvar('--accent', '#6e8cff'), '#6e8cff'); acc2 = toRgb(cssvar('--accent-2', '#2fe6e6'), '#2fe6e6');
    ctx.clearRect(0, 0, W, H);
    var i, j, a, b, dx, dy, d2, d;
    if (!reduced) {
      for (i = 0; i < nodes.length; i++) {
        a = nodes[i]; a.x += a.vx; a.y += a.vy;
        if (a.x < 0 || a.x > W) { a.vx *= -1; } if (a.y < 0 || a.y > H) { a.vy *= -1; }
        if (mouse.on) { dx = mouse.x - a.x; dy = mouse.y - a.y; d2 = dx * dx + dy * dy; if (d2 < 26000 && d2 > 1) { d = Math.sqrt(d2); a.vx += dx / d * 0.05; a.vy += dy / d * 0.05; } }
        a.vx = Math.max(-1, Math.min(1, a.vx * 0.99)); a.vy = Math.max(-1, Math.min(1, a.vy * 0.99));
      }
    }
    /* verbindingen */
    for (i = 0; i < nodes.length; i++) {
      a = nodes[i];
      for (j = i + 1; j < nodes.length; j++) {
        b = nodes[j]; dx = a.x - b.x; dy = a.y - b.y; d2 = dx * dx + dy * dy;
        if (d2 < D * D) { var al = (1 - Math.sqrt(d2) / D) * 0.5; ctx.strokeStyle = 'rgba(' + acc[0] + ',' + acc[1] + ',' + acc[2] + ',' + al.toFixed(3) + ')'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
      }
      /* lijn naar muis */
      if (mouse.on) { dx = a.x - mouse.x; dy = a.y - mouse.y; d2 = dx * dx + dy * dy; if (d2 < (D * 1.4) * (D * 1.4)) { var al2 = (1 - Math.sqrt(d2) / (D * 1.4)) * 0.8; ctx.strokeStyle = 'rgba(' + acc2[0] + ',' + acc2[1] + ',' + acc2[2] + ',' + al2.toFixed(3) + ')'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke(); } }
    }
    /* knopen */
    for (i = 0; i < nodes.length; i++) { a = nodes[i]; ctx.fillStyle = 'rgba(' + acc[0] + ',' + acc[1] + ',' + acc[2] + ',.9)'; ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, 6.283); ctx.fill(); }
    if (mouse.on) { ctx.fillStyle = 'rgba(' + acc2[0] + ',' + acc2[1] + ',' + acc2[2] + ',1)'; ctx.beginPath(); ctx.arc(mouse.x, mouse.y, 4, 0, 6.283); ctx.fill(); ctx.strokeStyle = 'rgba(' + acc2[0] + ',' + acc2[1] + ',' + acc2[2] + ',.4)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(mouse.x, mouse.y, 10, 0, 6.283); ctx.stroke(); }
  }
  resize(); window.addEventListener('resize', function () { resize(); if (reduced) { draw(); } }, { passive: true });
  if (fine && !reduced) {
    canvas.addEventListener('pointermove', function (e) { var r = canvas.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; mouse.on = true; }, { passive: true });
    canvas.addEventListener('pointerleave', function () { mouse.on = false; });
  }
  if (reduced) { draw(); return; }
  function loop() { draw(); raf = requestAnimationFrame(loop); }
  document.addEventListener('visibilitychange', function () { if (document.hidden) { if (raf) { cancelAnimationFrame(raf); raf = null; } } else if (!raf) { raf = requestAnimationFrame(loop); } });
  raf = requestAnimationFrame(loop);
})();
