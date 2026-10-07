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

  /* THE COLORS A WORN THING IS PAINTED IN, and why none of them is the hue's own. The first scarf
     was the hue's dark, the shade the feet are painted in, so on every color it read as a shadow
     across the body rather than as something worn, and the headphones made the same mistake in
     Ember's own colors on their first day. Anything tied on, pinned on or growing
     out of Ember is one of these instead, each chosen to separate from all seven hues and from
     each other. The hue's dark stays on as a hairline so a pale fill has an edge. Same values as
     the app's ember-gen.ts. */
  var ROSE = "#F0A3AA";   /* the bow, the bow tie, the heart, the inside of a bunny ear, the headphone pads */
  var LEAF = "#5FA659";   /* the sprout */
  var GOLD = "#F0C45A";   /* the crown and the sparkles */
  var GRAPHITE = "#45403B";  /* the headphones */
  var BLUSH = "#EE7C86";  /* the cheeks, one pink for every hue */

  var TOPPERS = {
    peak: function (d) {
      return '<path d="M100 30 L87 58 L113 58 Z" fill="' + d + '" stroke="' + d +
        '" stroke-width="8" stroke-linejoin="round"/>';
    },
    none: function () { return ""; },
    /* WHICH OF THESE HAVE WEIGHT, AND WHICH ARE PART OF THE BODY.
       A stalk with a ball on the end of it and a tuft of hair are things that bend when the head
       they stand on moves, so each one is wrapped in a `sway` group turning about its own root
       and given a spring in styles.css. The peak and the ears are drawn into the body, and a cap
       is worn tight: none of the three bends, and a hat that slid about the head would read as a
       bug at the sizes Ember appears. The origin is per topper, so it rides on the markup rather
       than in a class, and it is written in view-box coordinates (the drawing's y minus six) the
       way every other transform origin on Ember is. */
    antenna: function (d) {
      return '<g class="sway" style="transform-origin:100px 46px">' +
        '<path d="M100 52 Q98 36 104 28" stroke="' + d +
        '" stroke-width="6" fill="none" stroke-linecap="round"/>' +
        '<circle cx="105" cy="24" r="8" fill="' + d + '"/></g>';
    },
    ears: function (d) {
      return '<circle cx="66" cy="58" r="14" fill="' + d + '"/>' +
        '<circle cx="134" cy="58" r="14" fill="' + d + '"/>';
    },
    tuft: function (d) {
      return '<g class="sway" style="transform-origin:100px 50px">' +
        '<path d="M100 56 Q92 34 104 22 Q100 38 112 44 Q104 46 100 56 Z" fill="' + d + '"/></g>';
    },
    cap: function (d, m) {
      return '<path d="M56 74 A46 46 0 0 1 144 74 Z" fill="' + d + '"/>' +
        '<rect x="52" y="70" width="96" height="11" rx="5.5" fill="' + m + '"/>';
    },
    /* The five below were added on October 2, 2026, when Jett asked for more of Ember and cuter
       ones. Each is a different silhouette from the six above, which is the only kind of
       difference that survives a small drawing. Same geometry as the app's ember-gen.ts. */
    /* Tied on the upper right of the head, turned to lie along the curve there (the tangent at
       that point is 27 degrees). The lower half of the knot is under the body like the base of
       every other topper, so the bow sits on the head rather than beside it. Worn tight: no sway. */
    bow: function (d) {
      return '<g transform="translate(124 52) rotate(27) scale(1.3)" fill="' + ROSE +
        '" stroke="' + d + '" stroke-width="1.6" stroke-linejoin="round">' +
        '<path d="M0 0 C-5 -12 -20 -13 -19 -3 C-20 6 -6 7 0 0 Z"/>' +
        '<path d="M0 0 C5 -12 20 -13 19 -3 C20 6 6 7 0 0 Z"/>' +
        '<circle r="4.2"/></g>';
    },
    /* A stem out of the crown with a leaf each side. Bends like the tuft, about where it leaves
       the head. */
    sprout: function () {
      return '<g class="sway" style="transform-origin:100px 48px" fill="' + LEAF + '">' +
        '<path d="M100 56 C99 46 98 38 102 30" stroke="' + LEAF +
        '" stroke-width="4.5" fill="none" stroke-linecap="round"/>' +
        '<path d="M99.5 42 C90 42 84 36 84 27 C93 27 99 33 99.5 42 Z"/>' +
        '<path d="M101 35 C110 35 117 28 117 19 C108 19 101 26 101 35 Z"/></g>';
    },
    /* Two tall ears, pink inside, each bending from its own root. */
    bunny: function (d) {
      return '<g class="sway" style="transform-origin:85px 44px">' +
        '<ellipse cx="82" cy="38" rx="8.5" ry="22" transform="rotate(-10 82 38)" fill="' + d + '"/>' +
        '<ellipse cx="82" cy="40" rx="4" ry="14" transform="rotate(-10 82 40)" fill="' + ROSE + '" opacity=".9"/></g>' +
        '<g class="sway" style="transform-origin:115px 44px">' +
        '<ellipse cx="118" cy="38" rx="8.5" ry="22" transform="rotate(10 118 38)" fill="' + d + '"/>' +
        '<ellipse cx="118" cy="40" rx="4" ry="14" transform="rotate(10 118 40)" fill="' + ROSE + '" opacity=".9"/></g>';
    },
    /* A band over the crown and a cup pressed to each side. The band runs behind the body like
       every topper, so it shows above the head; the cups show by sticking out past the
       silhouette, and the pad on each is the outside of the cup. Graphite with pink pads, never
       the body's own colors: in those, their first version, they read as part of the head. */
    headphones: function () {
      return '<path d="M46 100 Q46 43 100 43 Q154 43 154 100" stroke="' + GRAPHITE +
        '" stroke-width="8" fill="none"/>' +
        '<rect x="30" y="80" width="22" height="34" rx="10" fill="' + GRAPHITE + '"/>' +
        '<rect x="148" y="80" width="22" height="34" rx="10" fill="' + GRAPHITE + '"/>' +
        '<rect x="33" y="85" width="7" height="24" rx="3.5" fill="' + ROSE + '"/>' +
        '<rect x="160" y="85" width="7" height="24" rx="3.5" fill="' + ROSE + '"/>';
    },
    /* Five points, the middle one on the wordmark's own apex. */
    crown: function () {
      return '<path d="M74 64 L77 36 L88 48 L100 30 L112 48 L123 36 L126 64 Z" fill="' + GOLD +
        '" stroke="#B98B2C" stroke-width="2" stroke-linejoin="round"/>';
    }
  };
  var TOPPER_IDS = ["peak", "none", "antenna", "ears", "tuft", "cap", "bow", "sprout", "bunny", "headphones", "crown"];

  /* The two catchlights every eye carries: a large one up and to the left, where the light that
     puts the sheen on the body comes from, and a small faint one down and to the right, the
     reflection of the ground. Two is what makes a flat disc read as a wet, round eye, and it is
     the whole of how the eyes got more real on October 2, 2026: no whites, no iris, no outline.
     Both carry class `glint`, which the pleased state hides. */
  function glints(bx, by, br, sx, sy, sr, strong) {
    return '<circle class="glint" cx="' + bx + '" cy="' + by + '" r="' + br +
      '" fill="#FFFFFF" opacity="' + (strong || 0.85) + '"/>' +
      '<circle class="glint" cx="' + sx + '" cy="' + sy + '" r="' + sr +
      '" fill="#FFFFFF" opacity=".5"/>';
  }

  var EYES = {
    pill: {
      shape: '<rect class="pill" x="-7" y="-14" width="14" height="28" rx="7" fill="#2A2521"/>',
      glint: glints(-2.5, -7, 2.5, 2.4, 6, 1.4)
    },
    round: {
      shape: '<circle class="pill" cx="0" cy="0" r="10" fill="#2A2521"/>',
      glint: glints(-3, -3.5, 3, 3.2, 4, 1.5)
    },
    wide: {
      shape: '<circle class="pill" cx="0" cy="0" r="13" fill="#2A2521"/>',
      glint: glints(-4, -4.5, 4.2, 4.4, 5.2, 2, 0.9)
    },
    bead: {
      shape: '<circle class="pill" cx="0" cy="0" r="6" fill="#2A2521"/>',
      glint: glints(-1.8, -2, 1.8, 1.9, 2.2, 0.9, 0.8)
    },
    sleepy: {
      shape: '<rect class="pill" x="-8" y="-6" width="16" height="12" rx="6" fill="#2A2521"/>',
      glint: glints(-2.5, -2, 2, 3.5, 2.2, 1.1, 0.8)
    },
    /* The three below were added on October 2, 2026, with the toppers and extras of the same day. */
    oval: {
      shape: '<ellipse class="pill" cx="0" cy="0" rx="9" ry="12.5" fill="#2A2521"/>',
      glint: glints(-3, -5.5, 3, 3, 5, 1.5)
    },
    /* Lashes straight up rather than off the outer corner, because one shape serves both eyes and
       an outer corner is a different side on each. They carry class `pill` too, so they go with
       the eye when the happy arc takes over. */
    lashes: {
      shape: '<circle class="pill" cx="0" cy="0" r="10" fill="#2A2521"/>' +
        '<path class="pill" d="M-5.5 -9.5 L-8.5 -14.5 M0 -11 L0 -16.5 M5.5 -9.5 L8.5 -14.5" ' +
        'stroke="#2A2521" stroke-width="2.6" stroke-linecap="round" fill="none"/>',
      glint: glints(-3, -3.5, 3, 3.2, 4, 1.5)
    },
    shine: {
      shape: '<circle class="pill" cx="0" cy="0" r="11.5" fill="#2A2521"/>',
      glint: glints(-3.6, -4.2, 4.3, 3.8, 4.6, 2.3, 0.95)
    }
  };
  var EYE_IDS = ["pill", "round", "wide", "bead", "sleepy", "oval", "lashes", "shine"];

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
    /* A scarf was here until October 2, 2026, when Jett retired it: a cream band low on a round
       body read as a diaper. A look that names it falls back to no extra in `lookFromKey`.
       The four below were added the same day, each clear of every hat: the bow tie on the middle
       of the chest, the bandage on the lower left, the heart on the lower right, and the sparkles
       in the air beside the head. Same geometry as the app's. */
    bowtie: function (d) {
      return '<g transform="translate(100 152)" fill="' + ROSE + '" stroke="' + d +
        '" stroke-width="2" stroke-linejoin="round">' +
        '<path d="M-3 0 L-15 -7.5 Q-18.5 0 -15 7.5 Z"/>' +
        '<path d="M3 0 L15 -7.5 Q18.5 0 15 7.5 Z"/>' +
        '<rect x="-4" y="-4.5" width="8" height="9" rx="2.5"/></g>';
    },
    bandage: function (d) {
      return '<g transform="translate(66 142) rotate(-28) scale(1.2)">' +
        '<rect x="-9" y="-3.6" width="18" height="7.2" rx="3.4" fill="#F3DFC6" stroke="' + d +
        '" stroke-width="1.4"/>' +
        '<rect x="-3.2" y="-2.2" width="6.4" height="4.4" rx="1" fill="#E4C19C"/></g>';
    },
    heart: function (d) {
      return '<path transform="translate(133 141) scale(1.4)" ' +
        'd="M0 5.5 L-6.8 -1.5 A4 4 0 0 1 0 -5.2 A4 4 0 0 1 6.8 -1.5 Z" fill="' + ROSE +
        '" stroke="' + d + '" stroke-width="1.3" stroke-linejoin="round"/>';
    },
    /* Placed to miss the headphone cups (x=30 and x=170, y=80 to 114) and the z's, which leave
       the head at (146,74) and drift up. */
    sparkles: function () {
      var star = 'd="M0 -7 Q1.2 -1.2 7 0 Q1.2 1.2 0 7 Q-1.2 1.2 -7 0 Q-1.2 -1.2 0 -7 Z"';
      return '<g fill="' + GOLD + '">' +
        '<path transform="translate(36 62) scale(1.2)" ' + star + '/>' +
        '<path transform="translate(167 124) scale(1)" ' + star + '/>' +
        '<path transform="translate(157 144) scale(.6)" ' + star + '/></g>';
    }
  };
  var EXTRA_IDS = ["none", "glasses", "freckles", "bowtie", "bandage", "heart", "sparkles"];
  /* Where each extra is worn, which only matters once they can turn around. Glasses, freckles, a
     bow tie, a bandage and a heart are on their front and go wherever their face goes. Sparkles
     are in the air beside them, so they ride the `wrap` group (made for a scarf, since retired),
     which a turn leaves alone and a flip carries round. Anything added here belongs in one of
     the two. */
  var EXTRAS_ON_BODY = { sparkles: true };

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
    /* The window: a square 182 across, centered on (100, 106), the same as the app's `FRAME` in
       ember-gen.ts. It was 200 across from y=6 until October 2, 2026, when Jett asked for Ember to
       fill more of the circle; 182 makes them 10% bigger. The transform origins in styles.css did
       not move with it, because a `transform-box: view-box` origin is measured from the drawing's
       zero and not from the window's corner (tested in WebKit and Chrome that day). That also
       means each origin there sits 6 units above the part its comment names; the app's repo has
       the details in docs/OPEN-THREADS.md. */
    return '<svg viewBox="9 15 182 182" aria-hidden="true" focusable="false">' +
      '<defs><linearGradient id="ember-' + uid + '" x1="0" y1="0.18" x2="0" y2="1">' +
      '<stop offset="0" stop-color="' + hue.light + '"/>' +
      '<stop offset="0.55" stop-color="' + hue.mid + '"/>' +
      '<stop offset="1" stop-color="' + hue.dark + '"/></linearGradient>' +
      /* The light, as four gradients: a sheen high on the left of the ball, a shade deepening
         toward its lower right, the cheeks, and the shadow on the ground. See the notes on the
         body below. Same four as the app's ember-gen.ts, added October 2, 2026. */
      '<radialGradient id="sheen-' + uid + '" cx="0.35" cy="0.27" r="0.55">' +
      '<stop offset="0" stop-color="#FFFFFF" stop-opacity=".34"/>' +
      '<stop offset="0.5" stop-color="#FFFFFF" stop-opacity=".08"/>' +
      '<stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="rim-' + uid + '" cx="0.42" cy="0.38" r="0.68">' +
      '<stop offset="0.68" stop-color="' + hue.dark + '" stop-opacity="0"/>' +
      '<stop offset="1" stop-color="' + hue.dark + '" stop-opacity=".42"/></radialGradient>' +
      '<radialGradient id="blush-' + uid + '">' +
      '<stop offset="0" stop-color="' + BLUSH + '" stop-opacity=".55"/>' +
      '<stop offset="1" stop-color="' + BLUSH + '" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="shade-' + uid + '">' +
      '<stop offset="0" stop-color="#44403B" stop-opacity=".2"/>' +
      '<stop offset="0.6" stop-color="#44403B" stop-opacity=".1"/>' +
      '<stop offset="1" stop-color="#44403B" stop-opacity="0"/></radialGradient>' +
      /* The lip, as a clip. The tongue swings about where it leaves the mouth, and a shape
         rotating about its own top edge lifts its far corner above that edge: 22 degrees puts
         about two units of it over the lip, which at the sizes Ember is drawn is a pink nub on
         the face. Clipping to everything below the lip line takes it, and the clip sits on a
         group that does not turn, because a clip path on the turning group turns with it and
         clips nothing. These are plain drawing coordinates, not the view-box-corner ones the
         transform origins in styles.css use. */
      '<clipPath id="lip-' + uid + '"><rect x="84" y="134" width="32" height="34"/></clipPath>' +
      '</defs>' +
      /* Soft at its edge rather than a flat tint: the first of the four touches of light. All
         four are gradients and none is a new shape, because a gradient reads as the same drawing
         with light on it at any size, and a new shape reads as a new thing to decode. */
      '<ellipse cx="100" cy="177" rx="40" ry="7" fill="url(#shade-' + uid + ')"/>' +
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
      /* A touch of the same light on the top of each foot, so they are round things under the
         body rather than two dark marks. */
      '<ellipse cx="80" cy="166.8" rx="4.6" ry="2.2" fill="#FFFFFF" opacity=".16"/>' +
      '<ellipse cx="116" cy="166.8" rx="4.6" ry="2.2" fill="#FFFFFF" opacity=".16"/>' +
      '</g>' +
      '<g class="top">' + (TOPPERS[look.topper] || TOPPERS.peak)(hue.dark, hue.mid) + '</g>' +
      '<circle cx="100" cy="108" r="60" fill="url(#ember-' + uid + ')"/>' +
      /* THE BALL IS LIT FROM THE UPPER LEFT, and these two circles are the whole of that: a soft
         white sheen high on the left, and a shade that deepens toward the lower right edge.
         Between them a disc with a top-to-bottom gradient becomes a sphere. Drawn on the ball
         and not in any of the turning groups, because the light is in the room and not on
         Ember: a sphere turning under a lamp keeps its highlight where the lamp is. */
      '<circle cx="100" cy="108" r="60" fill="url(#sheen-' + uid + ')"/>' +
      '<circle cx="100" cy="108" r="60" fill="url(#rim-' + uid + ')"/>' +
      '<g class="face">' +
      /* The face sits two units lower in the body than the app's ember-gen.ts draws it (eyes
         105 not 103, blush 127, mouth 134): a pixel at the sizes the site shows them, asked for
         on 2026-09-11 because they read as looking up out of their own circle. If the app takes
         the same nudge, this note goes. */
      /* The cheeks were the hue's dark at 38%, all but invisible on the cooler hues and a flat
         oval with an edge on every one. One pink for all seven, fading to nothing at its own
         rim, is a flush rather than a sticker. */
      '<ellipse cx="65" cy="127" rx="10.5" ry="6.5" fill="url(#blush-' + uid + ')"/>' +
      '<ellipse cx="135" cy="127" rx="10.5" ry="6.5" fill="url(#blush-' + uid + ')"/>' +
      eye(78, 105, eyes) + eye(122, 105, eyes) +
      '<path class="mouth mouth-smile" d="M93 134 Q100 140 107 134" stroke="#2A2521" ' +
      'stroke-width="3.2" fill="none" stroke-linecap="round"/>' +
      '<path class="mouth mouth-flat" d="M93 136 L107 136" stroke="#2A2521" stroke-width="3.2" ' +
      'fill="none" stroke-linecap="round" opacity="0"/>' +
      /* The open mouth, which nothing here animates: it is drawn for the personality faces in the
         add-on store (scripts/gen-marketplace.mjs), where Hype Coach and The Morning Show talk with
         theirs open, as the app's voice-looks.ts draws them. Filled, flat on top and round below, a
         jaw dropped rather than a ring, and two units lower than the app's like the rest of the face. */
      '<path class="mouth mouth-snore" d="M93.8 134.5 A6.2 6.2 0 0 0 106.2 134.5 Z" fill="#2A2521" ' +
      'opacity="0"/>' +
      /* The tongue, for the one move in a hundred, and THE MOUTH HAS TO READ AS OPEN BEFORE THE
         TONGUE READS AS A TONGUE. The first version dropped a small jaw (11.2 wide, inside the
         smile's own 14) and hung the tongue off its lip, and what that drew was a pink shape with
         a dark line over it: a mouth, not a tongue out of one. So the opening is now bigger than
         the closed smile rather than smaller, because a mouth pulled open IS bigger, and the
         tongue starts inside it, crosses the bottom edge and carries on over the chin. Dark all
         round the top of it is what says which of the two shapes is the hole. Filled rather than
         stroked: at the sizes Ember is drawn a stroked ring fills in with antialiasing and reads
         as a smudge. `opacity="0"` is on the markup rather than left to CSS, because the app
         rasterizes this same string into saved pictures with no stylesheet near it. */
      '<g class="mouth mouth-blep" opacity="0">' +
      '<ellipse cx="100" cy="140" rx="10.5" ry="6" fill="#2A2521"/>' +
      '<g clip-path="url(#lip-' + uid + ')"><g class="tongue">' +
      '<path d="M95.2 139 L104.8 139 L104.8 150 Q104.8 155 100 155 Q95.2 155 95.2 150 Z" ' +
      'fill="#E59AA0" stroke="#2A2521" stroke-width="1.7" stroke-linejoin="round"/>' +
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
  var wakeTimer = 0, listening = false;
  var last = 0;
  var REDUCED = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var STATE_CLASS = { idle: "", working: "st-working", done: "st-done", oops: "st-oops", sleep: "st-sleep" };
  var viewObserver = window.IntersectionObserver ? new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      var rig = rigOf(entry.target);
      if (!rig) return;
      rig.inView = entry.isIntersecting;
      rig.host.classList.toggle('motion-paused', !rig.inView);
      rig.rectAt = -1e9;
      if (!rig.inView) rig.visible = false;
    });
    start();
  }) : null;

  var renderedStyles = new WeakMap();
  function writeStyle(el, name, value) {
    var values = renderedStyles.get(el);
    if (!values) { values = {}; renderedStyles.set(el, values); }
    if (values[name] !== value) { el.style.setProperty(name, value); values[name] = value; }
  }

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
    start();
  }

  /* How fast the page is moving, so Ember can lean into a scroll and settle out of it. Read in
     the loop rather than acted on here, so a fast flick is one number rather than a burst of work.
     */
  function onScroll() {
    var y = window.scrollY || window.pageYOffset || 0;
    scrollVel = y - lastScrollY;
    lastScrollY = y;
    for (var i = 0; i < rigs.length; i++) rigs[i].rectAt = -1e9;
    start();
  }

  /* Anything the reader could press. Hovering one turns every Ember on the page toward it. */
  function onOver(e) {
    var el = e.target && e.target.closest && e.target.closest("a, button, .btn, .radio-option, summary");
    if (!el) return;
    var r = el.getBoundingClientRect();
    attend.x = r.left + r.width / 2;
    attend.y = r.top + r.height / 2;
    attend.until = performance.now() + 1400;
    start();
  }

  function start() {
    if (!listening) {
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerover", onOver, { passive: true });
      window.addEventListener("scroll", onScroll, { passive: true });
      lastScrollY = window.scrollY || window.pageYOffset || 0;
      listening = true;
    }
    if (raf || document.hidden || REDUCED) return;
    clearTimeout(wakeTimer);
    wakeTimer = 0;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  }

  function frame(now) {
    raf = 0;
    if (document.hidden || REDUCED) return;
    var dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    scrollVel *= Math.exp(-dt * 6);
    var moving = false, next = Infinity;
    // Read visible geometry together, before changing any SVG transforms.
    for (var i = 0; i < rigs.length; i++) {
      var rig = rigs[i];
      if (rig.faceOnly) continue;
      if (viewObserver && !rig.inView) continue;
      if (now - rig.rectAt > 400) {
        rig.rect = rig.svg.getBoundingClientRect();
        rig.rectAt = now;
      }
    }
    for (i = 0; i < rigs.length; i++) {
      rig = rigs[i];
      if (rig.faceOnly) continue;
      if (viewObserver && !rig.inView) continue;
      moving = update(rig, now, dt) || moving;
      if (!rig.visible) continue;
      if (rig.state !== 'sleep') next = Math.min(next, rig.nextBlink);
      if (rig.state === 'idle') next = Math.min(next, rig.flourish);
      if (rig.nudgeAt) next = Math.min(next, rig.nudgeAt);
      if (!rig.look && rig.state !== 'sleep') {
        next = Math.min(next, Math.max(pointer.moved + 4000, rig.wander.next));
        if (attend.until > now) next = Math.min(next, attend.until);
      }
    }
    if (!raf) {
      if (moving) raf = requestAnimationFrame(frame);
      else if (Number.isFinite(next)) wakeTimer = setTimeout(start, Math.max(20, next - now));
      else if (!viewObserver && rigs.length) wakeTimer = setTimeout(start, 400);
    }
  }

  function setState(rig, state) {
    if (rig.state === state) return;
    for (var k in STATE_CLASS) {
      if (STATE_CLASS[k]) rig.svg.classList.remove(STATE_CLASS[k]);
    }
    if (STATE_CLASS[state]) rig.svg.classList.add(STATE_CLASS[state]);
    rig.state = state;
    start();
  }

  function update(rig, now, dt) {
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
    if (rig.lean) writeStyle(rig.lean, 'transform', "rotate(" + tilt.toFixed(2) + "deg)");

    /* Every so often, unprompted, they do something. Only while idle and only when the reader can
       see them, so nothing plays to an empty screen or interrupts a state that means something. */
    if (!REDUCED && rig.state === "idle" && now > rig.flourish) {
      rig.flourish = now + IDLE_MIN + Math.random() * IDLE_SPREAD;
      actOnce(rig, false);
    }
    for (var i = 0; i < rig.eyes.length; i++) {
      var e = rig.eyes[i];
      writeStyle(e.g, 'transform', "translate(" + (e.bx + rig.gx).toFixed(2) + "px," + (e.by + rig.gy).toFixed(2) + "px)");
      writeStyle(e.open, 'transform', "scaleY(" + open.toFixed(3) + ")");
    }
    return rig.blinkT >= 0 || Math.abs((dx / len) * shift - rig.gx) > 0.02 ||
      Math.abs((dy / len) * shift - rig.gy) > 0.02 || Math.abs(lidTarget - rig.lid) > 0.002 || Math.abs(scrollVel) > 0.1;
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
      inView: !viewObserver,
      // Faces inside app mockups are pictures of the UI, not separate pointer followers.
      faceOnly: !!host.closest('.da-avatar, .dp-face'),
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
    if (viewObserver) {
      host.classList.add('motion-paused');
      viewObserver.observe(host);
    }
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
    if (rig) { rig.look = pt || null; start(); }
  }
  /* walk(host, dx): the page moved them dx pixels this frame, so they lean into that and not into
     the scroll. walk(host, null) hands the lean back to the scroll. */
  function walkNamed(host, dx) {
    var rig = rigOf(host);
    if (rig) { rig.walk = dx == null ? null : dx; rig.rectAt = -1e9; start(); }
  }

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      cancelAnimationFrame(raf); raf = 0;
      clearTimeout(wakeTimer); wakeTimer = 0;
    } else {
      for (var i = 0; i < rigs.length; i++) rigs[i].rectAt = -1e9;
      start();
    }
  });

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
