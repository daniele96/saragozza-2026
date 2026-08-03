/* ==========================================================================
   Spagna 2026 — pagina di lavoro personale
   Copre tutto il viaggio: 10 → 23 agosto. Checklist, timeline dei
   trasferimenti, budget, piano eclissi, prenotazioni e appunti.
   Lo stato (spunte e note) vive solo nel localStorage del browser.
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
  const DEPARTURE = new Date('2026-08-10T05:15:00+02:00');
  const RETURN = new Date('2026-08-23T22:55:00+02:00');

  /* ======================================================================
     Colpo d'occhio
     ====================================================================== */
  const TRIP_OVERVIEW = [
    { nights: '10 → 13 ago', n: 4, place: 'Saragozza',
      lodging: 'Alloggio zona stazione Delicias',
      note: 'Con il gruppo. Eclissi il 12', tone: 'card' },
    { nights: '14 → 15 ago', n: 2, place: 'Valencia',
      lodging: 'Suites Rooms Valencia',
      note: 'Da solo. Il gruppo è a Valencia 14–16', tone: 'ebro' },
    { nights: '16 → 22 ago', n: 7, place: 'Benicàssim',
      lodging: 'Tenda Comfort individuale, glamping Festents',
      note: 'Rototom Sunsplash, 16–22 agosto', tone: 'green' },
    { nights: '23 ago', n: 0, place: 'Rientro',
      lodging: 'Valencia → Roma → Bari',
      note: 'Arrivo a Bari alle 22:55', tone: 'gold' }
  ];

  const CHAIN = ['Bitonto', 'Andria', 'Roma Fiumicino', 'Saragozza', 'Valencia',
                 'Benicàssim', 'Valencia aeroporto', 'Roma', 'Bari'];

  /* ======================================================================
     Timeline dei giorni di trasferimento
     ====================================================================== */
  const LEGS = [
    {
      id: 'leg10', date: 'Lunedì 10 agosto', title: 'Puglia → Saragozza',
      tag: 'Trasferimento lungo',
      warn: 'La giornata più delicata del viaggio: quattro mezzi in cascata, e un ritardo iniziale si propaga fino al volo.',
      rows: [
        { time: '~05:15', what: 'Treno dalla stazione di Bitonto verso Andria', note: 'Linea Ferrotramviaria (Bari–Nord). Verificare l’orario esatto del 10 agosto' },
        { time: '~06:00', what: 'Arrivo ad Andria', note: 'Incontro con Cesare' },
        { time: '~06:15', what: 'Partenza in auto Andria → Roma Fiumicino', note: '~450–480 km. È qui che il margine è quasi zero: partire entro le 06:15', key: true },
        { time: '10:30–11:00', what: 'Arrivo a Fiumicino', note: 'Orario obiettivo. Trattare le 11:00 come limite invalicabile' },
        { time: '~12:50', what: 'Chiusura drop-off bagagli Wizz Air', note: 'Indicativamente 40 min prima del volo: da confermare sulla app' },
        { time: '13:30', what: 'Volo W4 6189 Roma Fiumicino → Saragozza', note: 'Wizz Air. Verificare il terminal', key: true },
        { time: '15:40', what: 'Atterraggio a Saragozza', note: 'Volo di circa 2 ore' },
        { time: '~17:00', what: 'Mezzi pubblici verso l’alloggio a Delicias', note: 'Bus urbano oppure taxi, 9–12 €' },
        { time: '20:00 →', what: 'Serata con il gruppo', note: 'Pilar, Puente de Piedra, tapas a Bula. Ritirare la Card a Delicias senza attivarla' }
      ]
    },
    {
      id: 'leg14', date: 'Venerdì 14 agosto', title: 'Saragozza → Valencia',
      tag: 'Passaggio in auto',
      warn: 'Il check-in a Suites Rooms Valencia è 15:00–19:00. Fuori da questa finestra serve accordarsi con l’host.',
      rows: [
        { time: 'Mattina', what: 'Check-out dall’alloggio di Saragozza', note: 'Eventuale ultimo giro in centro col gruppo, se l’orario del passaggio lo consente' },
        { time: 'da definire', what: 'Partenza in auto verso Valencia', note: '~310 km, 3h15–3h45 senza sosta. Per entrare nella finestra bisogna partire tra le 11:00 e le 15:00', key: true },
        { time: '15:00–19:00', what: 'Check-in Suites Rooms Valencia', note: 'Avinguda de Pérez Galdós 12, Extramurs, 46007 Valencia' },
        { time: 'Sera', what: 'Valencia col gruppo', note: 'Sono in città fino al 16' }
      ]
    },
    {
      id: 'leg16', date: 'Domenica 16 agosto', title: 'Valencia → Benicàssim',
      tag: 'Apertura festival',
      warn: 'Da anticipare il più possibile: le tende sono assegnate in ordine di arrivo, e il 16 è il picco delle code.',
      rows: [
        { time: '10:00–10:30', what: 'Check-out da Suites Rooms Valencia', note: 'Finestra fissa, non elastica' },
        { time: 'da definire', what: 'Treno València Nord → Benicàssim', note: 'Diretto, ~8 €, circa 1h30–2h. Domenica con servizio ridotto e treni pieni: biglietto in anticipo', key: true },
        { time: 'Arrivo', what: 'Ritiro braccialetti festival + campeggio', note: 'Servono entrambi per rientrare al campeggio ogni volta' },
        { time: 'Poi', what: 'Check-in glamping Festents', note: 'Check-in online già fatto (#VU8YwLWr): si passa dalla coda prioritaria' }
      ]
    },
    {
      id: 'leg23', date: 'Domenica 23 agosto', title: 'Benicàssim → Bari',
      tag: 'Rientro',
      warn: 'Quattro tratte in un giorno, con un’attesa lunga in mezzo. Coincidenza di Roma garantita: stessa compagnia, stessa prenotazione.',
      rows: [
        { time: 'Mattina', what: 'Check-out dal campeggio', note: 'Obbligatorio avvisare la reception per l’ispezione della tenda. Riconsegnare il lucchetto' },
        { time: '12:30', what: 'Transfer Rototom → Valencia Aeroporto', note: 'Ordine #3984, 30 € già pagati', key: true },
        { time: '~14:00', what: 'Arrivo all’aeroporto di Valencia', note: 'Percorrenza di circa 1h30' },
        { time: '14:00–15:25', what: 'Attesa', note: 'Il check-in ITA apre in genere 2–3 h prima. Verificare se c’è il deposito bagagli' },
        { time: '17:25', what: 'Volo AZ095 Valencia → Roma Fiumicino', note: 'ITA Airways. Volo Schengen: nessun controllo passaporti a Roma' },
        { time: '19:20', what: 'Atterraggio a Roma, scalo di 2h25', note: 'Solo bagaglio a mano: si passa diretti al gate, niente nastro', key: true },
        { time: '21:45', what: 'Volo AZ1603 Roma Fiumicino → Bari', note: 'ITA Airways, stessa prenotazione' },
        { time: '22:55', what: 'Arrivo a Bari', note: 'Passaggio da confermare' }
      ]
    }
  ];

  /* ======================================================================
     Decisioni e cose da definire — tutto il viaggio, per urgenza
     ====================================================================== */
  const DECISIONS = [
    { id: 'dec-1', phase: 'Saragozza', what: 'Slot Aljafería per martedì 11, ore 10:00',
      why: 'Ingresso a fasce orarie con quota: se si riempie salta l’impianto del martedì, e con esso l’attivazione della Card.',
      when: 'subito', level: 'alta' },
    { id: 'dec-7', phase: 'Valencia', what: 'Orario del passaggio in auto del 14',
      why: 'In valutazione con chi guida. Decide due cose: se resta una mattina a Saragozza, e se il check-in a Valencia rientra nella finestra 15:00–19:00. Appena c’è, avvisare l’host.',
      when: 'appena possibile', level: 'alta' },
    { id: 'dec-8', phase: 'Festival', what: 'Treno del 16 per Benicàssim: orario e biglietto',
      why: 'Domenica con servizio ridotto e tutti che vanno allo stesso posto. Verificare su Renfe se serve la prenotazione del posto.',
      when: 'entro il 14', level: 'alta' },
    { id: 'dec-2', phase: 'Saragozza', what: 'Punto di osservazione dell’eclissi',
      why: 'Serve orizzonte libero verso ovest, e in centro è difficile. Se bisogna uscire da Saragozza cambia anche il trasporto.',
      when: 'entro il 7 agosto', level: 'alta' },
    { id: 'dec-4', phase: 'Saragozza', what: 'Zaragoza Card online o all’ufficio di Delicias?',
      why: 'L’ufficio è comodo (10–20 tutti i giorni, in stazione), ma online si evita la coda del 10 agosto.',
      when: 'entro l’8 agosto', level: 'media' },
    { id: 'dec-6', phase: 'Saragozza', what: 'Cena della sera del 12',
      why: 'Se Saragozza è in fascia di totalità i ristoranti saranno pieni: o si prenota, o si ripiega su tapas.',
      when: 'entro il 7 agosto', level: 'media' },
    { id: 'dec-11', phase: 'Festival', what: 'Cambio anticipato biglietto → braccialetto',
      why: 'Rototom lo permette per evitare le code, ma l’unica pagina con orari precisi che ho trovato è del 2022: gli orari 2026 vanno riverificati sul sito o sulla Festapp.',
      when: 'entro il 15', level: 'media' },
    { id: 'dec-9', phase: 'Rientro', what: 'Chi mi viene a prendere a Bari il 23',
      why: 'Arrivo in aereo alle 22:55. Da chiarire se il passaggio è all’aeroporto di Bari o se serve un treno successivo.',
      when: 'entro il 20', level: 'media' },
    { id: 'dec-5', phase: 'Saragozza', what: 'Acuario giovedì 13: si fa o si salta?',
      why: 'Costo pieno non coperto dalla Card, solo sconto. E ruba la serata.',
      when: 'in loco', level: 'bassa' },
    { id: 'dec-12', phase: 'Rientro', what: 'Cosa fare delle 3h20 di attesa a Valencia',
      why: 'Il transfer arriva alle 14:00 per un volo alle 17:25, dopo sette notti in tenda. Se c’è il deposito bagagli si può uscire.',
      when: 'entro il 22', level: 'bassa' }
  ];

  const RESOLVED = [
    'Scalo di Roma del 23 — stessa compagnia, stessa prenotazione, solo bagaglio a mano',
    'Check-in online glamping — fatto a marzo, ordine #VU8YwLWr',
    'Abbonamento festival con diritto di campeggio — acquistato con camping'
  ];

  /* ======================================================================
     Checklist
     ====================================================================== */
  const CHECKLISTS = [
    {
      id: 'pren', icon: '📅', title: 'Prenotazioni e biglietti',
      items: [
        { id: 'p1', text: 'Slot Aljafería martedì 11, fascia 10:00 — la più urgente' },
        { id: 'p6', text: 'Avvisare l’host di Suites Rooms dell’orario di arrivo del 14' },
        { id: 'p7', text: 'Biglietto treno València Nord → Benicàssim del 16' },
        { id: 'p3', text: 'Confermare l’alloggio a Delicias e l’orario di check-in del 10' },
        { id: 'p4', text: 'Eventuale tavolo per la sera del 12 — giorno dell’eclissi, città piena' },
        { id: 'p5', text: 'Decidere se comprare la Zaragoza Card online' }
      ]
    },
    {
      id: 'verif', icon: '🔍', title: 'Verifiche sui siti ufficiali',
      note: 'I dati del piano sono 2025/26: vanno ricontrollati prima di partire.',
      items: [
        { id: 'v8', text: 'Orario del treno Bitonto → Andria del 10 agosto (Ferrotramviaria)' },
        { id: 'v9', text: 'Terminal Wizz Air a Fiumicino e chiusura drop-off bagagli' },
        { id: 'v10', text: 'Renfe: orari del 16 agosto e se il treno richiede prenotazione del posto' },
        { id: 'v1', text: 'Aljafería aperta l’11 agosto — è sede delle Cortes de Aragón' },
        { id: 'v2', text: 'La Seo: chiusura a pranzo del mercoledì e orari delle funzioni' },
        { id: 'v3', text: 'Iglesia de San Pablo: torre salibile giovedì 13, finestra 10:00–12:30' },
        { id: 'v4', text: 'Patio de la Infanta: sede Ibercaja, ad agosto e il 14 può essere chiuso' },
        { id: 'v5', text: 'Prezzo aggiornato dell’Acuario e sconto effettivo con la Card' },
        { id: 'v11', text: 'Valencia: il 15 agosto è festivo anche in Spagna, orari ridotti' },
        { id: 'v7', text: 'Meteo a 3 giorni per la sera del 12 — nuvolosità bassa a ovest' }
      ]
    },
    {
      id: 'bag', icon: '🎒', title: 'Bagaglio',
      note: 'Un solo bagaglio per tre contesti: città a 35 °C, una settimana in tenda, due compagnie diverse.',
      items: [
        { id: 'b1', text: 'Verificare la franchigia di bagaglio a mano + zainetto su Wizz Air (10 ago) e ITA (23 ago): sono misure diverse' },
        { id: 'b2', text: 'Pesare e misurare il bagaglio a casa, non all’aeroporto' },
        { id: 'b3', text: 'NON portare materasso, lenzuola, torcia e lucchetto: sono già nella tenda' },
        { id: 'b4', text: 'Borsa morbida meglio del trolley rigido: in tenda lo spazio è poco' },
        { id: 'b5', text: 'Ciabatte per le docce del campeggio' },
        { id: 'b6', text: 'Powerbank capiente: al campeggio le prese sono un problema' },
        { id: 'b7', text: 'Tappi per le orecchie e mascherina per dormire' },
        { id: 'b8', text: 'Occhiali da eclissi ISO 12312-2: servono il 12, quindi in valigia dal 10' }
      ]
    },
    {
      id: 'doc', icon: '📄', title: 'Documenti e cose da avere addosso',
      items: [
        { id: 'd1', text: 'Carta d’identità o passaporto in corso di validità' },
        { id: 'd2', text: 'Tessera sanitaria con retro TEAM per la Spagna' },
        { id: 'd3', text: 'Carte di pagamento, più una di riserva separata' },
        { id: 'd4', text: 'Carte d’imbarco dei tre voli salvate offline' },
        { id: 'd5', text: 'Screenshot sul telefono: glamping #VU8YwLWr con check-in confermato, transfer #3984, prenotazione Valencia' },
        { id: 'd6', text: 'Codice occupante tenda CA58804RF a portata di mano' }
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
        { id: 'c6', text: 'Una maglia leggera a maniche lunghe per le chiese' }
      ]
    }
  ];

  /* ======================================================================
     Eclissi
     ====================================================================== */
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

  /* ======================================================================
     Budget
     ====================================================================== */
  const BUDGET_FIXED = [
    { label: 'Zaragoza Card 72 ore', min: 24, max: 24 },
    { label: 'Corse bus fuori Card a Saragozza, ~4 × 1,70 €', min: 6.8, max: 6.8 },
    { label: 'Treno Valencia → Benicàssim del 16', min: 8, max: 8 },
    { label: 'Transfer Rototom → aeroporto del 23', min: 30, max: 30, note: 'Ordine #3984, già pagato' }
  ];

  const BUDGET_EST = [
    { label: 'Cene a tapas a Saragozza × 4', min: 85, max: 125, note: 'Bula, El Tubo, sera dell’eclissi, Meli' },
    { label: 'Pranzi e colazioni a Saragozza × 4', min: 40, max: 60, note: 'Il Mercado Central abbassa il conto' },
    { label: 'Valencia, 2 giorni', min: 60, max: 100, note: '14–15 agosto, vitto e trasporti' },
    { label: 'Festival, 7 giorni di vitto e bevande', min: 140, max: 250, note: 'Da ricaricare sul cashless' },
    { label: 'Acqua, caffè, gelati col caldo', min: 25, max: 40, note: 'A 35 °C non è una voce da sottovalutare' },
    { label: 'Taxi e imprevisti', min: 0, max: 40 },
    { label: 'Acuario di Saragozza, se si fa', min: null, max: null, note: 'Da verificare: solo sconto con la Card' }
  ];

  /* ======================================================================
     Note per giorno — Saragozza
     ====================================================================== */
  const DAY_NOTES = [
    { id: 'd1', title: 'Lunedì 10', sub: 'Arrivo', points: [
      { kind: 'key', text: 'Ritirare la Card a Delicias (C/ Rioja 33, 10:00–20:00) <strong>senza attivarla</strong>. Se la attivano lunedì si perde mezza giornata di validità e il piano del martedì cade.' },
      { text: 'Al ritiro chiedere: calendario della visita guidata inclusa, elenco dei locali per la tapa, e se serve prenotare l’Aljafería.' },
      { text: 'Il Pilar chiude verso le 20:30: se il volo o il viaggio slittano si salta l’interno e si va diretti al Puente de Piedra, sempre aperto.' },
      { text: 'Meli è chiuso il lunedì → <strong>Bula</strong>, non confondersi.' }
    ]},
    { id: 'd2', title: 'Martedì 11', sub: 'La giornata da non sbagliare', points: [
      { kind: 'key', text: '<strong>Attivare la Card qui, all’Aljafería:</strong> è il primo ingresso incluso del viaggio.' },
      { text: 'A piedi da Delicias, 12–15 min lungo Avda. Madrid: si risparmia una corsa e alle 10 fa ancora fresco.' },
      { text: 'Pausa 14:00–17:00 vera: i musei romani sono chiusi comunque, non si perde niente.' },
      { text: 'Ruta Caesaraugusta nell’ordine Foro → Puerto Fluvial → Termas → Teatro. Chiudono alle 21.' },
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
    { id: 'd5', title: 'Venerdì 14', sub: 'Dipende dal passaggio', points: [
      { text: 'Se il passaggio per Valencia parte tardi, c’è spazio per un giro corto: Patio de la Infanta e calle Alfonso I.' },
      { text: 'Da usare come recupero di ciò che è saltato, non come nuovo programma.' },
      { text: 'Patio de la Infanta da verificare: sede Ibercaja, ad agosto può essere chiuso.' }
    ]}
  ];

  const PRIORITIES = [
    { text: 'Eclissi', note: 'è il motivo della tappa di Saragozza, tutto il resto è negoziabile' },
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

  /* ======================================================================
     Rischi
     ====================================================================== */
  const RISKS = [
    { risk: 'Andria → Fiumicino il 10', fix: '~450–480 km in 4h15–4h45 per arrivare alle 10:30–11:00: con una sosta e traffico di agosto il margine si azzera. Partire entro le 06:15 e trattare le 11:00 come limite.' },
    { risk: 'Tende assegnate in ordine di arrivo', fix: 'Primo treno utile dopo il check-out delle 10:30 del 16: la posizione te la tieni per sette notti.' },
    { risk: 'Finestra check-in Valencia 15:00–19:00', fix: 'Partire da Saragozza tra le 11:00 e le 15:00, oppure concordare l’orario con l’host.' },
    { risk: 'Bagaglio a mano fuori misura', fix: 'Wizz e ITA hanno regole diverse: misurare e pesare a casa.' },
    { risk: 'Trolley stivato per pieno carico il 23', fix: 'Imbarcare presto: a Bari eviterebbe l’attesa al nastro a mezzanotte.' },
    { risk: 'Treno del 16, domenica di apertura festival', fix: 'Biglietto in anticipo, verificare se serve prenotazione del posto.' },
    { risk: 'Card attivata per errore lunedì', fix: 'Dirlo esplicitamente allo sportello: ritiro sì, attivazione no.' },
    { risk: 'Cielo coperto a ovest il 12', fix: 'Piano B meteo deciso entro mezzogiorno del 12, non dopo.' },
    { risk: 'Sole troppo basso, coperto dagli edifici', fix: 'Punto scelto in anticipo sull’azimut verificato, non improvvisato.' },
    { risk: 'Saragozza piena il 12', fix: 'Prenotare cena e trasporti prima.' },
    { risk: 'Colpo di calore in una giornata piena', fix: 'Pausa 14–17 non negoziabile, acqua sempre dietro.' },
    { risk: 'Finestra di San Pablo persa', fix: 'Sveglia presto giovedì: è l’unico slot del viaggio.' },
    { risk: 'Le 9 corse della Card finiscono', fix: 'Martedì a piedi, giovedì rientro diretto → ne restano di scorta.' },
    { risk: 'Lucchetto della tenda smarrito', fix: '5 € in reception. Agganciarlo sempre nello stesso posto.' }
  ];

  /* ======================================================================
     Prenotazioni
     ====================================================================== */
  const BOOKINGS = [
    { what: 'Volo Roma Fiumicino → Saragozza', ref: 'W4 6189 · 10 ago 13:30 → 15:40', ok: true },
    { what: 'Alloggio Saragozza', ref: 'Zona stazione Delicias · 10 → 14 ago', ok: true },
    { what: 'Passaggio in auto Saragozza → Valencia', ref: '14 ago, orario da definire', ok: false },
    { what: 'Alloggio Valencia', ref: 'Suites Rooms Valencia · Avinguda de Pérez Galdós 12, Extramurs, 46007 · 14 → 16 ago · 1 adulto, 2 notti · check-in 15:00–19:00, check-out 10:00–10:30', ok: true },
    { what: 'Treno Valencia → Benicàssim', ref: '16 ago, ~8 €, orario da definire', ok: false },
    { what: 'Abbonamento festival con camping', ref: 'Indispensabile: il glamping sta dentro il campeggio', ok: true },
    { what: 'Glamping Festents', ref: 'Comfort individuale · ordine #VU8YwLWr · occupante DANIELE MONTE (CA58804RF) · 16 → 23 ago', ok: true },
    { what: 'Check-in online glamping', ref: 'Completato a marzo 2026, ordine #VU8YwLWr', ok: true },
    { what: 'Transfer Rototom → Valencia aeroporto', ref: 'Ordine #3984 · 23 ago 12:30 · 30 € pagati', ok: true },
    { what: 'Voli del rientro', ref: 'AZ095 17:25 → 19:20 e AZ1603 21:45 → 22:55 · unica prenotazione ITA, coincidenza garantita', ok: true },
    { what: 'Passaggio all’arrivo a Bari', ref: '23 ago, ~22:55', ok: false }
  ];

  /* ======================================================================
     Campeggio
     ====================================================================== */
  const CAMP = {
    expulsion: [
      'Fumare dentro la tenda',
      'Accendere fuochi nel campeggio',
      'Urinare o defecare in aree non autorizzate'
    ],
    forbidden: [
      'Portare materassi o biancheria fuori dalla tenda'
    ],
    duties: [
      'Check-in online fatto prima di accedere all’area glamping',
      'Avvisare la reception alla partenza, per l’ispezione della tenda',
      'Usare cestini e contenitori. Sacchi per la spazzatura in reception su richiesta',
      'Conservare e usare in modo appropriato gli arredi'
    ],
    included: [
      'Materasso alto 10 cm',
      'Set completo di biancheria da letto',
      'Torcia elettrica',
      'Lucchetto'
    ],
    damage: [
      { item: 'Tenda imperatore', cost: '1.300 €' },
      { item: 'Tenda a campana', cost: '800 €' },
      { item: 'Tenda Easy, Deluxe o Comfort', cost: '200 €' },
      { item: 'Set di lenzuola', cost: '85 €' },
      { item: 'Materasso', cost: '60 €' },
      { item: 'Tavolo', cost: '40 €' },
      { item: 'Sedia', cost: '20 €' },
      { item: 'Lucchetto', cost: '5 €' }
    ]
  };

  const NOTE_FIELDS = [
    { id: 'n1', label: 'Lun 10 — trasferimento' },
    { id: 'n2', label: 'Saragozza 11–13' },
    { id: 'n3', label: 'Mer 12 — eclissi' },
    { id: 'n4', label: 'Valencia 14–15' },
    { id: 'n5', label: 'Benicàssim 16–22' },
    { id: 'n6', label: 'Dom 23 — rientro' }
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
     Tema (stessa chiave della pagina pubblica)
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
  /* Differenza in giorni di calendario, non in millisecondi: "6 giorni" deve
     significare sei date sul calendario, come lo intende una persona. */
  function dayDiff(from, to) {
    const a = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate());
    const b = Date.UTC(to.getFullYear(), to.getMonth(), to.getDate());
    return Math.round((b - a) / 86400000);
  }

  function initCountdown() {
    const el = $('#countdown');
    if (!el) return;
    const now = new Date();
    const days = dayDiff(now, DEPARTURE);

    if (now > RETURN) el.innerHTML = '<b>Viaggio concluso</b>';
    else if (days <= 0) {
      el.innerHTML = '<b>Viaggio in corso</b> · ' + dayDiff(now, RETURN) + ' giorni alla fine';
    } else if (days === 1) el.innerHTML = '<b>Domani si parte</b>';
    else el.innerHTML = '<b>' + days + ' giorni</b> alla partenza';
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

  function renderOverview() {
    const el = $('#overview');
    if (el) {
      el.innerHTML = TRIP_OVERVIEW.map((s) =>
        '<article class="seg seg--' + s.tone + '">' +
          '<span class="seg__dates">' + esc(s.nights) + (s.n ? ' · ' + s.n + (s.n === 1 ? ' notte' : ' notti') : '') + '</span>' +
          '<h3 class="seg__place">' + esc(s.place) + '</h3>' +
          '<p class="seg__lodging">' + esc(s.lodging) + '</p>' +
          '<p class="seg__note">' + esc(s.note) + '</p>' +
        '</article>'
      ).join('');
    }
    const chain = $('#chain');
    if (chain) {
      chain.innerHTML = CHAIN.map((c) => '<li>' + esc(c) + '</li>').join('');
    }
  }

  function renderLegs() {
    const el = $('#legs');
    if (!el) return;
    el.innerHTML = LEGS.map((leg) =>
      '<article class="leg" id="' + leg.id + '">' +
        '<header class="leg__head">' +
          '<div>' +
            '<h3 class="leg__date">' + esc(leg.date) + '</h3>' +
            '<p class="leg__title">' + esc(leg.title) + '</p>' +
          '</div>' +
          '<span class="day__tag">' + esc(leg.tag) + '</span>' +
        '</header>' +
        '<p class="leg__warn">' + esc(leg.warn) + '</p>' +
        '<ol class="timeline">' + leg.rows.map((r) =>
          '<li class="tl' + (r.key ? ' tl--highlight' : '') + '">' +
            '<span class="tl__time">' + esc(r.time) + '</span>' +
            '<h4 class="tl__title">' + esc(r.what) + '</h4>' +
            '<p class="tl__note">' + esc(r.note) + '</p>' +
          '</li>'
        ).join('') + '</ol>' +
      '</article>'
    ).join('');
  }

  function renderDecisions() {
    const el = $('#decisions');
    if (el) {
      el.innerHTML = DECISIONS.map((d, i) =>
        '<article class="dec dec--' + d.level + (checks[d.id] ? ' is-done' : '') + '">' +
          '<div class="dec__num">' + (i + 1) + '</div>' +
          '<div class="dec__body">' +
            '<label class="dec__what">' +
              '<input type="checkbox" data-check="' + d.id + '"' + (checks[d.id] ? ' checked' : '') + '>' +
              '<span>' + esc(d.what) + '</span>' +
            '</label>' +
            '<p class="dec__why">' + esc(d.why) + '</p>' +
            '<span class="dec__when">' + esc(d.when) + '</span>' +
            '<span class="dec__phase">' + esc(d.phase) + '</span>' +
          '</div>' +
        '</article>'
      ).join('');
    }
    const res = $('#resolved');
    if (res) {
      res.innerHTML = RESOLVED.map((r) => '<li>' + esc(r) + '</li>').join('');
    }
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
    if (verify) verify.innerHTML = ECLIPSE_VERIFY.map((it) => checkbox(it.id, esc(it.text))).join('');

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
      '<tr class="bd__total"><td>Totale, 14 giorni</td><td class="num">' + range(minTot, maxTot) + '</td></tr>';
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

  function renderBookings() {
    const el = $('#bookings');
    if (!el) return;
    el.innerHTML = BOOKINGS.map((b) =>
      '<tr><td><strong>' + esc(b.what) + '</strong></td>' +
      '<td>' + esc(b.ref) + '</td>' +
      '<td class="num"><span class="badge badge--' + (b.ok ? 'ok' : 'todo') + '">' +
        (b.ok ? '✓ ok' : '⚠ da definire') + '</span></td></tr>'
    ).join('');
  }

  function renderCamp() {
    const list = (id, items) => {
      const el = $(id);
      if (el) el.innerHTML = items.map((i) => '<li>' + esc(i) + '</li>').join('');
    };
    list('#campExpulsion', CAMP.expulsion);
    list('#campForbidden', CAMP.forbidden);
    list('#campDuties', CAMP.duties);
    list('#campIncluded', CAMP.included);

    const dmg = $('#campDamage');
    if (dmg) {
      dmg.innerHTML = CAMP.damage.map((d) =>
        '<tr><td>' + esc(d.item) + '</td><td class="num">' + esc(d.cost) + '</td></tr>'
      ).join('');
    }
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
    if (bar) {
      bar.style.width = pct + '%';
      const wrap = $('#progressTrack');
      if (wrap) {
        wrap.setAttribute('aria-valuenow', String(pct));
        wrap.setAttribute('aria-valuetext', done + ' di ' + ids.length + ' voci completate');
      }
    }
    const label = $('#progressLabel');
    if (label) label.textContent = done + ' / ' + ids.length + ' · ' + pct + '%';

    CHECKLISTS.forEach((g) => {
      const el = $('[data-count="' + g.id + '"]');
      if (!el) return;
      const n = g.items.filter((it) => checks[it.id]).length;
      el.textContent = n + '/' + g.items.length;
      el.classList.toggle('is-complete', n === g.items.length);
    });

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

        const card = box.closest('.dec');
        if (card) card.classList.toggle('is-done', box.checked);
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
    const out = ['# Spagna 2026 — stato personale', '',
                 'Esportato dalla pagina di lavoro personale.', ''];

    out.push('## Decisioni e cose da definire');
    DECISIONS.forEach((d) => out.push('- ' + mark(d.id) + ' **' + d.what + '** — ' + d.phase + ', ' + d.when));
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
    a.download = 'spagna-2026-stato-personale.md';
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
    renderOverview();
    renderLegs();
    renderDecisions();
    renderChecklists();
    renderEclipse();
    renderBudget();
    renderDays();
    renderPriorities();
    renderRisks();
    renderBookings();
    renderCamp();
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
