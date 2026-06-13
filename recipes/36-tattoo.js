/* 36 — Inktzwart: inkt-splatters die je met de cursor tekent */
(function () {
  var canvas = document.getElementById('inkCanvas'); if (!canvas || !canvas.getContext) { return; }
  var ctx = canvas.getContext('2d');
  var hero = canvas.closest('.ink-hero');
  var reduced = false; try { reduced = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  var fine = false; try { fine = matchMedia('(pointer:fine)').matches; } catch (e) {}
  var dpr = Math.min(window.devicePixelRatio || 1, 2), W = 0, H = 0, splats = [], MAX = 300, lastX = 0, lastY = 0;
  function cssvar(n, f) { var v = getComputedStyle(document.documentElement).getPropertyValue(n).trim(); return v || f; }
  function resize() { var r = canvas.getBoundingClientRect(); W = r.width; H = r.height; canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); render(); }
  function mkSplat(x, y, scale, red) {
    var blob = [], a, i, n = 7 + Math.floor(Math.random() * 4);
    for (i = 0; i < n; i++) { a = i / n * 6.283; blob.push({ a: a, r: (8 + Math.random() * 10) * scale }); }
    var drops = [], dn = 2 + Math.floor(Math.random() * 5);
    for (i = 0; i < dn; i++) { var ang = Math.random() * 6.283, dist = (12 + Math.random() * 34) * scale; drops.push({ x: Math.cos(ang) * dist, y: Math.sin(ang) * dist, r: (1 + Math.random() * 3.5) * scale }); }
    return { x: x, y: y, blob: blob, drops: drops, red: red };
  }
  function add(x, y, scale, red) { splats.push(mkSplat(x, y, scale, red)); if (splats.length > MAX) { splats.shift(); } render(); }
  function drawSplat(s, black, red) {
    ctx.fillStyle = s.red ? red : black;
    ctx.beginPath();
    for (var i = 0; i < s.blob.length; i++) { var b = s.blob[i]; var px = s.x + Math.cos(b.a) * b.r, py = s.y + Math.sin(b.a) * b.r; if (i === 0) { ctx.moveTo(px, py); } else { var pb = s.blob[i - 1]; var mx = (s.x + Math.cos(pb.a) * pb.r + px) / 2, my = (s.y + Math.sin(pb.a) * pb.r + py) / 2; ctx.quadraticCurveTo(s.x + Math.cos(pb.a) * pb.r, s.y + Math.sin(pb.a) * pb.r, mx, my); } }
    ctx.closePath(); ctx.fill();
    for (i = 0; i < s.drops.length; i++) { ctx.beginPath(); ctx.arc(s.x + s.drops[i].x, s.y + s.drops[i].y, s.drops[i].r, 0, 6.283); ctx.fill(); }
  }
  function render() {
    var black = cssvar('--ink', '#f2ece0'); /* op donkere bg tekenen we met inkt = ink kleur? nee: gebruik zwart/rood */
    black = '#0a0a0a'; var red = cssvar('--accent', '#e11d2a');
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < splats.length; i++) { drawSplat(splats[i], black, red); }
  }
  resize(); window.addEventListener('resize', resize, { passive: true });

  /* decoratieve start-splatters */
  for (var d = 0; d < (reduced ? 26 : 14); d++) { splats.push(mkSplat(Math.random() * W, Math.random() * H, 0.7 + Math.random() * 1.6, Math.random() < 0.16)); }
  render();

  if (!reduced && fine) {
    canvas.addEventListener('pointermove', function (e) {
      var r = canvas.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      var dx = x - lastX, dy = y - lastY; if (dx * dx + dy * dy < 90) { return; }
      lastX = x; lastY = y;
      add(x, y, 0.6 + Math.random() * 0.8, Math.random() < 0.16);
      if (hero) { hero.classList.add('drawn'); }
    }, { passive: true });
    canvas.addEventListener('pointerdown', function (e) { var r = canvas.getBoundingClientRect(); add(e.clientX - r.left, e.clientY - r.top, 1.6, Math.random() < 0.3); if (hero) { hero.classList.add('drawn'); } });
  }
})();
