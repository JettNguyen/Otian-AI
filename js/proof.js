/* ========================================
   Otian AI | The instruments on trust/proof/, and the live chain on trust/
   js/proof.js

   WHAT THIS FILE IS FOR. Every privacy sentence on this site is a claim, and a claim is
   something a reader has to decide whether to believe. Four of ours are mechanisms rather
   than promises, which means they can be run instead of believed: the browser does the work,
   on the reader's own input, and the result is the evidence.

   So the rule for everything below, and the only rule that makes the page worth having:

     NOTHING HERE IS A RECORDING, AND NOTHING HERE IS FAKED.

     * The fingerprints are real SHA-256, computed by WebCrypto over the same canonical bytes
       Archie hashes (crates/archie-domain/src/audit.rs, canonical_bytes: serde_json over a
       sorted map, so the JSON below sorts its keys too). The page prints the exact line it
       hashed and the one-line shell command that reproduces it, because a number you can get
       a second way is a fact and a number only we can produce is a picture of one.
     * The seal is real AES-256-GCM through WebCrypto, and it is not an imitation of the
       product's: seal() and open() here are the same two functions as js/phone.js, which is
       itself matched byte for byte against crates/archie-core/src/phone.rs by the
       opens_an_envelope_sealed_by_the_browser test vector. A wrong key fails because the
       browser refuses it, not because we wrote an if statement that says "denied".
     * The request list is the browser's own Resource Timing record of this page load, printed
       whole, including the hosts that are not ours. If a tracker were ever added to this site
       it would appear in that list, which is the point of printing it from the browser's
       record rather than from a list we keep.

   If you are editing this file: the honest failure mode is a demonstration that always
   succeeds. Every instrument here computes its verdict from the real result, so a broken
   implementation shows a broken verdict rather than a reassuring one. Keep it that way.

   Loaded on two pages:
     trust/proof/  every instrument.
     trust/        the chain only, upgrading the record window in place. That window ships
                   its numbers in the HTML and is complete without this file: what this adds
                   is the numbers moving while you watch, which a static page cannot do.
   ======================================== */

/* ── The shared floor: bytes, hex, and the canonical JSON Archie hashes ──────────────────── */

const enc = new TextEncoder();

const hex = (buf) =>
  [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");

/** Short form for a fingerprint, the way the app's own list shows one: first four, last four. */
const short = (h) => (h ? h.slice(0, 4) + "…" + h.slice(-4) : "");

/** True when the browser will do real crypto for us.
 *
 *  crypto.subtle exists only in a secure context (https, or localhost). Opened from a file://
 *  path it is undefined, and every instrument here would throw on load. The pages ship their
 *  resting state in HTML, so the honest handling is to leave that state alone and say why. */
const canCrypto = !!(window.crypto && window.crypto.subtle);

async function sha256Hex(text) {
  return hex(await crypto.subtle.digest("SHA-256", enc.encode(text)));
}

/** Serialize the way serde_json does by default: keys sorted, no spaces.
 *
 *  This is the part that has to be exactly right, because the whole claim is that the number
 *  on this page is the number Archie computes and the number your terminal computes. serde_json's
 *  Map is a BTreeMap unless the preserve_order feature is on, and it is not on in the Archie
 *  workspace, so every object it writes comes out with its keys in sorted order and no
 *  whitespace. JSON.stringify keeps insertion order instead, so the sort is done here by hand,
 *  recursively, and the rest of JSON's escaping rules are the same in both. */
function canonJson(value) {
  if (Array.isArray(value)) return "[" + value.map(canonJson).join(",") + "]";
  if (value && typeof value === "object") {
    return (
      "{" +
      Object.keys(value)
        .sort()
        .map((k) => JSON.stringify(k) + ":" + canonJson(value[k]))
        .join(",") +
      "}"
    );
  }
  return JSON.stringify(value);
}

/** The exact bytes Archie hashes for one event: every field except `hash` itself, plus the
 *  previous event's hash. Field list from AuditEvent::canonical_bytes. */
function canonicalLine(event, prevHash) {
  return canonJson({
    action: event.action,
    actor: event.actor,
    id: event.id,
    metadata_json: event.metadata_json,
    prev_hash: prevHash,
    subject_id: event.subject_id,
    subject_type: event.subject_type,
    ts: event.ts,
  });
}

/** Hash a whole record, front to back, and hand back the working for every line.
 *
 *  `stored` is what the database already holds, and `linked` is the difference between the two
 *  things somebody can do to a record, which is the difference this instrument exists to show.
 *
 *    linked = false.  Every line keeps the previous line's STORED fingerprint, because that is
 *      what is written in the row and nobody has touched it. Retyping one line changes that
 *      line's fingerprint and nothing else: the lines under it still hash to exactly what the
 *      database says they do. One broken line, which is what Archie reports.
 *
 *    linked = true.  Every line is hashed over the recomputed line above it, which is what
 *      somebody covering their tracks has to do: change a line and rewrite every fingerprint
 *      under it so the chain hangs together again. Now nothing is internally broken, and the
 *      record ends on a number that is not the one in the keychain.
 *
 *  Passing no `stored` hashes the record fresh, front to back, which is what writing it does. */
async function chainHashes(events, stored, linked = true) {
  const out = [];
  let prev = "";
  for (let i = 0; i < events.length; i += 1) {
    if (i > 0 && !linked && stored) prev = stored[i - 1];
    const line = canonicalLine(events[i], prev);
    const hash = await sha256Hex(line);
    out.push({ line, prev, hash });
    prev = hash;
  }
  return out;
}

/* ── The record, as five real events ─────────────────────────────────────────────────────────

   These are the shapes the app actually writes, not a simplification of them: the action
   strings are keys in ACCESS_ACTIONS (src/app/settings.tsx), the sentences are that table's
   own sentences, and each event's subject and metadata match its call site in the Archie repo
   (credential.created in src-tauri/src/commands/mod.rs, google.connected and
   connector.disconnected in commands/integrations.rs, access.approved and access.revoked in
   commands/access.rs). The ids and timestamps are made up, because every id in a real record
   is; nothing else here is. */

const RECORD = [
  {
    id: "aud_9f31c2a7b04e4d8f9c1a5e6d7b8c9a01",
    ts: 1757930415000,
    actor: "user",
    action: "credential.created",
    subject_type: "credential",
    subject_id: "cred_4b7e1d9a3f2c4e8ab6d05f19c7e34a82",
    metadata_json: { label: "Anthropic key", last4: "9f2c" },
    // Which piece of this line the reader may retype, and what to call it in the control.
    field: { path: ["metadata_json", "label"], label: "name on the key" },
  },
  {
    id: "aud_1d0c4e8b7a62431fae95cb3d2f60718e",
    ts: 1757930902000,
    actor: "user",
    action: "google.connected",
    subject_type: "agent",
    subject_id: "agent_7a2f5c18d9b34e07a1c6be82d4930f56",
    metadata_json: { email: "sam@example.com" },
    field: { path: ["metadata_json", "email"], label: "account" },
  },
  {
    id: "aud_63b8f5029ce7481ab0d2947e15c8a3df",
    ts: 1757934118000,
    actor: "user",
    action: "access.approved",
    subject_type: "agent",
    subject_id: "agent_7a2f5c18d9b34e07a1c6be82d4930f56",
    metadata_json: { display: "Dana", sender_id: "tg_48213907" },
    // The one line with a choice rather than a text box: swapping approved for blocked is the
    // edit somebody would actually want to make, and it is two keys in the same table.
    field: {
      path: ["action"],
      label: "what happened",
      options: ["access.approved", "access.blocked"],
    },
  },
  {
    id: "aud_2e7419acbd5f40c8927615d0e3ba8c74",
    ts: 1758013640000,
    actor: "user",
    action: "connector.disconnected",
    subject_type: "agent",
    subject_id: "agent_7a2f5c18d9b34e07a1c6be82d4930f56",
    metadata_json: { service: "Todoist" },
    field: { path: ["metadata_json", "service"], label: "service" },
  },
  {
    id: "aud_58d0b3f16e2c47a9840c7be5219fd3a6",
    ts: 1758016277000,
    actor: "user",
    action: "access.revoked",
    subject_type: "agent",
    subject_id: "agent_7a2f5c18d9b34e07a1c6be82d4930f56",
    metadata_json: { sender_id: "tg_48213907" },
    field: { path: ["metadata_json", "sender_id"], label: "person" },
  },
];

/** The app's own sentences for these actions, from ACCESS_ACTIONS. Kept as functions of the
 *  metadata for the same reason the app keeps them that way: the sentence carries the service
 *  or the account, so retyping one has to change what the list says as well as what it hashes. */
const SAY = {
  "credential.created": () => "A key was saved on this computer.",
  "google.connected": () => "A Google account was connected.",
  "access.approved": () => "Someone was approved to message an agent.",
  "access.blocked": () => "Someone was blocked from an agent.",
  "connector.disconnected": (m) =>
    "An outside service was disconnected" + (m.service ? ": " + m.service : "") + ".",
  "access.revoked": () => "Someone’s access to an agent was taken away.",
};

const deepCopy = (v) => JSON.parse(JSON.stringify(v));

function readField(event, path) {
  return path.length === 1 ? event[path[0]] : event[path[0]][path[1]];
}

function writeField(event, path, value) {
  if (path.length === 1) event[path[0]] = value;
  else event[path[0]][path[1]] = value;
}

/* ── Instrument 1: the chain ─────────────────────────────────────────────────────────────────

   Two things a reader can do to a record, and the app catches both differently, which is the
   argument this instrument exists to make:

     Retype a line and leave the fingerprints alone.  That line stops matching its own
     content, and Archie says so on open. This is the easy case.

     Retype a line and rewrite every fingerprint under it.  Now the record hangs together
     perfectly: each line's fingerprint really is the hash of that line. What it no longer
     matches is the tip Archie wrote into the keychain the last time it checked, which is
     what verify_anchored compares against (crates/archie-core/src/audit.rs, AUDIT_ANCHOR_KEY).
     A record that has been rewritten from top to bottom is not the one this computer ended on.

   Both verdicts below are computed from real hash comparisons, never from which switch is on. */

async function mountChain(root) {
  const rows = [...root.querySelectorAll("[data-chain-row]")];
  if (!rows.length) return;

  const verdictOk = root.querySelector("[data-chain-ok]");
  const verdictBad = root.querySelector("[data-chain-bad]");
  const verdictText = root.querySelector("[data-chain-bad-text]");
  const coverBox = root.querySelector("[data-chain-cover]");
  const anchorEl = root.querySelector("[data-chain-anchor]");
  const tipEl = root.querySelector("[data-chain-tip]");
  const outLine = root.querySelector("[data-chain-line]");
  const outCmd = root.querySelector("[data-chain-cmd]");
  const outHash = root.querySelector("[data-chain-hash]");
  const outWhich = root.querySelector("[data-chain-which]");

  // What the record held before anyone touched it: the hashes in the database, and the tip
  // this computer wrote into its keychain. Everything the instrument reports is a comparison
  // against these two, so they are computed once, from the untouched events.
  const original = await chainHashes(RECORD, null, true);
  const stored = original.map((r) => r.hash);
  const anchor = stored[stored.length - 1];
  if (anchorEl) anchorEl.textContent = short(anchor);

  let shown = 2; // which line's working is printed underneath; the altered one, by default

  async function render() {
    const covering = !!(coverBox && coverBox.checked);

    // The record as it stands now: the reader's edits applied to a copy, never to RECORD.
    //
    // Two ways a line changes. On trust/proof/ the reader retypes it, which is the instrument
    // in full. On trust/ there is one switch and no text boxes, so the row that the switch
    // alters says so in the markup: data-chain-alter is the value it takes. Same code path,
    // same hashes, and the small window on the other page stays a small window.
    const events = RECORD.map((event, i) => {
      const copy = deepCopy(event);
      const input = rows[i].querySelector("[data-chain-input]");
      if (input && event.field) writeField(copy, event.field.path, input.value);
      const altered = rows[i].getAttribute("data-chain-alter");
      if (altered && covering) {
        writeField(copy, (rows[i].getAttribute("data-chain-alter-path") || "action").split("."), altered);
      }
      return copy;
    });

    const fresh = await chainHashes(events, stored, covering);

    // Which check catches this, and it is a different one in each case. With the fingerprints
    // left alone, a line is caught by its own: the recomputation differs from what is stored
    // beside it, and the lines underneath are untouched and still fine. With the fingerprints
    // rewritten, every line matches by construction, which is what rewriting them means, so
    // the only thing left that disagrees is the tip Archie wrote into the keychain.
    const changed = fresh.map((r, i) => r.hash !== stored[i]);
    const brokenAt = covering ? -1 : changed.indexOf(true);
    const tip = covering ? fresh[fresh.length - 1].hash : stored[stored.length - 1];
    const tipMatches = tip === anchor;

    rows.forEach((row, i) => {
      const event = events[i];
      const say = row.querySelector("[data-chain-say]");
      if (say) say.textContent = SAY[event.action](event.metadata_json);

      const fpNow = row.querySelector("[data-chain-fp-now]");
      const fpWas = row.querySelector("[data-chain-fp-was]");
      const isChanged = changed[i];
      // What the database holds for this line stays on screen whatever happens to it: a
      // fingerprint that quietly became the new one would be the instrument doing the
      // tampering it is meant to show.
      if (fpWas) fpWas.textContent = short(stored[i]);
      if (fpNow) fpNow.textContent = short(fresh[i].hash);
      row.classList.toggle("is-broken", isChanged && !covering);
      row.classList.toggle("is-rewritten", isChanged && covering);
    });

    if (tipEl) {
      tipEl.textContent = short(tip);
      tipEl.classList.toggle("is-off", !tipMatches);
    }

    const intact = !changed.some(Boolean) && tipMatches;
    if (verdictOk) verdictOk.hidden = !intact;
    if (verdictBad) verdictBad.hidden = intact;
    if (!intact && verdictText) {
      verdictText.textContent = covering
        ? "This record hangs together, and it is not the record this computer ended on. " +
          "The last fingerprint here is " + short(tip) + ". Archie wrote down " + short(anchor) + "."
        : "Line " + (brokenAt + 1) + " no longer matches the fingerprint stored beside it. " +
          "The lines under it are untouched, and Archie reports the whole chain as broken " +
          "when it opens.";
    }

    // The working, for one line: the bytes that went into the hash, the command that
    // reproduces it anywhere, and the answer. Printing the bytes is the difference between
    // showing a number and showing where a number came from.
    const line = fresh[shown].line;
    if (outWhich) outWhich.textContent = String(shown + 1);
    if (outLine) outLine.textContent = line;
    if (outCmd) outCmd.textContent = "printf '%s' '" + line + "' | shasum -a 256";
    if (outHash) outHash.textContent = fresh[shown].hash;
  }

  rows.forEach((row, i) => {
    const input = row.querySelector("[data-chain-input]");
    if (input) {
      input.addEventListener("input", () => { shown = i; render(); });
      input.addEventListener("change", () => { shown = i; render(); });
    }
    const pick = row.querySelector("[data-chain-show]");
    if (pick) pick.addEventListener("click", () => { shown = i; render(); });
  });
  if (coverBox) coverBox.addEventListener("change", render);

  root.classList.add("is-live");
  await render();
}

/* ── Instrument 2: the seal ──────────────────────────────────────────────────────────────────

   seal() and open() are lifted unchanged from js/phone.js, which is the code that runs when
   somebody manages their computer from their phone. AES-256-GCM, a fresh 96-bit nonce per
   message, both stored base64 beside each other. The Rust side is crates/archie-core/src/phone.rs
   and the two are held together by a test vector rather than by anyone's memory.

   The instrument's whole job is to put three things on screen at once: the message, the
   ciphertext our servers hold instead of it, and the handful of fields that are NOT sealed.
   The third is the one a demonstration would be tempted to leave out. */

const b64 = (bytes) => btoa(String.fromCharCode(...new Uint8Array(bytes)));
const unb64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

async function newKey() {
  return crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]);
}

async function seal(key, value) {
  const nonce = crypto.getRandomValues(new Uint8Array(12));
  const data = enc.encode(JSON.stringify(value));
  const cipher = await crypto.subtle.encrypt({ name: "AES-GCM", iv: nonce }, key, data);
  return { v: 1, n: b64(nonce), c: b64(cipher) };
}

async function openSealed(key, envelope) {
  if (!envelope || envelope.v !== 1) throw new Error("unknown message format");
  const plain = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: unb64(envelope.n) },
    key,
    unb64(envelope.c),
  );
  return JSON.parse(new TextDecoder().decode(plain));
}

/** Flip one bit in the middle of the ciphertext. GCM authenticates as it decrypts, so this is
 *  refused rather than opened into something else, which is a stronger claim than secrecy and
 *  the reason the mailbox rules can be as loose as they are. */
function flipOneBit(envelope) {
  const bytes = unb64(envelope.c);
  const at = Math.floor(bytes.length / 2);
  bytes[at] = bytes[at] ^ 0x01;
  return { ...envelope, c: b64(bytes) };
}

async function mountSeal(root) {
  const input = root.querySelector("[data-seal-input]");
  const held = root.querySelector("[data-seal-held]");
  const clear = root.querySelector("[data-seal-clear]");
  const result = root.querySelector("[data-seal-result]");
  const keyOut = root.querySelector("[data-seal-key]");
  const btnKey = root.querySelector("[data-seal-open-key]");
  const btnNoKey = root.querySelector("[data-seal-open-nokey]");
  const btnAlter = root.querySelector("[data-seal-alter]");

  const key = await newKey();
  const raw = await crypto.subtle.exportKey("raw", key);
  // Shown truncated on purpose. It is a real key, it was made in this tab, and the point is
  // that it exists somewhere we are not: printing all 32 bytes would invite the reading that
  // the page is handing it to us.
  if (keyOut) keyOut.textContent = b64(raw).slice(0, 12) + "…";

  let envelope = null;

  function say(text, tone) {
    if (!result) return;
    result.textContent = text;
    result.className = "pf-result" + (tone ? " pf-result--" + tone : "");
  }

  async function reseal() {
    const text = (input && input.value) || "";
    // The shape a phone actually sends: an op and its arguments, sealed whole (js/phone.js,
    // send()). What the reader types is the part a person would recognize.
    envelope = await seal(key, { op: "agent_message", args: { text } });
    if (held) held.textContent = JSON.stringify(envelope, null, 2);
    if (clear) {
      clear.textContent = JSON.stringify(
        {
          status: "pending",
          updated_at: new Date().toISOString(),
          app_version: "0.2.1",
          payload: { v: 1, n: envelope.n.slice(0, 6) + "…", c: envelope.c.slice(0, 10) + "…" },
        },
        null,
        2,
      );
    }
    say("Sealed. Nothing has been sent anywhere: this ran in your browser.", "");
  }

  if (input) input.addEventListener("input", reseal);

  if (btnKey) {
    btnKey.addEventListener("click", async () => {
      try {
        const opened = await openSealed(key, envelope);
        say("Opened with the key: " + JSON.stringify(opened.args.text), "ok");
      } catch (e) {
        say("The browser refused to open it: " + e, "bad");
      }
    });
  }

  if (btnNoKey) {
    btnNoKey.addEventListener("click", async () => {
      // A different real key, then a real decrypt attempt. The failure below is WebCrypto
      // refusing, caught and printed; there is no branch here that decides to fail.
      const otherKey = await newKey();
      try {
        const opened = await openSealed(otherKey, envelope);
        say("Opened without the key, which should be impossible: " + JSON.stringify(opened), "bad");
      } catch (e) {
        say(
          "Refused. The browser would not decrypt it, and it did not say why, because a cipher " +
            "that explains its failures is a cipher that helps. This is what holding the row " +
            "without the key gets you.",
          "ok",
        );
      }
    });
  }

  if (btnAlter) {
    btnAlter.addEventListener("click", async () => {
      try {
        const opened = await openSealed(key, flipOneBit(envelope));
        say("Opened after a byte was changed, which should be impossible: " + JSON.stringify(opened), "bad");
      } catch (e) {
        say(
          "Refused, with the right key. One bit changed in the mailbox and the message will not " +
            "open at all, rather than opening into something else.",
          "ok",
        );
      }
    });
  }

  root.classList.add("is-live");
  await reseal();
}

/* ── Instrument 3: what this page asked for, and what it is allowed to ask for ───────────────

   Read out of the browser's own Resource Timing record rather than out of a list we keep,
   because a list we keep is a claim and the browser's record is evidence. Everything the page
   fetched is printed, ours and not ours, named and unnamed. A tracker added to this site
   would appear here without anyone updating this file, which is the only arrangement worth
   shipping: the check has to be able to fail.

   The second half prints the page's own Content-Security-Policy, which is not a promise about
   what we will fetch but a rule the browser enforces on what we can. */

const HOST_NOTES = [
  [/(^|\.)otianai\.com$/, "This site: the page, its stylesheet, its drawings, this script."],
  [/^fonts\.googleapis\.com$/, "Google Fonts: the stylesheet naming the typeface."],
  [/^fonts\.gstatic\.com$/, "Google Fonts: the font files themselves."],
  [/^www\.gstatic\.com$/, "Firebase’s sign-in code, which the account menu in the top bar runs."],
  [/^apis\.google\.com$/, "Google’s sign-in helper, loaded only if you press sign in."],
  [/googleapis\.com$/, "Firebase: your sign-in and your plan check."],
  [/firebasestorage\.app$/, "Firebase storage: add-on pictures."],
  [/^localhost$|^127\.0\.0\.1$/, "Your own computer: this page is being served locally."],
];

function noteFor(host) {
  for (const [pattern, note] of HOST_NOTES) if (pattern.test(host)) return note;
  return null;
}

function mountTraffic(root) {
  const list = root.querySelector("[data-net-list]");
  const count = root.querySelector("[data-net-count]");
  const again = root.querySelector("[data-net-again]");
  const cspList = root.querySelector("[data-csp-list]");
  if (!list) return;

  function draw() {
    const entries = performance.getEntriesByType ? performance.getEntriesByType("resource") : [];
    const byHost = new Map();
    // This document itself, which is not a "resource" entry and would otherwise go missing
    // from a list claiming to be everything.
    byHost.set(location.host, 1);
    for (const entry of entries) {
      let host;
      try { host = new URL(entry.name).host; } catch (e) { continue; }
      byHost.set(host, (byHost.get(host) || 0) + 1);
    }

    const hosts = [...byHost.entries()].sort((a, b) => b[1] - a[1]);
    list.innerHTML = "";
    let unknown = 0;
    for (const [host, n] of hosts) {
      const note = noteFor(host);
      if (!note) unknown += 1;
      const li = document.createElement("li");
      li.className = "pf-net-row" + (note ? "" : " is-unknown");
      const code = document.createElement("code");
      code.textContent = host;
      const span = document.createElement("span");
      span.textContent =
        note || "We do not recognize this one. If you are seeing it, we want to know.";
      const em = document.createElement("em");
      em.textContent = n === 1 ? "1 request" : n + " requests";
      li.append(code, span, em);
      list.append(li);
    }

    if (count) {
      count.textContent =
        hosts.length === 1
          ? "One host, and it is this one."
          : hosts.length + " hosts, counting this one" +
            (unknown ? ", and " + unknown + " we cannot name." : ", every one named below.");
    }
  }

  if (again) again.addEventListener("click", draw);

  // The policy the browser is holding this page to, printed directive by directive out of the
  // document rather than out of our description of it.
  const meta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
  if (cspList && meta) {
    cspList.innerHTML = "";
    for (const part of meta.content.split(";")) {
      const bits = part.trim().split(/\s+/);
      if (!bits[0]) continue;
      // The script hashes are the long half of this policy and say nothing to a reader: one
      // per inline script on the page, which is how the site allows its own and nothing else.
      const values = bits.slice(1).map((v) => (v.startsWith("'sha256-") ? "…" : v));
      const seen = new Set();
      const shownValues = values.filter((v) => (v === "…" ? !seen.has(v) && seen.add(v) : true));
      const li = document.createElement("li");
      const code = document.createElement("code");
      code.textContent = bits[0];
      const span = document.createElement("span");
      span.textContent = shownValues.join(" ") || "nothing at all";
      li.className = "pf-csp-row";
      li.append(code, span);
      cspList.append(li);
    }
  }

  root.classList.add("is-live");
  draw();
}

/* ── Instrument 4: the key that rides in the fragment ────────────────────────────────────────

   Pairing a phone hands it a key by QR code, and the key travels in the part of a URL after
   the '#'. That part is not sent to the server: it is not in the request line, which is why
   phone::pair_url puts it there and why a test called
   the_pairing_key_rides_in_the_fragment_never_the_query holds it there.

   Saying so is a claim. What this does instead is ask the browser: it fetches a small file
   from this site with a key on the end of the address, then prints the browser's own record
   of the request it made. Whatever that record says is what gets printed, including the
   inconvenient answer, because an instrument that can only produce one result is a picture. */

async function mountFragment(root) {
  const keyOut = root.querySelector("[data-frag-key]");
  const urlOut = root.querySelector("[data-frag-url]");
  const wireOut = root.querySelector("[data-frag-wire]");
  const recOut = root.querySelector("[data-frag-record]");
  const verdict = root.querySelector("[data-frag-verdict]");
  const button = root.querySelector("[data-frag-run]");

  // A real 256-bit key, in the base64url alphabet the pairing link uses so it survives a URL.
  const raw = crypto.getRandomValues(new Uint8Array(32));
  const key = b64(raw).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  const url = "https://otianai.com/app/#a1." + key + ".<one-time ticket>";
  if (keyOut) keyOut.textContent = key;
  if (urlOut) urlOut.textContent = url;
  if (wireOut) {
    wireOut.textContent = "GET /app/ HTTP/1.1\nHost: otianai.com";
  }

  async function run() {
    const probe = "wire-probe.txt?t=" + Date.now();
    const asked = probe + "#k=" + key;
    try {
      await fetch(asked, { cache: "no-store" });
    } catch (e) {
      if (verdict) verdict.textContent = "The test file would not load, so this one is inconclusive. Your browser’s Network tab answers the same question.";
      return;
    }
    // A resource entry is filed a moment after the response, not as part of it, so this
    // looks a few times before concluding the browser kept no record. Four frames is well
    // past what it takes and still too fast to feel like waiting.
    let last = null;
    for (let tries = 0; tries < 4 && !last; tries += 1) {
      await new Promise((r) => requestAnimationFrame(r));
      const entries = performance
        .getEntriesByType("resource")
        .filter((e) => e.name.includes(probe.split("?")[0]));
      last = entries[entries.length - 1] || null;
    }
    if (!last) {
      if (recOut) recOut.textContent = "your browser kept no record of it";
      if (verdict) {
        verdict.textContent =
          "Your browser did not record the request, so check it in the Network tab instead: the request line is what the server receives, and the key is not in it.";
      }
      return;
    }
    if (recOut) recOut.textContent = last.name;
    const carried = last.name.includes("#");
    if (verdict) {
      verdict.textContent = carried
        ? "Your browser kept the key in its own local record of the request. It still does not put it in the request line, which is the part the server receives: the Network tab shows that."
        : "That is your browser’s own record of what it just asked our server for. The key you can see above is not in it, and never left this tab.";
      verdict.className = "pf-result " + (carried ? "pf-result--warn" : "pf-result--ok");
    }
  }

  if (button) button.addEventListener("click", run);
  root.classList.add("is-live");
}

/* ── Wiring ─────────────────────────────────────────────────────────────────────────────────
   Each instrument mounts only if its markup is on the page, so this one file serves the two
   pages that use it without either of them carrying the other's code. If the browser cannot
   do real crypto, nothing is upgraded and the pages keep the numbers they shipped with. */

function boot() {
  const stale = document.querySelectorAll("[data-needs-crypto]");
  if (!canCrypto) {
    stale.forEach((el) => {
      el.textContent =
        "These run on your browser’s own cryptography, which it only offers over a secure connection. The numbers below are the real ones for the record shown; what is missing is your being able to change them.";
      el.hidden = false;
    });
    return;
  }

  const chain = document.querySelector("[data-chain]");
  if (chain) mountChain(chain);
  const sealBox = document.querySelector("[data-seal]");
  if (sealBox) mountSeal(sealBox);
  const traffic = document.querySelector("[data-net]");
  if (traffic) mountTraffic(traffic);
  const frag = document.querySelector("[data-frag]");
  if (frag) mountFragment(frag);
}

// Resource Timing is only complete once the page has finished loading, and instrument 3 prints
// it. Everything else is happy either way, so the whole boot waits rather than splitting.
if (document.readyState === "complete") boot();
else window.addEventListener("load", boot);
