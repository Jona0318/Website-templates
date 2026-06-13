/* 30 — Groef: audiovisualizer (synthetisch; echte WebAudio op de speel-knop) */
(function () {
  var canvas = document.getElementById('grViz'); if (!canvas || !canvas.getContext) { return; }
  var ctx = canvas.getContext('2d');
  var record = document.getElementById('grRecord');
  var deck = document.getElementById('grDeck');
  var btn = document.getElementById('grPlay');
  var reduced = false; try { reduced = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  var dpr = Math.min(window.devicePixelRatio || 1, 2), W = 0, H = 0, raf = null;
  var BARS = 40;
  var audio = null, analyser = null, data = null, playing = false, nodes = [];

  function resize() { var r = canvas.getBoundingClientRect(); W = r.width; H = r.height; canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
  function accent() { return getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#e2562b'; }
  function accent2() { return getComputedStyle(document.documentElement).getPropertyValue('--accent-2').trim() || '#e8a93c'; }

  function draw(t) {
    ctx.clearRect(0, 0, W, H);
    var gw = W / BARS, g = ctx.createLinearGradient(0, 0, W, 0);
    g.addColorStop(0, accent()); g.addColorStop(1, accent2());
    ctx.fillStyle = g;
    for (var i = 0; i < BARS; i++) {
      var v;
      if (playing && analyser && data) { analyser.getByteFrequencyData(data); v = data[i * 2 % data.length] / 255; }
      else { v = 0.12 + 0.5 * Math.abs(Math.sin(i * 0.5 + t * 0.004) * Math.cos(i * 0.21 + t * 0.0021)); }
      var bh = Math.max(2, v * H);
      ctx.fillRect(i * gw + gw * 0.18, H - bh, gw * 0.64, bh);
    }
  }

  function startAudio() {
    try {
      var AC = window.AudioContext || window.webkitAudioContext; if (!AC) { return false; }
      audio = new AC();
      analyser = audio.createAnalyser(); analyser.fftSize = 128; data = new Uint8Array(analyser.frequencyBinCount);
      var master = audio.createGain(); master.gain.value = 0.06; master.connect(audio.destination); analyser.connect(master);
      var scale = [0, 3, 5, 7, 10, 12, 7, 3];
      var step = 0;
      function note() {
        if (!playing) { return; }
        var osc = audio.createOscillator(), gn = audio.createGain();
        osc.type = 'triangle';
        var semi = scale[step % scale.length] + (step % 16 < 8 ? 0 : -5);
        osc.frequency.value = 220 * Math.pow(2, semi / 12);
        gn.gain.setValueAtTime(0.0001, audio.currentTime);
        gn.gain.exponentialRampToValueAtTime(0.9, audio.currentTime + 0.02);
        gn.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + 0.32);
        osc.connect(gn); gn.connect(analyser);
        osc.start(); osc.stop(audio.currentTime + 0.34);
        nodes.push(osc);
        step++;
        timer = setTimeout(note, 260);
      }
      var timer; note();
      return true;
    } catch (e) { return false; }
  }
  function stopAudio() { if (audio) { try { audio.close(); } catch (e) {} audio = null; analyser = null; data = null; nodes = []; } }

  function setPlaying(on) {
    playing = on;
    if (record) { record.classList.toggle('spinning', on || !reduced ? true : false); }
    if (deck) { deck.classList.toggle('playing', on); }
    if (btn) { btn.innerHTML = on ? '⏸ Pauze' : '▶ Speel een groove'; }
    if (on) { startAudio(); } else { stopAudio(); }
  }
  if (btn) { btn.addEventListener('click', function () { setPlaying(!playing); }); }

  resize(); window.addEventListener('resize', function () { resize(); if (reduced && !playing) { draw(0); } }, { passive: true });
  /* plaat draait standaard mee (sfeer); stopt enkel bij reduced-motion tot je speelt */
  if (record && !reduced) { record.classList.add('spinning'); }
  if (reduced) { draw(0); }
  else { (function loop(t) { draw(t); raf = requestAnimationFrame(loop); })(0); }
  document.addEventListener('visibilitychange', function () { if (document.hidden && playing) { setPlaying(false); } });
})();
