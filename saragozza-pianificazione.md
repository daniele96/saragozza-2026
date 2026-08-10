# Viaggio a Saragozza — Dati di pianificazione

> **Nota per l'AI che costruirà il sito:** questo file contiene tutti i dati di un viaggio di 4 giorni a Saragozza (Spagna). Usalo per generare un **sito web statico responsive** (HTML/CSS/JS vanilla, senza build) con: pagina panoramica, sezione biglietti per i monumenti, tabella attrazioni con prezzi, itinerario giorno per giorno reso come timeline, sezione trasporti, note pratiche e una **mappa interattiva** (Leaflet + OpenStreetMap, senza API key) con i marker di tutti i luoghi che hanno coordinate GPS. Contenuti in italiano, palette ispirata a Saragozza (sabbia/crema, terracotta mudéjar, blu Ebro, oro), layout mobile-first.
>
> **Pubblicazione richiesta:** al termine crea una **repository GitHub pubblica** (nome suggerito `saragozza-2026`), fai push dei file sul branch `main`, abilita **GitHub Pages** servendo dal branch `main` cartella root `/`, verifica che il sito sia online e restituisci l'**URL pubblico finale** (`https://<utente>.github.io/saragozza-2026/`). Se manca l'autenticazione, usa la GitHub CLI (`gh`) o segnala quali credenziali servono.

---

## 1. Panoramica del viaggio

| Campo | Valore |
|---|---|
| Destinazione | Saragozza (Zaragoza), Aragona, Spagna |
| Date | 10–14 agosto 2026 |
| Alloggio | Zona Stazione Zaragoza-Delicias (ovest del centro) |
| Contesto | Viaggio culturale + osservazione dell'eclissi solare del 12 agosto 2026 |
| Tappa successiva | Valencia (14–16 agosto) |
| Clima previsto | Molto caldo, 35 °C+ tipici di agosto |

**Finestre di disponibilità per il turismo:**

| Giorno | Disponibilità |
|---|---|
| Lun 10 ago | Solo dalla sera (arrivo) |
| Mar 11 ago | Giornata intera |
| Mer 12 ago | Città fino alle 13:00, poi escursione alle Bardenas fino all'1:30 |
| Gio 13 ago | Giornata intera |
| Ven 14 ago | Eventualmente solo mattina (in dubbio — partenza per Valencia) |

---

## 2. Biglietti per i monumenti

**La Zaragoza Card non è più attiva (agosto 2026).** Al suo posto restano due biglietti combinati separati, più il bus turistico come servizio a pagamento a parte.

### Bono Ruta Caesaraugusta — 7 €

Biglietto unico per i 4 siti romani, in alternativa ai biglietti singoli. Nessuna validità multi-giorno dichiarata: si acquista e si usa lo stesso giorno.

### Entrada conjunta cattedrali — 12 €, valida 48 ore

Copre:
- Catedral del Salvador (La Seo) + Museo de Tapices
- Catedral-Basílica del Pilar + Museo Pilarista
- Rosario de Cristal
- Subida a la Torre — **non si vende a parte**, è compresa solo con questo biglietto completo

### Bus turistico — servizio separato, non un bono monumenti

| Tariffa | Prezzo |
|---|---|
| Generale | 10 € |
| Over 65 / tessera trasporti gratuiti del Comune | 5 € |
| Disoccupati* | 5 € |
| Carta giovani* / Studenti* / Persone con disabilità* / Famiglie monoparentali* | 8 € |
| Bambini sotto i 5 anni (senza posto a sedere) | Gratuito |
| Gruppo di 4 persone | 30 € |

*Per le tariffe ridotte serve il documento valido corrispondente. Tariffa generale e over 65 si comprano a bordo, in contanti; le altre solo online o agli uffici del turismo.*

**Percorso:** partenza da Calle Don Jaime I (vicino alla Lonja), giro di ~90 minuti.

**Offerte combinate:**
- Bus turistico diurno o Megabus + Acuario: adulti 21,60 €, bambini 5–12 anni 17,60 € (solo agli uffici del turismo)
- Bus turistico diurno o Megabus + Mobility City: adulti 16,60 €, bambini 5–12 anni 13,60 € (solo agli uffici del turismo)
- Sconto al parco divertimenti: −7 € sul braccialetto Super Fun e su quello bambini, con il biglietto del bus turistico diurno o Megabus

---

## 3. Attrazioni fuori dai due bono (prezzo del biglietto singolo)

| Attrazione | Prezzo | Orari | Coordinate (lat, lng) |
|---|---|---|---|
| Palazzo dell'Aljafería (con audioguida) | ~5 € | Tutti i giorni 10:00–17:15 | 41.6560942, -0.8970488 |
| Musei civici (Pablo Gargallo, Pablo Serrano/IAACC, Centro de Historias, Palacio de Sástago, Museo Etnológico, Museo de Cerámica, Museo del Fuego) | Quasi tutti già gratuiti | Molti chiusi il lunedì | Centro storico |

**Contenuto dei due bono (§2), con orari e coordinate:**

| Attrazione | Bono | Orari | Coordinate (lat, lng) |
|---|---|---|---|
| La Seo – Catedral del Salvador + Museo de Tapices | Conjunta 12 € | Chiude a pranzo, andare presto | 41.6545606, -0.8757358 |
| Catedral-Basílica del Pilar + Museo Pilarista | Conjunta 12 € | Basílica aperta ~8:00–20:30 | 41.6568982, -0.8785056 |
| Rosario de Cristal | Conjunta 12 € | Dentro/presso la Basílica | 41.6568982, -0.8785056 |
| Subida a la Torre | Solo con conjunta 12 € | — | 41.6568982, -0.8785056 |
| Ruta Caesaraugusta — Museo del Foro | Bono 7 € | Lun chiuso; Mar–Sab 10–14 e 17–21; Dom 10–14:30 | 41.6551667, -0.8763235 |
| Ruta Caesaraugusta — Museo del Teatro | Bono 7 € | Lun chiuso; Mar–Sab 10–14 e 17–21; Dom 10–14:30 | 41.6525348, -0.8772734 |
| Ruta Caesaraugusta — Termas Públicas | Bono 7 € | Lun chiuso; Mar–Sab 10–14 e 17–21; Dom 10–14:30 | C/ San Juan y San Pedro |
| Ruta Caesaraugusta — Puerto Fluvial | Bono 7 € | Lun chiuso; Mar–Sab 10–14 e 17–21; Dom 10–14:30 | Plaza San Bruno |

> Verificare comunque orari e condizioni alla biglietteria prima della partenza: possono cambiare.

---

## 4. Altri luoghi dell'itinerario (fuori dai due bono)

| Luogo | Tipo | Note | Coordinate (lat, lng) |
|---|---|---|---|
| Plaza del Pilar | Piazza | Cuore del centro storico | 41.6566, -0.8785 |
| Bus turistico — partenza | Logistica | Calle Don Jaime I, vicino alla Lonja | 41.6555071, -0.8765012 |
| Puente de Piedra | Ponte / punto panoramico | Foto classica del Pilar sull'Ebro, ottimo al tramonto | 41.6572038, -0.8753503 |
| El Tubo | Quartiere tapas | Zona di calle Estébanes / Libertad / Cuatro de Agosto | 41.6526, -0.8795 |
| Bula del Tubo | Tapas | Aperto il lunedì; foie e madejas | 41.6526206, -0.8802795 |
| Meli del Tubo | Tapas | **Chiuso lun–mar**; ideale giovedì sera | 41.6528, -0.8798 |
| Iglesia de San Pablo | Chiesa / mirador | "Terza cattedrale", torre mudéjar salibile; Mar–Sab 10:00–12:30 | 41.6560155, -0.8858844 |
| Mercado Central | Mercato | Ristrutturato; Lun–Ven 9–14 e 17:30–20, Sab fino 14:30, Dom chiuso | 41.6561291, -0.8828511 |
| Acuario de Zaragoza | Acquario | Zona Expo 2008 / Parque del Agua; più grande d'acqua dolce d'Europa; ~10:00–20:00. Visitato martedì mattina | 41.6692044, -0.8986434 |
| Zona Expo 2008 | Passeggiata | Pabellón Puente, Torre del Agua, scultura *Alma del Ebro* | 41.6690, -0.8930 |
| Patio de la Infanta | Cortile storico | Gratuito, in centro | 41.6520, -0.8830 |

> Il Museo de Zaragoza (Goya, ingresso gratuito, 41.6510/-0.8770) non è più in programma: la mattina di martedì è occupata da bus turistico e Acuario.

---

## 5. Itinerario giorno per giorno

### Lunedì 10 agosto — Sera (arrivo, giro leggero, a costo zero)
Serata a costo zero, tutto a piedi in centro.

| Ora | Tappa | Note |
|---|---|---|
| 20:00 | Plaza del Pilar | Piazza e esterno della Basílica illuminati; l'interno è in programma mercoledì mattina |
| 20:45 | Puente de Piedra | Foto classica del Pilar sull'Ebro all'ora blu |
| 21:30 | Bula del Tubo | Cena tapas; aperto il lunedì (Meli è chiuso) |

### Martedì 11 agosto — Giornata piena: bus, Acuario e resti romani

Mattina fuori dal centro storico, tra bus turistico e Acuario. Nel pomeriggio, appena i musei romani riaprono alle 17:00, il bono della Ruta Caesaraugusta — fino alle 19:30, in tempo per la cena alla Miguería.

| Ora | Tappa | Note |
|---|---|---|
| 10:00 | Bus turistico | Giro panoramico di ~90 minuti, partenza da Calle Don Jaime I. Tariffa generale 10 € |
| 11:30 | Acuario de Zaragoza | Con le linee 48 / Ci1 / Ci2. Valutare agli uffici del turismo il combinato bus turistico + Acuario, 21,60 € |
| 13:30–17:00 | Pranzo e pausa | I musei romani riaprono solo alle 17:00 |
| 17:00–19:30 | Ruta Caesaraugusta — 4 siti romani | Bono unico 7 €: Foro, Puerto Fluvial, Termas Públicas e Teatro |
| 20:00–21:45 | Cena alla Miguería — prenotata | Plaza Santiago Sas 6. Tavolo per 12 persone, confermato |

### Mercoledì 12 agosto — Mattina in città, poi eclissi

Mattina tutta in Plaza del Pilar, senza spostamenti. Alle 13:00 il programma cittadino chiude e alle 14:00 parte l'escursione per l'eclissi nel deserto delle Bardenas, con rientro all'1:30.

| Ora | Tappa | Note |
|---|---|---|
| 09:00 | Basílica del Pilar — Virgen del Pilar | Interno sempre gratuito. La Basílica apre verso le 8:00 |
| 10:00 | La Seo + Museo de Tapices | Apre alle 10:00, chiude a pranzo: arrivare all'apertura |
| 11:30 | Torre panoramica e Museo Pilarista | Ascensore e vista sulla città |
| 13:00 | Fine del programma in città | Pranzo veloce o snack, poi in stazione |
| 14:00 | Partenza dalla stazione | Inizio escursione per l'eclissi |
| 16:00 | Cadreita — Restaurante Las Piscinas | Sosta e pasto |
| 18:15 | Partenza per il deserto delle Bardenas | Stop fotografici sui mirador |
| 19:30 | Arrivo al punto di osservazione | Orizzonte libero |
| 22:00 | Centro di osservazione, Hostal Virgen del Yugo | Seconda parte della serata |
| 01:30 | Rientro a Saragozza | Notte corta: giovedì riparte alle 9:00 |

### Giovedì 13 agosto — Giornata piena

Si parte alle 9:00 dal Mercado Central. Poi la giornata scorre da est a ovest: San Pablo, l'Aljafería nelle ore calde, la zona Expo la sera e rientro diretto a Delicias.

| Ora | Tappa | Note |
|---|---|---|
| 09:00 | Mercado Central | Colazione o spuntino |
| 10:00 | Iglesia de San Pablo | Torre mudéjar salibile; aperta solo 10:00–12:30, unico giorno utile del viaggio |
| 12:15–13:45 | Pranzo e pausa | Un'ora e mezza |
| 13:45 | Palazzo dell'Aljafería | Mudéjar UNESCO, ~1,5h. Slot da prenotare: ingresso a fasce orarie con quota |
| 16:30 | Zona Expo / Parque del Agua | Passeggiata gratuita tra Pabellón Puente e Torre del Agua — l'Acuario è già visto martedì. Linee 48 / Ci1 / Ci2 per rientrare |
| Sera | Cena tapas | Meli del Tubo (aperto giovedì) |

### Venerdì 14 agosto — Mattina (se confermata, poi partenza per Valencia)

| Ora | Tappa | Note |
|---|---|---|
| Mattina | Patio de la Infanta / calle Alfonso I | Giro corto di chiusura; recupero di ciò che manca |
| — | Partenza | Treno/bus per Valencia dalla stazione Delicias |

---

## 6. Trasporti

**Posizione alloggio:** stazione Zaragoza-Delicias, a ~2,8–3 km a ovest del centro storico (35–40 min a piedi, sconsigliato sotto il sole).

**Da Delicias al centro:**

| Mezzo | Dettaglio |
|---|---|
| Bus Ci3 | Scende a Paseo Echegaray y Caballero / Hospedería (vicino al Pilar), ~17–19 min |
| Bus 34 | Scende ad Avda. César Augusto / Mercado Central, ~20 min |
| Altre linee | 21, 60, C1, C4, CI1, CI2, N1 (notturna) |
| Taxi | ~6 min, 9–12 € |
| A piedi | ~35–40 min (sconsigliato per il caldo) |

**Note geografiche utili:**
- L'**Aljafería** è a ~12–15 min a piedi dalla stazione (direttrice Avda. Madrid verso il centro), sulla strada verso ovest: giovedì cade sul tragitto tra il centro e la zona Expo.
- **Acuario** e **zona Expo** sono sul lato ovest/nord, collegati a Delicias dalle linee 48 / Ci1 / Ci2. L'Acuario si visita martedì mattina; giovedì si rientra diretti dalla zona Expo senza passare dal centro.
- Il **bus turistico** (§2, servizio a pagamento separato) fa un anello nel centro e **non passa da Delicias**: per il tragitto alloggio↔centro usare i bus urbani.

**Biglietti trasporto pubblico urbano (tariffe 2026):**

| Titolo | Prezzo |
|---|---|
| Biglietto singolo (a bordo) | 1,70 € |
| Viaggio con Tarjeta Bus / Multiviaje | 0,55 € |
| Biglietto notturno | 1 € |
| Linea aeroporto (con tessera) | 2,25 € |
| Primo trasbordo entro l'ora | Gratuito |

**Tarjeta Bus (tessera ricaricabile):** costo 7 € (5 € di credito + 2 € di cauzione rimborsabile); ricariche a multipli di 5 €, credito che non scade. **Non conveniente per questo viaggio** (poche corse extra): meglio i biglietti singoli.

**Budget corse:** senza più la Zaragoza Card, ogni corsa dell'autobus urbano si paga a parte: biglietto singolo 1,70 € a bordo, oppure Tarjeta Bus se si prevedono molte corse. Da contare in anticipo: le linee 48/Ci1/Ci2 per l'Acuario di martedì e per il rientro di giovedì da Expo.

---

## 7. Note pratiche (regole d'oro)

1. **Caldo di agosto (35 °C+):** si parte alle 9:00 per sfruttare le ore fresche, pause di 1,5–2 ore a metà giornata. Fa eccezione il martedì, che comincia alle 10:00 con il bus turistico e ha una pausa più lunga (13:30–17:00), imposta dalla chiusura dei musei romani.
2. **Lunedì chiusure:** Ruta Caesaraugusta e quasi tutti i musei civici sono chiusi il lunedì → non pianificare musei quel giorno.
3. **Niente più Zaragoza Card:** restano due biglietti separati: bono Ruta Caesaraugusta 7 € (4 siti romani) ed entrada conjunta cattedrali 12 €, valida 48 ore (La Seo, Basílica del Pilar, Museo Pilarista, Rosario de Cristal e torre).
4. **Torre solo con biglietto completo:** la Subida a la Torre del Pilar non si vende separatamente, serve l'entrada conjunta da 12 €.
5. **Aljafería a fasce orarie:** l'ingresso ha quota per fascia oraria → assicurarsi lo slot (giovedì 13, 13:45).
6. **Tapas:** Meli del Tubo chiuso lun–mar (usarlo giovedì); Bula del Tubo aperto il lunedì.

---

*Documento generato come base dati per la costruzione di un sito di pianificazione viaggio. Aggiornato ad agosto 2026 dopo la disattivazione della Zaragoza Card e la riorganizzazione della giornata di martedì. Verificare orari e prezzi ufficiali prima della partenza, poiché possono subire variazioni.*
