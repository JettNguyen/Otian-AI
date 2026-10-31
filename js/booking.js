// booking.js: the site's own picker for booking a call on Jett's calendar (October 27, 2026).
//
// It replaced Google's booking pages, which sat in frames on contact/ and questionnaire/ and could
// not be styled past a color filter. The open times come from the Render service (/booking/slots),
// which reads the calendar's busy times; a booking goes back through it (/booking/book), which
// writes the event with the reader as its guest, and Google Calendar sends them the invite. The
// schedule itself lives in the Archie repo, in stripe-webhook/booking.js.
//
// Every picker starts as a plain link to Google's booking page, written in the HTML, so a reader
// without scripts still books. This file swaps that link for the picker, and brings it back when
// the service is switched off (503) or cannot be reached. The service sleeps when nobody has used
// it for a while and can take about a minute to wake, so the link stays on screen while it does.
//
// Markup: <div class="bk" data-booking="discovery|setup" data-fallback="<Google booking page>">.
// A link or button with data-booking-open="<id>" shows the hidden picker with that id instead of
// leaving the page. questionnaire.js sets data-name and data-email on its picker, and the form
// starts from them.

import { postJson } from "./service-api.js?v=20261030-1";

const LOCALE = "en-US";
const DAYS_SHOWN = 5;
const SLOW_MS = 5000;
const MAIL = "questions@otianai.com";

const fmtTime = new Intl.DateTimeFormat(LOCALE, { hour: "numeric", minute: "2-digit" });
const fmtWeekday = new Intl.DateTimeFormat(LOCALE, { weekday: "short" });
const fmtWeekdayLong = new Intl.DateTimeFormat(LOCALE, { weekday: "long" });
const fmtShortDate = new Intl.DateTimeFormat(LOCALE, { month: "short", day: "numeric" });
const fmtLongDate = new Intl.DateTimeFormat(LOCALE, { weekday: "long", month: "long", day: "numeric" });
const longWhen = (ms) => `${fmtLongDate.format(ms)} at ${fmtTime.format(ms)}`;

// "Eastern Time" where the browser can say it that way, "Eastern Daylight Time" where it cannot.
function zoneName() {
  for (const style of ["longGeneric", "long"]) {
    try {
      const part = new Intl.DateTimeFormat(LOCALE, { timeZoneName: style }).formatToParts(new Date())
        .find((p) => p.type === "timeZoneName");
      if (part) return part.value;
    } catch (e) { /* an older engine without longGeneric */ }
  }
  return "your time zone";
}

// One small element builder, so the markup below reads as markup.
function h(tag, attrs, ...kids) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k === "class") el.className = v;
    else if (k === "text") el.textContent = v;
    else if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
    else el.setAttribute(k, v === true ? "" : v);
  }
  for (const kid of kids.flat()) if (kid != null && kid !== false) el.append(kid);
  return el;
}

const ARROW = (d) => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("aria-hidden", "true");
  svg.innerHTML = `<polyline points="${d}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
  return svg;
};

// Two pickers of one kind on a page (the questionnaire has two) share one request.
const loads = new Map();
function loadSlots(kind, fresh = false) {
  if (fresh) loads.delete(kind);
  if (!loads.has(kind)) {
    const p = postJson("/booking/slots", { kind }, 15000)
      // A first attempt that ran out of time is usually the service waking; the second gets the
      // minute the wake can take.
      .catch((e) => (e.kind === "network" ? postJson("/booking/slots", { kind }, 75000) : Promise.reject(e)))
      .catch((e) => { loads.delete(kind); throw e; });
    loads.set(kind, p);
  }
  return loads.get(kind);
}

const dayKey = (ms) => { const d = new Date(ms); return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`; };

function picker(root) {
  const kind = root.dataset.booking;
  const fallback = root.dataset.fallback;
  const uid = `bk-${kind}-${Math.random().toString(36).slice(2, 7)}`;
  let days = [];       // [{ key, first, slots: [ms] }]
  let page = 0, dayIdx = 0, chosen = null, minutes = 30;
  // Built once and kept across re-renders and reloads, so a reader who changes the time, or whose
  // time was just taken, keeps what they typed.
  let form = null;

  const googleLink = (text) => h("a", { href: fallback, target: "_blank", rel: "noopener", text });

  function show(...kids) { root.replaceChildren(...kids.filter(Boolean)); }

  function showFallback(lead) {
    show(h("p", { class: "bk-status" }, lead, " ", googleLink("Pick a time on our Google booking page"), "."));
  }

  function showLoading() {
    const status = h("p", { class: "bk-status is-loading", role: "status", text: "Checking open times…" });
    show(status, h("p", { class: "bk-alt" }, "Or ", googleLink("use our Google booking page"), "."));
    const slow = setTimeout(() => {
      status.textContent = "Still checking. Our booking service can take up to a minute to wake up.";
    }, SLOW_MS);
    return () => clearTimeout(slow);
  }

  async function load(fresh = false) {
    const stop = showLoading();
    try {
      const data = await loadSlots(kind, fresh);
      minutes = data.minutes || minutes;
      const byDay = new Map();
      for (const iso of data.slots || []) {
        const ms = Date.parse(iso);
        const k = dayKey(ms);
        if (!byDay.has(k)) byDay.set(k, { key: k, first: ms, slots: [] });
        byDay.get(k).slots.push(ms);
      }
      days = [...byDay.values()];
      page = 0; dayIdx = 0; chosen = null;
      if (!days.length) {
        show(h("p", { class: "bk-status" }, "No open times right now. Email ", h("a", { href: `mailto:${MAIL}`, text: MAIL }), " and we'll find one."));
      } else {
        render();
      }
    } catch (e) {
      if (e.kind === "http" && e.status === 503) showFallback("Open times aren't showing here today.");
      else showFallback("We couldn't load open times.");
    } finally {
      stop();
    }
  }

  function render(focusWhen = false) {
    const pageDays = days.slice(page * DAYS_SHOWN, page * DAYS_SHOWN + DAYS_SHOWN);
    const day = days[dayIdx];
    const lastPage = Math.ceil(days.length / DAYS_SHOWN) - 1;
    const first = pageDays[0].first, last = pageDays[pageDays.length - 1].first;
    const range = pageDays.length > 1 ? `${fmtShortDate.format(first)} to ${fmtShortDate.format(last)}` : fmtShortDate.format(first);

    const turn = (step) => () => { page += step; dayIdx = page * DAYS_SHOWN; render(); };
    const nav = h("div", { class: "bk-nav" },
      h("button", { type: "button", class: "bk-arrow", "aria-label": "Earlier days", disabled: page === 0, onclick: turn(-1) }, ARROW("15 18 9 12 15 6")),
      h("p", { class: "bk-range", "aria-live": "polite", text: range }),
      h("button", { type: "button", class: "bk-arrow", "aria-label": "Later days", disabled: page >= lastPage, onclick: turn(1) }, ARROW("9 18 15 12 9 6")),
    );

    const dayRow = h("div", { class: "bk-days", role: "group", "aria-label": "Day" },
      pageDays.map((d, i) => {
        const idx = page * DAYS_SHOWN + i;
        return h("button", {
          type: "button", class: "bk-day", "aria-pressed": String(idx === dayIdx),
          "aria-label": fmtLongDate.format(d.first),
          onclick: () => { dayIdx = idx; render(); },
        },
          h("span", { class: "bk-day-wd", text: fmtWeekday.format(d.first) }),
          h("span", { class: "bk-day-n", text: String(new Date(d.first).getDate()) }));
      }));

    const timeRow = h("div", { class: "bk-times", role: "group", "aria-label": `Times on ${fmtLongDate.format(day.first)}` },
      day.slots.map((ms) => h("button", {
        type: "button", class: "bk-time", "aria-pressed": String(ms === chosen),
        onclick: () => { chosen = ms; render(true); },
      }, fmtTime.format(ms))));

    if (chosen && !form) form = buildForm();
    if (chosen) {
      form.querySelector(".bk-when").textContent = `${longWhen(chosen)}, for ${minutes} minutes`;
      form.querySelector(".bk-book").textContent = `Book ${fmtWeekdayLong.format(chosen)} at ${fmtTime.format(chosen)}`;
    }

    show(h("p", { class: "bk-zone", text: `Times are in ${zoneName()}.` }), nav, dayRow, timeRow, chosen ? form : null);
    if (chosen && focusWhen) form.querySelector(".bk-when").focus();
  }

  function buildForm() {
    const field = (id, label, input, extra) => h("div", { class: "form-group" },
      h("label", { class: "form-label", for: id }, ...label), input, extra);
    const name = h("input", { class: "form-input", id: `${uid}-name`, name: "name", autocomplete: "name", required: true, maxlength: "80" });
    const email = h("input", { class: "form-input", id: `${uid}-email`, name: "email", type: "email", autocomplete: "email", required: true, maxlength: "254" });
    const note = h("textarea", { class: "form-textarea", id: `${uid}-note`, name: "note", rows: "3", maxlength: "500" });
    name.value = root.dataset.name || "";
    email.value = root.dataset.email || "";
    const msg = h("p", { class: "bk-msg", role: "alert" });
    const btn = h("button", { type: "submit", class: "btn btn-primary bk-book" });

    const built = h("form", { class: "bk-form", novalidate: true },
      h("p", { class: "bk-when", tabindex: "-1" }),
      h("div", { class: "bk-fields" },
        field(`${uid}-name`, ["Your name"], name),
        field(`${uid}-email`, ["Email"], email, h("p", { class: "form-hint", text: "Google Calendar sends the invite here." }))),
      field(`${uid}-note`, ["Anything we should know first?", h("span", { class: "bk-opt", text: "Optional" })], note),
      // Hidden from people; scripts fill in every field they find.
      h("input", { class: "bk-hp", type: "text", name: "_gotcha", tabindex: "-1", autocomplete: "off", "aria-hidden": "true" }),
      btn, msg);

    built.addEventListener("submit", async (ev) => {
      ev.preventDefault();
      msg.replaceChildren();
      if (!name.value.trim()) { msg.textContent = "Add your name."; name.focus(); return; }
      if (!email.checkValidity() || !email.value.trim()) { msg.textContent = "Check your email address. The invite goes there."; email.focus(); return; }
      btn.disabled = true; btn.classList.add("is-busy"); btn.setAttribute("aria-busy", "true");
      try {
        const out = await postJson("/booking/book", {
          kind, start: new Date(chosen).toISOString(),
          name: name.value, email: email.value, note: note.value,
          _gotcha: built.elements._gotcha.value,
        }, 30000);
        done(out, email.value.trim());
      } catch (e) {
        btn.disabled = false; btn.classList.remove("is-busy"); btn.removeAttribute("aria-busy");
        failed(e, msg);
      }
    });
    return built;
  }

  function failed(e, msg) {
    const existing = e.body && e.body.existing;
    if (e.kind === "http" && e.status === 409 && existing) {
      msg.textContent = `You already have a call on ${longWhen(Date.parse(existing))}. To change it, reply to its invite.`;
    } else if (e.kind === "http" && e.status === 409) {
      msg.replaceChildren();
      load(true).then(() => {
        const status = h("p", { class: "bk-msg", role: "alert", text: "Someone just took that time. Pick another one." });
        root.querySelector(".bk-times")?.after(status);
      });
    } else if (e.kind === "http" && e.status === 400) {
      msg.textContent = e.message;
    } else if (e.kind === "http" && e.status === 429) {
      msg.append("That's a lot of tries from here. Email ", h("a", { href: `mailto:${MAIL}`, text: MAIL }), " and we'll find a time.");
    } else if (e.kind === "http" && e.status === 503) {
      showFallback("Booking here is switched off right now.");
    } else {
      msg.append("We couldn't reach our booking service. Try again in a moment, or ", googleLink("use our Google booking page"), ".");
    }
  }

  function done(out, address) {
    const start = Date.parse(out.start);
    const box = h("div", { class: "bk-done", tabindex: "-1" },
      h("div", { class: "bk-done-mark", "aria-hidden": "true" }, ARROW("20 6 9 17 4 12")),
      h("p", { class: "bk-done-title", text: `You're booked for ${longWhen(start)}, ${zoneName()}.` }),
      h("p", { text: `Google Calendar is sending the invite to ${address}, with the link to join. To change the time, reply to the invite.` }));
    show(box);
    box.focus();
  }

  load();
}

function start() {
  document.querySelectorAll(".bk[data-booking]").forEach(picker);
  document.querySelectorAll("[data-booking-open]").forEach((opener) => {
    const target = document.getElementById(opener.dataset.bookingOpen);
    if (!target) return;
    opener.setAttribute("aria-expanded", "false");
    opener.setAttribute("aria-controls", target.id);
    opener.addEventListener("click", (ev) => {
      ev.preventDefault();
      target.hidden = false;
      opener.setAttribute("aria-expanded", "true");
      target.scrollIntoView({ block: "nearest", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    });
  });
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
else start();
