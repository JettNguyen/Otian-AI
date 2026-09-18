/* Archie Mobile's stage: one phone, four acts, and the scroll is the clock. The mechanism is
   js/home.js's day (read its long comment first) with one object on the stage, no camera and no
   Ember. What it turns one number (how far the reader is through .mb-story) into: which caption
   is lit, which name on the rail, which screen is up on the phone, where the phone stands, which
   pieces of the screen have landed, and for the last act where the message is on the line and
   whether it is sealed.

   THE STAGE PINS ONLY ONCE THIS HAS RUN. The stylesheet's resting layout is the unpinned one, the
   three stills and then every caption (styles.css section 50). is-live on the story is what pins
   it, and this never sets it under reduced motion, so that reader keeps the stack of stills. */
(function () {
  'use strict';

  var story = document.querySelector('.mb-story');
  if (!story) return;
  var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (still) return;

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var stage = $('.mb-stage', story), wrap = $('.mb-scene-wrap', story), scene = $('.mb-scene', story);
  var phone = $('.mb-phone', story), line = $('#mbLine', story), msg = $('#mbMsg', story);
  var hint = $('.day-hint', story), rail = $('.mb-rail', story);
  var caps = $$('.day-cap', story), scrs = $$('.mk-scr', story), steps = rail ? $$('li', rail) : [];
  var nodePc = $('.mb-node--pc', story), nodeBox = $('.mb-node--box', story), nodePh = $('.mb-node--ph', story);
  if (!stage || !wrap || !scene || !phone || !line || !msg || !scrs.length) return;
  var beats = $$('.day-beat', story).map(function (el) {
    return { el: el, act: +el.getAttribute('data-act'), at: +el.getAttribute('data-at') };
  });
  story.classList.add('is-live');

  /* How much scroll each act gets, in acts. The hero is short so the first thing moves after a
     push; the lap gets a quarter more because it is the act that moves. The stylesheet's
     .mb-story.is-live height is the same sum and must agree. */
  var N = 4, SETTLE = 0.3;
  var LEN = [0.25, 1, 1, 1.25], CUM = [0], TOT = 0;
  LEN.forEach(function (l) { TOT += l; CUM.push(TOT); });

  /* Per act: which screen is up, and where the phone stands. Wide it stands right of the box's
     centre for the whole story, so the line has the left; the last act keeps the conversation up
     and the phone where it is, because the phone is the line's third point. Narrow the phone is
     on the centre line and steps out for the last act, where a drawn phone stands in for it. */
  var ACTS = [
    { scr: 0, px: 160, npx: 0, po: 1, npo: 1, line: 0 },
    { scr: 1, px: 160, npx: 0, po: 1, npo: 1, line: 0 },
    { scr: 2, px: 160, npx: 0, po: 1, npo: 1, line: 0 },
    { scr: 1, px: 160, npx: 0, po: 1, npo: 0, line: 1 }
  ];

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  /* SC: the design box fitted to the slab, every frame, up as well as down, with the same ceiling
     as the homepage's box (js/home.js says why). */
  var SC = 1, narrow = false;
  var narrowQ = window.matchMedia ? window.matchMedia('(max-width: 970px)') : null;
  function fit() {
    narrow = !!(narrowQ && narrowQ.matches);
    var wr = wrap.getBoundingClientRect();
    SC = narrow ? clamp(Math.min(wr.width / 400, wr.height / 560), 0.3, 1.45)
                : clamp(Math.min((wr.width - 24) / 760, (wr.height - 24) / 560), 0.4, 1.45);
    scene.style.transform = 'scale(' + SC.toFixed(3) + ')';
  }

  /* The lap, in box coordinates: [time, x] along the line's row. Phone to mailbox to computer,
     a hold there while the agent does the thing, and back the same way. The message is sealed
     everywhere but at the two ends, which is the claim, and dims while it is under a point or
     inside the phone. Wide the phone's edge is the line's end; narrow the drawn phone is. */
  var ROW = 280, PC = 70;
  function box() { return narrow ? 200 : 235; }
  function ph() { return narrow ? 330 : 400; }
  function lap() {
    var b = box(), p = ph();
    return [[0, p], [0.08, p], [0.3, b], [0.38, b], [0.55, PC], [0.68, PC], [0.85, b], [0.92, b], [1, p]];
  }
  function lapX(path, t) {
    for (var i = 1; i < path.length; i++) {
      if (t <= path[i][0]) {
        var a = path[i - 1], c = path[i], u = (t - a[0]) / (c[0] - a[0] || 1);
        return a[1] + (c[1] - a[1]) * u;
      }
    }
    return path[path.length - 1][1];
  }

  var cur = -1;
  function setAct(i) {
    if (i === cur) return;
    cur = i;
    caps.forEach(function (c, j) { c.classList.toggle('is-on', j === i); });
    steps.forEach(function (s, j) { s.classList.toggle('is-on', j === i); });
    scrs.forEach(function (s) { s.classList.toggle('is-on', +s.getAttribute('data-scr') === ACTS[i].scr); });
    phone.style.setProperty('--px', (narrow ? ACTS[i].npx : ACTS[i].px) + 'px');
    phone.style.setProperty('--po', String(narrow ? ACTS[i].npo : ACTS[i].po));
  }

  var wasNarrow = null;
  function frame() {
    var r = story.getBoundingClientRect();
    var vh = window.innerHeight;
    var total = story.offsetHeight - vh;
    var p = clamp(-r.top / (total || 1), 0, 1);
    var u = p * TOT, i = N - 1;
    for (var a = 0; a < N; a++) { if (u < CUM[a + 1]) { i = a; break; } }
    var t = clamp((u - CUM[i]) / LEN[i], 0, 1);
    fit();
    /* A change of layout re-poses the phone for the act it is in. */
    if (narrow !== wasNarrow) { wasNarrow = narrow; cur = -1; }
    setAct(i);
    if (hint) hint.classList.toggle('is-off', p > 0.02);
    if (rail) rail.style.setProperty('--p', p.toFixed(3));

    /* Beats: a piece of a screen lands when the act's play phase passes it, stays landed in the
       acts after, and comes back off when the reader scrolls back above it. */
    var tp = i === 0 ? t : clamp((t - SETTLE) / (1 - SETTLE), 0, 1);
    beats.forEach(function (b) {
      var on = b.act < i || (b.act === i && tp >= b.at);
      if (b.el.classList.contains('is-on') !== on) b.el.classList.toggle('is-on', on);
    });

    var lineOn = i === 3;
    line.style.setProperty('--fo', lineOn ? '1' : '0');
    if (lineOn) {
      var x = lapX(lap(), tp);
      msg.style.left = x + 'px'; msg.style.top = ROW + 'px';
      var sealed = (tp > 0.09 && tp < 0.54) || (tp > 0.69 && tp < 0.99);
      msg.classList.toggle('is-sealed', sealed);
      var atBox = Math.abs(x - box()) < 36, atPc = Math.abs(x - PC) < 36, atPh = Math.abs(x - ph()) < 36;
      msg.classList.toggle('is-under', atBox || atPc || atPh);
      if (nodeBox) nodeBox.classList.toggle('is-lit', atBox);
      if (nodePc) nodePc.classList.toggle('is-lit', atPc);
      if (nodePh) nodePh.classList.toggle('is-lit', atPh);
    } else {
      msg.classList.remove('is-sealed', 'is-under');
      [nodePc, nodeBox, nodePh].forEach(function (n) { if (n) n.classList.remove('is-lit'); });
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
