/* The ring of phones on archie/business/: a message goes to the computer and its answer comes
 * back to the phone it left from.
 *
 * Three phones, three exchanges, one at a time: the phone's thread clears, the question lands,
 * a ball rolls down the lane to the computer, the agent standing there hops, the ball rolls back
 * and the answer lands. Which agent hops is the switch's business (one shared agent, or that
 * person's own), read off the checkbox each time. At rest, and without this script, every phone
 * shows its question and its answer, so the claim is drawn before anything moves; going live
 * keeps that picture and only redraws one phone at a time. The clock stops off screen and picks
 * up on the way back. Under reduced motion nothing runs at all. */
(function () {
  "use strict";
  var scene = document.querySelector(".bz-scene");
  if (!scene) return;
  var $$ = function (s) { return Array.prototype.slice.call(scene.querySelectorAll(s)); };
  var phones = $$(".bz-phone"), balls = $$(".bz-ball");
  var one = scene.querySelector('[data-o="e-one"] .bz-ember'), each = $$(".bz-agents--each .bz-ember");
  var sw = document.getElementById("bz-each");
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var ROLL_MS = 1100, HOLD_MS = 3600;
  var i = 0, started = false, visible = false;

  /* the box is drawn at one size and scaled to the scene, the way js/home.js fits the homepage
     scene: a transform, because the box is the root of the 3D context */
  var box = scene.querySelector(".bz-box");
  function fit() {
    if (!box) return;
    var k = scene.clientWidth / box.offsetWidth;
    scene.style.setProperty("--pk", (k > 0 ? k : 1).toFixed(4));
  }
  fit();
  if ("ResizeObserver" in window) new ResizeObserver(fit).observe(scene);
  else window.addEventListener("resize", fit);
  if (reduced) return;

  /* one pending step at a time, so leaving the view pauses the clock and coming back resumes it */
  var timer = 0, next = null;
  function later(fn, ms) {
    clearTimeout(timer); next = fn;
    if (!visible) return;
    timer = setTimeout(function () { next = null; fn(); }, ms);
  }
  function msgs(n) { return Array.prototype.slice.call(phones[n].querySelectorAll(".bz-msg")); }
  function agent(n) { return (sw && sw.checked) ? each[n] : one; }
  function turn(n) {
    i = n;
    var m = msgs(n), b = balls[n];
    m.forEach(function (el) { el.classList.remove("is-in"); });
    later(function () {
      m[0].classList.add("is-in");
      later(function () {
        b.classList.remove("is-back"); b.classList.add("is-out");
        later(function () {
          b.classList.remove("is-out");
          if (window.Ember && agent(n)) window.Ember.act(agent(n), "hop");
          later(function () {
            b.classList.add("is-back");
            later(function () {
              b.classList.remove("is-back");
              m[1].classList.add("is-in");
              later(function () { turn((n + 1) % phones.length); }, HOLD_MS);
            }, ROLL_MS);
          }, 500);
        }, ROLL_MS);
      }, 700);
    }, 450);
  }
  function start() {
    if (started) return;
    started = true;
    phones.forEach(function (p) { p.querySelectorAll(".bz-msg").forEach(function (el) { el.classList.add("is-in"); }); });
    scene.classList.add("is-live");
    later(function () { turn(0); }, 900);
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
})();
