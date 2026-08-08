/* ========================================
   Otian AI | Pickable explainer diagram
   js/addon-pick.js

   Drives the "Your Agent, and Everything You Plug Into It" diagram on
   skills-marketplace/what-is-an-add-on/. Choosing one of the three kinds writes
   `data-active` on the <figure>; all the highlighting is CSS from there, so this file
   holds no colours and no geometry and the two SVG variants need no separate handling.

   The one thing it does own is the caption, because that is where each kind is actually
   explained. The picture has room for two short lines per card and no more, and the
   difference between "how it talks to you" and what that means in practice is a
   sentence, not a label.

   Nothing here implies an order. The three are peers: each docks into the agent by
   itself, and an agent can carry any mix of them. Choosing one quiets the other two and
   changes the sentence; it never moves anything or walks a path between them.

   Progressive by construction. Without this file the diagram is complete: every short
   description is drawn on it, and the caption holds the point it is making.
   ======================================== */

(function () {
  const fig = document.getElementById("coreFigure");
  const caption = document.getElementById("coreCaption");
  if (!fig || !caption) return;

  const nodes = fig.querySelectorAll(".pick-node");
  if (!nodes.length) return;

  /* The longer form of each card. Each one says what the kind is, then what it is not,
     because the three are easiest to tell apart by where their edges are: a personality
     changes nothing about what an agent can do, and a routine is not a fourth thing an
     agent can do but a time at which it does one. */
  const KINDS = {
    skill: "A skill is something your agent can do that it could not do before: read your " +
      "calendar, sort your files, triage your inbox, look something up on the live web.",
    personality: "A personality is how your agent talks to you: warm and chatty, or brief " +
      "and to the point. It changes nothing about what your agent can do.",
    routine: "A routine is something your agent does on its own, on a schedule, like a " +
      "summary of your day every morning. You do not have to ask.",
  };

  const idle = caption.textContent;

  /** The kind held open by a tap or a click, as against one merely hovered. Null means
   *  the diagram is at rest. */
  let held = null;

  function paint(kind) {
    if (kind) fig.setAttribute("data-active", kind);
    else fig.removeAttribute("data-active");
    caption.textContent = kind ? KINDS[kind] : idle;
    nodes.forEach((el) => {
      el.setAttribute("aria-pressed", String(held === el.dataset.node));
    });
  }

  nodes.forEach((el) => {
    const kind = el.dataset.node;
    if (!KINDS[kind]) return;

    // Hover previews; letting go returns to whatever is held, not to nothing, or a mouse
    // crossing the diagram would keep wiping a choice somebody made on purpose.
    el.addEventListener("pointerenter", () => paint(kind));
    el.addEventListener("pointerleave", () => paint(held));
    el.addEventListener("focus", () => paint(kind));
    el.addEventListener("blur", () => paint(held));

    // Tap is the only gesture a phone has, so it has to both open and close.
    el.addEventListener("click", () => {
      held = held === kind ? null : kind;
      paint(held);
    });
    el.addEventListener("keydown", (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault(); // Space would scroll the page out from under the diagram.
      held = held === kind ? null : kind;
      paint(held);
    });
  });

  // Tapping past the diagram lets go of it. Without this, a phone that has no hover has
  // no way back to the whole picture except finding and tapping the same card again.
  document.addEventListener("click", (e) => {
    if (held && !fig.contains(e.target)) {
      held = null;
      paint(null);
    }
  });
})();
