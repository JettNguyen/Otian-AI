// download-feedback.js: the install page's download buttons, made to fit the computer in front
// of the visitor, and made to say something when clicked.
//
// Two jobs. First, on load: work out whether this is a Mac or a Windows computer and show that
// platform's button alone, with the other platform folded into a "Not a Mac?" line that puts it
// back. It does this to every download block on the page, which is how the install page can carry
// Archie's downloads and Archie for Business's without either one guessing for the other. A phone,
// an iPad or a Linux computer gets the page as written, both platforms side by side. The blocks
// start hidden by the fade-up rule until they scroll into view, so the choice is made before
// anyone sees it.
//
// Second, on click: the installers live on GitHub, which serves them as attachments, so a click
// starts the download without leaving this page and nothing on the page moves. The browser does
// show it (Chrome, Edge, Firefox and Safari all put a small arrow at the top right of the
// window), but a first-time visitor does not always know to look there, and a button that
// appears to do nothing gets clicked three times. So: the button says "Download started" for a
// moment, and a note appears under it saying where this browser shows downloads, with the
// releases page as the fallback if nothing happened at all. The note is an aria-live region
// that exists in the markup from the start and is filled in here, so screen readers announce
// it instead of missing a hidden-to-shown flip.

(function () {
  var ua = navigator.userAgent || "";
  var uad = navigator.userAgentData || null;

  /* iPadOS reports itself as a Mac; the touch-point count tells them apart (same test as phone.js). */
  var isMobile =
    /iPad|iPhone|iPod|Android/.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  /* "mac", "win", or "" for anything else. Client hints first where a browser offers them
     (Chromium does), because the user-agent string is frozen there and can lie; then the string. */
  function detectOs() {
    if (isMobile) return "";
    var plat = uad && uad.platform ? String(uad.platform) : "";
    if (/^mac/i.test(plat)) return "mac";
    if (/^win/i.test(plat)) return "win";
    if (/Windows NT/.test(ua)) return "win";
    if (/Macintosh|Mac OS X/.test(ua)) return "mac";
    return "";
  }

  /* ── This computer's button ───────────────────────────────────────────────────────────── */
  /* Every block on the page, not the first one by id: the install page carries one for Archie and
     one for Archie for Business, and each folds away the platform this computer is not. Scoped to
     its own block throughout, so opening the second platform in one leaves the other as it was. */
  /* ── Which build this is ──────────────────────────────────────────────────────────────── */
  /* Read off the updater manifest each edition actually serves, so the number on the page is the
     number the app would install and no release step has to remember to edit copy. A failure is
     silent on purpose: the span stays empty, CSS hides it, and the page claims nothing. */
  Array.prototype.forEach.call(document.querySelectorAll(".install-ver[data-manifest]"), function (el) {
    fetch(el.getAttribute("data-manifest"), { cache: "no-store" })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) {
        if (!d || !d.version) return;
        var out = "Version " + d.version;
        var when = d.pub_date ? new Date(d.pub_date) : null;
        if (when && !isNaN(when)) {
          out += " \u00b7 " + when.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
        }
        el.textContent = out;
      })
      .catch(function () { /* nothing to say, so say nothing */ });
  });

  var os = detectOs();

  /* The explainer for the operating system you are actually on opens itself; the others stay
     folded. Marked in the markup with data-open-os, so nothing here knows which page it is on. */
  if (os) {
    Array.prototype.forEach.call(document.querySelectorAll("details[data-open-os]"), function (d) {
      if (d.getAttribute("data-open-os") === os) d.open = true;
    });
  }

  if (os) {
    Array.prototype.forEach.call(document.querySelectorAll(".install-actions"), function (actions) {
      actions.classList.add("is-" + os);
      var other = actions.querySelector(".install-other");
      if (!other) return;
      other.hidden = false;
      other.addEventListener("click", function (e) {
        if (!e.target.closest(".install-other-btn")) return;
        actions.classList.add("show-both");
        /* The first button in that block is not always the one on screen: each platform now
           carries both editions and the radio above decides which is drawn, so focus the one
           that is actually laid out rather than the one that is first in the markup. */
        var opened = actions.querySelectorAll('.install-platform[data-os="' + e.target.getAttribute("data-show") + '"] .btn');
        for (var i = 0; i < opened.length; i++) {
          if (opened[i].offsetParent !== null) { opened[i].focus(); break; }
        }
      });
    });
  }

  /* ── What the click says ──────────────────────────────────────────────────────────────── */

  /* Order matters: Edge and Opera carry "Chrome" in their string, and everything on iOS carries
     "Safari". Only name a browser when the string is unambiguous; otherwise say "your browser". */
  function browserHint() {
    if (isMobile) {
      return "Archie is a desktop app, so open this page on your Mac or Windows computer to install it.";
    }
    if (/Edg\//.test(ua)) return "Edge shows it as a small arrow at the top right of the window.";
    if (/OPR\//.test(ua)) return "Opera shows it as a small arrow at the top right of the window.";
    if (/Firefox\//.test(ua)) return "Firefox shows it as a small arrow at the top right of the window.";
    if (/Chrome\//.test(ua)) return "Chrome shows it as a small arrow at the top right of the window.";
    if (/Safari\//.test(ua)) return "Safari shows it as a small arrow at the top right of the window, and the file lands in your Downloads folder.";
    return "Your browser shows it in its downloads list, usually at the top right of the window.";
  }

  var RELEASES = "https://github.com/JettNguyen/archie-releases/releases/latest";

  function fillNote(note) {
    note.textContent = "";
    var lead = document.createElement("strong");
    lead.textContent = "Your download has started.";
    var hint = document.createTextNode(" " + browserHint() + " If nothing happened, ");
    var link = document.createElement("a");
    link.href = RELEASES;
    link.textContent = "get it from the releases page";
    var tail = document.createTextNode(".");
    note.append(lead, hint, link, tail);
  }

  Array.prototype.forEach.call(document.querySelectorAll("[data-download-note]"), function (btn) {
    var note = document.getElementById(btn.getAttribute("data-download-note"));
    /* The label sits in a span beside the platform mark, so swapping it leaves the mark alone. */
    var labelEl = btn.querySelector("span") || btn;
    var label = labelEl.textContent;
    var timer = null;
    btn.addEventListener("click", function () {
      if (note) fillNote(note);
      labelEl.textContent = "Download started";
      btn.classList.add("is-started");
      if (timer) clearTimeout(timer);
      timer = setTimeout(function () {
        labelEl.textContent = label;
        btn.classList.remove("is-started");
        timer = null;
      }, 3000);
    });
  });
})();
