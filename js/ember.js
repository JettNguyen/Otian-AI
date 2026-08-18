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
    scarf: function (d) {
      return '<path d="M62 150 Q100 168 138 150 L138 158 Q100 176 62 158 Z" fill="' + d + '"/>' +
        '<path d="M128 156 l10 22 q-7 3 -13 1 l-6 -19 Z" fill="' + d + '"/>';
    }
  };
  var EXTRA_IDS = ["none", "glasses", "freckles", "scarf"];

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
    return '<svg viewBox="0 0 200 200" aria-hidden="true" focusable="false">' +
      '<defs><linearGradient id="ember-' + uid + '" x1="0" y1="0.18" x2="0" y2="1">' +
      '<stop offset="0" stop-color="' + hue.light + '"/>' +
      '<stop offset="0.55" stop-color="' + hue.mid + '"/>' +
      '<stop offset="1" stop-color="' + hue.dark + '"/></linearGradient></defs>' +
      '<ellipse cx="100" cy="177" rx="37" ry="6" fill="rgba(68,64,59,.12)"/>' +
      '<g class="anim"><g class="lean">' +
      '<ellipse cx="82" cy="169" rx="10" ry="7.5" fill="' + hue.dark + '"/>' +
      '<ellipse cx="118" cy="169" rx="10" ry="7.5" fill="' + hue.dark + '"/>' +
      (TOPPERS[look.topper] || TOPPERS.peak)(hue.dark, hue.mid) +
      '<circle cx="100" cy="108" r="60" fill="url(#ember-' + uid + ')"/>' +
      '<ellipse cx="65" cy="125" rx="8.5" ry="5" fill="' + hue.dark + '" opacity=".38"/>' +
      '<ellipse cx="135" cy="125" rx="8.5" ry="5" fill="' + hue.dark + '" opacity=".38"/>' +
      eye(78, 103, eyes) + eye(122, 103, eyes) +
      '<path class="mouth mouth-smile" d="M93 132 Q100 138 107 132" stroke="#2A2521" ' +
      'stroke-width="3.2" fill="none" stroke-linecap="round"/>' +
      '<path class="mouth mouth-flat" d="M93 134 L107 134" stroke="#2A2521" stroke-width="3.2" ' +
      'fill="none" stroke-linecap="round" opacity="0"/>' +
      (EXTRAS[look.extra] || EXTRAS.none)(hue.dark) +
      "</g></g></svg>";
  }

  /* ---- the rig ------------------------------------------------------------------------------ */

  var rigs = [];
  var pointer = { x: 0, y: 0, moved: 0 };
  var raf = 0;
  var last = 0;
  var STATE_CLASS = { idle: "", working: "st-working", done: "st-done", oops: "st-oops", sleep: "st-sleep" };

  function onMove(e) {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    pointer.moved = performance.now();
  }

  function start() {
    if (raf) return;
    window.addEventListener("pointermove", onMove, { passive: true });
    last = performance.now();
    raf = requestAnimationFrame(frame);
  }

  function frame(now) {
    var dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    for (var i = 0; i < rigs.length; i++) update(rigs[i], now, dt);
    if (rigs.length) {
      raf = requestAnimationFrame(frame);
    } else {
      raf = 0;
      window.removeEventListener("pointermove", onMove);
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
    if (!r || !r.width || r.bottom < -60 || r.top > window.innerHeight + 60) return;
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
    if (rig.state === "sleep") {
      tx = cx; ty = cy + 60;
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

    if (rig.lean) rig.lean.style.transform = "rotate(" + ((dx / len) * reach * 3).toFixed(2) + "deg)";
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
      lean: svg.querySelector(".lean"),
      eyes: [],
      state: "idle",
      gx: 0, gy: 0, lid: 1, blinkT: -1,
      nextBlink: performance.now() + 1200 + Math.random() * 3200,
      wander: { x: 0, y: 0, next: 0 },
      rect: null, rectAt: -1e9
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
    }
    start();

    /* Clicking him is the one interaction people try, so it answers: a hop, then back to idle. */
    host.addEventListener("click", function () {
      if (rig.state !== "idle") return;
      setState(rig, "done");
      setTimeout(function () { setState(rig, "idle"); }, 1700);
    });
    return {
      element: host,
      set: function (state) { setState(rig, state); },
      play: function (state, ms) {
        setState(rig, state);
        setTimeout(function () { setState(rig, "idle"); }, ms || 1700);
      }
    };
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
        play: el.getAttribute("data-ember-play") || null
      }));
    }
    return made;
  }

  window.Ember = { mount: mount, auto: auto, lookFor: lookFor, lookFromKey: lookFromKey, svg: svgFor };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { auto(); });
  } else {
    auto();
  }
})();
