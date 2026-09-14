/* ========================================
   Otian AI | Screenshot Gallery
   js/screenshot-gallery.js

   Duplicates each track's items once so the CSS marquee
   animation (translateX -50%) loops seamlessly, then sizes the
   animation duration to the track's actual content width so the
   scroll speed stays constant no matter how many screenshots are
   in it. Add more screenshots by adding more
   .screenshot-gallery-item elements to the track in HTML - no JS
   changes needed.

   The animation starts paused and only switches to running once
   every image has loaded - otherwise the track's width (and so
   the -50% loop point) keeps changing as images finish loading,
   which makes the loop visibly jump.
   ======================================== */

(function () {
  'use strict';

  var PIXELS_PER_SECOND = 35;
  /* A gallery can set its own pace with data-pps on the .screenshot-gallery element. The
     Archie Mobile screens run at 30. See the note beside that attribute for why: the pace
     was 8, then 18, and both read as too slow to the person actually looking at it. */

  document.querySelectorAll('.screenshot-gallery-track').forEach(function (track) {
    var items = Array.from(track.children);
    items.forEach(function (item) {
      var clone = item.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    });

    var images = Array.from(track.querySelectorAll('img'));
    var imagesReady = images.map(function (img) {
      if (img.complete) return Promise.resolve();
      return new Promise(function (resolve) {
        img.addEventListener('load', resolve);
        img.addEventListener('error', resolve);
      });
    });

    var gallery = track.closest('.screenshot-gallery');
    var pps = parseFloat(gallery && gallery.getAttribute('data-pps')) || PIXELS_PER_SECOND;
    var applied = null;

    /* Measure, and refuse to guess. A track inside a display:none gallery reports a
       scrollWidth of 0, and 0 used to sail through as Math.max(0 / pps, 4) and pin the
       animation at the 4-second floor: one lap of the whole row in four seconds, faster
       than the CSS default it was meant to slow down. Nothing recomputed it afterwards, so
       narrowing the window past the breakpoint that reveals the gallery showed the race
       rather than the drift. Unmeasurable means stay paused, not go as fast as possible. */
    function measure() {
      var loopDistance = track.scrollWidth / 2;
      if (!loopDistance) {
        track.classList.remove('is-ready');
        return;
      }
      var duration = Math.max(loopDistance / pps, 4);
      /* Only touch the DOM when the number actually moves: this runs from a
         ResizeObserver, and writing on every callback is how you get a feedback loop. */
      if (duration !== applied) {
        applied = duration;
        track.style.animationDuration = duration + 's';
      }
      track.classList.add('is-ready');
    }

    Promise.all(imagesReady).then(function () {
      measure();
      /* The gallery can be revealed by a breakpoint long after load (the Archie Mobile
         screens only exist under 640px), and the item widths can change with it, so the
         measurement has to survive a resize rather than being taken once. */
      if (window.ResizeObserver) {
        new ResizeObserver(measure).observe(track);
      } else {
        var t = null;
        window.addEventListener('resize', function () {
          clearTimeout(t);
          t = setTimeout(measure, 150);
        }, { passive: true });
      }
    });
  });
})();
