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
     Archie Mobile screens run at 8: at 35 a 300px phone crossed the screen in about nine
     seconds, which is a marquee, not a screen anybody can read. */

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

    Promise.all(imagesReady).then(function () {
      var loopDistance = track.scrollWidth / 2;
      var gallery = track.closest('.screenshot-gallery');
      var pps = parseFloat(gallery && gallery.getAttribute('data-pps')) || PIXELS_PER_SECOND;
      var duration = Math.max(loopDistance / pps, 4);
      track.style.animationDuration = duration + 's';
      track.classList.add('is-ready');
    });
  });
})();
