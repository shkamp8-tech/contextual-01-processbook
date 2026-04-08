/* ========================================
   PROCESS BOOK – APP.JS
   Digital process book / canvas
   ======================================== */

(() => {
  'use strict';

  // ── Constants ──────────────────────────
  const STORAGE_KEY = 'procesboek_cards';
  const THEME_KEY   = 'procesboek_theme';

  const PHASES = [
    { name: 'Research',    color: 'var(--phase-onderzoek)',  hex: '#007aff' },
    { name: 'Concepting',  color: 'var(--phase-concepting)', hex: '#af52de' },
    { name: 'Design',      color: 'var(--phase-ontwerp)',    hex: '#ff9500' },
    { name: 'Prototype',   color: 'var(--phase-prototype)',  hex: '#30d158' },
    { name: 'Testing',     color: 'var(--phase-testen)',     hex: '#ff3b30' },
    { name: 'Reflection',  color: 'var(--phase-reflectie)',  hex: '#5ac8fa' },
  ];

  // ── State ──────────────────────────────
  let cards       = loadCards();
  let activePhase = 'All';
  let editingId   = null;

  // ── DOM refs ───────────────────────────
  const canvas       = document.getElementById('canvas');
  const phaseNav     = document.getElementById('phaseNav');
  const modalOverlay = document.getElementById('modalOverlay');
  const cardForm     = document.getElementById('cardForm');
  const modalTitle   = document.getElementById('modalTitle');
  const addCardBtn   = document.getElementById('addCardBtn');
  const cancelBtn    = document.getElementById('cancelBtn');
  const themeToggle  = document.getElementById('themeToggle');
  const themeIcon    = document.getElementById('themeIcon');

  const inputTitle = document.getElementById('inputTitle');
  const inputPhase = document.getElementById('inputPhase');
  const inputDesc  = document.getElementById('inputDesc');
  const inputLink  = document.getElementById('inputLink');
  const inputDate  = document.getElementById('inputDate');

  // ── Theme ──────────────────────────────
  function initTheme() {
    const saved = localStorage.getItem(THEME_KEY) || 'light';
    setTheme(saved);
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
  }

  // ── Default cards (seeded on first visit) ──
  const DEFAULT_CARDS = [
    {
      id: 'seed_fascinatie',
      title: 'Fascination Research',
      phase: 'Research',
      desc: 'My initial research into my fascination. This laid the foundation for the rest of the process.',
      link: 'https://shkamp8-tech.github.io/fascination-project-research/',
      date: '2026-04-08',
    },
    {
      id: 'seed_wordweb',
      title: 'Wordweb',
      phase: 'Research',
      desc: 'Based on the fascination research, I created a wordweb to explore connections and themes.',
      link: 'https://shkamp8-tech.github.io/wordweb/',
      date: '2026-04-08',
    },
  ];

  // ── Persistence ────────────────────────
  function loadCards() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (saved && saved.length > 0) return saved;
      // Seed defaults on first visit
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CARDS));
      return [...DEFAULT_CARDS];
    } catch {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CARDS));
      return [...DEFAULT_CARDS];
    }
  }

  function saveCards() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
  }

  // ── Helpers ────────────────────────────
  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function phaseColor(phaseName) {
    const p = PHASES.find(ph => ph.name === phaseName);
    return p ? p.color : 'var(--text-secondary)';
  }

  function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  function sanitize(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ── Render sidebar ─────────────────────
  function renderSidebar() {
    const counts = {};
    PHASES.forEach(p => counts[p.name] = 0);
    cards.forEach(c => { if (counts[c.phase] !== undefined) counts[c.phase]++; });

    let html = `<li class="sidebar__item sidebar__item--all ${activePhase === 'All' ? 'sidebar__item--active' : ''}" data-phase="All">
      📋 All <span class="sidebar__count">${cards.length}</span>
    </li>`;

    PHASES.forEach(p => {
      html += `<li class="sidebar__item ${activePhase === p.name ? 'sidebar__item--active' : ''}" data-phase="${p.name}">
        <span class="sidebar__dot" style="background:${p.color}"></span>
        ${p.name}
        <span class="sidebar__count">${counts[p.name]}</span>
      </li>`;
    });

    phaseNav.innerHTML = html;

    phaseNav.querySelectorAll('.sidebar__item').forEach(el => {
      el.addEventListener('click', () => {
        activePhase = el.dataset.phase;
        renderSidebar();
        renderCanvas();
      });
    });
  }

  // ── Render canvas ──────────────────────
  function renderCanvas() {
    const filtered = activePhase === 'All'
      ? cards
      : cards.filter(c => c.phase === activePhase);

    if (filtered.length === 0) {
      canvas.innerHTML = `
        <div class="canvas__empty">
          <h2>No cards yet</h2>
          <p>Click <strong>+ Card</strong> to add your first research or process step.</p>
        </div>`;
      return;
    }

    // Sort by date descending
    filtered.sort((a, b) => (b.date || '').localeCompare(a.date || ''));

    canvas.innerHTML = filtered.map(card => {
      const color = phaseColor(card.phase);
      const linkHtml = card.link
        ? `<a class="card__link" href="${sanitize(card.link)}" target="_blank" rel="noopener noreferrer">View research ↗</a>`
        : '';
      const dateHtml = card.date ? formatDate(card.date) : '';

      return `
      <article class="card" data-id="${card.id}">
        <div class="card__phase-bar" style="background:${color}"></div>
        <div class="card__header">
          <h3 class="card__title">${sanitize(card.title)}</h3>
          <div class="card__actions">
            <button class="btn btn--small" data-edit="${card.id}" title="Edit">✏️</button>
            <button class="btn btn--small btn--danger" data-delete="${card.id}" title="Delete">🗑️</button>
          </div>
        </div>
        <span class="card__phase-badge" style="background:${color}">${sanitize(card.phase)}</span>
        ${card.desc ? `<p class="card__desc">${sanitize(card.desc)}</p>` : ''}
        <div class="card__footer">
          <span class="card__date">${dateHtml}</span>
          ${linkHtml}
        </div>
      </article>`;
    }).join('');

    // Bind card actions
    canvas.querySelectorAll('[data-edit]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        openEditModal(btn.dataset.edit);
      });
    });

    canvas.querySelectorAll('[data-delete]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteCard(btn.dataset.delete);
      });
    });
  }

  // ── Modal ──────────────────────────────
  function openModal() {
    modalOverlay.classList.add('modal-overlay--visible');
    inputTitle.focus();
  }

  function closeModal() {
    modalOverlay.classList.remove('modal-overlay--visible');
    cardForm.reset();
    editingId = null;
    modalTitle.textContent = 'New Card';
  }

  function openEditModal(id) {
    const card = cards.find(c => c.id === id);
    if (!card) return;
    editingId = id;
    modalTitle.textContent = 'Edit Card';
    inputTitle.value = card.title;
    inputPhase.value = card.phase;
    inputDesc.value  = card.desc || '';
    inputLink.value  = card.link || '';
    inputDate.value  = card.date || '';
    openModal();
  }

  // ── CRUD ───────────────────────────────
  function saveCard(e) {
    e.preventDefault();

    const data = {
      title: inputTitle.value.trim(),
      phase: inputPhase.value,
      desc:  inputDesc.value.trim(),
      link:  inputLink.value.trim(),
      date:  inputDate.value,
    };

    if (!data.title) return;

    if (editingId) {
      const idx = cards.findIndex(c => c.id === editingId);
      if (idx !== -1) cards[idx] = { ...cards[idx], ...data };
    } else {
      cards.push({ id: generateId(), ...data });
    }

    saveCards();
    closeModal();
    renderSidebar();
    renderCanvas();
  }

  function deleteCard(id) {
    if (!confirm('Are you sure you want to delete this card?')) return;
    cards = cards.filter(c => c.id !== id);
    saveCards();
    renderSidebar();
    renderCanvas();
  }

  // ── Event listeners ────────────────────
  addCardBtn.addEventListener('click', () => {
    editingId = null;
    inputDate.value = new Date().toISOString().split('T')[0];
    openModal();
  });

  cancelBtn.addEventListener('click', closeModal);
  cardForm.addEventListener('submit', saveCard);
  themeToggle.addEventListener('click', toggleTheme);

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // ── Init ───────────────────────────────
  initTheme();
  renderSidebar();
  renderCanvas();
})();
