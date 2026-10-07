/* ========================================
   Otian AI | The add-on store
   js/store.js

   Two jobs on the browse pages (skills-marketplace/browse/ and the pages under it), both done with
   what the page already holds, so nothing is fetched and nothing is drawn here:

   * THE SHEET. Every add-on on a page has its sheet written into the page, hidden, by
     scripts/gen-marketplace.mjs. A press on an icon, a card, a face or a folder copies that sheet
     into the page's one <dialog> and opens it as a modal: the rest of the page goes inert, so focus
     stays inside it, Escape closes it, and focus goes back to what was pressed. The address carries
     the sheet's id while it is open, so a link to it opens it. Without this script the icon is a
     plain link to the hidden sheet and css/styles.css shows it on :target.

   * THE SEARCH, on the front only. Typing replaces the tiles with the matches, as icons and faces
     in one grid with matching packs first as folders, read from the sheets' own data attributes.
     Clearing it puts the tiles back. Every typed word has to appear.

   The find page links here as ?addon=kind:id, which opens that add-on's sheet.
   ======================================== */

(function () {
  "use strict";

  var dialog = document.getElementById("svSheet");
  var body = document.getElementById("svSheetBody");
  if (!dialog || !body || typeof dialog.showModal !== "function") return;

  var opener = null;
  var copies = 0;

  /* A copied drawing keeps its gradient ids, and an id found first inside a hidden sheet draws as
     nothing in some browsers, so every id in a copy gets a suffix of its own. */
  function ownIds(html) {
    copies += 1;
    return html.replace(/(\sid="|url\(#)([^")]+)/g, "$1$2-c" + copies);
  }

  function source(id) {
    if (!id || !/^(addon|pack)-[a-z0-9-]+$/.test(id)) return null;
    var el = document.getElementById(id);
    return el && el.classList.contains("sv-src") ? el : null;
  }

  function open(id, from) {
    var src = source(id);
    if (!src) return false;
    body.innerHTML = ownIds(src.innerHTML);
    var title = body.querySelector("h2");
    if (title) title.id = "svSheetTitle";
    dialog.classList.toggle("sv-sheet--pack", src.hasAttribute("data-pack"));
    opener = from || null;
    if (!dialog.open) dialog.showModal();
    body.scrollTop = 0;
    dialog.querySelector(".sv-sheet-inner").scrollTop = 0;
    try { history.replaceState(null, "", "#" + id); } catch (e) { /* the address is a nicety */ }
    return true;
  }

  function close() {
    if (dialog.open) dialog.close();
  }

  /* The close event arrives a task after the close, so a sheet opened straight after another
     (a link inside one sheet to the next) is already open by then and must not be emptied. */
  dialog.addEventListener("close", function () {
    if (dialog.open) return;
    body.innerHTML = "";
    try {
      history.replaceState(null, "", location.pathname + location.search.replace(/[?&]addon=[^&]*/, "").replace(/^&/, "?"));
    } catch (e) { /* nothing to undo */ }
    if (opener && document.contains(opener)) opener.focus();
    opener = null;
  });

  /* A press outside the sheet's own box lands on the dialog itself, which is the backdrop. */
  dialog.addEventListener("click", function (e) {
    if (e.target === dialog || e.target.closest("[data-sheet-close]")) close();
  });

  document.addEventListener("click", function (e) {
    var link = e.target.closest('a[href^="#addon-"], a[href^="#pack-"]');
    if (!link || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
    var id = link.getAttribute("href").slice(1);
    if (dialog.contains(link) && dialog.open) {
      /* A link inside a sheet to another sheet on this page swaps the sheet in place. */
      if (open(id, opener)) e.preventDefault();
      return;
    }
    if (open(id, link)) e.preventDefault();
  });

  /* ── Search, on the front ──────────────────────────────────────────────────────────────────── */

  var input = document.getElementById("svSearch");
  var browse = document.getElementById("svBrowse");
  var results = document.getElementById("svResults");
  var grid = document.getElementById("svResultsGrid");
  var count = document.getElementById("svResultsCount");
  var none = document.getElementById("svNone");
  var noneQ = document.getElementById("svNoneQ");

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function search(q) {
    var terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    var searching = terms.length > 0;
    browse.hidden = searching;
    results.hidden = !searching;
    if (!searching) { grid.innerHTML = ""; count.textContent = ""; return; }

    var all = Array.prototype.slice.call(document.querySelectorAll(".sv-src"));
    var hits = all.filter(function (el) {
      var hay = el.getAttribute("data-search") || "";
      return terms.every(function (t) { return hay.indexOf(t) !== -1; });
    });
    var packs = hits.filter(function (el) { return el.hasAttribute("data-pack"); });
    var addons = hits.filter(function (el) { return !el.hasAttribute("data-pack"); });
    addons.sort(function (a, b) {
      return (Number(b.getAttribute("data-installs")) - Number(a.getAttribute("data-installs"))) ||
        a.getAttribute("data-name").localeCompare(b.getAttribute("data-name"));
    });

    grid.innerHTML = packs.concat(addons).map(function (el) {
      var pic = el.querySelector(".sv-pic");
      return '<a class="sv-app" href="#' + el.id + '" aria-haspopup="dialog">' +
        (pic ? ownIds(pic.innerHTML) : "") +
        '<span class="sv-an">' + esc(el.getAttribute("data-name")) + "</span></a>";
    }).join("");
    none.hidden = hits.length > 0;
    grid.hidden = hits.length === 0;
    noneQ.textContent = q.trim();
    count.textContent = hits.length === 0 ? "" :
      hits.length === 1 ? "1 match" : hits.length + " matches";
  }

  if (input && browse && results && grid) {
    input.addEventListener("input", function () { search(input.value); });
    /* ?q= from elsewhere on the site lands the reader where typing it would have. */
    try {
      var q = new URLSearchParams(location.search).get("q");
      if (q) { input.value = q; search(q); }
    } catch (e) { /* no deep link */ }
  }

  /* ── Arriving with an address ──────────────────────────────────────────────────────────────── */

  try {
    var addon = new URLSearchParams(location.search).get("addon");
    if (addon && /^[a-z]+:[a-z0-9-]+$/.test(addon)) open("addon-" + addon.replace(":", "-"));
    else if (location.hash) open(location.hash.slice(1));
  } catch (e) { /* the page still works without the sheet */ }

  window.addEventListener("hashchange", function () {
    var id = location.hash.slice(1);
    if (id && !dialog.open) open(id);
  });
})();
