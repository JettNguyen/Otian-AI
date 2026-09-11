/* Homepage-only behavior: the day-spine draw. Decoration on top of a page that
   reads fine without it, since the spine's CSS default is fully drawn, and
   reduced motion skips the draw.

   The stat count-up and the screenshot carousel lived here until 2026-08-31, when
   the coverage grid replaced the stat band and the carousel section came out. */
(function () {
  'use strict';

  var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Day-spine draw: the line's height follows scroll through the section,
     kept slightly ahead of the reader so the tip never lags down-screen. */
  var spine = document.querySelector('.hm-spine');
  if (spine && !still) {
    spine.style.setProperty('--hm-draw', 0);
    /* Scroll sets a target; the line eases toward it each frame instead of
       jumping. A slow scroll keeps the tip pinned about two thirds down the
       viewport; a fast flick leaves the line behind for a beat and you watch
       it glide to catch up. */
    /* Named spTarget/spCur on purpose: everything in this file shares one
       function scope, and the carousel below also hoists a `cur`. */
    var spTarget = 0;
    var spCur = 0;
    var spRaf = null;
    var settle = function () {
      spRaf = null;
      spCur += (spTarget - spCur) * 0.14;
      if (Math.abs(spTarget - spCur) < 0.002) spCur = spTarget;
      spine.style.setProperty('--hm-draw', spCur);
      if (spCur !== spTarget) spRaf = requestAnimationFrame(settle);
    };
    var measure = function () {
      var r = spine.getBoundingClientRect();
      spTarget = Math.max(0, Math.min(1, (window.innerHeight * 0.66 - r.top) / (r.height * 0.96)));
      if (!spRaf) spRaf = requestAnimationFrame(settle);
    };
    window.addEventListener('scroll', measure, { passive: true });
    measure();
  }

  /* Scene tabs under the hero phone. The cycle is CSS and stays CSS; this only holds one
     scene when a tab is pressed. Holding adds `is-held` to the stage and `is-on` to that
     scene, its caption and its job record, and the stylesheet does the rest: the lap
     animations stop, the held scene's beats play once from their own start, and the tab lights.
     Pressing the lit tab, or leaving it alone for twenty seconds, lets the cycle go, and it
     goes from the top because everything restarts together. The tabs light on their own clock
     while nothing is held, so this file never has to know where the cycle is. */
  var stage = document.querySelector('.hm-stage');
  var tabs = stage ? stage.querySelectorAll('.hm-tab[data-scene]') : [];
  if (stage && tabs.length) {
    var HOLD_MS = 20000;
    var held = -1;
    var release = null;

    /* Everything on the clock, keyed by its --s, so this does not depend on DOM order. */
    function bySceneIndex(selector) {
      var out = {};
      var els = stage.querySelectorAll(selector);
      for (var i = 0; i < els.length; i++) {
        var n = parseInt(els[i].style.getPropertyValue('--s'), 10);
        if (!isNaN(n)) out[n] = els[i];
      }
      return out;
    }
    var scenes = bySceneIndex('.hm-scene');
    var caps = bySceneIndex('.hm-cap');
    var works = bySceneIndex('.hm-work');

    function mark(map, on) {
      for (var k in map) {
        if (Object.prototype.hasOwnProperty.call(map, k)) map[k].classList.toggle('is-on', +k === on);
      }
    }
    function paintTabs(on) {
      for (var i = 0; i < tabs.length; i++) {
        var mine = parseInt(tabs[i].getAttribute('data-scene'), 10) === on;
        tabs[i].classList.toggle('is-on', mine);
        tabs[i].setAttribute('aria-pressed', String(mine));
      }
    }
    function hold(i) {
      held = i;
      stage.classList.add('is-held');
      mark(scenes, i); mark(caps, i); mark(works, i);
      paintTabs(i);
      clearTimeout(release);
      release = setTimeout(letGo, HOLD_MS);
    }
    function letGo() {
      held = -1;
      clearTimeout(release);
      stage.classList.remove('is-held');
      mark(scenes, -1); mark(caps, -1); mark(works, -1);
      paintTabs(-1);
    }
    for (var t = 0; t < tabs.length; t++) {
      tabs[t].addEventListener('click', function () {
        var i = parseInt(this.getAttribute('data-scene'), 10);
        if (i === held) letGo(); else hold(i);
      });
    }
  }

})();
