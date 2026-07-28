# Saragozza 2026

Sito statico di pianificazione per un viaggio di quattro giorni a Saragozza (10–14 agosto 2026):
Zaragoza Card, attrazioni con prezzi, itinerario giorno per giorno, trasporti da Delicias e
mappa interattiva con tutti i luoghi.

**Online:** https://daniele96.github.io/saragozza-2026/

## Com'è fatto

HTML, CSS e JavaScript vanilla, nessun passaggio di build. Le uniche dipendenze esterne sono
[Leaflet](https://leafletjs.com/) con le tile di OpenStreetMap (nessuna API key) e i font di
Google Fonts, tutti caricati da CDN.

```
index.html              struttura della pagina
assets/css/styles.css   palette sabbia / terracotta mudéjar / blu Ebro / oro, mobile-first
assets/js/data.js       tutti i dati del viaggio (luoghi, prezzi, itinerario, trasporti)
assets/js/app.js        rendering delle sezioni, filtri e mappa
saragozza-pianificazione.md   documento di partenza da cui derivano i dati
```

Per modificare contenuti si tocca solo `assets/js/data.js`: le sezioni Panoramica, Card,
Attrazioni, Itinerario, Mappa, Trasporti e Note sono generate da quelle strutture.

## Sviluppo in locale

Serve un server HTTP qualsiasi (aprire il file con `file://` funziona, ma il server evita
sorprese con la cache):

```bash
python -m http.server 8000
# poi http://localhost:8000
```

## Note sui dati

Le posizioni di *Termas Públicas* e *Puerto Fluvial* sono ricostruite dall'indirizzo e quindi
approssimative: nel documento di partenza c'erano solo via e piazza. Orari e prezzi vanno
verificati sulle fonti ufficiali prima della partenza.
