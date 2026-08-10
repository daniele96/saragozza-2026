/* ==========================================================================
   Saragozza 2026 — dati del viaggio
   Fonte: saragozza-pianificazione.md
   ========================================================================== */

/* Categorie usate per colori, filtri e legenda della mappa */
const CATEGORIES = {
  romano:     { label: 'Siti romani (bono 7 €)',      color: '#B4532A' },
  cattedrali: { label: 'Cattedrali e Rosario (12 €)',  color: '#7B3F61' },
  panorama:   { label: 'Piazze e panorami',            color: '#1F5B78' },
  food:       { label: 'Tapas e mercati',              color: '#C08A1E' },
  extra:      { label: 'Altri luoghi',                 color: '#4F7A5B' },
  logistica:  { label: 'Logistica',                    color: '#6B6257' }
};

/* Giorni del viaggio: usati dal filtro della mappa e dalla timeline */
const DAYS = [
  { id: 1, short: 'Lun 10', label: 'Lunedì 10 agosto', avail: 'Solo dalla sera (arrivo)' },
  { id: 2, short: 'Mar 11', label: 'Martedì 11 agosto', avail: 'Giornata intera' },
  { id: 3, short: 'Mer 12', label: 'Mercoledì 12 agosto', avail: 'Città fino alle 13:00, poi escursione alle Bardenas fino all’1:30' },
  { id: 4, short: 'Gio 13', label: 'Giovedì 13 agosto', avail: 'Giornata intera' },
  { id: 5, short: 'Ven 14', label: 'Venerdì 14 agosto', avail: 'Eventualmente solo mattina' }
];

/* --------------------------------------------------------------------------
   Luoghi con coordinate GPS (marker della mappa)
   `approx: true` = coordinata ricostruita dall'indirizzo, non presente nei dati
   -------------------------------------------------------------------------- */
const PLACES = [
  {
    name: 'Palazzo dell’Aljafería',
    cat: 'extra',
    lat: 41.6560942, lng: -0.8970488,
    price: '~5 €',
    hours: 'Tutti i giorni 10:00–17:15',
    days: [4],
    note: 'Mudéjar UNESCO, ~1,5 h. Chiude alle 17:15: nelle ore calde è la visita al chiuso giusta. Ingresso a fasce orarie con quota: assicurarsi lo slot. A 12–15 min a piedi da Delicias. Biglietto separato, non incluso nei bono delle cattedrali o della Ruta Caesaraugusta.'
  },
  {
    name: 'La Seo – Catedral del Salvador + Museo de Tapices',
    cat: 'cattedrali',
    lat: 41.6545606, lng: -0.8757358,
    price: 'Incluso nel biglietto congiunto 12 €',
    hours: 'Chiude a pranzo — andare presto',
    days: [3],
    note: 'Arazzi fiamminghi tra i migliori d’Europa.'
  },
  {
    name: 'Basílica del Pilar — Torre panoramica e musei',
    cat: 'cattedrali',
    lat: 41.6568982, lng: -0.8785056,
    price: 'Torre, Museo Pilarista e Rosario de Cristal inclusi nel biglietto congiunto 12 €',
    hours: 'Basílica ~8:00–20:30',
    days: [3],
    note: 'Interno della Basílica sempre gratuito: si visita mercoledì alle 9:00, appena apre. La torre panoramica si sale solo con il biglietto congiunto completo, non si vende a parte.'
  },
  {
    name: 'Ruta Caesaraugusta — Museo del Foro',
    cat: 'romano',
    lat: 41.6551667, lng: -0.8763235,
    price: 'Incluso nel bono 4 siti 7 €',
    hours: 'Lun chiuso · Mar–Sab 10–14 e 17–21 · Dom 10–14:30',
    days: [2],
    note: 'Primo dei quattro siti romani. Il bono combinato dei 4 musei costa 7 € ed è il modo più semplice per visitarli tutti.'
  },
  {
    name: 'Ruta Caesaraugusta — Museo del Teatro',
    cat: 'romano',
    lat: 41.6525348, lng: -0.8772734,
    price: 'Incluso nel bono 4 siti 7 €',
    hours: 'Lun chiuso · Mar–Sab 10–14 e 17–21 · Dom 10–14:30',
    days: [2],
    note: 'Il più scenografico dei quattro: teatro romano da 6.000 spettatori.'
  },
  {
    name: 'Ruta Caesaraugusta — Termas Públicas',
    cat: 'romano',
    lat: 41.6533, lng: -0.8767, approx: true,
    price: 'Incluso nel bono 4 siti 7 €',
    hours: 'Lun chiuso · Mar–Sab 10–14 e 17–21 · Dom 10–14:30',
    days: [2],
    note: 'Calle San Juan y San Pedro. Posizione sulla mappa approssimativa (nei dati c’era solo l’indirizzo).'
  },
  {
    name: 'Ruta Caesaraugusta — Puerto Fluvial',
    cat: 'romano',
    lat: 41.6549, lng: -0.8752, approx: true,
    price: 'Incluso nel bono 4 siti 7 €',
    hours: 'Lun chiuso · Mar–Sab 10–14 e 17–21 · Dom 10–14:30',
    days: [2],
    note: 'Plaza San Bruno, accanto a La Seo. Posizione sulla mappa approssimativa (nei dati c’era solo la piazza).'
  },
  {
    name: 'Plaza del Pilar',
    cat: 'panorama',
    lat: 41.6566, lng: -0.8785,
    price: 'Gratuito',
    hours: 'Sempre',
    days: [1, 3],
    note: 'Cuore del centro storico. Qui c’è anche un ufficio del turismo, utile per informazioni.'
  },
  {
    name: 'Puente de Piedra',
    cat: 'panorama',
    lat: 41.6572038, lng: -0.8753503,
    price: 'Gratuito',
    hours: 'Sempre — migliore al tramonto',
    days: [1],
    note: 'La foto classica del Pilar riflesso sull’Ebro, all’ora blu.'
  },
  {
    name: 'Iglesia de San Pablo',
    cat: 'extra',
    lat: 41.6560155, lng: -0.8858844,
    price: 'Offerta libera',
    hours: 'Mar–Sab 10:00–12:30',
    days: [4],
    note: 'La “terza cattedrale”. Torre mudéjar salibile con vista a 360°: finestra oraria stretta, arrivare alle 10.'
  },
  {
    name: 'Mercado Central',
    cat: 'food',
    lat: 41.6561291, lng: -0.8828511,
    price: 'Gratuito',
    hours: 'Lun–Ven 9–14 e 17:30–20 · Sab fino 14:30 · Dom chiuso',
    days: [4],
    note: 'Ristrutturato di recente. Perfetto per aperitivo o spuntino a metà mattina.'
  },
  {
    name: 'El Tubo',
    cat: 'food',
    lat: 41.6526, lng: -0.8795,
    price: 'A consumazione',
    hours: 'Sere',
    days: [1, 4],
    note: 'Il quartiere delle tapas: calle Estébanes, Libertad, Cuatro de Agosto. Ci sono sia Bula (lunedì) sia Meli (giovedì). Martedì invece la cena è prenotata alla Miguería.'
  },
  {
    name: 'Bula del Tubo',
    cat: 'food',
    lat: 41.6526206, lng: -0.8802795,
    price: 'A consumazione',
    hours: 'Aperto anche il lunedì',
    days: [1],
    note: 'Foie e madejas. È la scelta del lunedì sera, quando Meli è chiuso.'
  },
  {
    name: 'Meli del Tubo',
    cat: 'food',
    lat: 41.6528, lng: -0.8798,
    price: 'A consumazione',
    hours: 'Chiuso lun–mar',
    days: [4],
    note: 'Da tenere per giovedì sera, l’unica serata piena in cui è aperto.'
  },
  {
    name: 'Museo de Zaragoza',
    cat: 'extra',
    lat: 41.6510, lng: -0.8770,
    price: 'Gratuito',
    hours: 'Chiuso il lunedì',
    days: [2],
    note: 'Sale dedicate a Goya. Opzionale e gratuito, da infilare se la mattina di martedì avanza tempo dopo i siti romani.'
  },
  {
    name: 'Acuario de Zaragoza',
    cat: 'extra',
    lat: 41.6692044, lng: -0.8986434,
    price: 'Prezzo pieno; combinato con bus turistico diurno o Megabus: 21,60 €',
    hours: '~10:00–20:00',
    days: [4],
    note: 'Il più grande acquario d’acqua dolce d’Europa, nel Parque del Agua. Linee 48 / Ci1 / Ci2 verso Delicias. Il combinato bus turistico + Acuario si acquista solo agli uffici del turismo.'
  },
  {
    name: 'Zona Expo 2008',
    cat: 'panorama',
    lat: 41.6690, lng: -0.8930,
    price: 'Gratuito',
    hours: 'Passeggiata serale',
    days: [4],
    note: 'Pabellón Puente, Torre del Agua e la scultura Alma del Ebro.'
  },
  {
    name: 'Patio de la Infanta',
    cat: 'extra',
    lat: 41.6520, lng: -0.8830,
    price: 'Gratuito',
    hours: 'Orari d’ufficio',
    days: [5],
    note: 'Cortile rinascimentale in centro. Giro corto di chiusura del venerdì.'
  },
  {
    name: 'Stazione Zaragoza-Delicias',
    cat: 'logistica',
    lat: 41.6588, lng: -0.9110,
    price: '—',
    hours: 'Ufficio turismo (C/ Rioja 33) 10:00–20:00 tutti i giorni',
    days: [1, 2, 3, 4, 5],
    note: 'Zona dell’alloggio. A 2,8–3 km dal centro: bus Ci3 o 34, oppure taxi 9–12 €.'
  }
];

/* --------------------------------------------------------------------------
   Biglietti per i monumenti (agosto 2026)
   La Zaragoza Card non è più attiva: restano due bono combinati separati.
   -------------------------------------------------------------------------- */
const TICKET_CATTEDRALI = {
  title: 'Entrada conjunta cattedrali',
  price: '12 €',
  validity: '48 ore',
  note: 'La Subida a la Torre non si vende a parte: è compresa solo comprando questo biglietto completo.',
  includes: [
    { name: 'Catedral del Salvador (La Seo) + Museo de Tapices', hours: 'Chiude a pranzo, andare presto', where: 'Centro storico' },
    { name: 'Catedral-Basílica del Pilar + Museo Pilarista', hours: 'Basílica aperta ~8:00–20:30', where: 'Plaza del Pilar' },
    { name: 'Rosario de Cristal', hours: 'Dentro/presso la Basílica', where: 'Plaza del Pilar' },
    { name: 'Subida a la Torre', hours: 'Solo con biglietto completo', where: 'Basílica del Pilar' }
  ]
};

const TICKET_ROMANO = {
  title: 'Bono Ruta Caesaraugusta',
  price: '7 €',
  validity: null,
  note: 'Biglietto unico per i 4 siti romani, in alternativa ai biglietti singoli.',
  includes: [
    { name: 'Museo del Foro', hours: 'Lun chiuso · Mar–Sab 10–14 e 17–21 · Dom 10–14:30', where: 'Plaza de la Seo' },
    { name: 'Museo del Teatro', hours: 'Lun chiuso · Mar–Sab 10–14 e 17–21 · Dom 10–14:30', where: 'C/ San Jorge' },
    { name: 'Termas Públicas', hours: 'Lun chiuso · Mar–Sab 10–14 e 17–21 · Dom 10–14:30', where: 'C/ San Juan y San Pedro' },
    { name: 'Puerto Fluvial', hours: 'Lun chiuso · Mar–Sab 10–14 e 17–21 · Dom 10–14:30', where: 'Plaza San Bruno' }
  ]
};

/* Attrazioni fuori dai due bono, per la tabella di confronto prezzi */
const ATTRACTIONS = [
  { name: 'Palazzo dell’Aljafería (con audioguida)', price: '~5 €',
    hours: 'Tutti i giorni 10:00–17:15', where: 'Ovest del centro' },
  { name: 'Musei civici (Gargallo, Pablo Serrano/IAACC, Centro de Historias, Palacio de Sástago, Etnológico, Cerámica, Museo del Fuego)',
    price: 'Quasi tutti già gratuiti',
    hours: 'Molti chiusi il lunedì', where: 'Centro storico' }
];

/* --------------------------------------------------------------------------
   Bus turistico (servizio a pagamento separato, non un bono per i monumenti)
   -------------------------------------------------------------------------- */
const BUS_TURISTICO = {
  route: 'Partenza da Calle Don Jaime I, vicino alla Lonja · Durata ~90 minuti',
  fares: [
    { title: 'Generale', price: '10 €' },
    { title: 'Over 65 o tessera trasporti gratuiti del Comune di Saragozza', price: '5 €' },
    { title: 'Disoccupati*', price: '5 €' },
    { title: 'Carta giovani* / Studenti* / Persone con disabilità* / Famiglie monoparentali*', price: '8 €' },
    { title: 'Bambini sotto i 5 anni (senza posto a sedere)', price: 'Gratuito' },
    { title: 'Gruppo di 4 persone', price: '30 €' }
  ],
  faresNote: '*Per le tariffe ridotte serve il documento valido corrispondente. Tariffa generale e over 65 si comprano a bordo, in contanti; le altre solo online o agli uffici del turismo.',
  offers: [
    { title: 'Bus turistico diurno o Megabus + Acuario', detail: 'Adulti 21,60 € · Bambini 5–12 anni 17,60 €. Biglietto solo agli uffici del turismo.' },
    { title: 'Bus turistico diurno o Megabus + Mobility City', detail: 'Adulti 16,60 € · Bambini 5–12 anni 13,60 €. Biglietto solo agli uffici del turismo.' },
    { title: 'Sconto al parco divertimenti', detail: '7 € di sconto sul braccialetto Super Fun e su quello bambini, con il biglietto del bus turistico diurno o Megabus.' }
  ]
};

/* --------------------------------------------------------------------------
   Itinerario giorno per giorno
   -------------------------------------------------------------------------- */
const ITINERARY = [
  {
    day: 1, date: 'Lunedì 10 agosto', tag: 'Sera · a costo zero',
    intro: 'Serata a costo zero, tutto a piedi in centro. L’interno della Basílica si vede mercoledì mattina con calma.',
    stops: [
      { time: '20:00', title: 'Plaza del Pilar', note: 'La piazza e l’esterno della Basílica illuminati. L’interno è in programma mercoledì mattina.', place: 'Plaza del Pilar' },
      { time: '20:45', title: 'Puente de Piedra', note: 'La foto classica del Pilar sull’Ebro nell’ora blu.', place: 'Puente de Piedra' },
      { time: '21:30', title: 'Bula del Tubo', note: 'Cena a tapas. È aperto il lunedì, a differenza di Meli.', place: 'Bula del Tubo' }
    ]
  },
  {
    day: 2, date: 'Martedì 11 agosto', tag: 'Giornata piena · bono Caesaraugusta',
    intro: 'La giornata della Caesaraugusta romana. Qui il via alle 9:00 non è applicabile: i musei romani aprono alle 10:00 e chiudono dalle 14:00 alle 17:00, quindi la pausa lunga è imposta dagli orari, non scelta.',
    stops: [
      { time: '10:00', title: 'Ruta Caesaraugusta — Foro e Puerto Fluvial', note: 'Comprare qui il bono dei 4 siti (7 €), al Museo del Foro. I due siti sono entrambi in Plaza de la Seo.', place: 'Ruta Caesaraugusta — Museo del Foro', highlight: true },
      { time: '12:00', title: 'Museo de Zaragoza', note: 'Gratuito e al chiuso: sale dedicate a Goya. Riempie la mattina fino alla chiusura.', place: 'Museo de Zaragoza' },
      { time: '14:00–16:00', title: 'Pranzo e pausa', note: 'Due ore, non tre. È il minimo possibile: i musei romani riaprono solo alle 17:00.' },
      { time: '16:00', title: 'Giro a piedi in centro', note: 'Un’ora all’ombra tra i vicoli e le piazze, in attesa della riapertura.' },
      { time: '17:00', title: 'Ruta Caesaraugusta — Termas e Teatro', note: 'Aperti fino alle 21. Il Teatro è il più scenografico dei quattro.', place: 'Ruta Caesaraugusta — Museo del Teatro' },
      { time: '20:00–21:45', title: 'Cena alla Miguería — prenotata', note: 'Plaza Santiago Sas 6, 50003 Zaragoza. Tavolo per 12 persone, confermato.', highlight: true }
    ]
  },
  {
    day: 3, date: 'Mercoledì 12 agosto', tag: 'Mattina in città · pomeriggio e notte alle Bardenas',
    intro: 'Si parte alle 9:00 e la mattina resta tutta in Plaza del Pilar, senza spostamenti. Alle 13:00 il programma cittadino chiude e alle 14:00 parte l’escursione per l’eclissi nel deserto delle Bardenas, con rientro all’1:30.',
    stops: [
      { time: '09:00', title: 'Basílica del Pilar — la Virgen del Pilar', note: 'Interno sempre gratuito, con la cappella della Virgen del Pilar. La Basílica apre verso le 8:00, quindi alle 9 si entra con calma e senza folla.', place: 'Basílica del Pilar — Torre panoramica e musei', highlight: true },
      { time: '10:00', title: 'La Seo + Museo de Tapices', note: 'Apre alle 10:00 e chiude a pranzo: arrivare all’apertura. Arazzi tra i migliori d’Europa.', place: 'La Seo – Catedral del Salvador + Museo de Tapices' },
      { time: '11:30', title: 'Torre panoramica e Museo Pilarista', note: 'Ascensore e vista sulla città, tutto nello stesso punto della Basílica.', place: 'Basílica del Pilar — Torre panoramica e musei' },
      { time: '13:00', title: 'Fine del programma in città', note: 'Da qui in poi conta solo l’escursione: pranzo veloce o snack, poi in stazione.' },
      { time: '14:00', title: 'Partenza dalla stazione di Saragozza', note: 'Inizio dell’escursione per l’eclissi. Essere in stazione con anticipo.', highlight: true },
      { time: '16:00', title: 'Cadreita — Restaurante Las Piscinas', note: 'Sosta e pasto. Sono due ore dalla fine del programma in città: portarsi qualcosa per l’attesa.' },
      { time: '18:15', title: 'Partenza per il deserto delle Bardenas', note: 'Escursione con stop fotografici sui mirador.' },
      { time: '19:30', title: 'Arrivo al punto di osservazione', note: 'Orizzonte libero: è il motivo per cui si esce dalla città.', highlight: true },
      { time: '22:00', title: 'Centro di osservazione, presso Hostal Virgen del Yugo', note: 'Seconda parte della serata sotto il cielo delle Bardenas.' },
      { time: '01:30', title: 'Rientro a Saragozza', note: 'Notte corta: giovedì il programma riparte alle 9:00.' }
    ]
  },
  {
    day: 4, date: 'Giovedì 13 agosto', tag: 'Giornata piena',
    intro: 'Si parte alle 9:00 dal Mercado Central, che apre a quell’ora. Poi la giornata scorre da est a ovest: San Pablo, l’Aljafería nelle ore calde, la zona Expo la sera e rientro diretto a Delicias.',
    stops: [
      { time: '09:00', title: 'Mercado Central', note: 'Apre alle 9:00: colazione o spuntino nel mercato ristrutturato, prima che arrivi il caldo.', place: 'Mercado Central' },
      { time: '10:00', title: 'Iglesia de San Pablo', note: 'Torre mudéjar salibile, vista a 360°. Aperta solo 10:00–12:30: è l’unico giorno utile del viaggio.', place: 'Iglesia de San Pablo' },
      { time: '12:15', title: 'Pranzo e pausa', note: 'Un’ora e mezza, non tre: si riparte alle 13:45.' },
      { time: '13:45', title: 'Palazzo dell’Aljafería', note: 'Mudéjar UNESCO, ~1,5 h. Al chiuso nelle ore peggiori del caldo, e sulla strada verso ovest. Chiude alle 17:15: con questo orario il margine è ampio.', place: 'Palazzo dell’Aljafería', highlight: true },
      { time: '16:30', title: 'Acuario e zona Expo / Parque del Agua', note: 'Passeggiata tra Pabellón Puente e Torre del Agua. Linee 48 / Ci1 / Ci2 per rientrare a Delicias.', place: 'Acuario de Zaragoza' },
      { time: 'Sera', title: 'Cena a tapas al Meli del Tubo', note: 'L’unica serata piena in cui è aperto.', place: 'Meli del Tubo' }
    ]
  },
  {
    day: 5, date: 'Venerdì 14 agosto', tag: 'Mattina · da confermare',
    intro: 'Se la mattina resta libera: giro corto di chiusura in centro, poi partenza per Valencia.',
    stops: [
      { time: 'Mattina', title: 'Patio de la Infanta e calle Alfonso I', note: 'Giro breve, utile per recuperare ciò che manca.', place: 'Patio de la Infanta' },
      { time: '—', title: 'Partenza per Valencia', note: 'Treno o bus dalla stazione Delicias.', place: 'Stazione Zaragoza-Delicias' }
    ]
  }
];

/* --------------------------------------------------------------------------
   Trasporti
   -------------------------------------------------------------------------- */
const TRANSPORT_ROUTES = [
  { mode: 'Bus Ci3', detail: 'Scende a Paseo Echegaray y Caballero / Hospedería, vicino al Pilar', time: '17–19 min' },
  { mode: 'Bus 34', detail: 'Scende ad Avda. César Augusto / Mercado Central', time: '~20 min' },
  { mode: 'Altre linee', detail: '21, 60, C1, C4, CI1, CI2, N1 (notturna)', time: '—' },
  { mode: 'Taxi', detail: '9–12 €', time: '~6 min' },
  { mode: 'A piedi', detail: 'Sconsigliato con il caldo di agosto', time: '35–40 min' }
];

const TRANSPORT_FARES = [
  { title: 'Biglietto singolo (a bordo)', price: '1,70 €' },
  { title: 'Viaggio con Tarjeta Bus / Multiviaje', price: '0,55 €' },
  { title: 'Biglietto notturno', price: '1 €' },
  { title: 'Linea aeroporto (con tessera)', price: '2,25 €' },
  { title: 'Primo trasbordo entro l’ora', price: 'Gratuito' }
];

/* --------------------------------------------------------------------------
   Eclissi del 12 agosto: sicurezza, ragioni e cosa portare
   -------------------------------------------------------------------------- */
const ECLIPSE_SAFETY = [
  'Il Sole si guarda <strong>solo</strong> con occhiali certificati <strong>ISO 12312-2</strong>. Gli occhiali da sole, per quanto scuri, non servono a niente ed è pericoloso usarli.',
  'Mai guardare il Sole attraverso <strong>fotocamera, binocolo o telescopio senza filtro solare dedicato</strong>: concentrano la luce e il danno è immediato, anche se hai gli occhiali da eclissi addosso.',
  'Controllare gli occhiali <strong>prima</strong>: se sono rigati, bucati o piegati vanno buttati.',
  'Portarne <strong>un paio di scorta</strong>: si graffiano e si perdono facilmente.'
];

const ECLIPSE_WHY = 'Questa eclissi avviene con il <strong>Sole molto basso sull’orizzonte</strong>, ' +
  'vicino al tramonto. Non basta essere nel posto giusto: serve una <strong>linea di vista libera ' +
  'verso ovest</strong>. In città, tra i palazzi, il Sole a pochi gradi di altezza è semplicemente ' +
  'coperto — ed è per questo che si esce verso il deserto delle Bardenas, dove l’orizzonte è libero ' +
  'fin dove arriva l’occhio.';

const ECLIPSE_KIT = [
  { icon: '🕶️', what: 'Occhiali ISO 12312-2', why: 'Uno a testa, più uno di scorta. Senza, non si guarda.' },
  { icon: '🧥', what: 'Felpa', why: 'Si sta fuori dalle 19:30 all’1:30: sei ore all’aperto di notte, e nelle Bardenas c’è vento.' },
  { icon: '🔦', what: 'Torcia, meglio frontale', why: 'Si rientra al buio. La luce rossa non rovina la visione notturna.' },
  { icon: '💧', what: 'Acqua e snack', why: 'Il pasto è alle 16:00 a Cadreita e il rientro è all’1:30: sono nove ore e mezza.' },
  { icon: '👟', what: 'Scarpe chiuse', why: 'Terreno sassoso e irregolare, e al crepuscolo escono gli insetti.' },
  { icon: '🔋', what: 'Powerbank carico', why: 'Con poca copertura il telefono cerca rete e si scarica in fretta.' }
];

const ECLIPSE_CHECK = [
  'Orario esatto di inizio della fase parziale, inizio e fine della totalità',
  'Durata della totalità',
  'Altezza del Sole sull’orizzonte durante la totalità'
];

/* --------------------------------------------------------------------------
   Note pratiche
   -------------------------------------------------------------------------- */
const RULES = [
  { icon: '☀️', title: 'Caldo di agosto (35 °C+)',
    text: 'Si parte alle 9:00 per sfruttare le ore fresche, e le pause di metà giornata sono di 1,5–2 ore invece di tre. Unica eccezione il martedì, dove i musei romani chiudono dalle 14 alle 17 e la pausa lunga è imposta dagli orari.' },
  { icon: '🔒', title: 'Chiusure del lunedì',
    text: 'Ruta Caesaraugusta e quasi tutti i musei civici sono chiusi il lunedì: non pianificare musei quel giorno.' },
  { icon: '🎫', title: 'Niente più Zaragoza Card',
    text: 'La Zaragoza Card non è più attiva. Restano due biglietti separati: bono Ruta Caesaraugusta 7 € (4 siti romani) ed entrada conjunta cattedrali 12 €, valida 48 ore (La Seo, Basílica del Pilar, Museo Pilarista, Rosario de Cristal e torre).' },
  { icon: '🗼', title: 'Torre solo con biglietto completo',
    text: 'La Subida a la Torre del Pilar non si vende separatamente: serve l’entrada conjunta da 12 €.' },
  { icon: '⏱️', title: 'Aljafería a fasce orarie',
    text: 'L’ingresso ha quota per fascia oraria: assicurarsi lo slot.' },
  { icon: '🍷', title: 'Tapas e giorni di chiusura',
    text: 'Meli del Tubo è chiuso lunedì e martedì (usarlo giovedì); Bula del Tubo è aperto il lunedì.' }
];
