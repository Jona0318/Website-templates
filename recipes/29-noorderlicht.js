/* 29 — Noorderlicht: canvas-aurora (golvende lichtgordijnen + sterren) */
(function () {
  var canvas = document.getElementById('auroCanvas'); if (!canvas || !canvas.getContext) { return; }
  var ctx = canvas.getContext('2d');
  var reduced = false; try { reduced = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  var dpr = Math.min(window.devicePixelRatio || 1, 2), W = 0, H = 0, raf = null, stars = [];
  var BANDS = [
    { col: [94, 240, 176], y: 0.34, amp: 0.10, freq: 1.6, sp: 0.00018, h: 0.42 },
    { col: [120, 200, 255], y: 0.40, amp: 0.13, freq: 1.1, sp: -0.00012, h: 0.46 },
    { col: [155, 123, 255], y: 0.30, amp: 0.08, freq: 2.2, sp: 0.00022, h: 0.38 }
  ];
  function rnd() { return Math.random(); }
  function makeStars() { stars = []; var n = Math.round(W * H / 9000); for (var i = 0; i < n; i++) { stars.push({ x: rnd() * W, y: rnd() * H * 0.7, r: rnd() * 1.3 + 0.2, a: rnd() * 0.6 + 0.2, tw: rnd() * 6.28 }); } }
  function resize() { var r = canvas.getBoundingClientRect(); W = r.width; H = r.height; canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); makeStars(); }
  function draw(t) {
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < stars.length; i++) { var s = stars[i]; var a = reduced ? s.a : s.a * (0.5 + 0.5 * Math.sin(t * 0.002 + s.tw)); ctx.fillStyle = 'rgba(235,242,255,' + a.toFixed(3) + ')'; ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.283); ctx.fill(); }
    ctx.globalCompositeOperation = 'lighter';
    for (var b = 0; b < BANDS.length; b++) {
      var band = BANDS[b], baseY = band.y * H, amp = band.amp * H, bh = band.h * H;
      var grad = ctx.createLinearGradient(0, baseY - bh * 0.2, 0, baseY + bh);
      var c = band.col;
      grad.addColorStop(0, 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',0)');
      grad.addColorStop(0.35, 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',0.22)');
      grad.addColorStop(1, 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',0)');
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.moveTo(0, H);
      var ph = reduced ? b : t * band.sp;
      for (var x = 0; x <= W; x += 10) { var y = baseY + Math.sin(x / W * band.freq * 6.283 + ph) * amp + Math.sin(x / W * band.freq * 2.1 + ph * 1.7) * amp * 0.4; ctx.lineTo(x, y); }
      ctx.lineTo(W, H); ctx.closePath(); ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
  }
  resize(); window.addEventListener('resize', function () { resize(); if (reduced) { draw(0); } }, { passive: true });
  if (reduced) { draw(0); return; }
  function loop(t) { draw(t); raf = requestAnimationFrame(loop); }
  document.addEventListener('visibilitychange', function () { if (document.hidden) { if (raf) { cancelAnimationFrame(raf); raf = null; } } else if (!raf) { raf = requestAnimationFrame(loop); } });
  raf = requestAnimationFrame(loop);
})();
