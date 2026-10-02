/* Three illustrative outcomes share the hero's real chat surface.

   The line under the picked job is the tour's clock and not a picture of one: it is a Web
   Animation, and its finish is what brings the next job up. So everything that holds the tour
   (the pause button, a pointer or focus inside the card, the page scrolled away or hidden) holds
   the line where it stands, and the two can never drift apart the way a timer and a CSS bar
   would. Without motion there is no line and no tour; the jobs are picked by hand. */
(function () {
  'use strict';
  var stage = document.querySelector('.day-stage');
  var preview = document.querySelector('.hm-evening');
  if (!stage || !preview) return;
  var jobs = Array.from(document.querySelectorAll('[data-dinner-job]'));
  var picks = Array.from(preview.querySelectorAll('[data-dinner-pick]'));
  var pause = preview.querySelector('.hm-dinner-pause');
  var motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var DWELL = 7000;
  var current = 0, clock = null, visible = false, paused = false, hovering = false, playRequested = false;

  function running() {
    return !motion.matches && !paused && !document.hidden && visible &&
      stage.classList.contains('is-hero') &&
      (playRequested || !(hovering || preview.contains(document.activeElement)));
  }

  function schedule() {
    if (!clock) return;
    if (running()) clock.play(); else clock.pause();
  }

  function wind() {
    if (clock) clock.cancel();
    clock = null;
    var line = picks[current].querySelector('.hm-dinner-bar i');
    if (motion.matches || !line || !line.animate) return;
    clock = line.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }],
      { duration: DWELL, easing: 'linear', fill: 'forwards' });
    clock.pause();
    clock.onfinish = function () { show((current + 1) % jobs.length); };
    schedule();
  }

  function show(index) {
    var prev = current;
    current = index;
    jobs.forEach(function (job, i) {
      job.classList.toggle('is-on', i === index);
      // The one leaving lifts away; the rest wait below for their turn to rise.
      job.classList.toggle('is-out', i === prev && i !== index);
    });
    picks.forEach(function (button, i) { button.setAttribute('aria-pressed', String(i === index)); });
    wind();
  }

  picks.forEach(function (button, i) {
    button.addEventListener('click', function () {
      playRequested = false;
      if (i !== current) show(i); else schedule();
    });
  });
  pause.addEventListener('click', function () {
    paused = !paused;
    playRequested = !paused;
    preview.classList.toggle('is-paused', paused);
    pause.setAttribute('aria-label', (paused ? 'Play' : 'Pause') + ' dinner examples');
    schedule();
  });
  preview.addEventListener('mouseenter', function () { hovering = true; playRequested = false; schedule(); });
  preview.addEventListener('mouseleave', function () { hovering = false; schedule(); });
  preview.addEventListener('focusin', schedule);
  preview.addEventListener('focusout', function () { window.setTimeout(schedule, 0); });
  document.addEventListener('visibilitychange', schedule);
  new MutationObserver(schedule).observe(stage, { attributes: true, attributeFilter: ['class'] });
  new IntersectionObserver(function (entries) {
    visible = entries[0].isIntersecting;
    schedule();
  }).observe(preview);
  // Reduced motion leaves all examples available by hand, without a running clock.
  function fitMotion() {
    pause.hidden = motion.matches;
    wind();
  }
  motion.addEventListener('change', fitMotion);
  fitMotion();
})();
