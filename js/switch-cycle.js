/* ========================================
   Otian AI | Self-flipping figure switches
   js/switch-cycle.js

   Some figures are drawn twice and a checkbox picks which half you see: the packet map on
   trust/, the shared-agent drawing on archie/business/. A switch like that only works if
   somebody notices it is a switch, and the second drawing is the half that makes the point.
   This flips one on a timer so the figure shows both without being asked.

   Opt in per switch, in the markup, with data-auto-flip="<milliseconds>". Nothing here knows
   which figure it is driving, and no figure is driven unless it asks.

   Four things it will not do, and each one is the difference between a figure that moves and
   a figure that fights you:

     1. Reduced motion turns it off entirely. Someone who asked the OS for less movement is
        not asking for a drawing that redraws itself every three seconds.
     2. The first real change hands the switch over for good. Programmatic `.checked = x`
        fires no change event, so any change event that arrives is the reader's, and once it
        does the timer stops and does not come back. A control that keeps moving after you
        have used it is broken.
     3. Hovering or tabbing into the figure holds the current state, so you can read the half
        you are looking at.
     4. It only runs while the figure is actually on screen and the tab is actually in front.

   Progressive by construction. Without this file the switch is the switch it always was.
   ======================================== */

(function () {
  'use strict';

  var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (still) return;

  var switches = document.querySelectorAll('input[type="checkbox"][data-auto-flip]');
  if (!switches.length) return;

  Array.prototype.forEach.call(switches, function (input) {
    var every = parseInt(input.getAttribute('data-auto-flip'), 10);
    if (!every || every < 400) return;

    /* The figure is what the reader hovers, not the hidden checkbox: the input is visually
       hidden and the <label> is the thing on screen, so hover has to be watched on the whole
       drawing or it would never fire. */
    var scope = input.closest('figure') || input.parentNode;
    if (!scope) return;

    var timer = null;
    var held = false;   /* reading it right now */
    var shown = false;  /* on screen */
    var theirs = false; /* they have used the switch, so it is theirs */

    function halt() {
      if (timer) { clearInterval(timer); timer = null; }
    }

    function run() {
      if (theirs || held || !shown || timer || document.hidden) return;
      timer = setInterval(function () { input.checked = !input.checked; }, every);
    }

    /* Only a real click or keypress reaches here: setting .checked above fires nothing. */
    input.addEventListener('change', function () {
      theirs = true;
      halt();
    });

    scope.addEventListener('mouseenter', function () { held = true; halt(); });
    scope.addEventListener('mouseleave', function () { held = false; run(); });
    scope.addEventListener('focusin', function () { held = true; halt(); });
    scope.addEventListener('focusout', function () { held = false; run(); });

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { halt(); } else { run(); }
    });

    if (window.IntersectionObserver) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          shown = entry.isIntersecting;
          if (shown) { run(); } else { halt(); }
        });
      }, { threshold: 0.35 }).observe(scope);
    } else {
      /* No observer: run it anyway rather than leaving the figure on one half forever. */
      shown = true;
      run();
    }
  });
})();
