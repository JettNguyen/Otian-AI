/* The drafts scene on archie/personal/: one draft at a time, and the reader's press lets the next one in.
 *
 * Three stations behind the phone, three cards in the thread, and the same index runs both. The
 * first card is in the markup already lit and waiting, so a reader with no script sees the
 * resting claim; this only adds the roll of the first message when the scene comes into view,
 * and then everything after a press. A press does what the app does (email/replies/actions.rs,
 * and InlineActions in archie-mobile's ui.tsx): the button stays lit and busy for BUSY_MS, the
 * card edits itself, the notice plays, Ember hops, and only then does the next station let go.
 * Under reduced motion the ball does not roll and the busy wait is skipped: the card just lands,
 * and just changes. */
(function () {
  "use strict";
  var scene = document.querySelector(".pd-scene");
  if (!scene) return;
  var $$ = function (s) { return Array.prototype.slice.call(scene.querySelectorAll(s)); };
  var cards = $$(".pd-card"), sts = $$(".pd-st"), chips = $$(".pd-chip"), balls = $$(".pd-ball");
  var scr = scene.querySelector(".dp-scr"), ember = scene.querySelector(".pd-ember");
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var BUSY_MS = 900, ROLL_MS = 1100, i = 0, started = false;

  function mark(n, cls) {
    sts.forEach(function (s, k) { s.classList.toggle(cls, k === n); });
    chips.forEach(function (c, k) { c.classList.toggle(cls, k === n); });
  }
  function land(n) {
    if (n >= cards.length) return;
    i = n;
    mark(n, "is-lit");
    var b = balls[n];
    if (reduced || !b) { cards[n].classList.add("is-in"); return; }
    b.classList.add("is-rolling");
    setTimeout(function () { b.classList.remove("is-rolling"); cards[n].classList.add("is-in"); }, ROLL_MS);
  }
  function start() {
    if (started) return;
    started = true;
    /* the first card is already there; the roll is the flourish that says where it came from */
    if (!reduced && balls[0]) { balls[0].classList.add("is-rolling"); setTimeout(function () { balls[0].classList.remove("is-rolling"); }, ROLL_MS); }
  }
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (es, o) {
      es.forEach(function (e) { if (e.isIntersecting) { start(); o.disconnect(); } });
    }, { threshold: 0.35 }).observe(scene);
  } else start();

  scene.addEventListener("click", function (ev) {
    var btn = ev.target.closest && ev.target.closest('[data-press="send"]');
    if (!btn) return;
    var card = btn.closest(".pd-card");
    if (!card || card.classList.contains("is-pressed")) return;
    card.classList.add("is-pressed");
    setTimeout(function () {
      card.classList.add("is-done");
      if (scr) { scr.classList.remove("is-noticed"); void scr.offsetWidth; scr.classList.add("is-noticed"); }
      sts.forEach(function (s, k) { if (k === i) { s.classList.remove("is-lit"); s.classList.add("is-done"); } });
      chips.forEach(function (c, k) { if (k === i) { c.classList.remove("is-lit"); c.classList.add("is-done"); } });
      if (window.Ember && ember && !reduced) window.Ember.act(ember, "hop");
      setTimeout(function () { land(i + 1); }, reduced ? 0 : 900);
    }, reduced ? 0 : BUSY_MS);
  });
})();
