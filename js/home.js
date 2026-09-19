/* The homepage's day-spine draw and the scene picker on an .hm-stage. Both are
   decoration on top of a page that reads fine without them: the spine's CSS
   default is fully drawn, reduced motion skips the draw, and the stage cycles
   on its own. The stage is on the homepage hero and, since 2026-09-16, on
   how-it-works/, so this file loads on both.

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


  /* ==============================================================================================
     THE DAY. The homepage since 2026-09-16: one sticky stage, eight acts, and the scroll is the
     clock. Everything below turns one number, how far the reader is through .day-story, into a
     camera pose, a set of beats, and a place for Ember to stand.

     The shape of it, so the next person does not have to re-derive it:

       ACTS  One entry per act. `pose` is where the camera, the window and the phone are and how
             dark the stage is; poses are lerped over the first 30% of each act's scroll so an act
             settles before it plays. `narrow` is the same pose for a screen under 971px, where
             the objects stack in depth inside a 400 by 560 box instead of sitting side by side
             in a 760 by 560 one. `mark` names the element Ember stands on; `state` is what Ember
             is doing there; `scr` is which phone screen is up; `clock` is the chip.
       SC    The scene is a design box scaled to fit what the stage gives it, every frame, so a
             pose only has to keep its objects inside the box and nothing is placed by viewport
             arithmetic. Wide, the box may spill 100px past its column; narrow, it takes the
             stage's full width.
       LEN   How much scroll each act gets, in acts: the hero is a short one, so the first thing
             moves after a push rather than after a full screen of nothing, and setup is a long
             one, because six things happen in it and one screen of scroll gave each of them
             about ninety pixels (Jett, 2026-09-17: "too small between the steps"). The
             stylesheet's .day-story height is the same sum and must agree.
       BEATS Any element with class="day-beat" and data-act / data-at (a fraction of the act's
             play phase) lights when the scroll passes it and goes dark when the scroll comes
             back. A data-until makes it a window, which is how the typing dots go away.
       MARKS Ember is one element, absolute inside the stage. Each frame the driver reads the
             mark's projected rectangle (getBoundingClientRect sees through the 3D transforms)
             against the stage's own, puts Ember's feet on it, and eases. A new mark is a hop.
             Past the story Ember is lifted into the box beside the closing button and waits
             there. Inside a box rather than fixed to the viewport, because a fixed element
             chasing marks on a sticky stage is measured a frame behind the compositor's scroll
             and stutters; inside the box it rides the box's scroll and only its walks are eased.

     Two controls are real, and both are the product's own: the send knob on the composer, once
     the calendar act's yes sits typed in it (the skill takes approval as a later message, never
     a button), and Send on the mail card. A press lights the button, and on the mail card it stays
     lit and busy until the computer answers, the way the phone app holds it; then the screen is
     done, which the stylesheet turns into the edited card or the follow-up bubbles, the mail card
     gets the computer's answer as a notice, and Ember hops. NEITHER ACT WAITS FOREVER: further down each one the scroll
     presses the button the reader has not, because the sent card and the moved meeting are what
     the two acts are claiming and they were sitting behind a click most readers never make
     (SENDS below). The custody toggle redraws the lap for starter credits, in TRUST.md's own
     sentence.

     Under reduced motion the stage is unpinned by the stylesheet and this only places Ember on
     the hero mark, snapped rather than eased, so the page reads as a stack of stills.
     ============================================================================================== */
  var story = document.querySelector('.day-story');
  if (story && window.Ember) (function () {
    var $ = function (s, r) { return (r || document).querySelector(s); };
    var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
    var stage = $('.day-stage'), scene = $('.day-scene'), win = $('.day-win'), phone = $('.day-phone');
    var floorC = $('#dayFloorCustody'), floorS = $('#dayFloorSetup'), dot = $('#dayDot'), gate = $('#dayGate');
    var clock = $('.day-clock'), hint = $('.day-hint'), mins = $('#dayMinutes'), pie = $('#dayPie');
    var caps = $$('.day-cap'), scrs = $$('.dp-scr'), steps = $$('#dayFloorSetup .step');
    var phoneClock = $('[data-day-clock]'), ph = $('.dp-ph'), scr1 = $('.dp-scr[data-scr="1"]');
    var ember = $('.day-ember'), ctaBox = $('.day-cta-mark'), grow = $('.dp-scr--grow');
    /* The yes is typed one character at a time, and the scroll is what types it, so scrolling back
       takes the characters off again. Read the sentence out of the markup rather than repeating it
       here: the markup is what a reader with reduced motion and a crawler both get, and it carries
       the whole line. TYPED_AT and TYPED_FOR are where in the act it starts and how much of the act
       it takes, which is about a fifth of a screen of scroll for fourteen characters. */
    var typedEl = $('.dp-msgbox .typed'), TYPED = typedEl ? typedEl.textContent : '', typedCut = -1;
    var TYPED_AT = 0.5, TYPED_FOR = 0.22;
    /* THE SCROLL SENDS IT IF THE READER DOES NOT (2026-09-18). Both of these screens end in a
       control the reader works, and both were a dead end for a reader who only scrolls: the
       calendar's yes and the mail card's Send are what make each act's claim visible, and until
       today someone who never pressed either one never saw the move land or the card edit itself to
       "Sent to". The claim was sitting behind a click that most readers do not make.

       THE BUTTON IS STILL FIRST, and that is the point of doing it this way rather than animating
       the send outright. It is live from the moment its screen is up, a press does the whole thing
       then and there, and the scroll only steps in further down the act if the press has not come,
       so the tier-three control is still a control and not a decoration. `from` is where the screen
       stops being assembled and `at` is where the scroll gives up waiting; scrolling back under
       `from` takes it apart again, the way every other beat on this stage runs backwards, and
       arriving from a later act settles it with no linger, so scrolling up into a finished act does
       not replay a button lighting itself. */
    var scr2 = $('.dp-scr[data-scr="2"]');
    var SENDS = [{ el: scr1, key: 1, act: 1, from: TYPED_AT, at: 0.8, busy: false },
                 { el: scr2, key: 2, act: 2, from: 0.06, at: 0.32, done: 0.46, busy: true }];
    if (!stage || !scene || !win || !phone || !ember) return;
    var beats = $$('.day-beat').map(function (el) {
      return { el: el, act: +el.getAttribute('data-act'), at: +el.getAttribute('data-at'), until: el.hasAttribute('data-until') ? +el.getAttribute('data-until') : 9 };
    });
    var marks = {};
    $$('[data-mark]').forEach(function (el) { marks[el.getAttribute('data-mark')] = el; });

    var SETTLE = 0.3;
    var LEN = [0.25, 1, 1, 1, 1, 1, 1, 2], CUM = [0], TOT = 0;
    /* The act count is LEN's own length. It was a separate literal until 2026-09-18, and adding
       the seventh act moved one of the two and not the other, which lands the last act's scroll
       on the act before it: the setup track never lit and nothing threw. Two numbers that must
       agree are one number. */
    var N = LEN.length;
    /* The hero starts moving on the first pixel of scroll: through its own act the camera goes
       this far toward the calendar pose, and the calendar act's settle finishes the trip. */
    var PRE = 0.5;
    LEN.forEach(function (l) { TOT += l; CUM.push(TOT); });
    /* The layers' scales fold in the mockups' zoom (styles.css section 49): the app is drawn at
       .4375 and shown at 1.143 of that, the phone at .63 and shown at .857 and .943 of that, so
       each is rastered near the size it is seen. */
    var W = { x: -60, y: -30, z: -140, ry: 12, s: 1.143, o: 1 }, PH = { x: 170, y: 30, z: 70, ry: -14, s: .857, o: 1 };
    var W2 = { x: -150, y: -50, z: -240, ry: 18, s: 1.143, o: .5 }, PH2 = { x: 100, y: 10, z: 150, ry: -12, s: .943, o: 1 };
    /* The narrow set, for the 400 by 560 box: the window behind and up, the phone in front and
       down in the hero; the phone alone and centered while a scene plays on it; the window alone
       at night. Every extent stays inside the box, which is what lets SC do the fitting. */
    var NW = { x: -70, y: -150, z: -300, ry: 14, s: .8, o: 1 }, NP = { x: 40, y: 25, z: 40, ry: -12, s: 1.1, o: 1 };
    var NW2 = { x: -150, y: -200, z: -420, ry: 24, s: .7, o: .3 }, NP2 = { x: 0, y: 0, z: 60, ry: -8, s: 1.22, o: 1 };
    function copy(o, over) { var r = {}, k; for (k in o) r[k] = o[k]; for (k in (over || {})) r[k] = over[k]; return r; }
    var ACTS = [
      { mark: 'm-hero', state: 'idle', clock: '7:00 am', phone: '7:00', scr: 0,
        pose: { cam: { rx: 5, ry: -12, s: 1 }, win: W, phone: PH, night: 0, fc: 0, fs: 0 },
        narrow: { cam: { rx: 4, ry: -8, s: 1 }, win: NW, phone: NP, night: 0, fc: 0, fs: 0 } },
      { mark: 'm-phone', state: 'idle', clock: '9:12 am', phone: '9:12', scr: 1,
        pose: { cam: { rx: 2, ry: -5, s: 1.05 }, win: W2, phone: PH2, night: 0, fc: 0, fs: 0 },
        narrow: { cam: { rx: 2, ry: -4, s: 1 }, win: NW2, phone: NP2, night: 0, fc: 0, fs: 0 } },
      { mark: 'm-phone', state: 'idle', clock: '1:40 pm', phone: '1:40', scr: 2,
        pose: { cam: { rx: 2, ry: 3, s: 1.05 }, win: copy(W2, { x: -170, z: -260, ry: 20, o: .4 }), phone: copy(PH2, { x: 90, ry: 10, z: 160 }), night: 0, fc: 0, fs: 0 },
        narrow: { cam: { rx: 2, ry: 2, s: 1 }, win: copy(NW2, { ry: 24 }), phone: copy(NP2, { ry: 8 }), night: 0, fc: 0, fs: 0 } },
      { mark: 'm-computer', state: 'idle', clock: '', phone: '1:40', scr: -1,
        pose: { cam: { rx: 0, ry: 0, s: 1 }, win: copy(W2, { o: 0 }), phone: copy(PH2, { o: 0 }), night: 0, fc: 1, fs: 0 },
        narrow: { cam: { rx: 0, ry: 0, s: 1 }, win: copy(NW2, { o: 0 }), phone: copy(NP2, { o: 0 }), night: 0, fc: 1, fs: 0 } },
      { mark: 'm-phone', state: 'idle', clock: '4:15 pm', phone: '4:15', scr: 4,
        pose: { cam: { rx: 3, ry: -8, s: 1.04 }, win: copy(W2, { ry: 16 }), phone: copy(PH2, { ry: -14 }), night: 0, fc: 0, fs: 0 },
        narrow: { cam: { rx: 3, ry: -6, s: 1 }, win: copy(NW2, { ry: 18 }), phone: copy(NP2, { ry: -10 }), night: 0, fc: 0, fs: 0 } },
      { mark: 'm-window', state: 'working', clock: '2:00 am', phone: '2:00', scr: 5,
        /* The one act where the phone is not the subject. Everywhere else it may sit over the
           window, but at two in the morning the window is what the act is about and both lists are
           filling in at once, so a phone over it hides the evidence (Jett, 2026-09-17: "i cannot
           see what is happening behind the phone"). On W and PH it covered the right 42% of the
           window's content column, which is the column Recent work is in and exactly where each
           row's time and badge sit.

           WHAT IT MAY COVER IS THE EDGE, NOT THE ROWS (Jett, same day: it "can move slightly over
           the desktop app window to cover its right edge"). The app's page carries 32px of right
           padding and each row 16px more, in its own 1040px coordinates, and it is drawn at zoom
           .4375, so 21px of the window's right edge is padding and the phone may stand on it. It
           takes 9 of those and still clears the nearest badge by 12, which reads as one scene
           rather than as two objects holding themselves apart. The window keeps s 1.143: .4375
           times 1.143 is exactly a half, and rastering the app off a half is what made hairlines
           shimmer, so the phone is the one that gives up size. IT GIVES UP SIZE AND NOTHING ELSE:
           it held at .45 here so the window would be the lit thing in the room, and a mockup drawn
           at less than full strength is a mockup with a film over it (Jett, 2026-09-17: "ensure
           full opaqueness of the phone"). Standing smaller, further right and a little behind the
           window is what makes the window the subject, and that is done with the pose. The night
           is on the stage, so both objects wear it and neither is faded into it.

           Narrow they cannot stand side by side, because the phone is nearly the box's width by
           design, so they stack instead: the window up, the phone down, and the only thing the
           phone's masked band reaches is the window's own bottom padding. */
        pose: { cam: { rx: 5, ry: -12, s: 1 }, win: copy(W, { x: -162 }), phone: copy(PH, { x: 208, s: .74 }), night: 1, fc: 0, fs: 0 },
        narrow: { cam: { rx: 4, ry: -8, s: 1 }, win: { x: -41, y: -212, z: -320, ry: 16, s: 1, o: .9 }, phone: { x: 30, y: 165, z: 40, ry: -6, s: 1.1, o: 1 }, night: 1, fc: 0, fs: 0 } },
      { mark: 'm-phone', state: 'idle', clock: '7:00 am', phone: '7:00', scr: 6,
        /* The exhale, added 2026-09-18. The day had six acts of an agent doing things and no
           moment where the reader feels anything, and relief is the drive the page was weakest
           on: index.html carried no instance of "hours" or "time back" at all. It closes the
           loop rather than adding a scene, because the 2:00 am act ends on "Morning Brief,
           Next, 7:00 AM" and this is that brief arriving. The clock reading 7:00 a second time
           is the payoff: same hour as the hero, and this time the list is in the past tense.
           Phone forward, window pushed back, and the night is off. */
        pose: { cam: { rx: 4, ry: -9, s: 1.02 }, win: copy(W2, { ry: 14 }), phone: copy(PH2, { ry: -9 }), night: 0, fc: 0, fs: 0 },
        narrow: { cam: { rx: 3, ry: -6, s: 1 }, win: NW2, phone: NP2, night: 0, fc: 0, fs: 0 } },
      { mark: 'm-s0', state: 'idle', clock: '', phone: '7:00', scr: -1,
        pose: { cam: { rx: 0, ry: 0, s: 1 }, win: copy(W, { o: 0 }), phone: copy(PH, { o: 0 }), night: 0, fc: 0, fs: 1 },
        narrow: { cam: { rx: 0, ry: 0, s: 1 }, win: copy(NW, { o: 0 }), phone: copy(NP, { o: 0 }), night: 0, fc: 0, fs: 1 } }
    ];
    function poseOf(i) { return narrow ? ACTS[i].narrow : ACTS[i].pose; }
    /* The five minute marks, from FACTS.md: what the clock over the setup track reaches as each
       step is lit. Estimates, and the caption says so. */
    var MINUTES = [1, 3, 7, 9, 10];

    function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
    function smooth(t) { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); }
    function lerpPose(a, b, u) {
      var out = {}, k;
      for (k in a) out[k] = typeof a[k] === 'number' ? a[k] + (b[k] - a[k]) * u : lerpPose(a[k], b[k], u);
      return out;
    }

    /* The stage tilts a few degrees toward the pointer on a device that has one. Tier three, and
       the smallest control on the page: it is what makes a drawing of two objects read as two
       objects with air between them. */
    var tilt = { x: 0, y: 0, tx: 0, ty: 0 };
    var fine = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (fine && !still) {
      window.addEventListener('pointermove', function (e) {
        tilt.tx = (e.clientX / window.innerWidth - 0.5) * 6;
        tilt.ty = (0.5 - e.clientY / window.innerHeight) * 4;
      }, { passive: true });
    }
    /* SC: the design box fitted to the stage, read every frame so a phone's browser bar coming
       and going, or a window being resized, never leaves an object cut off. Wide, the box may
       spill 100px past its column, which the caption column's own margin absorbs; narrow, it takes
       the stage's full width and the row the captions leave it.

       IT FITS UP AS WELL AS DOWN, SINCE 2026-09-17. This was clamped at 1, meaning the scene was
       never drawn larger than its design box however much room the stage had, and the room is not
       small: uncapped it reads 1.10 on a 1280 by 800 screen, 1.31 on a 1440 by 900 and 1.74 on a
       1920 by 1080, so most readers were seeing the objects at two thirds of the space they had.
       That is what made the phone's type small enough to look washed out (Jett: "draw the mockups
       bigger if there is room"). The ceiling is 1.45 rather than none, because past that the phone
       stops being an object in a room and becomes the page.

       THE 100px SPILL IS A CONCESSION, NOT AN ENTITLEMENT. It exists so a narrow column can still
       hold the scene, and once the scene is growing there is nothing to concede: the branch below
       drops it the moment the spill would push the box past its own design size, so a scene that
       is growing never crosses into the caption column. The two agree at the crossover, where the
       wrap is 660 and both read 1, so nothing jumps as the window is dragged wider. */
    var SC = 1, narrow = false, wrap = $('.day-scene-wrap');
    var narrowQ = window.matchMedia ? window.matchMedia('(max-width: 970px)') : null;
    function fit() {
      narrow = !!(narrowQ && narrowQ.matches);
      var wr = wrap.getBoundingClientRect(), sr = stage.getBoundingClientRect();
      var byW = (wr.width + 100) / 760;
      if (byW > 1) byW = Math.max(1, wr.width / 760);
      SC = narrow ? clamp(Math.min(sr.width / 400, wr.height / 560), 0.3, 1.45)
                  : clamp(Math.min(byW, wr.height / 560), 0.4, 1.45);
      /* The pool of light under the scene is sized off the scene and not off the wrap, so it stays
         the same pool whatever the fit came out at. */
      stage.style.setProperty('--sc', SC.toFixed(3));
    }

    function applyPose(p) {
      scene.style.transform = 'scale(' + SC + ') rotateX(' + (p.cam.rx + tilt.y).toFixed(2) + 'deg) rotateY(' + (p.cam.ry + tilt.x).toFixed(2) + 'deg) scale(' + p.cam.s.toFixed(3) + ')';
      win.style.transform = 'translate3d(' + p.win.x.toFixed(1) + 'px,' + p.win.y.toFixed(1) + 'px,' + p.win.z.toFixed(1) + 'px) rotateY(' + p.win.ry.toFixed(2) + 'deg) scale(' + p.win.s.toFixed(3) + ')';
      win.style.opacity = p.win.o.toFixed(3);
      phone.style.transform = 'translate3d(' + p.phone.x.toFixed(1) + 'px,' + p.phone.y.toFixed(1) + 'px,' + p.phone.z.toFixed(1) + 'px) rotateY(' + p.phone.ry.toFixed(2) + 'deg) scale(' + p.phone.s.toFixed(3) + ')';
      /* On the phone, not down on its layers: see the comment above .dp-device in the stylesheet
         for why the per-layer fade was tried and taken back. */
      phone.style.opacity = p.phone.o.toFixed(3);
      /* The light on the phone's edges moves with its angle to the camera. The side turned toward
         the light blazes and the other goes nearly out; the top and bottom follow the camera's
         pitch; the bezel's bright corners slide around with the sheen; and the sliver of rim the
         turn exposes carries a bright line down it, on the side it is showing (a turn to the left
         brings the rim out on the left, since the rim stands behind the glass). The stylesheet
         reads all of these on the phone.

         THE SIZE OF THE SWING IS THE WHOLE POINT, AND IT TOOK TWO PASSES TO SET. These started at
         1.1 per unit of sine against a 0.48 ceiling, and the poses only yaw about -26 to +13
         degrees, so the lit side sat on that ceiling in most frames of the story and every frame of
         the overnight act: not light moving over metal, a fixed streak of half-white down one edge
         of the glass (Jett, 2026-09-17: "the glass glare is also a bit too harsh"). Scaling them
         to the yaw the poses actually use fixed the pinning and went too far the other way (Jett,
         same day: "bring back some of the glare"), so they sit between the two now. The rule that
         survives both passes: PRINT THESE FOR EVERY ACT AND CHECK NOTHING SITS ON ITS CEILING,
         including at the ends of the pointer tilt, which is 3 degrees of yaw and 2 of pitch. The
         floors are a different thing and are meant to be reached: the side turned away goes out
         and stays out at .02, which is ambient and not a highlight. As they stand the lit side
         runs .21 to .40 across the story and the rim's line .04 to .21, both moving the whole way.
         A highlight that never changes is not read as metal, and neither is one that never
         stops. */
      var yaw = p.cam.ry + tilt.x + p.phone.ry, sy = Math.sin(yaw * Math.PI / 180);
      var pitch = p.cam.rx + tilt.y, sp = Math.sin(pitch * Math.PI / 180);
      phone.style.setProperty('--edge-l', clamp(0.13 + 0.55 * sy, 0.02, 0.42).toFixed(3));
      phone.style.setProperty('--edge-r', clamp(0.13 - 0.55 * sy, 0.02, 0.42).toFixed(3));
      phone.style.setProperty('--edge-t', clamp(0.21 + 0.9 * sp, 0.05, 0.45).toFixed(3));
      phone.style.setProperty('--edge-b', clamp(0.13 - 0.9 * sp, 0.03, 0.4).toFixed(3));
      phone.style.setProperty('--lit', (-yaw * 0.7).toFixed(1) + 'deg');
      phone.style.setProperty('--rim-x', clamp(50 - 100 * sy, 6, 94).toFixed(1) + '%');
      phone.style.setProperty('--rim-a', clamp(Math.abs(sy) * 0.43, 0, 0.22).toFixed(3));
      floorC.style.setProperty('--fo', p.fc.toFixed(3)); floorC.classList.toggle('is-on', p.fc > 0.5);
      floorS.style.setProperty('--fo', p.fs.toFixed(3)); floorS.classList.toggle('is-on', p.fs > 0.5);
      stage.style.setProperty('--night', p.night.toFixed(3));
      stage.classList.toggle('is-night', p.night > 0.5);
    }

    /* The custody lap in floor coordinates: [time, x, y]. The held stretch at the gate is the
       point of the drawing, so it is a fifth of the lap, and the ball holds at the gate line (which
       is at 352, and the sign stands at its end). The credits path takes the detour through our
       server and back, which is the one case TRUST.md says the picture may not skip. */
    /* Narrow, the stations stand on the plane's center line, row 210, ninety rows up from the
       wide floor's row 300 (--cy in the stylesheet), and the gate and our server move with them. */
    function row() { return narrow ? 210 : 300; }
    function lapKey() { var y = row(), g = narrow ? 315 : 350; return [[0, 95, y], [0.22, 360, y], [0.42, 625, y], [0.6, 360, y], [0.64, 360, g], [0.8, 360, g], [1, 95, y]]; }
    function lapCredits() { var y = row(), g = narrow ? 315 : 350, o = otian(); return [[0, 95, y], [0.2, 360, y], [0.32, o[0], o[1]], [0.44, 625, y], [0.52, o[0], o[1]], [0.6, 360, y], [0.64, 360, g], [0.8, 360, g], [1, 95, y]]; }
    /* Where the stations stand, so the ball goes see-through while it is under one. Narrow, our
       server stands up and to the right of the computer (--gx and --gy in the stylesheet) and
       the gate is past the computer's footprint (--gm), and the lap follows both. */
    function otian() { return narrow ? [200, 95] : [360, 60]; }
    function stations() { var y = row(); return [[95, y], [360, y], [625, y], otian()]; }
    function lapPoint(path, t) {
      for (var i = 1; i < path.length; i++) {
        if (t <= path[i][0]) {
          var a = path[i - 1], b = path[i], u = (t - a[0]) / (b[0] - a[0] || 1);
          return [a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u];
        }
      }
      return [path[path.length - 1][1], path[path.length - 1][2]];
    }

    var cur = -1, markName = '';
    var ex = -999, ey = -999, es = 96, first = true;


    /* The setup gallery (narrow): each card's place is how far it stands from the current one,
       in cards. The current one is flat, full size and in front; a neighbor is 200 to the side,
       turned toward it, a little behind and below, smaller and dimmer; further cards keep the
       neighbor's turn and go on out and back. -1 hands the cards back to the stylesheet. */
    var GPROPS = ['--gx', '--gy', '--gz', '--gr', '--gs', '--dim'], galleryOn = false;
    function gallery(fs) {
      if (fs < 0) {
        if (!galleryOn) return;
        steps.forEach(function (s) { GPROPS.forEach(function (k) { s.style.removeProperty(k); }); });
        galleryOn = false; return;
      }
      galleryOn = true;
      steps.forEach(function (s, j) {
        var d = j - fs, a = Math.min(1, Math.abs(d)), far = Math.max(0, Math.abs(d) - 1), sg = d < 0 ? -1 : 1;
        s.style.setProperty('--gx', (d * 200).toFixed(1) + 'px');
        s.style.setProperty('--gy', (a * 24).toFixed(1) + 'px');
        s.style.setProperty('--gz', (-a * 90 - far * 40).toFixed(1) + 'px');
        s.style.setProperty('--gr', (-sg * a * 32).toFixed(1) + 'deg');
        s.style.setProperty('--gs', (1 - a * 0.14).toFixed(3));
        s.style.setProperty('--dim', Math.max(0.2, 1 - a * 0.45 - far * 0.15).toFixed(3));
      });
    }

    /* The setup build (wide): how much of each piece is drawn, as five numbers between 0 and 1.
       bp is the act's own run in pieces, so piece j draws while bp crosses j to j + 1 and exactly
       one stroke is moving at any point of the act. The shapes carry pathLength="1" (index.html),
       so nothing here has to measure a path: see .day-build in styles.css. -1 hands the drawing
       back to the stylesheet, which leaves it undrawn.

       DRAW is the front of a step that the stroke takes; the rest of the step is the finished
       piece standing still, which is when its card is read. A piece that drew across the whole
       step never stopped moving, and a drawing nobody is given a moment to look at is the same
       problem as a row of cards nobody is given a reason to scroll through. */
    var DRAW = 0.6;
    var buildEl = $('.day-build'), buildOn = false;
    function build(bp) {
      var j;
      if (!buildEl) return;
      if (bp < 0) {
        if (!buildOn) return;
        for (j = 0; j < 5; j++) buildEl.style.removeProperty('--d' + j);
        buildOn = false; return;
      }
      buildOn = true;
      for (j = 0; j < 5; j++) buildEl.style.setProperty('--d' + j, clamp((bp - j) / DRAW, 0, 1).toFixed(3));
    }

    /* The four-rows thread moves like a thread. A bubble that lands is kept out of the layout
       until its beat (styles.css, .dp-scr--grow), so the bubbles above it jump up by its height
       the moment it appears; this puts the screen back where it stood and lets it slide (the
       transition is the screen's own). Measured with offsetTop, which is in the screen's own
       pixels whatever the phone's zoom and pose do to them, so the slide is exactly the jump.
       With no bubble on before, the thread rises from the screen's bottom edge. */
    function firstOn(el) {
      for (var c = el.firstElementChild; c; c = c.nextElementSibling) if (c.classList.contains('is-on')) return c;
      return null;
    }
    function slideThread(wasTop) {
      var now = firstOn(grow);
      if (!now || still) return;
      var edge = grow.clientHeight - 20;
      var d = (wasTop < 0 ? edge : wasTop) - now.offsetTop;
      if (Math.abs(d) < 1) return;
      grow.style.transition = 'none';
      grow.style.transform = 'translateY(' + d.toFixed(1) + 'px)';
      void grow.offsetHeight;
      grow.style.transition = '';
      grow.style.transform = '';
    }

    function setAct(i) {
      if (i === cur) return;
      var prev = cur; cur = i;
      caps.forEach(function (c, j) { c.classList.toggle('is-on', j === i); });
      scrs.forEach(function (s) { s.classList.toggle('is-on', +s.getAttribute('data-scr') === ACTS[i].scr); });
      /* The message bar belongs to the conversation. A screen that is one of the app's own pages
         says so with data-page, and the phone drops the composer for it: Lately is a section of
         the Now page, which ends in a jump across to the chat instead of a box to type in. */
      if (ph) ph.classList.toggle('is-page', scrs.some(function (s) {
        return s.classList.contains('is-on') && s.hasAttribute('data-page');
      }));
      win.classList.toggle('is-night', i === 5);
      clock.classList.toggle('is-on', !!ACTS[i].clock);
      stage.classList.toggle('is-timed', !!ACTS[i].clock);
      if (ACTS[i].clock) clock.querySelector('span').textContent = ACTS[i].clock;
      if (phoneClock) phoneClock.textContent = ACTS[i].phone;
      if (prev >= 0 && !still) window.Ember.act(ember, 'hop');
      window.Ember.set(ember, ACTS[i].state);
    }

    function frame() {
      var r = story.getBoundingClientRect();
      var vh = window.innerHeight;
      var total = story.offsetHeight - vh;
      var p = still ? 0 : clamp(-r.top / (total || 1), 0, 1);
      var u = p * TOT, i = N - 1;
      for (var a = 0; a < N; a++) { if (u < CUM[a + 1]) { i = a; break; } }
      var t = clamp((u - CUM[i]) / LEN[i], 0, 1);
      if (still) { i = 0; t = 1; }
      setAct(i);
      if (hint) hint.classList.toggle('is-off', p > 0.02);

      var settle = i === 0 ? 1 : smooth(t / SETTLE);
      fit();
      var pose;
      if (still) pose = poseOf(0);
      else if (i === 0) pose = lerpPose(poseOf(0), poseOf(1), smooth(t) * PRE);
      else if (i === 1) pose = lerpPose(lerpPose(poseOf(0), poseOf(1), PRE), poseOf(1), settle);
      else pose = lerpPose(poseOf(i - 1), poseOf(i), settle);
      tilt.x += (tilt.tx - tilt.x) * 0.08; tilt.y += (tilt.ty - tilt.y) * 0.08;
      applyPose(pose);

      var tp = i === 0 ? t : clamp((t - SETTLE) / (1 - SETTLE), 0, 1);
      var was = grow && grow.classList.contains('is-on') ? firstOn(grow) : null, wasTop = was ? was.offsetTop : -1, landed = false;
      beats.forEach(function (b) {
        var on = b.act === i ? (tp >= b.at && tp < b.until) : (b.act < i && b.until > 1);
        if (b.el.classList.contains('is-on') === on) return;
        b.el.classList.toggle('is-on', on);
        if (b.el.parentNode === grow) landed = true;
      });
      if (landed && grow.classList.contains('is-on')) slideThread(wasTop);

      var mark = ACTS[i].mark;
      /* Narrow, the hero's Ember stands beside the phone, where the phone acts put it, rather
         than on the window's corner, which the phone covers there. */
      if (narrow && mark === 'm-hero') mark = 'm-phone';
      /* Two in the morning is the one act whose objects swap places narrow: the window fills the
         top and the phone shows only its masked top half under it, so Ember stands off the
         phone's lower left rather than on the window. Act 5 is the only user of m-window. */
      if (narrow && mark === 'm-window') mark = 'm-night';
      if (i === 3) {
        var credits = floorC.getAttribute('data-mode') === 'credits';
        var pt = lapPoint(credits ? lapCredits() : lapKey(), tp);
        dot.style.left = pt[0] + 'px'; dot.style.top = pt[1] + 'px';
        var under = stations().some(function (st) { return Math.abs(pt[0] - st[0]) < 40 && Math.abs(pt[1] - st[1]) < 30; });
        dot.classList.toggle('is-under', under);
        var held = tp >= 0.62 && tp < 0.8;
        dot.classList.toggle('is-held', held); gate.classList.toggle('is-on', held);
      }
      if (i === 7) {
        /* Five steps over the act, the last held. Narrow, the gallery slides between cards over
           the middle of each step (fs), so a card sits still for reading either side of the
           slide, and the current card is the one nearest the middle. Wide, the build is the
           clock: piece j draws while bp crosses j to j+1, so one stroke is moving at every
           point of the act, a card is up for exactly as long as the piece it captions takes to
           draw, and the sixth of the act left at the end holds the finished picture, which is
           the thing the whole act was drawing toward. */
        var f = Math.min(4, tp * 5.4), kf = Math.floor(f), fs = kf + smooth((f - kf - 0.3) / 0.4);
        var bp = Math.min(5, tp * 6);
        var k = narrow ? Math.round(fs) : Math.min(4, Math.floor(bp));
        mark = (narrow ? 'm-g' : 'm-s') + k;
        steps.forEach(function (s, j) {
          s.classList.toggle('is-lit', j <= k);
          s.classList.toggle('is-cur', j === k);
        });
        if (mins) mins.textContent = MINUTES[k];
        if (pie) pie.style.setProperty('--pie', tp.toFixed(3));
        gallery(narrow ? fs : -1);
        build(narrow ? -1 : bp);
      } else { gallery(-1); build(-1); }
      if (r.bottom < vh * 0.55) mark = 'm-cta';
      var m = marks[mark];
      if (m) {
        /* The box Ember is absolute in: the stage while the story plays, the mark's own box beside
           the closing button after it. Moving between them is a snap under a hop. */
        var box = mark === 'm-cta' && ctaBox ? ctaBox : stage;
        if (ember.parentNode !== box) { box.appendChild(ember); first = true; }
        var size = (narrow && +m.getAttribute('data-size-narrow')) || +m.getAttribute('data-size') || 96;
        if (box === stage) size *= SC;  /* the scene is scaled on small screens, so Ember is too */
        var mr = m.getBoundingClientRect(), br = box.getBoundingClientRect();
        var tx = mr.left - br.left + mr.width / 2 - size / 2;
        /* Never off the stage's sides: on a screen too narrow for the room beside the phone, Ember
           gives up its clearance rather than its edge. */
        if (box === stage) tx = clamp(tx, 4, br.width - size - 4);
        /* 0.85: the ground between Ember's feet is 85% of the way down the drawing's box (viewBox
           y 6 to 206, feet at 176), so this puts the feet on the mark rather than the box. */
        var ty = mr.top - br.top + mr.height / 2 - size * 0.85;
        if (mark !== markName) {
          if (markName && !still) window.Ember.act(ember, 'hop');
          markName = mark;
        }
        var k2 = (first || still) ? 1 : 0.16, wasX = ex;
        ex += (tx - ex) * k2; ey += (ty - ey) * k2; es += (size - es) * k2;
        first = false;
        ember.style.width = es.toFixed(1) + 'px'; ember.style.height = es.toFixed(1) + 'px';
        ember.style.transform = 'translate(' + ex.toFixed(1) + 'px,' + ey.toFixed(1) + 'px)';
        /* Ember leans into its own walk, not into the page's scroll: on a pinned stage the scroll
           lean read as a wobble on every wheel notch. */
        window.Ember.walk(ember, ex - wasX);
      }
      SENDS.forEach(function (sd) {
        if (!sd.el) return;
        if (i < sd.act || (i === sd.act && tp < sd.from)) unpress(sd.el, sd.key);
        else if (i > sd.act) press(sd.el, sd.key, 'now');
        /* Only the mail card waits. Its Send is a card button and the phone app holds it lit and
           busy until the computer answers; the composer's arrow posts a message, which posts at
           once.

           THE SCROLL IS THE CLOCK FOR ITS OWN PRESS (Jett, 2026-09-18). The busy beat ran on a
           900ms timer, so it resolved whether or not anybody scrolled: "i don't have to scroll
           for it to send". A reader moving at any speed spent that second watching a spinner and
           met the sent card with almost none of the act left, which read as the state appearing
           and going. `at` starts the spinner and `done` settles it, both in scroll, so the beat
           cannot be outrun and the sent card holds the rest of the act. A press by hand keeps a
           real clock, because somebody who presses and stops scrolling still has to see it
           land. */
        else if (tp >= sd.at) {
          press(sd.el, sd.key, sd.busy ? 'hold' : 'now');
          if (sd.busy && tp >= sd.done) answer(sd.el, sd.key);
        }
      });
      /* The calendar act's yes sits typed in the composer once the proposal has landed, until it
         is sent; scrolling back above the proposal untypes it. IT ARRIVES A CHARACTER AT A TIME,
         because the claim of this act is that approval is a message you type and not a button you
         press (Jett, 2026-09-17), and a sentence that appears whole is a paste. The caret holds
         steady while characters are still coming and blinks once the line is finished, the way a
         real one does. Under reduced motion nothing is sliced and the line stands complete. */
      if (ph && scr1) {
        var wantTyped = i === 1 && tp >= TYPED_AT && !scr1.classList.contains('is-pressed');
        ph.classList.toggle('is-typed', wantTyped);
        if (typedEl) {
          var tn = (wantTyped && !still) ? clamp((tp - TYPED_AT) / TYPED_FOR, 0, 1) : 1;
          var cut = Math.round(tn * TYPED.length);
          if (cut !== typedCut) { typedEl.textContent = TYPED.slice(0, cut); typedCut = cut; }
          /* Off the character count and not the scroll fraction, so the caret starts blinking the
             moment the last character lands rather than when the window runs out. */
          ph.classList.toggle('is-typing', cut < TYPED.length);
        }
      }
      /* Ember watches the phone while a scene plays on it, and the dot while it laps. */
      if (i === 1 || i === 2 || i === 4) { var pr = phone.getBoundingClientRect(); window.Ember.look(ember, { x: pr.left + pr.width / 2, y: pr.top + pr.height * 0.55 }); }
      else if (i === 3) { var dr = dot.getBoundingClientRect(); window.Ember.look(ember, { x: dr.left + 8, y: dr.top + 8 }); }
      else window.Ember.look(ember, null);
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);

    /* The two real buttons on the phone. The composer's send knob posts the typed yes, and only
       while it is typed; Send on the mail card stays lit and busy until the computer answers, the
       way the phone app holds a pressed card button (InlineActions in archie-mobile's ui.tsx, since
       its commit 8533dae of 2026-09-18; it lit for a 700ms beat and retired before that, and so did
       this), and then the card settles and the computer's answer arrives as a notice over the
       screen, which the stylesheet plays on is-noticed. Here the computer answers in a beat
       (BUSY_MS), because there is no computer, and the scroll answers at its own mark rather than
       on that timer, which is the note in the frame loop. Pressing again does nothing, because the
       thing it did is done. One path for both the reader's press and the scroll's, so the screen
       does the same thing whoever sent it; 'now' skips the wait and the notice, which is for
       arriving at a screen that should already be settled rather than watching it settle. */
    var busyT = { 1: 0, 2: 0 }, BUSY_MS = 900;
    /* The computer's answer: the card edits itself, and unless it was already settled when the
       reader got here, the notice says so. Named `answer` and not `settle` because the frame loop
       carries a `settle` of its own, the eased fraction a pose is moved by, and a function shadowed
       by a number throws on the frame it is first called. `quiet` is that case, and it is also reduced motion,
       where the card stands finished and a toast would be feedback on a press nobody made. */
    function answer(scr, key, quiet) {
      if (!scr || scr.classList.contains('is-done')) return;
      if (busyT[key]) { clearTimeout(busyT[key]); busyT[key] = 0; }
      scr.classList.add('is-done');
      if (!quiet && !still) scr.classList.add('is-noticed');
    }
    /* `how` is what runs the wait: 'now' settles on the spot, 'clock' waits BUSY_MS because a
       hand pressed it, and 'hold' stays busy until the scroll reaches the card's `done`. */
    function press(scr, key, how) {
      if (!scr || scr.classList.contains('is-pressed')) return;
      scr.classList.add('is-pressed');
      if (how === 'now' || still) answer(scr, key, true);
      else if (how === 'clock') busyT[key] = setTimeout(function () { answer(scr, key); }, BUSY_MS);
      if (!still) window.Ember.act(ember, 'hop');
    }
    function unpress(scr, key) {
      if (!scr) return;
      if (busyT[key]) { clearTimeout(busyT[key]); busyT[key] = 0; }
      scr.classList.remove('is-pressed', 'is-done', 'is-noticed');
    }
    $$('[data-press]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var kind = btn.getAttribute('data-press');
        var scr = kind === 'confirm' ? scr1 : btn.closest('.dp-scr');
        if (kind === 'confirm' && !(ph && ph.classList.contains('is-typed'))) return;
        press(scr, kind === 'confirm' ? 1 : 2, kind === 'confirm' ? 'now' : 'clock');
      });
    });
    /* The own-key / starter-credits control on the custody act. */
    $$('.day-seg button[data-mode]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var mode = btn.getAttribute('data-mode');
        $$('.day-seg button[data-mode]').forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
        floorC.setAttribute('data-mode', mode);
        caps[3].classList.toggle('mode-credits', mode === 'credits');
      });
    });
  })();

})();
