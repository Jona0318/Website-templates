/* 31 — Neonburcht: synthwave perspectief-grid + neon-zon */
(function () {
  var canvas = document.getElementById('synCanvas'); if (!canvas || !canvas.getContext) { return; }
  var ctx = canvas.getContext('2d');
  var reduced = false; try { reduced = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  var dpr = Math.min(window.devicePixelRatio || 1, 2), W = 0, H = 0, raf = null, off = 0;
  function resize() { var r = canvas.getBoundingClientRect(); W = r.width; H = r.height; canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
  function draw() {
    var horizon = H * 0.52, cx = W / 2;
    /* lucht */
    var sky = ctx.createLinearGradient(0, 0, 0, horizon);
    sky.addColorStop(0, '#1a0633'); sky.addColorStop(0.6, '#3a0d52'); sky.addColorStop(1, '#7a1b63');
    ctx.fillStyle = sky; ctx.fillRect(0, 0, W, horizon);
    ctx.fillStyle = '#140426'; ctx.fillRect(0, horizon, W, H - horizon);
    /* zon */
    var sr = Math.min(W, H) * 0.22, sy = horizon - sr * 0.12;
    ctx.save();
    ctx.beginPath(); ctx.arc(cx, sy, sr, 0, Math.PI * 2); ctx.clip();
    var sg = ctx.createLinearGradient(0, sy - sr, 0, sy + sr);
    sg.addColorStop(0, '#ffe14d'); sg.addColorStop(0.5, '#ff5da2'); sg.addColorStop(1, '#b53bff');
    ctx.fillStyle = sg; ctx.fillRect(cx - sr, sy - sr, sr * 2, sr * 2);
    ctx.fillStyle = '#140426';
    for (var s = 0; s < 7; s++) { var yy = sy + sr * 0.12 + s * sr * 0.14; ctx.fillRect(cx - sr, yy, sr * 2, Math.max(2, sr * 0.04 + s * 1.4)); }
    ctx.restore();
    /* sterren */
    ctx.fillStyle = 'rgba(255,255,255,.7)';
    for (var st = 0; st < 40; st++) { var sx = (st * 97.13) % W, sty = (st * 53.7) % (horizon * 0.8); ctx.fillRect(sx, sty, 1.4, 1.4); }
    /* grid */
    ctx.lineWidth = 1.4;
    /* horizontale lijnen (scrollend) */
    var lines = 16;
    for (var i = 0; i < lines; i++) {
      var p = ((i + (off % 1)) / lines);
      var yy2 = horizon + (H - horizon) * p * p;
      var alpha = 0.15 + 0.55 * p;
      ctx.strokeStyle = 'rgba(54,231,255,' + alpha.toFixed(3) + ')';
      ctx.beginPath(); ctx.moveTo(0, yy2); ctx.lineTo(W, yy2); ctx.stroke();
    }
    /* verticale lijnen (convergeren naar vluchtpunt) */
    for (var j = -10; j <= 10; j++) {
      var xb = cx + j * (W * 0.5 / 10);
      ctx.strokeStyle = 'rgba(255,93,162,' + (0.5 - Math.min(0.4, Math.abs(j) * 0.03)).toFixed(3) + ')';
      ctx.beginPath(); ctx.moveTo(cx, horizon); ctx.lineTo(xb, H); ctx.stroke();
    }
    /* horizon-glow */
    var hg = ctx.createLinearGradient(0, horizon - 8, 0, horizon + 8);
    hg.addColorStop(0, 'rgba(54,231,255,0)'); hg.addColorStop(0.5, 'rgba(54,231,255,.9)'); hg.addColorStop(1, 'rgba(54,231,255,0)');
    ctx.fillStyle = hg; ctx.fillRect(0, horizon - 8, W, 16);
  }
  resize(); window.addEventListener('resize', function () { resize(); draw(); }, { passive: true });
  if (reduced) { draw(); return; }
  function loop() { off += 0.006; draw(); raf = requestAnimationFrame(loop); }
  document.addEventListener('visibilitychange', function () { if (document.hidden) { if (raf) { cancelAnimationFrame(raf); raf = null; } } else if (!raf) { raf = requestAnimationFrame(loop); } });
  raf = requestAnimationFrame(loop);
})();
