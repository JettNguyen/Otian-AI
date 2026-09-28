/* The kit, on a desk, on how-it-works/: a message climbs the kit and comes back with a reply.
 *
 * Everything that moves is CSS, on one 16.7 second clock (css/styles.css, "The kit, on a desk").
 * This script owns the two things a stylesheet cannot do. It fits the 720-wide design box to its
 * column, with a transform and never with zoom, because the box is the root of a 3D context and
 * WebKit does not carry one through zoom (the drafts scene's lesson). And it pauses the clock
 * while the scene is off screen, so the reader arrives at the start of a lap rather than the end.
 *
 * THE FIGURE EXISTS TWICE. js/equipment.js clones it into #kitPanel once the reader has answered
 * the picker, as HTML, so the copy arrives after this has run. A MutationObserver on the panel
 * fits each new copy as it lands. Nothing is marked on the element to say it has been fitted,
 * because a mark would be cloned along with it and the copy would never be fitted at all.
 */
(function () {
  "use strict";
  var seen = typeof WeakSet === "function" ? new WeakSet() : null;

  function fit(scene) {
    var box = scene.querySelector(".kt-box");
    if (!box || !box.offsetWidth || !scene.clientWidth) return;
    scene.style.setProperty("--pk", (scene.clientWidth / box.offsetWidth).toFixed(4));
  }

  var ro = "ResizeObserver" in window
    ? new ResizeObserver(function (es) { es.forEach(function (e) { fit(e.target); }); })
    : null;
  var io = "IntersectionObserver" in window
    ? new IntersectionObserver(function (es) {
        es.forEach(function (e) { e.target.classList.toggle("is-away", !e.isIntersecting); });
      }, { threshold: 0.2 })
    : null;

  function mount(root) {
    var scenes = (root || document).querySelectorAll(".kt-scene");
    for (var i = 0; i < scenes.length; i++) {
      var s = scenes[i];
      if (seen) { if (seen.has(s)) continue; seen.add(s); }
      fit(s);
      if (ro) ro.observe(s);
      if (io) io.observe(s);
    }
  }

  mount(document);
  if (!ro) window.addEventListener("resize", function () {
    var all = document.querySelectorAll(".kt-scene");
    for (var i = 0; i < all.length; i++) fit(all[i]);
  });
  var panel = document.getElementById("kitPanel");
  if (panel && "MutationObserver" in window) {
    new MutationObserver(function () { mount(panel); }).observe(panel, { childList: true });
  }
})();
