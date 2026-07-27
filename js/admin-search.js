// admin-search.js: type-ahead people search for the admin pages (/admin/tiers/, /admin/billing/).
//
// Both pages used to need a whole email address typed exactly right before they would tell you
// anything. attachPersonSearch(input, opts) upgrades one of those inputs so a fragment of a name
// or an address is enough, with matches appearing while you type.
//
// The matching itself happens on the billing service (GET /admin/users/search). It has to: a
// display name is only stored in Firebase Auth, which has no query API, and Firestore cannot match
// a substring. The service holds the account directory in memory and filters it there.
//
// opts:
//   api(path)   authenticated fetch helper the page already defines; must return parsed JSON
//   onPick(m)   called with the chosen match {uid, email, name, tiers, pending, ...}
//   minChars    characters before the first request fires (default 2)
//
// A literal address that matches nobody is still offered as a choice, because granting to someone
// who has not signed in yet parks the grant until they do, and that is a real thing admins do.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Injected once, on first use. These pages are noindex staff tools, so their styles stay out of
// the site stylesheet that every visitor downloads.
const STYLE_ID = "admin-search-styles";
const CSS = `
.psearch { position: relative; }
.psearch-panel {
  position: absolute; left: 0; right: 0; top: calc(100% + 4px); z-index: 40;
  background: var(--bg-card); border: 1px solid var(--border);
  border-radius: var(--radius-sm); box-shadow: var(--shadow-md);
  overflow: hidden; display: none;
}
.psearch-panel.is-open { display: block; }
.psearch-list { max-height: 280px; overflow-y: auto; }
.psearch-row {
  display: flex; align-items: center; gap: 8px; width: 100%; text-align: left;
  padding: 9px 12px; background: none; border: 0; cursor: pointer; font-family: inherit;
}
.psearch-row:hover, .psearch-row.is-active { background: var(--surface-hover); }
.psearch-main { min-width: 0; flex: 1; }
.psearch-name { font-size: 0.85rem; color: var(--text-primary); font-weight: 600; }
.psearch-email { font-size: 0.85rem; color: var(--text-secondary); }
.psearch-sub { font-size: 0.72rem; color: var(--text-muted); margin-top: 1px; }
.psearch-tiers { display: flex; gap: 4px; flex-shrink: 0; }
.psearch-note { padding: 10px 12px; font-size: 0.78rem; color: var(--text-muted); line-height: 1.5; }
.psearch-foot {
  padding: 7px 12px; font-size: 0.72rem; color: var(--text-muted);
  border-top: 1px solid var(--border);
}
`;

function ensureStyles() {
  if (document.getElementById(STYLE_ID)) return;
  const s = document.createElement("style");
  s.id = STYLE_ID;
  s.textContent = CSS;
  document.head.appendChild(s);
}

function escapeHtml(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function tierPills(m) {
  if (m.pending) return '<span class="pill pill-off">no account yet</span>';
  const tiers = m.tiers || [];
  if (!tiers.length) return '<span class="pill pill-off">none</span>';
  return tiers.map((t) => '<span class="pill pill-on">' + escapeHtml(t) + "</span>").join("");
}

export function attachPersonSearch(input, { api, onPick, minChars = 2 } = {}) {
  ensureStyles();

  // Wrap the existing input so the panel can be positioned against it, leaving the page's own
  // markup, labels and ids untouched.
  const wrap = document.createElement("div");
  wrap.className = "psearch";
  input.parentNode.insertBefore(wrap, input);
  wrap.appendChild(input);
  input.setAttribute("autocomplete", "off");
  input.setAttribute("role", "combobox");
  input.setAttribute("aria-autocomplete", "list");
  input.setAttribute("aria-expanded", "false");

  const panel = document.createElement("div");
  panel.className = "psearch-panel";
  wrap.appendChild(panel);

  let options = [];   // current matches, plus the literal-address row when there is one
  let cursor = 0;
  let open = false;
  let timer = null;
  // Responses can land out of order: a slow request for "je" arriving after a fast one for "jett"
  // would otherwise replace the better list with a staler one.
  let seq = 0;

  function setOpen(on) {
    open = on && panel.innerHTML !== "";
    panel.classList.toggle("is-open", open);
    input.setAttribute("aria-expanded", open ? "true" : "false");
  }

  function render(html) {
    panel.innerHTML = html;
    panel.querySelectorAll(".psearch-row").forEach((row, i) => {
      row.addEventListener("mouseenter", () => { cursor = i; paintCursor(); });
      row.addEventListener("click", () => pick(options[i]));
    });
    paintCursor();
  }

  function paintCursor() {
    panel.querySelectorAll(".psearch-row").forEach((row, i) => {
      row.classList.toggle("is-active", i === cursor);
    });
  }

  function rowHtml(m, isLiteral) {
    const label = m.name
      ? '<span class="psearch-name">' + escapeHtml(m.name) + '</span> <span class="psearch-email">' + escapeHtml(m.email) + "</span>"
      : '<span class="psearch-email">' + escapeHtml(m.email) + "</span>";
    const sub = isLiteral ? '<div class="psearch-sub">Use this address anyway</div>' : "";
    return (
      '<button type="button" class="psearch-row" role="option">' +
      '<span class="psearch-main">' + label + sub + "</span>" +
      '<span class="psearch-tiers">' + tierPills(m) + "</span>" +
      "</button>"
    );
  }

  function pick(m) {
    if (!m) return;
    input.value = m.email || "";
    setOpen(false);
    if (onPick) onPick(m);
  }

  async function run(term) {
    const mine = ++seq;
    let data;
    try {
      data = await api("/admin/users/search?q=" + encodeURIComponent(term));
    } catch (e) {
      if (seq !== mine) return;
      options = [];
      render('<p class="psearch-note">' + escapeHtml(e.message || "Search failed.") + "</p>");
      setOpen(true);
      return;
    }
    if (seq !== mine) return;

    const rows = data.results || [];
    const literal =
      EMAIL_RE.test(term) && !rows.some((r) => (r.email || "").toLowerCase() === term.toLowerCase())
        ? { uid: null, email: term.toLowerCase(), name: null, tiers: [], pending: true }
        : null;
    options = literal ? rows.concat([literal]) : rows;
    cursor = 0;

    if (!options.length) {
      render('<p class="psearch-note">No one matches. Type a full email address to set tiers for someone who has not signed in yet.</p>');
      setOpen(true);
      return;
    }
    let html = '<div class="psearch-list" role="listbox">' +
      options.map((m, i) => rowHtml(m, literal != null && i === options.length - 1)).join("") +
      "</div>";
    if (data.truncated) {
      html += '<p class="psearch-foot">Showing matches from the first ' +
        Number(data.scanned || 0).toLocaleString() + " accounts only.</p>";
    }
    render(html);
    setOpen(true);
  }

  input.addEventListener("input", () => {
    const term = input.value.trim();
    if (timer) clearTimeout(timer);
    if (term.length < minChars) {
      options = [];
      panel.innerHTML = "";
      setOpen(false);
      return;
    }
    timer = setTimeout(() => run(term), 220);
  });

  input.addEventListener("focus", () => { if (panel.innerHTML) setOpen(true); });
  input.addEventListener("blur", () => setTimeout(() => setOpen(false), 120));

  input.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { setOpen(false); return; }
    if (!open || !options.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      cursor = Math.min(cursor + 1, options.length - 1);
      paintCursor();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      cursor = Math.max(cursor - 1, 0);
      paintCursor();
    } else if (e.key === "Enter") {
      // Consumed here so the page's own Enter binding does not also fire and look up whatever
      // half-typed fragment is in the box.
      e.preventDefault();
      e.stopImmediatePropagation();
      pick(options[Math.min(cursor, options.length - 1)]);
    }
  });

  return {
    /** Clear the box and the panel, for use after an action that finishes with the person. */
    reset() {
      input.value = "";
      options = [];
      panel.innerHTML = "";
      setOpen(false);
    },
  };
}
