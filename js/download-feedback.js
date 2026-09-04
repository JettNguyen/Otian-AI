// download-feedback.js: the install page's download buttons, made to fit the computer in front
// of the visitor, and made to say something when clicked.
//
// Two jobs. First, on load: work out whether this is a Mac or a Windows computer, move that
// platform's card first, label it "For this computer", and turn the other card's button into
// the secondary style so the right one stands out. A phone, an iPad or a Linux computer gets
// the page as written, both cards equal. The cards start hidden by the fade-up rule until they
// scroll into view, so the reorder happens before anyone sees them.
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

  /* ── The card for this computer comes first ───────────────────────────────────────────── */
  var os = detectOs();
  var buttons = document.querySelectorAll("[data-download-note]");
  if (os) {
    Array.prototype.forEach.call(buttons, function (btn) {
      var card = btn.closest(".two-col-card");
      if (!card) return;
      if (btn.getAttribute("data-os") === os) {
        card.classList.add("is-this-computer");
        var tag = document.createElement("span");
        tag.className = "install-here";
        tag.textContent = "For this computer";
        card.prepend(tag);
        if (card.parentNode && card.parentNode.firstElementChild !== card) card.parentNode.prepend(card);
      } else {
        btn.classList.remove("btn-primary");
        btn.classList.add("btn-secondary");
      }
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

  Array.prototype.forEach.call(buttons, function (btn) {
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
