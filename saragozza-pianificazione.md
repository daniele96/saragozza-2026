# Viaggio a Saragozza — Dati di pianificazione

> **Nota per l'AI che costruirà il sito:** questo file contiene tutti i dati di un viaggio di 4 giorni a Saragozza (Spagna). Usalo per generare un **sito web statico responsive** (HTML/CSS/JS vanilla, senza build) con: pagina panoramica, sezione Zaragoza Card, tabella attrazioni con prezzi, itinerario giorno per giorno reso come timeline, sezione trasporti, note pratiche e una **mappa interattiva** (Leaflet + OpenStreetMap, senza API key) con i marker di tutti i luoghi che hanno coordinate GPS. Contenuti in italiano, palette ispirata a Saragozza (sabbia/crema, terracotta mudéjar, blu Ebro, oro), layout mobile-first.
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
| Mer 12 ago | Solo mattina (pomeriggio/sera dedicati all'eclissi) |
| Gio 13 ago | Giornata intera |
| Ven 14 ago | Eventualmente solo mattina (in dubbio — partenza per Valencia) |

---

## 2. Zaragoza Card

Tessera turistica ufficiale della città.

**Prezzi (validità dal primo utilizzo):**

| Durata | Prezzo |
|---|---|
| 24 ore | 18 € |
| 48 ore | 21 € |
| 72 ore | 24 € |

**Scelta consigliata:** 72 ore, **da attivare martedì 11** (non lunedì, per non sprecarla e perché il lunedì molti musei sono chiusi).

**Attivazione:** la card si attiva al **primo utilizzo** in un sito con ingresso incluso, **non** al momento dell'acquisto. Si può quindi ritirare all'arrivo e attivarla il giorno giusto.

**Dove acquistarla/ritirarla:** uffici del turismo (Plaza del Pilar; stazione Delicias, Calle Rioja 33, aperto tutti i giorni 10:00–20:00) oppure online.

**Cosa include:**
- Ingresso gratuito ai principali monumenti e musei (vedi tabella §3)
- Bus turistico hop-on/hop-off 24h (audioguida anche in italiano)
- Trasporto pubblico urbano: **non illimitato** → 5 corse (24h) / 7 corse (48h) / **9 corse (72h)**
- Una visita guidata a piedi a scelta
- Una tapa + bevanda in locale convenzionato (in alcune versioni una seconda alla caffetteria di El Corte Inglés)
- Sconti: CaixaForum (−30%), Acquario Fluviale, Parco Divertimenti, trenino Parque Grande (−40%), Monasterio de Piedra, oltre 50 ristoranti/negozi

**Convenienza:** bus turistico + Aljafería + La Seo + Ruta Caesaraugusta + visita guidata valgono già ~40 € contro i 24 € della 72h. Si ripaga facilmente.

---

## 3. Attrazioni incluse nella Card (con prezzo del biglietto singolo)

| Attrazione | Prezzo singolo | Orari | Coordinate (lat, lng) |
|---|---|---|---|
| Palazzo dell'Aljafería (con audioguida) | ~5 € | Tutti i giorni 10:00–17:15 | 41.6560942, -0.8970488 |
| La Seo – Catedral del Salvador + Museo de Tapices | ~7 € | Chiude a pranzo, andare presto | 41.6545606, -0.8757358 |
| Ascensore panoramico Torre del Pilar | 4 € | Basílica aperta ~8:00–20:30 | 41.6568982, -0.8785056 |
| Museo Pilarista | ~2 € | Dentro la Basílica del Pilar | 41.6568982, -0.8785056 |
| Museo del Rosario de Cristal | 5 € | Dentro/presso la Basílica | 41.6568982, -0.8785056 |
| Ruta Caesaraugusta — Museo del Foro | 4 € | Lun chiuso; Mar–Sab 10–14 e 17–21; Dom 10–14:30 | 41.6551667, -0.8763235 |
| Ruta Caesaraugusta — Museo del Teatro | 4 € | Lun chiuso; Mar–Sab 10–14 e 17–21; Dom 10–14:30 | 41.6525348, -0.8772734 |
| Ruta Caesaraugusta — Termas Públicas | 3 € | Lun chiuso; Mar–Sab 10–14 e 17–21; Dom 10–14:30 | C/ San Juan y San Pedro |
| Ruta Caesaraugusta — Puerto Fluvial | 3 € | Lun chiuso; Mar–Sab 10–14 e 17–21; Dom 10–14:30 | Plaza San Bruno |
| *(Ruta Caesaraugusta — bono combinato 4 musei)* | *7 €* | — | — |
| Musei civici (Pablo Gargallo, Pablo Serrano/IAACC, Centro de Historias, Palacio de Sástago, Museo Etnológico, Museo de Cerámica, Museo del Fuego) | Quasi tutti già gratuiti | Molti chiusi il lunedì | Centro storico |
| Casino de Zaragoza | Incluso | — | Centro |

**Servizi inclusi (valore indicativo):** Bus turistico 24h ~11 € · Visita guidata a piedi ~10 € · Tapa + bevanda ~4–5 €.

> Alcuni prezzi singoli (in particolare La Seo) potrebbero essere leggermente più alti nel 2026; il senso della convenienza non cambia.

---

## 4. Altri luoghi dell'itinerario (non-card)

| Luogo | Tipo | Note | Coordinate (lat, lng) |
|---|---|---|---|
| Plaza del Pilar | Piazza | Cuore del centro storico | 41.6566, -0.8785 |
| Puente de Piedra | Ponte / punto panoramico | Foto classica del Pilar sull'Ebro, ottimo al tramonto | 41.6572038, -0.8753503 |
| El Tubo | Quartiere tapas | Zona di calle Estébanes / Libertad / Cuatro de Agosto | 41.6526, -0.8795 |
| Bula del Tubo | Tapas | Aperto il lunedì; foie e madejas | 41.6526206, -0.8802795 |
| Meli del Tubo | Tapas | **Chiuso lun–mar**; ideale giovedì sera | 41.6528, -0.8798 |
| Iglesia de San Pablo | Chiesa / mirador | "Terza cattedrale", torre mudéjar salibile; Mar–Sab 10:00–12:30 | 41.6560155, -0.8858844 |
| Mercado Central | Mercato | Ristrutturato; Lun–Ven 9–14 e 17:30–20, Sab fino 14:30, Dom chiuso | 41.6561291, -0.8828511 |
| Museo de Zaragoza | Museo (Goya) | Ingresso gratuito | 41.6510, -0.8770 |
| Acuario de Zaragoza | Acquario | Zona Expo 2008 / Parque del Agua; più grande d'acqua dolce d'Europa; ~10:00–20:00 | 41.6692044, -0.8986434 |
| Zona Expo 2008 | Passeggiata | Pabellón Puente, Torre del Agua, scultura *Alma del Ebro* | 41.6690, -0.8930 |
| Patio de la Infanta | Cortile storico | Gratuito, in centro | 41.6520, -0.8830 |

---

## 5. Itinerario giorno per giorno

### Lunedì 10 agosto — Sera (arrivo, giro leggero, SENZA card)
Serata a costo zero, tutto a piedi in centro. Ritirare (non attivare) la Zaragoza Card all'ufficio del turismo della stazione Delicias.

| Ora | Tappa | Note |
|---|---|---|
| 20:00 | Basílica del Pilar | Interno gratuito, aperta fino ~20:30; bella al tramonto |
| 20:45 | Puente de Piedra | Foto classica del Pilar sull'Ebro all'ora blu |
| 21:30 | Bula del Tubo | Cena tapas; aperto il lunedì (Meli è chiuso) |

### Martedì 11 agosto — Giornata piena (ATTIVARE LA CARD)

| Ora | Tappa | Note |
|---|---|---|
| 10:00 | Palazzo dell'Aljafería | Attivare qui la card. Andare presto per il fresco. Mudéjar UNESCO, ~1,5h. A ~12–15 min a piedi dalla stazione Delicias |
| 14:00–17:00 | Pranzo + pausa caldo | I musei romani chiudono comunque in questa fascia |
| 17:00 | Ruta Caesaraugusta | Foro → Puerto Fluvial → Termas → Teatro (tutti vicini, aperti fino alle 21) |
| Sera | Cena tapas | El Tubo |

### Mercoledì 12 agosto — Solo mattina (pomeriggio/sera: eclissi)

| Ora | Tappa | Note |
|---|---|---|
| 10:00 | La Seo + Museo de Tapices | Arazzi tra i migliori d'Europa; chiude a pranzo, andare presto |
| 11:30 | Torre del Pilar (ascensore) + Museo Pilarista | Vista panoramica sulla città |
| ~12:30 | Libero | Preparazione all'eclissi |

### Giovedì 13 agosto — Giornata piena

| Ora | Tappa | Note |
|---|---|---|
| 10:00 | Iglesia de San Pablo | Torre mudéjar salibile, vista 360°; aperta 10:00–12:30 |
| 11:30 | Mercado Central | Aperitivo/spuntino |
| (opz.) | Museo de Zaragoza | Sale dedicate a Goya, ingresso gratuito |
| Pranzo | Pausa caldo | — |
| 18:00 | Acuario + zona Expo/Parque del Agua | Raggiungibile col bus turistico incluso; passeggiata serale |
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
- L'**Aljafería** è a ~12–15 min a piedi dalla stazione (direttrice Avda. Madrid verso il centro) → martedì si parte a piedi.
- **Acuario / zona Expo** sono sul lato ovest/nord, collegati a Delicias dalle linee 48 / Ci1 / Ci2 → giovedì si può rientrare diretti senza passare dal centro.
- Il **bus turistico incluso** fa un anello nel centro e **non passa da Delicias**: per il tragitto alloggio↔centro usare i bus urbani.

**Biglietti trasporto pubblico (tariffe 2026):**

| Titolo | Prezzo |
|---|---|
| Biglietto singolo (a bordo) | 1,70 € |
| Viaggio con Tarjeta Bus / Multiviaje | 0,55 € |
| Biglietto notturno | 1 € |
| Linea aeroporto (con tessera) | 2,25 € |
| Primo trasbordo entro l'ora | Gratuito |

**Tarjeta Bus (tessera ricaricabile):** costo 7 € (5 € di credito + 2 € di cauzione rimborsabile); ricariche a multipli di 5 €, credito che non scade. **Non conveniente per questo viaggio** (poche corse extra): meglio i biglietti singoli.

**Budget corse:** la Card 72h include 9 corse → sufficienti (martedì Aljafería a piedi, giovedì Expo servita dalla zona → ~6–7 corse totali). Corse fuori card: lunedì sera + venerdì mattina, da pagare a biglietto singolo (1,70 €) o taxi.

---

## 7. Note pratiche (regole d'oro)

1. **Caldo di agosto (35 °C+):** attività all'aperto la mattina presto e la sera; pomeriggio (14–17) al chiuso o in pausa. La chiusura pomeridiana dei musei romani aiuta a organizzare la siesta.
2. **Lunedì chiusure:** Ruta Caesaraugusta e quasi tutti i musei civici sono chiusi il lunedì → non attivare la card e non pianificare musei quel giorno.
3. **Attivazione card:** ritirarla all'arrivo (ufficio Delicias) ma attivarla martedì 11 all'Aljafería.
4. **Aljafería:** ingresso a fasce orarie con quota → assicurarsi lo slot anche se l'ingresso è incluso nella card.
5. **Visita guidata inclusa:** le passeggiate tematiche (Romano/Mudéjar/Goya) girano soprattutto nei weekend; nei feriali di solito walking tour in lingua o giro del casco histórico → verificare il calendario al ritiro della card.
6. **Tapas:** Meli del Tubo chiuso lun–mar (usarlo giovedì); Bula del Tubo aperto il lunedì.

---

*Documento generato come base dati per la costruzione di un sito di pianificazione viaggio. Verificare orari e prezzi ufficiali prima della partenza, poiché possono subire variazioni.*
