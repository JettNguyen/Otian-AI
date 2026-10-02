/* Three illustrative outcomes share the hero's real chat surface. */
(function () {
  'use strict';
  var stage = document.querySelector('.day-stage');
  var preview = document.querySelector('.hm-evening');
  if (!stage || !preview) return;
  var jobs = Array.from(document.querySelectorAll('[data-dinner-job]'));
  var picks = Array.from(preview.querySelectorAll('[data-dinner-pick]'));
  var outcome = preview.querySelector('.hm-dinner-outcome');
  var pause = preview.querySelector('.hm-dinner-pause');
  var motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var lines = ['drafted Sam’s reply.', 'flagged your next bill.', 'caught a return deadline.'];
  var current = 0, timer = 0, visible = false, paused = false, hovering = false, playRequested = false;

  function schedule() {
    window.clearTimeout(timer);
    timer = 0;
    if (motion.matches || paused || document.hidden || !visible ||
        !stage.classList.contains('is-hero') ||
        (!playRequested && (hovering || preview.contains(document.activeElement)))) return;
    timer = window.setTimeout(function () {
      show((current + 1) % jobs.length);
      schedule();
    }, 7000);
  }

  function show(index) {
    current = index;
    jobs.forEach(function (job, i) { job.classList.toggle('is-on', i === index); });
    picks.forEach(function (button, i) { button.setAttribute('aria-pressed', String(i === index)); });
    outcome.textContent = lines[index];
  }

  picks.forEach(function (button, i) {
    button.addEventListener('click', function () { playRequested = false; show(i); schedule(); });
  });
  pause.addEventListener('click', function () {
    paused = !paused;
    playRequested = !paused;
    pause.setAttribute('aria-pressed', String(paused));
    pause.textContent = paused ? 'Play' : 'Pause';
    pause.setAttribute('aria-label', (paused ? 'Play' : 'Pause') + ' dinner examples');
    schedule();
  });
  preview.addEventListener('mouseenter', function () { hovering = true; playRequested = false; schedule(); });
  preview.addEventListener('mouseleave', function () { hovering = false; schedule(); });
  preview.addEventListener('focusin', schedule);
  preview.addEventListener('focusout', function () { window.setTimeout(schedule, 0); });
  document.addEventListener('visibilitychange', schedule);
  motion.addEventListener('change', schedule);
  new MutationObserver(schedule).observe(stage, { attributes: true, attributeFilter: ['class'] });
  new IntersectionObserver(function (entries) {
    visible = entries[0].isIntersecting;
    schedule();
  }).observe(preview);
  // Reduced motion leaves all examples available by hand, without a running timer.
  pause.hidden = motion.matches;
  motion.addEventListener('change', function () { pause.hidden = motion.matches; });
})();
