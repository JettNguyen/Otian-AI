/* ========================================
   Otian AI | The packet map
   js/packet-map.js

   Drives the "Everything that leaves your computer" figure on trust/. Every host Archie talks
   to is drawn around your computer; tapping one writes `data-active` on the <figure>, and the
   CSS quiets the rest from there, so this file holds no colours and no geometry and the two
   SVG variants need no separate handling. The switch above the drawing (own AI account, or
   the free credits and the plan with the AI included) is a checkbox the CSS answers on its
   own; nothing here touches it.

   The one thing this owns is the caption. Each host carries its row's sentence in `data-say`,
   in the markup, so the words live beside the drawing they describe and not in a script.

   Progressive by construction. Without this file the drawing is complete, the caption states
   the point, and the table under it lists every row in full.
   ======================================== */

(function () {
  var fig = document.getElementById("packetMap");
  var caption = document.getElementById("packetMapCaption");
  if (!fig || !caption) return;

  var nodes = fig.querySelectorAll(".pm-node[data-node][data-say]");
  if (!nodes.length) return;

  var idle = caption.textContent;
  var held = null;

  function paint(name) {
    var say = null;
    if (name) {
      for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].getAttribute("data-node") === name) { say = nodes[i].getAttribute("data-say"); break; }
      }
    }
    if (name) fig.setAttribute("data-active", name);
    else fig.removeAttribute("data-active");
    caption.textContent = say || idle;
    for (var j = 0; j < nodes.length; j++) {
      nodes[j].setAttribute("aria-pressed", String(held === nodes[j].getAttribute("data-node")));
    }
  }

  for (var i = 0; i < nodes.length; i++) {
    (function (el) {
      var name = el.getAttribute("data-node");
      el.addEventListener("pointerenter", function () { paint(name); });
      el.addEventListener("pointerleave", function () { paint(held); });
      el.addEventListener("focus", function () { paint(name); });
      el.addEventListener("blur", function () { paint(held); });
      el.addEventListener("click", function () {
        held = held === name ? null : name;
        paint(held);
      });
      el.addEventListener("keydown", function (e) {
        if (e.key !== "Enter" && e.key !== " ") return;
        e.preventDefault();
        held = held === name ? null : name;
        paint(held);
      });
    })(nodes[i]);
  }

  document.addEventListener("click", function (e) {
    if (held && !fig.contains(e.target)) {
      held = null;
      paint(null);
    }
  });

  /* Now that tapping does something, say so. Written here rather than in the markup, so a
     page with no script never promises an affordance it has not got. */
  caption.textContent = idle + " Tap a host to read what goes there.";
  idle = caption.textContent;
})();
