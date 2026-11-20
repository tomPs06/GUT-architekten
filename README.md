# GUT STUDIO – Website

Website von Gilbert, Usslar und Tomschin. Reines HTML + CSS, kein Build-Schritt.
JavaScript gibt es nur für den Portfolio-Viewer (`assets/js/portfolio-viewer.js`), ohne externe Bibliotheken.

**Arbeitsweise:** Änderungen im Branch `entwicklung` machen und testen. Erst danach in `main`
übernehmen und pushen, denn `main` ist sofort live auf gut-studio.de.
Die Dateien lassen sich direkt bei jedem Hoster hochladen (z. B. GitHub Pages oder Netlify).

## Struktur

```
index.html            Startseite mit Projekt-Raster
buero.html            Über uns / Team
kontakt.html          Kontakt
impressum.html        Pflichtangaben (vor dem Veröffentlichen ausfüllen!)
datenschutz.html      Datenschutzerklärung
projekte/
  vorlage.html        Vorlage für eine Projektseite
assets/
  css/style.css       Das komplette Design – Farben, Schrift, Abstände oben als Variablen
  img/favicon.svg     Browser-Icon
  img/projekte/       Projektbilder, ein Unterordner je Projekt
```

## Neues Projekt anlegen

1. `projekte/vorlage.html` kopieren und umbenennen, z. B. `projekte/hanghaus-binz.html`.
2. Bilder nach `assets/img/projekte/hanghaus-binz/` legen.
3. In der neuen Datei Titel, Metadaten und Text ersetzen; jede `<div class="ph …"></div>` durch
   `<img src="../assets/img/projekte/hanghaus-binz/01.jpg" alt="Beschreibung">` ersetzen.
4. In `index.html` eine neue `<li class="card">` anlegen, die auf die Datei verlinkt.

## Team und Portfolios

`team.html` hat pro Person einen Abschnitt (Foto, Kontakt, Lebenslauf) und darunter einen
**Portfolio-Viewer**: Seite 1 als Cover allein, danach Doppelseiten (2–3, 4–5, …) wie im Buch.
Geblättert wird mit den Pfeilen, per Klick auf die linke/rechte Seite, mit den Pfeiltasten oder
durch Wischen. Auf dem Handy (hochkant) kommt eine Seite nach der anderen. Es gibt einen Vollbild-Knopf.

Portfolio einbinden (Seiten 21 × 21 cm):

1. Aus InDesign: *Datei → Exportieren → JPEG*, **Einzelseiten** (nicht Druckbögen),
   Auflösung 150 ppi (ergibt ca. 1240 × 1240 px), Qualität hoch.
   Aus einem PDF: in Vorschau/Acrobat jede Seite als JPG exportieren.
2. Dateien durchnummerieren: `01.jpg`, `02.jpg`, … und in den Ordner der Person legen,
   je Portfolio ein Unterordner, z. B. `assets/portfolios/tomschin/sose26/`.
3. In `team.html` beim Viewer der Person ergänzen bzw. anpassen:
   ```html
   <div class="pv" data-title="Portfolio Philipp Tomschin"
        data-pages="32" data-base="assets/portfolios/tomschin/sose26/" data-ext="jpg"></div>
   ```
   `data-pages` ist die Seitenzahl. Ohne `data-base` zeigt der Viewer Platzhalter-Seiten.

Porträts nach `assets/img/team/` legen und die graue Fläche (`<div class="ph ph--tall"></div>`)
durch `<img class="portrait" src="assets/img/team/tomschin.jpg" alt="Porträt Philipp Tomschin">` ersetzen.

## Bilder

- Format: JPG oder WebP, ca. 2000 px breit (Titelbild) bzw. 1200 px (Raster), möglichst unter 500 KB.
- Dateinamen ohne Leerzeichen und Umlaute: `01-lageplan.jpg`, `02-grundriss-eg.jpg`.
- Immer einen `alt`-Text angeben.

## Lokal ansehen

Im Terminal im Projektordner:

```bash
python3 -m http.server 8000
```

Dann <http://localhost:8000> im Browser öffnen.

## Zusammenarbeit über GitHub

Die Website liegt auf GitHub und wird über **GitHub Pages** veröffentlicht.
Jede Änderung, die auf `main` landet, ist nach ein bis zwei Minuten online.

Mit **GitHub Desktop** (desktop.github.com):

1. Einmalig: *File → Clone Repository* und das Repository auf den eigenen Rechner holen.
   Nicht in iCloud oder Dropbox ablegen, sondern z. B. unter `~/Projekte/`.
2. Vor jeder Arbeit: **Fetch / Pull origin**, damit man den neuesten Stand hat.
3. Dateien ändern, Bilder hinzufügen …
4. In GitHub Desktop unten links eine kurze Beschreibung eintragen
   (z. B. „Projekt Hanghaus Binz ergänzt“) und **Commit to main** klicken.
5. **Push origin**, damit die Änderung online geht.

Regeln, damit nichts kaputtgeht:

- Immer erst *Pull*, dann arbeiten, dann *Commit* und *Push*.
- Nicht zu dritt gleichzeitig an derselben Datei arbeiten, kurz absprechen.
- Bilder vorher verkleinern (siehe oben). Große Dateien machen das Repository langsam.

## Vor dem Veröffentlichen

- Impressum und Datenschutz mit echten Angaben füllen.
- Mail-Adresse und Instagram auf `kontakt.html` eintragen.
- Domain: gut-studio.de (bei Strato, DNS zeigt auf GitHub Pages).
