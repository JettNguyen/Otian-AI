/* ========================================
   Otian AI | The living agent
   js/living-agent.js

   The figure on how-it-works/ and the homepage where a message laps from you to your agent to
   the AI company and back, and a second one heads for your mail and calendar and stops at the
   gate. All of that motion is CSS (see "The living agent" in css/styles.css); the drawing is
   complete with this file absent.

   The one thing that needs a script is Ember. He stands at the gate, and when the held message
   is let through he hops. The CSS animation cannot tell him, so this listens for the second
   dot's loop and cues the hop at the moment the keyframes release it. Under reduced motion the
   animation is off, so no event ever fires and he stands still, which is right.
   ======================================== */

(function () {
  var figures = document.querySelectorAll(".la-figure");
  if (!figures.length) return;

  /* When in the 7s loop the gate opens: la-gate holds the dot from 62% to 78% and lets it go
     at 78%. The hop lands on the release, not the arrival: the point of the drawing is that
     nothing moves until you say so, and he celebrates the saying so. */
  var LOOP_MS = 7000;
  var RELEASE_AT = 0.78;

  function cue(figure) {
    var ember = figure.querySelector(".la-ember");
    if (!ember || !window.Ember || !window.Ember.act) return;
    /* Both SVG variants carry a gate dot, but only the one on screen is animating, and only an
       animating element fires these events, so binding to both is binding to the visible one. */
    var dots = figure.querySelectorAll(".la-pulse-2");
    var timer = 0;
    function schedule() {
      clearTimeout(timer);
      timer = setTimeout(function () { window.Ember.act(ember, "hop"); }, LOOP_MS * RELEASE_AT);
    }
    for (var i = 0; i < dots.length; i++) {
      dots[i].addEventListener("animationstart", schedule);
      dots[i].addEventListener("animationiteration", schedule);
    }
  }

  for (var i = 0; i < figures.length; i++) cue(figures[i]);
})();
