/* ========================================
   Otian AI | Shared Navigation
   js/nav.js
   ======================================== */

(function () {
  'use strict';

  var THEME_KEY = 'nr-theme';
  var root = document.documentElement;

  /* Running as the installed "Archie on your phone" app rather than in a browser tab.
     The app is for managing an agent, so it should not double as a way to wander into the
     marketing site: someone who tapped an Archie icon on their home screen did not ask for
     Pricing, the Blog, or Our Story, and in a window with no address bar and no tabs there is no
     obvious way back. `.is-app` on the root element is what styles.css hangs that on.
     Marked here, in the nav script every page loads, because the app can legitimately visit
     /account/, /login/ and /billing/, and each of those has to know too. */
  try {
    if ((window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
        window.navigator.standalone === true) {
      root.classList.add('is-app');

      /* The wordmark is a link home on every page of the site, which inside the app is the one
         door left open into the marketing pages the rest of this hides. Point it at the app's own
         start instead, so tapping the logo does what it does in any app: go back to the top of
         this thing, not out of it. Rewritten here rather than per page, because the app can be on
         /phone/, /account/ or /billing/ and the markup is duplicated in all of them. */
      var logo = document.querySelector('.nav-logo');
      if (logo) logo.setAttribute('href', '/phone/');

      /* No pinch or double-tap zoom in the app.
         Deliberately scoped to standalone and nowhere else: suppressing zoom on a website is an
         accessibility failure, and the ordinary otianai.com pages keep it. Here the window has no
         address bar to re-fit a zoomed page with, so an accidental double-tap leaves someone stuck
         at 2x with no obvious way back, which is the worse outcome. Text still scales with the
         system font-size setting, which is the accessibility path that matters. */
      var vp = document.querySelector('meta[name="viewport"]');
      if (vp) {
        vp.setAttribute(
          'content',
          'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
        );
      }
    }
  } catch (e) { /* treat as a normal browser tab */ }

  function getStoredTheme() {
    try {
      return window.localStorage.getItem(THEME_KEY);
    } catch (e) {
      return null;
    }
  }

  function updateNavLogos(theme) {
    var logoFile = theme === 'dark' ? 'icon-1024-dark.svg' : 'icon-1024-light.svg';

    document.querySelectorAll('.nav-logo img, .footer-logo img').forEach(function (img) {
      if (!img.dataset.logoBaseHref) {
        img.dataset.logoBaseHref = img.getAttribute('src') || '';
      }

      var baseHref = img.dataset.logoBaseHref;
      if (!baseHref) return;

      try {
        var resolved = new URL(baseHref, window.location.href);
        resolved.pathname = resolved.pathname.replace(/[^/]+$/, logoFile);
        img.src = resolved.toString();
      } catch (e) {
        img.src = baseHref.replace(/[^/]+$/, logoFile);
      }
    });
  }

  /* The colour the phone paints its address bar and task-switcher card. It is set in the markup
     and again by the pre-paint script, so it is already right on arrival; this is the toggle case,
     where the page turns dark under a bar that would otherwise stay cream. Values are --bg-primary
     from each theme in css/styles.css, and have to be literals: the bar is painted by the browser
     chrome, which cannot read a custom property. Changing either one means changing it there too. */
  function applyThemeColor(nextTheme) {
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', nextTheme === 'dark' ? '#1A1A19' : '#FCFAF8');
  }

  function applyTheme(theme, shouldPersist) {
    var nextTheme = theme === 'dark' ? 'dark' : 'light';
    root.setAttribute('data-theme', nextTheme);
    applyThemeColor(nextTheme);

    document.querySelectorAll('.theme-toggle').forEach(function (toggle) {
      var isDark = nextTheme === 'dark';
      toggle.setAttribute('aria-pressed', String(isDark));
      toggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    });

    updateNavLogos(nextTheme);

    if (!shouldPersist) return;

    try {
      window.localStorage.setItem(THEME_KEY, nextTheme);
    } catch (e) {
      /* localStorage unavailable */
    }
  }

  function createThemeToggle(extraClassName) {
    var button = document.createElement('button');
    button.type = 'button';
    button.className = extraClassName ? 'theme-toggle ' + extraClassName : 'theme-toggle';
    // The icon shows the theme that's ON: sun while light, moon while dark.
    // Both icons live in the DOM; CSS swaps them on html[data-theme].
    button.innerHTML =
      '<svg class="theme-toggle-icon theme-toggle-icon--sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<circle cx="12" cy="12" r="4"/>' +
        '<line x1="12" y1="2" x2="12" y2="4.5"/><line x1="12" y1="19.5" x2="12" y2="22"/>' +
        '<line x1="2" y1="12" x2="4.5" y2="12"/><line x1="19.5" y1="12" x2="22" y2="12"/>' +
        '<line x1="4.93" y1="4.93" x2="6.7" y2="6.7"/><line x1="17.3" y1="17.3" x2="19.07" y2="19.07"/>' +
        '<line x1="4.93" y1="19.07" x2="6.7" y2="17.3"/><line x1="17.3" y1="6.7" x2="19.07" y2="4.93"/>' +
      '</svg>' +
      '<svg class="theme-toggle-icon theme-toggle-icon--moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>' +
      '</svg>';
    button.addEventListener('click', function () {
      var currentTheme = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      applyTheme(currentTheme === 'dark' ? 'light' : 'dark', true);
    });
    return button;
  }

  function mountThemeToggles() {
    // A floating control rather than a nav item (2026-08-19). Changing theme is a
    // once-a-session preference, and it was taking a permanent seat in the nav next
    // to the things people actually came to click. Fixed to the corner, it follows
    // the reader down the page and stays out of the way of the header.
    if (document.querySelector('.theme-toggle--float')) return;
    var floatToggle = createThemeToggle('theme-toggle--float');
    document.body.appendChild(floatToggle);

    // It hides while the footer is on screen, where it would otherwise sit on top of
    // the legal links, and comes back the moment the reader scrolls up. Without
    // IntersectionObserver it simply stays put, which is the safe failure.
    var footer = document.querySelector('.footer');
    if (footer && 'IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        floatToggle.classList.toggle('is-tucked', entries[0].isIntersecting);
      }, { rootMargin: '0px 0px -40px 0px' }).observe(footer);
    }
  }

  mountThemeToggles();
  applyTheme(getStoredTheme() || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'), false);

  /* ── Active page link ──
     Use link.href (browser-resolved absolute URL) so relative hrefs
     like "../about/" work correctly from any directory depth.

     Most specific link wins. A link also matches as an ancestor of the current page, so that
     /skills-marketplace/browse/skills/calendar-management/ still lights "Browse", but only the
     LONGEST match is highlighted. Without that, /archie/ ("What Is Archie?") is a prefix of
     /archie/see-it-work/ and would light up alongside "See It Work"; those two are siblings in
     the dropdown, not parent and child. Every link tied at the longest match lights up, which is
     what keeps the nav, drawer, and flyout copies of the same href in sync.                */
  var currentNorm = window.location.pathname.replace(/\/+$/, '') || '/';

  var links = document.querySelectorAll('.nav-links a, .nav-drawer a, .nav-drawer-flyout a');
  var best = '';

  var pathOf = function (link) {
    try {
      return new URL(link.href).pathname.replace(/\/+$/, '') || '/';
    } catch (e) {
      return null; /* non-navigable href */
    }
  };

  links.forEach(function (link) {
    var linkNorm = pathOf(link);
    if (linkNorm === null) return;
    var matches =
      linkNorm === currentNorm ||
      (linkNorm !== '/' && currentNorm.startsWith(linkNorm + '/'));
    if (matches && linkNorm.length > best.length) best = linkNorm;
  });

  if (best) {
    links.forEach(function (link) {
      if (pathOf(link) === best) link.classList.add('active');
    });
  }

  /* Account & auth pages aren't in the menus; they hang off the avatar. Light the avatar button
     when you're on one, so the nav still shows where you are. (account-nav.js marks the matching
     item inside the dropdown itself.) */
  var accountPaths = ['/login', '/account', '/activity', '/billing', '/auth-action', '/app-auth', '/app-security'];
  var onAccountPage = accountPaths.some(function (p) {
    return currentNorm === p || currentNorm.indexOf(p + '/') === 0;
  });
  if (onAccountPage) {
    document.querySelectorAll('.nav-account-btn').forEach(function (btn) {
      btn.classList.add('active');
    });
  }

  var dropdowns = Array.prototype.slice.call(document.querySelectorAll('.nav-more'));

  dropdowns.forEach(function (container) {
    var toggle = container.querySelector('.nav-more-toggle');
    var menu = container.querySelector('.nav-more-menu');
    if (!toggle || !menu) return;

    if (menu.querySelector('a.active')) {
      toggle.classList.add('active');
    }

    function open() {
      dropdowns.forEach(function (other) {
        if (other !== container) closeDropdown(other);
      });
      container.classList.add('open');
      toggle.setAttribute('aria-expanded', 'true');
    }

    function close() {
      container.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      /* :focus-within on the container also drives the open visual state (for
         keyboard nav), so if the toggle or a menu link still has focus after
         this click, the CSS would keep showing it as open. Blur to match. */
      if (container.contains(document.activeElement)) {
        document.activeElement.blur();
      }
    }

    container._closeNavMore = close;

    toggle.addEventListener('click', function () {
      if (container.classList.contains('open')) {
        close();
      } else {
        open();
      }
    });

    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', close);
    });
  });

  function closeDropdown(container) {
    if (container._closeNavMore) container._closeNavMore();
  }

  document.addEventListener('click', function (event) {
    dropdowns.forEach(function (container) {
      if (!container.contains(event.target)) closeDropdown(container);
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      dropdowns.forEach(closeDropdown);
    }
  });

  /* ── Scroll: nav opacity + wordmark tuck ── */
  const nav = document.getElementById('nav');
  if (nav) {
    /* The wordmark text tucks away behind the icon while the reader heads down the page,
       and slides back out the moment they head up (styles.css, .logo-tucked). Direction,
       not position: someone deep in a long page who reverses gets the name back
       immediately. The 12px hysteresis keeps momentum-scroll wobble on touch screens
       from flickering it, and near the top the text is always shown, so a page never
       arrives with the name missing. */
    var lastY = window.scrollY;
    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      nav.classList.toggle('scrolled', y > 20);
      if (y <= 80) {
        nav.classList.remove('logo-tucked');
      } else if (y > lastY + 12) {
        nav.classList.add('logo-tucked');
      } else if (y >= lastY - 12) {
        return; /* within hysteresis: leave lastY as the anchor */
      } else {
        nav.classList.remove('logo-tucked');
      }
      lastY = y;
    }, { passive: true });
  }

  /* ── Drawer flyout: Services / Learn / Company pop out beside the drawer ── */
  const drawerFlyout = document.getElementById('navDrawerFlyout');
  let resetDrawerPanels = function () {};

  if (drawerFlyout) {
    const catButtons = Array.prototype.slice.call(document.querySelectorAll('.nav-drawer-cat'));
    const linkGroups = Array.prototype.slice.call(drawerFlyout.querySelectorAll('.nav-drawer-flyout-links'));
    const flyoutTitle = document.getElementById('navDrawerFlyoutTitle');
    const closeBtn = drawerFlyout.querySelector('.nav-drawer-back');
    const canHover = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    catButtons.forEach(function (btn) {
      const group = document.getElementById(btn.dataset.drawerTarget || '');
      if (group && group.querySelector('a.active')) {
        btn.classList.add('active');
      }
    });

    function openFlyout(targetId, label) {
      linkGroups.forEach(function (group) {
        group.classList.toggle('is-active', group.id === targetId);
      });
      if (flyoutTitle) flyoutTitle.textContent = label;
      drawerFlyout.classList.add('open');
      drawerFlyout.setAttribute('aria-hidden', 'false');
      catButtons.forEach(function (btn) {
        const isTarget = btn.dataset.drawerTarget === targetId;
        btn.setAttribute('aria-expanded', String(isTarget));
        btn.classList.toggle('open', isTarget);
      });
    }

    resetDrawerPanels = function () {
      drawerFlyout.classList.remove('open');
      drawerFlyout.setAttribute('aria-hidden', 'true');
      linkGroups.forEach(function (group) {
        group.classList.remove('is-active');
      });
      catButtons.forEach(function (btn) {
        btn.setAttribute('aria-expanded', 'false');
        btn.classList.remove('open');
      });
    };

    catButtons.forEach(function (btn) {
      const targetId = btn.dataset.drawerTarget;
      const label = btn.textContent.trim();
      btn.addEventListener('click', function () {
        openFlyout(targetId, label);
      });
      if (canHover) {
        btn.addEventListener('mouseenter', function () {
          openFlyout(targetId, label);
        });
      }
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', resetDrawerPanels);
    }

    /* Flyout should only stay expanded while hovering its own trigger or the
       flyout itself - hovering anything else in the drawer (e.g. "How It
       Works") collapses it. */
    if (canHover) {
      const drawerEl = document.getElementById('navDrawer');
      if (drawerEl) {
        Array.prototype.slice.call(drawerEl.children).forEach(function (child) {
          if (!child.classList.contains('nav-drawer-cat')) {
            child.addEventListener('mouseenter', resetDrawerPanels);
          }
        });
      }
    }
  }

  /* ── Hamburger / Drawer ── */
  const hamburger = document.getElementById('hamburger');
  const drawer    = document.getElementById('navDrawer');
  const overlay   = document.getElementById('navOverlay');

  function openDrawer() {
    hamburger.classList.add('open');
    drawer.classList.add('open');
    overlay.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    hamburger.classList.remove('open');
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    resetDrawerPanels();
  }

  if (hamburger) {
    hamburger.addEventListener('click', function () {
      if (drawer.classList.contains('open')) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });
  }

  if (overlay) {
    overlay.addEventListener('click', closeDrawer);
  }

  /* Close drawer on Escape key */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && drawer && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });

  /* ── Scroll-triggered fade-up (IntersectionObserver) ── */
  const fadeEls = document.querySelectorAll('.fade-up');

  if ('IntersectionObserver' in window && fadeEls.length) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0,
      rootMargin: '0px 0px -20px 0px'
    });

    fadeEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    /* Fallback: show everything if observer not supported */
    fadeEls.forEach(function (el) {
      el.classList.add('visible');
    });
  }
})();

/* ============================================================
   Wedge typesetting

   Centered copy should sit as an inverted triangle: the first line longest, each
   one a little shorter, so there is a ragged edge for the eye to follow back to
   the start of the next line. A centered block whose lines are all one width
   reads as a justified rectangle and the reader loses their place; a block that
   ends on three stray words looks broken.

   No wrapping algorithm can do this. `text-wrap: balance` evens the lines, which
   is the rectangle. `pretty` fills greedily and leaves whatever is left over on
   the last line, which is the stray words. Neither knows what shape the block
   should be, so this measures the text and puts the breaks in.

   It runs on every centered block that renders three lines or more, at whatever
   width the window happens to be, and again whenever that width changes. Blocks
   of one or two lines are left alone: there is no wedge to make out of two lines,
   and forcing one only makes the first line short for no reason.

   Without JavaScript nothing here runs and the browser wraps normally, which is what
   every one of these blocks did before.

   Known limit: at about 320px the column is narrow enough that single words are a
   third of a line, and for some blocks no arrangement is strictly decreasing. The
   search returns the least-bad one there rather than pretending. Everything from
   360px up, which is every phone still shipping, comes out clean.
   ============================================================ */
(function () {
  var SEL = '.hm-wrap p, .hm-hero p, .hm-cta p, .page-hero p, .cta-banner p, .text-center p,'
          + '.hm-lede, .hm-micro, .hm-hero-micro, .hero-subtitle, .calm-note--center,'
          + '.acct-lead, .acct-foot-note, .booking-note,'
          + '.marketplace-split-note, .demo-player-caption, .vg-caption,'
          + '.explain-figure figcaption, .section-header p, .pricing-why p';

  var MIN_LINES = 3;      /* two lines have no shape worth making */
  var DROP_PER_LINE = 0.09;  /* each line aims this much narrower than the one above */
  var MAX_DROP = 0.28;    /* ...but the last line never aims below this much off the first */
  var MIN_WORDS = 8;
  var TOLERANCE = 6;      /* px a line may exceed the one above before it counts */

  /* A wedge is a shape, and past a certain height it stops reading as one. Eight or
     nine centered lines is not a taper any more, it is a wall with a slope on it, and
     the reader meets it as bulk before they read a word of it. The measure that suits
     a three-line lede is the wrong measure for an eighty-word paragraph: the same
     780px that makes a short block elegant is what makes a long one nine lines deep.
     So a block that overruns is allowed a wider column before its breaks are cut, up
     to whatever room its parent actually has.

     Only ever wider, and only for blocks that overrun: a short lede keeps the measure
     it was designed at, because widening one buys nothing and costs the line it was
     meant to fall on. The ceiling exists because the fix has an opposite failure. Past
     about 1040px a line is long enough that finding the start of the next one is work,
     which is the same complaint as the wall, arriving from the other side. When both
     limits bind at once (a very long block in a narrow container) the block stays too
     tall, and that is the honest outcome: the answer to those is fewer words, and this
     is not the place that can supply them. */
  var COMFORT_LINES = 6;   /* beyond this the shape stops doing its job */
  var WIDEN_CEILING = 1040;   /* px: past here the line is too long to track back from */
  var WIDEN_STEP = 60;     /* px per try, so the block widens no further than it needs */
  var WIDEN_TRIES = 8;

  /* Width of a range, summed across its rects: a range that already spans a browser
     line break reports one union box the width of the column, which would read as
     "this fits" for text that does not. Summing the pieces gives the real width.

     Only safe for a range inside a single text node, which is what it is used for.
     See spanWidth below for why it is wrong for anything longer. */
  function widthOf(range) {
    var rects = range.getClientRects(), total = 0;
    for (var i = 0; i < rects.length; i++) total += rects[i].width;
    return total;
  }

  /* Width of a range that is known to sit on one line, taken as the union of its rects
     rather than the sum of them.

     Summing is wrong here, and wrong by a lot. `getClientRects` on a range reports a
     rect for every element and every text node it touches, so an inline element the
     range *fully* contains is reported twice: once as the element box, once as the text
     inside it. A link the range has passed over is therefore counted twice and the
     running total jumps by the width of the link, at exactly the word where the range
     finishes swallowing it.

     That is not a rounding error. On the compare index, a paragraph carrying one
     "See where it stands" link had every position after the link overstated by 188px,
     so the wedge believed its second line was 575px when the browser was drawing 383,
     planned a ladder around the wrong number, and produced 515 / 383 / 541: a line
     shorter than the one under it, which is the one shape this whole routine exists to
     prevent. The fine that is supposed to stop a step never fired, because by the
     model's own numbers there was no step.

     A union cannot double-count, because a rect that is already inside the box does not
     move its edges. It is exact here for the reason the caller sets `white-space:
     nowrap` first: one line, so the union is the line. */
  function spanWidth(range) {
    var rects = range.getClientRects(), l = Infinity, r = -Infinity, i;
    for (i = 0; i < rects.length; i++) {
      if (rects[i].width <= 1) continue;
      if (rects[i].left < l) l = rects[i].left;
      if (rects[i].right > r) r = rects[i].right;
    }
    return r > l ? r - l : 0;
  }

  /* Rects that share a line, grouped.

     By centre, with a tolerance taken from the line height, and both halves of that
     were bought the hard way. Grouping by top edge with a flat 4px tolerance is what
     this did, and a raised superscript does not share a top with the text beside it:
     the numbered citation markers on the comparison pages were each counted as a line
     of their own. A paragraph with two of them measured seven lines when it was
     drawing five, so the wedge planned a seven-line shape, and the browser drew the
     extra two. That is the "wall of text" on those pages, and it was a measuring bug
     wearing a typography bug's clothes.

     A centre is the robust thing to compare because vertical-align moves the box and
     leaves the centre near enough where it was, and half a line height is the right
     tolerance because that is precisely the distance at which two rects stop being
     able to be on the same line. */
  function lineTolerance(el) {
    var cs = window.getComputedStyle(el);
    var lh = parseFloat(cs.lineHeight);
    if (!(lh > 0)) lh = parseFloat(cs.fontSize) * 1.5;
    return Math.max(4, lh * 0.45);
  }

  function lineTops(range, tol) {
    var rects = range.getClientRects(), tops = [], i, j, mid, seen;
    for (i = 0; i < rects.length; i++) {
      if (rects[i].width <= 1) continue;
      mid = rects[i].top + rects[i].height / 2;
      seen = false;
      for (j = 0; j < tops.length; j++) if (Math.abs(tops[j] - mid) < tol) { seen = true; break; }
      if (!seen) tops.push(mid);
    }
    return tops;
  }

  /* How many lines the browser is actually drawing. Dividing the text width by the
     column is not the same number: greedy wrapping leaves a ragged gap at the end of
     every line, so a block that "fits" in two by arithmetic is routinely drawn in
     three, and treating it as two skips the block entirely. */
  function renderedLines(range, tol) {
    return lineTops(range, tol).length;
  }

  /* Text that is in the DOM for a screen reader and not on the screen.

     The numbered citations are links reading `<span class="sr-only">Source </span>3`,
     and .sr-only is the standard absolutely-positioned, clipped 1px box. Its text is
     real to a TreeWalker and invisible to a reader, which makes it the worst kind of
     word for this routine: it can be chosen as a break, and a <br> placed inside a
     clipped box breaks nothing. The model then believes it ended the line there, the
     browser carries the visible words on and greedy-wraps them somewhere else, and the
     line comes out at the full column width with the next one short to match. That is
     the 718 / 779 / 518 on the compare pages: not a bad choice of break, a break that
     was never made.

     Detected by geometry rather than by class name, because the class is a convention
     and the geometry is the actual property that matters: an element occupying a box
     of a pixel or less holds nothing a reader can see. getBoundingClientRect, not
     clientWidth, because clientWidth is zero for every ordinary inline element and
     would throw away every word inside a link. */
  function isHiddenText(node, root) {
    var p = node.parentNode, r;
    while (p && p !== root && p.nodeType === 1) {
      r = p.getBoundingClientRect();
      if (r.width <= 1 || r.height <= 1) return true;
      p = p.parentNode;
    }
    return false;
  }

  function textNodes(el) {
    var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false), out = [], n;
    while ((n = walker.nextNode())) {
      if (n.nodeValue.trim() && !isHiddenText(n, el)) out.push(n);
    }
    return out;
  }

  /* Every word as a (node, start, end) span, measured where it actually sits, so a
     word inside <strong> or <a> is measured in the weight it renders in. */
  function measureWords(el, range) {
    var nodes = textNodes(el), words = [];
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i], re = /\S+/g, m;
      while ((m = re.exec(node.nodeValue))) {
        range.setStart(node, m.index);
        range.setEnd(node, m.index + m[0].length);
        words.push({ node: node, start: m.index, end: m.index + m[0].length, w: widthOf(range) });
      }
    }
    return words;
  }

  function clearBreaks(el) {
    var brs = el.querySelectorAll('br[data-wedge]');
    for (var i = 0; i < brs.length; i++) brs[i].parentNode.removeChild(brs[i]);
    if (brs.length) el.normalize();
  }

  /* Widen an overrunning block until it sets in COMFORT_LINES or runs out of room.

     Measured rather than modelled, one step at a time, for the reason the rest of this
     file is: the number of lines a width produces is a fact about the font, the words
     and the browser, and every attempt to predict it here has been wrong by one. So
     this asks. Stepping up rather than jumping to the ceiling is what keeps a block
     that only needed 60px from taking 260 and reading as a different design.

     The parent's content box is the hard stop. Going past it does not widen the block,
     it overflows it, and a centered block that overflows is no longer centered. */
  function widen(el, range, lines, tol) {
    var parent = el.parentNode;
    if (!parent || parent.nodeType !== 1) return lines;
    var room = Math.min(WIDEN_CEILING, parent.clientWidth);
    var width = el.clientWidth;
    if (width >= room) return lines;

    /* Line count falls in steps, and the steps have plateaus: this block sets in seven
       lines anywhere from 780px to 900px and only reaches six at 960. So the search
       does not stop at the first width that bought nothing, which was the bug in the
       first version of this and cost the whole effect. It keeps going to the room it
       has, remembers the narrowest width that reached the best count, and settles
       there, so a block takes the width it needed and not the width it was offered. */
    var start = width, best = lines, bestWidth = width;
    for (var t = 0; t < WIDEN_TRIES; t++) {
      width = Math.min(room, width + WIDEN_STEP);
      el.style.maxWidth = width + 'px';
      var now = renderedLines(range, tol);
      if (now < best) { best = now; bestWidth = width; }
      if (best <= COMFORT_LINES || width >= room) break;
    }
    if (bestWidth === start) { el.style.maxWidth = ''; return lines; }
    el.style.maxWidth = bestWidth + 'px';
    return best;
  }

  function shape(el) {
    clearBreaks(el);
    /* Last pass's widening is not this pass's answer. A resize changes what the parent
       has to give, so the block goes back to its designed measure and earns it again. */
    el.style.maxWidth = '';

    var colWidth = el.clientWidth;
    if (!colWidth) return;                       /* hidden, or not laid out yet */
    /* Somebody already decided where this one breaks. The footer tagline and the
       hero micro-note are set by hand; re-flowing them around their own <br> gives
       a shape neither of us asked for. */
    if (el.getElementsByTagName('br').length) return;

    var range = document.createRange();
    var probe = measureWords(el, range);
    if (probe.length < MIN_WORDS) return;

    range.setStart(probe[0].node, probe[0].start);
    range.setEnd(probe[probe.length - 1].node, probe[probe.length - 1].end);
    var tol = lineTolerance(el);
    var lines = renderedLines(range, tol);
    if (lines < MIN_LINES) return;

    /* Before any breaks are chosen, because the wedge is cut to fit the column and a
       column that is about to change is the wrong one to cut against. */
    if (lines > COMFORT_LINES) {
      lines = widen(el, range, lines, tol);
      colWidth = el.clientWidth;
      if (!colWidth) return;
    }

    /* Everything from here is measured with wrapping switched off. A range that spans a
       line break reports its pieces, and the pieces are short: each break eats the space
       that would have sat between them, and the sum comes in under the true single-line
       width by a few pixels per line. Those pixels are why a segment computed to fit the
       column arrives a word too long and gets wrapped again by the browser, which is the
       stray 87px line in a narrow column. With nowrap every span is one box and the
       numbers are the real ones. The element overflows while this runs; nothing paints
       between here and the restore. */
    /* Everything from here is measured with wrapping switched off. A range that spans a
       line break reports its pieces, and the pieces are short: each break eats the space
       that would have sat between them, so the sum comes in under the true single-line
       width by a few pixels per line. Those pixels are why a segment computed to fit the
       column arrives a word too long and gets wrapped again by the browser, which is the
       stray 87px line in a narrow column. With nowrap every span is one box and the
       numbers are the real ones. The element overflows while this runs; nothing paints
       between here and the restore.

       Each position is measured from the first word rather than summed from word widths
       plus an average space: a lede that opens bold and finishes regular has two space
       widths and two sets of letterfit, and a reconstructed total drifts against the
       real one. */
    var restoreWhiteSpace = el.style.whiteSpace;
    el.style.whiteSpace = 'nowrap';
    var words = measureWords(el, range);
    var cumulative = [];
    for (var j = 0; j < words.length; j++) {
      range.setStart(words[0].node, words[0].start);
      range.setEnd(words[j].node, words[j].end);
      cumulative.push(spanWidth(range));
    }
    el.style.whiteSpace = restoreWhiteSpace;

    var textWidth = cumulative[cumulative.length - 1];
    if (!textWidth) return;

    /* The plan below is a model of how the text will set, and a model is not the page.
       It is applied, then checked against what the browser actually drew, and if a
       segment was re-wrapped the whole plan was built for the wrong line count: try
       again with one more line rather than keep a plan that was never right. */
    var first, stepDown, breakBefore;
    var planned = lines;
    for (var attempt = 0; attempt < 3; attempt++) {
      lines = planned + attempt;
      if (layout()) break;
    }
    return;

    function layout() {
      var drop, guard = 0;
      do {
        drop = Math.min(MAX_DROP, DROP_PER_LINE * (lines - 1)) * colWidth;
        first = textWidth / lines + drop / 2;
        if (first <= colWidth) break;
        lines++;
      } while (guard++ < 12);
      stepDown = drop / Math.max(1, lines - 1);

      /* Choose all the breaks together, not one after another. Filling each line to its
         own target is a local decision, and local decisions paint themselves into
         corners: the break that best suits line two can leave line three a choice
         between far too long and far too short, and nothing later can reach back past
         a break already taken. So this scores every legal set of breaks and keeps the
         cheapest, where a line costs the square of its distance from the ladder plus a
         heavy fine for coming out wider than the line above it.

         The fine is measured against the line above as it actually falls, not against
         what the ladder wanted it to be. Comparing against the target is what let the
         bumps through: a line landing well under its own target leaves room for the
         next one to be wider than it and still sit under the ceiling, and the wedge
         has a step in it. Carrying the real width makes the state "where the line
         above started, and where this one starts", which is why the table is indexed
         by two word positions per line.

         It stays small: a line cannot exceed the column, so each has a handful of
         legal endings, and there are never many lines. */
      var n = words.length;
      var INF = Infinity;
      var N1 = n + 1;
      var layer = N1 * N1;
      var cost = new Float64Array((lines + 1) * layer);
      var pick = new Int32Array((lines + 1) * layer);
      var li, prevStart, lineStart, endAt, w, prevW, c, bestC, bestJ, idx, rest, off;

      /* Past the last line the only acceptable state is having spent every word. */
      for (prevStart = 0; prevStart <= n; prevStart++) {
        for (lineStart = 0; lineStart <= n; lineStart++) {
          cost[lines * layer + prevStart * N1 + lineStart] = (lineStart === n) ? 0 : INF;
        }
      }

      for (li = lines - 1; li >= 0; li--) {
        var target = Math.min(colWidth, first - stepDown * li);
        for (prevStart = 0; prevStart <= n; prevStart++) {
          for (lineStart = 0; lineStart <= n; lineStart++) {
            idx = li * layer + prevStart * N1 + lineStart;
            if (lineStart >= n) { cost[idx] = INF; pick[idx] = -1; continue; }
            prevW = (li === 0) ? INF : span(lineStart - 1) - (prevStart ? span(prevStart - 1) : 0);
            bestC = INF; bestJ = -1;
            for (endAt = lineStart; endAt < n; endAt++) {
              w = span(endAt) - (lineStart ? span(lineStart - 1) : 0);
              if (w > colWidth && endAt > lineStart) break;
              rest = cost[(li + 1) * layer + lineStart * N1 + (endAt + 1)];
              if (rest === INF) continue;
              off = w - target;
              c = off * off + rest;
              if (w > prevW + TOLERANCE) c += 1e7;
              if (c < bestC) { bestC = c; bestJ = endAt; }
            }
            cost[idx] = bestC;
            pick[idx] = bestJ;
          }
        }
      }

      breakBefore = [];
      var at = 0, prevAt = 0;
      for (li = 0; li < lines && at < n; li++) {
        var chosen = pick[li * layer + prevAt * N1 + at];
        if (chosen < at) break;
        prevAt = at;
        at = chosen + 1;
        if (at < n) breakBefore.push(at);
      }

      applyBreaks(el, words, breakBefore);
      return lineWidths(el).length === breakBefore.length + 1;
    }

    function span(b) { return cumulative[b]; }
  }

  /* Rendered width of each line box. Rects are grouped by top with a tolerance because
     a bold run and a regular run on the same line do not share a top to the pixel. */
  function lineWidths(el) {
    var range = document.createRange();
    range.selectNodeContents(el);
    var tol = lineTolerance(el);
    var rects = range.getClientRects(), groups = [], i, j, g, mid;
    for (i = 0; i < rects.length; i++) {
      if (rects[i].width <= 1) continue;
      mid = rects[i].top + rects[i].height / 2;
      g = null;
      for (j = 0; j < groups.length; j++) {
        if (Math.abs(groups[j].top - mid) < tol) { g = groups[j]; break; }
      }
      if (g) { g.l = Math.min(g.l, rects[i].left); g.r = Math.max(g.r, rects[i].right); }
      else groups.push({ top: mid, l: rects[i].left, r: rects[i].right });
    }
    groups.sort(function (a, b) { return a.top - b.top; });
    return groups.map(function (v) { return v.r - v.l; });
  }

  /* Word positions are (node, offset) pairs, and splitting a node invalidates every
     offset after the split, so breaks go in back to front. */
  function applyBreaks(el, words, breakBefore) {
    clearBreaks(el);
    for (var k = breakBefore.length - 1; k >= 0; k--) {
      var word = words[breakBefore[k]];
      if (!word || !word.node.parentNode) continue;
      var tail = word.node.splitText(word.start);
      var br = document.createElement('br');
      br.setAttribute('data-wedge', '');
      tail.parentNode.insertBefore(br, tail);
    }
  }

  function shapeAll() {
    var els = document.querySelectorAll(SEL);
    for (var i = 0; i < els.length; i++) shape(els[i]);
  }

  var lastWidth = window.innerWidth, timer;
  function onResize() {
    if (window.innerWidth === lastWidth) return;   /* mobile scroll fires resize */
    lastWidth = window.innerWidth;
    clearTimeout(timer);
    timer = setTimeout(shapeAll, 150);
  }

  function start() {
    shapeAll();
    /* Web fonts land after first paint and change every measurement. */
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(shapeAll);
    window.addEventListener('resize', onResize);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
