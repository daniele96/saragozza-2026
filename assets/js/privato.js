/* ==========================================================================
   Saragozza 2026 — pagina di lavoro personale
   Checklist, budget, piano eclissi e appunti. Lo stato (spunte e note) vive
   solo nel localStorage del browser: non viene inviato da nessuna parte.
   ========================================================================== */
(function () {
  'use strict';

  const $  = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const esc = (s) => String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

  const CHECK_KEY = 'saragozza-privato-checks';
  const NOTE_KEY = 'saragozza-privato-note';
  const DEPARTURE = new Date('2026-08-10T00:00:00+02:00');

  /* ======================================================================
     Contenuti
     ====================================================================== */

  const DECISIONS = [
    { id: 'dec-1', what: 'Slot Aljafería per martedì 11, ore 10:00',
      why: 'Ingresso a fasce orarie con quota: se si riempie salta l’impianto del martedì, e con esso l’attivazione della Card.',
      when: 'subito', level: 'alta' },
    { id: 'dec-2', what: 'Punto di osservazione dell’eclissi',
      why: 'Serve orizzonte libero verso ovest, e in centro è difficile. Se bisogna uscire da Saragozza cambia anche il trasporto.',
      when: 'entro il 7 agosto', level: 'alta' },
    { id: 'dec-3', what: 'Venerdì 14: mattina a Saragozza sì o no?',
      why: 'Dipende dall’orario del treno per Valencia. Da questo dipende se il Patio de la Infanta resta nel piano.',
      when: 'subito, col treno', level: 'alta' },
    { id: 'dec-4', what: 'Card online o all’ufficio di Delicias?',
      why: 'L’ufficio è comodo (10–20 tutti i giorni, in stazione), ma online si evita la coda del 10 agosto.',
      when: 'entro l’8 agosto', level: 'media' },
    { id: 'dec-5', what: 'Acuario giovedì: si fa o si salta?',
      why: 'Costo pieno non coperto dalla Card, solo sconto. E ruba la serata.',
      when: 'in loco', level: 'bassa' },
    { id: 'dec-6', what: 'Cena della sera del 12',
      why: 'Se Saragozza è in fascia di totalità i ristoranti saranno pieni: o si prenota, o si ripiega su tapas.',
      when: 'entro il 7 agosto', level: 'media' }
  ];

  const CHECKLISTS = [
    {
      id: 'pren', icon: '📅', title: 'Prenotazioni e biglietti',
      items: [
        { id: 'p1', text: 'Slot Aljafería martedì 11, fascia 10:00 — verificare se serve prenotare anche con la Card' },
        { id: 'p2', text: 'Treno o bus Saragozza → Valencia del 14 agosto' },
        { id: 'p3', text: 'Confermare l’alloggio a Delicias e l’orario di check-in del 10' },
        { id: 'p4', text: 'Eventuale tavolo per la sera del 12 — giorno dell’eclissi, città piena' },
        { id: 'p5', text: 'Decidere se comprare la Card online' }
      ]
    },
    {
      id: 'verif', icon: '🔍', title: 'Verifiche sui siti ufficiali',
      note: 'I dati del piano sono 2025/26: vanno ricontrollati prima di partire.',
      items: [
        { id: 'v1', text: 'Aljafería aperta l’11 agosto — è sede delle Cortes de Aragón, può chiudere per eventi istituzionali' },
        { id: 'v2', text: 'La Seo: orario esatto della chiusura a pranzo del mercoledì e orari delle funzioni' },
        { id: 'v3', text: 'Iglesia de San Pablo: torre salibile giovedì 13 nella finestra 10:00–12:30' },
        { id: 'v4', text: 'Patio de la Infanta: sede Ibercaja, ad agosto e il 14 può essere chiuso' },
        { id: 'v5', text: 'Prezzo aggiornato dell’Acuario e sconto effettivo con la Card' },
        { id: 'v6', text: 'Calendario della visita guidata inclusa nella Card per l’11–13 agosto' },
        { id: 'v7', text: 'Meteo a 3 giorni per la sera del 12 — nuvolosità bassa a ovest' }
      ]
    },
    {
      id: 'ecl', icon: '🌒', title: 'Valigia — eclissi',
      items: [
        { id: 'e1', text: 'Occhiali da eclissi certificati ISO 12312-2, uno per persona più uno di scorta' },
        { id: 'e2', text: 'Filtro solare per l’obiettivo, se si fotografa — gli occhiali non bastano per la fotocamera' },
        { id: 'e3', text: 'Treppiede' },
        { id: 'e4', text: 'Batterie cariche e schede di memoria vuote' },
        { id: 'e5', text: 'Torcia frontale a luce rossa: dopo il tramonto si smonta nel buio' }
      ]
    },
    {
      id: 'caldo', icon: '☀️', title: 'Valigia — caldo 35 °C+',
      items: [
        { id: 'c1', text: 'Cappello, occhiali da sole, crema solare alta' },
        { id: 'c2', text: 'Borraccia da riempire alle fontane' },
        { id: 'c3', text: 'Scarpe già rodate: le giornate piene sono tutte a piedi' },
        { id: 'c4', text: 'Sali minerali o integratori' },
        { id: 'c5', text: 'Powerbank — mappa e foto consumano molto' },
        { id: 'c6', text: 'Una maglia leggera a maniche lunghe per le chiese' }
      ]
    }
  ];

  const ECLIPSE_VERIFY = [
    { id: 'ev1', text: 'Saragozza è dentro la fascia di totalità o solo vicina?' },
    { id: 'ev2', text: 'Orario esatto di inizio parziale, inizio e fine totalità' },
    { id: 'ev3', text: 'Durata della totalità in secondi' },
    { id: 'ev4', text: 'Altezza del Sole sull’orizzonte durante la totalità' },
    { id: 'ev5', text: 'Azimut esatto del Sole in quell’istante' }
  ];

  const SPOTS = [
    { name: 'Parque del Agua / zona Expo',
      pro: 'Spazi molto ampi e aperti, orizzonte libero. È già in programma il 13, quindi lo vedo prima. Vicino all’alloggio con le linee 48 / Ci1 / Ci2.',
      con: 'Alberatura da evitare. Sarà il posto più affollato della città.' },
    { name: 'Puente del Tercer Milenio',
      pro: 'Ponte alto sull’Ebro, vista aperta lungo il fiume.',
      con: 'Passerella pubblica: folla e vibrazioni, scomodo col treppiede.' },
    { name: 'Riva dell’Ebro, lato nord',
      pro: 'Il fiume apre l’orizzonte, ampia scelta di punti.',
      con: 'Da verificare che il Sole non tramonti dietro l’edificato.' },
    { name: 'Fuori città, verso ovest',
      pro: 'Orizzonte davvero libero, campagna aperta.',
      con: 'Serve un mezzo, e il traffico di rientro può essere pessimo.' }
  ];

  const BUDGET_FIXED = [
    { label: 'Zaragoza Card 72 ore', min: 24, max: 24 },
    { label: 'Corse bus fuori Card — lun sera e ven mattina, ~4 × 1,70 €', min: 6.8, max: 6.8 }
  ];

  const BUDGET_EST = [
    { label: 'Cena tapas lun 10 — Bula', min: 20, max: 30 },
    { label: 'Cena tapas mar 11 — El Tubo', min: 20, max: 30 },
    { label: 'Cena mer 12 — sera dell’eclissi', min: 25, max: 35, note: 'Più alta: giorno di punta' },
    { label: 'Cena tapas gio 13 — Meli', min: 20, max: 30 },
    { label: 'Pranzi e colazioni × 4', min: 40, max: 60, note: 'Il Mercado Central abbassa il conto' },
    { label: 'Acqua, caffè, gelati', min: 15, max: 25, note: 'A 35 °C non è una voce da sottovalutare' },
    { label: 'Taxi di riserva', min: 0, max: 24, note: '9–12 € la corsa' },
    { label: 'Acuario, se si fa', min: null, max: null, note: 'Da verificare: solo sconto con la Card' }
  ];

  const DAY_NOTES = [
    { id: 'd1', title: 'Lunedì 10', sub: 'Arrivo', points: [
      { kind: 'key', text: 'Ritirare la Card a Delicias (C/ Rioja 33, 10:00–20:00) <strong>senza attivarla</strong>. Se la attivano lunedì si perde mezza giornata di validità e il piano del martedì cade.' },
      { text: 'Al ritiro chiedere: calendario della visita guidata inclusa, elenco dei locali per la tapa, e se serve prenotare l’Aljafería.' },
      { text: 'Il Pilar chiude verso le 20:30: se il treno è in ritardo si salta l’interno e si va diretti al Puente de Piedra, sempre aperto.' },
      { text: 'Meli è chiuso il lunedì → <strong>Bula</strong>, non confondersi.' }
    ]},
    { id: 'd2', title: 'Martedì 11', sub: 'La giornata da non sbagliare', points: [
      { kind: 'key', text: '<strong>Attivare la Card qui, all’Aljafería:</strong> è il primo ingresso incluso del viaggio.' },
      { text: 'A piedi da Delicias, 12–15 min lungo Avda. Madrid: si risparmia una corsa e alle 10 fa ancora fresco.' },
      { text: 'Pausa 14:00–17:00 vera: i musei romani sono chiusi comunque, non si perde niente.' },
      { text: 'Ruta Caesaraugusta nell’ordine Foro → Puerto Fluvial → Termas → Teatro. Pochi minuti l’uno dall’altro, chiudono alle 21.' },
      { text: 'Priorità nei quattro: il <strong>Teatro</strong>. Se il caldo taglia la giornata, gli altri tre si sacrificano prima.' }
    ]},
    { id: 'd3', title: 'Mercoledì 12', sub: 'Mattina secca, poi eclissi', points: [
      { text: 'Due sole visite, entrambe in Plaza del Pilar: nessuno spostamento.' },
      { kind: 'key', text: '<strong>La Seo alle 10:00 in punto</strong>, chiude a pranzo. Gli arazzi sono la cosa che voglio vedere di più: se la mattina va male, si recupera venerdì.' },
      { text: 'Torre del Pilar dopo: ascensore e Museo Pilarista, tutto nello stesso punto.' }
    ]},
    { id: 'd4', title: 'Giovedì 13', sub: 'La finestra stretta', points: [
      { kind: 'key', text: '<strong>San Pablo apre solo 10:00–12:30, mar–sab.</strong> Giovedì 13 è l’unico giorno utile del viaggio per salire sulla torre: se si perde, non si recupera.' },
      { text: 'Mercado Central subito dopo, chiude alle 14.' },
      { text: 'Museo de Zaragoza solo se avanza tempo: è gratuito, zero rimpianti a saltarlo.' },
      { text: 'Rientro da Expo diretto a Delicias con 48 / Ci1 / Ci2, senza passare dal centro.' },
      { text: '<strong>Meli del Tubo:</strong> unica serata piena in cui è aperto. È stasera o mai.' }
    ]},
    { id: 'd5', title: 'Venerdì 14', sub: 'Solo se confermato', points: [
      { text: 'Dipende dall’orario del treno per Valencia.' },
      { text: 'Da usare come recupero di ciò che è saltato, non come nuovo programma.' },
      { text: 'Patio de la Infanta da verificare: sede Ibercaja, ad agosto può essere chiuso.' },
      { text: 'Lasciare margine per bagagli e stazione.' }
    ]}
  ];

  const PRIORITIES = [
    { text: 'Eclissi', note: 'è il motivo del viaggio, tutto il resto è negoziabile' },
    { text: 'Museo de Tapices a La Seo', note: 'gli arazzi' },
    { text: 'Aljafería', note: 'mudéjar UNESCO, e serve per attivare la Card' },
    { text: 'Torre di San Pablo', note: 'finestra irripetibile, solo giovedì mattina' },
    { text: 'Teatro romano', note: '' },
    { text: 'Torre del Pilar', note: '' },
    { text: 'Una sera vera a El Tubo', note: 'senza corsa' },
    { text: 'Gli altri tre siti della Ruta Caesaraugusta', note: '' },
    { text: 'Acuario e zona Expo', note: '' },
    { text: 'Museo de Zaragoza, Patio de la Infanta', note: 'primi a cadere' }
  ];

  const RISKS = [
    { risk: 'Card attivata per errore lunedì', fix: 'Dirlo esplicitamente allo sportello: ritiro sì, attivazione no.' },
    { risk: 'Aljafería senza posto alle 10:00', fix: 'Prenotare lo slot subito: manca meno di una settimana.' },
    { risk: 'Cielo coperto a ovest il 12', fix: 'Piano B meteo deciso entro mezzogiorno del 12, non dopo.' },
    { risk: 'Sole troppo basso, coperto dagli edifici', fix: 'Punto scelto in anticipo sull’azimut verificato, non improvvisato.' },
    { risk: 'Città piena il 12', fix: 'Prenotare cena e trasporti prima.' },
    { risk: 'Colpo di calore in una giornata piena', fix: 'Pausa 14–17 non negoziabile, acqua sempre dietro.' },
    { risk: 'Finestra di San Pablo persa', fix: 'Sveglia presto giovedì: è l’unico slot del viaggio.' },
    { risk: 'Le 9 corse della Card finiscono', fix: 'Contarle: martedì a piedi, giovedì rientro diretto → ne restano di scorta.' },
    { risk: 'Prezzi diversi da quelli del piano', fix: 'Sono dati da verificare: il budget ha già margine.' }
  ];

  const NOTE_FIELDS = [
    { id: 'n1', label: 'Lun 10' },
    { id: 'n2', label: 'Mar 11' },
    { id: 'n3', label: 'Mer 12 — eclissi' },
    { id: 'n4', label: 'Gio 13' },
    { id: 'n5', label: 'Ven 14' },
    { id: 'n6', label: 'Da ricordare per Valencia (14–16)' }
  ];

  /* ======================================================================
     Stato persistente
     ====================================================================== */
  function load(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) { return fallback; }
  }
  function save(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* storage pieno o bloccato */ }
  }

  let checks = load(CHECK_KEY, {});
  let notes = load(NOTE_KEY, {});

  /* ======================================================================
     Tema (stessa chiave della pagina pubblica, così il tema si porta dietro)
     ====================================================================== */
  function initTheme() {
    const KEY = 'saragozza-theme';
    let stored = null;
    try { stored = localStorage.getItem(KEY); } catch (e) { /* ignora */ }
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    const apply = (theme) => {
      document.documentElement.setAttribute('data-theme', theme);
      const btn = $('#themeToggle');
      if (btn) {
        btn.textContent = theme === 'dark' ? '☀️' : '🌙';
        btn.setAttribute('aria-label', theme === 'dark' ? 'Passa al tema chiaro' : 'Passa al tema scuro');
      }
    };

    apply(stored || (prefersDark ? 'dark' : 'light'));
    const btn = $('#themeToggle');
    if (btn) btn.addEventListener('click', () => {
      const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      apply(next);
      try { localStorage.setItem(KEY, next); } catch (e) { /* ignora */ }
    });
  }

  /* ======================================================================
     Countdown
     ====================================================================== */
  function initCountdown() {
    const el = $('#countdown');
    if (!el) return;
    const days = Math.ceil((DEPARTURE - new Date()) / 86400000);
    if (days > 1) el.innerHTML = '<b>' + days + ' giorni</b> alla partenza';
    else if (days === 1) el.innerHTML = '<b>Domani si parte</b>';
    else el.innerHTML = '<b>Viaggio in corso</b>';
  }

  /* ======================================================================
     Rendering
     ====================================================================== */
  function checkbox(id, text, extraClass) {
    return '<li class="chk' + (extraClass ? ' ' + extraClass : '') + '">' +
      '<label>' +
        '<input type="checkbox" data-check="' + id + '"' + (checks[id] ? ' checked' : '') + '>' +
        '<span>' + text + '</span>' +
      '</label>' +
    '</li>';
  }

  function renderDecisions() {
    const el = $('#decisions');
    if (!el) return;
    el.innerHTML = DECISIONS.map((d, i) =>
      '<article class="dec dec--' + d.level + (checks[d.id] ? ' is-done' : '') + '" data-dec="' + d.id + '">' +
        '<div class="dec__num">' + (i + 1) + '</div>' +
        '<div class="dec__body">' +
          '<label class="dec__what">' +
            '<input type="checkbox" data-check="' + d.id + '"' + (checks[d.id] ? ' checked' : '') + '>' +
            '<span>' + esc(d.what) + '</span>' +
          '</label>' +
          '<p class="dec__why">' + esc(d.why) + '</p>' +
          '<span class="dec__when">' + esc(d.when) + '</span>' +
        '</div>' +
      '</article>'
    ).join('');
  }

  function renderChecklists() {
    const el = $('#checklists');
    if (!el) return;
    el.innerHTML = CHECKLISTS.map((group) =>
      '<section class="clist card">' +
        '<h3 class="card__title"><span aria-hidden="true">' + group.icon + '</span> ' + esc(group.title) +
          ' <span class="clist__count" data-count="' + group.id + '"></span></h3>' +
        (group.note ? '<p class="clist__note">' + esc(group.note) + '</p>' : '') +
        '<ul class="chk-list">' +
          group.items.map((it) => checkbox(it.id, esc(it.text))).join('') +
        '</ul>' +
      '</section>'
    ).join('');
  }

  function renderEclipse() {
    const verify = $('#eclipseVerify');
    if (verify) {
      verify.innerHTML = ECLIPSE_VERIFY.map((it) => checkbox(it.id, esc(it.text))).join('');
    }
    const spots = $('#spots');
    if (spots) {
      spots.innerHTML = SPOTS.map((s) =>
        '<tr><td><strong>' + esc(s.name) + '</strong></td>' +
        '<td>' + esc(s.pro) + '</td>' +
        '<td>' + esc(s.con) + '</td></tr>'
      ).join('');
    }
  }

  const eur = (n) => n.toLocaleString('it-IT', { minimumFractionDigits: 0, maximumFractionDigits: 2 }) + ' €';
  const range = (min, max) => (min === max ? eur(min) : eur(min) + ' – ' + eur(max));

  function renderBudget() {
    const body = $('#budgetTable');
    if (!body) return;

    const rows = (list) => list.map((r) =>
      '<tr><td>' + esc(r.label) +
        (r.note ? '<span class="bd__note">' + esc(r.note) + '</span>' : '') +
      '</td><td class="num">' +
        (r.min === null ? '<em>da verificare</em>' : range(r.min, r.max)) +
      '</td></tr>'
    ).join('');

    const sum = (list, key) => list.reduce((t, r) => t + (r[key] || 0), 0);
    const minTot = sum(BUDGET_FIXED, 'min') + sum(BUDGET_EST, 'min');
    const maxTot = sum(BUDGET_FIXED, 'max') + sum(BUDGET_EST, 'max');

    body.innerHTML =
      '<tr class="bd__head"><td colspan="2">Spese certe</td></tr>' +
      rows(BUDGET_FIXED) +
      '<tr class="bd__head"><td colspan="2">Spese stimate</td></tr>' +
      rows(BUDGET_EST) +
      '<tr class="bd__total"><td>Totale</td><td class="num">' + range(minTot, maxTot) + '</td></tr>';

    const foot = $('#budgetFoot');
    if (foot) {
      foot.textContent = 'Esclusi alloggio, treni e Acuario. Una tapa con bevanda è già inclusa ' +
        'nella Card: va usata, non dimenticata.';
    }
  }

  function renderDays() {
    const el = $('#dayNotes');
    if (!el) return;
    el.innerHTML = DAY_NOTES.map((d) =>
      '<article class="dn">' +
        '<header class="dn__head">' +
          '<h3 class="dn__title">' + esc(d.title) + '</h3>' +
          '<span class="dn__sub">' + esc(d.sub) + '</span>' +
        '</header>' +
        '<ul class="dn__list">' +
          d.points.map((p) =>
            '<li' + (p.kind === 'key' ? ' class="dn__key"' : '') + '>' + p.text + '</li>'
          ).join('') +
        '</ul>' +
      '</article>'
    ).join('');
  }

  function renderPriorities() {
    const el = $('#priorities');
    if (!el) return;
    el.innerHTML = PRIORITIES.map((p, i) =>
      '<li class="prio"><span class="prio__n">' + (i + 1) + '</span>' +
      '<span><strong>' + esc(p.text) + '</strong>' +
      (p.note ? ' — <span class="prio__note">' + esc(p.note) + '</span>' : '') +
      '</span></li>'
    ).join('');
  }

  function renderRisks() {
    const el = $('#risks');
    if (!el) return;
    el.innerHTML = RISKS.map((r) =>
      '<tr><td><strong>' + esc(r.risk) + '</strong></td><td>' + esc(r.fix) + '</td></tr>'
    ).join('');
  }

  function renderNotes() {
    const el = $('#notes');
    if (!el) return;
    el.innerHTML = NOTE_FIELDS.map((f) =>
      '<label class="note">' +
        '<span class="note__label">' + esc(f.label) + '</span>' +
        '<textarea data-note="' + f.id + '" id="nota-' + f.id + '" name="nota-' + f.id + '"' +
        ' rows="3" placeholder="Appunti…">' +
          esc(notes[f.id] || '') +
        '</textarea>' +
      '</label>'
    ).join('');
  }

  /* ======================================================================
     Avanzamento
     ====================================================================== */
  function allCheckIds() {
    const ids = DECISIONS.map((d) => d.id).concat(ECLIPSE_VERIFY.map((e) => e.id));
    CHECKLISTS.forEach((g) => g.items.forEach((it) => ids.push(it.id)));
    return ids;
  }

  function updateProgress() {
    const ids = allCheckIds();
    const done = ids.filter((id) => checks[id]).length;
    const pct = ids.length ? Math.round((done / ids.length) * 100) : 0;

    const bar = $('#progressBar');
    const label = $('#progressLabel');
    if (bar) {
      bar.style.width = pct + '%';
      const wrap = $('#progressTrack');
      if (wrap) {
        wrap.setAttribute('aria-valuenow', String(pct));
        wrap.setAttribute('aria-valuetext', done + ' di ' + ids.length + ' voci completate');
      }
    }
    if (label) label.textContent = done + ' / ' + ids.length + ' · ' + pct + '%';

    // Contatore per singola checklist
    CHECKLISTS.forEach((g) => {
      const el = $('[data-count="' + g.id + '"]');
      if (!el) return;
      const n = g.items.filter((it) => checks[it.id]).length;
      el.textContent = n + '/' + g.items.length;
      el.classList.toggle('is-complete', n === g.items.length);
    });

    // Decisioni ancora aperte
    const open = DECISIONS.filter((d) => !checks[d.id]).length;
    const openEl = $('#openDecisions');
    if (openEl) openEl.textContent = String(open);
  }

  /* ======================================================================
     Interazioni
     ====================================================================== */
  function initInteractions() {
    document.addEventListener('change', (ev) => {
      const box = ev.target.closest('input[data-check]');
      if (box) {
        const id = box.dataset.check;
        if (box.checked) checks[id] = true; else delete checks[id];
        save(CHECK_KEY, checks);

        // Le decisioni completate si smorzano
        const card = box.closest('.dec');
        if (card) card.classList.toggle('is-done', box.checked);
        // Tiene allineate eventuali copie della stessa spunta
        $$('input[data-check="' + id + '"]').forEach((other) => { other.checked = box.checked; });
        updateProgress();
        return;
      }

      const area = ev.target.closest('textarea[data-note]');
      if (area) {
        notes[area.dataset.note] = area.value;
        save(NOTE_KEY, notes);
      }
    });

    // Salvataggio durante la digitazione, con debounce
    let timer = null;
    document.addEventListener('input', (ev) => {
      const area = ev.target.closest('textarea[data-note]');
      if (!area) return;
      notes[area.dataset.note] = area.value;
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        save(NOTE_KEY, notes);
        const s = $('#saveState');
        if (s) {
          s.textContent = 'Salvato';
          s.classList.add('is-on');
          window.setTimeout(() => s.classList.remove('is-on'), 1400);
        }
      }, 500);
    });

    const exportBtn = $('#exportBtn');
    if (exportBtn) exportBtn.addEventListener('click', exportMarkdown);

    const resetBtn = $('#resetBtn');
    if (resetBtn) resetBtn.addEventListener('click', () => {
      if (!window.confirm('Azzerare tutte le spunte e gli appunti salvati in questo browser?')) return;
      checks = {}; notes = {};
      save(CHECK_KEY, checks); save(NOTE_KEY, notes);
      $$('input[data-check]').forEach((b) => { b.checked = false; });
      $$('.dec').forEach((d) => d.classList.remove('is-done'));
      $$('textarea[data-note]').forEach((t) => { t.value = ''; });
      updateProgress();
    });
  }

  /* Esporta lo stato corrente come file .md scaricabile */
  function exportMarkdown() {
    const mark = (id) => (checks[id] ? '[x]' : '[ ]');
    const out = [];

    out.push('# Saragozza 2026 — stato personale');
    out.push('');
    out.push('Esportato dalla pagina di lavoro personale.');
    out.push('');

    out.push('## Decisioni');
    DECISIONS.forEach((d) => out.push('- ' + mark(d.id) + ' **' + d.what + '** (' + d.when + ')'));
    out.push('');

    CHECKLISTS.forEach((g) => {
      out.push('## ' + g.title);
      g.items.forEach((it) => out.push('- ' + mark(it.id) + ' ' + it.text));
      out.push('');
    });

    out.push('## Eclissi — da verificare');
    ECLIPSE_VERIFY.forEach((e) => out.push('- ' + mark(e.id) + ' ' + e.text));
    out.push('');

    out.push('## Appunti');
    NOTE_FIELDS.forEach((f) => {
      out.push('### ' + f.label);
      out.push((notes[f.id] || '').trim() || '_vuoto_');
      out.push('');
    });

    const blob = new Blob([out.join('\n')], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'saragozza-stato-personale.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  /* ======================================================================
     Avvio
     ====================================================================== */
  function init() {
    initTheme();
    initCountdown();
    renderDecisions();
    renderChecklists();
    renderEclipse();
    renderBudget();
    renderDays();
    renderPriorities();
    renderRisks();
    renderNotes();
    updateProgress();
    initInteractions();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
