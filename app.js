(() => {
  'use strict';

  // ════════════════════════════════════════
  //  ACCESS CODE GATE
  // ════════════════════════════════════════
  const ACCESS_PIN = '0000';
  const lockscreen = document.getElementById('lockscreen');
  const lockDigits = lockscreen.querySelectorAll('.lock__digit');
  const lockError  = document.getElementById('lockError');
  const welcome    = document.getElementById('welcome');
  const welcomeContinue = document.getElementById('welcomeContinue');

  function showWelcome() {
    if (sessionStorage.getItem('pb_welcome_seen') === '1') {
      welcome.classList.add('hidden');
    } else {
      welcome.classList.remove('hidden');
    }
  }
  welcomeContinue.addEventListener('click', () => {
    sessionStorage.setItem('pb_welcome_seen', '1');
    welcome.classList.add('hidden');
  });

  // If already unlocked this session, skip
  if (sessionStorage.getItem('pb_unlocked') === '1') {
    lockscreen.classList.add('hidden');
    showWelcome();
  } else {
    welcome.classList.add('hidden');
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
          showWelcome();
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
  //  DATA – hardcoded defaults (overridden by localStorage)
  // ════════════════════════════════════════
  const DEFAULT_CARDS = [
    {
      id: 'fascination',
      title: 'Fascination Research',
      phase: 'Research',
      desc: 'I didn’t know where to begin, so I used my previous project as a starting point to build on.',
      link: 'https://shkamp8-tech.github.io/fascination-project-research/',
      date: '2026-02-20',
      pin: '0001',
      x: 0,
      y: 0,
    },
    {
      id: 'fascination-photo',
      title: 'Fascination',
      phase: '',
      desc: '',
      link: '',
      date: '',
      pin: '',
      x: 340,
      y: -200,
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
      x: 340,
      y: 200,
      info: true,
    },
    {
      id: 'wordweb',
      title: 'Wordweb',
      phase: 'Research',
      desc: 'Based on the fascination research, I created a wordweb to explore connections and themes.',
      link: 'https://shkamp8-tech.github.io/wordweb/',
      date: '2026-02-27',
      pin: '0002',
      x: -300,
      y: 260,
    },
    {
      id: 'wordweb-preview',
      title: 'Wordweb Visualization',
      phase: '',
      desc: '',
      link: '',
      date: '',
      pin: '',
      x: -720,
      y: 180,
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
      x: -200,
      y: 40,
      small: true,
    },
    {
      id: 'interview',
      title: 'Interview',
      phase: 'Research',
      desc: 'Interviews conducted with peers and experts to explore perspectives on interaction, control, and unpredictability in design.',
      link: 'https://shkamp8-tech.github.io/interview-transcript/',
      date: '2026-04-08',
      pin: '0003',
      x: -60,
      y: 1700,
    },
    {
      id: 'notes',
      title: 'Notes',
      phase: 'Research',
      desc: '',
      link: '',
      date: '2026-03-13',
      pin: '',
      x: 20,
      y: 840,
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
      x: -160,
      y: 1020,
      small: true,
    },
    {
      id: 'library-of-babel',
      title: 'Library of Babel',
      phase: 'Research',
      desc: 'A digital exploration of Jorge Luis Borges\' concept — a website containing every possible page of text, representing infinity, randomness, and the search for meaning.',
      link: 'https://libraryofbabel.info/',
      linkLabel: 'Explore Library \u2197',
      date: '2026-04-13',
      pin: '',
      x: 500,
      y: 480,
    },
    {
      id: 'spectre-tile',
      title: 'Spectre Tile',
      phase: 'Research',
      desc: 'The first true aperiodic monotile — a single shape that tiles the plane without ever repeating. Explores order emerging from simple rules without predictable patterns.',
      links: [
        { label: 'Scientific American ↗', url: 'https://www.scientificamerican.com/article/newfound-mathematical-einstein-shape-creates-a-never-repeating-pattern/' },
        { label: 'Spectre interactive ↗', url: 'https://cs.uwaterloo.ca/~csk/spectre/' },
      ],
      date: '2026-04-13',
      pin: '',
      x: 500,
      y: 780,
    },
    {
      id: 'mediums',
      title: 'Mediums',
      phase: 'Research',
      desc: '',
      link: '',
      date: '2026-03-06',
      pin: '',
      x: 140,
      y: 600,
      small: true,
    },
    {
      id: 'conversation-notes',
      title: 'Conversation Notes',
      phase: 'Research',
      desc: 'Key takeaways and reflections from conversations with peers, mentors, and stakeholders during the research process.',
      link: '',
      date: '2026-04-16',
      pin: '',
      x: -40,
      y: 1220,
    },
    {
      id: 'interview-questions',
      title: 'Interview Questions',
      phase: 'Research',
      desc: 'Prepared questions and topic guides used during interviews to gain deeper insight into user perspectives and expert knowledge.',
      link: '',
      date: '2026-04-16',
      pin: '',
      x: -40,
      y: 1480,
    },
    {
      id: 'interview-questions-info',
      title: '',
      phase: 'Research',
      bullets: [
        'Do you work rather from something simple and build that up to something more complex or the other way around?',
        '↳ Do you notice that starting from one or the other side leads to different kinds of outcomes?',
        '↳ Have you ever started a project and midway thought it needed a completely different approach?',
        'Do you try to keep the original identity of something, or are you more interested in what it is not or can be through changing, transforming or translating it?',
        '↳ Have you ever transformed something so much that the meaning behind it was changed?',
        '↳ Must the source be visible in the end result?',
        'When you change/transform/translate something, how do you decide which details need to stay and which ones can be sacrificed?',
        '↳ Are there reoccurring details in your process of transforming or translating?',
        '↳ Have you ever removed something small and realized it changed the whole project?',
        'When two opposites meet in a project, do you look for balance, tension or something completely different?',
        '↳ Did the outcome of some projects end up at a completely different place than expected through this approach?',
        '↳ Does that approach work through a natural feeling or more based on some rule?',
      ],
      link: '',
      date: '2026-04-16',
      pin: '',
      x: -560,
      y: 1600,
      info: true,
    },
    {
      id: 'ted-simplifying-complexity',
      title: 'Simplifying Complexity – Eric Berlow',
      phase: 'Research',
      desc: 'TED Talk by ecologist Eric Berlow on how stepping back and embracing complexity can lead to surprisingly simple answers.',
      link: 'https://www.ted.com/talks/eric_berlow_simplifying_complexity',
      linkLabel: 'Watch TED Talk ↗',
      date: '2026-04-16',
      pin: '',
      x: -600,
      y: 820,
    },
    {
      id: 'interview-analysis',
      title: 'Interview Analysis',
      phase: 'Analysis',
      desc: 'Analysis and synthesis of key findings from the conducted interviews, identifying patterns and recurring themes.',
      link: '',
      date: '2026-04-17',
      pin: '',
      x: -40,
      y: 1960,
    },
    {
      id: 'visualisation-tools',
      title: 'Visualisation Tools',
      phase: 'Research',
      desc: 'Exploration of tools and methods for visualising complex information, relationships, and data structures.',
      link: '',
      date: '2026-04-17',
      pin: '',
      x: -1060,
      y: 940,
    },
    {
      id: 'questions',
      title: 'Questions',
      phase: 'Research',
      desc: 'Core questions driving the research and design process.',
      link: '',
      date: '2026-04-17',
      pin: '',
      x: -680,
      y: 1080,
    },
    {
      id: 'porphyrius-tree',
      title: 'The Porphyrius Tree',
      phase: 'Research',
      desc: 'A hierarchical classification system by Porphyry of Tyre — one of the earliest tree diagrams, organising concepts through division from the most general to the most specific.',
      link: '',
      date: '2026-04-17',
      pin: '',
      x: 400,
      y: 1200,
    },
    {
      id: 'research-questions',
      title: 'Research Questions',
      phase: 'Research',
      desc: '',
      link: '',
      date: '',
      pin: '',
      x: 700,
      y: 1400,
    },
    {
      id: 'process',
      title: 'Process',
      subtitle: 'From tension to harmony — what happens in the space between opposites, and what gets lost when we try to name it.',
      process: true,
      phase: 'Analysis',
      date: '2026-05-13',
      x: 1000,
      y: 1700,
      sections: [
        {
          heading: 'The core',
          text: 'A study of how opposites — order/chaos, control/unpredictability, Apollonian/Dionysian — do not stand apart but live on a spectrum, and how the most interesting things happen at the tipping point where one becomes the other. The aim is not to choose a side, but to make the in-between visible.'
        },
        {
          heading: 'The hidden axis',
          text: 'Apollonian ↔ Dionysian functions as the underlying axis of the project. It will not be named explicitly in the final outcome, but it shapes every choice: what is structured vs. what is felt, what is measured vs. what is sensed, what is intentional vs. what is given.'
        },
        {
          heading: 'Tipping point & spectrum',
          bullets: [
            'When does something tip from order into chaos, or from control into surrender?',
            'Is the tipping point a threshold (a line) or a zone (a gradient)?',
            'What does the spectrum between two poles actually contain — and can it be experienced, not just described?',
            'Can a designer design the tipping point itself, or only the conditions for it to occur?'
          ]
        },
        {
          heading: 'Lost information',
          text: 'Every translation, simplification, or categorisation throws something away — consciously or not. To name a thing is to leave another thing unnamed. The zine should make the reader feel this loss, not just understand it.'
        },
        {
          heading: 'Control & the gift',
          text: 'Nothing is ever fully under control or perfect — anything can break, deform, be interrupted. We can only strive toward the best possible outcome and stay open to what arrives uninvited. Mingus calls these moments “presents”: the bird of prey on the lightning-pole, people walking through the holes in the ship. The unplanned is part of the work.'
        },
        {
          heading: 'From tension to harmony',
          text: 'Two opposites meeting do not have to fight. Mingus’ double-function objects show that polarity can resolve into joy without losing either side. Balance is not the absence of opposites — balance is the harmony between them.'
        },
        {
          heading: 'Method',
          bullets: [
            'Start from the 21-mirror installation as a vehicle, not a subject.',
            'Use the wordweb as the structural map — Dionysian / Apollonian as silent axis.',
            'Treat the interview “presents” as evidence, not anecdote.',
            'Let categorisation itself become a topic — show what falls outside.'
          ]
        },
        {
          heading: 'The zine',
          text: 'A small folder/booklet for fellow students and tutors at Design Academy (general public welcome but secondary). The tone takes a clear stance through open-feeling phrasing — no questions on the page, but every spread should leave the reader with one in their head.'
        },
        {
          heading: 'Directions to keep researching',
          bullets: [
            'Find tipping points in design, nature, music, language — collect concrete examples.',
            'Map what each act of categorisation excludes (margins, exceptions, noise).',
            'Test the difference between a threshold and a gradient as a visual/spatial language.',
            'Look at Nietzsche’s Apollonian/Dionysian, but stay close to your own visual vocabulary.',
            'Develop one or two visual motifs that carry the spectrum across the zine spreads.'
          ]
        }
      ]
    },
    {
      id: 'zine-the-point-between',
      title: 'The Point Between',
      subtitle: 'The zine — final outcome of the Contextual 2B research on the space between opposing forces.',
      process: true,
      phase: 'Design',
      date: '2026-05-28',
      x: 2000,
      y: 200,
      sections: [
        {
          heading: 'Research question',
          text: 'How can design reveal the value of the middle ground between opposing forces?'
        },
        {
          heading: 'Premise',
          text: 'Opposites are not fixed separate sides but conditions that move into each other. The middle ground — the tipping zone — is where meaning becomes unstable and transformation can happen. The zine treats the two sides as analytical tools, not as a hard separation.'
        },
        {
          heading: 'Structure',
          bullets: [
            'ONE SIDE — organising, structure, rules, categories, measurement. Simplification makes complexity legible but always leaves something unsaid.',
            'TIPPING ZONE — the wider middle space where a shift starts to appear. A designer can shape conditions, not fully own the outcome.',
            'THE OTHER SIDE — unstable, emotional, risky, unpredictable. Ambiguity treated not as a problem but as a resource for interpretation and engagement.',
            'Sources spread closing the publication — the research evidence behind every claim.'
          ]
        },
        {
          heading: 'Form',
          text: 'A folded publication (folder/booklet) for fellow students and tutors at Design Academy Eindhoven. Visual language oscillates between order (dotted grids, concentric circles, radiating lines) and chaos (entangled lines, scribbles, soft gradients) — the Apollonian/Dionysian axis is present without being named.'
        }
      ]
    },
    // ── Research sources behind "The Point Between" ──
    {
      id: 'src-liminal-design',
      title: 'Liminal Design',
      phase: 'Research',
      desc: 'In-between space, transition, transformation. Liminality as a state where meaning becomes unstable — foundation for the "tipping zone" concept in the zine.',
      links: [{ label: 'PMC article ↗', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9945118/' }],
      date: '2026-05-15',
      x: 1700,
      y: 1100,
    },
    {
      id: 'src-presence-absence',
      title: 'Presence & Absence',
      phase: 'Research',
      desc: 'Contextual 2B discourse slides — what is shown, what is hidden, absence as meaning. Source for the idea that simplification always leaves something unsaid.',
      link: '',
      date: '2026-05-15',
      x: 2050,
      y: 1100,
    },
    {
      id: 'src-ambiguity-resource',
      title: 'Ambiguity as a Resource',
      phase: 'Research',
      desc: 'Gaver, Beaver & Benford — ambiguity treated not as a problem but as a design tool for interpretation and engagement. Core to the "other side" page of the zine.',
      links: [{ label: 'ACM paper ↗', url: 'https://dl.acm.org/doi/10.1145/642611.642653' }],
      date: '2026-05-15',
      x: 2400,
      y: 1100,
    },
    {
      id: 'src-mingus-interview',
      title: 'Interview — Mingus Peter Hopman',
      phase: 'Research',
      desc: 'Unexpected moments as "presents". Design can shape the conditions but not fully own the outcome — quoted on the top fold of the zine.',
      links: [{ label: 'Transcript ↗', url: 'https://shkamp8-tech.github.io/interview-transcript/' }],
      date: '2026-05-15',
      x: 2750,
      y: 1100,
    },
    {
      id: 'src-competing-demands',
      title: 'Competing Demands in Systems',
      phase: 'Research',
      desc: 'Design research on conflicting forces — they do not always need to be solved away; they can become material for design. Backs the closing paragraph on productive tension.',
      links: [{ label: 'DRS paper ↗', url: 'https://dl.designresearchsociety.org/cgi/viewcontent.cgi?article=2829&context=drs-conference-papers' }],
      date: '2026-05-15',
      x: 1700,
      y: 1450,
    },
    {
      id: 'src-space-between-stories',
      title: 'Design in the Space Between Stories',
      phase: 'Research',
      desc: 'The space between as a design space — frames the middle ground as a fragile relation where a project can begin before it becomes too fixed.',
      links: [{ label: 'DiVA full text ↗', url: 'https://www.diva-portal.org/smash/get/diva2%3A1404330/FULLTEXT01.pdf' }],
      date: '2026-05-15',
      x: 2050,
      y: 1450,
    },
    {
      id: 'src-design-ambiguity',
      title: 'Design Research and Ambiguity',
      phase: 'Research',
      desc: 'Green & Lindley — uncertainty, instability, complexity, value conflict as legitimate research conditions. Methodological backbone for treating the middle ground analytically.',
      links: [{ label: 'EAD2021 paper ↗', url: 'https://designresearch.works/assets/papers/ead2021-design-and-ambiguity-green-lindley.pdf' }],
      date: '2026-05-15',
      x: 2400,
      y: 1450,
    },
    {
      id: 'src-embrace-opposites',
      title: 'Embrace Opposites',
      phase: 'Research',
      desc: 'Interaction Design Foundation — opposites as a practical ideation method. Used to test how the polar structure of the zine can generate concrete design decisions.',
      links: [{ label: 'IxDF article ↗', url: 'https://www.interaction-design.org/literature/topics/embrace-opposites' }],
      date: '2026-05-15',
      x: 2750,
      y: 1450,
    },
    {
      id: 'src-process-book',
      title: 'Process Book (this canvas)',
      phase: 'Research',
      desc: 'Own process: mapping, visual tests, reflection. The infinite canvas you are looking at right now — primary evidence of the working method behind the zine.',
      links: [{ label: 'Process book ↗', url: 'https://shkamp8-tech.github.io/contextual-01-processbook/' }],
      date: '2026-05-15',
      x: 1700,
      y: 1800,
    },
    {
      id: 'src-tutor-peer-feedback',
      title: 'Tutor & Peer Feedback',
      phase: 'Research',
      desc: 'Contextual 2B, Design Academy Eindhoven, 2026 — feedback moments treated as research evidence and refinement, not afterthought.',
      link: '',
      date: '2026-05-15',
      x: 2050,
      y: 1800,
    },
    {
      id: 'src-apollonian-dionysian',
      title: 'Apollonian & Dionysian',
      phase: 'Research',
      desc: 'Nietzsche on art and the psyche — hidden background axis of the project: structure vs. chaos, measured vs. felt. Present in the zine without being named.',
      links: [{ label: 'Philosophy Break ↗', url: 'https://philosophybreak.com/articles/apollonian-and-dionysian-nietzsche-on-art-and-the-psyche/' }],
      date: '2026-05-15',
      x: 2400,
      y: 1800,
    },
  ];

  // Connections: [fromId, toId, fromSide, toSide]
  // sides: 'bottom', 'top', 'left', 'right'
  const DEFAULT_CONNECTIONS = [
    ['fascination', 'wordweb', 'bottom', 'top'],
    ['fascination', 'fascination-photo', 'right', 'left'],
    ['fascination', 'fascination-info', 'right', 'left'],
    ['oldschool', 'wordweb', 'bottom', 'top'],
    ['wordweb', 'wordweb-preview', 'right', 'left'],
    ['fascination-info', 'interview', 'bottom', 'top'],
    ['fascination-info', 'notes', 'bottom', 'top'],
    ['wordweb', 'theme', 'bottom', 'top'],
    ['fascination', 'mediums', 'bottom', 'top'],
    ['wordweb', 'mediums', 'bottom', 'top'],
    ['mediums', 'library-of-babel', 'bottom', 'top'],
    ['mediums', 'spectre-tile', 'bottom', 'top'],
    ['interview', 'conversation-notes', 'bottom', 'top'],
    ['interview', 'interview-questions', 'bottom', 'top'],
    ['interview-questions', 'interview-questions-info', 'bottom', 'top'],
    ['interview', 'interview-analysis', 'bottom', 'top'],
    // Zine ↔ research sources
    ['zine-the-point-between', 'process', 'left', 'right'],
    ['zine-the-point-between', 'src-liminal-design', 'bottom', 'top'],
    ['zine-the-point-between', 'src-presence-absence', 'bottom', 'top'],
    ['zine-the-point-between', 'src-ambiguity-resource', 'bottom', 'top'],
    ['zine-the-point-between', 'src-mingus-interview', 'bottom', 'top'],
    ['zine-the-point-between', 'src-competing-demands', 'bottom', 'top'],
    ['zine-the-point-between', 'src-space-between-stories', 'bottom', 'top'],
    ['zine-the-point-between', 'src-design-ambiguity', 'bottom', 'top'],
    ['zine-the-point-between', 'src-embrace-opposites', 'bottom', 'top'],
    ['zine-the-point-between', 'src-process-book', 'bottom', 'top'],
    ['zine-the-point-between', 'src-tutor-peer-feedback', 'bottom', 'top'],
    ['zine-the-point-between', 'src-apollonian-dionysian', 'bottom', 'top'],
    ['src-mingus-interview', 'interview', 'left', 'right'],
  ];

  // ════════════════════════════════════════
  //  PERSISTENCE (localStorage)
  // ════════════════════════════════════════
  const STORAGE_KEY = 'processbook_state';
  const DATA_VERSION = 14; // do not bump unless intentionally wiping user data
  // ── Cloud sync (GitHub Gist — reliable, requires personal access token with `gist` scope) ──
  // Token is stored per-device in localStorage. Never committed to repo.
  // First device creates the gist, gist ID is stored locally + in the gist content itself.
  const GIST_TOKEN_KEY = 'processbook_gist_token';
  const GIST_ID_KEY = 'processbook_gist_id';
  const GIST_FILENAME = 'contextual-01-processbook.json';
  const GIST_API = 'https://api.github.com/gists';
  const SYNC_POLL_MS = 60000; // pull from cloud every 60s (GitHub gist API has limits)
  const PUSH_DEBOUNCE_MS = 4000; // wait 4s after last edit before pushing
  let lastSyncedTimestamp = 0; // last timestamp we know about (local or remote)
  let remoteSyncEnabled = true;
  function getGistToken() { try { return localStorage.getItem(GIST_TOKEN_KEY) || ''; } catch (e) { return ''; } }
  function getGistId() { try { return localStorage.getItem(GIST_ID_KEY) || ''; } catch (e) { return ''; } }
  function setGistToken(t) { try { localStorage.setItem(GIST_TOKEN_KEY, t); } catch (e) {} }
  function setGistId(id) { try { localStorage.setItem(GIST_ID_KEY, id); } catch (e) {} }
  function gistAuthHeaders() {
    const t = getGistToken();
    return t ? { 'Authorization': 'token ' + t, 'Accept': 'application/vnd.github+json' } : { 'Accept': 'application/vnd.github+json' };
  }
  async function promptForGistToken() {
    const t = window.prompt(
      'GitHub sync setup\n\n' +
      'Paste your GitHub personal access token (with `gist` scope).\n' +
      'Get one at: https://github.com/settings/tokens/new\n' +
      '(Tick only the "gist" checkbox, then Generate.)\n\n' +
      'On other devices, paste the SAME token to share the same data.',
      ''
    );
    if (t && t.trim()) { setGistToken(t.trim()); return t.trim(); }
    return '';
  }
  async function promptForGistId() {
    const id = window.prompt(
      'Paste the Gist ID from your other device (long hex string in the gist URL after gist.github.com/<user>/).\n' +
      'Leave empty to CREATE a new gist on this device.',
      ''
    );
    if (id && id.trim()) { setGistId(id.trim()); return id.trim(); }
    return '';
  }
  let CARDS, CONNECTIONS;

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const state = JSON.parse(raw);
        if (state.version === DATA_VERSION) {
          CARDS = state.cards || [];
          CONNECTIONS = state.connections || [];
          lastSyncedTimestamp = state.timestamp || 0;
          // Merge in any NEW default cards that don't exist locally yet (non-destructive)
          const localIds = new Set(CARDS.map(c => c.id));
          let added = 0;
          for (const dc of DEFAULT_CARDS) {
            if (!localIds.has(dc.id)) {
              CARDS.push(JSON.parse(JSON.stringify(dc)));
              added++;
            }
          }
          if (added) { console.log('Added', added, 'new default cards'); saveState(); }
          console.log('Loaded:', CARDS.length, 'cards,', CONNECTIONS.length, 'connections');
          return;
        }
        // Version mismatch — reset defaults (positions + connections), keep only user-created cards
        const oldCards = state.cards || [];
        const defaultIds = new Set(DEFAULT_CARDS.map(c => c.id));
        CARDS = JSON.parse(JSON.stringify(DEFAULT_CARDS));
        // Keep user-created cards (e.g. uploaded images) that aren't in defaults
        for (const oc of oldCards) {
          if (!defaultIds.has(oc.id)) {
            CARDS.push(oc);
          }
        }
        // Fully reset connections to defaults (drops user-deleted defaults & old custom ones)
        CONNECTIONS = JSON.parse(JSON.stringify(DEFAULT_CONNECTIONS));
        saveState();
        return;
      }
    } catch (e) { /* ignore corrupt data */ }
    // No saved state — use defaults
    CARDS = JSON.parse(JSON.stringify(DEFAULT_CARDS));
    CONNECTIONS = JSON.parse(JSON.stringify(DEFAULT_CONNECTIONS));
    saveState();
  }

  function saveState() {
    try {
      const timestamp = Date.now();
      lastSyncedTimestamp = timestamp;
      const data = JSON.stringify({
        version: DATA_VERSION,
        timestamp,
        cards: CARDS,
        connections: CONNECTIONS,
      });
      // Keep a rolling backup before overwriting
      try {
        const prev = localStorage.getItem(STORAGE_KEY);
        if (prev && prev !== data) localStorage.setItem(STORAGE_KEY + '_backup', prev);
      } catch (e) {}
      localStorage.setItem(STORAGE_KEY, data);
      console.log('Saved:', CARDS.length, 'cards,', CONNECTIONS.length, 'connections');
      // Push to cloud (debounced — batches rapid edits into one request)
      schedulePush(data);
    } catch (e) {
      console.error('Failed to save state:', e);
    }
  }

  const SYNC_LOG_KEY = 'processbook_sync_log';
  function logSync(level, msg) {
    try {
      const log = JSON.parse(localStorage.getItem(SYNC_LOG_KEY) || '[]');
      log.push({ t: new Date().toISOString(), level, msg });
      // keep last 50 entries
      while (log.length > 50) log.shift();
      localStorage.setItem(SYNC_LOG_KEY, JSON.stringify(log));
    } catch (e) {}
  }
  let lastErrorMsg = null;
  let consecutiveFailures = 0;
  const MAX_FAILURES = 3; // after this, go quiet to avoid spam
  function setSyncStatus(state, title) {
    const el = document.getElementById('syncStatus');
    if (!el) return;
    // Remember last error so subsequent 'syncing' messages don't bury it
    if (state === 'error') { lastErrorMsg = title; logSync('error', title || ''); }
    if (state === 'ok') { lastErrorMsg = null; }
    el.classList.remove('syncing', 'error', 'ok');
    if (state) el.classList.add(state);
    if (state === 'syncing') el.textContent = '⟳';
    else if (state === 'error') el.textContent = '⚠️';
    else if (state === 'ok') el.textContent = '☁️';
    else el.textContent = '☁️';
    // If we have an unresolved error, append it so user can always see it on hover
    const tooltip = lastErrorMsg && state !== 'error'
      ? (title || '') + '\n\nLast error: ' + lastErrorMsg
      : (title || '');
    if (tooltip) el.title = tooltip;
    if (state === 'error') logSync('error', title || '');
    else if (state === 'ok') logSync('ok', title || '');
  }

  let pushTimer = null;
  let pendingPushData = null;
  let rateLimitedUntil = 0; // epoch ms; sync paused until this time
  function isRateLimited() { return Date.now() < rateLimitedUntil; }
  function schedulePush(jsonString) {
    pendingPushData = jsonString;
    if (pushTimer) clearTimeout(pushTimer);
    setSyncStatus('syncing', 'Saving… will sync in ' + Math.round(PUSH_DEBOUNCE_MS/1000) + 's');
    pushTimer = setTimeout(() => {
      pushTimer = null;
      const data = pendingPushData;
      pendingPushData = null;
      if (data) pushToRemote(data);
    }, PUSH_DEBOUNCE_MS);
  }
  // Flush pending push immediately if user closes/leaves the tab
  window.addEventListener('beforeunload', () => {
    if (pushTimer && pendingPushData) {
      clearTimeout(pushTimer);
      // Best-effort sync push (modern browsers may block, that's OK)
      try {
        const token = getGistToken();
        const gid = getGistId();
        if (token && gid && navigator.sendBeacon) {
          // sendBeacon doesn't support custom headers — falls back to PATCH which won't work without auth.
          // Just attempt regular fetch, browser may complete it.
          fetch(GIST_API + '/' + gid, {
            method: 'PATCH',
            headers: { ...gistAuthHeaders(), 'Content-Type': 'application/json' },
            body: JSON.stringify({ files: { [GIST_FILENAME]: { content: pendingPushData } } }),
            keepalive: true,
          }).catch(() => {});
        }
      } catch (e) {}
    }
  });

  function fetchWithTimeout(url, options = {}, timeoutMs = 8000) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    return fetch(url, { ...options, signal: ctrl.signal })
      .finally(() => clearTimeout(timer));
  }

  async function pushToRemote(jsonString, attempt = 1) {
    if (!remoteSyncEnabled) return;
    if (isRateLimited()) {
      // Quietly defer; the cooldown timer will retry
      return;
    }
    const token = getGistToken();
    if (!token) {
      const el = document.getElementById('syncStatus');
      if (el) { el.classList.remove('syncing','error','ok'); el.textContent = '🔑'; el.title = 'Click to set up cloud sync (GitHub token).'; }
      return;
    }
    if (consecutiveFailures >= MAX_FAILURES) {
      const el = document.getElementById('syncStatus');
      if (el) { el.classList.remove('syncing','error','ok'); el.textContent = '💾'; el.title = 'Working in local-only mode (cloud unreachable). Click to retry.'; }
      return;
    }
    setSyncStatus('syncing', attempt > 1 ? 'Retrying upload… (' + attempt + ')' : 'Uploading changes…');
    try {
      const body = JSON.stringify({
        description: 'Contextual 01 process book sync',
        files: { [GIST_FILENAME]: { content: jsonString } },
      });
      let url, method;
      let gistId = getGistId();
      if (gistId) {
        url = GIST_API + '/' + gistId;
        method = 'PATCH';
      } else {
        // First push: create a new gist (private/secret by default for new gists with `gist` scope is `public:false`)
        url = GIST_API;
        method = 'POST';
      }
      const res = await fetchWithTimeout(url, {
        method,
        headers: { ...gistAuthHeaders(), 'Content-Type': 'application/json' },
        body: method === 'POST' ? JSON.stringify({
          description: 'Contextual 01 process book sync',
          public: false,
          files: { [GIST_FILENAME]: { content: jsonString } },
        }) : body,
      }, 20000);
      if (!res.ok) {
        const errText = await res.text().catch(() => '');
        throw new Error('HTTP ' + res.status + ' ' + res.statusText + (errText ? ' — ' + errText.slice(0, 200) : ''));
      }
      const data = await res.json();
      if (data && data.id && !getGistId()) {
        setGistId(data.id);
        console.log('Created new gist:', data.id);
      }
      consecutiveFailures = 0;
      setSyncStatus('ok', 'Synced ' + new Date().toLocaleTimeString() + ' (' + Math.round(jsonString.length/1024) + 'KB)');
    } catch (e) {
      console.warn('Cloud sync push failed (attempt ' + attempt + '):', e);
      const msg = e.message || '';
      // 401 = bad token; don't retry, ask user to re-enter
      if (/HTTP 401/.test(msg) || /Bad credentials/i.test(msg)) {
        setSyncStatus('error', 'GitHub token rejected. Tap menu → Replace token.');
        const el = document.getElementById('syncStatus');
        if (el) el.textContent = '🔑';
        return;
      }
      // 403 rate-limit: back off, don't burn retries
      if (/HTTP 403/.test(msg) && /rate limit/i.test(msg)) {
        // Pause for 60 seconds (was 5 min — too long for normal use)
        rateLimitedUntil = Date.now() + 60 * 1000;
        consecutiveFailures = 0;
        const el = document.getElementById('syncStatus');
        if (el) { el.classList.remove('syncing','error','ok'); el.textContent = '⏳'; el.title = 'GitHub rate limit — sync paused for 60s, then automatic retry.'; }
        logSync('error', 'Rate limited; pausing 60s.');
        setTimeout(() => {
          rateLimitedUntil = 0;
          setSyncStatus('ok', 'Cooldown over.');
          // Auto-retry the pending push
          const data = JSON.stringify({ version: DATA_VERSION, timestamp: Date.now(), cards: CARDS, connections: CONNECTIONS });
          pushToRemote(data);
        }, 60 * 1000);
        return;
      }
      if (attempt < 3) {
        await new Promise(r => setTimeout(r, 1500 * attempt));
        return pushToRemote(jsonString, attempt + 1);
      }
      consecutiveFailures++;
      const why = e.name === 'AbortError' ? 'timeout (' + Math.round(jsonString.length/1024) + 'KB — too big?)' : (e.message || 'network');
      if (consecutiveFailures >= MAX_FAILURES) {
        const el = document.getElementById('syncStatus');
        if (el) { el.classList.remove('syncing','error','ok'); el.textContent = '💾'; el.title = 'Cloud unreachable after ' + consecutiveFailures + ' tries. Working locally only. Click to retry.'; }
        logSync('error', 'Sync disabled after ' + consecutiveFailures + ' failures: ' + why);
      } else {
        setSyncStatus('error', 'Sync failed: ' + why + '. Saved locally. Click ☁️ to retry.');
      }
    }
  }

  async function pullFromRemote() {
    if (!remoteSyncEnabled) return;
    if (isRateLimited()) return false;
    const token = getGistToken();
    if (!token) return false;
    const gistId = getGistId();
    if (!gistId) return false; // Nothing to pull yet — first push will create gist
    try {
      const res = await fetchWithTimeout(GIST_API + '/' + gistId + '?_=' + Date.now(), {
        method: 'GET',
        cache: 'no-store',
        headers: gistAuthHeaders(),
      }, 8000);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const gistData = await res.json();
      const file = gistData && gistData.files && gistData.files[GIST_FILENAME];
      if (!file || !file.content) {
        setSyncStatus('syncing', 'Cloud empty — seeding from local…');
        if ((CARDS||[]).length > 0) {
          await pushToRemote(JSON.stringify({ version: DATA_VERSION, timestamp: Date.now(), cards: CARDS, connections: CONNECTIONS }));
        }
        return false;
      }
      let remote;
      try { remote = JSON.parse(file.content); } catch (e) {
        setSyncStatus('syncing', 'Cloud data corrupt — overwriting from local…');
        if ((CARDS||[]).length > 0) {
          await pushToRemote(JSON.stringify({ version: DATA_VERSION, timestamp: Date.now(), cards: CARDS, connections: CONNECTIONS }));
        }
        return false;
      }
      if (!remote || remote.version !== DATA_VERSION) { setSyncStatus('ok', 'Cloud version mismatch — not applied'); return false; }
      const remoteTs = remote.timestamp || 0;
      // SAFETY: if cloud has significantly less data than local, local wins → auto-push
      const localCount = (CARDS || []).length;
      const remoteCount = (remote.cards || []).length;
      if (localCount > 0 && remoteCount < Math.max(3, localCount - 2)) {
        setSyncStatus('syncing', 'Cloud has only ' + remoteCount + ' cards (local has ' + localCount + ') — auto-pushing local…');
        console.warn('Pull refused, auto-pushing local instead', { localCount, remoteCount });
        try {
          await pushToRemote(JSON.stringify({
            version: DATA_VERSION,
            timestamp: Date.now(),
            cards: CARDS,
            connections: CONNECTIONS,
          }));
        } catch (e) {}
        return false;
      }
      if (remoteTs > lastSyncedTimestamp && Array.isArray(remote.cards)) {
        try {
          const prev = localStorage.getItem(STORAGE_KEY);
          if (prev) localStorage.setItem(STORAGE_KEY + '_backup', prev);
        } catch (e) {}
        CARDS = remote.cards;
        CONNECTIONS = remote.connections || [];
        lastSyncedTimestamp = remoteTs;
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify({
            version: DATA_VERSION,
            timestamp: remoteTs,
            cards: CARDS,
            connections: CONNECTIONS,
          }));
        } catch (e) {}
        if (typeof renderCards === 'function') renderCards();
        setSyncStatus('ok', 'Updated from cloud ' + new Date().toLocaleTimeString());
        console.log('Pulled remote update:', CARDS.length, 'cards');
        return true;
      }
      setSyncStatus('ok', 'Up to date · ' + new Date().toLocaleTimeString());
    } catch (e) {
      console.warn('Cloud sync pull failed:', e);
      if (/HTTP 401/.test(e.message || '')) {
        setSyncStatus('error', 'GitHub token rejected. Click 🔑 to enter a new one.');
      } else {
        setSyncStatus('error', 'Cloud unreachable. Working offline.');
      }
    }
    return false;
  }

  loadState();

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
        cardsHtml += `
        <div class="card card--preview" id="card-${card.id}" style="left:${card.x}px; top:${card.y}px;">
          <img class="card__image" src="${sanitize(card.image)}" alt="${sanitize(card.title)}" draggable="false" />
          ${card.title ? `<span class="card__image-label">${sanitize(card.title)}</span>` : ''}
          ${handles}
        </div>`;
        return;
      }

      // Process / synthesis card (zine backbone)
      if (card.process) {
        const sections = (card.sections || []).map(s => {
          let body = '';
          if (s.bullets && s.bullets.length) {
            body = `<ul class="card__bullets">${s.bullets.map(b => `<li>${sanitize(b)}</li>`).join('')}</ul>`;
          } else if (s.text) {
            body = `<p class="card__desc">${sanitize(s.text)}</p>`;
          }
          return `<div class="process__section">
            ${s.heading ? `<h4 class="process__heading">${sanitize(s.heading)}</h4>` : ''}
            ${body}
          </div>`;
        }).join('');
        cardsHtml += `
        <div class="card card--process" id="card-${card.id}" style="left:${card.x}px; top:${card.y}px;">
          <div class="process__ribbon">PROCESS · synthesis</div>
          <div class="card__body">
            ${card.title ? `<h3 class="process__title">${sanitize(card.title)}</h3>` : ''}
            ${card.subtitle ? `<p class="process__subtitle">${sanitize(card.subtitle)}</p>` : ''}
            ${sections}
          </div>
          ${handles}
        </div>`;
        return;
      }

      // Info box card
      if (card.info) {
        let infoContent = '';
        if (card.bullets && card.bullets.length) {
          infoContent = `<ul class="card__bullets">${card.bullets.map(b => {
            const isSub = b.startsWith('\u21b3');
            return `<li${isSub ? ' class="bullet-sub"' : ''}>${sanitize(b)}</li>`;
          }).join('')}</ul>`;
        } else if (card.desc) {
          infoContent = `<p class="card__desc">${sanitize(card.desc)}</p>`;
        }
        cardsHtml += `
        <div class="card card--info" id="card-${card.id}" style="left:${card.x}px; top:${card.y}px;">
          <div class="card__body">
            ${infoContent}
          </div>
          ${handles}
        </div>`;
        return;
      }

      let linkHtml = '';
      if (card.links && card.links.length) {
        linkHtml = `<div class="card__links-col">${card.links.map(l =>
          `<a class="card__link" href="${sanitize(l.url)}" target="_blank" rel="noopener noreferrer">${sanitize(l.label)}</a>`
        ).join('')}</div>`;
      } else if (card.link) {
        const label = card.linkLabel || 'View research ↗';
        linkHtml = `<a class="card__link" href="${sanitize(card.link)}" target="_blank" rel="noopener noreferrer">${sanitize(label)}</a>`;
      }
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

    // Redraw connectors after each image loads
    const imgs = canvas.querySelectorAll('img');
    if (imgs.length > 0) {
      function redraw() {
        requestAnimationFrame(() => {
          drawConnectors();
          updateMinimap();
        });
      }
      imgs.forEach(img => {
        if (!img.complete) {
          img.addEventListener('load', redraw, { once: true });
          img.addEventListener('error', redraw, { once: true });
        }
      });
      // Also redraw after a short delay in case images were cached
      setTimeout(redraw, 150);
    }
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
  const addImageBtn = document.getElementById('addImage');
  const imageFileInput = document.getElementById('imageFileInput');
  const dropOverlay = document.getElementById('dropOverlay');
  const exportBtn   = document.getElementById('exportData');
  const resetBtn    = document.getElementById('resetData');
  const restoreBtn  = document.getElementById('restoreBackup');
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
    [addCardBtn, addConnBtn, addImageBtn, exportBtn, resetBtn, restoreBtn].forEach(b => b.style.display = editMode ? '' : 'none');
    hideCtx();
    renderCards();
    if (!editMode) saveState();
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

  // ════════════════════════════════════════
  //  IMAGE UPLOAD / DROP / PASTE
  // ════════════════════════════════════════
  const MAX_IMG_DIM = 1200; // max width or height in px
  const IMG_QUALITY = 0.7;  // JPEG quality

  function resizeImageToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          let { width: w, height: h } = img;
          if (w > MAX_IMG_DIM || h > MAX_IMG_DIM) {
            const ratio = Math.min(MAX_IMG_DIM / w, MAX_IMG_DIM / h);
            w = Math.round(w * ratio);
            h = Math.round(h * ratio);
          }
          const cvs = document.createElement('canvas');
          cvs.width = w; cvs.height = h;
          cvs.getContext('2d').drawImage(img, 0, 0, w, h);
          resolve(cvs.toDataURL('image/jpeg', IMG_QUALITY));
        };
        img.onerror = reject;
        img.src = reader.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function placeImageCard(dataUrl, offsetIndex) {
    const rect = viewport.getBoundingClientRect();
    const cx = Math.round((-panX + rect.width / 2) / scale - 210 + offsetIndex * 40);
    const cy = Math.round((-panY + rect.height / 2) / scale - 100 + offsetIndex * 40);
    CARDS.push({
      id: 'img-' + Date.now() + '-' + offsetIndex,
      title: '',
      phase: '',
      desc: '',
      link: '',
      date: '',
      pin: '',
      x: cx,
      y: cy,
      image: dataUrl,
    });
  }

  async function handleImageFiles(files) {
    const imgs = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (!imgs.length) return;
    for (let i = 0; i < imgs.length; i++) {
      try {
        const dataUrl = await resizeImageToBase64(imgs[i]);
        placeImageCard(dataUrl, i);
      } catch (e) {
        console.error('Image processing failed:', e);
      }
    }
    saveState();
    renderCards();
  }

  // Button click → file picker
  addImageBtn.addEventListener('click', () => {
    imageFileInput.value = '';
    imageFileInput.click();
  });
  imageFileInput.addEventListener('change', () => {
    if (imageFileInput.files.length) handleImageFiles(imageFileInput.files);
  });

  // Drag & drop on viewport
  let dragCounter = 0;
  viewport.addEventListener('dragenter', (e) => {
    if (!editMode) return;
    e.preventDefault();
    dragCounter++;
    dropOverlay.classList.add('visible');
  });
  viewport.addEventListener('dragleave', (e) => {
    if (!editMode) return;
    dragCounter--;
    if (dragCounter <= 0) { dragCounter = 0; dropOverlay.classList.remove('visible'); }
  });
  viewport.addEventListener('dragover', (e) => {
    if (!editMode) return;
    e.preventDefault();
  });
  viewport.addEventListener('drop', (e) => {
    if (!editMode) return;
    e.preventDefault();
    dragCounter = 0;
    dropOverlay.classList.remove('visible');
    if (e.dataTransfer.files.length) handleImageFiles(e.dataTransfer.files);
  });

  // Paste (Ctrl+V)
  document.addEventListener('paste', (e) => {
    if (!editMode) return;
    // Don't intercept paste inside input/textarea
    if (e.target.closest('input, textarea, [contenteditable]')) return;
    const items = Array.from(e.clipboardData.items).filter(i => i.type.startsWith('image/'));
    if (!items.length) return;
    e.preventDefault();
    const files = items.map(i => i.getAsFile()).filter(Boolean);
    if (files.length) handleImageFiles(files);
  });
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
    if (e.button === 2) return;
    const el = e.target.closest('.card');
    if (!el) return;
    if (e.target.closest('.handle')) return;
    // In non-edit mode, allow links; in edit mode, prevent default for drag
    if (e.target.closest('a') && !editMode) return;
    e.preventDefault();
    e.stopPropagation();
    isDragging = true;
    dragCard = el;
    dragCard.classList.add('dragging');
    const id = el.id.replace('card-', '');
    const card = CARDS.find(c => c.id === id);
    if (!card) return;
    const [sx, sy] = clientToCanvas(e.clientX, e.clientY);
    dragOffX = sx - card.x;
    dragOffY = sy - card.y;

    function onMove(ev) {
      const [mx, my] = clientToCanvas(ev.clientX, ev.clientY);
      card.x = snapTo(Math.round(mx - dragOffX));
      card.y = snapTo(Math.round(my - dragOffY));
      el.style.left = card.x + 'px';
      el.style.top = card.y + 'px';
      drawConnectors();
      updateMinimap();
    }
    function onUp() {
      isDragging = false;
      if (dragCard) dragCard.classList.remove('dragging');
      dragCard = null;
      saveState();
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    }
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }

  // \u2500\u2500 Drag from handle to create connection (Obsidian-style) \u2500\u2500
  let connDragLine = null;
  function clientToCanvas(clientX, clientY) {
    const rect = viewport.getBoundingClientRect();
    return [
      (clientX - rect.left - panX) / scale,
      (clientY - rect.top - panY) / scale
    ];
  }

  function onHandleStart(e) {
    e.stopPropagation();
    e.preventDefault();
    const handle = e.target;
    const cardEl = handle.closest('.card');
    const fromId = cardEl.id.replace('card-', '');
    const fromSide = handle.dataset.side;
    const from = CARDS.find(c => c.id === fromId);
    if (!from) return;

    // Create temp SVG with curved path
    let svg = canvas.querySelector('.conn-temp');
    if (!svg) {
      svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.classList.add('conn-temp');
      svg.setAttribute('style', 'position:absolute;top:0;left:0;width:9999px;height:9999px;pointer-events:none;z-index:10;overflow:visible;');
      canvas.appendChild(svg);
    }
    const tempPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    tempPath.setAttribute('stroke', 'var(--accent)');
    tempPath.setAttribute('stroke-width', '2');
    tempPath.setAttribute('stroke-dasharray', '6 4');
    tempPath.setAttribute('fill', 'none');
    svg.appendChild(tempPath);

    // Origin = actual rendered center of the handle element
    const hRect = handle.getBoundingClientRect();
    const [ox, oy] = clientToCanvas(
      hRect.left + hRect.width / 2,
      hRect.top + hRect.height / 2
    );

    function makeBezier(x1, y1, x2, y2, side) {
      const d = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1)) * 0.4;
      let cx1 = x1, cy1 = y1;
      if (side === 'bottom') cy1 = y1 + d;
      else if (side === 'top') cy1 = y1 - d;
      else if (side === 'right') cx1 = x1 + d;
      else if (side === 'left') cx1 = x1 - d;
      return `M${x1},${y1} C${cx1},${cy1} ${x2},${y2} ${x2},${y2}`;
    }

    tempPath.setAttribute('d', makeBezier(ox, oy, ox, oy, fromSide));
    let highlightEl = null;

    function onMove(ev) {
      const [mx, my] = clientToCanvas(ev.clientX, ev.clientY);
      tempPath.setAttribute('d', makeBezier(ox, oy, mx, my, fromSide));

      // Highlight snap target (elementsFromPoint to see through transparent cards)
      if (highlightEl) { highlightEl.classList.remove('snap-target'); highlightEl = null; }
      const elsHover = document.elementsFromPoint(ev.clientX, ev.clientY);
      for (const el of elsHover) {
        const cardEl = el.closest('.card');
        if (cardEl && cardEl.id.replace('card-', '') !== fromId) {
          highlightEl = cardEl;
          break;
        }
      }
      if (!highlightEl) {
        const snap = findSnapTarget(mx, my, fromId);
        if (snap) highlightEl = document.getElementById('card-' + snap.card.id);
      }
      if (highlightEl) highlightEl.classList.add('snap-target');
    }
    function onUp(ev) {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      svg.removeChild(tempPath);
      if (highlightEl) { highlightEl.classList.remove('snap-target'); highlightEl = null; }

      // 1) Try detecting card directly under cursor (elementsFromPoint to see through transparent bg)
      const elsUnder = document.elementsFromPoint(ev.clientX, ev.clientY);
      let targetId = null, targetSide = 'top';

      for (const el of elsUnder) {
        const cardEl = el.closest('.card');
        if (cardEl) {
          const id = cardEl.id.replace('card-', '');
          if (id !== fromId) { targetId = id; break; }
        }
      }

      // 2) Fallback: coordinate-based snap for near-misses
      const [mx, my] = clientToCanvas(ev.clientX, ev.clientY);
      if (!targetId) {
        const snap = findSnapTarget(mx, my, fromId);
        if (snap) {
          targetId = snap.card.id;
          targetSide = snap.side;
        }
      }

      // Determine best side based on mouse position relative to card
      if (targetId && targetId !== fromId) {
        const tc = CARDS.find(c => c.id === targetId);
        const tel = document.getElementById('card-' + targetId);
        if (tc && tel) {
          const cw = tel.offsetWidth, ch = tel.offsetHeight;
          const dx1 = Math.abs(mx - tc.x);
          const dx2 = Math.abs(mx - (tc.x + cw));
          const dy1 = Math.abs(my - tc.y);
          const dy2 = Math.abs(my - (tc.y + ch));
          const min = Math.min(dx1, dx2, dy1, dy2);
          if (min === dx1) targetSide = 'left';
          else if (min === dx2) targetSide = 'right';
          else if (min === dy1) targetSide = 'top';
          else targetSide = 'bottom';
        }
      }

      if (targetId && targetId !== fromId) {
        CONNECTIONS.push([fromId, targetId, fromSide, targetSide]);
        saveState();
        renderCards();
      }
    }
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }

  // Find the closest card within snap range (picks nearest, not first)
  function findSnapTarget(mx, my, excludeId) {
    const SNAP_MARGIN = 50;
    let best = null, bestDist = Infinity;
    for (const c of CARDS) {
      if (c.id === excludeId) continue;
      const el = document.getElementById('card-' + c.id);
      if (!el) continue;
      const cw = el.offsetWidth, ch = el.offsetHeight;
      if (mx < c.x - SNAP_MARGIN || mx > c.x + cw + SNAP_MARGIN ||
          my < c.y - SNAP_MARGIN || my > c.y + ch + SNAP_MARGIN) continue;
      // Distance to card center
      const dist = Math.hypot(mx - (c.x + cw / 2), my - (c.y + ch / 2));
      if (dist < bestDist) {
        bestDist = dist;
        const dx1 = Math.abs(mx - c.x);
        const dx2 = Math.abs(mx - (c.x + cw));
        const dy1 = Math.abs(my - c.y);
        const dy2 = Math.abs(my - (c.y + ch));
        const min = Math.min(dx1, dx2, dy1, dy2);
        let side = 'top';
        if (min === dx1) side = 'left';
        else if (min === dx2) side = 'right';
        else if (min === dy1) side = 'top';
        else side = 'bottom';
        best = { card: c, side, dist };
      }
    }
    return best;
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
  // Get the attachment point for a card edge using the actual rendered position
  function getAttachPoint(cardEl, side) {
    const r = cardEl.getBoundingClientRect();
    // Skip if element has no size (image not loaded yet)
    if (r.width < 5 || r.height < 5) return null;
    switch (side) {
      case 'top':    return clientToCanvas(r.left + r.width / 2, r.top);
      case 'bottom': return clientToCanvas(r.left + r.width / 2, r.bottom);
      case 'left':   return clientToCanvas(r.left, r.top + r.height / 2);
      case 'right':  return clientToCanvas(r.right, r.top + r.height / 2);
    }
    return null;
  }

  function drawConnectors() {
    const old = canvas.querySelector('.connectors');
    if (old) old.remove();
    const svgNs = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNs, 'svg');
    svg.classList.add('connectors');
    svg.setAttribute('style', 'position:absolute;top:0;left:0;width:9999px;height:9999px;z-index:1;overflow:visible;pointer-events:' + (editMode ? 'auto' : 'none') + ';');

    CONNECTIONS.forEach(([fromId, toId, fromSide, toSide], idx) => {
      const fromEl = document.getElementById('card-' + fromId);
      const toEl   = document.getElementById('card-' + toId);
      if (!fromEl || !toEl) return;

      const p1 = getAttachPoint(fromEl, fromSide);
      const p2 = getAttachPoint(toEl, toSide);
      if (!p1 || !p2) return;  // skip if card not fully rendered

      const [x1, y1] = p1;
      const [x2, y2] = p2;

      const dist = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1)) * 0.4;
      let cx1, cy1, cx2, cy2;
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
            saveState();
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
    saveState();
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
    saveState();
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
    saveState();
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

  // Reset to defaults
  resetBtn.addEventListener('click', () => {
    if (!confirm('Reset to default layout? Your custom positions and uploaded images will be lost.')) return;
    localStorage.removeItem(STORAGE_KEY);
    location.reload();
  });

  // Restore from local backup (undo last sync overwrite)
  restoreBtn.addEventListener('click', () => {
    const backup = localStorage.getItem(STORAGE_KEY + '_backup');
    if (!backup) { alert('No local backup found.'); return; }
    let data;
    try { data = JSON.parse(backup); } catch (e) { alert('Backup is corrupt.'); return; }
    const cnt = (data.cards || []).length;
    const ts = data.timestamp ? new Date(data.timestamp).toLocaleString() : 'unknown time';
    if (!confirm('Restore previous local backup with ' + cnt + ' cards (saved ' + ts + ')?\n\nThis will REPLACE current data and push to cloud.')) return;
    CARDS = data.cards || [];
    CONNECTIONS = data.connections || [];
    saveState();
    renderCards();
    alert('Restored ' + cnt + ' cards from backup.');
  });

  // ════════════════════════════════════════
  //  INIT
  // ════════════════════════════════════════
  renderCards();
  resetView();

  // ── Cloud sync: SAFE MODE — do NOT auto-pull on load (prevents bad data wiping local) ──
  // Auto-pull only happens when explicitly clicking the ☁️ indicator,
  // or after the user has actively saved (edit-mode exit). Periodic pull stays
  // active but the safety check inside pullFromRemote() will refuse destructive pulls.
  setSyncStatus('ok', 'Local mode. Click ☁️ to sync with cloud.');
  // Show 🔑 if no token yet
  if (!getGistToken()) {
    const el = document.getElementById('syncStatus');
    if (el) { el.classList.remove('syncing','error','ok'); el.textContent = '🔑'; el.title = 'Click to set up GitHub sync (one-time, paste token).'; }
  }
  setInterval(() => {
    if (!editMode) pullFromRemote();
  }, SYNC_POLL_MS);
  // Pull when tab becomes visible again (still gated by safety check)
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && !editMode) pullFromRemote();
  });
  // Click indicator: opens a touch-friendly menu (works on mobile + desktop)
  const syncEl = document.getElementById('syncStatus');
  if (syncEl) {
    syncEl.style.cursor = 'pointer';
    syncEl.title = 'Tap for sync menu';

    async function runDiagnostics() {
      const results = [];
      const test = async (label, url, opts = {}) => {
        const t0 = performance.now();
        try {
          const r = await fetchWithTimeout(url, opts, 6000);
          const ms = Math.round(performance.now() - t0);
          results.push(label + ': OK (HTTP ' + r.status + ', ' + ms + 'ms)');
        } catch (err) {
          const ms = Math.round(performance.now() - t0);
          results.push(label + ': FAIL (' + (err.name || 'Error') + ': ' + (err.message || 'unknown') + ', ' + ms + 'ms)');
        }
      };
      const gid = getGistId();
      results.push('=== NETWORK DIAGNOSTICS ===');
      results.push('Origin: ' + location.origin);
      results.push('Has token: ' + (getGistToken() ? 'yes' : 'NO'));
      results.push('Gist ID: ' + (gid || '(none)'));
      results.push('');
      await test('1. Internet', 'https://www.google.com/generate_204', { mode: 'no-cors' });
      await test('2. GitHub API', 'https://api.github.com/zen', { headers: gistAuthHeaders() });
      if (gid) await test('3. Gist GET', GIST_API + '/' + gid + '?_=' + Date.now(), { headers: gistAuthHeaders(), cache: 'no-store' });
      results.push('');
      results.push('=== RECENT SYNC LOG ===');
      let log = [];
      try { log = JSON.parse(localStorage.getItem(SYNC_LOG_KEY) || '[]'); } catch (err) {}
      log.slice(-12).forEach(en => {
        const tt = new Date(en.t).toLocaleTimeString();
        results.push('[' + tt + '] ' + en.level.toUpperCase() + ': ' + en.msg);
      });
      prompt('Diagnostics — copy and send:', results.join('\n'));
    }

    function openSyncMenu() {
      // Remove any existing menu
      const existing = document.getElementById('syncMenu');
      if (existing) { existing.remove(); return; }

      const hasToken = !!getGistToken();
      const gid = getGistId();
      const menu = document.createElement('div');
      menu.id = 'syncMenu';
      menu.style.cssText = [
        'position:fixed','top:60px','right:14px','z-index:10000',
        'background:#1a1a1a','color:#fff','border:1px solid #444',
        'border-radius:10px','padding:8px','min-width:240px',
        'box-shadow:0 8px 30px rgba(0,0,0,0.5)','font:14px system-ui,sans-serif'
      ].join(';');

      const mkBtn = (label, onClick) => {
        const b = document.createElement('button');
        b.textContent = label;
        b.style.cssText = 'display:block;width:100%;text-align:left;background:transparent;color:#fff;border:none;padding:10px 12px;border-radius:6px;cursor:pointer;font:inherit';
        b.addEventListener('mouseenter', () => b.style.background = '#2a2a2a');
        b.addEventListener('mouseleave', () => b.style.background = 'transparent');
        b.addEventListener('click', async () => { menu.remove(); await onClick(); });
        return b;
      };

      const status = document.createElement('div');
      status.style.cssText = 'padding:6px 12px 10px;border-bottom:1px solid #333;margin-bottom:6px;color:#aaa;font-size:12px';
      status.textContent = (hasToken ? '✓ Token set' : '✗ No token') + ' · ' + (gid ? 'Gist linked' : 'No gist yet');
      menu.appendChild(status);

      if (hasToken) {
        menu.appendChild(mkBtn('☁️  Push now (save to cloud)', async () => {
          consecutiveFailures = 0;
          rateLimitedUntil = 0;
          setSyncStatus('syncing', 'Pushing local to cloud…');
          saveState();
        }));
        menu.appendChild(mkBtn('⬇️  Pull now (load from cloud)', async () => {
          consecutiveFailures = 0;
          rateLimitedUntil = 0;
          await pullFromRemote();
        }));
      }
      menu.appendChild(mkBtn(hasToken ? '🔑  Replace GitHub token' : '🔑  Enter GitHub token', async () => {
        const t = await promptForGistToken();
        if (t) {
          consecutiveFailures = 0;
          setSyncStatus('ok', 'Token saved. Tap menu → Push to upload.');
        }
      }));
      menu.appendChild(mkBtn('🔗  Link to existing Gist (other device)', async () => {
        const id = await promptForGistId();
        if (id) alert('Gist ID saved. Tap menu → Pull to load data.');
      }));
      menu.appendChild(mkBtn('📋  Show my Gist ID (copy to other device)', async () => {
        const id = getGistId();
        prompt('Your Gist ID:', id || '(none yet — push first to create one)');
      }));
      menu.appendChild(mkBtn('🩺  Diagnostics', runDiagnostics));
      menu.appendChild(mkBtn('🗑️  Clear sync settings', async () => {
        if (confirm('Clear token & gist link? Local data stays. You can re-enter later.')) {
          localStorage.removeItem(GIST_TOKEN_KEY);
          localStorage.removeItem(GIST_ID_KEY);
          location.reload();
        }
      }));
      menu.appendChild(mkBtn('✕  Close', async () => {}));

      document.body.appendChild(menu);
      // Tap outside closes menu
      setTimeout(() => {
        const close = (ev) => {
          if (!menu.contains(ev.target) && ev.target !== syncEl) {
            menu.remove();
            document.removeEventListener('click', close, true);
          }
        };
        document.addEventListener('click', close, true);
      }, 0);
    }

    syncEl.addEventListener('click', (e) => {
      e.stopPropagation();
      openSyncMenu();
    });
  }
})();
