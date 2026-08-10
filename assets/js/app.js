/* ==========================================================================
   Saragozza 2026 — logica dell'interfaccia
   Rende le sezioni dai dati di data.js e gestisce la mappa Leaflet.
   ========================================================================== */
(function () {
  'use strict';

  const $  = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const esc = (s) => String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

  /* ======================================================================
     Tema chiaro/scuro
     ====================================================================== */
  const THEME_KEY = 'saragozza-theme';

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const btn = $('#themeToggle');
    if (btn) {
      btn.textContent = theme === 'dark' ? '☀️' : '🌙';
      btn.setAttribute('aria-label', theme === 'dark' ? 'Passa al tema chiaro' : 'Passa al tema scuro');
    }
    const meta = $('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#191512' : '#B4532A');
  }

  function initTheme() {
    let stored = null;
    try { stored = localStorage.getItem(THEME_KEY); } catch (e) { /* storage non disponibile */ }
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(stored || (prefersDark ? 'dark' : 'light'));

    const btn = $('#themeToggle');
    if (btn) btn.addEventListener('click', () => {
      const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem(THEME_KEY, next); } catch (e) { /* ignora */ }
    });
  }

  /* ======================================================================
     Header: menu mobile, evidenziazione sezione attiva, torna su
     ====================================================================== */
  function initNav() {
    const toggle = $('#navToggle');
    const list = $('#navList');

    if (toggle && list) {
      toggle.addEventListener('click', () => {
        const open = list.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', String(open));
        toggle.textContent = open ? '✕' : '☰';
        toggle.setAttribute('aria-label', open ? 'Chiudi il menu' : 'Apri il menu');
      });
      list.addEventListener('click', (ev) => {
        if (ev.target.closest('a') && list.classList.contains('is-open')) {
          list.classList.remove('is-open');
          toggle.setAttribute('aria-expanded', 'false');
          toggle.textContent = '☰';
        }
      });
    }

    // Sezione attiva nella navigazione
    const links = $$('.nav__link');
    const sections = links
      .map((a) => document.getElementById(a.getAttribute('href').slice(1)))
      .filter(Boolean);

    if ('IntersectionObserver' in window && sections.length) {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          links.forEach((a) => a.classList.toggle(
            'is-active', a.getAttribute('href') === '#' + entry.target.id
          ));
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      sections.forEach((s) => obs.observe(s));
    }

    // Pulsante torna su
    const toTop = $('#toTop');
    if (toTop) {
      toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
      const onScroll = () => toTop.classList.toggle('is-visible', window.scrollY > 700);
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }
  }

  /* ======================================================================
     Countdown alla partenza
     ====================================================================== */
  function initCountdown() {
    const el = $('#countdown');
    if (!el) return;
    const start = new Date('2026-08-10T00:00:00+02:00');
    const end = new Date('2026-08-14T23:59:59+02:00');
    const now = new Date();
    const days = Math.ceil((start - now) / 86400000);

    if (now > end) el.textContent = 'Viaggio del 10–14 agosto 2026';
    else if (now >= start) el.innerHTML = '<b>Viaggio in corso</b> · 10–14 agosto 2026';
    else if (days === 1) el.innerHTML = '<b>Domani si parte</b> · 10 agosto 2026';
    else el.innerHTML = 'Partenza tra <b>' + days + ' giorni</b> · 10–14 agosto 2026';
  }

  /* ======================================================================
     Panoramica: finestre di disponibilità
     ====================================================================== */
  function renderAvailability() {
    const el = $('#availList');
    if (!el) return;
    el.innerHTML = DAYS.map((d) =>
      '<div class="deflist__row"><dt>' + esc(d.label.replace(' agosto', '')) + '</dt>' +
      '<dd>' + esc(d.avail) + '</dd></div>'
    ).join('');
  }

  /* ======================================================================
     Biglietti: cosa comprende ciascuno dei due bono combinati
     ====================================================================== */
  function renderTickets() {
    const renderIncludes = (el, ticket) => {
      if (!el) return;
      el.innerHTML = ticket.includes.map((i) =>
        '<li><span><strong>' + esc(i.name) + '</strong> — ' + esc(i.hours) +
        ' <span class="val">' + esc(i.where) + '</span></span></li>'
      ).join('');
    };
    renderIncludes($('#cattedraliList'), TICKET_CATTEDRALI);
    renderIncludes($('#romanoList'), TICKET_ROMANO);
  }

  /* ======================================================================
     Attrazioni fuori dai bono + tabella luoghi extra
     ====================================================================== */
  function renderAttractions() {
    const grid = $('#attrGrid');
    if (grid) {
      grid.innerHTML = ATTRACTIONS.map((a) =>
        '<article class="attr">' +
          '<div class="attr__top">' +
            '<h3 class="attr__name">' + esc(a.name) + '</h3>' +
            '<span class="attr__price">' + esc(a.price) + '</span>' +
          '</div>' +
          '<p class="attr__meta">' +
            '<span class="attr__hours">' + esc(a.hours) + '</span>' +
            '<span class="attr__where">' + esc(a.where) + '</span>' +
          '</p>' +
        '</article>'
      ).join('');
    }

    const tbody = $('#extraTable');
    if (tbody) {
      const typeOf = { panorama: 'Piazza / panorama', food: 'Tapas e mercati', extra: 'Museo / visita', logistica: 'Logistica' };
      tbody.innerHTML = PLACES
        .filter((p) => p.cat !== 'romano' && p.cat !== 'cattedrali')
        .map((p) =>
          '<tr><td><strong>' + esc(p.name) + '</strong></td>' +
          '<td>' + esc(typeOf[p.cat] || '—') + '</td>' +
          '<td>' + esc(p.note) + '</td></tr>'
        ).join('');
    }
  }

  /* ======================================================================
     Itinerario: tab dei giorni + timeline
     ====================================================================== */
  function renderItinerary() {
    const tabs = $('#dayTabs');
    const panels = $('#dayPanels');
    if (!tabs || !panels) return;

    tabs.innerHTML = ITINERARY.map((d, i) =>
      '<button class="day-tab" role="tab" id="tab-' + d.day + '"' +
      ' aria-controls="panel-' + d.day + '" aria-selected="' + (i === 0) + '"' +
      ' tabindex="' + (i === 0 ? '0' : '-1') + '">' +
        '<strong>' + esc(d.date.split(' ').slice(0, 2).join(' ')) + '</strong>' +
        '<span>' + esc(d.tag.split(' · ')[0]) + '</span>' +
      '</button>'
    ).join('');

    panels.innerHTML = ITINERARY.map((d, i) =>
      '<section class="day" id="panel-' + d.day + '" role="tabpanel"' +
      ' aria-labelledby="tab-' + d.day + '"' + (i === 0 ? '' : ' hidden') + '>' +
        '<div class="day__head">' +
          '<h3 class="day__date">' + esc(d.date) + '</h3>' +
          '<span class="day__tag">' + esc(d.tag) + '</span>' +
        '</div>' +
        '<p class="day__intro">' + esc(d.intro) + '</p>' +
        '<ol class="timeline">' + d.stops.map((s) =>
          '<li class="tl' + (s.highlight ? ' tl--highlight' : '') + '">' +
            '<span class="tl__time">' + esc(s.time) + '</span>' +
            '<h4 class="tl__title">' + esc(s.title) + '</h4>' +
            '<p class="tl__note">' + esc(s.note) + '</p>' +
            (s.place ? '<button class="tl__link" data-place="' + esc(s.place) + '">📍 Mostra sulla mappa</button>' : '') +
          '</li>'
        ).join('') + '</ol>' +
      '</section>'
    ).join('');

    const tabEls = $$('.day-tab', tabs);

    function select(idx, focus) {
      tabEls.forEach((t, i) => {
        const on = i === idx;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        $('#panel-' + ITINERARY[i].day).hidden = !on;
      });
      if (focus) tabEls[idx].focus();
    }

    tabEls.forEach((t, i) => t.addEventListener('click', () => select(i, false)));
    tabs.addEventListener('keydown', (ev) => {
      const current = tabEls.findIndex((t) => t.getAttribute('aria-selected') === 'true');
      let next = null;
      if (ev.key === 'ArrowRight') next = (current + 1) % tabEls.length;
      if (ev.key === 'ArrowLeft') next = (current - 1 + tabEls.length) % tabEls.length;
      if (ev.key === 'Home') next = 0;
      if (ev.key === 'End') next = tabEls.length - 1;
      if (next === null) return;
      ev.preventDefault();
      select(next, true);
    });

    // Se il giorno corrente cade nel viaggio, aprilo di default
    const today = new Date();
    if (today.getFullYear() === 2026 && today.getMonth() === 7) {
      const idx = ITINERARY.findIndex((d) => d.day === today.getDate() - 9);
      if (idx > 0) select(idx, false);
    }
  }

  /* ======================================================================
     Eclissi
     ====================================================================== */
  function renderEclipse() {
    const safety = $('#eclipseSafety');
    if (safety) safety.innerHTML = ECLIPSE_SAFETY.map((s) => '<li><span>' + s + '</span></li>').join('');

    const why = $('#eclipseWhy');
    if (why) why.innerHTML = ECLIPSE_WHY;

    const kit = $('#eclipseKit');
    if (kit) {
      kit.innerHTML = ECLIPSE_KIT.map((k) =>
        '<div class="card">' +
          '<h3 class="card__title"><span aria-hidden="true">' + k.icon + '</span> ' + esc(k.what) + '</h3>' +
          '<p>' + esc(k.why) + '</p>' +
        '</div>'
      ).join('');
    }

    const check = $('#eclipseCheck');
    if (check) check.innerHTML = ECLIPSE_CHECK.map((c) => '<li><span>' + esc(c) + '</span></li>').join('');
  }

  /* ======================================================================
     Note pratiche
     ====================================================================== */
  function renderRules() {
    const el = $('#rulesList');
    if (!el) return;
    el.innerHTML = RULES.map((r) =>
      '<li class="rule">' +
        '<span class="rule__icon" aria-hidden="true">' + r.icon + '</span>' +
        '<div><h3 class="rule__title">' + esc(r.title) + '</h3>' +
        '<p class="rule__text">' + esc(r.text) + '</p></div>' +
      '</li>'
    ).join('');
  }

  /* ======================================================================
     Trasporti
     ====================================================================== */
  function renderTransport() {
    const routes = $('#routesTable');
    if (routes) {
      routes.innerHTML = TRANSPORT_ROUTES.map((r) =>
        '<tr><td><strong>' + esc(r.mode) + '</strong></td>' +
        '<td>' + esc(r.detail) + '</td>' +
        '<td class="num">' + esc(r.time) + '</td></tr>'
      ).join('');
    }
    const fares = $('#faresTable');
    if (fares) {
      fares.innerHTML = TRANSPORT_FARES.map((f) =>
        '<tr><td>' + esc(f.title) + '</td>' +
        '<td class="num"><strong>' + esc(f.price) + '</strong></td></tr>'
      ).join('');
    }
  }

  /* ======================================================================
     Bus turistico (servizio a parte, non i bus urbani)
     ====================================================================== */
  function renderBusTuristico() {
    const route = $('#busTuristicoRoute');
    if (route) route.textContent = BUS_TURISTICO.route;

    const fares = $('#busFaresTable');
    if (fares) {
      fares.innerHTML = BUS_TURISTICO.fares.map((f) =>
        '<tr><td>' + esc(f.title) + '</td>' +
        '<td class="num"><strong>' + esc(f.price) + '</strong></td></tr>'
      ).join('');
    }

    const faresNote = $('#busFaresNote');
    if (faresNote) faresNote.textContent = BUS_TURISTICO.faresNote;

    const offers = $('#busOffersList');
    if (offers) {
      offers.innerHTML = BUS_TURISTICO.offers.map((o) =>
        '<li><span><strong>' + esc(o.title) + '</strong> — ' + esc(o.detail) + '</span></li>'
      ).join('');
    }
  }

  /* ======================================================================
     Mappa Leaflet
     ====================================================================== */
  const mapState = {
    map: null,
    markers: new Map(),          // nome del luogo -> marker
    activeCats: new Set(Object.keys(CATEGORIES)),
    activeDays: new Set(DAYS.map((d) => d.id))
  };

  function popupHtml(p) {
    const cat = CATEGORIES[p.cat];
    const gmaps = 'https://www.google.com/maps/search/?api=1&query=' + p.lat + ',' + p.lng;
    const dayLabels = p.days
      .map((id) => (DAYS.find((d) => d.id === id) || {}).short)
      .filter(Boolean).join(' · ');

    return '<div>' +
      '<span class="pop__tag" style="background:' + cat.color + '">' + esc(cat.label) + '</span>' +
      '<h3 class="pop__name">' + esc(p.name) + '</h3>' +
      '<p class="pop__row">💶 ' + esc(p.price) + '</p>' +
      '<p class="pop__row">🕒 ' + esc(p.hours) + '</p>' +
      (dayLabels ? '<p class="pop__row">🗓️ ' + esc(dayLabels) + '</p>' : '') +
      '<p class="pop__note">' + esc(p.note) + '</p>' +
      '<a class="pop__link" href="' + gmaps + '" target="_blank" rel="noopener">Apri in Google Maps →</a>' +
      '</div>';
  }

  function initMap() {
    const host = $('#map');
    if (!host) return;

    if (typeof L === 'undefined') {
      host.innerHTML = '<p class="place-list__empty">Impossibile caricare la mappa: ' +
        'la libreria Leaflet non è raggiungibile. Le coordinate restano disponibili ' +
        'nell’elenco dei luoghi.</p>';
      return;
    }

    const map = L.map(host, { scrollWheelZoom: false, zoomControl: true });
    mapState.map = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    map.on('click', () => map.scrollWheelZoom.enable());
    map.on('mouseout', () => map.scrollWheelZoom.disable());

    PLACES.forEach((p) => {
      const color = CATEGORIES[p.cat].color;
      const marker = L.marker([p.lat, p.lng], {
        title: p.name,
        alt: p.name,
        icon: L.divIcon({
          className: '',
          html: '<div class="pin" style="background:' + color + '"></div>',
          iconSize: [16, 16],
          iconAnchor: [8, 16],
          popupAnchor: [0, -14]
        })
      });
      marker.bindPopup(popupHtml(p), { maxWidth: 290, minWidth: 220 });
      marker._place = p;
      mapState.markers.set(p.name, marker);
    });

    renderFilters();
    applyFilters();
  }

  function renderFilters() {
    const cats = $('#catFilters');
    if (cats) {
      cats.innerHTML = Object.keys(CATEGORIES).map((key) =>
        '<button class="chip" data-cat="' + key + '" aria-pressed="true">' +
          '<span class="chip__dot" style="background:' + CATEGORIES[key].color + '"></span>' +
          esc(CATEGORIES[key].label) +
        '</button>'
      ).join('');
      cats.addEventListener('click', (ev) => {
        const btn = ev.target.closest('.chip');
        if (!btn) return;
        toggleSet(mapState.activeCats, btn.dataset.cat, btn);
        applyFilters();
      });
    }

    const days = $('#dayFilters');
    if (days) {
      days.innerHTML =
        '<button class="chip chip--day" data-day="all" aria-pressed="true">Tutti i giorni</button>' +
        DAYS.map((d) =>
          '<button class="chip chip--day" data-day="' + d.id + '" aria-pressed="true">' + esc(d.short) + '</button>'
        ).join('');
      days.addEventListener('click', (ev) => {
        const btn = ev.target.closest('.chip');
        if (!btn) return;

        if (btn.dataset.day === 'all') {
          DAYS.forEach((d) => mapState.activeDays.add(d.id));
          $$('.chip', days).forEach((c) => c.setAttribute('aria-pressed', 'true'));
        } else {
          toggleSet(mapState.activeDays, Number(btn.dataset.day), btn);
          const allBtn = $('[data-day="all"]', days);
          if (allBtn) allBtn.setAttribute('aria-pressed', String(mapState.activeDays.size === DAYS.length));
        }
        applyFilters();
      });
    }
  }

  function toggleSet(set, value, btn) {
    if (set.has(value)) {
      set.delete(value);
      btn.setAttribute('aria-pressed', 'false');
    } else {
      set.add(value);
      btn.setAttribute('aria-pressed', 'true');
    }
  }

  function visiblePlaces() {
    return PLACES.filter((p) =>
      mapState.activeCats.has(p.cat) && p.days.some((d) => mapState.activeDays.has(d))
    );
  }

  function applyFilters() {
    const visible = visiblePlaces();
    const names = new Set(visible.map((p) => p.name));

    if (mapState.map) {
      mapState.markers.forEach((marker, name) => {
        const on = names.has(name);
        if (on && !mapState.map.hasLayer(marker)) marker.addTo(mapState.map);
        if (!on && mapState.map.hasLayer(marker)) mapState.map.removeLayer(marker);
      });

      if (visible.length) {
        const bounds = L.latLngBounds(visible.map((p) => [p.lat, p.lng]));
        mapState.map.fitBounds(bounds, { padding: [40, 40], maxZoom: 16 });
      }
    }

    renderPlaceList(visible);
  }

  function renderPlaceList(visible) {
    const list = $('#placeList');
    const count = $('#visibleCount');
    if (count) count.textContent = visible.length + ' / ' + PLACES.length;
    if (!list) return;

    if (!visible.length) {
      list.innerHTML = '<li class="place-list__empty">Nessun luogo con questi filtri.</li>';
      return;
    }

    list.innerHTML = visible.map((p) =>
      '<li><button class="place-list__btn" data-place="' + esc(p.name) + '"' +
      ' style="--cat-color:' + CATEGORIES[p.cat].color + '">' +
        '<span class="place-list__name">' + esc(p.name) + '</span>' +
        '<span class="place-list__meta">' + esc(p.price) + '</span>' +
      '</button></li>'
    ).join('');
  }

  /* Focalizza un luogo sulla mappa: usato dall'elenco e dai link della timeline */
  function focusPlace(name, scroll) {
    const marker = mapState.markers.get(name);
    if (!marker) return;
    const place = marker._place;

    // Riattiva i filtri necessari perché il marker sia visibile
    let changed = false;
    if (!mapState.activeCats.has(place.cat)) {
      mapState.activeCats.add(place.cat);
      const chip = $('#catFilters [data-cat="' + place.cat + '"]');
      if (chip) chip.setAttribute('aria-pressed', 'true');
      changed = true;
    }
    if (!place.days.some((d) => mapState.activeDays.has(d))) {
      place.days.forEach((d) => mapState.activeDays.add(d));
      place.days.forEach((d) => {
        const chip = $('#dayFilters [data-day="' + d + '"]');
        if (chip) chip.setAttribute('aria-pressed', 'true');
      });
      changed = true;
    }
    if (changed) applyFilters();

    if (scroll) {
      const section = $('#mappa');
      if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    const go = () => {
      if (!mapState.map) return;
      mapState.map.setView([place.lat, place.lng], 17, { animate: true });
      marker.openPopup();
      const pin = marker.getElement() && marker.getElement().querySelector('.pin');
      if (pin) {
        pin.classList.remove('pin--pulse');
        void pin.offsetWidth;
        pin.classList.add('pin--pulse');
      }
    };
    scroll ? window.setTimeout(go, 420) : go();
  }

  function initPlaceInteractions() {
    document.addEventListener('click', (ev) => {
      const btn = ev.target.closest('[data-place]');
      if (!btn) return;
      focusPlace(btn.dataset.place, btn.classList.contains('tl__link'));
    });
  }

  /* ======================================================================
     Avvio
     ====================================================================== */
  function init() {
    initTheme();
    initNav();
    initCountdown();
    renderAvailability();
    renderTickets();
    renderAttractions();
    renderItinerary();
    renderEclipse();
    renderTransport();
    renderBusTuristico();
    renderRules();
    initMap();
    initPlaceInteractions();

    const pc = $('#placeCount');
    if (pc) pc.textContent = String(PLACES.length);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
