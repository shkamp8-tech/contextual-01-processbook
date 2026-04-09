(() => {
  'use strict';

  // ════════════════════════════════════════
  //  ACCESS CODE GATE
  // ════════════════════════════════════════
  const ACCESS_PIN = '0003';
  const lockscreen = document.getElementById('lockscreen');
  const lockDigits = lockscreen.querySelectorAll('.lock__digit');
  const lockError  = document.getElementById('lockError');

  // If already unlocked this session, skip
  if (sessionStorage.getItem('pb_unlocked') === '1') {
    lockscreen.classList.add('hidden');
  }

  lockDigits.forEach((input, i) => {
    input.addEventListener('input', () => {
      input.value = input.value.replace(/[^0-9]/g, '');
      if (input.value && i < lockDigits.length - 1) {
        lockDigits[i + 1].focus();
      }
      // Check if all filled
      const code = Array.from(lockDigits).map(d => d.value).join('');
      if (code.length === 4) {
        if (code === ACCESS_PIN) {
          sessionStorage.setItem('pb_unlocked', '1');
          lockscreen.classList.add('hidden');
        } else {
          lockError.textContent = 'Incorrect code';
          lockDigits.forEach(d => {
            d.classList.add('shake');
            setTimeout(() => { d.value = ''; d.classList.remove('shake'); }, 400);
          });
          setTimeout(() => { lockDigits[0].focus(); lockError.textContent = ''; }, 500);
        }
      }
    });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !input.value && i > 0) {
        lockDigits[i - 1].focus();
      }
    });
  });

  // ════════════════════════════════════════
  //  DATA – hardcoded cards
  // ════════════════════════════════════════
  const CARDS = [
    {
      id: 'fascination',
      title: 'Fascination Research',
      phase: 'Research',
      desc: '',
      link: 'https://shkamp8-tech.github.io/fascination-project-research/',
      date: '2026-04-08',
      pin: '0001',
      x: 100,
      y: 100,
    },
    {
      id: 'fascination-photo',
      title: 'Fascination',
      phase: '',
      desc: '',
      link: '',
      date: '',
      pin: '',
      x: 520,
      y: 50,
      image: 'assets/fascination.jpg',
    },
    {
      id: 'fascination-info',
      title: '',
      phase: 'Research',
      desc: 'This project is an interactive light installation where the user controls 21 individual mirrors to discover patterns, outputs, and the balance between order, chaos, control, and unpredictability.',
      link: '',
      date: '',
      pin: '',
      x: 520,
      y: 380,
      info: true,
    },
    {
      id: 'wordweb',
      title: 'Wordweb',
      phase: 'Research',
      desc: 'Based on the fascination research, I created a wordweb to explore connections and themes.',
      link: 'https://shkamp8-tech.github.io/wordweb/',
      date: '2026-04-08',
      pin: '0002',
      x: 100,
      y: 650,
    },
    {
      id: 'wordweb-preview',
      title: 'Wordweb Visualization',
      phase: '',
      desc: '',
      link: '',
      date: '',
      pin: '',
      x: 500,
      y: 650,
      image: 'assets/wordweb.png',
    },
    {
      id: 'oldschool',
      title: 'Old School Projects',
      phase: 'Analysis',
      desc: '',
      link: '',
      date: '',
      pin: '',
      x: 1000,
      y: 120,
      small: true,
    },
    {
      id: 'interview',
      title: 'Interview',
      phase: 'Research',
      desc: '',
      link: '',
      date: '2026-04-08',
      pin: '',
      x: 100,
      y: 950,
      small: true,
    },
    {
      id: 'notes',
      title: 'Notes',
      phase: 'Research',
      desc: '',
      link: '',
      date: '2026-04-08',
      pin: '',
      x: 320,
      y: 950,
      small: true,
    },
    {
      id: 'theme',
      title: 'Theme',
      phase: 'Concepting',
      desc: '',
      link: '',
      date: '2026-04-08',
      pin: '',
      x: 200,
      y: 1100,
      small: true,
    },
  ];

  // Connections: [fromId, toId, fromSide, toSide]
  // sides: 'bottom', 'top', 'left', 'right'
  const CONNECTIONS = [
    ['fascination', 'wordweb', 'bottom', 'top'],
    ['fascination', 'fascination-photo', 'right', 'left'],
    ['fascination', 'fascination-info', 'right', 'left'],
    ['oldschool', 'wordweb', 'bottom', 'top'],
    ['wordweb', 'wordweb-preview', 'right', 'left'],
    ['fascination-info', 'interview', 'bottom', 'top'],
    ['fascination-info', 'notes', 'bottom', 'top'],
    ['wordweb', 'theme', 'bottom', 'top'],
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
  let editMode = false;
  let isDragging = false;
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

  // Mouse pan — only when not dragging a card
  viewport.addEventListener('mousedown', (e) => {
    if (isDragging) return;
    if (editMode && e.target.closest('.card')) return;
    if (!editMode && e.target.closest('.card')) return;
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
    // Render cards first
    let cardsHtml = '';
    const handles = editMode ? `
        <div class="handle handle--top" data-side="top"></div>
        <div class="handle handle--bottom" data-side="bottom"></div>
        <div class="handle handle--left" data-side="left"></div>
        <div class="handle handle--right" data-side="right"></div>` : '';

    CARDS.forEach(card => {
      const color = PHASE_COLORS[card.phase] || 'var(--text-muted)';

      // Image preview card
      if (card.image) {
        const linkOpen = card.link
          ? `<a href="${sanitize(card.link)}" target="_blank" rel="noopener noreferrer">`
          : '<div>';
        const linkClose = card.link ? '</a>' : '</div>';
        cardsHtml += `
        <div class="card card--preview" id="card-${card.id}" style="left:${card.x}px; top:${card.y}px;">
          ${linkOpen}
            <img class="card__image" src="${sanitize(card.image)}" alt="${sanitize(card.title)}" />
            <span class="card__image-label">${sanitize(card.title)} ${card.link ? '↗' : ''}</span>
          ${linkClose}
          ${handles}
        </div>`;
        return;
      }

      // Info box card
      if (card.info) {
        cardsHtml += `
        <div class="card card--info" id="card-${card.id}" style="left:${card.x}px; top:${card.y}px;">
          <div class="card__body">
            <p class="card__desc">${sanitize(card.desc)}</p>
          </div>
          ${handles}
        </div>`;
        return;
      }

      const linkHtml = card.link
        ? `<a class="card__link" href="${sanitize(card.link)}" target="_blank" rel="noopener noreferrer">View research ↗</a>`
        : '';
      const smallClass = card.small ? ' card--small' : '';
      cardsHtml += `
      <div class="card${smallClass}" id="card-${card.id}" style="left:${card.x}px; top:${card.y}px;">
        <div class="card__bar" style="background:${color}"></div>
        <div class="card__body">
          <h3 class="card__title">${sanitize(card.title)}</h3>
          <span class="card__badge" style="background:${color}">${sanitize(card.phase)}</span>
          ${card.desc ? `<p class="card__desc">${sanitize(card.desc)}</p>` : ''}
          <div class="card__footer">
            <span class="card__date">${formatDate(card.date)}</span>
            ${linkHtml}
          </div>
          ${card.pin ? `<div class="card__pin">${sanitize(card.pin)}</div>` : ''}
        </div>
        ${handles}
      </div>`;
    });
    canvas.innerHTML = cardsHtml;

    // Measure actual card sizes and draw connectors
    requestAnimationFrame(() => {
      drawConnectors();
      setupDrag();
    });
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
  //  EDITOR MODE
  // ════════════════════════════════════════
  const editToggle  = document.getElementById('editToggle');
  const addCardBtn  = document.getElementById('addCard');
  const addConnBtn  = document.getElementById('addConn');
  const exportBtn   = document.getElementById('exportData');
  const ctxMenu     = document.getElementById('ctxMenu');
  const modalOverlay = document.getElementById('modalOverlay');
  const cardForm    = document.getElementById('cardForm');
  const modalTitle  = document.getElementById('modalTitle');
  const connOverlay = document.getElementById('connOverlay');
  const connForm    = document.getElementById('connForm');
  let editingCardId = null; // null = new card
  let connFromId    = null; // for "connect from here"

  editToggle.addEventListener('click', () => {
    editMode = !editMode;
    document.body.classList.toggle('editing-mode', editMode);
    editToggle.textContent = editMode ? '🔒 Lock' : '✏️ Edit';
    [addCardBtn, addConnBtn, exportBtn].forEach(b => b.style.display = editMode ? '' : 'none');
    hideCtx();
    renderCards();
  });

  // ── Context menu ──
  let ctxCardId = null;
  function showCtx(x, y, cardId) {
    ctxCardId = cardId;
    ctxMenu.style.left = x + 'px';
    ctxMenu.style.top = y + 'px';
    ctxMenu.style.display = '';
  }
  function hideCtx() { ctxMenu.style.display = 'none'; ctxCardId = null; }
  document.addEventListener('click', (e) => { if (!e.target.closest('.ctx-menu')) hideCtx(); });

  ctxMenu.addEventListener('click', (e) => {
    const action = e.target.dataset.action;
    if (!action || !ctxCardId) return;
    if (action === 'edit') openEditModal(ctxCardId);
    if (action === 'delete') deleteCard(ctxCardId);
    if (action === 'conn-from') { connFromId = ctxCardId; alert('Now right-click the target card and choose "Connect from here" again, or use the "+ Line" button.'); }
    hideCtx();
  });

  // ── Card dragging ──
  // ── Card dragging + handle connections ──
  const GRID = 20;
  function snapTo(v) { return Math.round(v / GRID) * GRID; }

  function setupDrag() {
    if (!editMode) return;
    document.querySelectorAll('.card').forEach(el => {
      el.addEventListener('mousedown', onDragStart);
      el.addEventListener('contextmenu', onCardCtx);
    });
    document.querySelectorAll('.handle').forEach(h => {
      h.addEventListener('mousedown', onHandleStart);
    });
  }

  let dragCard = null, dragOffX = 0, dragOffY = 0;
  function onDragStart(e) {
    if (!editMode) return;
    if (e.button === 2) return; // right-click
    const el = e.target.closest('.card');
    if (!el) return;
    // Don't drag if clicking a link or handle
    if (e.target.closest('a')) return;
    if (e.target.closest('.handle')) return;
    e.stopPropagation();
    isDragging = true;
    dragCard = el;
    dragCard.classList.add('dragging');
    const id = el.id.replace('card-', '');
    const card = CARDS.find(c => c.id === id);
    if (!card) return;
    dragOffX = (e.clientX - panX) / scale - card.x;
    dragOffY = (e.clientY - panY) / scale - card.y;

    function onMove(ev) {
      card.x = snapTo(Math.round((ev.clientX - panX) / scale - dragOffX));
      card.y = snapTo(Math.round((ev.clientY - panY) / scale - dragOffY));
      el.style.left = card.x + 'px';
      el.style.top = card.y + 'px';
      drawConnectors();
      updateMinimap();
    }
    function onUp() {
      isDragging = false;
      if (dragCard) dragCard.classList.remove('dragging');
      dragCard = null;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    }
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }

  // \u2500\u2500 Drag from handle to create connection (Obsidian-style) \u2500\u2500
  let connDragLine = null;
  function onHandleStart(e) {
    e.stopPropagation();
    e.preventDefault();
    const handle = e.target;
    const cardEl = handle.closest('.card');
    const fromId = cardEl.id.replace('card-', '');
    const fromSide = handle.dataset.side;
    const from = CARDS.find(c => c.id === fromId);
    if (!from) return;

    // Create temp SVG line
    let svg = canvas.querySelector('.conn-temp');
    if (!svg) {
      svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.classList.add('conn-temp');
      svg.setAttribute('style', 'position:absolute;top:0;left:0;width:9999px;height:9999px;pointer-events:none;z-index:10;overflow:visible;');
      canvas.appendChild(svg);
    }
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('stroke', 'var(--accent)');
    line.setAttribute('stroke-width', '2');
    line.setAttribute('stroke-dasharray', '6 4');
    svg.appendChild(line);

    const fw = cardEl.offsetWidth, fh = cardEl.offsetHeight;
    let ox, oy;
    if (fromSide === 'top') { ox = from.x + fw / 2; oy = from.y; }
    else if (fromSide === 'bottom') { ox = from.x + fw / 2; oy = from.y + fh; }
    else if (fromSide === 'left') { ox = from.x; oy = from.y + fh / 2; }
    else { ox = from.x + fw; oy = from.y + fh / 2; }

    line.setAttribute('x1', ox);
    line.setAttribute('y1', oy);
    line.setAttribute('x2', ox);
    line.setAttribute('y2', oy);

    function onMove(ev) {
      const mx = (ev.clientX - panX) / scale;
      const my = (ev.clientY - panY) / scale;
      line.setAttribute('x2', mx);
      line.setAttribute('y2', my);
    }
    function onUp(ev) {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      svg.removeChild(line);

      // Find target card under cursor
      const mx = (ev.clientX - panX) / scale;
      const my = (ev.clientY - panY) / scale;
      let target = null, targetSide = 'top';
      for (const c of CARDS) {
        if (c.id === fromId) continue;
        const el = document.getElementById('card-' + c.id);
        if (!el) continue;
        const cw = el.offsetWidth, ch = el.offsetHeight;
        if (mx >= c.x && mx <= c.x + cw && my >= c.y && my <= c.y + ch) {
          target = c;
          // Determine closest side
          const dx1 = mx - c.x, dx2 = c.x + cw - mx;
          const dy1 = my - c.y, dy2 = c.y + ch - my;
          const min = Math.min(dx1, dx2, dy1, dy2);
          if (min === dx1) targetSide = 'left';
          else if (min === dx2) targetSide = 'right';
          else if (min === dy1) targetSide = 'top';
          else targetSide = 'bottom';
          break;
        }
      }
      if (target) {
        CONNECTIONS.push([fromId, target.id, fromSide, targetSide]);
        renderCards();
      }
    }
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }

  function onCardCtx(e) {
    if (!editMode) return;
    e.preventDefault();
    e.stopPropagation();
    const el = e.target.closest('.card');
    if (!el) return;
    showCtx(e.clientX, e.clientY, el.id.replace('card-', ''));
  }

  // ── Draw connectors (clickable in edit mode) ──
  function drawConnectors() {
    const old = canvas.querySelector('.connectors');
    if (old) old.remove();
    const svgNs = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNs, 'svg');
    svg.classList.add('connectors');
    svg.setAttribute('style', 'position:absolute;top:0;left:0;width:9999px;height:9999px;z-index:1;overflow:visible;pointer-events:' + (editMode ? 'auto' : 'none') + ';');

    CONNECTIONS.forEach(([fromId, toId, fromSide, toSide], idx) => {
      const from = CARDS.find(c => c.id === fromId);
      const to   = CARDS.find(c => c.id === toId);
      if (!from || !to) return;
      const fromEl = document.getElementById('card-' + fromId);
      const toEl   = document.getElementById('card-' + toId);
      const fw = fromEl ? fromEl.offsetWidth : 320;
      const fh = fromEl ? fromEl.offsetHeight : 200;
      const tw = toEl ? toEl.offsetWidth : 320;
      const th = toEl ? toEl.offsetHeight : 200;
      let x1, y1, x2, y2;
      if (fromSide === 'bottom') { x1 = from.x + fw / 2; y1 = from.y + fh; }
      else if (fromSide === 'top') { x1 = from.x + fw / 2; y1 = from.y; }
      else if (fromSide === 'right') { x1 = from.x + fw; y1 = from.y + fh / 2; }
      else if (fromSide === 'left') { x1 = from.x; y1 = from.y + fh / 2; }
      if (toSide === 'top') { x2 = to.x + tw / 2; y2 = to.y; }
      else if (toSide === 'bottom') { x2 = to.x + tw / 2; y2 = to.y + th; }
      else if (toSide === 'left') { x2 = to.x; y2 = to.y + th / 2; }
      else if (toSide === 'right') { x2 = to.x + tw; y2 = to.y + th / 2; }
      let cx1, cy1, cx2, cy2;
      const dist = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1)) * 0.4;
      if (fromSide === 'bottom') { cx1 = x1; cy1 = y1 + dist; }
      else if (fromSide === 'top') { cx1 = x1; cy1 = y1 - dist; }
      else if (fromSide === 'right') { cx1 = x1 + dist; cy1 = y1; }
      else if (fromSide === 'left') { cx1 = x1 - dist; cy1 = y1; }
      if (toSide === 'top') { cx2 = x2; cy2 = y2 - dist; }
      else if (toSide === 'bottom') { cx2 = x2; cy2 = y2 + dist; }
      else if (toSide === 'left') { cx2 = x2 - dist; cy2 = y2; }
      else if (toSide === 'right') { cx2 = x2 + dist; cy2 = y2; }

      const d = `M${x1},${y1} C${cx1},${cy1} ${cx2},${cy2} ${x2},${y2}`;

      // Visible path
      const path = document.createElementNS(svgNs, 'path');
      path.setAttribute('d', d);
      path.classList.add('conn-path');
      svg.appendChild(path);

      // Fat invisible hit area for clicking in edit mode
      if (editMode) {
        const hit = document.createElementNS(svgNs, 'path');
        hit.setAttribute('d', d);
        hit.classList.add('conn-hit');
        hit.addEventListener('click', () => {
          if (confirm('Delete connection ' + fromId + ' → ' + toId + '?')) {
            CONNECTIONS.splice(idx, 1);
            renderCards();
          }
        });
        svg.appendChild(hit);
      }
    });
    canvas.insertAdjacentElement('afterbegin', svg);
  }

  // ── Add card modal ──
  addCardBtn.addEventListener('click', () => openEditModal(null));

  function openEditModal(id) {
    editingCardId = id;
    const f = cardForm;
    if (id) {
      modalTitle.textContent = 'Edit Card';
      const c = CARDS.find(c => c.id === id);
      if (!c) return;
      f.id.value = c.id; f.id.readOnly = true;
      f.title.value = c.title || '';
      f.phase.value = c.phase || '';
      f.desc.value = c.desc || '';
      f.link.value = c.link || '';
      f.date.value = c.date || '';
      f.pin.value = c.pin || '';
      f.image.value = c.image || '';
      f.small.checked = !!c.small;
      f.info.checked = !!c.info;
    } else {
      modalTitle.textContent = 'New Card';
      f.reset();
      f.id.readOnly = false;
      f.id.value = 'card-' + Date.now();
    }
    modalOverlay.style.display = '';
  }

  document.getElementById('modalCancel').addEventListener('click', () => { modalOverlay.style.display = 'none'; });
  modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) modalOverlay.style.display = 'none'; });

  cardForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const f = cardForm;
    const data = {
      id: f.id.value.trim(),
      title: f.title.value.trim(),
      phase: f.phase.value,
      desc: f.desc.value.trim(),
      link: f.link.value.trim(),
      date: f.date.value,
      pin: f.pin.value.trim(),
      image: f.image.value.trim() || undefined,
      small: f.small.checked || undefined,
      info: f.info.checked || undefined,
    };
    if (editingCardId) {
      const c = CARDS.find(c => c.id === editingCardId);
      if (c) Object.assign(c, data);
    } else {
      // new card — place near center of current view
      const rect = viewport.getBoundingClientRect();
      data.x = Math.round((-panX + rect.width / 2) / scale - 160);
      data.y = Math.round((-panY + rect.height / 2) / scale - 100);
      CARDS.push(data);
    }
    modalOverlay.style.display = 'none';
    renderCards();
  });

  // ── Delete card ──
  function deleteCard(id) {
    if (!confirm('Delete card "' + id + '" and its connections?')) return;
    const idx = CARDS.findIndex(c => c.id === id);
    if (idx !== -1) CARDS.splice(idx, 1);
    // Remove related connections
    for (let i = CONNECTIONS.length - 1; i >= 0; i--) {
      if (CONNECTIONS[i][0] === id || CONNECTIONS[i][1] === id) CONNECTIONS.splice(i, 1);
    }
    renderCards();
  }

  // ── Connection modal ──
  addConnBtn.addEventListener('click', openConnModal);

  function openConnModal() {
    const opts = CARDS.map(c => `<option value="${sanitize(c.id)}">${sanitize(c.id)} – ${sanitize(c.title || c.id)}</option>`).join('');
    document.getElementById('connFrom').innerHTML = opts;
    document.getElementById('connTo').innerHTML = opts;
    if (connFromId) document.getElementById('connFrom').value = connFromId;
    connOverlay.style.display = '';
  }

  document.getElementById('connCancel').addEventListener('click', () => { connOverlay.style.display = 'none'; connFromId = null; });
  connOverlay.addEventListener('click', (e) => { if (e.target === connOverlay) { connOverlay.style.display = 'none'; connFromId = null; } });

  connForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const f = connForm;
    CONNECTIONS.push([f.fromId.value, f.toId.value, f.fromSide.value, f.toSide.value]);
    connOverlay.style.display = 'none';
    connFromId = null;
    renderCards();
  });

  // ── Export JSON (copy to clipboard) ──
  exportBtn.addEventListener('click', () => {
    const out = {
      cards: CARDS.map(c => {
        const o = { ...c };
        // Clean undefined
        Object.keys(o).forEach(k => { if (o[k] === undefined || o[k] === '') delete o[k]; });
        return o;
      }),
      connections: CONNECTIONS,
    };
    const json = JSON.stringify(out, null, 2);
    navigator.clipboard.writeText(json).then(() => {
      alert('JSON copied to clipboard! Paste it to me so I can update the code.');
    }).catch(() => {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = json;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
      alert('JSON copied to clipboard!');
    });
  });

  // ════════════════════════════════════════
  //  INIT
  // ════════════════════════════════════════
  renderCards();
  resetView();
})();
