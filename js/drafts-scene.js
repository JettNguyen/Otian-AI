/* The drafts scene on archie/personal/: one draft at a time, and a sent one is what lets the next in.
 *
 * Three stations behind the phone, three cards in the thread, and the same index runs both. The
 * first card is in the markup already lit and waiting, so a reader with no script sees the
 * resting claim. With the script the scene runs itself once it is in view: the first message
 * rolls, the card holds for a beat, Send is pressed, the next one lands, and after the third is
 * sent the thread clears and it starts over. A press by hand does the same thing at once, because
 * a reader who reaches for the button should get what they asked for (the homepage learned this
 * the other way round: a claim behind a click most readers never make is a claim most readers
 * never see). A press does what the app does (email/replies/actions.rs, and InlineActions in
 * archie-mobile's ui.tsx): the button stays lit and busy for BUSY_MS, the card edits itself, the
 * notice plays, Ember hops, and only then does the next station let go. Off screen the clock
 * stops where it is and picks up on the way back. Under reduced motion nothing runs on its own:
 * the first card is there, a press changes it, the next one just appears, and it does not loop. */
(function () {
  "use strict";
  var scene = document.querySelector(".pd-scene");
  if (!scene) return;
  var $$ = function (s) { return Array.prototype.slice.call(scene.querySelectorAll(s)); };
  var cards = $$(".pd-card"), sts = $$(".pd-st"), chips = $$(".pd-chip"), balls = $$(".pd-ball");
  var scr = scene.querySelector(".dp-scr"), ember = scene.querySelector(".pd-ember");
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  /* the hold is a reading time, not a beat: a card is about thirty words (Jett, 2026-09-18: "the
     messages do not hold long enough to comfortably read them"), and a reader who has read it
     has the button */
  var BUSY_MS = 900, ROLL_MS = 1100, HOLD_MS = 7000, AFTER_MS = 1600, REST_MS = 4000;
  var i = 0, started = false, visible = false;

  /* the box is drawn at one size and scaled to the scene, the way js/home.js fits the homepage
     scene: a transform, because the box is the root of the 3D context and zoom there loses the
     depth in WebKit */
  var box = scene.querySelector(".pd-box");
  function fit() {
    if (!box) return;
    var k = scene.clientWidth / box.offsetWidth;
    scene.style.setProperty("--pk", (k > 0 ? k : 1).toFixed(4));
  }
  fit();
  if ("ResizeObserver" in window) new ResizeObserver(fit).observe(scene);
  else window.addEventListener("resize", fit);

  /* one pending step at a time, so leaving the view pauses the clock and coming back resumes it */
  var timer = 0, next = null;
  function later(fn, ms) {
    clearTimeout(timer); next = fn;
    if (!visible) return;
    timer = setTimeout(function () { next = null; fn(); }, ms);
  }
  function cancel() { clearTimeout(timer); next = null; }

  function mark(n, cls) {
    sts.forEach(function (s, k) { s.classList.toggle(cls, k === n); });
    chips.forEach(function (c, k) { c.classList.toggle(cls, k === n); });
  }
  function roll(n, then) {
    var b = balls[n];
    if (reduced || !b) { then(); return; }
    b.classList.add("is-rolling");
    later(function () { b.classList.remove("is-rolling"); then(); }, ROLL_MS);
  }
  function hold(n) {
    if (reduced) return;
    later(function () { press(cards[n]); }, HOLD_MS);
  }
  function land(n) {
    i = n;
    mark(n, "is-lit");
    roll(n, function () { cards[n].classList.add("is-in"); hold(n); });
  }
  function reset() {
    cards.forEach(function (c) { c.classList.remove("is-in", "is-pressed", "is-done"); });
    sts.forEach(function (s) { s.classList.remove("is-lit", "is-done"); });
    chips.forEach(function (c) { c.classList.remove("is-lit", "is-done"); });
    if (scr) scr.classList.remove("is-noticed");
    land(0);
  }
  function press(card) {
    if (!card || card.classList.contains("is-pressed")) return;
    cancel();
    card.classList.add("is-pressed");
    later(function () {
      card.classList.add("is-done");
      if (scr) { scr.classList.remove("is-noticed"); void scr.offsetWidth; scr.classList.add("is-noticed"); }
      sts.forEach(function (s, k) { if (k === i) { s.classList.remove("is-lit"); s.classList.add("is-done"); } });
      chips.forEach(function (c, k) { if (k === i) { c.classList.remove("is-lit"); c.classList.add("is-done"); } });
      if (window.Ember && ember && !reduced) window.Ember.act(ember, "hop");
      if (i + 1 < cards.length) later(function () { land(i + 1); }, reduced ? 0 : AFTER_MS);
      else if (!reduced) later(reset, REST_MS);
    }, reduced ? 0 : BUSY_MS);
  }
  function start() {
    if (started) return;
    started = true;
    /* the first card is already there; the roll is the flourish that says where it came from */
    roll(0, function () { hold(0); });
  }

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        visible = e.isIntersecting;
        if (visible) { if (!started) start(); else if (next) later(next, 400); }
        else clearTimeout(timer);
      });
    }, { threshold: 0.35 }).observe(scene);
  } else { visible = true; start(); }

  scene.addEventListener("click", function (ev) {
    var btn = ev.target.closest && ev.target.closest('[data-press="send"]');
    if (!btn) return;
    press(btn.closest(".pd-card"));
  });
})();
