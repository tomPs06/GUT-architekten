/* ==========================================================================
   GUT STUDIO – Portfolio-Viewer
   Zeigt quadratische Portfolio-Seiten (21 × 21 cm) wie ein Buch:
   Seite 1 allein als Cover, danach Doppelseiten 2–3, 4–5, …
   Auf schmalen Bildschirmen (Handy hochkant) eine Seite nach der anderen.

   Einbinden:
     <div class="pv"
          data-title="Portfolio Philipp Tomschin"
          data-pages="24"
          data-base="assets/portfolios/tomschin/"
          data-ext="jpg"></div>
     <script src="assets/js/portfolio-viewer.js" defer></script>

   Erwartete Dateien: 01.jpg, 02.jpg, … 24.jpg im Ordner data-base.
   Ohne data-base zeigt der Viewer Platzhalter-Seiten.
   ========================================================================== */
(function () {
  "use strict";

  var SINGLE_QUERY = "(max-width: 600px) and (orientation: portrait)";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function pad(n) { return n < 10 ? "0" + n : String(n); }

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function Viewer(root) {
    this.root = root;
    this.title = root.dataset.title || "Portfolio";
    this.total = Math.max(1, parseInt(root.dataset.pages, 10) || 1);
    this.base = root.dataset.base || "";
    this.ext = root.dataset.ext || "jpg";
    this.page = 1;          // erste sichtbare Seite
    this.busy = false;
    this.single = window.matchMedia(SINGLE_QUERY);
    this.build();
    this.render();
    var self = this;
    var onMode = function () { self.render(); };
    if (this.single.addEventListener) this.single.addEventListener("change", onMode);
    else this.single.addListener(onMode);
  }

  /* --- Aufbau ------------------------------------------------------------- */
  Viewer.prototype.build = function () {
    var self = this;
    var r = this.root;
    r.setAttribute("tabindex", "0");
    r.setAttribute("role", "region");
    r.setAttribute("aria-roledescription", "Portfolio-Viewer");
    r.setAttribute("aria-label", this.title + ", " + this.total + " Seiten. Mit den Pfeiltasten blättern.");

    this.stage = el("div", "pv-stage");
    this.book = el("div", "pv-book");
    this.left = el("div", "pv-page pv-left");
    this.right = el("div", "pv-page pv-right");
    this.leaf = el("div", "pv-leaf");
    this.front = el("div", "pv-face pv-front");
    this.back = el("div", "pv-face pv-back");
    this.leaf.appendChild(this.front);
    this.leaf.appendChild(this.back);
    this.book.appendChild(this.left);
    this.book.appendChild(this.right);
    this.book.appendChild(this.leaf);

    this.prevBtn = el("button", "pv-arrow pv-prev");
    this.prevBtn.type = "button";
    this.prevBtn.setAttribute("aria-label", "Vorherige Seite");
    this.prevBtn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 4 7 12l8 8"/></svg>';
    this.nextBtn = el("button", "pv-arrow pv-next");
    this.nextBtn.type = "button";
    this.nextBtn.setAttribute("aria-label", "Nächste Seite");
    this.nextBtn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 4 8 8-8 8"/></svg>';

    this.stage.appendChild(this.book);
    this.stage.appendChild(this.prevBtn);
    this.stage.appendChild(this.nextBtn);

    var bar = el("div", "pv-bar");
    this.count = el("span", "pv-count");
    this.count.setAttribute("aria-live", "polite");
    bar.appendChild(this.count);
    if (document.fullscreenEnabled || document.webkitFullscreenEnabled) {
      this.fsBtn = el("button", "pv-fs", "Vollbild");
      this.fsBtn.type = "button";
      bar.appendChild(this.fsBtn);
      this.fsBtn.addEventListener("click", function () { self.toggleFullscreen(); });
      var onFs = function () {
        var on = (document.fullscreenElement || document.webkitFullscreenElement) === r;
        r.classList.toggle("is-fullscreen", on);
        self.fsBtn.textContent = on ? "Vollbild beenden" : "Vollbild";
      };
      document.addEventListener("fullscreenchange", onFs);
      document.addEventListener("webkitfullscreenchange", onFs);
    }

    r.appendChild(this.stage);
    r.appendChild(bar);

    this.prevBtn.addEventListener("click", function () { self.prev(); });
    this.nextBtn.addEventListener("click", function () { self.next(); });

    // Klick auf die linke oder rechte Buchhälfte blättert
    this.book.addEventListener("click", function (e) {
      var box = self.book.getBoundingClientRect();
      if (e.clientX - box.left > box.width / 2) self.next(); else self.prev();
    });

    r.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight" || e.key === "PageDown") { e.preventDefault(); self.next(); }
      else if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); self.prev(); }
      else if (e.key === "Home") { e.preventDefault(); self.go(1); }
      else if (e.key === "End") { e.preventDefault(); self.go(self.total); }
    });

    // Wischen auf Touch-Geräten
    var x0 = null, y0 = null;
    this.stage.addEventListener("touchstart", function (e) {
      x0 = e.touches[0].clientX; y0 = e.touches[0].clientY;
    }, { passive: true });
    this.stage.addEventListener("touchend", function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      var dy = e.changedTouches[0].clientY - y0;
      x0 = null;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
        if (dx < 0) self.next(); else self.prev();
      }
    });
  };

  /* --- Seiten ------------------------------------------------------------- */
  Viewer.prototype.pageContent = function (n) {
    if (!n) return null;
    var self = this;
    if (this.base) {
      var img = el("img");
      img.src = this.base + pad(n) + "." + this.ext;
      img.alt = this.title + ", Seite " + n;
      img.decoding = "async";
      img.draggable = false;
      img.addEventListener("error", function () {
        if (img.parentNode) img.parentNode.replaceChild(self.placeholder(n), img);
      });
      return img;
    }
    return this.placeholder(n);
  };

  Viewer.prototype.placeholder = function (n) {
    var ph = el("div", "pv-ph" + (n === 1 ? " pv-ph--cover" : "") + (n % 2 === 0 ? " pv-ph--even" : ""));
    if (n === 1) ph.appendChild(el("span", "pv-ph-title", this.title));
    ph.appendChild(el("span", "pv-ph-num", String(n)));
    return ph;
  };

  Viewer.prototype.fill = function (slot, n) {
    slot.textContent = "";
    var c = this.pageContent(n);
    if (c) slot.appendChild(c);
    slot.classList.toggle("is-empty", !c);
  };

  Viewer.prototype.preload = function (from, to) {
    if (!this.base) return;
    for (var n = Math.max(1, from); n <= Math.min(this.total, to); n++) {
      var i = new Image();
      i.src = this.base + pad(n) + "." + this.ext;
    }
  };

  /* --- Doppelseiten -------------------------------------------------------- */
  // Doppelseite i: 0 → [–, 1], 1 → [2, 3], 2 → [4, 5], …
  Viewer.prototype.spreadOf = function (page) { return page <= 1 ? 0 : Math.floor(page / 2); };
  Viewer.prototype.spreadPages = function (i) {
    if (i === 0) return [null, 1];
    var l = 2 * i, r = 2 * i + 1;
    return [l <= this.total ? l : null, r <= this.total ? r : null];
  };
  Viewer.prototype.lastSpread = function () { return this.spreadOf(this.total); };

  Viewer.prototype.shiftFor = function (pages) {
    if (pages[0] === null) return "translateX(-25%)";   // Cover rechts → mittig
    if (pages[1] === null) return "translateX(25%)";    // letzte Seite links → mittig
    return "none";
  };

  /* --- Anzeige ------------------------------------------------------------- */
  Viewer.prototype.render = function () {
    var single = this.single.matches;
    this.root.classList.toggle("is-single", single);
    this.leaf.classList.remove("is-turning", "is-forward", "is-backward");
    this.busy = false;
    if (single) {
      this.fill(this.right, this.page);
      this.left.textContent = "";
      this.book.style.transform = "none";
      this.preload(this.page + 1, this.page + 2);
    } else {
      var p = this.spreadPages(this.spreadOf(this.page));
      this.page = p[0] || p[1];
      this.fill(this.left, p[0]);
      this.fill(this.right, p[1]);
      this.book.style.transform = this.shiftFor(p);
      this.preload(this.page + 2, this.page + 5);
    }
    this.updateUi();
  };

  Viewer.prototype.updateUi = function () {
    var first, last;
    if (this.single.matches) { first = last = this.page; }
    else {
      var p = this.spreadPages(this.spreadOf(this.page));
      first = p[0] || p[1]; last = p[1] || p[0];
    }
    this.count.textContent = (first === last ? "Seite " + first : "Seite " + first + "–" + last) +
      " von " + this.total;
    this.prevBtn.disabled = first <= 1;
    this.nextBtn.disabled = last >= this.total;
  };

  /* --- Blättern ------------------------------------------------------------ */
  Viewer.prototype.next = function () {
    if (this.busy) return;
    if (this.single.matches) {
      if (this.page < this.total) this.swapSingle(this.page + 1);
      return;
    }
    var i = this.spreadOf(this.page);
    if (i < this.lastSpread()) this.turn(i, i + 1);
  };

  Viewer.prototype.prev = function () {
    if (this.busy) return;
    if (this.single.matches) {
      if (this.page > 1) this.swapSingle(this.page - 1);
      return;
    }
    var i = this.spreadOf(this.page);
    if (i > 0) this.turn(i, i - 1);
  };

  Viewer.prototype.go = function (page) {
    if (this.busy) return;
    this.page = Math.min(this.total, Math.max(1, page));
    this.render();
  };

  Viewer.prototype.swapSingle = function (page) {
    var self = this;
    this.page = page;
    if (reduceMotion.matches) { this.render(); return; }
    this.busy = true;
    this.right.classList.add("is-fading");
    setTimeout(function () {
      self.render();
      self.right.classList.remove("is-fading");
    }, 160);
  };

  // Blättert von Doppelseite a nach b; das umschlagende Blatt dreht sich um den Falz.
  Viewer.prototype.turn = function (a, b) {
    var self = this;
    var from = this.spreadPages(a), to = this.spreadPages(b);
    var forward = b > a;
    this.page = to[0] || to[1];

    if (reduceMotion.matches) { this.render(); return; }

    this.busy = true;
    var leaf = this.leaf;
    leaf.classList.remove("is-forward", "is-backward", "is-turning");
    if (forward) {
      // rechts liegt schon die neue rechte Seite, das Blatt trägt alte rechte / neue linke Seite
      this.fill(this.right, to[1]);
      this.fill(this.front, from[1]);
      this.fill(this.back, to[0]);
      leaf.classList.add("is-forward");
    } else {
      this.fill(this.left, to[0]);
      this.fill(this.front, from[0]);
      this.fill(this.back, to[1]);
      leaf.classList.add("is-backward");
    }
    // Reflow, damit die Startlage greift, dann drehen
    void leaf.offsetWidth;
    leaf.classList.add("is-turning");
    this.book.style.transform = this.shiftFor(to);

    var done = false;
    var finish = function () {
      if (done) return;
      done = true;
      leaf.removeEventListener("transitionend", finish);
      self.render();
    };
    leaf.addEventListener("transitionend", finish);
    setTimeout(finish, 900);   // Sicherheitsnetz, falls transitionend ausbleibt
    this.updateUi();
  };

  Viewer.prototype.toggleFullscreen = function () {
    var r = this.root;
    var active = document.fullscreenElement || document.webkitFullscreenElement;
    if (active) {
      (document.exitFullscreen || document.webkitExitFullscreen).call(document);
    } else {
      var req = r.requestFullscreen || r.webkitRequestFullscreen;
      if (req) {
        var p = req.call(r);
        if (p && p.catch) p.catch(function () {});
      }
      r.focus();
    }
  };

  /* --- Reiter zum Umschalten zwischen mehreren Portfolios einer Person ---- */
  function initTabs(list) {
    var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
    function select(tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute("aria-selected", on ? "true" : "false");
        t.tabIndex = on ? 0 : -1;
        var panel = document.getElementById(t.getAttribute("aria-controls"));
        if (panel) panel.hidden = !on;
      });
      if (focus) tab.focus();
    }
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { select(t, false); });
      t.addEventListener("keydown", function (e) {
        var j = null;
        if (e.key === "ArrowRight") j = (i + 1) % tabs.length;
        else if (e.key === "ArrowLeft") j = (i - 1 + tabs.length) % tabs.length;
        if (j !== null) { e.preventDefault(); select(tabs[j], true); }
      });
    });
  }

  function init() {
    var nodes = document.querySelectorAll(".pv");
    for (var i = 0; i < nodes.length; i++) new Viewer(nodes[i]);
    var lists = document.querySelectorAll(".pf-tabs");
    for (var k = 0; k < lists.length; k++) initTabs(lists[k]);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
