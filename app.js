(() => {
  'use strict';

  // ════════════════════════════════════════
  //  DATA – hardcoded cards
  // ════════════════════════════════════════
  const CARDS = [
    {
      id: 'fascination',
      title: 'Fascination Research',
      phase: 'Research',
      desc: 'My initial research into my fascination. This laid the foundation for the rest of the process.',
      link: 'https://shkamp8-tech.github.io/fascination-project-research/',
      date: '2026-04-08',
      x: 100,
      y: 250,
    },
    {
      id: 'wordweb',
      title: 'Wordweb',
      phase: 'Research',
      desc: 'Based on the fascination research, I created a wordweb to explore connections and themes.',
      link: 'https://shkamp8-tech.github.io/wordweb/',
      date: '2026-04-08',
      x: 550,
      y: 350,
    },
    {
      id: 'oldschool',
      title: 'Old School Projects',
      phase: 'Analysis',
      desc: '',
      link: '',
      date: '',
      x: 620,
      y: 120,
      small: true,
    },
  ];

  // Connections between cards (by id)
  const CONNECTIONS = [
    ['fascination', 'wordweb'],
    ['oldschool', 'wordweb'],
  ];

  const PHASE_COLORS = {
    'Research':   'var(--phase-research)',
    'Concepting': 'var(--phase-concepting)',
    'Design':     'var(--phase-design)',
    'Prototype':  'var(--phase-prototype)',
    'Testing':    'var(--phase-testing)',
    'Reflection': 'var(--phase-reflection)',
    'Analysis':   'var(--phase-analysis)',
  };

  // ════════════════════════════════════════
  //  THEME
  // ════════════════════════════════════════
  const THEME_KEY = 'processbook_theme';
  const themeBtn = document.getElementById('themeToggle');

  function setTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem(THEME_KEY, t);
    themeBtn.textContent = t === 'dark' ? '☀️' : '🌙';
  }
  themeBtn.addEventListener('click', () => {
    const cur = document.documentElement.getAttribute('data-theme');
    setTheme(cur === 'dark' ? 'light' : 'dark');
  });
  setTheme(localStorage.getItem(THEME_KEY) || 'light');

  // ════════════════════════════════════════
  //  PAN & ZOOM
  // ════════════════════════════════════════
  const viewport  = document.getElementById('viewport');
  const canvas    = document.getElementById('canvas');
  const zoomLabel = document.getElementById('zoomLabel');

  let panX = 0, panY = 0, scale = 1;
  let isPanning = false, startX = 0, startY = 0;

  const MIN_SCALE = 0.2, MAX_SCALE = 3;

  function applyTransform() {
    canvas.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`;
    zoomLabel.textContent = Math.round(scale * 100) + '%';
    updateMinimap();
  }

  // Mouse pan
  viewport.addEventListener('mousedown', (e) => {
    if (e.target.closest('.card')) return;
    isPanning = true;
    startX = e.clientX - panX;
    startY = e.clientY - panY;
    document.body.classList.add('grabbing');
  });
  window.addEventListener('mousemove', (e) => {
    if (!isPanning) return;
    panX = e.clientX - startX;
    panY = e.clientY - startY;
    applyTransform();
  });
  window.addEventListener('mouseup', () => {
    isPanning = false;
    document.body.classList.remove('grabbing');
  });

  // Scroll zoom (toward cursor)
  viewport.addEventListener('wheel', (e) => {
    e.preventDefault();
    const rect = viewport.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale * delta));

    panX = mx - (mx - panX) * (newScale / scale);
    panY = my - (my - panY) * (newScale / scale);
    scale = newScale;
    applyTransform();
  }, { passive: false });

  // Touch pan & pinch zoom
  let lastTouchDist = 0;
  viewport.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      isPanning = true;
      startX = e.touches[0].clientX - panX;
      startY = e.touches[0].clientY - panY;
    } else if (e.touches.length === 2) {
      isPanning = false;
      lastTouchDist = Math.hypot(
        e.touches[1].clientX - e.touches[0].clientX,
        e.touches[1].clientY - e.touches[0].clientY
      );
    }
  }, { passive: false });
  viewport.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (e.touches.length === 1 && isPanning) {
      panX = e.touches[0].clientX - startX;
      panY = e.touches[0].clientY - startY;
      applyTransform();
    } else if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[1].clientX - e.touches[0].clientX,
        e.touches[1].clientY - e.touches[0].clientY
      );
      const cx = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const cy = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      const rect = viewport.getBoundingClientRect();
      const mx = cx - rect.left, my = cy - rect.top;
      const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale * (dist / lastTouchDist)));
      panX = mx - (mx - panX) * (newScale / scale);
      panY = my - (my - panY) * (newScale / scale);
      scale = newScale;
      lastTouchDist = dist;
      applyTransform();
    }
  }, { passive: false });
  viewport.addEventListener('touchend', () => { isPanning = false; });

  // Zoom buttons
  document.getElementById('zoomIn').addEventListener('click', () => {
    const rect = viewport.getBoundingClientRect();
    const cx = rect.width / 2, cy = rect.height / 2;
    const newScale = Math.min(MAX_SCALE, scale * 1.25);
    panX = cx - (cx - panX) * (newScale / scale);
    panY = cy - (cy - panY) * (newScale / scale);
    scale = newScale;
    applyTransform();
  });
  document.getElementById('zoomOut').addEventListener('click', () => {
    const rect = viewport.getBoundingClientRect();
    const cx = rect.width / 2, cy = rect.height / 2;
    const newScale = Math.max(MIN_SCALE, scale * 0.8);
    panX = cx - (cx - panX) * (newScale / scale);
    panY = cy - (cy - panY) * (newScale / scale);
    scale = newScale;
    applyTransform();
  });
  document.getElementById('resetView').addEventListener('click', resetView);

  function resetView() {
    if (CARDS.length === 0) { panX = 0; panY = 0; scale = 1; applyTransform(); return; }
    const rect = viewport.getBoundingClientRect();
    const minX = Math.min(...CARDS.map(c => c.x));
    const minY = Math.min(...CARDS.map(c => c.y));
    const maxX = Math.max(...CARDS.map(c => c.x + 320));
    const maxY = Math.max(...CARDS.map(c => c.y + 220));
    const cw = maxX - minX, ch = maxY - minY;
    scale = Math.min(1, (rect.width - 100) / cw, (rect.height - 100) / ch);
    panX = (rect.width - cw * scale) / 2 - minX * scale;
    panY = (rect.height - ch * scale) / 2 - minY * scale;
    applyTransform();
  }

  // ════════════════════════════════════════
  //  RENDER CARDS
  // ════════════════════════════════════════
  function sanitize(str) {
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }

  function formatDate(ds) {
    if (!ds) return '';
    return new Date(ds).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  function renderCards() {
    let html = '';

    // SVG connectors
    html += '<svg class="connectors" style="position:absolute;top:0;left:0;width:9999px;height:9999px;pointer-events:none;z-index:1;overflow:visible;">';
    CONNECTIONS.forEach(([fromId, toId]) => {
      const from = CARDS.find(c => c.id === fromId);
      const to   = CARDS.find(c => c.id === toId);
      if (!from || !to) return;
      const fw = from.small ? 200 : 320;
      const tw = to.small ? 200 : 320;
      const fh = from.small ? 80 : 200;

      // From: bottom center of 'from' card
      const x1 = from.x + fw / 2;
      const y1 = from.y + fh;
      // To: top center of 'to' card
      const x2 = to.x + tw / 2;
      const y2 = to.y;
      // Smooth cubic bezier curve
      const midY = (y1 + y2) / 2;
      html += `<path d="M${x1},${y1} C${x1},${midY} ${x2},${midY} ${x2},${y2}" />`;
    });
    html += '</svg>';

    // Cards
    CARDS.forEach(card => {
      const color = PHASE_COLORS[card.phase] || 'var(--text-muted)';
      const linkHtml = card.link
        ? `<a class="card__link" href="${sanitize(card.link)}" target="_blank" rel="noopener noreferrer">View research ↗</a>`
        : '';
      const smallClass = card.small ? ' card--small' : '';
      const cardWidth = card.small ? 200 : 320;
      html += `
      <div class="card${smallClass}" style="left:${card.x}px; top:${card.y}px;">
        <div class="card__bar" style="background:${color}"></div>
        <div class="card__body">
          <h3 class="card__title">${sanitize(card.title)}</h3>
          <span class="card__badge" style="background:${color}">${sanitize(card.phase)}</span>
          ${card.desc ? `<p class="card__desc">${sanitize(card.desc)}</p>` : ''}
          <div class="card__footer">
            <span class="card__date">${formatDate(card.date)}</span>
            ${linkHtml}
          </div>
        </div>
      </div>`;
    });

    canvas.innerHTML = html;
  }

  // ════════════════════════════════════════
  //  MINIMAP
  // ════════════════════════════════════════
  const minimap = document.getElementById('minimap');

  function updateMinimap() {
    if (CARDS.length === 0) return;
    const mmW = 180, mmH = 120;
    const pad = 80;
    const minX = Math.min(...CARDS.map(c => c.x)) - pad;
    const minY = Math.min(...CARDS.map(c => c.y)) - pad;
    const maxX = Math.max(...CARDS.map(c => c.x + 320)) + pad;
    const maxY = Math.max(...CARDS.map(c => c.y + 220)) + pad;
    const worldW = maxX - minX, worldH = maxY - minY;
    const s = Math.min(mmW / worldW, mmH / worldH);

    let html = '';
    CARDS.forEach(card => {
      const cx = (card.x + 160 - minX) * s;
      const cy = (card.y + 100 - minY) * s;
      const color = PHASE_COLORS[card.phase] || '#888';
      html += `<div class="minimap__dot" style="left:${cx - 3}px;top:${cy - 3}px;background:${color}"></div>`;
    });

    const rect = viewport.getBoundingClientRect();
    const vx = (-panX / scale - minX) * s;
    const vy = (-panY / scale - minY) * s;
    const vw = (rect.width / scale) * s;
    const vh = (rect.height / scale) * s;
    html += `<div class="minimap__viewport" style="left:${vx}px;top:${vy}px;width:${vw}px;height:${vh}px"></div>`;

    minimap.innerHTML = html;
  }

  // ════════════════════════════════════════
  //  INIT
  // ════════════════════════════════════════
  renderCards();
  resetView();
})();
