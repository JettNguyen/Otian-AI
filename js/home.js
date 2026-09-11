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

  /* The scene picker above the hero phone. The cycle is CSS and stays CSS; pressing a button
     moves the clock. Every animation on the lap (the scenes, their beats, the captions, the job
     records, the picker's bars and lights) has the same 63s duration and a delay derived from
     its scene, so setting one currentTime on all of them puts them at the same instant: the
     start of the chosen scene. Its bar then fills over the scene's nine seconds and the cycle
     carries on from there, the way a phone does when you tap a story.

     The fallback is the older hold: where getAnimations is missing, or under reduced motion,
     where the animations are off and there is no clock to move, the press puts `is-held` on
     the stage and `is-on` on the chosen scene, caption, job record and button, and the
     stylesheet shows that scene whole. Pressing the lit button, or leaving it twenty seconds,
     lets the page go back to its still first scene. */
  var stage = document.querySelector('.hm-stage');
  var picks = stage ? stage.querySelectorAll('.hm-pick[data-scene]') : [];
  if (stage && picks.length) {
    var cs = getComputedStyle(stage);
    var hold = (parseFloat(cs.getPropertyValue('--hm-hold')) || 9) * 1000;
    var count = parseInt(cs.getPropertyValue('--hm-count'), 10) || picks.length;
    var lap = hold * count;

    /* Read fresh on every press: a scene shown by toggling display gets new animation objects. */
    function lapAnimations() {
      if (!stage.getAnimations) return [];
      return stage.getAnimations({ subtree: true }).filter(function (a) {
        var t = a.effect && a.effect.getComputedTiming ? a.effect.getComputedTiming() : null;
        return !!t && Math.abs(t.duration - lap) < 50;
      });
    }
    function jumpTo(i) {
      var anims = lapAnimations();
      if (!anims.length) return false;
      var at = i * hold;
      for (var k = 0; k < anims.length; k++) anims[k].currentTime = at;
      return true;
    }

    /* The fallback hold. */
    var HOLD_MS = 20000;
    var held = -1;
    var release = null;
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
    function paintPicks(on) {
      for (var i = 0; i < picks.length; i++) {
        picks[i].classList.toggle('is-on', parseInt(picks[i].getAttribute('data-scene'), 10) === on);
      }
    }
    function holdScene(i) {
      held = i;
      stage.classList.add('is-held');
      mark(scenes, i); mark(caps, i); mark(works, i);
      paintPicks(i);
      clearTimeout(release);
      release = setTimeout(letGo, HOLD_MS);
    }
    function letGo() {
      held = -1;
      clearTimeout(release);
      stage.classList.remove('is-held');
      mark(scenes, -1); mark(caps, -1); mark(works, -1);
      paintPicks(-1);
    }

    for (var t = 0; t < picks.length; t++) {
      picks[t].addEventListener('click', function () {
        var i = parseInt(this.getAttribute('data-scene'), 10);
        if (held < 0 && jumpTo(i)) return;
        if (i === held) letGo(); else holdScene(i);
      });
    }
  }

})();
