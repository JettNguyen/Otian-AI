// The four add-on submission forms (skill / worker / routine / personality).
//
// The fields are not written into the four HTML pages any more. They are BUILT from
// `js/addon-fields.js`, which is generated from `crates/archie-domain/src/addon_fields.rs` in the
// Archie repo, the same table the app's own "build your own" forms use and the same one
// `validate()` reads its character caps from. So the number this form stops accepting characters
// at is the number the installer rejects at, and adding a field to an add-on is one change in one
// place rather than four.
//
// The four pages now differ only in their hero copy and one attribute:
// `<form data-addon-type="…">`. Everything below is type-agnostic: sign-in, the fields, the
// required proof-of-work screenshot, and the Firestore write.
//
// Sign-in has two paths:
//   • Opened from inside Archie, the URL carries a one-time Firebase custom token (?ct=…) minted
//     for the developer's Archie account. We sign in with it, so the page shows the SAME account
//     they use in the app, fixing the "signed in as someone else" mismatch that a plain browser
//     Google session caused.
//   • Opened directly, it falls back to the Google popup.

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  signInWithCustomToken,
  signOut,
  GoogleAuthProvider,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  addDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

import { ADDON_SPEC } from "./addon-fields.js";

const firebaseConfig = {
  apiKey: "AIzaSyA46RqJV4tcJD8h4mdcSZ26dDoikA9L64M",
  authDomain: "archie-77170.firebaseapp.com",
  projectId: "archie-77170",
  storageBucket: "archie-77170.firebasestorage.app",
  messagingSenderId: "516396797258",
  appId: "1:516396797258:web:362cf2815128f3c82345b3",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

const MAX_SHOT_BYTES = 8 * 1024 * 1024; // 8 MB, matches the copy and the Storage rule.

const form = document.getElementById("skillForm");
const addonType = form.dataset.addonType || "skill";
const KIND = ADDON_SPEC.kinds[addonType];

const gate = document.getElementById("signinGate");
const done = document.getElementById("doneBanner");
const signinError = document.getElementById("signinError");

// ---------------------------------------------------------------------------------------------
// Building the form
// ---------------------------------------------------------------------------------------------

/** `required_variables` input types, matching what the app renders for each. */
const VARIABLE_TYPES = [
  ["text", "One line of text"],
  ["textarea", "A few lines"],
  ["select", "Pick from a list"],
  ["time", "A time of day"],
  ["timezone", "A time zone"],
];

const ADDON_KINDS = [
  ["skill", "Skill"],
  ["worker", "Worker"],
  ["routine", "Routine"],
  ["personality", "Personality"],
];

const SCHEDULE_TYPES = [
  ["daily_at", "Every day, at a time"],
  ["weekly_at", "Once a week, at a time"],
  ["interval", "Every so many minutes"],
];

const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

/** Turn a snake_case option value into the words a person reads. */
function humanize(value) {
  if (value === "custom") return "Other";
  if (value === "notify_telegram") return "Into their chat";
  if (value === "silent") return "Nowhere (it only files something away)";
  if (value === "fast") return "Economy (quick, cheapest)";
  if (value === "balanced") return "Balanced (recommended)";
  if (value === "deep") return "Best (deepest reasoning, priciest)";
  return value.charAt(0).toUpperCase() + value.slice(1).replace(/_/g, " ");
}

function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === undefined || v === null || v === false) continue;
    if (k === "class") node.className = v;
    else if (k === "text") node.textContent = v;
    else if (k.startsWith("on")) node.addEventListener(k.slice(2), v);
    else node.setAttribute(k, v === true ? "" : String(v));
  }
  for (const c of children) if (c) node.append(c);
  return node;
}

/**
 * The live "42 left" counter under a capped box.
 *
 * Quiet until the last quarter of the allowance, then in the warning color. A counter that is
 * always on reads as a demand for brevity on a field with plenty of room; what it prevents is the
 * other failure, where the box simply stops accepting letters and nothing says why.
 */
function attachCounter(input, max) {
  if (!max) return null;
  const out = el("span", {
    class: "form-hint",
    style: "float:right; font-variant-numeric:tabular-nums; margin-top:0;",
  });
  const update = () => {
    const left = max - input.value.length;
    if (left > max / 4) {
      out.textContent = "";
      out.style.color = "";
      return;
    }
    out.textContent = left <= 0 ? "Full" : `${left} left`;
    out.style.color = left <= 0 ? "var(--danger)" : "";
  };
  input.addEventListener("input", update);
  update();
  return out;
}

/** A labelled group: label (with a required star), the control, then the help line under it. */
function group(spec, control, extra) {
  const label = el("label", { class: "form-label", for: `f_${spec.key}` });
  label.append(spec.label);
  if (spec.required) label.append(el("span", { class: "required-star", "aria-hidden": "true", text: "*" }));
  else label.append(el("span", { class: "form-hint", style: "display:inline; margin-left:6px; font-weight:400;", text: "(optional)" }));
  const wrap = el("div", { class: "form-group" }, label, control);
  if (extra) wrap.append(extra);
  if (spec.help) wrap.append(el("p", { class: "form-hint", text: spec.help }));
  return wrap;
}

/** A repeatable list of rows, used for variables, dependencies, lists and sample exchanges. */
function rowEditor(spec, buildRow, addLabel) {
  const rows = el("div", { style: "display:flex; flex-direction:column; gap:14px;" });
  const addRow = () => {
    if (rows.children.length >= spec.max_items) return;
    const row = el("div", {
      class: "submit-row",
      style:
        "display:flex; flex-direction:column; gap:8px; border:1px solid var(--field-border); border-radius:var(--radius-sm); padding:14px;",
    });
    row.append(...buildRow());
    row.append(
      el("button", {
        type: "button",
        class: "btn btn-secondary btn-sm",
        style: "align-self:flex-start;",
        text: "Remove",
        onclick: () => {
          row.remove();
          refresh();
        },
      }),
    );
    rows.append(row);
    refresh();
  };
  const add = el("button", {
    type: "button",
    class: "btn btn-secondary btn-sm",
    style: "margin-top:10px;",
    text: addLabel,
    onclick: addRow,
  });
  const refresh = () => {
    add.disabled = rows.children.length >= spec.max_items;
    add.textContent = add.disabled ? `That is the limit of ${spec.max_items}` : addLabel;
  };
  refresh();
  return { node: el("div", {}, rows, add), rows };
}

/** Read every row of a row editor into an array of plain objects, skipping blank rows. */
function readRows(rows) {
  return Array.from(rows.children)
    .map((row) => {
      const out = {};
      row.querySelectorAll("[data-field]").forEach((input) => {
        out[input.dataset.field] =
          input.type === "checkbox" ? input.checked : input.value.trim();
      });
      return out;
    })
    .filter((o) => Object.values(o).some((v) => v !== "" && v !== false));
}

/** A small labelled input inside a repeatable row. */
function sub(name, placeholder, max, kind = "input") {
  const input = el(kind === "textarea" ? "textarea" : "input", {
    class: kind === "textarea" ? "form-textarea" : "form-input",
    "data-field": name,
    placeholder,
    maxlength: max || undefined,
    rows: kind === "textarea" ? 2 : undefined,
    style: kind === "textarea" ? "min-height:64px;" : undefined,
  });
  return input;
}

function subSelect(name, options) {
  const s = el("select", { class: "form-input", "data-field": name });
  for (const [value, text] of options) s.append(el("option", { value, text }));
  return s;
}

function subCheck(name, text) {
  const box = el("input", { type: "checkbox", "data-field": name });
  return el("label", { class: "checkbox-option" }, box, el("span", { text }));
}

/** The readers that pull each control's value back out at submit time, keyed by manifest key. */
const readers = {};

function renderField(spec) {
  const id = `f_${spec.key}`;
  const L = ADDON_SPEC.limits;

  switch (spec.control) {
    case "text": {
      const input = el("input", {
        class: "form-input",
        type: "text",
        id,
        maxlength: spec.max || undefined,
        placeholder: spec.placeholder,
      });
      readers[spec.key] = () => input.value.trim();
      return group(spec, input, attachCounter(input, spec.max));
    }

    case "textarea": {
      const input = el("textarea", {
        class: "form-textarea",
        id,
        rows: 4,
        maxlength: spec.max || undefined,
        placeholder: spec.placeholder,
        style: "min-height:96px;",
      });
      readers[spec.key] = () => input.value.trim();
      return group(spec, input, attachCounter(input, spec.max));
    }

    case "prompt": {
      const input = el("textarea", {
        class: "form-textarea",
        id,
        rows: 14,
        maxlength: spec.max || undefined,
        placeholder: spec.scaffold || spec.placeholder,
        style: "min-height:280px; font-family:ui-monospace,SFMono-Regular,Menlo,monospace; font-size:0.875rem;",
      });
      readers[spec.key] = () => input.value.trim();
      const extras = el("div", {}, attachCounter(input, spec.max));
      if (spec.scaffold) {
        extras.append(
          el("button", {
            type: "button",
            class: "btn btn-secondary btn-sm",
            style: "margin-top:8px;",
            text: "Start from the template",
            onclick: () => {
              if (input.value.trim()) return; // never clobber work in progress
              input.value = spec.scaffold;
              input.focus();
            },
          }),
        );
      }
      return group(spec, input, extras);
    }

    case "select": {
      const s = el("select", { class: "form-input", id });
      for (const value of spec.options) s.append(el("option", { value, text: humanize(value) }));
      readers[spec.key] = () => s.value;
      return group(spec, s);
    }

    case "number": {
      // Price is stored in cents but asked for in dollars, because nobody prices anything in
      // cents. Converted on read, so the payload matches the manifest.
      const input = el("input", {
        class: "form-input",
        type: "number",
        id,
        min: 0,
        max: 50,
        step: 1,
        placeholder: "e.g. 8. Free is 0, and the final price is settled together during review",
      });
      readers[spec.key] = () => Math.round((Number(input.value) || 0) * 100);
      return group(spec, input);
    }

    case "toggle": {
      const box = el("input", { type: "checkbox", id });
      readers[spec.key] = () => box.checked;
      return group(spec, el("div", { class: "checkbox-group" }, el("label", { class: "checkbox-option" }, box, el("span", { text: spec.label }))));
    }

    case "tags": {
      const input = el("input", {
        class: "form-input",
        type: "text",
        id,
        placeholder: "comma-separated, e.g. email, inbox, unread",
      });
      readers[spec.key] = () =>
        input.value
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
          .slice(0, spec.max_items)
          .map((t) => t.slice(0, spec.max));
      return group(spec, input);
    }

    case "lines": {
      const input = el("textarea", {
        class: "form-textarea",
        id,
        rows: 4,
        placeholder: spec.placeholder || "One per line",
        style: "min-height:96px;",
      });
      readers[spec.key] = () =>
        input.value
          .split("\n")
          .map((t) => t.trim())
          .filter(Boolean)
          .slice(0, spec.max_items)
          .map((t) => t.slice(0, spec.max));
      return group(spec, input, el("p", { class: "form-hint", text: `One per line, up to ${spec.max_items}.` }));
    }

    case "integrations": {
      const wrap = el("div", { class: "checkbox-group" });
      const boxes = [];
      for (const it of ADDON_SPEC.integrations) {
        const box = el("input", { type: "checkbox", value: it.id });
        boxes.push(box);
        wrap.append(
          el(
            "label",
            { class: "checkbox-option" },
            box,
            el("span", {}, el("strong", { text: it.name }), el("span", { class: "form-hint", style: "display:block; margin-top:2px;", text: it.grants })),
          ),
        );
      }
      readers[spec.key] = () => boxes.filter((b) => b.checked).map((b) => b.value);
      return group(spec, wrap);
    }

    case "variables": {
      const ed = rowEditor(
        spec,
        () => [
          sub("label", "What the owner sees, e.g. Your timezone", L.description),
          subSelect("input_type", VARIABLE_TYPES),
          sub("key", "Referenced in the prompt as {{KEY}}, e.g. TIMEZONE", 64),
          sub("help", "The line under the field, if it needs one", 240),
        ],
        "Add something the owner fills in",
      );
      readers[spec.key] = () => readRows(ed.rows);
      return group(spec, ed.node);
    }

    case "addons": {
      const ed = rowEditor(
        spec,
        () => [
          subSelect("kind", ADDON_KINDS),
          sub("id", "Its id in the store, e.g. researcher", 64),
          sub("reason", 'Finish "so it can …", e.g. check live scores on the web', 160),
          subCheck("required", "It genuinely cannot work without this"),
        ],
        "Add a dependency",
      );
      readers[spec.key] = () => readRows(ed.rows);
      return group(spec, ed.node);
    }

    case "collections": {
      const ed = rowEditor(
        spec,
        () => [
          sub("name", "What the owner calls it, e.g. Your teams", 64),
          sub("description", "What belongs in it, in their words", L.description),
          sub("columns", "Its columns, comma-separated, e.g. team, league, notes", 240),
          subCheck("seed", "The skill has nothing to do until this has a first entry"),
        ],
        "Add a list",
      );
      readers[spec.key] = () => readRows(ed.rows);
      return group(spec, ed.node);
    }

    case "exchanges": {
      const ed = rowEditor(
        spec,
        () => [
          sub("user", "What someone types", 500, "textarea"),
          sub("bot", "What this voice says back", 1000, "textarea"),
        ],
        "Add an exchange",
      );
      readers[spec.key] = () => readRows(ed.rows);
      return group(spec, ed.node);
    }

    case "schedule": {
      // Structured, not prose. The old form asked for the cadence inside the prompt paragraph
      // ("tell us how often it should run"), which meant no submission could become a manifest
      // without a human first decoding an English sentence into an hour and a minute.
      const type = subSelect("type", SCHEDULE_TYPES);
      const time = el("input", { class: "form-input", type: "time", value: "08:00" });
      const day = subSelect("weekday", WEEKDAYS.map((d, i) => [String(i), d]));
      const minutes = el("input", { class: "form-input", type: "number", min: 1, value: 60 });
      const tz = el("input", {
        class: "form-input",
        type: "text",
        placeholder: "Leave blank to run in each owner's own time zone",
      });
      const dayRow = el("div", { style: "margin-top:10px;" }, el("p", { class: "form-hint", style: "margin-top:0;", text: "Which day" }), day);
      const timeRow = el("div", { style: "margin-top:10px;" }, el("p", { class: "form-hint", style: "margin-top:0;", text: "What time" }), time);
      const minRow = el("div", { style: "margin-top:10px;" }, el("p", { class: "form-hint", style: "margin-top:0;", text: "How many minutes apart" }), minutes);
      const tzRow = el("div", { style: "margin-top:10px;" }, el("p", { class: "form-hint", style: "margin-top:0;", text: "Time zone" }), tz);
      const sync = () => {
        dayRow.style.display = type.value === "weekly_at" ? "" : "none";
        timeRow.style.display = type.value === "interval" ? "none" : "";
        tzRow.style.display = type.value === "interval" ? "none" : "";
        minRow.style.display = type.value === "interval" ? "" : "none";
      };
      type.addEventListener("change", sync);
      sync();
      readers[spec.key] = () => {
        if (type.value === "interval") {
          return { type: "interval", seconds: Math.max(60, (Number(minutes.value) || 60) * 60) };
        }
        const [h, m] = (time.value || "08:00").split(":").map(Number);
        const base = { hour: h || 0, minute: m || 0, tz: tz.value.trim() || null };
        return type.value === "weekly_at"
          ? { type: "weekly_at", weekday: Number(day.value) || 0, ...base }
          : { type: "daily_at", ...base };
      };
      return group(spec, el("div", {}, type, dayRow, timeRow, minRow, tzRow));
    }

    default:
      return null;
  }
}

/** The two things every submission carries that no manifest does: proof, and a licence. */
let shotInput;
let licenseBox;

function buildForm() {
  const host = document.getElementById("specFields");

  host.append(
    el("p", {
      class: "form-hint",
      style: "margin:0 0 26px; font-size:0.9rem; line-height:1.6;",
      text: KIND.blurb,
    }),
  );

  KIND.sections.forEach((section, i) => {
    const box = el("fieldset", { style: "border:0; padding:0; margin:0 0 34px;" });
    box.append(
      el(
        "legend",
        { style: "padding:0; margin-bottom:6px;" },
        el("span", { class: "section-label", style: "margin-right:8px;", text: `${i + 1} of ${KIND.sections.length + 1}` }),
        el("strong", { style: "font-size:1.05rem;", text: section.title }),
      ),
    );
    if (section.blurb) {
      box.append(el("p", { class: "form-hint", style: "margin:0 0 18px;", text: section.blurb }));
    }
    for (const spec of section.fields) {
      const node = renderField(spec);
      if (node) box.append(node);
    }
    host.append(box);
  });

  // Proof of work. Last, because it is the one thing that cannot be done from this page: you have
  // to have built the add-on in Archie and watched it run.
  const proof = el("fieldset", { style: "border:0; padding:0; margin:0 0 34px;" });
  proof.append(
    el(
      "legend",
      { style: "padding:0; margin-bottom:6px;" },
      el("span", { class: "section-label", style: "margin-right:8px;", text: `${KIND.sections.length + 1} of ${KIND.sections.length + 1}` }),
      el("strong", { style: "font-size:1.05rem;", text: "Show it working" }),
    ),
  );
  shotInput = el("input", {
    class: "form-input",
    type: "file",
    id: "f_screenshot",
    accept: "image/png,image/jpeg,image/webp",
  });
  proof.append(
    group(
      {
        key: "screenshot",
        label: "Screenshot of it running",
        required: true,
        help: `A screenshot of your ${addonType} working inside Archie. PNG, JPG or WebP, up to 8 MB. We don't list anything we haven't seen work.`,
      },
      shotInput,
    ),
  );
  licenseBox = el("input", { type: "checkbox", id: "licenseGranted" });
  proof.append(
    el(
      "div",
      { class: "form-group" },
      el(
        "label",
        { class: "checkbox-option", style: "align-items:flex-start;" },
        licenseBox,
        el("span", {
          style: "line-height:1.55;",
          text:
            "I built this (or have the rights to it) and grant Otian AI a licence to review, adapt, and publish it on the Archie marketplace. Listing and pricing are settled together during review.",
        }),
      ),
    ),
  );
  host.append(proof);
}

// ---------------------------------------------------------------------------------------------
// Sign-in
// ---------------------------------------------------------------------------------------------

// Panel shown to a signed-in account that isn't an active Archie user. Submissions require an active
// subscription: we only list add-ons that were built and tested inside the app, and you can't do
// that without one. The server-side gate is the Firestore /submissions rule and the Storage rule;
// this is only the friendly front door so a non-subscriber sees WHY up front instead of filling out
// the whole form and hitting a permission error at submit. Built in JS so all four submit pages
// inherit it without editing their HTML.
const subGate = document.createElement("div");
subGate.className = "cta-banner fade-up";
subGate.style.display = "none";
subGate.innerHTML =
  "<h2>You need an active Archie subscription to submit</h2>" +
  "<p>Add-ons are only listed once they've been built and tested inside Archie, so submitting one " +
  'requires an active account. Signed in as <strong id="subGateEmail"></strong>.</p>' +
  '<a href="../../../questionnaire/" class="btn btn-primary btn-lg">Get Archie</a>' +
  '<p style="margin-top:0.9rem; font-size:0.9rem;"><a href="#" id="subGateSignOut">Use a different account</a></p>';
form.parentNode.insertBefore(subGate, form);
subGate.querySelector("#subGateSignOut").addEventListener("click", (e) => {
  e.preventDefault();
  signOut(auth);
});

// Whether the signed-in account may submit: the same "active Archie account" the app and the
// security rules require (admin / client / active subscriber). Reads the caller's own user doc,
// which the Firestore rules allow. Fails OPEN on a read error: a network blip shouldn't lock out a
// real subscriber, and the /submissions rule still blocks the actual write for anyone who isn't.
async function isEntitledUser(user) {
  try {
    const snap = await getDoc(doc(db, "users", user.uid));
    if (!snap.exists()) return false;
    const d = snap.data();
    const tier = d.access_tier || "none";
    return (
      tier === "admin" ||
      tier === "client" ||
      (tier === "subscriber" && d.subscription_status === "active")
    );
  } catch (e) {
    return true;
  }
}

function showSigninError(msg) {
  signinError.textContent = msg;
  signinError.style.display = "";
}

buildForm();

// SSO from Archie: a one-time custom token in the URL. Consume it, then scrub it from the address
// bar / history so the token isn't left sitting in the URL.
const params = new URLSearchParams(window.location.search);
const customToken = params.get("ct");
if (customToken) {
  gate.querySelector("h2").textContent = "Signing you in…";
  signInWithCustomToken(auth, customToken).catch((e) => {
    showSigninError("Couldn't sign in from Archie automatically. Sign in with Google instead. (" + (e.code || e.message) + ")");
  });
  const clean = window.location.pathname;
  window.history.replaceState({}, document.title, clean);
}

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    gate.querySelector("h2").textContent = "Sign in to submit";
    gate.style.display = "";
    form.style.display = "none";
    subGate.style.display = "none";
    return;
  }
  const who = user.email || user.displayName || "your account";
  // Keep the gate visible with a "checking" note during the entitlement read, so there's no flash of
  // empty page between sign-in and whichever panel (form vs. subscribe) we end up showing.
  gate.querySelector("h2").textContent = "Checking your account…";
  gate.style.display = "";
  const entitled = await isEntitledUser(user);
  gate.style.display = "none";
  if (entitled) {
    subGate.style.display = "none";
    form.style.display = "";
    document.getElementById("signedInAs").textContent = who;
  } else {
    form.style.display = "none";
    subGate.style.display = "";
    subGate.querySelector("#subGateEmail").textContent = who;
  }
});

document.getElementById("btnSignIn").addEventListener("click", async () => {
  signinError.style.display = "none";
  try {
    await signInWithPopup(auth, new GoogleAuthProvider());
  } catch (e) {
    if (e.code !== "auth/popup-closed-by-user") showSigninError(e.message);
  }
});

document.getElementById("btnSignOut").addEventListener("click", (e) => {
  e.preventDefault();
  signOut(auth);
});

// ---------------------------------------------------------------------------------------------
// Submitting
// ---------------------------------------------------------------------------------------------

/** The manifest key holding this kind's main prompt, whatever the kind calls it. */
const PROMPT_KEY = {
  skill: "template_md",
  worker: "instructions",
  routine: "default_action.prompt",
  personality: "system_prompt_template",
}[addonType];

/** Every required field that is empty, named the way its label reads. */
function missingRequired() {
  return KIND.sections
    .flatMap((s) => s.fields)
    .filter((f) => f.required)
    .filter((f) => {
      const v = readers[f.key] ? readers[f.key]() : "";
      if (Array.isArray(v)) return v.length === 0;
      if (typeof v === "object" && v !== null) return false; // a schedule always has a value
      return !String(v || "").trim();
    })
    .map((f) => f.label);
}

const formError = document.getElementById("formError");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  formError.style.display = "none";
  const user = auth.currentUser;
  if (!user) return;

  const missing = missingRequired();
  if (missing.length) {
    return fail(`Still needed: ${missing.join(", ")}.`);
  }
  if (!licenseBox.checked) {
    return fail("Tick the licence box so we know you have the rights to what you're submitting.");
  }
  const shot = shotInput.files && shotInput.files[0];
  if (!shot) {
    return fail("Attach a screenshot showing your add-on working; it's required for review.");
  }
  if (!shot.type.startsWith("image/")) {
    return fail("The proof needs to be an image (PNG, JPG, or WebP).");
  }
  if (shot.size > MAX_SHOT_BYTES) {
    return fail("That screenshot is over 8 MB. Please attach a smaller image.");
  }

  const btn = document.getElementById("btnSubmit");
  btn.disabled = true;
  btn.classList.add("is-busy");
  btn.textContent = "Uploading…";
  try {
    // Upload the proof screenshot first: a submission with no proof is worthless, so we don't want
    // to create the doc unless the image lands. Path is namespaced to the uid so the Storage rule
    // can scope writes to the owner. The extension is derived from the mime type, not the (spoofable)
    // filename.
    const ext = shot.type === "image/png" ? "png" : shot.type === "image/webp" ? "webp" : "jpg";
    const stamp = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const shotRef = ref(storage, `submissions/${user.uid}/${addonType}-${stamp}.${ext}`);
    await uploadBytes(shotRef, shot, { contentType: shot.type });
    const screenshot_url = await getDownloadURL(shotRef);

    btn.textContent = "Submitting…";

    // Every answered field, under the manifest key it belongs to. Dotted keys stay dotted rather
    // than being nested: review reads this document, and `default_action.prompt` says where the
    // value goes more plainly than a nested object does.
    const fields = {};
    for (const [key, read] of Object.entries(readers)) {
      const v = read();
      if (v === "" || v === false || (Array.isArray(v) && v.length === 0)) continue;
      fields[key] = v;
    }

    // `name`, `description` and `template_md` are also written at the top level. The Firestore
    // rule checks those three by name and size, and it is deployed separately from this page, so
    // renaming them here would reject every submission until the rule caught up. `template_md`
    // carries whichever prompt this kind has.
    await addDoc(collection(db, "submissions"), {
      type: addonType,
      submitter_uid: user.uid,
      submitter_email: user.email || "",
      name: fields.name || "",
      description: fields.description || "",
      template_md: fields[PROMPT_KEY] || "",
      fields,
      screenshot_url,
      license_granted: true,
      submitted_at: serverTimestamp(),
    });
    form.style.display = "none";
    done.style.display = "";
    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (err) {
    fail("Submission failed: " + (err.message || err));
    btn.disabled = false;
    btn.classList.remove("is-busy");
    btn.textContent = "Submit for review";
  }

  // Hoisted within this handler, so the validation returns above (`return fail(…)`) reach it.
  function fail(msg) {
    formError.textContent = msg;
    formError.style.display = "";
    formError.scrollIntoView({ behavior: "smooth", block: "center" });
  }
});
