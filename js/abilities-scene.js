/* What it can do, on how-it-works/: the four things the agent carries, and the switches that
 * decide which of them it is holding.
 *
 * The scene is CSS. Four checkboxes drive the lit pad, the standing mark, the window's own switch
 * and its row, all through `#wd-x:checked ~ .wd-scene`, and js/switch-cycle.js flips one on a timer
 * until the reader flips one themselves. This script owns the single thing a stylesheet cannot do:
 * fit a 720-wide design box to whatever column it is in.
 *
 * With a transform and never with zoom. The box is the root of a 3D context, and WebKit does not
 * carry a 3D context through zoom: the drafts scene shipped zoomed, Chrome drew it in full, and
 * Safari drew a flat grid and a phone with no rim. js/home.js fits the homepage scene the same way.
 */
(function () {
  "use strict";
  var fig = document.querySelector(".wd-figure");
  if (!fig) return;
  var scene = fig.querySelector(".wd-scene"), box = fig.querySelector(".wd-box");
  if (!scene || !box) return;

  function fit() {
    var w = box.offsetWidth;
    if (!w) return;
    scene.style.setProperty("--pk", (scene.clientWidth / w).toFixed(4));
  }
  fit();
  if ("ResizeObserver" in window) new ResizeObserver(fit).observe(scene);
  else window.addEventListener("resize", fit);
})();
