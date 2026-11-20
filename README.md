# GUT STUDIO – Website

Website von Gilbert, Usslar und Tomschin. Reines HTML + CSS, kein Build-Schritt, kein JavaScript.
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
