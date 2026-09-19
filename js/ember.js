/* Ember, the Archie character, on the website.
 *
 * A port of `src/app/ember-gen.ts` and `src/app/ember-rig.ts` from the Archie repo, in plain
 * browser JS with no build step, because this site has none. The geometry is copied rather than
 * shared: two repos, no package between them, and a mascot that drifts by a few pixels between
 * the app and the site is a smaller problem than a build pipeline nobody asked for. If Ember's
 * body changes over there, change it here too. The four axes (color, hat, eyes, extras) and the
 * option ids are the same on both sides on purpose, so a look reads the same in either place.
 *
 * Usage, anywhere on any page:
 *
 *   <span data-ember></span>                        a terracotta Ember, watching the pointer
 *   <span data-ember="teal.antenna.round.glasses"></span>   one exact look
 *   <span data-ember-seed="hello"></span>           a look dealt from that word, stable forever
 *   <span data-ember data-ember-state="sleep"></span>       asleep rather than idle
 *   <span data-ember data-ember-play="oops"></span>         winces once on arrival, then settles
 *   <span data-ember data-ember-nudge></span>                 invites the reader to press, once
 *
 * Size comes from CSS (set a width and height on the element). One requestAnimationFrame loop
 * drives every Ember on the page and stops itself when there are none.
 */
(function () {
  "use strict";

  var HUES = {
    terracotta: { light: "#F0AB80", mid: "#E28D5E", dark: "#C36A3D", wash: "#FBE4D3" },
    plum: { light: "#B48CD9", mid: "#996FBE", dark: "#7B549E", wash: "#F2ECF6" },
    teal: { light: "#63B2A9", mid: "#3E9A92", dark: "#2E7C75", wash: "#E6F2F1" },
    green: { light: "#85B472", mid: "#679B55", dark: "#507E41", wash: "#EAF1E7" },
    gold: { light: "#D3A855", mid: "#BB8C33", dark: "#9A7226", wash: "#F5EFE2" },
    blue: { light: "#7DA3DC", mid: "#5988CB", dark: "#436FAE", wash: "#E9F0F8" },
    iris: { light: "#9B87D9", mid: "#7A63C8", dark: "#6150A8", wash: "#EEEBF8" }
  };
  var HUE_IDS = ["terracotta", "plum", "teal", "green", "gold", "blue", "iris"];

  var TOPPERS = {
    peak: function (d) {
      return '<path d="M100 30 L87 58 L113 58 Z" fill="' + d + '" stroke="' + d +
        '" stroke-width="8" stroke-linejoin="round"/>';
    },
    none: function () { return ""; },
    antenna: function (d) {
      return '<path d="M100 52 Q98 36 104 28" stroke="' + d +
        '" stroke-width="6" fill="none" stroke-linecap="round"/>' +
        '<circle cx="105" cy="24" r="8" fill="' + d + '"/>';
    },
    ears: function (d) {
      return '<circle cx="66" cy="58" r="14" fill="' + d + '"/>' +
        '<circle cx="134" cy="58" r="14" fill="' + d + '"/>';
    },
    tuft: function (d) {
      return '<path d="M100 56 Q92 34 104 22 Q100 38 112 44 Q104 46 100 56 Z" fill="' + d + '"/>';
    },
    cap: function (d, m) {
      return '<path d="M56 74 A46 46 0 0 1 144 74 Z" fill="' + d + '"/>' +
        '<rect x="52" y="70" width="96" height="11" rx="5.5" fill="' + m + '"/>';
    }
  };
  var TOPPER_IDS = ["peak", "none", "antenna", "ears", "tuft", "cap"];

  var EYES = {
    pill: {
      shape: '<rect class="pill" x="-7" y="-14" width="14" height="28" rx="7" fill="#2A2521"/>',
      glint: '<circle class="glint" cx="-2.5" cy="-7" r="2.5" fill="#FFFFFF" opacity=".85"/>'
    },
    round: {
      shape: '<circle class="pill" cx="0" cy="0" r="10" fill="#2A2521"/>',
      glint: '<circle class="glint" cx="-3" cy="-3.5" r="3" fill="#FFFFFF" opacity=".85"/>'
    },
    wide: {
      shape: '<circle class="pill" cx="0" cy="0" r="13" fill="#2A2521"/>',
      glint: '<circle class="glint" cx="-4" cy="-4.5" r="4.2" fill="#FFFFFF" opacity=".9"/>'
    },
    bead: {
      shape: '<circle class="pill" cx="0" cy="0" r="6" fill="#2A2521"/>',
      glint: '<circle class="glint" cx="-1.8" cy="-2" r="1.8" fill="#FFFFFF" opacity=".8"/>'
    },
    sleepy: {
      shape: '<rect class="pill" x="-8" y="-6" width="16" height="12" rx="6" fill="#2A2521"/>',
      glint: '<circle class="glint" cx="-2.5" cy="-2" r="2" fill="#FFFFFF" opacity=".8"/>'
    }
  };
  var EYE_IDS = ["pill", "round", "wide", "bead", "sleepy"];

  var EXTRAS = {
    none: function () { return ""; },
    glasses: function () {
      return '<g fill="none" stroke="#2A2521" stroke-width="3.4" opacity=".85">' +
        '<circle cx="78" cy="103" r="17"/><circle cx="122" cy="103" r="17"/>' +
        '<path d="M95 103h10" stroke-linecap="round"/></g>';
    },
    freckles: function (d) {
      return '<g fill="' + d + '" opacity=".55">' +
        '<circle cx="60" cy="118" r="2.6"/><circle cx="68" cy="126" r="2.6"/>' +
        '<circle cx="56" cy="130" r="2.6"/><circle cx="140" cy="118" r="2.6"/>' +
        '<circle cx="132" cy="126" r="2.6"/><circle cx="144" cy="130" r="2.6"/></g>';
    },
    /* Cream, not the body's own dark: as `hue.dark` it read as a shadow across the body rather
       than as something worn. The hairline keeps the cream from floating on a pale hue. */
    scarf: function (d) {
      return '<g stroke="' + d + '" stroke-width="2.2" stroke-linejoin="round">' +
        '<path d="M62 150 Q100 168 138 150 L138 158 Q100 176 62 158 Z" fill="#FBF1E4"/>' +
        '<path d="M128 156 l10 22 q-7 3 -13 1 l-6 -19 Z" fill="#F2E2CE"/></g>';
    }
  };
  var EXTRA_IDS = ["none", "glasses", "freckles", "scarf"];
  /* Where each extra is worn, which only matters once they can turn around. Glasses and freckles
     are on their face and go wherever their face goes. A scarf is a band around them: it is there
     from every side, so a turn leaves it alone and only a flip moves it, the same way it moves
     their feet. Anything added here belongs in one of the two. */
  var EXTRAS_ON_BODY = { scarf: true };

  var uidCounter = 0;

  function lookFromKey(key) {
    var parts = String(key || "").split(".");
    return {
      hue: HUES[parts[0]] ? parts[0] : "terracotta",
      topper: TOPPERS[parts[1]] ? parts[1] : "peak",
      eyes: EYES[parts[2]] ? parts[2] : "pill",
      extra: EXTRAS[parts[3]] ? parts[3] : "none"
    };
  }

  /* The same four independent hashes the app uses, so a seed deals the same face on both sides. */
  function lookFor(seed) {
    seed = String(seed);
    function hash(start, mult) {
      var h = start;
      for (var i = 0; i < seed.length; i++) h = (Math.imul(h, mult) + seed.charCodeAt(i)) >>> 0;
      return h;
    }
    return {
      hue: HUE_IDS[hash(7, 31) % HUE_IDS.length],
      topper: TOPPER_IDS[hash(1237, 131) % TOPPER_IDS.length],
      eyes: EYE_IDS[hash(9109, 217) % EYE_IDS.length],
      extra: EXTRA_IDS[hash(48611, 401) % EXTRA_IDS.length]
    };
  }

  function eye(x, y, eyes) {
    return '<g class="eye" data-x="' + x + '" data-y="' + y +
      '" style="transform:translate(' + x + 'px,' + y + 'px)">' +
      '<g class="eye-open">' + eyes.shape + eyes.glint + "</g>" +
      '<path class="happy" d="M-9 3 Q0 -9 9 3" stroke="#2A2521" stroke-width="5.5" fill="none" ' +
      'stroke-linecap="round" opacity="0"/></g>';
  }

  function svgFor(look) {
    var hue = HUES[look.hue] || HUES.terracotta;
    var uid = "e" + (uidCounter += 1);
    var eyes = EYES[look.eyes] || EYES.pill;
    /* The viewBox starts at y=6, not y=0: that is the whole of Ember's framing, and it is a window
       offset rather than moved coordinates so every part above stays positioned against the body.
       `.ember`'s transform-origin in styles.css is measured from this corner, so the two move
       together (this y plus that origin's 170 is 176, the ground between their feet). */
    return '<svg viewBox="0 6 200 200" aria-hidden="true" focusable="false">' +
      '<defs><linearGradient id="ember-' + uid + '" x1="0" y1="0.18" x2="0" y2="1">' +
      '<stop offset="0" stop-color="' + hue.light + '"/>' +
      '<stop offset="0.55" stop-color="' + hue.mid + '"/>' +
      '<stop offset="1" stop-color="' + hue.dark + '"/></linearGradient>' +
      /* The lip, as a clip. The tongue swings about where it leaves the mouth, and a shape
         rotating about its own top edge lifts its far corner above that edge: 22 degrees puts
         about two units of it over the lip, which at the sizes Ember is drawn is a pink nub on
         the face. Clipping to everything below the lip line takes it, and the clip sits on a
         group that does not turn, because a clip path on the turning group turns with it and
         clips nothing. These are plain drawing coordinates, not the view-box-corner ones the
         transform origins in styles.css use. */
      '<clipPath id="lip-' + uid + '"><rect x="86" y="134" width="28" height="34"/></clipPath>' +
      '</defs>' +
      '<ellipse cx="100" cy="177" rx="37" ry="6" fill="rgba(68,64,59,.12)"/>' +
      '<g class="anim"><g class="lean">' +
      /* FOUR PARTS, AND THE REASON THERE ARE FOUR.
         EMBER IS A BALL, AND A BALL LOOKS THE SAME FROM EVERY SIDE, so the only parts that
         know which way Ember is facing are the feet, the hat and the face. Grouped separately,
         each one can be moved the way a point at its own place on a sphere actually moves when
         the sphere turns, which is what makes a spin read as a turn rather than as a drawing
         being flipped over. The maths and the numbers are in styles.css beside the keyframes.
         The ball itself is in none of the groups, because a sphere turning is a sphere. */
      '<g class="feet">' +
      '<ellipse cx="82" cy="169" rx="10" ry="7.5" fill="' + hue.dark + '"/>' +
      '<ellipse cx="118" cy="169" rx="10" ry="7.5" fill="' + hue.dark + '"/>' +
      '</g>' +
      '<g class="top">' + (TOPPERS[look.topper] || TOPPERS.peak)(hue.dark, hue.mid) + '</g>' +
      '<circle cx="100" cy="108" r="60" fill="url(#ember-' + uid + ')"/>' +
      '<g class="face">' +
      /* The face sits two units lower in the body than the app's ember-gen.ts draws it (eyes
         105 not 103, blush 127, mouth 134): a pixel at the sizes the site shows them, asked for
         on 2026-09-11 because they read as looking up out of their own circle. If the app takes
         the same nudge, this note goes. */
      '<ellipse cx="65" cy="127" rx="8.5" ry="5" fill="' + hue.dark + '" opacity=".38"/>' +
      '<ellipse cx="135" cy="127" rx="8.5" ry="5" fill="' + hue.dark + '" opacity=".38"/>' +
      eye(78, 105, eyes) + eye(122, 105, eyes) +
      '<path class="mouth mouth-smile" d="M93 134 Q100 140 107 134" stroke="#2A2521" ' +
      'stroke-width="3.2" fill="none" stroke-linecap="round"/>' +
      '<path class="mouth mouth-flat" d="M93 136 L107 136" stroke="#2A2521" stroke-width="3.2" ' +
      'fill="none" stroke-linecap="round" opacity="0"/>' +
      /* The tongue, for the one move in a hundred: a jaw dropped open and a tongue hanging out
         of it, drawn together and switched on as a pair. The jaw is filled rather than stroked,
         for the reason the app's snoring mouth is: at the sizes Ember is shown a stroked ring
         fills in with antialiasing and reads as a smudge. It is narrower than the smile (11.2
         against 14), so the open mouth never grows wider than the closed one. `opacity="0"` is
         on the markup rather than left to CSS, because the app rasterizes this same string into
         saved pictures with no stylesheet near it and the two drawings stay the same drawing. */
      '<g class="mouth mouth-blep" opacity="0">' +
      '<path d="M93.8 134 A6.2 6.2 0 0 0 106.2 134 Z" fill="#2A2521"/>' +
      '<g clip-path="url(#lip-' + uid + ')"><g class="tongue">' +
      '<path d="M95 136 L105 136 L105 145 Q105 150.5 100 150.5 Q95 150.5 95 145 Z" ' +
      'fill="#DE8A86" stroke="#2A2521" stroke-width="2" stroke-linejoin="round"/>' +
      '</g></g>' +
      '</g>' +
      (EXTRAS_ON_BODY[look.extra] ? "" : (EXTRAS[look.extra] || EXTRAS.none)(hue.dark)) +
      '</g>' +
      (EXTRAS_ON_BODY[look.extra]
        ? '<g class="wrap">' + EXTRAS[look.extra](hue.dark) + "</g>"
        : "") +
      "</g></g></svg>";
  }

  /* ---- the rig ------------------------------------------------------------------------------ */

  var rigs = [];
  var pointer = { x: 0, y: 0, moved: 0 };
  /* Somewhere more interesting than the pointer, for as long as `until` says. Set when the reader
     hovers a button: Ember looks at what they are about to press, which is the cheapest possible
     way to make a static page feel like it noticed you. */
  var attend = { x: 0, y: 0, until: 0 };
  var scrollVel = 0;
  var lastScrollY = 0;
  var raf = 0;
  var last = 0;
  var REDUCED = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var STATE_CLASS = { idle: "", working: "st-working", done: "st-done", oops: "st-oops", sleep: "st-sleep" };

  /* How often they do something unprompted, and how soon after arriving in view. The idle
     gap was 14 to 30 seconds until 2026-09-15, which is long enough that a reader who scrolls
     to them, watches, and scrolls on never sees them move at all. Jett asked for "every 10-ish
     seconds": 8 to 13 averages a shade under 11, and the spread is what keeps two Embers on
     one page from falling into step. ARRIVE_MS is the hero's own entrance, unchanged, so their
     landing and the section's do not fight. */
  var IDLE_MIN = 8000;
  var IDLE_SPREAD = 5000;
  var ARRIVE_MS = 520;
  /* Scrolling them a pixel off the edge and back is not an arrival. */
  var ARRIVE_COOLDOWN = 5000;

  /* What they might do when pressed. Random rather than a cycle, because a cycle is learnable in
     three clicks and then it is a list rather than a reaction; and never the same one twice
     running, because a genuine random repeat reads as the click not having registered. Durations
     match the keyframes in styles.css, so the class comes off as the animation ends.

     `sparks` is per act, and it is zero for four of the five. Throwing them on every reaction is
     what the first version did, and it made the sparks the reaction: the same burst after a nod as
     after a leap says the page has one exclamation mark and uses it for everything. Only the hop
     leaves the ground hard enough to shake something loose, so only the hop does, and a spark
     becomes the rare one in five rather than the thing you stop noticing. */
  var ACTS = [
    { cls: "st-act-hop", ms: 900, sparks: 4 },
    { cls: "st-act-wiggle", ms: 700, sparks: 0 },
    { cls: "st-act-spin", ms: 950, sparks: 0 },
    { cls: "st-act-squish", ms: 600, sparks: 0 },
    { cls: "st-act-nod", ms: 750, sparks: 0 },
    { cls: "st-act-shimmy", ms: 900, sparks: 0 },
    { cls: "st-act-groove", ms: 1100, sparks: 0 },
    { cls: "st-act-peek", ms: 1600, sparks: 0, big: true },
    { cls: "st-act-backflip", ms: 1250, sparks: 6, big: true },
    { cls: "st-act-blep", ms: 1300, sparks: 0, rare: true }
  ];

  /* THE ONE IN A HUNDRED.

     Tongue out, head going side to side, and then back to normal as though nothing happened.
     `rare` keeps it out of both pools below, so the picker never lands on it: it arrives only
     when the roll says so, whether the idle clock or a press did the asking. One percent is the
     whole point of it. Most readers never see it, nobody can make it happen on purpose, and the
     one who does see it saw something rather than found a feature. Raise this number and it
     stops being that; it becomes the move Ember does, and it is not a move Ember should be
     doing at the reader on any page that is asking them to trust us. */
  var RARE_CHANCE = 0.01;

  /* THE TWO EMBER SAVES FOR YOU.

     Every act above can fire unprompted, every eight to thirteen seconds, to a reader who did
     nothing. That is fine for a wiggle. It is not fine for the two marked `big`: the backflip is
     the largest thing they do, and the peek ends with them looking back over their shoulder at
     whoever is watching, which is an answer to somebody rather than a thing to do while alone.
     Spent on nobody they become scenery, and the press that earns them stops being worth making.

     So the idle clock draws from the small ones and a press draws from all of them. The reward
     for pressing them is a move you cannot get by waiting, which is the whole point of the
     invitation on /archie/personal/ being there at all. */
  function pickAct(rig, allowBig) {
    /* Rolled first and separately, so a rare act's odds are its own rather than one share of
       however many acts the table happens to hold today. */
    for (var r = 0; r < ACTS.length; r++) {
      if (!ACTS[r].rare) continue;
      if (ACTS[r].cls !== rig.lastAct && Math.random() < RARE_CHANCE) return ACTS[r];
    }
    var pool = [];
    for (var i = 0; i < ACTS.length; i++) {
      if (ACTS[i].rare) continue;
      if (!allowBig && ACTS[i].big) continue;
      /* Never the same one twice running: a genuine random repeat reads as the press not
         having registered. */
      if (ACTS[i].cls === rig.lastAct) continue;
      pool.push(ACTS[i]);
    }
    if (!pool.length) return null;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  /* THE INVITATION.

     Ember reacts to a press and almost nobody finds out, because nothing on the page says so.
     Ember blinks, follows the pointer, and does something unprompted every ten seconds or so,
     and all of that reads as a nicely drawn picture until the reader presses and gets an answer
     back. So where Ember is the subject of a section rather than a face on something, a small
     label says what to do.

     Three rules it follows, each one a way this could have gone wrong:

       It goes away and stays away. One press and the label is gone for good, remembered in this
       browser, because a reader who has already found out is being told something they know.
       Nagging a returning visitor with an instruction they have followed is the cheapest kind of
       noise there is.

       It never appears under reduced motion. actOnce() is silent there, so the press does
       nothing, and an invitation the page will not answer is worse than no invitation.

       It arrives after they do. Shown a beat past their own entrance, so the order reads as a
       character turning up and then being introduced, rather than a tooltip landing on a picture.

     It also makes them a real control where it appears: a press is an interaction, so it takes a
     name and a tab stop and answers the space bar. Only the invited ones, though. The Embers
     inside figures are aria-hidden decoration, and turning every drawing on a page into a tab
     stop would charge the keyboard reader for a mascot. */
  var NUDGE_KEY = "otian_ember_greeted";
  var NUDGE_DELAY = 1500;

  /** What Ember says, which is one sentence and not the page's to write.
   *
   *  It was the page's, on the reasoning that words belong with the copy around them. Two things
   *  changed that. The sentence has to know what the reader is holding, which is a runtime fact
   *  no static page can carry; and it is the same sentence everywhere Ember offers it, in the app
   *  as much as here, because it is a character's greeting rather than a page's label. A page can
   *  still put its own words in the attribute if it ever has a reason to.
   *
   *  Tap or click, from what the device actually has. `hover: none` and `pointer: coarse`
   *  together are a device with no mouse at all; a laptop with a touchscreen answers hover and
   *  gets "click", which is right, because it has both and one of them is what the word means. */
  function invitation() {
    var touch = window.matchMedia &&
      window.matchMedia("(hover: none) and (pointer: coarse)").matches;
    return touch ? "Hi! Tap me" : "Hi! Click me";
  }

  function greetedBefore() {
    try { return localStorage.getItem(NUDGE_KEY) === "1"; } catch (e) { return false; }
  }
  function rememberGreeting() {
    try { localStorage.setItem(NUDGE_KEY, "1"); } catch (e) { /* private window: it asks again */ }
  }

  /* The app's own celebration palette, so a spark off Ember here is the same color as a spark off
     Ember in the app. Red is absent on purpose: it means "something is wrong" everywhere else. */
  var SPARK_COLORS = ["#E08A5B", "#679B55", "#BB8C33", "#996FBE", "#3E9A92"];

  /* Little things flying off them. Appended to the host and removed when they land, so nothing
     accumulates on a page somebody leaves open. Skipped entirely under reduced motion. */
  function sparks(host, count) {
    if (REDUCED || !count) return;
    for (var i = 0; i < count; i++) {
      var s = document.createElement("span");
      s.className = "ember-spark";
      s.style.background = SPARK_COLORS[i % SPARK_COLORS.length];
      var angle = (i / count) * Math.PI * 2 + Math.random() * 0.6;
      var dist = 34 + Math.random() * 30;
      s.style.setProperty("--dx", (Math.cos(angle) * dist).toFixed(0) + "px");
      s.style.setProperty("--dy", (Math.sin(angle) * dist - 16).toFixed(0) + "px");
      s.style.setProperty("--rr", ((Math.random() * 2 - 1) * 220).toFixed(0) + "deg");
      s.style.animationDelay = (i * 18) + "ms";
      host.appendChild(s);
      (function (el) { setTimeout(function () { el.remove(); }, 900 + i * 18); })(s);
    }
  }

  function runAct(rig, act) {
    rig.acting = true;
    rig.lastActAt = performance.now();
    rig.svg.classList.add(act.cls);
    sparks(rig.host, act.sparks);
    setTimeout(function () {
      rig.svg.classList.remove(act.cls);
      rig.acting = false;
    }, act.ms);
  }

  function actOnce(rig, allowBig) {
    if (REDUCED || rig.acting || rig.state !== "idle") return;
    var act = pickAct(rig, allowBig);
    if (!act) return;
    rig.lastAct = act.cls;
    runAct(rig, act);
  }

  /* One press, wherever it came from. The act is the answer to it; clearing the labels is the
     answer to having been told. Every Ember on the page loses its label, not just this one:
     having found out that they move is a thing you now know about them, not about one drawing. */
  function press(rig) {
    actOnce(rig, true);
    if (!rig.nudged) return;
    rememberGreeting();
    for (var i = 0; i < rigs.length; i++) clearNudge(rigs[i]);
  }

  function clearNudge(rig) {
    if (!rig.nudge) return;
    rig.nudge.remove();
    rig.nudge = null;
    rig.nudgeAt = 0;
  }

  /* A named act on one Ember, for a page that has a moment to mark: the living-agent figure
     has them hop when the message is let through the gate. Same table as the click, so a hop
     asked for here is the same hop, sparks and all. Silent under reduced motion and while they are
     already doing something, like the click is. */
  function actNamed(host, name) {
    if (REDUCED) return;
    for (var i = 0; i < rigs.length; i++) {
      var rig = rigs[i];
      if (rig.host !== host || rig.acting || rig.state !== "idle") continue;
      for (var j = 0; j < ACTS.length; j++) {
        if (ACTS[j].cls === "st-act-" + name) { rig.lastAct = ACTS[j].cls; runAct(rig, ACTS[j]); return; }
      }
    }
  }

  function onMove(e) {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    pointer.moved = performance.now();
  }

  /* How fast the page is moving, so Ember can lean into a scroll and settle out of it. Read in
     the loop rather than acted on here, so a fast flick is one number rather than a burst of work.
     */
  function onScroll() {
    var y = window.scrollY || window.pageYOffset || 0;
    scrollVel = y - lastScrollY;
    lastScrollY = y;
  }

  /* Anything the reader could press. Hovering one turns every Ember on the page toward it. */
  function onOver(e) {
    var el = e.target && e.target.closest && e.target.closest("a, button, .btn, .radio-option, summary");
    if (!el) return;
    var r = el.getBoundingClientRect();
    attend.x = r.left + r.width / 2;
    attend.y = r.top + r.height / 2;
    attend.until = performance.now() + 1400;
  }

  function start() {
    if (raf) return;
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    lastScrollY = window.scrollY || window.pageYOffset || 0;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  }

  function frame(now) {
    var dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    scrollVel *= Math.exp(-dt * 6);
    for (var i = 0; i < rigs.length; i++) update(rigs[i], now, dt);
    if (rigs.length) {
      raf = requestAnimationFrame(frame);
    } else {
      raf = 0;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("scroll", onScroll);
    }
  }

  function setState(rig, state) {
    for (var k in STATE_CLASS) {
      if (STATE_CLASS[k]) rig.svg.classList.remove(STATE_CLASS[k]);
    }
    if (STATE_CLASS[state]) rig.svg.classList.add(STATE_CLASS[state]);
    rig.state = state;
  }

  function update(rig, now, dt) {
    if (now - rig.rectAt > 400) {
      rig.rect = rig.svg.getBoundingClientRect();
      rig.rectAt = now;
    }
    var r = rig.rect;
    /* A hidden variant (the mobile drawing at desktop width, and the reverse) measures zero
       wide, so it counts as off-screen and never acts into a display:none box. */
    var onScreen = !!(r && r.width && r.bottom >= -60 && r.top <= window.innerHeight + 60);
    if (!onScreen) {
      rig.visible = false;
      return;
    }
    /* Arriving in view is the moment worth reacting to, and it is the one the old code threw
       away: the flourish clock ran while they were off-screen, so by the time a reader reached them
       it was already overdue, the `seen` guard swallowed that one firing, and they then stood
       still for another 14 to 30 seconds. Now the arrival schedules the act itself. */
    if (!rig.visible) {
      rig.visible = true;
      if (now - rig.lastActAt > ARRIVE_COOLDOWN) rig.flourish = now + ARRIVE_MS;
      /* Clocked from being seen rather than from mount, for the same reason the arrival is:
         an invitation that fades in above the fold while the reader is 1,400 lines down has
         invited nobody. */
      if (rig.nudge && !rig.nudgeAt) rig.nudgeAt = now + NUDGE_DELAY;
    }
    if (rig.nudgeAt && now > rig.nudgeAt) {
      rig.nudge.classList.add("is-on");
      rig.nudgeAt = 0;
    }
    var cx = r.left + r.width / 2;
    var cy = r.top + r.height / 2;

    if (rig.blinkT >= 0) {
      rig.blinkT += dt * 1000;
      if (rig.blinkT >= 150) rig.blinkT = -1;
    }
    if (rig.blinkT < 0 && now >= rig.nextBlink && rig.state !== "sleep") {
      rig.blinkT = 0;
      rig.nextBlink = now + (Math.random() < 0.12 ? 350 : 2200 + Math.random() * 4800);
    }
    var blink = 1;
    if (rig.blinkT >= 0) {
      var p = rig.blinkT / 150;
      blink = p < 0.5 ? 1 - p * 2 : (p - 0.5) * 2;
    }

    var tx, ty;
    if (rig.look) {
      /* A page can point them at something: the homepage has them watch the phone while a
         scene plays on it, and the dot while it laps. Cleared with look(host, null). */
      tx = rig.look.x; ty = rig.look.y;
    } else if (rig.state === "sleep") {
      tx = cx; ty = cy + 60;
    } else if (now < attend.until) {
      tx = attend.x; ty = attend.y;
    } else if (!pointer.moved || now - pointer.moved > 4000) {
      if (now > rig.wander.next) {
        rig.wander.next = now + 1400 + Math.random() * 1800;
        if (Math.random() < 0.3) { rig.wander.x = 0; rig.wander.y = 0; }
        else {
          rig.wander.x = (Math.random() * 2 - 1) * 260;
          rig.wander.y = (Math.random() * 2 - 1) * 140;
        }
      }
      tx = cx + rig.wander.x; ty = cy + rig.wander.y;
    } else {
      tx = pointer.x; ty = pointer.y;
    }

    var dx = tx - cx, dy = ty - cy;
    var len = Math.sqrt(dx * dx + dy * dy) || 1;
    var reach = Math.min(1, len / 240);
    var shift = 6 * reach;
    var k = 1 - Math.exp(-dt * 10);
    rig.gx += ((dx / len) * shift - rig.gx) * k;
    rig.gy += ((dy / len) * shift - rig.gy) * k;

    var lidTarget = rig.state === "sleep" ? 0.08 : rig.state === "oops" ? 1.18 : 1;
    rig.lid += (lidTarget - rig.lid) * (1 - Math.exp(-dt * 14));
    var open = Math.max(0.06, rig.lid * blink);

    /* The lean is the gaze plus the page's own movement, so a scroll tips them and settles them
       rather than leaving them rigid while everything around them travels. Capped, or a trackpad
       flick spins them. */
    /* A page that walks them (the homepage stage) hands over their own movement instead, because
       on a stage pinned to the screen the scroll lean read as a wobble on every wheel notch. */
    var sway = rig.walk != null ? rig.walk * 0.9 : scrollVel * 0.22;
    var tilt = (dx / len) * reach * 3 + Math.max(-7, Math.min(7, sway));
    if (rig.lean) rig.lean.style.transform = "rotate(" + tilt.toFixed(2) + "deg)";

    /* Every so often, unprompted, they do something. Only while idle and only when the reader can
       see them, so nothing plays to an empty screen or interrupts a state that means something. */
    if (!REDUCED && rig.state === "idle" && now > rig.flourish) {
      rig.flourish = now + IDLE_MIN + Math.random() * IDLE_SPREAD;
      actOnce(rig, false);
    }
    for (var i = 0; i < rig.eyes.length; i++) {
      var e = rig.eyes[i];
      e.g.style.transform = "translate(" + (e.bx + rig.gx) + "px," + (e.by + rig.gy) + "px)";
      e.open.style.transform = "scaleY(" + open.toFixed(3) + ")";
    }
  }

  function mount(host, opts) {
    opts = opts || {};
    var look = opts.look ||
      (opts.seed != null ? lookFor(opts.seed) : lookFromKey(opts.key));
    host.innerHTML = svgFor(look);
    host.classList.add("ember");
    var svg = host.querySelector("svg");
    var eyeEls = svg.querySelectorAll(".eye");
    var rig = {
      svg: svg,
      host: host,
      lean: svg.querySelector(".lean"),
      eyes: [],
      state: "idle",
      gx: 0, gy: 0, lid: 1, blinkT: -1,
      nextBlink: performance.now() + 1200 + Math.random() * 3200,
      wander: { x: 0, y: 0, next: 0 },
      flourish: performance.now() + IDLE_MIN + Math.random() * IDLE_SPREAD,
      visible: false,
      lastActAt: -1e9,
      acting: false,
      lastAct: "",
      nudge: null, nudgeAt: 0, nudged: false,
      rect: null, rectAt: -1e9,
      look: null,
      walk: null
    };
    for (var i = 0; i < eyeEls.length; i++) {
      rig.eyes.push({
        g: eyeEls[i],
        open: eyeEls[i].querySelector(".eye-open"),
        bx: parseFloat(eyeEls[i].getAttribute("data-x")),
        by: parseFloat(eyeEls[i].getAttribute("data-y"))
      });
    }
    rigs.push(rig);
    /* `play` is a state that runs once and settles; `state` is one that stays on. The 404 wants
       the first (a wince, then a face looking at you) and would otherwise need an inline script,
       which this site's CSP hashes one by one. A data attribute costs nothing and no hash. */
    if (opts.play) {
      setState(rig, opts.play);
      setTimeout(function () { setState(rig, "idle"); }, 1700);
    } else {
      setState(rig, opts.state || "idle");
      /* Arriving. A character who is simply present when the page paints reads as an image of a
         character; one who lands reads as having turned up. This used to be a timer set at mount,
         which meant an Ember below the fold did their one entrance 520ms in, to nobody, and was
         inert by the time anyone scrolled down. The arrival is handled in update() now, off
         actually being on screen, so it works the same whether they are in the hero or 1,400 lines
         down the homepage. */
    }
    start();

    /* Clicking them is the one interaction people try, so it answers, and answers differently
       each time. Hovering is answered by the squirm in styles.css, which needs a class rather than
       `:hover` so it can be kept off under reduced motion in one place.

       No sparks on hover, and there were: a burst every 420ms for as long as the pointer sat on
       them, which on a page you read with the cursor parked anywhere near them is a permanent
       fountain. Being tickled shows in the face and the body, which is where a person would
       look for it; the sparks were the page shouting over both of them. */
    host.addEventListener("click", function () { press(rig); });
    host.addEventListener("pointerenter", function () { host.classList.add("is-hovered"); });
    host.addEventListener("pointerleave", function () { host.classList.remove("is-hovered"); });
    if (opts.nudge != null) addNudge(rig, opts.nudge);
    return {
      element: host,
      set: function (state) { setState(rig, state); },
      play: function (state, ms) {
        setState(rig, state);
        setTimeout(function () { setState(rig, "idle"); }, ms || 1700);
      }
    };
  }

  /* The bubble, and the control it turns Ember into. The words are Ember's own (see
     `invitation`); a page passes its own only if it has a reason to. */
  function addNudge(rig, text) {
    text = text || invitation();
    if (REDUCED || greetedBefore()) return;
    rig.nudged = true;
    var host = rig.host;
    host.setAttribute("role", "button");
    host.setAttribute("tabindex", "0");
    host.setAttribute("aria-label", text);
    host.classList.add("ember-pressable");
    host.addEventListener("keydown", function (e) {
      if (e.key !== "Enter" && e.key !== " " && e.key !== "Spacebar") return;
      e.preventDefault();
      press(rig);
    });
    var tip = document.createElement("span");
    tip.className = "ember-nudge";
    /* The button already says these words as its name. Saying them twice is how a small kindness
       turns into a stutter for the one reader who cannot see the drawing. */
    tip.setAttribute("aria-hidden", "true");
    tip.textContent = text;
    host.appendChild(tip);
    rig.nudge = tip;
  }

  function auto(root) {
    var nodes = (root || document).querySelectorAll("[data-ember], [data-ember-seed]");
    var made = [];
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      if (el.dataset.emberMounted) continue;
      el.dataset.emberMounted = "1";
      made.push(mount(el, {
        key: el.getAttribute("data-ember") || "",
        seed: el.hasAttribute("data-ember-seed") ? el.getAttribute("data-ember-seed") : null,
        state: el.getAttribute("data-ember-state") || "idle",
        play: el.getAttribute("data-ember-play") || null,
        // Opting in is the attribute being there at all, so a page takes Ember's own words by
        // saying nothing. An empty attribute used to read as "no bubble", which is the opposite
        // of what writing one says.
        nudge: el.hasAttribute("data-ember-nudge")
          ? el.getAttribute("data-ember-nudge") || ""
          : null
      }));
    }
    return made;
  }

  /* Every mounted Ember reacts at once, which is what `reactEmber` does inside the app. Used by
     the form wiring below and available to any page that wants to mark something happening. */
  function react(state, ms) {
    for (var i = 0; i < rigs.length; i++) {
      (function (rig) {
        setState(rig, state);
        setTimeout(function () { if (rig.state === state) setState(rig, "idle"); }, ms || 1500);
      })(rigs[i]);
    }
  }

  /* The same two by host, for a page that holds one Ember over several moments: the homepage
     keeps a single Ember for the whole day and tells it what it is doing where. */
  function rigOf(host) {
    for (var i = 0; i < rigs.length; i++) { if (rigs[i].host === host) return rigs[i]; }
    return null;
  }
  function setNamed(host, state) {
    var rig = rigOf(host);
    if (rig && Object.prototype.hasOwnProperty.call(STATE_CLASS, state)) setState(rig, state);
  }
  function lookNamed(host, pt) {
    var rig = rigOf(host);
    if (rig) rig.look = pt || null;
  }
  /* walk(host, dx): the page moved them dx pixels this frame, so they lean into that and not into
     the scroll. walk(host, null) hands the lean back to the scroll. */
  function walkNamed(host, dx) {
    var rig = rigOf(host);
    if (rig) rig.walk = dx == null ? null : dx;
  }

  window.Ember = {
    mount: mount, auto: auto, react: react, act: actNamed, set: setNamed, look: lookNamed,
    walk: walkNamed, lookFor: lookFor, lookFromKey: lookFromKey, svg: svgFor
  };

  /* The one page with a form worth reacting to. Taking an option is progress and gets the hop; a
     validation message appearing is the form saying no, and they wince with it rather than leaving
     the red text to carry the whole moment. Bound generically (any radio, any `.form-error-msg`
     becoming visible) so the questionnaire can grow steps without this needing to know. */
  function wireForm() {
    var form = document.querySelector(".form-container");
    if (!form) return;
    form.addEventListener("change", function (e) {
      if (e.target && e.target.type === "radio") react("done", 1100);
    });
    var errors = form.querySelectorAll(".form-error-msg");
    if (!errors.length || !window.MutationObserver) return;
    var watcher = new MutationObserver(function (records) {
      for (var i = 0; i < records.length; i++) {
        var el = records[i].target;
        if (el.textContent && getComputedStyle(el).display !== "none") { react("oops", 900); return; }
      }
    });
    for (var i = 0; i < errors.length; i++) {
      watcher.observe(errors[i], { attributes: true, childList: true, characterData: true, subtree: true });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { auto(); wireForm(); });
  } else {
    auto();
    wireForm();
  }
})();
