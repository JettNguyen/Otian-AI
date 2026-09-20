/* The AI you picked, on compare/chat-apps/: the agent carries the cord to the pad you picked.
 *
 * The radios above the scene do most of the work in CSS (the lit pad, the window's in-use row
 * and note, the bar's lit option). This script owns the two things a stylesheet cannot redraw
 * from a checkbox: where the agent stands and the path of the cord from your computer to it.
 * It reads the stops, the cord's start and its bends off the scene's own custom properties, so
 * narrow needs no script of its own, and it cycles the pick every few seconds until the reader
 * makes one, at which point the timer stops for good (the same rule as js/switch-cycle.js). Off
 * screen the clock stops; under reduced motion nothing cycles and a pick simply moves the agent. */
(function () {
  "use strict";
  var fig = document.querySelector(".ch-figure");
  if (!fig) return;
  var scene = fig.querySelector(".ch-scene"), box = fig.querySelector(".ch-box");
  var ember = fig.querySelector('[data-o="ember"]'), face = fig.querySelector(".ch-ember");
  var cord = fig.querySelector(".ch-cord");
  var radios = Array.prototype.slice.call(fig.querySelectorAll('input[name="ch-ai"]'));
  if (!scene || !box || !ember || !cord || !radios.length) return;
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var WALK_MS = 900, HOLD_MS = 4600;

  function pair(name) {
    var v = getComputedStyle(scene).getPropertyValue(name).trim().split(/\s+/);
    return [parseFloat(v[0]) || 0, parseFloat(v[1]) || 0];
  }
  function picked() { for (var i = 0; i < radios.length; i++) if (radios[i].checked) return radios[i].value; return radios[0].value; }
  function stopOf(id) { return pair("--st-" + id); }
  function path(p) {
    var c = pair("--cord"), c1 = pair("--cord-c1"), o = pair("--cord-in");
    return "M" + c[0] + "," + c[1] + " C" + c1[0] + "," + c1[1] + " " + (p[0] + o[0]).toFixed(1) + "," + (p[1] + o[1]).toFixed(1) + " " + p[0].toFixed(1) + "," + p[1].toFixed(1);
  }
  var cur = null, anim = 0;
  function place(p) {
    cur = p;
    ember.style.setProperty("--fx", p[0] + "px");
    ember.style.setProperty("--fy", p[1] + "px");
    cord.setAttribute("d", path(p));
  }
  function go(id, instant) {
    var to = stopOf(id), from = cur ? cur.slice() : to;
    if (anim) cancelAnimationFrame(anim);
    if (instant || reduced || !cur) { place(to); return; }
    var t0 = performance.now();
    anim = requestAnimationFrame(function step(now) {
      var t = Math.min(1, (now - t0) / WALK_MS);
      var e = t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      place([from[0] + (to[0] - from[0]) * e, from[1] + (to[1] - from[1]) * e]);
      if (t < 1) anim = requestAnimationFrame(step);
      else { anim = 0; if (window.Ember && face) window.Ember.act(face, "hop"); }
    });
  }

  /* the box is drawn at one size and scaled to the scene, the way js/home.js fits the homepage
     scene: a transform, because the box is the root of the 3D context. The stops move with the
     media query, so a refit also re-places the agent and the cord. */
  function fit() {
    var k = scene.clientWidth / box.offsetWidth;
    scene.style.setProperty("--pk", (k > 0 ? k : 1).toFixed(4));
    go(picked(), true);
  }
  fit();
  if ("ResizeObserver" in window) new ResizeObserver(fit).observe(scene);
  else window.addEventListener("resize", fit);

  var handed = false, timer = 0, visible = false;
  radios.forEach(function (r) {
    r.addEventListener("change", function () { handed = true; clearTimeout(timer); go(r.value); });
  });
  if (reduced) return;
  function next() {
    clearTimeout(timer);
    if (handed || !visible) return;
    timer = setTimeout(function () {
      var i = 0; for (; i < radios.length; i++) if (radios[i].checked) break;
      var r = radios[(i + 1) % radios.length];
      r.checked = true;
      go(r.value);
      next();
    }, HOLD_MS);
  }
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (es) {
      es.forEach(function (e) { visible = e.isIntersecting; if (visible) next(); else clearTimeout(timer); });
    }, { threshold: 0.35 }).observe(scene);
  } else { visible = true; next(); }
})();
