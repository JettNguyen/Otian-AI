// account-nav.js: powers the account avatar + dropdown in the site nav on every page.
//
// It reflects Firebase auth state (shared with the Archie desktop app, project archie-77170):
//   • signed out → "Log in" / "Sign up"   (links to /login/)
//   • signed in  → account email, "Manage account" (/account/), "Sign out"
//
// Loaded as a module on every page. It shares the default Firebase app with the login/account
// pages via getApps()/getApp(), so initialising here never collides with their own init.

import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, doc, getDoc, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyA46RqJV4tcJD8h4mdcSZ26dDoikA9L64M",
  authDomain: "archie-77170.firebaseapp.com",
  projectId: "archie-77170",
  storageBucket: "archie-77170.firebasestorage.app",
  messagingSenderId: "516396797258",
  appId: "1:516396797258:web:362cf2815128f3c82345b3",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/** A phone or tablet, which is the only place "Archie on your phone" is worth offering.
 *
 *  On a laptop the page has nothing to give: the whole Archie app is already on that screen, so the
 *  link would lead somewhere that exists only to say "go and use your computer". Kept off the menu
 *  rather than shown-and-explained.
 *
 *  The iPadOS arm matters: modern iPads report themselves as "MacIntel" and would otherwise be
 *  treated as a desktop. Same test as `js/phone.js`; keep the two in step. */
const IS_MOBILE =
  /iPad|iPhone|iPod|Android/.test(navigator.userAgent || "") ||
  (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

const root = document.getElementById("navAccount");
if (root) {
  const btn = document.getElementById("navAccountBtn");
  const menu = document.getElementById("navAccountMenu");
  const avatar = document.getElementById("navAccountAvatar");

  const USER_GLYPH =
    '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 20.5c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5"/></svg>';

  const escapeHtml = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // Mark the dropdown item for the page you're currently on.
  const CURRENT_PATH = (location.pathname || "/").replace(/\/+$/, "") || "/";
  const activeAttr = (href) => {
    const p = href.split("?")[0].replace(/\/+$/, "") || "/";
    return p === CURRENT_PATH ? ' class="active"' : "";
  };

  function openMenu() { root.classList.add("open"); btn.setAttribute("aria-expanded", "true"); }
  function closeMenu() { root.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); }

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    root.classList.contains("open") ? closeMenu() : openMenu();
  });
  document.addEventListener("click", (e) => { if (!root.contains(e.target)) closeMenu(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });

  function renderSignedOut() {
    btn.classList.remove("is-authed", "has-due");
    btn.setAttribute("aria-label", "Account: sign in");
    avatar.textContent = "";
    avatar.innerHTML = USER_GLYPH;
    menu.innerHTML =
      '<a role="menuitem" href="/login/"' + activeAttr("/login/") + ">Log in</a>" +
      '<a role="menuitem" href="/login/?mode=signup">Sign up</a>';
  }

  // Outstanding-balance + admin check for the signed-in menu. One user-doc read and one
  // owed-sessions query, cached in sessionStorage for 5 minutes so every page load doesn't
  // re-query, except on billing pages and right after a payment, where staleness would show.
  const BILL_CACHE_KEY = "otian_nav_billing";
  function fmtMoney(cents) {
    const n = Number(cents || 0) / 100;
    return "$" + (n % 1 === 0 ? n.toFixed(0) : n.toFixed(2));
  }
  async function billingStatus(user) {
    const fresh =
      /(^|[?&])paid=/.test(location.search) ||
      location.pathname.startsWith("/billing") ||
      location.pathname.startsWith("/admin/");
    try {
      if (!fresh) {
        const c = JSON.parse(sessionStorage.getItem(BILL_CACHE_KEY) || "null");
        if (c && c.uid === user.uid && Date.now() - c.ts < 5 * 60 * 1000) return c;
      }
    } catch (e) {}
    let owedCents = 0, isAdmin = false;
    try {
      const [userSnap, owedSnap] = await Promise.all([
        getDoc(doc(db, "users", user.uid)),
        getDocs(query(collection(db, "users", user.uid, "sessions"), where("status", "==", "owed"))),
      ]);
      // A user holds a SET of tiers (access_tiers); the single access_tier string is the legacy
      // shape kept for docs written before the array existed. Read the array first and fall back,
      // the same order firestore.rules (acctTiers) and the app (archie-core::auth) use. Reading
      // only the legacy string would hide every admin link the moment a doc goes array-only.
      const acct = userSnap.exists() ? userSnap.data() || {} : {};
      const tiers = acct.access_tiers || (acct.access_tier && acct.access_tier !== "none" ? [acct.access_tier] : []);
      isAdmin = tiers.includes("admin");
      owedSnap.forEach((d) => { owedCents += Number((d.data() || {}).amount_cents) || 0; });
    } catch (e) { /* signed-in UX only; fail quiet, badge just doesn't show */ }
    const out = { uid: user.uid, owedCents, isAdmin, ts: Date.now() };
    try { sessionStorage.setItem(BILL_CACHE_KEY, JSON.stringify(out)); } catch (e) {}
    return out;
  }

  function renderSignedIn(user) {
    const name = (user.displayName || "").trim();
    const email = (user.email || "").trim();
    btn.classList.add("is-authed");
    btn.setAttribute("aria-label", "Account menu" + (name || email ? ": " + (name || email) : ""));
    avatar.innerHTML = "";
    // Initial from the name if we have it, else the email.
    avatar.textContent = ((name || email)[0] || "U").toUpperCase();
    const label = name
      ? escapeHtml(name) + (email ? '<br><span class="nav-account-sub">' + escapeHtml(email) + "</span>" : "")
      : escapeHtml(email || "Signed in");
    menu.innerHTML =
      '<div class="nav-account-menu-label">' + label + "</div>" +
      '<a role="menuitem" href="/account/"' + activeAttr("/account/") + ">Manage account</a>" +
      // "Archie on your phone", on the phones it is for. The site's nav markup is duplicated in
      // every page (twice: desktop and drawer), so nav changes normally have to be scripted across
      // all of them. This menu is the exception, because it is built here in JS.
      (IS_MOBILE
        ? '<a role="menuitem" href="/phone/"' + activeAttr("/phone/") + ">Archie on your phone</a>"
        : "") +
      '<a role="menuitem" href="/activity/"' + activeAttr("/activity/") + ">Account activity</a>" +
      '<a role="menuitem" href="/billing/"' + activeAttr("/billing/") + ' id="navAccountBilling">Billing</a>' +
      '<div class="nav-account-divider"></div>' +
      '<button role="menuitem" type="button" id="navAccountSignout">Sign out</button>';
    const out = document.getElementById("navAccountSignout");
    out.addEventListener("click", async () => {
      closeMenu();
      try { sessionStorage.removeItem("otian_2fa_ok"); } catch (e) {} // clear this session's 2FA clearance
      try { sessionStorage.removeItem(BILL_CACHE_KEY); } catch (e) {}
      try { await signOut(auth); } catch (e) { /* ignore */ }
      // If we're on a signed-in-only page, get out of it.
      if (location.pathname.replace(/\/+$/, "").endsWith("/account")) location.href = "/login/";
    });

    billingStatus(user).then((s) => {
      // The user may have signed out (or switched) while we were querying.
      if (!auth.currentUser || auth.currentUser.uid !== s.uid) return;
      const billingItem = document.getElementById("navAccountBilling");
      if (s.owedCents > 0) {
        btn.classList.add("has-due");
        if (billingItem) billingItem.innerHTML = 'Billing <span class="nav-account-due">' + fmtMoney(s.owedCents) + " due</span>";
      } else {
        btn.classList.remove("has-due");
      }
      if (s.isAdmin && billingItem) {
        billingItem.insertAdjacentHTML(
          "afterend",
          '<a role="menuitem" href="/admin/billing/"' + activeAttr("/admin/billing/") + ">Invoice a client</a>" +
          '<a role="menuitem" href="/admin/tiers/"' + activeAttr("/admin/tiers/") + ">Manage tiers</a>" +
          '<a role="menuitem" href="/admin/ops/"' + activeAttr("/admin/ops/") + ">Ops console</a>"
        );
      }
    });
  }

  renderSignedOut(); // sensible default until auth resolves
  onAuthStateChanged(auth, (user) => { user ? renderSignedIn(user) : renderSignedOut(); });
}
