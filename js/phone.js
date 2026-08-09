/* ========================================
   Otian AI | Archie on your phone
   js/phone.js

   Manages the Archie running on someone's computer, from their phone.

   The agent lives on one machine: its database, its keys, its running gateway. This page never
   touches any of that directly. It writes a command into a Firestore mailbox, the desktop app picks
   it up (src-tauri/src/phone.rs), runs it through the same command layer its own buttons use, and
   writes the answer back.

   EVERYTHING IN THE MAILBOX IS ENCRYPTED, and the key is not ours. The desktop mints it and hands
   it to this phone by QR scan, in the URL fragment after the '#', which browsers never send to a
   server. So the key exists in the Keychain on that computer and in localStorage here, and nowhere
   else. Firestore holds ciphertext.

   That is load-bearing rather than decorative. TRUST.md commits us to holding three things about a
   person: their email, whether they own Archie, and which paid add-ons they bought. A readable
   mirror of somebody's installed skills and the answers they typed into them would quietly make
   that false. Sealing the payload is what lets this feature exist without changing the sentence.

   Two consequences worth remembering when editing:
     - Never move the key out of the fragment. A query parameter is sent to the server, logged by
       every hop, and the claim above becomes false the moment it happens.
     - Never add a field to a command or a snapshot outside the sealed payload. Only `status`,
       `updated_at` and `app_version` are meant to be readable, each because a rule or a query
       needs them without a key.
   ======================================== */

import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getFirestore, doc, getDoc, setDoc, deleteDoc,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { bindStatusToast } from "./status-toast.js";
import { COLLECTIONS, loadCatalog, shelfKind } from "./catalog.js";

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

const $ = (id) => document.getElementById(id);
const show = (id, on) => $(id).classList.toggle("acct-hidden", !on);
const setStatus = bindStatusToast($("ph-status-toast"));

const escapeHtml = (s) =>
  String(s == null ? "" : s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/* ── Where the key is kept ──────────────────────────────────────────────────────────────────
   localStorage, not sessionStorage: a home-screen app that forgot its pairing every time it was
   swiped away would send people back to their computer weekly, which is the exact trip this
   feature exists to save. Keyed by nothing else, because one phone pairs with one computer. */
const KEY_STORE = "otian_phone_key";

/** The key for this page load, held in memory.
 *
 *  This variable is the fix for a bug that made re-scanning useless. The key used to be read from
 *  the URL in one place, which stripped the fragment, and read back in another, which relied
 *  entirely on localStorage having accepted the write in between. When that write failed (Private
 *  Browsing, storage pressure, Safari refusing the first write after a data clear) the failure was
 *  swallowed, the fragment was already gone, and the key was destroyed. Scanning again did exactly
 *  the same thing, forever, with the page insisting the phone was unpaired.
 *
 *  So the value is captured once, synchronously, before anything async can run, and memory is the
 *  first place it is looked for afterwards. */
let keyInMemory = null;

/** True when the key was captured but nowhere would persist it. Survives this page load only, so
 *  the page can say so rather than mysteriously forgetting after the next navigation. */
let keyIsEphemeral = false;

function storedKey() {
  // Memory first: it is the only carrier that cannot fail, and after a scan it always holds the
  // freshest value.
  if (keyInMemory) return keyInMemory;
  try {
    const v = localStorage.getItem(KEY_STORE);
    if (v) return v;
  } catch (e) { /* fall through to the session copy */ }
  // Second carrier. localStorage is the one that should survive, but a sign-in round trip through
  // /login/ is a same-session navigation, so this is enough to get the key back afterwards even
  // when the durable write was refused.
  try { return sessionStorage.getItem(KEY_STORE); } catch (e) { return null; }
}

/** Take the key out of the address bar, remember it, and try to persist it.
 *
 *  Called once, at module load. The fragment is stripped only after the value is safely in memory:
 *  it never reached a server, but it does sit in the tab's history and in whatever the next
 *  screenshot catches, and neither is a good home for a key.
 *
 *  Storage failures are recorded rather than swallowed, because "your phone cannot remember this"
 *  is something the person has to be told; silently forgetting is what made this unfixable from
 *  the outside. */
function claimKeyFromUrl() {
  const hash = location.hash || "";
  const match = hash.match(/[#&]k=([A-Za-z0-9_-]+)/);
  if (!match) return null;

  keyInMemory = match[1];
  let persisted = false;
  try { localStorage.setItem(KEY_STORE, keyInMemory); persisted = true; } catch (e) { /* try session */ }
  try { sessionStorage.setItem(KEY_STORE, keyInMemory); persisted = true; } catch (e) { /* neither */ }
  keyIsEphemeral = !persisted;

  history.replaceState(null, "", location.pathname + location.search);
  return keyInMemory;
}

// Run it now, at module load, before any auth callback or redirect can consume the fragment.
claimKeyFromUrl();

/* ── The seal ───────────────────────────────────────────────────────────────────────────────
   AES-256-GCM through WebCrypto, matching crates/archie-core/src/phone.rs byte for byte: a fresh
   96-bit nonce per message, stored beside the ciphertext, both base64. GCM authenticates as it
   decrypts, so a payload altered in Firestore fails to open rather than opening into something
   else. Change nothing here without changing that file in the same commit. */

const b64ToBytes = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
const bytesToB64 = (b) => btoa(String.fromCharCode(...new Uint8Array(b)));

/** base64url (no padding), the alphabet the pairing key travels in so it survives a URL fragment. */
function b64urlToBytes(s) {
  const padded = s.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((s.length + 3) % 4);
  return b64ToBytes(padded);
}

let cryptoKey = null;
async function importKey(b64url) {
  const raw = b64urlToBytes(b64url);
  if (raw.length !== 32) throw new Error("bad key length");
  return crypto.subtle.importKey("raw", raw, "AES-GCM", false, ["encrypt", "decrypt"]);
}

async function seal(value) {
  const nonce = crypto.getRandomValues(new Uint8Array(12));
  const data = new TextEncoder().encode(JSON.stringify(value));
  const cipher = await crypto.subtle.encrypt({ name: "AES-GCM", iv: nonce }, cryptoKey, data);
  return { v: 1, n: bytesToB64(nonce), c: bytesToB64(cipher) };
}

async function open(envelope) {
  if (!envelope || envelope.v !== 1) throw new Error("unknown message format");
  const plain = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: b64ToBytes(envelope.n) },
    cryptoKey,
    b64ToBytes(envelope.c),
  );
  return JSON.parse(new TextDecoder().decode(plain));
}

/* ── Which device is this, and how does it get installed ────────────────────────────────────
   The whole point of this branch is that instructions must fit the device in front of the person.
   Telling a laptop to use the Share sheet, or telling Chrome-on-iOS to Add to Home Screen (a menu
   item that does not exist there), is the kind of dead end the writing rules forbid. */

const ua = navigator.userAgent || "";

/** Already added to a home screen, so there is nothing left to prompt about. */
const isStandalone =
  (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) ||
  navigator.standalone === true;

/** iPadOS reports itself as "MacIntel" and would otherwise be handed the desktop branch, which is
 *  the one device where that guess is both wrong and invisible in testing on a Mac. The touch-point
 *  count is what separates a real Mac from an iPad pretending to be one. */
const isIos =
  /iPad|iPhone|iPod/.test(ua) ||
  (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

const isAndroid = /Android/.test(ua);

/** On iOS, Add to Home Screen exists only in Safari. Chrome, Firefox and Edge there are all Safari
 *  underneath but ship no such menu item, so sending someone to look for one wastes their time. */
const isIosSafari = isIos && !/CriOS|FxiOS|EdgiOS/.test(ua);

const isMobile = isIos || isAndroid;

/** Chrome fires this when a page is installable; we stash it and drive a real Install button from
 *  it. It never fires on iOS, which is why that platform gets written steps instead. */
let androidInstallEvent = null;
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  androidInstallEvent = e;
  renderInstallPrompt();
});

const SHARE_ICON =
  '<svg class="phone-share-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ' +
  'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
  '<path d="M12 15V3"/><path d="m8 7 4-4 4 4"/>' +
  '<path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7"/></svg>';

function renderInstallPrompt() {
  const el = $("ph-install");
  if (!el) return;

  // Nothing to say: it is already installed, or this is a desktop, which never sees this panel.
  if (isStandalone || !isMobile) { el.classList.add("acct-hidden"); return; }

  let html = "";
  if (isIosSafari) {
    html =
      '<div class="phone-install-title">Keep this on your home screen</div>' +
      '<p class="phone-install-body">Then it opens like an app, without Safari around it.</p>' +
      '<ol class="phone-steps phone-steps-tight">' +
      "<li>Tap the <span class=\"phone-nowrap\">Share button " + SHARE_ICON + "</span> in Safari&rsquo;s " +
      "toolbar. It sits at the bottom, or the top if you moved it there.</li>" +
      "<li>Scroll down and tap <strong>Add to Home Screen</strong>. On some phones it is under " +
      "<strong>More</strong> first.</li>" +
      "<li>Tap <strong>Add</strong> in the top corner.</li>" +
      "<li>Open the new Archie icon and sign in.</li>" +
      "<li>In Archie, tap <strong>Copy the link</strong>, then <strong>Paste from clipboard</strong> " +
      "in the app.</li>" +
      "</ol>" +
      // Said before they install rather than discovered afterwards. iPhone gives an installed web
      // app its own storage, so the new icon starts out signed out and unpaired even though this
      // tab is both, and scanning cannot fix it because a QR always opens Safari.
      '<p class="phone-install-body" style="margin-top:10px;">To iPhone, the home screen version is ' +
      "a separate app, with its own sign-in and its own pairing, so the last two steps are not " +
      "optional. Doing this before you pair here saves pairing twice.</p>";
  } else if (isIos) {
    // The honest dead-end fix: name the limitation and give the one step out of it.
    html =
      '<div class="phone-install-title">Open this in Safari to keep it</div>' +
      '<p class="phone-install-body">This browser on iPhone and iPad cannot add pages to the home ' +
      "screen. Safari can. Copy the link, open Safari, and paste it there.</p>" +
      '<button class="btn btn-secondary btn-mini" id="ph-copy-link">Copy the link</button>';
  } else if (isAndroid && androidInstallEvent) {
    html =
      '<div class="phone-install-title">Keep this on your home screen</div>' +
      '<p class="phone-install-body">Then it opens like an app, and you stay signed in.</p>' +
      '<button class="btn btn-primary btn-mini" id="ph-install-btn">Install</button>';
  } else if (isAndroid) {
    html =
      '<div class="phone-install-title">Keep this on your home screen</div>' +
      '<ol class="phone-steps phone-steps-tight">' +
      "<li>Tap the menu button (three dots) in your browser.</li>" +
      "<li>Tap <strong>Install app</strong>, or <strong>Add to Home screen</strong>.</li>" +
      "</ol>";
  }

  el.innerHTML = html;
  el.classList.toggle("acct-hidden", !html);

  const install = $("ph-install-btn");
  if (install) {
    install.addEventListener("click", async () => {
      if (!androidInstallEvent) return;
      androidInstallEvent.prompt();
      await androidInstallEvent.userChoice;
      androidInstallEvent = null;
      renderInstallPrompt();
    });
  }
  const copy = $("ph-copy-link");
  if (copy) {
    copy.addEventListener("click", () => {
      navigator.clipboard.writeText(location.origin + location.pathname)
        .then(() => setStatus("Link copied. Open Safari and paste it.", "ok"))
        .catch(() => setStatus("Copy the address from the bar above, then open Safari.", ""));
    });
  }
}

/* ── Talking to the computer ────────────────────────────────────────────────────────────────── */

let uid = null;
/** The account this browser is signed in as. Named on screen whenever the mailbox is empty,
 *  because "signed in as the wrong person" and "phone access is off" are indistinguishable from
 *  here and only one of them is fixed on the computer. */
let signedInAs = "";

/** Read and open the snapshot the desktop publishes.
 *
 *  Returns `{ state, updatedAt, appVersion }`, or null when there is nothing there: either phone
 *  access was turned off on the computer, or it has never been on. Those are the same thing from
 *  here, and the caller says so. */
async function readSnapshot() {
  const snap = await getDoc(doc(db, "users", uid, "phone", "state"));
  if (!snap.exists()) return null;
  const data = snap.data() || {};
  return {
    state: await open(data.payload),
    updatedAt: data.updated_at && data.updated_at.toDate ? data.updated_at.toDate() : null,
    appVersion: data.app_version || "",
  };
}

/** How long before a command is treated as unanswered.
 *
 *  The desktop polls for commands every 3 seconds while it is being used, 15 seconds shortly after,
 *  and 2 minutes once it has been quiet for ten. So a first tap after a quiet morning genuinely can
 *  take a couple of minutes, and this has to clear that with room to spare or the page calls a
 *  working computer dead.
 *
 *  **It used to be 75 seconds, sized against a 30-second idle poll.** That poll slowed to 2 minutes
 *  when the desktop's cost was cut (one poll is one database read whether or not anything is
 *  waiting, and the old cadence charged for 2,880 a day to say "nothing happened"), which left this
 *  page timing out before the computer had even looked. If the desktop's idle cadence changes
 *  again, this number moves with it: `POLL_IDLE` in `src-tauri/src/phone.rs` in the Archie repo. */
const COMMAND_TIMEOUT_MS = 165_000;

/** Send one command and wait for the answer.
 *
 *  The result is polled rather than listened for. A live listener would be tidier, but this page is
 *  open in short bursts on a phone, and a one-second poll for at most a minute costs less than
 *  holding a stream open for the whole visit. */
async function sendCommand(op, args) {
  const id = crypto.randomUUID();
  const ref = doc(db, "users", uid, "phone_commands", id);
  await setDoc(ref, {
    created_at: new Date(),
    status: "pending",
    payload: await seal({ op, args: args || {} }),
  });

  const deadline = Date.now() + COMMAND_TIMEOUT_MS;
  while (Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, 1000));
    const snap = await getDoc(ref);
    const data = snap.exists() ? snap.data() : null;
    if (data && data.status !== "pending") {
      // Read it, then bin it. Both ends sweep, but the one that read the answer is the one that
      // knows it is finished with.
      let answer = { ok: data.status === "done", message: "" };
      try { answer = await open(data.result); } catch (e) { /* keep the status-derived fallback */ }
      deleteDoc(ref).catch(() => {});
      return answer;
    }
  }
  deleteDoc(ref).catch(() => {});
  return {
    ok: false,
    message:
      "Your computer did not answer. It is probably asleep or Archie is closed. This will work as " +
      "soon as it is awake again.",
  };
}

/** Run a command with the button showing its own progress, then reload what changed. */
/** How many commands are waiting on the computer right now.
 *
 *  The background poll redraws the lists, which replaces the very button `act` is holding. Without
 *  this, a poll landing mid-install swaps the disabled "Adding…" button for a fresh "Add" one while
 *  the install is still running, and the obvious next move is to tap it again. */
let commandsInFlight = 0;

async function act(button, label, op, args) {
  const original = button.textContent;
  button.disabled = true;
  button.textContent = label;
  commandsInFlight++;
  try {
    const answer = await sendCommand(op, args);
    setStatus(answer.message || (answer.ok ? "Done." : "That did not work."), answer.ok ? "ok" : "error");
    if (answer.ok) await refresh();
  } catch (e) {
    setStatus("Something went wrong sending that. Try again.", "error");
  } finally {
    commandsInFlight--;
    button.disabled = false;
    button.textContent = original;
  }
}

/* ── Drawing it ─────────────────────────────────────────────────────────────────────────────── */

function ago(date) {
  if (!date) return "just now";
  const secs = Math.max(0, Math.round((Date.now() - date.getTime()) / 1000));
  if (secs < 90) return "just now";
  const mins = Math.round(secs / 60);
  if (mins < 60) return mins + (mins === 1 ? " minute ago" : " minutes ago");
  const hours = Math.round(mins / 60);
  if (hours < 24) return hours + (hours === 1 ? " hour ago" : " hours ago");
  const days = Math.round(hours / 24);
  return days + (days === 1 ? " day ago" : " days ago");
}

/** Anything past this and the computer is treated as gone rather than quiet.
 *
 *  The desktop wants to heartbeat once a minute even when nothing changes, but the heartbeat rides
 *  the same loop as the command poll, so it can only be as punctual as that loop's slowest tick:
 *  2 minutes, once the computer has been quiet for ten. Three minutes left barely one tick of
 *  margin, and a single slow publish would have painted a live computer "Asleep", which is the one
 *  thing on this page nobody would think to doubt.
 *
 *  Five minutes is two full ticks of margin. It costs a longer wait before a genuinely closed
 *  laptop is called closed, and that is the right side to be wrong on: the page says what to do
 *  either way, and "Asleep" about a running computer sends somebody to go and check on it. */
const STALE_MS = 5 * 60 * 1000;

function renderStatus(snapshot) {
  const awake = snapshot.updatedAt && Date.now() - snapshot.updatedAt.getTime() < STALE_MS;
  const where = (snapshot.state && snapshot.state.device_label) || "your computer";
  const running = (snapshot.state.agents || []).filter((a) => a.running).length;

  $("ph-status-pill").textContent = awake ? "Awake" : "Asleep";
  $("ph-status-pill").className = "pill " + (awake ? "pill-on" : "pill-off");

  if (awake) {
    $("ph-status-title").textContent =
      running > 0
        ? "Archie is running on " + where
        : "Archie is open on " + where;
    $("ph-status-detail").textContent =
      (running > 0
        ? running === 1 ? "1 agent is answering." : running + " agents are answering."
        : "No agent is started right now.") +
      " Last heard from " + ago(snapshot.updatedAt) + ".";
    show("ph-status-help", false);
  } else {
    // Never a dead indicator with no next step. This is the single most likely thing a person will
    // see on this page, so it has to say what to do about it.
    $("ph-status-title").textContent = "Cannot reach " + where;
    $("ph-status-detail").textContent = "Last heard from " + ago(snapshot.updatedAt) + ".";
    $("ph-status-help").textContent =
      "Your agent runs on your own computer, so it needs that computer awake with Archie open. " +
      "Anything you change here will be waiting for it when it wakes up.";
    show("ph-status-help", true);
  }
}

/** What an add-on is still waiting on, as far as the snapshot alone can tell.
 *
 *  Deliberately partial, and honest about it: a skill's questions live in the marketplace catalog,
 *  which this screen does not load yet, so unanswered questions are not counted here. What it does
 *  catch needs nothing but the snapshot, and never guesses: an integration id absent from the
 *  agent's `connected` list is genuinely not connected. */
function skillWaitingOn(agent, skill) {
  const connected = agent.connected || [];
  // These two need no account, no key, and no sign-up, so naming them as a gap would send someone
  // hunting for a connection screen that does not exist. Mirrors BUILT_IN_CAPABILITIES in
  // src/app/readiness.ts in the Archie repo.
  const builtIn = ["flights", "video"];
  const missing = (skill.required_integrations || [])
    .filter((id) => builtIn.indexOf(id) === -1)
    .filter((id) => connected.indexOf(id) === -1);
  return missing;
}

/* ── Where you actually talk to your agent ──────────────────────────────────────────────────
   This page manages an agent. It is not where you chat with one, and the most useful thing it can
   do about that is say so and point at the app that is.

   Not an accident of scope: a conversation here would be genuinely bad. Commands reach the computer
   through a polled mailbox (3 seconds while it is being used, 15 shortly after, 2 minutes once it
   has gone idle), so every
   turn would cost a write, a poll to notice it, the model's own thinking time, and another poll for
   the reply. Meanwhile the agent already answers in a chat app that is on this phone, with push
   notifications and a real conversation view. Sending people there is the better product, not a
   consolation.

   Only some platforms can be opened by handle alone. Telegram and Matrix have an address for a
   conversation; Discord and Slack need workspace and channel ids we do not have here, and Signal
   has no handle at all (the agent's conversation is its own Note to Self). Where there is no link
   we name the app and stop, rather than shipping a button that lands somewhere useless. */
const CHANNELS = {
  telegram: {
    label: "Telegram",
    link: (handle) => "https://t.me/" + String(handle).replace(/^@/, ""),
  },
  matrix: {
    label: "Matrix",
    // matrix.to carries the identifier readable in the fragment: https://matrix.to/#/@juno:server.
    // encodeURIComponent would turn that into %40juno%3Aserver, which clients do not resolve. Only
    // the two characters that would genuinely break a fragment are escaped, and '#' matters because
    // a room alias starts with one.
    link: (handle) => "https://matrix.to/#/" + String(handle).replace(/%/g, "%25").replace(/#/g, "%23"),
  },
  discord: { label: "Discord", link: () => null },
  slack: { label: "Slack", link: () => null },
  signal: {
    label: "Signal",
    link: () => null,
    // Signal's model is the agent messaging its own Note to Self, so there is no handle to search
    // for and no conversation to link to. Naming the place is the only useful thing to say.
    where: "in your agent's Note to Self",
  },
};

function renderChatCard(agent) {
  const channel = CHANNELS[agent.channel];

  // No channel connected at all. Say what is missing and where it gets fixed, rather than leaving
  // an empty space where the answer to "so where do I talk to it?" should be.
  if (!channel) {
    return (
      '<div class="phone-chat">' +
      '<div class="phone-chat-title">This is not where you chat with your agent</div>' +
      '<p class="phone-chat-body">Your agent answers in a chat app, and this one has none ' +
      "connected yet. Open Archie on your computer to connect one, and it will answer you here on " +
      "your phone from then on.</p>" +
      "</div>"
    );
  }

  const href = agent.channel_handle ? channel.link(agent.channel_handle) : null;
  // Each channel carries its own preposition, because they do not share one: you talk to an agent
  // "on Telegram" but "in your agent's Note to Self".
  const where = channel.where || "on " + channel.label;

  return (
    '<div class="phone-chat">' +
    '<div class="phone-chat-title">This is not where you chat with your agent</div>' +
    '<p class="phone-chat-body">Talk to ' + escapeHtml(agent.name) + " " + escapeHtml(where) +
    ". This page is for changing what it can do." +
    (agent.channel_handle && !href
      ? " It answers to " + escapeHtml(agent.channel_handle) + " there."
      : "") +
    "</p>" +
    (href
      ? '<a class="btn btn-primary btn-mini" href="' + escapeHtml(href) + '" target="_blank" ' +
        'rel="noopener">Open ' + escapeHtml(channel.label) + "</a>"
      : "") +
    "</div>"
  );
}

// The two mail slugs are named after Google and are served by Outlook too; the slug cannot change
// (it is in every published add-on) so the label carries the correction. See the same map in the
// Archie repo's src/app/readiness.ts.
const INTEGRATION_LABELS = {
  google_calendar: "Google or Outlook calendar",
  gmail: "Gmail or Outlook",
  google_tasks: "Google Tasks",
  fireflies: "Fireflies",
  todoist: "Todoist",
  gohighlevel: "GoHighLevel",
};
const integrationLabel = (id) => INTEGRATION_LABELS[id] || id;

function renderAgents(snapshot) {
  const host = $("ph-agents");
  const agents = (snapshot.state && snapshot.state.agents) || [];

  if (agents.length === 0) {
    host.innerHTML =
      '<div class="acct-section"><div class="acct-section-title">No agents yet</div>' +
      '<div class="acct-section-body">Create one in Archie on your computer, and it will show up ' +
      "here.</div></div>";
    return;
  }

  // The journal arrives beside `agents` rather than inside each one, so the computer can compare
  // the two halves separately and throttle a running job's churn without delaying anything else.
  // Absent from an older Archie, and from one with the journal switched off: both read as no
  // journal, which is what an empty block already renders as.
  const journal = (snapshot.state && snapshot.state.journal) || {};
  host.innerHTML = agents.map((a) => renderAgent(a, journal[a.id])).join("");

  // Wire the buttons after the markup exists. Delegation would avoid this, but there are only a
  // handful of controls per agent and direct handlers keep each one's arguments obvious.
  host.querySelectorAll("[data-routine]").forEach((btn) => {
    btn.addEventListener("click", () =>
      act(btn, btn.dataset.enable === "1" ? "Resuming…" : "Pausing…", "routine_enabled", {
        workspace_id: btn.dataset.ws,
        agent_id: btn.dataset.agent,
        slug: btn.dataset.routine,
        enabled: btn.dataset.enable === "1",
      }));
  });
  host.querySelectorAll("[data-agent-run]").forEach((btn) => {
    btn.addEventListener("click", () =>
      act(btn, btn.dataset.agentRun === "start" ? "Starting…" : "Stopping…",
        btn.dataset.agentRun === "start" ? "agent_start" : "agent_stop",
        { workspace_id: btn.dataset.ws, agent_id: btn.dataset.agent }));
  });
}

/* An agent has no photo on this screen, so it wears the same line-art face Archie falls back to,
   set in a circle tinted by a stable colour picked from its id, so a list of agents reads as a set
   of distinct faces the way it does in the app. */
const AGENT_GLYPH =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" aria-hidden="true">' +
  '<circle cx="12" cy="8.5" r="3.5"/>' +
  '<path d="M5.5 19c1.3-2.3 3.6-3.5 6.5-3.5s5.2 1.2 6.5 3.5" stroke-linecap="round"/></svg>';
const AVATAR_HUES = ["accent", "teal", "blue", "plum", "gold"];
function avatarHue(seed) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return AVATAR_HUES[h % AVATAR_HUES.length];
}

/* ── The journal ────────────────────────────────────────────────────────────────────────────
   What the agent has been DOING, as against what it has. The computer keeps the whole history and
   every screenshot; what reaches here is the part that fits inside a sealed 100 KB document, which
   is the sentences. See docs/JOURNAL-ON-PHONE.md in the Archie repo.

   Two states get their own treatment rather than sitting in the list. A job that stopped to ask
   something joins the existing "Waiting on you" block, because that block already IS the list of
   things waiting on you and a second one would split the concept. A running job keeps its latest
   sentence, because "what is it doing right now" is the reason to open this on a bus. */

/** Outcome to the word shown on the row, and the colour of its dot. A finished job wears no tag at
 *  all: a list where every row shouts is a list nobody reads, and finishing is the ordinary case. */
const JOURNAL_OUTCOME = {
  running: { tag: "Working", dot: "phone-dot--working" },
  finished: { tag: "", dot: "phone-dot--journal" },
  stopped: { tag: "Stopped", dot: "phone-dot--journal" },
  failed: { tag: "Failed", dot: "phone-dot--failed" },
  asked_you: { tag: "Asked you", dot: "phone-dot--asked" },
};

function outcomeType(entry) {
  return (entry.outcome && entry.outcome.type) || "finished";
}

function journalRow(entry) {
  const look = JOURNAL_OUTCOME[outcomeType(entry)] || JOURNAL_OUTCOME.finished;
  return (
    '<li class="phone-row phone-row--journal">' +
    '<span class="phone-dot ' + look.dot + '" aria-hidden="true"></span>' +
    '<span class="phone-row-name">' +
    escapeHtml(entry.title) +
    (entry.detail ? '<span class="phone-journal-detail">' + escapeHtml(entry.detail) + "</span>" : "") +
    "</span>" +
    // Outcome and time travel together on their own line under the title. Beside it they were two
    // unshrinkable columns squeezing a phone-width row down to a word per line.
    '<span class="phone-journal-meta">' +
    (look.tag ? '<span class="phone-row-tag">' + look.tag + "</span>" : "") +
    '<span class="phone-journal-when">' + escapeHtml(ago(new Date(entry.started_at))) + "</span>" +
    "</span>" +
    "</li>"
  );
}

/** The whole journal group for one agent. Absent entirely when there is nothing in it: an empty
 *  "Lately" heading on a phone is a row of noise, and the desktop owns the empty case properly. */
function renderJournal(block) {
  const entries = (block && block.entries) || [];
  if (entries.length === 0) return "";
  const trimmed = (block && block.trimmed) || 0;
  return (
    '<div class="phone-group-title">Lately</div>' +
    '<ul class="phone-list">' + entries.map(journalRow).join("") + "</ul>" +
    '<div class="phone-journal-note">' +
    (trimmed
      ? "Showing the newest " + entries.length + " of " + (entries.length + trimmed) + ". "
      : "") +
    "Screens your agent saw stay on your computer. Open Archie there for the whole history, and to " +
    "take anything back." +
    "</div>"
  );
}

function renderAgent(agent, journal) {
  const ws = escapeHtml(agent.workspace_id);
  const id = escapeHtml(agent.id);

  const waiting = (agent.skills || [])
    .map((s) => ({ skill: s, missing: skillWaitingOn(agent, s) }))
    .filter((x) => x.missing.length > 0);

  const emptyLists = (agent.collections || []).filter((c) => c.rows === 0);

  // A job that stopped to ask something is the most time-sensitive thing on this screen, so it
  // joins the block that already means "waiting on you" rather than waiting its turn in the list.
  const asked = (((journal && journal.entries) || []).filter((e) => outcomeType(e) === "asked_you"));

  const needs =
    waiting.length === 0 && emptyLists.length === 0 && asked.length === 0
      ? ""
      : '<div class="phone-needs">' +
        '<div class="phone-needs-title">Waiting on you</div>' +
        asked.map((e) =>
          '<div class="phone-need">' +
          "<strong>" + escapeHtml(e.title) + "</strong> stopped to ask you something" +
          (e.detail ? ": " + escapeHtml(e.detail) : "") +
          ". Answer it where you chat with " + escapeHtml(agent.name) + "." +
          "</div>").join("") +
        waiting.map((x) =>
          '<div class="phone-need">' +
          "<strong>" + escapeHtml(x.skill.name) + "</strong> needs " +
          x.missing.map(integrationLabel).map(escapeHtml).join(" and ") +
          " connected. Open Archie on your computer to connect " +
          (x.missing.length === 1 ? "it" : "them") + "." +
          "</div>").join("") +
        // Names the agent rather than saying "anything that reads it", which asked the reader to
        // work out what that meant and which of their skills it was about.
        emptyLists.map((c) =>
          '<div class="phone-need">' +
          "<strong>" + escapeHtml(c.name) + "</strong> is empty, so " + escapeHtml(agent.name) +
          " cannot report on it yet." +
          "</div>").join("") +
        "</div>";

  // One Skills list, holding both what the snapshot calls skills and what it calls specialists.
  // They differ in how the runtime calls them, not in what they are to the person reading a phone
  // screen, and the app and the store both say "skill" for both. A specialist carries a role
  // rather than an enabled flag, so each row shows whichever of the two it has.
  const skillRows = (agent.skills || []).map((s) => ({
    name: s.name,
    tag: s.enabled === false ? "Off" : "",
  })).concat((agent.specialists || []).map((s) => ({
    name: s.name,
    tag: s.role || "",
  })));

  const skills = skillRows.length === 0
    ? '<div class="acct-section-body">No skills yet.</div>'
    : '<ul class="phone-list">' + skillRows.map((r) =>
        '<li class="phone-row">' +
        '<span class="phone-dot phone-dot--skill" aria-hidden="true"></span>' +
        '<span class="phone-row-name">' + escapeHtml(r.name) + "</span>" +
        (r.tag ? '<span class="phone-row-tag">' + escapeHtml(r.tag) + "</span>" : "") +
        "</li>").join("") + "</ul>";

  const personality = !(agent.personality && agent.personality.name)
    ? ""
    : kindHeading("personality", "Personality", 0) +
      '<ul class="phone-list"><li class="phone-row">' +
      '<span class="phone-dot phone-dot--personality" aria-hidden="true"></span>' +
      '<span class="phone-row-name">' + escapeHtml(agent.personality.name) + "</span>" +
      "</li></ul>";

  const routines = (agent.routines || []).length === 0
    ? '<div class="acct-section-body">No routines yet.</div>'
    : '<ul class="phone-list">' + agent.routines.map((r) =>
        '<li class="phone-row">' +
        '<span class="phone-dot phone-dot--routine" aria-hidden="true"></span>' +
        '<span class="phone-row-name">' + escapeHtml(r.name) + "</span>" +
        '<button class="btn btn-secondary btn-mini" data-routine="' + escapeHtml(r.slug) + '" ' +
        'data-enable="' + (r.enabled ? "0" : "1") + '" data-ws="' + ws + '" data-agent="' + id + '">' +
        (r.enabled ? "Pause" : "Resume") + "</button>" +
        "</li>").join("") + "</ul>";

  return (
    '<div class="acct-section phone-agent">' +
    '<div class="acct-section-head">' +
    '<div class="phone-agent-id">' +
    '<span class="phone-avatar phone-avatar--' + avatarHue(agent.id) + '">' + AGENT_GLYPH +
    '<span class="phone-avatar-dot' + (agent.running ? " phone-avatar-dot--on" : "") + '"></span>' +
    "</span>" +
    "<div>" +
    '<div class="phone-agent-name">' + escapeHtml(agent.name) + "</div>" +
    "</div>" +
    "</div>" +
    // The app's own green Start and red Stop, not the outlined button everything else here wears.
    '<button class="btn btn-mini btn-run' + (agent.running ? " btn-run--stop" : "") +
    '" data-agent-run="' + (agent.running ? "stop" : "start") + '" ' +
    'data-ws="' + ws + '" data-agent="' + id + '">' + (agent.running ? "Stop" : "Start") + "</button>" +
    "</div>" +
    // Under the header rather than in it. Between a 44px face and the Start/Stop button there was
    // about a third of a phone's width left to wrap a sentence in.
    (agent.purpose ? '<div class="phone-agent-purpose">' + escapeHtml(agent.purpose) + "</div>" : "") +
    renderChatCard(agent) +
    needs +
    // What it has been doing sits above what it has, for the same reason it does in the app: the
    // lists change on the day you set the agent up, and the journal changes every day after.
    renderJournal(journal) +
    kindHeading("skill", "Skills", skillRows.length) + skills +
    kindHeading("routine", "Routines", (agent.routines || []).length) + routines +
    personality +
    "</div>"
  );
}

/** A list heading in its kind's colour, with the count when there is more than a handful.
 *
 *  The count is dropped below four, where the list is quicker to count than to read a number
 *  about, and dropped entirely at zero: "Skills 0" over the words "No skills yet" is the same
 *  sentence twice, the second time in a way nobody speaks. */
function kindHeading(kind, label, count) {
  return (
    '<div class="phone-group-title phone-group-title--kind" data-kind="' + kind + '">' +
    escapeHtml(label) +
    (count > 3 ? '<span class="phone-group-count">' + count + "</span>" : "") +
    "</div>"
  );
}

/* ── The store ──────────────────────────────────────────────────────────────────────────────
   Browsing and installing, against the same live Firestore catalog the desktop app and the
   marketplace page read (js/catalog.js). Installing is the one thing here that changes somebody's
   agent, so it goes the long way round: an encrypted command to the computer, which runs it through
   `marketplace_install` exactly as the desktop's own Install button does. Nothing about a paid
   add-on's paywall, its prompt body, or its asset download is reimplemented on this side. */

/** The catalog, fetched once per page load. Small, and it does not change while someone browses. */
let catalog = null;

/** Which agent the store installs into. Set when the dashboard renders; with one agent, which is
 *  almost everyone, there is nothing to choose and no chooser is shown. */
let targetAgent = null;

const KIND_LABEL = {};
COLLECTIONS.forEach((c) => { KIND_LABEL[c.kind] = c; });

/** The shelves a shopper browses, in the store's order, one entry per shelf rather than per
 *  collection. Two collections share the skill shelf, so iterating COLLECTIONS here would draw
 *  the heading "Skills" twice with the list split arbitrarily between them. */
const SHELVES = COLLECTIONS.filter((c, i) => COLLECTIONS.findIndex((x) => x.shelf === c.shelf) === i)
  .map((c) => ({ shelf: c.shelf, label: c.label, plural: c.plural }));

/** The kind chip that is pressed, or "" for all of them. */
let storeKind = "";

/**
 * How many of a kind are shown before the rest are held behind a button, while every kind is on
 * screen at once.
 *
 * The store is around a hundred and twenty things. Stacked whole, the four headings sat at roughly
 * screen 1, screen 5, screen 9 and screen 13 of a phone, which is not a list with sections in it,
 * it is four lists somebody has to already know the order of. Capped, the headings are all within
 * a swipe or two of each other, so the shape of the catalog is visible before any of it is read,
 * and opening one kind is a tap rather than a scroll.
 *
 * Five, because four is the number of headings and a group that shows fewer rows than there are
 * groups reads as a teaser rather than as a list. Picking one kind lifts the cap entirely: that
 * tap is somebody saying they want to see all of these.
 */
const GROUP_PREVIEW = 5;

/** Which groups have been opened out by hand, so re-rendering after a search keeps them open. */
const storeExpanded = new Set();

/** What this agent already has, so the store can say "Added" instead of offering it twice. */
function installedKeys(agent) {
  const keys = new Set();
  (agent.skills || []).forEach((s) => keys.add("skill:" + s.slug));
  (agent.routines || []).forEach((r) => keys.add("routine:" + r.slug));
  (agent.specialists || []).forEach((s) => keys.add("specialist:" + s.slug));
  if (agent.personality && agent.personality.id) keys.add("personality:" + agent.personality.id);
  return keys;
}

function priceLabel(cents) {
  return cents ? "$" + (cents / 100).toFixed(2).replace(/\.00$/, "") : "Free";
}

async function renderStore(agent) {
  const host = $("ph-store");
  if (!host) return;

  if (!catalog) {
    host.innerHTML = '<div class="acct-section-body">Loading the marketplace&hellip;</div>';
    try {
      catalog = await loadCatalog(app, uid);
    } catch (e) {
      host.innerHTML =
        '<div class="acct-section-body">Could not load the marketplace. Pull down to refresh, or try ' +
        "again when you have a better connection.</div>";
      return;
    }
  }

  const have = installedKeys(agent);
  const term = ($("ph-store-search") ? $("ph-store-search").value : "").trim().toLowerCase();
  const hits = (item) =>
    !term || (item.name + " " + item.description + " " + item.category).toLowerCase().includes(term);

  // Searched first, then narrowed by kind, so a chip's count is the number of things that chip
  // would actually show right now. Counting before the search would put "Skills 47" over a chip
  // that opens onto two results, which is a number that lies twice: once about the store and once
  // about the search.
  const found = catalog.filter(hits);
  // `storeKind` holds a shelf, not a kind: the chips are shelves now, so the two collections that
  // share the skill shelf must both survive this filter.
  const matches = storeKind ? found.filter((i) => shelfKind(i.kind) === storeKind) : found;

  renderStoreFilters(found);

  if (matches.length === 0) {
    // Which of the two filters emptied it, and the one press that undoes that one. A bare "nothing
    // matches" over a page with a chip pressed leaves somebody searching the whole store from
    // inside a corner of it.
    const kindName = storeKind
      ? (SHELVES.find((c) => c.shelf === storeKind) || {}).plural || storeKind
      : "";
    host.innerHTML =
      '<div class="phone-store-empty">' +
      (term && storeKind
        ? "Nothing in " + escapeHtml(kindName.toLowerCase()) + " matches &ldquo;" + escapeHtml(term) +
          "&rdquo;. <button type=\"button\" data-store-kind=\"\">Search the whole marketplace</button>"
        : term
          ? "Nothing matches &ldquo;" + escapeHtml(term) + "&rdquo;."
          : "Nothing here yet.") +
      "</div>";
    bindStoreFilters();
    return;
  }

  // Grouped by kind, in the store's own order, so browsing on a phone still has the shape people
  // know from the desktop rather than one long undifferentiated list.
  host.innerHTML = SHELVES.map((c) => {
    const items = matches.filter((i) => shelfKind(i.kind) === c.shelf);
    if (items.length === 0) return "";
    // Every one of them once a kind has been chosen or a group opened out by hand. The cap is for
    // the view that is showing all three at once, which is the only one it helps.
    const capped = !storeKind && !storeExpanded.has(c.shelf) && items.length > GROUP_PREVIEW;
    const shown = capped ? items.slice(0, GROUP_PREVIEW) : items;
    const rest = items.length - shown.length;
    return (
      kindHeading(c.shelf, c.plural, items.length) +
      '<ul class="phone-list">' + shown.map((i) => storeRow(i, have, agent)).join("") + "</ul>" +
      (rest > 0
        ? '<button type="button" class="phone-store-more" data-kind="' + c.shelf +
          '" data-store-expand="' + c.shelf + '">Show the other ' + rest + " " +
          escapeHtml(rest === 1 ? c.label.toLowerCase() : c.plural.toLowerCase()) + "</button>"
        : "")
    );
  }).join("");

  bindStoreFilters();
  host.querySelectorAll("[data-store-expand]").forEach((btn) => {
    btn.addEventListener("click", () => {
      storeExpanded.add(btn.dataset.storeExpand);
      void renderStore(agent);
    });
  });

  host.querySelectorAll("[data-install]").forEach((btn) => {
    btn.addEventListener("click", () =>
      act(btn, "Adding…", "install_" + btn.dataset.kind, {
        workspace_id: agent.workspace_id,
        agent_id: agent.id,
        id: btn.dataset.install,
        // The agent's routines are scheduled in whatever timezone it is told about, and the phone
        // is the device that actually knows where its owner is. Sending it means a routine added
        // here fires at a sensible local hour instead of at UTC midnight.
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || null,
      }));
  });
  host.querySelectorAll("[data-uninstall]").forEach((btn) => {
    btn.addEventListener("click", () =>
      act(btn, "Removing…", "remove_" + btn.dataset.kind, {
        workspace_id: agent.workspace_id,
        agent_id: agent.id,
        slug: btn.dataset.uninstall,
      }));
  });
}

/**
 * The kind chips, with what each one holds written on it.
 *
 * Counted against what the search has already found rather than against the whole catalog, so the
 * row doubles as the result of the search: type "calendar" and the chips say how the matches fall
 * across the four kinds before a single row has been read. A kind with nothing in it is dropped
 * rather than shown at zero, because a chip that opens onto an empty list is a wasted tap and, at
 * this width, a wasted tap costs a scroll.
 */
function renderStoreFilters(found) {
  const host = $("ph-store-filters");
  if (!host) return;
  const chip = (kind, label, count) =>
    '<button type="button" class="phone-store-chip' + (storeKind === kind ? " is-active" : "") +
    '" data-kind="' + kind + '" data-store-kind="' + kind + '"' +
    (storeKind === kind ? ' aria-pressed="true"' : ' aria-pressed="false"') + ">" +
    escapeHtml(label) + '<span class="phone-store-chip-count">' + count + "</span></button>";

  host.innerHTML =
    chip("", "All", found.length) +
    SHELVES.map((c) => {
      const n = found.filter((i) => shelfKind(i.kind) === c.shelf).length;
      return n === 0 ? "" : chip(c.shelf, c.plural, n);
    }).join("");
}

/** One handler for the chips and for the way out of an empty result, which is the same action. */
function bindStoreFilters() {
  document.querySelectorAll("[data-store-kind]").forEach((btn) => {
    btn.addEventListener("click", () => {
      storeKind = btn.dataset.storeKind;
      if (targetAgent) void renderStore(targetAgent);
      // Back to the top of the list, not to wherever the old one had been scrolled to. Narrowing
      // while standing halfway down a list lands you halfway down a different, shorter one. To
      // just under the pinned chips rather than to the top of the window, since the chips are the
      // thing that was just pressed and the first row belongs directly beneath them. Only when
      // the list has actually been scrolled past them, so pressing a chip from the top of the
      // page moves nothing.
      const list = $("ph-store");
      const tools = document.querySelector(".phone-store-tools");
      if (list && tools) {
        const delta = list.getBoundingClientRect().top - (tools.getBoundingClientRect().bottom + 8);
        if (delta < -1) window.scrollBy({ top: delta, behavior: "smooth" });
      }
    });
  });
}

function storeRow(item, have, agent) {
  const installed = have.has(item.kind + ":" + item.id);
  const paid = item.price_cents > 0;

  // Paid add-ons are bought on the computer. Saying so beats an Add button that fails, and the
  // desktop's `marketplace_install` would refuse this anyway (require_owned_if_paid).
  const action = installed
    ? '<button class="btn btn-secondary btn-mini" data-uninstall="' + escapeHtml(item.id) +
      '" data-kind="' + escapeHtml(item.kind) + '">Remove</button>'
    : paid
      ? ""
      : '<button class="btn btn-primary btn-mini" data-install="' + escapeHtml(item.id) +
        '" data-kind="' + escapeHtml(item.kind) + '">Add</button>';

  // The price is a sentence, so it goes under the description with the other sentences rather than
  // in the column the Add button would have used. Held there it was wider than the button it stood
  // in for, and it took half the row away from the words explaining what the thing does.
  const priceNote = !installed && paid
    ? '<div class="phone-store-note phone-store-price">' + escapeHtml(priceLabel(item.price_cents)) +
      ". Add this one on your computer.</div>"
    : "";

  // What it will still want after installing, said before the tap rather than discovered after.
  const needs = (item.required_integrations || [])
    .filter((id) => ["flights", "video"].indexOf(id) === -1)
    .filter((id) => (agent.connected || []).indexOf(id) === -1);
  const needsNote = needs.length
    ? '<div class="phone-store-note">Needs ' + needs.map(integrationLabel).map(escapeHtml).join(" and ") +
      " connected on your computer.</div>"
    : "";

  const kind = (KIND_LABEL[item.kind] || {}).label || item.kind;

  return (
    '<li class="phone-row phone-store-row" data-kind="' + escapeHtml(item.kind) + '">' +
    '<div class="phone-store-main">' +
    // Above the name rather than beside it. A row scrolled to on its own has no heading in view,
    // and what kind of thing this is decides what the Add button is about to do to the agent.
    '<div class="phone-store-kind">' + escapeHtml(kind) + "</div>" +
    '<div class="phone-row-name">' + escapeHtml(item.name) + "</div>" +
    '<div class="phone-store-desc">' + escapeHtml(item.description) + "</div>" +
    // Price first: what it costs decides whether the rest of the row is worth reading.
    priceNote +
    needsNote +
    "</div>" +
    action +
    "</li>"
  );
}

/* ── The two halves ─────────────────────────────────────────────────────────────────────────
   "Your agent" is what is already installed and what it is waiting on. "Marketplace" is
   everything on offer. They were one scroll, which meant reaching the marketplace at all
   required scrolling past every skill and routine the agent already had, on the device with the
   least screen to spare.

   The status card sits above both rather than inside either, because "is the computer awake"
   decides whether anything on either tab will do something when tapped. */

let activeTab = "agents";

/** Whether the marketplace tab is offered at all. It installs into an agent, so with no agent
 *  there is nothing it could do, and an empty store is a worse answer than no tab. */
let storeAvailable = false;

function showTab(name) {
  activeTab = name;

  $("ph-tab-agents").classList.toggle("is-active", name === "agents");
  $("ph-tab-store").classList.toggle("is-active", name === "store");
  $("ph-tab-agents").setAttribute("aria-selected", String(name === "agents"));
  $("ph-tab-store").setAttribute("aria-selected", String(name === "store"));

  show("ph-agents", name === "agents");
  show("ph-store-section", name === "store" && storeAvailable);

  // The marketplace is drawn only while it is the visible tab, so the every-15-seconds refresh
  // cannot redraw a list somebody is halfway down reading, and so opening the page does not fetch
  // a catalog nobody asked to see.
  if (name === "store" && targetAgent) void renderStore(targetAgent);
}

/* ── The page's states ──────────────────────────────────────────────────────────────────────── */

/** Turn a failed read into the sentence that names what actually went wrong.
 *
 *  This used to blame a stale pairing for everything, which is the worst possible default: a
 *  pairing problem is the one cause the reader can "fix" by re-scanning, so a wrong guess sends
 *  them round that loop forever while the real fault sits untouched. These three causes need three
 *  different actions, and nothing here guesses between them. */
function readFailureMessage(e) {
  const code = (e && e.code) || "";
  const name = (e && e.name) || "";

  // WebCrypto throws OperationError when the tag does not verify, which for us means exactly one
  // thing: this phone's key is not the key that sealed the message. That is a genuine re-pair.
  if (name === "OperationError") {
    return "This phone's pairing no longer matches your computer. On your computer, open Archie, " +
      "go to Account, and tap Show a new code, then scan it with this phone.";
  }

  // The mailbox refused the read. Either the relay's security rules are not deployed yet, or this
  // account is not entitled. Both are fixed at the source, never by re-scanning a code here.
  if (code === "permission-denied") {
    return "Your account cannot open the phone mailbox yet. This is set up on our side, not " +
      "yours: nothing you do on this phone will change it. If you are testing a new build, the " +
      "Firestore rules need deploying first.";
  }

  if (code === "unavailable" || code === "failed-precondition") {
    return "Cannot reach the network right now. This will work again when you are back online.";
  }

  return "Could not read from your computer's mailbox" + (code ? " (" + code + ")" : "") + ".";
}

async function refresh() {
  let snapshot;
  try {
    snapshot = await readSnapshot();
  } catch (e) {
    setStatus(readFailureMessage(e), "error");
    // Leave the last good render on screen rather than blanking it: a transient failure should not
    // take away the information the person already had.
    return;
  }

  if (!snapshot) {
    // Paired once, but the computer is publishing nothing. Usually that means phone access was
    // turned off there; it also looks identical when this browser is signed in as a different
    // account from the computer, so the address is named here rather than left to be guessed.
    showPairScreen(
      "Nothing is waiting for this phone. Either phone access is off on your computer, or this " +
      "phone is signed in as a different person: Archie has to be signed in as " + signedInAs + ".",
    );
    return;
  }

  // Back to the dashboard. This has to be here, and its absence was a real bug: the branch above
  // is a state change, not a message, so a refresh that found nothing left the pair screen up and
  // every later refresh rendered into a hidden #ph-app. The page stayed stuck on "Pair this phone"
  // forever, no matter what the computer did, and only a hard reload escaped it.
  show("ph-pair", false);
  show("ph-app", true);

  renderStatus(snapshot);
  renderAgents(snapshot);

  // The marketplace installs into one agent. With several, the first is the default and the picker
  // above the list switches it; with one, which is nearly everyone, there is nothing to choose.
  const agents = (snapshot.state && snapshot.state.agents) || [];
  storeAvailable = agents.length > 0;
  if (storeAvailable) {
    const keep = targetAgent && agents.find((a) => a.id === targetAgent.id);
    targetAgent = keep || agents[0];
    renderAgentPicker(agents);
  }

  // Plural only when it is. The label is the one place on this page that says how many agents
  // there are before you have looked.
  $("ph-tab-agents").textContent = agents.length > 1 ? "Your agents" : "Your agent";
  show("ph-tab-store", storeAvailable);
  // Held back until the first snapshot lands, so the bar appears once with the right tabs on it
  // rather than drawing a second tab a moment later under somebody's thumb. With no agent there is
  // only one tab, and a control that switches between one thing is furniture.
  show("ph-tabs", storeAvailable);
  // An agent removed from the computer while the marketplace tab was open would otherwise leave
  // a tab selected that is no longer offered, and a blank panel under it.
  showTab(storeAvailable ? activeTab : "agents");
}

function renderAgentPicker(agents) {
  const host = $("ph-store-agent");
  if (!host) return;
  if (agents.length < 2) { host.classList.add("acct-hidden"); return; }
  host.classList.remove("acct-hidden");
  host.innerHTML =
    '<label class="phone-store-agent-label" for="ph-store-agent-select">Add to</label>' +
    '<select id="ph-store-agent-select">' +
    agents.map((a) =>
      '<option value="' + escapeHtml(a.id) + '"' + (a.id === targetAgent.id ? " selected" : "") +
      ">" + escapeHtml(a.name) + "</option>").join("") +
    "</select>";
  $("ph-store-agent-select").addEventListener("change", (e) => {
    targetAgent = agents.find((a) => a.id === e.target.value) || agents[0];
    void renderStore(targetAgent);
  });
}

/** Accept a pairing link (or a bare key) pasted by hand, and start over with it.
 *
 *  This is the only pairing route a home-screen app has. On iOS an installed web app keeps its own
 *  storage, separate from Safari's, and a scanned QR always opens Safari, so the app can never
 *  receive a key by scanning no matter how many times someone tries. Pasting is not a fallback
 *  here; for that context it is the primary path.
 *
 *  Takes the whole link because that is what Archie's Copy button puts on the clipboard, and
 *  a bare key because that is what someone retyping will produce. */
function pairFromPastedText(text) {
  const trimmed = String(text || "").trim();
  if (!trimmed) return;
  const fromLink = trimmed.match(/[#&]k=([A-Za-z0-9_-]+)/);
  const candidate = fromLink ? fromLink[1] : (/^[A-Za-z0-9_-]+$/.test(trimmed) ? trimmed : null);
  if (!candidate) {
    setStatus("That does not look like a pairing link. Copy it again from Archie.", "error");
    return;
  }
  keyInMemory = candidate;
  let persisted = false;
  try { localStorage.setItem(KEY_STORE, candidate); persisted = true; } catch (e) { /* try session */ }
  try { sessionStorage.setItem(KEY_STORE, candidate); persisted = true; } catch (e) { /* neither */ }
  keyIsEphemeral = !persisted;
  // Reload rather than continuing in place: pairing changes what every part of this page is doing,
  // and a fresh start is one code path instead of a second, subtly different one.
  location.reload();
}

/** Show the pair screen with the reason it is showing.
 *
 *  One function, because the reason has to be set in the same breath as the screen. The version
 *  that set them separately is how the page ended up insisting a phone was unpaired without ever
 *  saying which of the several quite different causes applied. */
function showPairScreen(reason) {
  show("ph-loading", false);
  show("ph-app", false);
  show("ph-pair", true);
  const lead = $("ph-pair").querySelector(".acct-lead");
  if (lead) lead.innerHTML = escapeHtml(reason);

  // Wired here rather than at startup, because the pair screen is reachable from several places and
  // this is the one point they all pass through.
  const go = $("ph-paste-go");
  const input = $("ph-paste");
  const clip = $("ph-paste-clip");
  if (go && input && !go.dataset.wired) {
    go.dataset.wired = "1";
    go.addEventListener("click", () => pairFromPastedText(input.value));
    input.addEventListener("keydown", (e) => { if (e.key === "Enter") pairFromPastedText(input.value); });
  }
  if (clip && !clip.dataset.wired) {
    clip.dataset.wired = "1";
    // Hidden rather than shown-and-broken where the API does not exist.
    if (!(navigator.clipboard && navigator.clipboard.readText)) {
      clip.classList.add("acct-hidden");
    } else {
      clip.addEventListener("click", async () => {
        try {
          // On iOS this raises the system "Paste" prompt, so the whole transfer is two taps: Copy
          // on the computer, Paste here. With a Mac and Universal Clipboard the copy has already
          // crossed on its own, and nothing has to be typed or messaged anywhere.
          pairFromPastedText(await navigator.clipboard.readText());
        } catch (e) {
          setStatus(
            "This phone did not allow reading the clipboard. Paste the link into the box below " +
            "instead.",
            "error",
          );
        }
      });
    }
  }
}

function unpair() {
  // Every carrier the key could be in, or the reload finds it again and nothing appears to happen.
  keyInMemory = null;
  try { localStorage.removeItem(KEY_STORE); } catch (e) { /* nothing to remove */ }
  try { sessionStorage.removeItem(KEY_STORE); } catch (e) { /* nothing to remove */ }
  location.reload();
}

async function start(user) {
  uid = user.uid;
  signedInAs = (user.email || "this account").trim();

  // Already captured at module load, so this is just "whatever we have", newest first.
  const key = storedKey();

  if (!isMobile) { show("ph-loading", false); show("ph-desktop", true); return; }
  if (!key) {
    // Say which of the two states this is. "No code yet" and "a code that would not save" look the
    // same on screen and need completely different things from the reader, and guessing between
    // them from the outside is slow.
    showPairScreen(
      "This phone does not have a pairing code yet. Scan the one in Archie to get one.",
    );
    return;
  }

  try {
    cryptoKey = await importKey(key);
  } catch (e) {
    showPairScreen("That pairing code was not readable. Scan the one in Archie again.");
    return;
  }

  // Captured, usable, and nothing would keep it. Worth saying plainly: it will work now and be
  // forgotten the moment this tab closes, which otherwise reads as random unpairing later.
  if (keyIsEphemeral) {
    setStatus(
      "This phone cannot save the pairing, so it will be forgotten when you close this tab. " +
      "Turn off Private Browsing, or free up storage, to keep it.",
      "error",
    );
  }

  show("ph-loading", false);
  show("ph-app", true);
  renderInstallPrompt();

  $("ph-refresh").addEventListener("click", () => { void refresh(); });
  $("ph-unpair").addEventListener("click", unpair);

  // Switching tabs returns to the top. Coming back to a half-scrolled list you did not scroll
  // reads as the page having lost its place.
  $("ph-tab-agents").addEventListener("click", () => { showTab("agents"); window.scrollTo(0, 0); });
  $("ph-tab-store").addEventListener("click", () => { showTab("store"); window.scrollTo(0, 0); });

  // Filtering is local to the already-loaded catalog, so it stays instant and costs no reads.
  const search = $("ph-store-search");
  if (search) {
    search.addEventListener("input", () => { if (targetAgent) void renderStore(targetAgent); });
  }

  await refresh();

  // Keep the "last heard from" honest while the page sits open, and pick up anything changed at
  // the computer. Paused when the tab is hidden, so a backgrounded home-screen app is not quietly
  // polling all day.
  setInterval(() => {
    if (!document.hidden && commandsInFlight === 0) void refresh();
  }, 15_000);
}

/* ── The gate ───────────────────────────────────────────────────────────────────────────────
   Signed in AND second-factor cleared, exactly like /account/. This page can install software into
   somebody's agent and start it running, so a password alone must not reach it by typing the URL. */

function isFirstEntry(user) {
  const c = Date.parse((user.metadata && user.metadata.creationTime) || "");
  const l = Date.parse((user.metadata && user.metadata.lastSignInTime) || "");
  if (Number.isNaN(c) || Number.isNaN(l)) return false;
  return Math.abs(l - c) < 10000;
}

function twoFactorCleared(user) {
  try { if (sessionStorage.getItem("otian_2fa_ok") === user.uid) return true; } catch (e) {}
  return isFirstEntry(user);
}

/** Arrived straight from the sign-in page, which has already vetted this session. Without this, a
 *  per-session flag lost to private browsing makes /login/ and this page redirect to each other
 *  forever. Mirrors the same guard on /account/. */
function cameFromLogin() {
  try {
    const r = new URL(document.referrer);
    return r.origin === location.origin && r.pathname.replace(/\/+$/, "") === "/login";
  } catch (e) { return false; }
}

onAuthStateChanged(auth, (user) => {
  // The key is already captured (module load, above), so a redirect to sign in cannot drop it.
  if (!user) { location.replace("/login/?next=/phone/"); return; }
  if (!twoFactorCleared(user) && !cameFromLogin()) { location.replace("/login/?next=/phone/"); return; }
  void start(user);
});

/* A service worker that caches nothing and only exists so Chrome will offer to install the page:
   `beforeinstallprompt` does not fire without one registered. A caching worker would bring
   stale-asset bugs to a site with no build step and no cache-busting, which is a bad trade for a
   page that is useless offline anyway. */
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js").catch(() => { /* install button just won't appear */ });
}
