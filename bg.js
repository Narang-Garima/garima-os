/* ═══════════════════════════════════════════════
   GarimaOS — bg.js
   Floating data viz background:
   · Scatter plot clusters
   · Line / area charts
   · Pie / donut arcs
   · Neural network nodes + edges
   · Floating data labels
   · Bar chart silhouettes
   All at ~6-10% opacity so they never compete
   with foreground content.
═══════════════════════════════════════════════ */

(function () {
  'use strict';

  const canvas = document.getElementById('bgCanvas');
  const ctx    = canvas.getContext('2d');

  // ── Resize ──────────────────────────────────
  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', () => { resize(); buildScene(); });
  resize();

  // ── Theme colour helper ──────────────────────
  function accentColor() {
    const theme = document.documentElement.dataset.theme || 'default';
    if (theme === 'matrix')  return '#00ff41';
    if (theme === 'dracula') return '#bd93f9';
    return '#58a6ff'; // default
  }

  function hexToRgb(hex) {
    const r = parseInt(hex.slice(1,3),16);
    const g = parseInt(hex.slice(3,5),16);
    const b = parseInt(hex.slice(5,7),16);
    return `${r},${g},${b}`;
  }

  // ── Random helpers ───────────────────────────
  const rnd  = (min, max) => Math.random() * (max - min) + min;
  const rndI = (min, max) => Math.floor(rnd(min, max));
  const TAU  = Math.PI * 2;

  // ── Scene objects ────────────────────────────
  let objects = [];

  function buildScene() {
    objects = [];
    const W = canvas.width;
    const H = canvas.height;

    // 1. NEURAL NETWORK (nodes + edges) — full canvas backdrop
    buildNeuralNet(W, H);

    // 2. SCATTER PLOT CLUSTERS (3–4 clusters)
    const scatterCount = W > 900 ? 4 : 2;
    for (let i = 0; i < scatterCount; i++) {
      buildScatter(
        rnd(0.05, 0.85) * W,
        rnd(0.1,  0.9)  * H,
        rnd(90, 150),
        rndI(18, 35)
      );
    }

    // 3. LINE / AREA CHARTS (2–3 floaters)
    const lineCount = W > 900 ? 3 : 2;
    for (let i = 0; i < lineCount; i++) {
      buildLineChart(
        rnd(0.05, 0.6) * W,
        rnd(0.05, 0.8) * H,
        rnd(160, 260),
        rnd(60,  100)
      );
    }

    // 4. PIE / DONUT ARCS (2–3)
    const pieCount = W > 900 ? 3 : 2;
    for (let i = 0; i < pieCount; i++) {
      buildDonut(
        rnd(0.1, 0.9) * W,
        rnd(0.1, 0.9) * H,
        rnd(36, 60)
      );
    }

    // 5. BAR CHART SILHOUETTES (2)
    const barCount = W > 900 ? 2 : 1;
    for (let i = 0; i < barCount; i++) {
      buildBars(
        rnd(0.1, 0.75) * W,
        rnd(0.1, 0.85) * H,
        rnd(120, 200),
        rnd(50,  80)
      );
    }

    // 6. FLOATING DATA LABELS
    const labelCount = W > 900 ? 12 : 7;
    for (let i = 0; i < labelCount; i++) {
      buildLabel(rnd(0.02, 0.95) * W, rnd(0.02, 0.97) * H);
    }

    // 7. AI AGENT ORBS (drifting glowing circles with pulse)
    const orbCount = W > 900 ? 6 : 4;
    for (let i = 0; i < orbCount; i++) {
      buildOrb(rnd(0, W), rnd(0, H));
    }
  }

  // ────────────────────────────────────────────
  // NEURAL NETWORK
  // ────────────────────────────────────────────
  function buildNeuralNet(W, H) {
    const nodeCount = W > 900 ? 28 : 16;
    const nodes = [];
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: rnd(0, W),
        y: rnd(0, H),
        r: rnd(2, 4.5),
        vx: rnd(-0.18, 0.18),
        vy: rnd(-0.18, 0.18),
        pulse: rnd(0, TAU),
        pulseSpeed: rnd(0.008, 0.022),
      });
    }

    // Edges: connect nodes within a threshold
    const edges = [];
    const threshold = W > 900 ? 240 : 180;
    for (let a = 0; a < nodes.length; a++) {
      for (let b = a + 1; b < nodes.length; b++) {
        const dx = nodes[a].x - nodes[b].x;
        const dy = nodes[a].y - nodes[b].y;
        if (Math.hypot(dx, dy) < threshold) {
          edges.push([a, b]);
        }
      }
    }

    objects.push({
      type: 'neural',
      nodes,
      edges,
      W, H,
    });
  }

  // ────────────────────────────────────────────
  // SCATTER PLOT
  // ────────────────────────────────────────────
  function buildScatter(cx, cy, spread, count) {
    const points = [];
    for (let i = 0; i < count; i++) {
      // Two clusters within the scatter
      const cluster = i < count / 2 ? 0 : 1;
      const ox = cluster * spread * 0.5;
      const oy = cluster * spread * 0.3;
      points.push({
        x: cx + ox + rnd(-spread * 0.5, spread * 0.5),
        y: cy + oy + rnd(-spread * 0.4, spread * 0.4),
        r: rnd(1.5, 3.5),
        cluster,
        float: rnd(0, TAU),
        floatSpeed: rnd(0.004, 0.012),
        floatAmp: rnd(0.5, 2),
      });
    }
    // Trend line through cluster 0
    const c0 = points.filter(p => p.cluster === 0);
    let trendA = 0, trendB = 0;
    if (c0.length > 1) {
      const mx = c0.reduce((s,p) => s + p.x, 0) / c0.length;
      const my = c0.reduce((s,p) => s + p.y, 0) / c0.length;
      const num = c0.reduce((s,p) => s + (p.x - mx) * (p.y - my), 0);
      const den = c0.reduce((s,p) => s + (p.x - mx) ** 2, 0);
      trendA = den ? num / den : 0;
      trendB = my - trendA * mx;
    }
    objects.push({ type: 'scatter', points, trendA, trendB, cx, cy, spread, drift: rnd(0, TAU), driftSpeed: rnd(0.003, 0.008) });
  }

  // ────────────────────────────────────────────
  // LINE / AREA CHART
  // ────────────────────────────────────────────
  function buildLineChart(x, y, w, h) {
    const pts = rndI(8, 14);
    const data = [];
    let val = rnd(0.3, 0.7);
    for (let i = 0; i < pts; i++) {
      val += rnd(-0.15, 0.18);
      val = Math.max(0.05, Math.min(0.95, val));
      data.push(val);
    }
    objects.push({
      type: 'line',
      x, y, w, h,
      data,
      wave: rnd(0, TAU),
      waveSpeed: rnd(0.004, 0.01),
      drift: rnd(0, TAU),
      driftSpeed: rnd(0.002, 0.006),
    });
  }

  // ────────────────────────────────────────────
  // DONUT / PIE CHART
  // ────────────────────────────────────────────
  function buildDonut(cx, cy, r) {
    const sliceCount = rndI(3, 6);
    const rawSlices  = Array.from({ length: sliceCount }, () => rnd(1, 4));
    const total      = rawSlices.reduce((a, b) => a + b, 0);
    let angle = -Math.PI / 2;
    const slices = rawSlices.map(v => {
      const sweep = (v / total) * TAU;
      const s = { start: angle, sweep };
      angle += sweep;
      return s;
    });
    objects.push({
      type: 'donut',
      cx, cy, r,
      inner: r * 0.52,
      slices,
      spin: rnd(0, TAU),
      spinSpeed: rnd(0.001, 0.004) * (Math.random() < 0.5 ? 1 : -1),
      drift: rnd(0, TAU),
      driftSpeed: rnd(0.002, 0.006),
    });
  }

  // ────────────────────────────────────────────
  // BAR CHART
  // ────────────────────────────────────────────
  function buildBars(x, y, w, h) {
    const count = rndI(5, 9);
    const bars  = Array.from({ length: count }, () => rnd(0.2, 0.95));
    objects.push({
      type: 'bars',
      x, y, w, h,
      bars,
      wave: rnd(0, TAU),
      waveSpeed: rnd(0.005, 0.012),
      drift: rnd(0, TAU),
      driftSpeed: rnd(0.002, 0.006),
    });
  }

  // ────────────────────────────────────────────
  // FLOATING DATA LABELS
  // ────────────────────────────────────────────
  const LABEL_POOL = [
    '92.3%', '↑ 18%', 'p95: 4ms', '74,283', 'RAG',
    'AUC: 0.94', 'F1: 0.87', 'Δ +12%', 'SQL', 'dbt',
    'Snowflake', 'LangChain', 'Azure', 'Power BI',
    'χ²=3.8', 'R²=0.91', 'σ=1.2', '∑ 2.4M',
    'precision', 'recall', 'RMSE', 'XGBoost',
    '{}', '[]', '-->', '0101',
  ];

  function buildLabel(x, y) {
    objects.push({
      type: 'label',
      text: LABEL_POOL[rndI(0, LABEL_POOL.length)],
      x, y,
      baseX: x,
      baseY: y,
      drift: rnd(0, TAU),
      driftSpeed: rnd(0.003, 0.009),
      driftAmp: rnd(8, 22),
      fontSize: rnd(9, 13),
      opacity: rnd(0.04, 0.10),
    });
  }

  // ────────────────────────────────────────────
  // AI AGENT ORB
  // ────────────────────────────────────────────
  function buildOrb(x, y) {
    objects.push({
      type: 'orb',
      x, y,
      vx: rnd(-0.3, 0.3),
      vy: rnd(-0.3, 0.3),
      r: rnd(30, 70),
      pulse: rnd(0, TAU),
      pulseSpeed: rnd(0.01, 0.025),
    });
  }

  // ────────────────────────────────────────────
  // DRAW FUNCTIONS
  // ────────────────────────────────────────────
  function drawNeural(o, accent, rgb) {
    const { nodes, edges } = o;

    // Edges — very faint
    edges.forEach(([a, b]) => {
      const na = nodes[a], nb = nodes[b];
      const dx = na.x - nb.x, dy = na.y - nb.y;
      const dist = Math.hypot(dx, dy);
      const alpha = (1 - dist / 260) * 0.025;   // was 0.07
      if (alpha <= 0) return;
      ctx.beginPath();
      ctx.moveTo(na.x, na.y);
      ctx.lineTo(nb.x, nb.y);
      ctx.strokeStyle = `rgba(${rgb},${alpha})`;
      ctx.lineWidth = 0.4;
      ctx.stroke();
    });

    // Nodes — barely visible
    nodes.forEach(n => {
      const pulse = 0.5 + 0.5 * Math.sin(n.pulse);
      const alpha = 0.015 + pulse * 0.025;       // was 0.04 + 0.08
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r * (1 + pulse * 0.3), 0, TAU);
      ctx.fillStyle = `rgba(${rgb},${alpha})`;
      ctx.fill();
    });
  }

  function drawScatter(o, accent, rgb) {
    const { points, trendA, trendB } = o;

    // Trend line
    if (points.length > 2) {
      const xs = points.map(p => p.x);
      const xMin = Math.min(...xs), xMax = Math.max(...xs);
      ctx.beginPath();
      ctx.moveTo(xMin, trendA * xMin + trendB);
      ctx.lineTo(xMax, trendA * xMax + trendB);
      ctx.strokeStyle = `rgba(${rgb},0.025)`;    // was 0.06
      ctx.lineWidth = 0.8;
      ctx.setLineDash([4, 6]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Points
    points.forEach(p => {
      const float = Math.sin(p.float) * p.floatAmp;
      const alpha = p.cluster === 0 ? 0.04 : 0.028; // was 0.10 / 0.07
      ctx.beginPath();
      ctx.arc(p.x, p.y + float, p.r, 0, TAU);
      ctx.fillStyle = `rgba(${rgb},${alpha})`;
      ctx.fill();
    });
  }

  function drawLine(o, accent, rgb) {
    const { x, y, w, h, data, wave } = o;
    const step = w / (data.length - 1);

    // Area fill
    ctx.beginPath();
    ctx.moveTo(x, y + h);
    data.forEach((v, i) => {
      const wv = Math.sin(wave + i * 0.6) * 0.04;
      const px = x + i * step;
      const py = y + h - (v + wv) * h;
      i === 0 ? ctx.lineTo(px, py) : ctx.lineTo(px, py);
    });
    ctx.lineTo(x + w, y + h);
    ctx.closePath();
    ctx.fillStyle = `rgba(${rgb},0.018)`;        // was 0.04
    ctx.fill();

    // Line
    ctx.beginPath();
    data.forEach((v, i) => {
      const wv = Math.sin(wave + i * 0.6) * 0.04;
      const px = x + i * step;
      const py = y + h - (v + wv) * h;
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    });
    ctx.strokeStyle = `rgba(${rgb},0.045)`;      // was 0.12
    ctx.lineWidth = 1;
    ctx.stroke();

    // Dots on data points
    data.forEach((v, i) => {
      const wv = Math.sin(wave + i * 0.6) * 0.04;
      const px = x + i * step;
      const py = y + h - (v + wv) * h;
      ctx.beginPath();
      ctx.arc(px, py, 1.8, 0, TAU);
      ctx.fillStyle = `rgba(${rgb},0.07)`;       // was 0.18
      ctx.fill();
    });
  }

  function drawDonut(o, accent, rgb) {
    const { cx, cy, r, inner, slices, spin } = o;

    const hues = [
      `rgba(${rgb},0.05)`,   // was 0.13
      `rgba(${rgb},0.03)`,   // was 0.07
      `rgba(${rgb},0.04)`,   // was 0.10
      `rgba(${rgb},0.02)`,   // was 0.05
      `rgba(${rgb},0.035)`,  // was 0.08
    ];

    slices.forEach((s, i) => {
      ctx.beginPath();
      ctx.arc(cx, cy, r, s.start + spin, s.start + s.sweep + spin);
      ctx.arc(cx, cy, inner, s.start + s.sweep + spin, s.start + spin, true);
      ctx.closePath();
      ctx.fillStyle = hues[i % hues.length];
      ctx.fill();
      ctx.strokeStyle = `rgba(${rgb},0.02)`;     // was 0.05
      ctx.lineWidth = 0.5;
      ctx.stroke();
    });
  }

  function drawBars(o, accent, rgb) {
    const { x, y, w, h, bars, wave } = o;
    const barW = w / bars.length;
    const gap  = barW * 0.18;

    // Baseline
    ctx.beginPath();
    ctx.moveTo(x, y + h);
    ctx.lineTo(x + w, y + h);
    ctx.strokeStyle = `rgba(${rgb},0.03)`;       // was 0.08
    ctx.lineWidth = 0.6;
    ctx.stroke();

    bars.forEach((v, i) => {
      const wv = Math.sin(wave + i * 0.8) * 0.05;
      const barH = Math.max(4, (v + wv) * h);
      const bx = x + i * barW + gap / 2;
      const by = y + h - barH;
      ctx.fillStyle = `rgba(${rgb},0.04)`;       // was 0.10
      ctx.fillRect(bx, by, barW - gap, barH);
      // Top highlight
      ctx.fillStyle = `rgba(${rgb},0.025)`;      // was 0.06
      ctx.fillRect(bx, by, barW - gap, 1.5);
    });
  }

  function drawLabel(o, accent, rgb) {
    const fx = o.baseX + Math.sin(o.drift) * o.driftAmp;
    const fy = o.baseY + Math.cos(o.drift * 0.7) * o.driftAmp * 0.6;
    ctx.font = `${o.fontSize}px 'JetBrains Mono', monospace`;
    // Cap label opacity to max 0.055 regardless of stored value
    ctx.fillStyle = `rgba(${rgb},${Math.min(o.opacity * 0.55, 0.055)})`;
    ctx.fillText(o.text, fx, fy);
  }

  function drawOrb(o, accent, rgb) {
    const { x, y, r, pulse } = o;
    const p = 0.5 + 0.5 * Math.sin(pulse);
    const grad = ctx.createRadialGradient(x, y, 0, x, y, r * (1 + p * 0.3));
    grad.addColorStop(0,   `rgba(${rgb},0.028)`); // was 0.07
    grad.addColorStop(0.5, `rgba(${rgb},0.01)`);  // was 0.03
    grad.addColorStop(1,   `rgba(${rgb},0)`);
    ctx.beginPath();
    ctx.arc(x, y, r * (1 + p * 0.3), 0, TAU);
    ctx.fillStyle = grad;
    ctx.fill();
  }

  // ────────────────────────────────────────────
  // UPDATE (physics step)
  // ────────────────────────────────────────────
  function update() {
    const W = canvas.width;
    const H = canvas.height;

    objects.forEach(o => {
      switch (o.type) {

        case 'neural':
          o.nodes.forEach(n => {
            n.x += n.vx;
            n.y += n.vy;
            n.pulse += n.pulseSpeed;
            if (n.x < -20) n.x = W + 20;
            if (n.x > W + 20) n.x = -20;
            if (n.y < -20) n.y = H + 20;
            if (n.y > H + 20) n.y = -20;
          });
          break;

        case 'scatter':
          o.drift += o.driftSpeed;
          o.points.forEach(p => { p.float += p.floatSpeed; });
          break;

        case 'line':
          o.wave  += o.waveSpeed;
          o.drift += o.driftSpeed;
          // Gentle float
          o.y += Math.sin(o.drift) * 0.12;
          break;

        case 'donut':
          o.spin  += o.spinSpeed;
          o.drift += o.driftSpeed;
          o.cx += Math.sin(o.drift) * 0.08;
          o.cy += Math.cos(o.drift * 0.7) * 0.06;
          break;

        case 'bars':
          o.wave  += o.waveSpeed;
          o.drift += o.driftSpeed;
          break;

        case 'label':
          o.drift += o.driftSpeed;
          break;

        case 'orb':
          o.x    += o.vx;
          o.y    += o.vy;
          o.pulse += o.pulseSpeed;
          if (o.x < -o.r) o.x = W + o.r;
          if (o.x > W + o.r) o.x = -o.r;
          if (o.y < -o.r) o.y = H + o.r;
          if (o.y > H + o.r) o.y = -o.r;
          break;
      }
    });
  }

  // ────────────────────────────────────────────
  // RENDER LOOP
  // ────────────────────────────────────────────
  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const accent = accentColor();
    const rgb    = hexToRgb(accent);

    // Draw order: neural (back) → orbs → charts → labels (front)
    const order = ['neural', 'orb', 'donut', 'bars', 'line', 'scatter', 'label'];
    order.forEach(type => {
      objects.filter(o => o.type === type).forEach(o => {
        switch (type) {
          case 'neural':  drawNeural(o, accent, rgb);  break;
          case 'scatter': drawScatter(o, accent, rgb); break;
          case 'line':    drawLine(o, accent, rgb);    break;
          case 'donut':   drawDonut(o, accent, rgb);   break;
          case 'bars':    drawBars(o, accent, rgb);    break;
          case 'label':   drawLabel(o, accent, rgb);   break;
          case 'orb':     drawOrb(o, accent, rgb);     break;
        }
      });
    });
  }

  // ────────────────────────────────────────────
  // LOOP
  // ────────────────────────────────────────────
  function loop() {
    update();
    render();
    requestAnimationFrame(loop);
  }

  // Rebuild on theme change so colours update
  const themeSelect = document.getElementById('themeSelect');
  if (themeSelect) {
    themeSelect.addEventListener('change', () => {
      // Just re-render — colours are read live each frame
    });
  }

  // Init
  buildScene();
  loop();

})();
