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
  var pathWide = $('.mb-line-path--wide path', story);
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

  /* Per act: which screen is up, and how the phone stands. Through the three screen acts it is
     big, filling its column (ps, from fit), on the centre line and turned a few degrees toward
     the captions. For the line it comes back to the box's own size and flat, and wide it moves
     right so the line has the left, because the phone is the line's third point; narrow it steps
     out and a drawn phone stands in for it. */
  var ACTS = [
    { scr: 0, big: true, pr: -20, pp: 4, po: 1, npo: 1 },
    { scr: 1, big: true, pr: -20, pp: 4, po: 1, npo: 1 },
    { scr: 2, big: true, pr: -20, pp: 4, po: 1, npo: 1 },
    { scr: 1, big: false, pr: 0, pp: 0, po: 1, npo: 0 }
  ];
  /* THE SEALED PHONE IS A FRACTION OF THE BIG ONE, NOT OF THE BOX. Sized in box units it grew with
     the box, and past about 1250px of window the box keeps growing while the big phone is tied to
     the column's height, so the two converged and the step back was gone (Jett, 2026-09-18). At
     .78 it stands where it stood at 1250 and stays there.

     AND ITS LEFT EDGE STANDS STILL, at row 310 of the box, which is where it stood at 1100px of
     window and the gap to the mailbox Jett asked for (2026-09-18, twice: at 971 the phone had
     crossed the mailbox's icon, and at 1150 and up it had drifted away from it). Pinned by its
     right edge it moved with its size, since a narrow column's height multiplier makes a wide
     phone and a wide column's makes a small one. Pinned by its left it does not, and what moves
     instead is how much of the box's right side it fills. Wider than the room to the right of
     row 310 it gives up size rather than room. The name under it follows its bottom edge. */
  /* 344: the mailbox's icon ends at row 267, and the computer's ends 77 rows before the mailbox's
     begins, so the phone's edge stands 77 past the mailbox's (Jett, 2026-09-18: even spacing). */
  var K3 = 0.78, LEFT = 344;
  /* Through the screen acts, wide, the phone stands 48 rows right of the box's centre line rather
     than on it (Jett, 2026-09-18: "move to the right a bit"); narrow, on the line. */
  var BIG_X = 48;
  function sealed() {
    var w = Math.min(256.4 * PS * K3, 640 - 8 - LEFT);
    var k = w / (256.4 * PS), h = 516.6 * PS * k;
    return { k: k, cx: LEFT + w / 2, left: LEFT, bottom: 280 + h / 2 };
  }

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  /* SC: the design box fitted to the slab, every frame, up as well as down, with the same ceiling
     as the homepage's box (js/home.js says why). */
  /* PS: how much bigger than the box's phone the big phone is, so that it fills the column:
     nearly the column's whole height, and never wider than it. */
  var SC = 1, PS = 1, narrow = false;
  var narrowQ = window.matchMedia ? window.matchMedia('(max-width: 970px)') : null;
  function fit() {
    narrow = !!(narrowQ && narrowQ.matches);
    var wr = wrap.getBoundingClientRect();
    SC = narrow ? clamp(Math.min(wr.width / 400, wr.height / 560), 0.3, 1.45)
                : clamp(Math.min((wr.width - 24) / 640, (wr.height - 24) / 560), 0.4, 1.25);
    scene.style.transform = 'scale(' + SC.toFixed(3) + ')';
    /* Narrow, the line drawing is fitted to the stage's width on its own, whatever the box came
       out at (styles.css says why), up to 480px of it: on a tablet 90% of the stage made three
       points the size of saucers (Jett, 2026-09-18). Wide it is the box's. */
    line.style.setProperty('--ls', narrow ? ((Math.min(wr.width * 0.9, 480) / 400) / SC).toFixed(3) : '1');
    /* The device is 256.4 by 516.6 at the box's own zoom; the multiplier sizes it to the column,
       air left at the ends, and never wider than the column. It filled 94% of the height for a
       day and that was "way too big" (Jett, 2026-09-18), so it takes about six sevenths. */
    var byH = (wr.height * (narrow ? 0.88 : 0.86)) / (516.6 * SC);
    var byW = (wr.width * (narrow ? 0.82 : 0.8)) / (256.4 * SC);
    PS = clamp(Math.min(byH, byW), 1, 2.2);
  }

  /* The bezel's four highlights, the angle of its sheen and the sliver of rim the turn exposes
     are read off the phone's yaw, with the homepage's formulas (js/home.js says how they were
     set), once per act rather than per frame, because the phone here holds its angle. */
  function light(yaw, pitch) {
    var sy = Math.sin(yaw * Math.PI / 180), sp = Math.sin(pitch * Math.PI / 180);
    var dev = $('.dp-device', phone);
    if (!dev) return;
    dev.style.setProperty('--edge-l', clamp(0.13 + 0.55 * sy, 0.02, 0.42).toFixed(3));
    dev.style.setProperty('--edge-r', clamp(0.13 - 0.55 * sy, 0.02, 0.42).toFixed(3));
    dev.style.setProperty('--edge-t', clamp(0.21 + 0.9 * sp, 0.05, 0.45).toFixed(3));
    dev.style.setProperty('--edge-b', clamp(0.13 - 0.9 * sp, 0.03, 0.4).toFixed(3));
    phone.style.setProperty('--lit', (-yaw * 0.7).toFixed(1) + 'deg');
    phone.style.setProperty('--rim-x', clamp(50 - 100 * sy, 6, 94).toFixed(1) + '%');
    phone.style.setProperty('--rim-a', clamp(Math.abs(sy) * 0.43, 0, 0.22).toFixed(3));
  }

  /* The lap, in box coordinates: [time, x] along the line's row. Phone to mailbox to computer,
     a hold there while the agent does the thing, and back the same way. The message is sealed
     everywhere but at the two ends, which is the claim, and dims while it is under a point or
     inside the phone. Wide the phone's edge is the line's end; narrow the drawn phone is. */
  var ROW = 280;
  function pc() { return narrow ? 66 : 85; }
  function box() { return narrow ? 200 : 232; }
  /* Wide the message stops beside the phone's edge, its own width clear of the glass. */
  function ph() { return narrow ? 334 : sealed().left - 22; }
  function lap() {
    var b = box(), p = ph(), c = pc();
    return [[0, p], [0.08, p], [0.3, b], [0.38, b], [0.55, c], [0.68, c], [0.85, b], [0.92, b], [1, p]];
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
    phone.style.setProperty('--pr', ACTS[i].pr + 'deg');
    phone.style.setProperty('--pp', ACTS[i].pp + 'deg');
    phone.style.setProperty('--po', String(narrow ? ACTS[i].npo : ACTS[i].po));
    light(ACTS[i].pr, ACTS[i].pp);
  }
  /* The zoom multiplier is the column's, every act; the sealed act steps the phone back by a
     transform, which is what transitions, and moves it right so the line has the left. */
  var psWas = '', pkWas = '', pxWas = '', geoWas = '';
  function size(i) {
    var g = sealed(), v = PS.toFixed(3), big = ACTS[i].big, k = (big ? 1 : g.k).toFixed(3);
    var x = (narrow ? 0 : big ? BIG_X : g.cx - 320).toFixed(1);
    if (v !== psWas) { psWas = v; phone.style.setProperty('--ps', v); }
    if (k !== pkWas) { pkWas = k; phone.style.setProperty('--pk', k); }
    if (x !== pxWas) { pxWas = x; phone.style.setProperty('--px', x + 'px'); }
    /* Wide, the phone's name follows the phone; narrow, the drawn phone stands where the
       stylesheet puts it, so the inline position comes off, because an inline custom property
       outranks the stylesheet's and left the node off the right of the box (Jett, 2026-09-18:
       no icon for the phone under 971). */
    var geo = narrow ? 'n' : g.left.toFixed(1) + '/' + g.bottom.toFixed(1);
    if (geo !== geoWas) {
      geoWas = geo;
      if (pathWide) pathWide.setAttribute('d', 'M85 280H' + (g.left - 8).toFixed(1));
      if (nodePh && narrow) { nodePh.style.removeProperty('--nx'); nodePh.style.removeProperty('--ny'); }
      /* The name's centre is 42 rows under the phone's bottom edge: the name is about 42 rows tall,
         so it clears the edge by about 20. At 28 its top sat on the glass (Jett, 2026-09-18). */
      else if (nodePh) { nodePh.style.setProperty('--nx', g.cx.toFixed(1) + 'px'); nodePh.style.setProperty('--ny', (g.bottom + 42).toFixed(1) + 'px'); }
    }
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
    size(i);
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
      var atBox = Math.abs(x - box()) < 36, atPc = Math.abs(x - pc()) < 36, atPh = Math.abs(x - ph()) < 36;
      /* The points stand above the line now, so nothing is under one; the message dims only at
         the phone's end, where it has gone in. */
      msg.classList.toggle('is-under', atPh);
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
