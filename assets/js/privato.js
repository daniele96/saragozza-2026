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
     Valencia, 14–16 agosto
     ====================================================================== */
  /* Riserve per Valencia: cose da infilare se avanza tempo o se il caldo obbliga al chiuso */
  const VAL_EXTRA = [
    { what: 'Museo de Bellas Artes', why: 'Tra i più importanti di Spagna: Goya, Velázquez, Sorolla. <strong>Ingresso gratuito</strong> e al chiuso — la miglior riserva per le ore calde', tag: 'gratis · al chiuso' },
    { what: 'La Almoina', why: 'Il centro archeologico sotto la piazza della cattedrale: la Valentia romana. Se ti è piaciuta la Caesaraugusta di Saragozza, è il seguito naturale', tag: 'al chiuso' },
    { what: 'Mercat de Colón', why: 'Edificio modernista oggi spazio gastronomico. Aperto anche la domenica, quando il Mercat Central è chiuso', tag: 'gratis' },
    { what: 'Jardí del Túria in bici', why: 'Il vecchio letto del fiume, 9 km di parco che attraversa la città fino alla Ciutat de les Arts. Valencia è piatta e piena di bici pubbliche', tag: 'all’aperto' },
    { what: 'Estació del Nord', why: 'La stazione modernista è un edificio da vedere, e il 16 ci passi comunque per prendere il treno', tag: 'gratis' },
    { what: 'Museo Fallero', why: 'I ninots salvati dal rogo delle Fallas, uno per anno. Curioso, piccolo e al chiuso', tag: 'al chiuso' }
  ];

  /* Le due sere a Valencia: 14 venerdì e 15 sabato festivo, le migliori della settimana */
  const NIGHTLIFE = [
    { zone: 'Ruzafa', best: 'La sera del 15',
      why: 'Il quartiere migliore per bere e conoscere gente: cocktail bar, vini naturali, birra artigianale e bodegas storiche, con locali che di giorno sono caffè. Pubblico <strong>più locale</strong> e prezzi più bassi del centro. Vie da battere: Cádiz, Sueca, Literato Azorín.',
      top: true },
    { zone: 'Barrio del Carmen', best: 'La sera del 14',
      why: 'Centro storico, bar attaccati uno all’altro nei vicoli, terrazze, birra da ~1,50 € e aperti fino alle 3. Il pubblico mescola studenti, valenciani e viaggiatori, quindi <strong>è più facile attaccare bottone</strong>, anche in inglese. Arteria principale calle Caballeros, più Plaza del Tossal.' },
    { zone: 'Malvarrosa e El Cabanyal', best: 'Se segui il piano del 15',
      why: 'Ad agosto la vita serale si sposta al mare: chiringuiti e terrazze sulla spiaggia. Se il 15 vai alla Malvarrosa per il tramonto, la serata continua lì senza rientrare.' },
    { zone: 'Marina e Ciutat de les Arts', best: 'Se vuoi la notte lunga',
      why: 'La zona dei club grossi, con terrazze all’aperto d’estate. Si riempiono verso l’1:30 e si va avanti fino all’alba: è l’opzione "una notte sola ma fino a tardi", non quella da due sere di fila.' }
  ];

  const NIGHT_TIPS = [
    { id: 'nl1', text: 'Gli orari: cena 21:00–22:30, i bar si riempiono dalle 23:00, i club dall’1:00. Se esci alle 22:00 trovi il vuoto e pensi che sia morta' },
    { id: 'nl2', text: 'La città è compatta: dal Carmen a Ruzafa sono 15 minuti a piedi, quindi in una sera puoi fare entrambe' },
    { id: 'nl3', text: 'Bar degli hostel con terrazza o rooftop, aperti anche a chi non dorme lì: è il posto più efficace in assoluto se viaggi da solo' },
    { id: 'nl4', text: 'Pub crawl serali: partono dal Carmen e sono organizzati esattamente per conoscere gente' },
    { id: 'nl5', text: 'Serate di intercambio de idiomas nei bar: molto comuni a Valencia, di solito infrasettimanali — verificare se ce n’è una il 14' },
    { id: 'nl6', text: 'Free walking tour la mattina: si conosce gente e ci si ritrova la sera' },
    { id: 'nl7', text: 'Ordina un Agua de Valencia — cava, succo d’arancia, gin e vodka: è il cocktail della città ed è già un argomento di conversazione. Va giù facile, tienilo presente' },
    { id: 'nl8', text: 'Rientro: dall’alloggio in Extramurs il Carmen è ~2 km e Ruzafa ~3. A piedi si fanno, ma di notte valuta il taxi: la metro chiude prima della fine della serata' },
    { id: 'nl9', text: 'Metà agosto molti valenciani sono in vacanza e il pubblico pende verso stranieri e turisti: per fare amicizia è un vantaggio, non un difetto' }
  ];

  const VALENCIA = [
    {
      id: 'val14', date: 'Venerdì 14 agosto', title: 'Dal pranzo',
      tag: 'Arrivo',
      warn: 'L’orario dipende dal passaggio in auto, ancora da definire: con partenza da Saragozza entro le 09:00–10:00 arrivi per pranzo.',
      rows: [
        { time: '~13:00', what: 'Pranzo: paella valenciana', note: 'È il momento giusto del viaggio: a Valencia la paella è piatto da pranzo, molti posti non la fanno la sera. Quella autentica è con pollo e coniglio, non il misto di mare', key: true },
        { time: '15:00–19:00', what: 'Check-in e pausa', note: 'Dopo 3h30 di auto a 35 °C non è tempo perso' },
        { time: '17:30', what: 'Ciutat Vella', note: 'Plaza de la Virgen, Plaza de la Reina, Basílica de la Virgen de los Desamparados' },
        { time: '18:30', what: 'Catedral e torre del Micalet', note: 'La torre si sale: è il panorama classico della città' },
        { time: '19:30', what: 'Barrio del Carmen', note: 'Il quartiere più bello da girare a piedi al tramonto' },
        { time: '20:30', what: 'Torres de Serranos', note: 'Porta medievale sul Turia, bellissima all’ora blu' },
        { time: '21:30', what: 'Cena a tapas', note: 'Carmen oppure Ruzafa, il quartiere più vivo la sera' }
      ]
    },
    {
      id: 'val15', date: 'Sabato 15 agosto', title: 'La giornata piena',
      tag: 'Sabato festivo',
      warn: 'Il 15 cade di sabato e nella Comunitat Valenciana l’apertura commerciale è permessa: il Mercat Central è visitabile, ed è l’unica finestra del viaggio.',
      rows: [
        { time: '08:30', what: 'Colazione: horchata e fartons', note: 'La cosa locale da fare' },
        { time: '09:30', what: 'Mercat Central', note: 'Modernista, tra i mercati coperti più grandi d’Europa. Chiude alle 15:00, e domenica è chiuso: è ora o mai', key: true },
        { time: '10:45', what: 'Llotja de la Seda', note: 'Patrimonio UNESCO, proprio di fronte al mercato' },
        { time: '11:15', what: 'Iglesia de los Santos Juanes', note: 'Stessa piazza, nessuno spostamento' },
        { time: '12:30', what: 'Ciutat de les Arts i les Ciències', note: 'L’architettura di Calatrava, Umbracle e specchi d’acqua. Ci si arriva col Jardí del Túria a piedi, ma sono 4 km: col sole a picco meglio bus' },
        { time: '13:30–17:30', what: 'Oceanogràfic', note: 'Il più grande acquario d’Europa, al chiuso e climatizzato nelle ore peggiori: è la mossa giusta della giornata', key: true },
        { time: '20:00', what: 'Ruzafa', note: 'Il mare lo fai a Benicàssim, quindi la sera del 15 non serve andare alla Malvarrosa: meglio Ruzafa, che è anche la scelta migliore per la serata. Restano come alternative il tramonto alla Malvarrosa o La Albufera con le risaie' }
      ]
    },
    {
      id: 'val16', date: 'Domenica 16 agosto', title: 'Mattina, poi treno',
      tag: 'Materiale di riserva',
      warn: 'Sai già che partirai prima col treno: questo serve solo se il treno è tardi.',
      rows: [
        { time: '10:00–10:30', what: 'Check-out', note: 'Finestra fissa' },
        { time: '10:30', what: 'Mercat de Colón', note: 'Modernista, oggi spazio gastronomico: la domenica è aperto, a differenza del Mercat Central' },
        { time: '11:15', what: 'Torres de Quart o Jardí del Túria', note: 'Giro corto vicino all’alloggio, senza impegno' },
        { time: '—', what: 'Treno per Benicàssim da València Nord', note: 'Biglietto in anticipo: è la domenica di apertura del festival' }
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
    { id: 'dec-15', phase: 'Eclissi', what: 'Come arrivare in stazione per le 14:00 del 12',
      why: 'Il programma in città chiude alle 13:00 in Plaza del Pilar e l’escursione parte dalla stazione alle 14:00. Serve capire con che mezzo e con quanto anticipo, e mangiare qualcosa: il pasto dell’escursione è alle 16:00 a Cadreita.',
      when: 'entro l’11', level: 'alta' },
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
    'Punto di osservazione dell’eclissi — escursione organizzata alle Bardenas: trasporto, punto e orari sono decisi da loro',
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
      id: 'bag', icon: '⚖️', title: 'Verifiche sul bagaglio',
      note: 'Da chiudere prima di fare la valigia: cambiano cosa ci sta dentro.',
      items: [
        { id: 'b10', text: 'Verificare che sulla prenotazione Wizz del 10 ci sia Wizz Priority, altrimenti il trolley da 10 kg non sale' },
        { id: 'b1', text: 'Misurare il trolley col metro: Wizz al gate usa il sizer ed è inflessibile, 55 × 40 × 23' },
        { id: 'b9', text: 'Confermare le misure ITA sulla prenotazione: le fonti danno 55 × 35 × 25, cioè 5 cm più stretto di Wizz' },
        { id: 'b2', text: 'Pesare il trolley pieno sulla bilancia di casa: obiettivo sotto 10 kg' },
        { id: 'b11', text: 'Controllare le spine dei caricatori: se una è tipo L serve l’adattatore Schuko' },
        { id: 'b12', text: 'Chiedere all’alloggio di Saragozza se c’è la lavatrice' },
        { id: 'b13', text: 'Verificare prezzo e posizione dei lockers al Rototom' }
      ]
    },
    {
      id: 'doc', icon: '📄', title: 'Documenti',
      items: [
        { id: 'd1', text: 'Carta d’identità o passaporto in corso di validità' },
        { id: 'd2', text: 'Tessera sanitaria con retro TEAM per la Spagna' },
        { id: 'd3', text: 'Carte di pagamento, più una di riserva tenuta separata' },
        { id: 'd4', text: 'Carte d’imbarco dei tre voli salvate offline' },
        { id: 'd5', text: 'Screenshot: glamping #VU8YwLWr con check-in confermato, transfer #3984, prenotazione Valencia' },
        { id: 'd6', text: 'Codice occupante tenda CA58804RF a portata di mano' }
      ]
    }
  ];

  /* ======================================================================
     Valigia: franchigie, contenitori, pesi stimati
     ====================================================================== */
  const ALLOWANCE = [
    { airline: 'Wizz Air', when: '10 ago, andata', bag: '55 × 40 × 23 cm', kg: '10 kg',
      small: 'Zaino <strong>40 × 30 × 20 cm</strong>, gratuito e con <strong>10 kg suoi</strong>. È il limite più stretto dei due: misura lo zaino su questo',
      note: 'Con Wizz Priority. Le ruote possono aggiungere al massimo 5 cm. Low cost: al gate misurano e a volte pesano',
      strict: true },
    { airline: 'ITA Airways', when: '23 ago, ritorno', bag: '55 × 35 × 25 cm', kg: '8 kg',
      small: 'Zaino 45 × 36 × 20 cm, sotto il sedile: <strong>più generoso di Wizz</strong> su lunghezza e larghezza',
      note: 'Limite formale più basso sul trolley, ma di linea: raramente pesano. Le misure però restano più strette' }
  ];

  /* Peso a vuoto del contenitore scelto: borsone 55 × 35 × 23, pesato in casa */
  const BAG_EMPTY = 1.4;
  const BAG_TARGET = 10;   // Wizz: il limite davvero controllato, all'andata
  const BAG_FORMAL = 8;    // ITA: limite formale al ritorno, raramente verificato

  const PACK = [
    {
      id: 'addosso', icon: '🧍', title: 'Addosso in aereo',
      note: 'Le cose più pesanti si indossano: non pesano mai.',
      noWeight: true,
      items: [
        { id: 'a1', text: 'Scarpe da ginnastica — le più pesanti che porti, quindi ai piedi e non in valigia' },
        { id: 'a2', text: 'Pantalone lungo leggero' },
        { id: 'a3', text: 'Maglietta' },
        { id: 'a4', text: 'Felpa — la stessa che ti serve per la notte nel deserto. Indossala il 10: alle 5 del mattino a Bitonto e in aereo serve comunque, e così pesa zero' },
        { id: 'a5', text: 'Orologio e occhiali da sole' }
      ]
    },
    {
      id: 'trolley', icon: '🧳', title: 'Trolley',
      note: 'L’unico contenitore con un limite controllato. Le stime di peso sono indicative.',
      items: [
        { id: 't1', text: '5 magliette leggere', kg: 0.6 },
        { id: 't1b', text: '2 canottiere — per le giornate “scialla” al Rototom', kg: 0.2 },
        { id: 't1c', text: '4 camicie leggere — con 3 risparmi 0,19 kg', kg: 0.75 },
        { id: 't2', text: '2 pantaloncini', kg: 0.4 },
        { id: 't2b', text: '2 pantaloni lunghi super leggeri — uno lo indossi in aereo, quindi nel trolley ne pesa uno', kg: 0.25 },
        { id: 't3', text: '1 maglia a maniche lunghe leggera — chiese, aria condizionata, sere in tenda', kg: 0.2 },
        { id: 't4', text: '8 slip', kg: 0.3 },
        { id: 't5', text: '5 paia di calze corte', kg: 0.2 },
        { id: 't6', text: '2 costumi da bagno — con 7 mattine di mare a Benicàssim, uno asciuga mentre usi l’altro', kg: 0.3 },
        { id: 't7', text: '1 telo in microfibra grande: asciugamano e telo mare insieme', kg: 0.3 },
        { id: 't7b', text: 'Secondo telo in microfibra per il mare — con 7 mattine in spiaggia serve davvero: uno resta sabbioso, l’altro è quello della doccia', kg: 0.2 },
        { id: 't8', text: '2 cappellini — uno resta sempre nello zaino, così non ti trovi mai senza', kg: 0.2 },
        { id: 't9', text: 'Poncho o K-way ultraleggero', kg: 0.15 },
        { id: 't10', text: 'Ciabatte per doccia, mare e tenda — meglio con suola spessa: 7 giorni di ghiaia fino alle docce', kg: 0.25 },
        { id: 't10b', text: '1 paio per uscire, il più leggero che hai — non di pelle: al campeggio è polvere, e con la pioggia fango', kg: 0.5 },
        { id: 't11', text: 'Necessaire: spazzolino, dentifricio, rasoio, pettine — il deodorante lo compri lì', kg: 0.4 },
        { id: 't12', text: 'Busta liquidi da 1 litro: shampoo, maschera capelli, crema ricci, crema modellante, doposole', kg: 0.6 },
        { id: 't12b', text: 'Raccogli-capelli da scarico — solido, non occupa la busta liquidi', kg: 0.05 },
        { id: 't13', text: 'Salviette umidificate e gel per le mani', kg: 0.2 },
        { id: 't14', text: 'Farmaci personali nelle confezioni originali: pillole lattasi, Oki, antistaminici, antiasmatici', kg: 0.2 },
        { id: 't14b', text: 'Paracetamolo e antidiarroico — il paracetamolo serve quando non vuoi un terzo antinfiammatorio', kg: 0.05 },
        { id: 't14c', text: 'Cerotti normali, cerotti per vesciche, disinfettante, garze', kg: 0.15 },
        { id: 't14d', text: 'Spruzzino per il naso e collirio — polvere del campeggio e allergie. Sono liquidi, ma da 10–20 ml: entrano nella busta senza pesare', kg: 0.1 },
        { id: 't14e', text: 'Gel per punture d’insetto', kg: 0.05 },
        { id: 't14f', text: 'Sali minerali', kg: 0.05 },
        { id: 't15', text: 'Detersivo da viaggio, 4 mollette, 2 m di cordino', kg: 0.15 },
        { id: 't16', text: 'Sacca impermeabile per i panni sporchi', kg: 0.1 },
        { id: 't17', text: 'Tappi per le orecchie e mascherina per dormire', kg: 0.05 },
        { id: 't18', text: 'Adattatore Schuko o ciabattina piccola', kg: 0.2 },
        { id: 't19', text: 'Occhiali da eclissi ISO 12312-2, uno più uno di scorta', kg: 0.05 },
        { id: 't19b', text: 'Torcia frontale, meglio con luce rossa — nel deserto si torna all’auto nel buio totale', kg: 0.1 },
        { id: 't20', text: 'Filtro solare per l’obiettivo, solo se porti una fotocamera con ottica', kg: 0.1 }
      ]
    },
    {
      id: 'zaino', icon: '🎒', title: 'Zaino sotto il sedile',
      note: 'Qui va ciò che è pesante e piccolo, e sul peso sei libero: Wizz gli dà 10 kg suoi, ITA non pubblica limiti. Misuralo sul limite Wizz (40 × 30 × 20): ITA è più generosa, quindi se passa all’andata passa anche al ritorno.',
      noWeight: true,
      items: [
        { id: 'z1', text: 'Documenti, portafoglio, carte' },
        { id: 'z2', text: 'Telefono e caricatore multiporta con due cavi lunghi' },
        { id: 'z3', text: 'Powerbank — per regolamento deve stare in cabina, e al campeggio salva' },
        { id: 'z4', text: 'Carte d’imbarco dei tre voli, offline' },
        { id: 'z5', text: 'Borraccia vuota, da riempire dopo i controlli' },
        { id: 'z6', text: 'Snack per il 10: dalle 05:15 alle 15:40 sei in viaggio' },
        { id: 'z7', text: 'Maglia a maniche lunghe per l’aria condizionata' },
        { id: 'z8', text: 'Puff e dose del giorno sempre addosso, non nel bagaglio grande e mai lasciati in tenda' }
      ]
    },
    {
      id: 'cuscino', icon: '🛌', title: 'Cuscino da collo imbottibile',
      note: 'La mossa migliore che hai: sposta ~0,8 kg fuori dal trolley, ti serve in volo e ti dà un cuscino in più in tenda. Riempilo anche al ritorno.',
      noWeight: true,
      items: [
        { id: 'k1', text: '3–4 magliette' },
        { id: 'k2', text: 'Slip e calze' },
        { id: 'k3', text: 'Costume da bagno' }
      ]
    }
  ];

  /* Liquidi in cabina: va tutto a mano, quindi si passano i controlli tre volte */
  const LIQUIDS = {
    rules: [
      'Massimo <strong>100 ml per contenitore</strong> (100 g per le creme). Contenitori più piccoli, tipo da 75 ml, vanno benissimo: il limite è un massimo, non una misura obbligata.',
      'Tutti i contenitori in <strong>una sola busta trasparente richiudibile da massimo 1 litro</strong>, circa 20 × 20 cm. Una busta per passeggero, non una per bagaglio.',
      'La busta va <strong>tirata fuori e mostrata</strong> al controllo: tienila in cima o nello zaino.'
    ],
    trap: 'Conta la <strong>capacità dichiarata del contenitore</strong>, non quanto c’è dentro. ' +
          'Un flacone da 200 ml mezzo vuoto viene sequestrato. Travasare in flaconcini da 100 ml, ' +
          'non “portare quello grande quasi finito”.',
    trap2: 'Il litro <strong>non è una quantità di liquido a cui hai diritto</strong>: è la capacità ' +
           'della busta, che deve chiudersi senza forzare. In una busta da 20 × 20 cm entrano ' +
           'realisticamente <strong>8–9 flaconi da 100 ml</strong>, qualcuno in più se sono da 75. ' +
           'Il vincolo vero è lo spazio nella busta, non la somma dei millilitri.',
    counts: [
      'Creme, crema solare, doposole',
      'Gel, dentifricio, deodorante roll-on e spray, schiuma da barba',
      'Mascara, balsamo labbra in vasetto, profumi',
      'Soluzione per lenti a contatto',
      'Miele, marmellata, yogurt, formaggi molli — se compri souvenir alimentari'
    ],
    solids: [
      'Deodorante <strong>stick</strong>',
      '<strong>Sapone e shampoo solido</strong>',
      '<strong>Dentifricio in pastiglie</strong>',
      'Crema solare stick, balsamo labbra stick'
    ],
    exceptions: [
      'Farmaci liquidi oltre i 100 ml: ammessi se necessari, con prescrizione o documentazione, da dichiarare al controllo',
      'Alimenti per bambini ed esigenze dietetiche particolari'
    ],
    checklist: [
      { id: 'l1', text: 'Busta trasparente richiudibile da 1 litro, una sola' },
      { id: 'l2', text: 'Travasare tutto in flaconcini da massimo 100 ml di capacità' },
      { id: 'l3', text: 'Controllare la capacità stampata su ogni contenitore, non il contenuto residuo' },
      { id: 'l4', text: 'Sostituire con i solidi: deodorante stick, sapone solido, dentifricio in pastiglie' },
      { id: 'l5', text: 'Eventuali farmaci liquidi con documentazione, dichiarati al controllo' },
      { id: 'l6', text: 'Busta raggiungibile senza smontare la valigia' },
      { id: 'l7', text: 'Se vuoi una bottiglia da portare a casa: comprarla in duty free a Valencia il 23' }
    ]
  };

  /* Salute: punti specifici per asma e allergie in un viaggio di 14 giorni */
  const HEALTH = [
    { id: 'h1', icon: '🫁', title: 'Il puff di emergenza c’è?',
      text: 'Il trivalente è terapia di fondo, non serve per una crisi. Se il medico ti ha prescritto anche un <strong>broncodilatatore di emergenza</strong> (tipo salbutamolo), quello va in viaggio e va tenuto <strong>addosso</strong>, non in borsone. È l’unica voce di questa lista che non si compra e non si improvvisa.' },
    { id: 'h2', icon: '➕', title: '14 dosi per 14 giorni è zero margine',
      text: 'Antistaminici e antiasmatici sono contati esattamente: se perdi un blister, se un giorno di allergia ne chiede uno in più o se il rientro slitta, resti a secco. Porta <strong>3–4 dosi di scorta</strong> per ciascuno. Pesano zero.' },
    { id: 'h3', icon: '🌡️', title: 'La tenda supera i 40 °C',
      text: 'Le bombolette dei puff e i farmaci non vanno lasciati in tenda tutto il giorno: il calore li degrada e le bombolette pressurizzate non amano stare al sole. Tienili nello zaino con te, o nella <strong>consigna</strong> del campeggio.' },
    { id: 'h4', icon: '📄', title: 'Confezioni originali e ricetta',
      text: 'Tutto nelle scatole originali con il foglietto. Porta anche una <strong>foto della ricetta</strong> del puff: serve se te lo chiedono al controllo e soprattutto se in Spagna devi farti dare un ricambio in farmacia.' },
    { id: 'h5', icon: '💨', title: 'Fumo e polvere, per una settimana',
      text: 'Un festival reggae in campeggio significa fumo, polvere e sabbia per sette giorni: per un asmatico è il contesto che chiede più attenzione di tutto il viaggio. Appena arrivi, individua l’<strong>assistenza medica 24 h</strong> del campeggio — c’è, ed è meglio saperlo prima che cercarla di notte.' },
    { id: 'h6', icon: '⚠️', title: 'Oki e ibuprofene sono la stessa famiglia',
      text: 'Sono entrambi antinfiammatori: si alternano, non si sommano. È il motivo per cui vale la pena avere anche il <strong>paracetamolo</strong>, che agisce in modo diverso.' }
  ];

  /* Il mare si fa a Benicàssim, non a Saragozza né a Valencia */
  const BEACH = [
    { id: 'be1', text: 'Il recinto è a meno di 1 km dalle spiagge e il campeggio a 350 m dal recinto: sono ~1,3 km a piedi' },
    { id: 'be2', text: 'C’è un bus del festival che collega il recinto alla spiaggia per tutta la durata: da verificare orari e fermata all’arrivo' },
    { id: 'be3', text: 'La finestra buona è 8:00–11:00: sole ancora gestibile e spiaggia vuota' },
    { id: 'be4', text: 'Se torni alle 3–4 di notte, la “mattina” slitta alle 11:00–13:00, che è la fascia peggiore. Scegli 2–3 mattine, non 7, e mettile dopo le sere più tranquille' },
    { id: 'be5', text: '11:00–16:00 è la fascia da evitare: una scottata il primo giorno ti rovina la settimana' },
    { id: 'be6', text: 'Non portare niente di valore: la tenda non è sicura e la spiaggia meno. Usa la consigna del campeggio' },
    { id: 'be7', text: 'Ciabatte anche in spiaggia: a Benicàssim alcuni tratti sono ghiaiosi' },
    { id: 'be8', text: 'La crema solare grande comprata a Saragozza serve soprattutto qui' }
  ];

  const NOT_BRING = [
    { text: 'Materasso, lenzuola, torcia, lucchetto', why: 'sono già nella tenda, e il regolamento vieta di portarli fuori' },
    { text: 'Jeans', why: 'pesano, occupano, e a 35 °C non li metti' },
    { text: 'Asciugamano di spugna', why: 'la microfibra pesa un terzo e asciuga' },
    { text: 'Sacco a pelo', why: 'la biancheria è fornita' },
    { text: 'Asciugacapelli', why: '—' },
    { text: 'Un quarto paio di scarpe', why: 'tre bastano: ginnastica indossate, un paio leggero per uscire, ciabatte' },
    { text: 'Scarpe di pelle o scamosciate', why: 'al campeggio è polvere e sabbia, e con la pioggia diventa fango' },
    { text: 'Coltellini, multiuso, forbici', why: 'va tutto in cabina: te li sequestrano ai controlli' },
    { text: 'Fornelletti e bombole da campeggio', why: 'vietati in cabina' },
    { text: 'Libri di carta', why: 'usa il telefono' },
    { text: 'Vestiti “per ogni eventualità”', why: 'l’eventualità è il caldo, e sono sempre 35 °C' }
  ];

  const LAUNDRY = [
    { when: '12 o 13 ago', where: 'Alloggio a Saragozza — c’è la lavatrice',
      what: 'Il lavaggio grosso, l’unico in lavatrice con calma. Farlo il 12 o la mattina del 13, non la sera del 13: deve essere asciutto prima di partire il 14', key: true },
    { when: '15 ago', where: 'Suites Rooms Valencia — senza lavatrice',
      what: 'Lavaggio a mano nel lavandino: magliette, slip, calze. A 35 °C asciuga in poche ore. È l’ultimo bagno privato prima di 7 notti in tenda' },
    { when: '16–22 ago', where: 'Campeggio del Rototom — laundry box',
      what: 'Lavatrici e asciugatrici a monete. Il prezzo non è pubblicato: in Spagna un lavaggio parte da ~4,50 € e l’asciugatura costa altrettanto, quindi metti da parte 10–15 € in monete da 1 e 2 €. Con 35 °C l’asciugatrice puoi saltarla: stendi sul cordino e paghi solo il lavaggio', key: true },
    { when: 'Riserva', where: 'Benicàssim paese — LAVAMAC',
      what: 'Lavanderia self service in C/ Mossén Elies 6, la stessa via dell’ufficio del festival. Utile se il laundry box è in coda o guasto' }
  ];

  /* Consumabili da comprare in Spagna invece di portarli */
  const BUY_THERE = [
    { what: 'Deodorante', why: 'generico, si trova ovunque, e se è stick non occupa la busta liquidi' },
    { what: 'Bagnoschiuma', why: 'inutile portarlo: 100 ml non bastano per 14 giorni' },
    { what: 'Detersivo per lavatrice', why: 'serve sia a Saragozza sia al laundry box del campeggio' },
    { what: 'Crema solare, confezione grande', why: 'il flaconcino da 100 ml copre due o tre giorni, non due settimane' },
    { what: 'Shampoo, ma solo se è un prodotto qualsiasi', why: 'se usi uno specifico per ricci, portalo: lì rischi di non trovare l’equivalente' },
    { what: 'Acqua', why: 'ogni giorno, e la borraccia si riempie alle fontane' }
  ];

  const FINAL_CHECK = [
    { id: 'f1', text: 'Trolley pesato sulla bilancia di casa, non a occhio: obiettivo sotto 10 kg' },
    { id: 'f2', text: 'Liquidi già nella busta trasparente, in cima e raggiungibili' },
    { id: 'f3', text: 'Powerbank e caricatori nello zaino' },
    { id: 'f4', text: 'Carte d’imbarco offline dei tre voli' },
    { id: 'f5', text: 'Occhiali da eclissi in valigia: servono il 12, ma partono il 10' },
    { id: 'f6', text: 'Cuscino da collo imbottito' },
    { id: 'f7', text: 'Documenti e carte addosso, non nel trolley' },
    { id: 'f8', text: 'Sveglia per le 04:30: il treno da Bitonto è alle 05:15' }
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

  /* Notte nel deserto: cosa serve e cosa non c'è là fuori */
  /* Roadmap dell'escursione organizzata alle Bardenas, 12 agosto */
  const ECLIPSE_DAY = [
    { time: '13:00', what: 'Fine del programma in città', note: 'Sei in Plaza del Pilar. Da qui devi arrivare in stazione' },
    { time: '14:00', what: 'Partenza dalla stazione di Saragozza', note: 'Inizio escursione', key: true },
    { time: '16:00', what: 'Cadreita — Restaurante Las Piscinas', note: 'Il pasto è qui: sono 3 ore dopo la fine del programma in città' },
    { time: '18:15', what: 'Partenza per il deserto delle Bardenas', note: 'Escursione con stop fotografici sui mirador' },
    { time: '19:30', what: 'Arrivo al punto di osservazione', note: 'Orizzonte libero: è il motivo di tutto', key: true },
    { time: '22:00', what: 'Centro di osservazione, presso Hostal Virgen del Yugo', note: 'Seconda parte della serata sotto il cielo delle Bardenas' },
    { time: '01:30', what: 'Rientro a Saragozza', note: 'Notte corta: giovedì riparte alle 9:00', key: true }
  ];

  const DESERT = [
    { id: 'ds1', text: 'Felpa: sei fuori dalle 19:30 all’1:30, sei ore all’aperto di notte. Con il vento delle Bardenas i 20 °C si sentono. Indossala già il 10, così non pesa in valigia' },
    { id: 'ds2', text: 'Pantaloni lunghi leggeri, non felpati: a 20 °C bastano, e a terra al buio proteggono le gambe' },
    { id: 'ds3', text: 'Scarpe da ginnastica chiuse, mai ciabatte: terreno sassoso e irregolare, e al crepuscolo escono gli insetti' },
    { id: 'ds4', text: 'Torcia frontale, meglio a luce rossa: preserva la visione notturna e ti lascia le mani libere' },
    { id: 'ds5', text: 'Acqua per tutta la sera: dopo Cadreita non è detto che ci sia altro' },
    { id: 'ds6', text: 'Qualcosa da mangiare: il pasto è alle 16:00 e poi si arriva all’1:30. Snack per il pomeriggio e per la notte' },
    { id: 'ds7', text: 'Powerbank carico: senza copertura il telefono cerca rete e si scarica più in fretta' },
    { id: 'ds8', text: 'Un telo per sedersi a terra, se hai spazio: al punto di osservazione stai fermo 2 ore e mezza' },
    { id: 'ds9', text: 'Occhiali da eclissi ISO 12312-2 addosso, non nel borsone in albergo' },
    { id: 'ds10', text: 'Puff e farmaci con te: sei fuori 11 ore e mezza, dalle 14:00 all’1:30' }
  ];

  const SPOTS = [
    { name: 'Parque del Agua / zona Expo',
      pro: 'Spazi molto ampi e aperti, orizzonte libero. È già in programma il 13, quindi lo vedo prima. Vicino all’alloggio con le linee 48 / Ci1 / Ci2.',
      con: 'Alberatura da evitare. Sarà il posto più affollato della città.' },
    { name: 'Puente del Tercer Milenio',
      pro: 'Ponte alto sull’Ebro, vista aperta lungo il fiume.',
      con: 'Passerella pubblica: folla e passaggio continuo, poco spazio per fermarsi.' },
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
    legsInto('#legs', LEGS);
    legsInto('#valencia', VALENCIA);

    const ex = $('#valExtra');
    if (ex) {
      ex.innerHTML = VAL_EXTRA.map((e) =>
        '<li><strong>' + esc(e.what) + '</strong> <span class="badge badge--ok">' + esc(e.tag) + '</span>' +
        '<span class="nb__why"> — ' + e.why + '</span></li>'
      ).join('');
    }

    const nl = $('#nightlife');
    if (nl) {
      nl.innerHTML = NIGHTLIFE.map((n) =>
        '<article class="allow' + (n.top ? ' allow--strict' : '') + '">' +
          '<header class="allow__head">' +
            '<h4 class="allow__airline">' + esc(n.zone) + '</h4>' +
            '<span class="allow__when">' + esc(n.best) + '</span>' +
          '</header>' +
          '<p class="allow__note">' + n.why + '</p>' +
        '</article>'
      ).join('');
    }

    const nt = $('#nightTips');
    if (nt) nt.innerHTML = NIGHT_TIPS.map((t) => checkbox(t.id, esc(t.text))).join('');
  }

  function legsInto(sel, list) {
    const el = $(sel);
    if (!el) return;
    el.innerHTML = list.map((leg) =>
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

  /* --------------------------------------------------------------------
     Valigia
     -------------------------------------------------------------------- */
  const kgFmt = (n) => n.toLocaleString('it-IT', { minimumFractionDigits: 1, maximumFractionDigits: 2 }) + ' kg';

  function renderAllowance() {
    const el = $('#allowance');
    if (!el) return;
    el.innerHTML = ALLOWANCE.map((a) =>
      '<article class="allow' + (a.strict ? ' allow--strict' : '') + '">' +
        '<header class="allow__head">' +
          '<h3 class="allow__airline">' + esc(a.airline) + '</h3>' +
          '<span class="allow__when">' + esc(a.when) + '</span>' +
        '</header>' +
        '<p class="allow__kg">' + esc(a.kg) + '</p>' +
        '<p class="allow__bag">' + esc(a.bag) + '</p>' +
        (a.small ? '<p class="allow__small">🎒 ' + a.small + '</p>' : '') +
        '<p class="allow__note">' + esc(a.note) + '</p>' +
      '</article>'
    ).join('');
  }

  /* Peso stimato del solo trolley: le voci spuntate non cambiano il totale,
     serve sapere quanto pesa la lista completa. */
  function trolleyWeight() {
    const group = PACK.find((g) => g.id === 'trolley');
    if (!group) return 0;
    return group.items.reduce((t, it) => t + (it.kg || 0), 0);
  }

  function renderPack() {
    const el = $('#pack');
    if (el) {
      el.innerHTML = PACK.map((g) => {
        const sub = g.noWeight ? null : g.items.reduce((t, it) => t + (it.kg || 0), 0);
        return '<section class="clist card">' +
          '<h3 class="card__title"><span aria-hidden="true">' + g.icon + '</span> ' + esc(g.title) +
            (sub !== null ? ' <span class="pack__kg">' + kgFmt(sub) + '</span>' : '') +
            ' <span class="clist__count" data-count="' + g.id + '"></span></h3>' +
          (g.note ? '<p class="clist__note">' + esc(g.note) + '</p>' : '') +
          '<ul class="chk-list">' + g.items.map((it) =>
            checkbox(it.id, esc(it.text) + (it.kg ? ' <span class="item__kg">' + kgFmt(it.kg) + '</span>' : ''))
          ).join('') + '</ul>' +
        '</section>';
      }).join('');
    }

    // Bilancio del peso
    const content = trolleyWeight();
    const total = content + BAG_EMPTY;
    const budget = $('#weightBudget');
    if (budget) {
      const pct = Math.min(100, Math.round((total / BAG_TARGET) * 100));
      budget.innerHTML =
        '<div class="wb__rows">' +
          '<div class="wb__row"><span>Contenuto, stimato</span><b>' + kgFmt(content) + '</b></div>' +
          '<div class="wb__row"><span>Borsone 55 × 35 × 23 vuoto, pesato</span><b>' + kgFmt(BAG_EMPTY) + '</b></div>' +
          '<div class="wb__row wb__row--total"><span>Totale</span><b>' + kgFmt(total) + '</b></div>' +
        '</div>' +
        '<div class="wb__bar" role="img" aria-label="Peso stimato ' + kgFmt(total) + ' su un limite di ' + BAG_TARGET + ' kg">' +
          '<div class="wb__fill" style="width:' + pct + '%"></div>' +
          '<span class="wb__mark" style="left:' + (BAG_FORMAL / BAG_TARGET * 100) + '%" title="Limite formale ITA"></span>' +
        '</div>' +
        '<p class="wb__legend">' +
          '<span class="wb__tag">▮ stimato ' + kgFmt(total) + '</span>' +
          '<span class="wb__tag">┃ ' + BAG_FORMAL + ' kg formali ITA</span>' +
          '<span class="wb__tag">' + BAG_TARGET + ' kg Wizz, il limite che conta</span>' +
        '</p>' +
        '<p class="small">Restano <strong>' + kgFmt(Math.max(0, BAG_TARGET - total)) +
        '</strong> di margine sul limite Wizz. Per il ritorno servono ' +
        '<strong>~0,5 kg</strong>: qualche calamita e due magliette. Il margine basta con ' +
        'quasi un chilo di avanzo.</p>';
    }

    // Liquidi
    const fill = (id, items) => {
      const el = $(id);
      if (el) el.innerHTML = items.map((i) => '<li>' + i + '</li>').join('');
    };
    fill('#liqRules', LIQUIDS.rules);
    fill('#liqCounts', LIQUIDS.counts);
    fill('#liqSolids', LIQUIDS.solids);
    fill('#liqExceptions', LIQUIDS.exceptions);
    const liqTrap = $('#liqTrap');
    if (liqTrap) liqTrap.innerHTML = LIQUIDS.trap;
    const liqTrap2 = $('#liqTrap2');
    if (liqTrap2) liqTrap2.innerHTML = LIQUIDS.trap2;
    const liqChk = $('#liqCheck');
    if (liqChk) liqChk.innerHTML = LIQUIDS.checklist.map((c) => checkbox(c.id, esc(c.text))).join('');

    const nb = $('#notBring');
    if (nb) {
      nb.innerHTML = NOT_BRING.map((n) =>
        '<li><strong>' + esc(n.text) + '</strong>' +
        (n.why !== '—' ? ' — <span class="nb__why">' + esc(n.why) + '</span>' : '') + '</li>'
      ).join('');
    }

    const hea = $('#health');
    if (hea) {
      hea.innerHTML = HEALTH.map((h) =>
        '<article class="card">' +
          '<h3 class="card__title"><span aria-hidden="true">' + h.icon + '</span> ' + esc(h.title) + '</h3>' +
          '<p>' + h.text + '</p>' +
        '</article>'
      ).join('');
    }

    const buy = $('#buyThere');
    if (buy) {
      buy.innerHTML = BUY_THERE.map((b) =>
        '<li><strong>' + esc(b.what) + '</strong> — <span class="nb__why">' + esc(b.why) + '</span></li>'
      ).join('');
    }

    const lau = $('#laundry');
    if (lau) {
      lau.innerHTML = LAUNDRY.map((l) =>
        '<tr' + (l.key ? ' class="tr--key"' : '') + '><td><strong>' + esc(l.when) + '</strong></td>' +
        '<td>' + esc(l.where) + '</td><td>' + esc(l.what) + '</td></tr>'
      ).join('');
    }

    const fin = $('#finalCheck');
    if (fin) fin.innerHTML = FINAL_CHECK.map((f) => checkbox(f.id, esc(f.text))).join('');
  }

  function renderEclipse() {
    const verify = $('#eclipseVerify');
    if (verify) verify.innerHTML = ECLIPSE_VERIFY.map((it) => checkbox(it.id, esc(it.text))).join('');

    const des = $('#desert');
    if (des) des.innerHTML = DESERT.map((d) => checkbox(d.id, esc(d.text))).join('');

    const road = $('#eclipseDay');
    if (road) {
      road.innerHTML = '<ol class="timeline">' + ECLIPSE_DAY.map((r) =>
        '<li class="tl' + (r.key ? ' tl--highlight' : '') + '">' +
          '<span class="tl__time">' + esc(r.time) + '</span>' +
          '<h4 class="tl__title">' + esc(r.what) + '</h4>' +
          '<p class="tl__note">' + esc(r.note) + '</p>' +
        '</li>').join('') + '</ol>';
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

    const be = $('#beach');
    if (be) be.innerHTML = BEACH.map((b) => checkbox(b.id, esc(b.text))).join('');

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
    const ids = DECISIONS.map((d) => d.id)
      .concat(ECLIPSE_VERIFY.map((e) => e.id))
      .concat(DESERT.map((d) => d.id))
      .concat(NIGHT_TIPS.map((t) => t.id))
      .concat(BEACH.map((b) => b.id));
    CHECKLISTS.forEach((g) => g.items.forEach((it) => ids.push(it.id)));
    PACK.forEach((g) => g.items.forEach((it) => ids.push(it.id)));
    LIQUIDS.checklist.forEach((c) => ids.push(c.id));
    FINAL_CHECK.forEach((f) => ids.push(f.id));
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

    CHECKLISTS.concat(PACK).forEach((g) => {
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

    CHECKLISTS.concat(PACK).forEach((g) => {
      out.push('## ' + g.title);
      g.items.forEach((it) => out.push('- ' + mark(it.id) + ' ' + it.text +
        (it.kg ? ' (' + kgFmt(it.kg) + ')' : '')));
      out.push('');
    });

    out.push('## Liquidi');
    LIQUIDS.checklist.forEach((c) => out.push('- ' + mark(c.id) + ' ' + c.text));
    out.push('');

    out.push('## Controllo finale, la sera del 9');
    FINAL_CHECK.forEach((f) => out.push('- ' + mark(f.id) + ' ' + f.text));
    out.push('');

    out.push('## Eclissi — da verificare');
    ECLIPSE_VERIFY.forEach((e) => out.push('- ' + mark(e.id) + ' ' + e.text));
    out.push('');

    out.push('## Notte nel deserto');
    DESERT.forEach((d) => out.push('- ' + mark(d.id) + ' ' + d.text));
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
    renderAllowance();
    renderPack();
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
