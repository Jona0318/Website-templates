/* 37 — Tij: gelaagde golvende zee */
(function () {
  var canvas = document.getElementById('tijCanvas'); if (!canvas || !canvas.getContext) { return; }
  var ctx = canvas.getContext('2d');
  var reduced = false; try { reduced = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  var dpr = Math.min(window.devicePixelRatio || 1, 2), W = 0, H = 0, raf = null;
  function cssvar(n, f) { var v = getComputedStyle(document.documentElement).getPropertyValue(n).trim(); return v || f; }
  function toRgb(hex, f) { var h = (hex || f).replace('#', ''); if (h.length === 3) { h = h.split('').map(function (c) { return c + c; }).join(''); } var n = parseInt(h, 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
  function mix(a, b, t) { return [Math.round(a[0] + (b[0] - a[0]) * t), Math.round(a[1] + (b[1] - a[1]) * t), Math.round(a[2] + (b[2] - a[2]) * t)]; }
  var teal, deep;
  var layers = [
    { y: 0.52, amp: 0.030, len: 1.1, sp: 0.00022, sh: 0.30 },
    { y: 0.60, amp: 0.040, len: 0.8, sp: -0.00018, sh: 0.55 },
    { y: 0.70, amp: 0.052, len: 0.6, sp: 0.00026, sh: 0.78 },
    { y: 0.82, amp: 0.060, len: 0.5, sp: -0.00014, sh: 1.0 }
  ];
  function resize() { var r = canvas.getBoundingClientRect(); W = r.width; H = r.height; canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
  function draw(t) {
    teal = toRgb(cssvar('--accent', '#0fa3a3'), '#0fa3a3'); deep = mix(teal, [6, 30, 36], 0.55);
    ctx.clearRect(0, 0, W, H);
    for (var l = 0; l < layers.length; l++) {
      var L = layers[l], baseY = L.y * H, amp = L.amp * H;
      var c = mix(mix(teal, [255, 255, 255], 0.25 * (1 - L.sh)), deep, L.sh);
      var ph = reduced ? l * 1.3 : t * L.sp;
      ctx.beginPath(); ctx.moveTo(0, H);
      ctx.lineTo(0, baseY);
      for (var x = 0; x <= W; x += 8) { var y = baseY + Math.sin(x / W * L.len * 6.283 + ph) * amp + Math.sin(x / W * L.len * 2.7 + ph * 1.6) * amp * 0.35; ctx.lineTo(x, y); }
      ctx.lineTo(W, H); ctx.closePath();
      ctx.fillStyle = 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',0.96)'; ctx.fill();
      /* schuim op de voorste lagen */
      if (l >= 2) {
        ctx.beginPath();
        for (var fx = 0; fx <= W; fx += 8) { var fy = baseY + Math.sin(fx / W * L.len * 6.283 + ph) * amp + Math.sin(fx / W * L.len * 2.7 + ph * 1.6) * amp * 0.35; if (fx === 0) { ctx.moveTo(fx, fy); } else { ctx.lineTo(fx, fy); } }
        ctx.strokeStyle = 'rgba(255,255,255,' + (l === 3 ? 0.5 : 0.28) + ')'; ctx.lineWidth = 1.4; ctx.stroke();
      }
    }
  }
  resize(); window.addEventListener('resize', function () { resize(); if (reduced) { draw(0); } }, { passive: true });
  if (reduced) { draw(0); return; }
  function loop(t) { draw(t); raf = requestAnimationFrame(loop); }
  document.addEventListener('visibilitychange', function () { if (document.hidden) { if (raf) { cancelAnimationFrame(raf); raf = null; } } else if (!raf) { raf = requestAnimationFrame(loop); } });
  raf = requestAnimationFrame(loop);
})();
