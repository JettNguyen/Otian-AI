/* The two desks on compare/cloud-agents/: the lid closes, and only one of the two keeps working.
 *
 * The floor, the tower, the board and the wires are still; the lid is the claim. Every few
 * seconds it closes: the agent beside the laptop goes to sleep and its wire's message is hidden,
 * while the tower's light and wire carry on. Then it opens and the agent wakes. Under reduced
 * motion the lid stays open and nothing runs; the resting picture is the whole comparison, and
 * the caption says the rest. Off screen the clock stops and picks up on the way back. */
(function () {
  "use strict";
  var scene = document.querySelector(".cl-scene");
  if (!scene) return;
  var ember = scene.querySelector(".cl-ember");
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var OPEN_MS = 6500, SHUT_MS = 4200, LID_MS = 1100;
  var started = false, visible = false;

  /* the box is drawn at one size and scaled to the scene, the way js/home.js fits the homepage
     scene: a transform, because the box is the root of the 3D context */
  var box = scene.querySelector(".cl-box");
  function fit() {
    if (!box) return;
    var k = scene.clientWidth / box.offsetWidth;
    scene.style.setProperty("--pk", (k > 0 ? k : 1).toFixed(4));
  }
  fit();
  if ("ResizeObserver" in window) new ResizeObserver(fit).observe(scene);
  else window.addEventListener("resize", fit);
  if (reduced) return;

  var timer = 0, next = null;
  function later(fn, ms) {
    clearTimeout(timer); next = fn;
    if (!visible) return;
    timer = setTimeout(function () { next = null; fn(); }, ms);
  }
  function shut() {
    scene.classList.add("is-closed");
    later(function () {
      if (window.Ember && ember) window.Ember.set(ember, "sleep");
      later(open, SHUT_MS);
    }, LID_MS * 0.6);
  }
  function open() {
    scene.classList.remove("is-closed");
    later(function () {
      if (window.Ember && ember) { window.Ember.set(ember, "idle"); window.Ember.act(ember, "hop"); }
      later(shut, OPEN_MS);
    }, LID_MS * 0.8);
  }
  function start() {
    if (started) return;
    started = true;
    later(shut, OPEN_MS);
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
