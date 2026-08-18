/* Homepage-only behavior: the stat count-up, the day-spine draw, and the
   screenshot carousel. Everything here is decoration on top of a page that
   reads fine without it: the numbers are printed in the HTML, the spine's
   CSS default is fully drawn, and the first screenshot tab starts selected.
   Reduced motion skips the count-up, the draw, and the autoplay. */
(function () {
  'use strict';

  var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Stat count-up: read the final value from the markup, animate up to it once
     the row scrolls into view. 900ms, cubic ease-out. */
  var nums = document.querySelectorAll('.hm-numbers b');
  if (!still && 'IntersectionObserver' in window && nums.length) {
    var nio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        nio.unobserve(e.target);
        var end = parseInt(e.target.textContent, 10);
        if (!end) return;
        var t0 = null;
        function tick(t) {
          if (!t0) t0 = t;
          var k = Math.min((t - t0) / 900, 1);
          e.target.textContent = Math.round(end * (1 - Math.pow(1 - k, 3)));
          if (k < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.6 });
    nums.forEach(function (el) { nio.observe(el); });
  }

  /* Day-spine draw: the line's height follows scroll through the section,
     kept slightly ahead of the reader so the tip never lags down-screen. */
  var spine = document.querySelector('.hm-spine');
  if (spine && !still) {
    spine.style.setProperty('--hm-draw', 0);
    /* Scroll sets a target; the line eases toward it each frame instead of
       jumping. A slow scroll keeps the tip pinned about two thirds down the
       viewport; a fast flick leaves the line behind for a beat and you watch
       it glide to catch up. */
    var target = 0;
    var cur = 0;
    var raf = null;
    var settle = function () {
      raf = null;
      cur += (target - cur) * 0.14;
      if (Math.abs(target - cur) < 0.002) cur = target;
      spine.style.setProperty('--hm-draw', cur);
      if (cur !== target) raf = requestAnimationFrame(settle);
    };
    var measure = function () {
      var r = spine.getBoundingClientRect();
      target = Math.max(0, Math.min(1, (window.innerHeight * 0.66 - r.top) / (r.height * 0.96)));
      if (!raf) raf = requestAnimationFrame(settle);
    };
    window.addEventListener('scroll', measure, { passive: true });
    measure();
  }

  /* Screenshot carousel: advance every 5 seconds; a click holds the chosen
     slide for 15 before autoplay resumes. No autoplay under reduced motion. */
  var shots = document.querySelectorAll('.hm-shot');
  var tabs = document.querySelectorAll('.hm-shots-tab');
  if (shots.length && tabs.length) {
    var timer = null;
    var cur = function () {
      var c = 0;
      shots.forEach(function (s, i) { if (s.classList.contains('is-on')) c = i; });
      return c;
    };
    var show = function (n) {
      shots.forEach(function (s, i) { s.classList.toggle('is-on', i === n); });
      tabs.forEach(function (b, i) {
        b.classList.toggle('is-on', i === n);
        b.setAttribute('aria-selected', i === n ? 'true' : 'false');
      });
    };
    var schedule = function (ms) {
      clearTimeout(timer);
      timer = setTimeout(function () { show((cur() + 1) % shots.length); schedule(5000); }, ms);
    };
    tabs.forEach(function (b, i) {
      b.addEventListener('click', function () { show(i); if (!still) schedule(15000); });
    });
    if (!still) schedule(5000);
  }
})();
