/* At the checkout, on archie/websites/: the agent works through a shop in an ordinary browser, and
 * one switch decides only the ending.
 *
 * The scene is markup and CSS. Every timed piece carries data-in (the step it arrives on) and may
 * carry data-out (the step it leaves on) or data-out-on (the step it leaves on, with the switch on
 * only); a button that gets pressed carries data-press, or data-press-on when only the switch-on
 * ending presses it. This script runs the clock: it counts the steps, marks what is showing with
 * .is-in and what is pressed with .is-pressed, moves the pointer to each thing pressed, and tells
 * Ember what it is doing. The two endings are the checkbox's alone (.wb-on and .wb-off, in CSS).
 * Both endings stop at Place order and send the stop card; only with the switch on does the card
 * offer "Press it for me", and the run then taps it, and only then is Place order pressed.
 *
 * It plays once the figure is in view and pauses when it leaves. After an ending has held long
 * enough to read, it flips the switch and plays the other one, the way js/switch-cycle.js flips
 * the switches on how-it-works/, and it stops flipping for good the moment the reader uses the
 * switch. A flip by hand does not start the run over: it goes back to the moment before the last
 * button, which is the only part the switch changes, so the reader sees their choice land at once.
 *
 * Under reduced motion nothing plays: the scene shows the finished run for whichever way the
 * switch is set, and a flip redraws it.
 *
 * The box is fitted to its column with a transform and never with zoom, because it is the root of
 * a 3D context and WebKit does not carry one through zoom (CLAUDE.md, the drafts scene's lesson).
 */
(function () {
  "use strict";
  var fig = document.querySelector(".wb-figure");
  if (!fig) return;
  var scene = fig.querySelector(".wb-scene"), box = fig.querySelector(".wb-box");
  var sw = fig.querySelector("#wb-buy");
  if (!scene || !box || !sw) return;
  var $$ = function (s) { return Array.prototype.slice.call(fig.querySelectorAll(s)); };

  function fit() {
    var w = box.offsetWidth;
    if (!w) return;
    scene.style.setProperty("--pk", (scene.clientWidth / w).toFixed(4));
  }
  fit();
  if ("ResizeObserver" in window) new ResizeObserver(fit).observe(scene);
  else window.addEventListener("resize", fit);

  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var timed = $$("[data-in], [data-out], [data-out-on]");
  var pressed = $$("[data-press], [data-press-on]");
  var page = fig.querySelector(".cr-page"), cursor = fig.querySelector(".cr-cursor");
  var ember = fig.querySelector(".wb-ember");
  timed.forEach(function (el) { el.classList.add("wb-t"); });
  fig.classList.add("is-live");

  var LAST = 12;
  function on() { return sw.checked; }
  function num(el, a, dflt) { var v = el.getAttribute(a); return v === null ? dflt : +v; }

  /* Draw step n: what is showing, what is pressed. */
  function draw(n) {
    timed.forEach(function (el) {
      var inn = num(el, "data-in", 0), out = num(el, "data-out", Infinity);
      if (on()) out = Math.min(out, num(el, "data-out-on", Infinity));
      el.classList.toggle("is-in", n >= inn && n < out);
    });
    pressed.forEach(function (el) {
      var p = num(el, "data-press", Infinity);
      if (on()) p = Math.min(p, num(el, "data-press-on", Infinity));
      el.classList.toggle("is-pressed", n >= p);
    });
  }

  /* The pointer, to the middle of the thing named, measured through the zoom and the scene's own
     transforms: both rectangles are projected the same way, so their ratio is the page's own px. */
  function aim(name) {
    if (!page || !cursor) return;
    if (!name) { cursor.style.left = ""; cursor.style.top = ""; return; }
    var el = fig.querySelector('[data-aim="' + name + '"]');
    if (!el || !el.offsetWidth) return;
    var pr = page.getBoundingClientRect(), er = el.getBoundingClientRect();
    var k = pr.width / page.offsetWidth;
    if (!k) return;
    cursor.style.left = ((er.left - pr.left + er.width * 0.55) / k).toFixed(1) + "px";
    cursor.style.top = ((er.top - pr.top + er.height * 0.45) / k).toFixed(1) + "px";
  }

  function face(state) { if (window.Ember && ember) window.Ember.set(ember, state); }

  /* The run. `t` is milliseconds from the start; each entry sets a step, moves the pointer, or
     both. Steps 0 to 8 are the same either way: the stop at Place order and the card, held long
     enough to read (Jett: the agent still asks before every order, even one it was told to
     place). 9 on is the ending the switch picked: with it on, the tap, then the press. */
  var RUN = [
    { t: 0, n: 0, aim: null, face: "idle" },
    { t: 900, n: 1, face: "working" },
    { t: 2300, n: 2, aim: "add" },
    { t: 3600, n: 3 },
    { t: 4300, aim: "checkout" },
    { t: 5200, n: 4 },
    { t: 6000, n: 5, aim: null },
    { t: 7200, n: 6, aim: "place" },
    { t: 8600, n: 7, aim: null, face: "idle" },
    { t: 9700, n: 8 },
    { t: 15200, n: 9 },
    { t: 16600, n: 10, aim: "place-if-on", face: "working-if-on" },
    { t: 17800, n: 11, face: "done-if-on" },
    { t: 18900, n: 12 }
  ];
  var FROM_SWITCH = 8;   // the entry a flip by hand goes back to: just before the stop card lands
  var HOLD_MS = 8000;    // the finished ending, standing still long enough to read the card

  var i = 0, timer = 0, visible = false, touched = false, n = LAST;

  function apply(e) {
    if (e.n !== undefined) { n = e.n; draw(n); }
    if (e.aim !== undefined) aim(e.aim === "place-if-on" ? (on() ? "place" : null) : e.aim);
    if (e.face) {
      var f = e.face.split("-if-on")[0];
      if (e.face === f || on()) face(f);
    }
  }
  function schedule() {
    clearTimeout(timer);
    if (!visible || reduced) return;
    if (i >= RUN.length) {
      timer = setTimeout(function () {
        if (!touched) sw.checked = !sw.checked;
        i = 0; tick();
      }, HOLD_MS);
      return;
    }
    var wait = i === 0 ? 400 : RUN[i].t - RUN[i - 1].t;
    timer = setTimeout(tick, wait);
  }
  function tick() { apply(RUN[i]); i++; schedule(); }

  sw.addEventListener("change", function () {
    touched = true;
    if (reduced) { draw(LAST); return; }
    /* back to the pointer on Place order, with everything before it already drawn */
    clearTimeout(timer);
    for (var k = 0; k < FROM_SWITCH; k++) apply(RUN[k]);
    i = FROM_SWITCH;
    schedule();
  });

  draw(LAST);
  if (reduced) return;
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      var was = visible;
      visible = entries[0].isIntersecting;
      if (visible && !was) { if (i >= RUN.length) i = 0; schedule(); }
      if (!visible) clearTimeout(timer);
    }, { threshold: 0.35 }).observe(scene);
  } else {
    visible = true; i = 0; schedule();
  }
})();
