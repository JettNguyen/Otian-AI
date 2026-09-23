/* Demo player: the Archie recording plays by itself, silently, on a loop.
 *
 * Four things this has to get right, none of which a bare `autoplay loop` attribute does:
 *
 *  0. Send the right encode. The same recording ships as AV1, HEVC and H.264 at two widths, and
 *     the choice is made on decode COST, not just codec support (see pickSource below). This is
 *     the difference between a hero that idles at nothing and one that pins a core on an old
 *     laptop.
 *
 *  1. Don't fetch megabytes until they're wanted. Neither the <video> nor its <source>s carry a
 *     real src, only data-src, so the browser fetches nothing but the poster until an
 *     IntersectionObserver says the figure is actually on screen. Someone who bounces never pays.
 *
 *  2. Don't play to an empty room. Playback pauses when the figure scrolls away and resumes
 *     when it comes back, so we're not decoding video into a viewport nobody is looking at,
 *     which on a laptop is just battery, quietly.
 *
 *  3. Respect prefers-reduced-motion. Anyone who has asked the OS for less movement gets the
 *     poster and a play button, and the video is only fetched if they ask for it. Autoplaying
 *     at them would be exactly the thing they turned off.
 *
 * The visible control is a pause toggle, not player chrome: WCAG 2.2.2 requires a way to stop
 * motion that starts on its own and runs past five seconds, and this runs for a minute.
 */
(function () {
  var players = document.querySelectorAll('.demo-player');
  if (!players.length) return;

  var reduceMotion =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Which of the encodes does this machine actually want? ──
   *
   * The markup offers the same recording as AV1, HEVC and H.264, at two widths. Picking with a
   * plain <source> list would be wrong, because the browser only asks "can I decode this?", and
   * the answer is yes far more often than it should be. A 2019 laptop will cheerfully claim it
   * supports AV1 and then software-decode 2560px of it, burning a core to do it. "Supported" and
   * "free to play" are different questions.
   *
   * MediaCapabilities answers the second one: powerEfficient means there is a hardware decoder
   * behind it. So we take the best candidate that is hardware-decoded and skip anything that
   * would be decoded in software, which is how a machine that can't do AV1 in hardware quietly
   * ends up on the HEVC or H.264 line instead of stuttering through the pretty one.
   *
   * If nothing is hardware-decoded, we take the LAST candidate rather than the first: the list is
   * ordered best-quality-first, and the last one is H.264, which is the cheapest thing to grind
   * out in software.
   *
   * Browsers too old to have MediaCapabilities are also too old to have AV1 (it shipped in Chrome
   * 70; MediaCapabilities in 66), so canPlayType alone is safe for them: they cannot pick the
   * expensive option even if we let them.
   */
  function currentTheme() {
    return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }

  function pickSource(video, theme) {
    var sources = Array.prototype.slice.call(video.querySelectorAll('source[data-src]'));

    // Older markup (and anything with a single encode) still just carries data-src on the video.
    if (!sources.length) return Promise.resolve(video.getAttribute('data-src'));

    var matching = sources.filter(function (s) {
      // The recording exists in a light build and a dark build; the app itself is themed, so a
      // light screenshot on a dark page would look like a bug. A source with no data-theme is
      // theme-agnostic and always eligible.
      var forTheme = s.getAttribute('data-theme');
      if (forTheme && forTheme !== theme) return false;

      var q = s.getAttribute('media');
      return !q || !window.matchMedia || window.matchMedia(q).matches;
    });
    if (!matching.length) matching = sources;

    var playable = matching.filter(function (s) {
      return video.canPlayType(s.getAttribute('type')) !== '';
    });
    if (!playable.length) return Promise.resolve(null);

    var mc = navigator.mediaCapabilities;
    if (!mc || !mc.decodingInfo) {
      return Promise.resolve(playable[0].getAttribute('data-src'));
    }

    var checks = playable.map(function (s) {
      return mc
        .decodingInfo({
          type: 'file',
          video: {
            contentType: s.getAttribute('type'),
            width: parseInt(s.getAttribute('data-w'), 10),
            height: parseInt(s.getAttribute('data-h'), 10),
            bitrate: 2000000,
            // Per-source, because the tiers no longer share a frame rate: the AV1 and HEVC
            // builds are 60fps and the H.264 fallback is 30. Asking about the wrong one is
            // asking the wrong question, and 60 is twice the decode work of 30, which is
            // exactly the difference this whole check exists to catch.
            framerate: parseInt(s.getAttribute('data-fps'), 10) || 30
          }
        })
        .catch(function () {
          return { supported: false };
        });
    });

    return Promise.all(checks).then(function (infos) {
      for (var i = 0; i < infos.length; i++) {
        if (infos[i].supported && infos[i].smooth && infos[i].powerEfficient) {
          return playable[i].getAttribute('data-src');
        }
      }
      return playable[playable.length - 1].getAttribute('data-src');
    });
  }

  Array.prototype.forEach.call(players, function (player) {
    var video = player.querySelector('video');
    var toggle = player.querySelector('.demo-player-toggle');
    if (!video) return;

    var chosen = null; // resolves once per theme
    var chosenTheme = null;
    var loaded = false;
    // Set when the visitor pauses by hand, so scrolling away and back doesn't override them and
    // start it up again; the one thing more annoying than autoplay is autoplay you can't stop.
    var pausedByUser = false;

    // The poster is themed too, for the same reason the video is.
    function applyPoster(theme) {
      var p = video.getAttribute('data-poster-' + theme);
      if (p) video.setAttribute('poster', p);
    }
    applyPoster(currentTheme());

    // Choosing a source means asking the browser about its decoders, which is async, so load()
    // hands back a promise and everything downstream waits on it. It resolves once per theme;
    // later calls get the same promise back and no second fetch.
    function load() {
      if (!chosen) {
        chosenTheme = currentTheme();
        chosen = pickSource(video, chosenTheme).then(function (url) {
          if (url && !loaded) {
            loaded = true;
            video.src = url;
          }
        });
      }
      return chosen;
    }

    /* Flipping the theme swaps in the other build of the recording. The two are the same take,
       frame for frame, so we carry currentTime across: the picture recolours where it stands
       instead of jumping back to the beginning, which is what you'd get from a bare src swap. */
    function swapTheme() {
      var theme = currentTheme();
      if (theme === chosenTheme) return;
      chosenTheme = theme;
      applyPoster(theme);

      // Nothing has been fetched yet; whenever load() does run, it will read the new theme.
      if (!loaded) {
        chosen = null;
        return;
      }

      var at = video.currentTime;
      var wasPlaying = !video.paused;

      chosen = pickSource(video, theme).then(function (url) {
        if (!url) return;
        video.addEventListener('loadedmetadata', function once() {
          video.removeEventListener('loadedmetadata', once);
          try {
            video.currentTime = at;
          } catch (e) {
            /* seek refused; it will just start from the top */
          }
          if (wasPlaying && !pausedByUser) {
            var r = video.play();
            if (r && typeof r.catch === 'function') r.catch(function () {});
          }
        });
        // The <video> ships preload="none", so simply pointing src at the new build fires
        // loadstart and then waits: nothing is fetched until something asks to play, and the
        // seek-and-resume above is gated behind loadedmetadata, which would never arrive. Lifting
        // preload makes the browser pull the metadata on its own, so the swap completes even for a
        // player that is currently paused. We have already fetched one build by now, so this isn't
        // spending bytes we were trying to save.
        video.preload = 'auto';
        video.src = url;
      });
    }

    if (window.MutationObserver) {
      new MutationObserver(swapTheme).observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme']
      });
    }

    function play() {
      if (pausedByUser) return;
      load().then(function () {
        // They may have hit pause while we were still deciding.
        if (pausedByUser) return;
        var started = video.play();
        if (started && typeof started.catch === 'function') {
          // Autoplay can still be refused (a data-saver setting, an aggressive browser policy).
          // Fall back to the paused state rather than pretending it's playing.
          started.catch(function () {
            player.classList.add('is-paused');
            if (toggle) toggle.setAttribute('aria-label', 'Play the demo');
          });
        }
      });
    }

    if (toggle) {
      toggle.addEventListener('click', function () {
        if (video.paused) {
          pausedByUser = false;
          play();
          player.classList.remove('is-paused');
          toggle.setAttribute('aria-label', 'Pause the demo');
        } else {
          pausedByUser = true;
          video.pause();
          player.classList.add('is-paused');
          toggle.setAttribute('aria-label', 'Play the demo');
        }
      });
    }

    /* The rail. A track under the frame, filled to the playhead, and a real scrubber: press
       anywhere along it, drag it, or reach it with Tab and move with the arrow keys.

       It used to be built inside the chapters block below, which had two costs. The install page
       has no chapter list, so it had no way to move through two and a half minutes at all, and the
       page that did have one could only press, never drag and never from the keyboard.

       Seeking a <video> that ships preload="none" is two steps, not one: the file has to be
       fetched before there is anything to seek in. So every seek in this file goes through
       seekTo, which loads if it has to, waits for the metadata if it has to, and only then sets
       the time. */
    var rail = player.querySelector('.demo-player-rail');
    var ticks = [];
    var scrubbing = false;

    function railDuration() {
      return video.duration || parseFloat(rail && rail.getAttribute('data-duration')) || 0;
    }

    function clock(t) {
      var m = Math.floor(t / 60);
      var s = Math.floor(t % 60);
      return m + ':' + (s < 10 ? '0' : '') + s;
    }

    function paint(t) {
      if (!rail) return;
      var d = railDuration();
      if (!d) return;
      rail.style.setProperty('--pos', Math.min(1, Math.max(0, t / d)));
      rail.setAttribute('aria-valuenow', Math.round(t));
      rail.setAttribute('aria-valuetext', clock(t) + ' of ' + clock(d));
    }

    /* `resume` is what the visitor was doing before the seek, not what we would prefer they do.
       Somebody who pressed pause and then dragged the rail is looking for a frame, and starting
       playback under them is the one thing they just said no to. A chapter button is the other
       case, because pressing one is an explicit ask to watch from there, and passes true. */
    function seekTo(t, resume) {
      var d = railDuration();
      if (d) t = Math.min(d - 0.05, Math.max(0, t));
      paint(t);
      if (resume) {
        pausedByUser = false;
        player.classList.remove('is-paused');
        if (toggle) toggle.setAttribute('aria-label', 'Pause the demo');
      }
      load().then(function () {
        var tries = 0;
        var go = function () {
          // A seek the browser cannot serve is not an error, it just does not happen: the time
          // clamps into whatever `seekable` covers, which is nothing at all when the file came
          // back as one 200 rather than in ranges, and the recording jumps to the start. So ask
          // first, and if there is nowhere to land yet, wait for more of the file and ask once
          // more before giving up.
          if (!video.seekable.length && tries < 3) {
            tries += 1;
            video.addEventListener('progress', function once() {
              video.removeEventListener('progress', once);
              go();
            });
            return;
          }
          try {
            video.currentTime = t;
          } catch (e) {
            /* not seekable yet; it plays from the top */
          }
        };
        if (video.readyState >= 1) {
          go();
        } else {
          // preload="none" fetches nothing until something asks, and a paused player never asks,
          // so loadedmetadata would never arrive and a seek made while paused would never land.
          video.preload = 'auto';
          video.addEventListener('loadedmetadata', function once() {
            video.removeEventListener('loadedmetadata', once);
            go();
          });
        }
        if (resume) {
          var r = video.play();
          if (r && typeof r.catch === 'function') r.catch(function () {});
        }
      });
    }

    if (rail) {
      // A slider, said out loud, so the keyboard and a screen reader get the same control the
      // mouse gets rather than a div that happens to respond to clicks.
      rail.setAttribute('role', 'slider');
      rail.setAttribute('tabindex', '0');
      rail.setAttribute('aria-label', 'Seek the demo');
      rail.setAttribute('aria-valuemin', '0');

      var measure = function () {
        var d = railDuration();
        if (d) rail.setAttribute('aria-valuemax', Math.round(d));
        paint(video.currentTime || 0);
      };
      measure();
      video.addEventListener('loadedmetadata', measure);

      var pointAt = function (e) {
        var d = railDuration();
        if (!d) return 0;
        var r = rail.getBoundingClientRect();
        return Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)) * d;
      };

      rail.addEventListener('pointerdown', function (e) {
        if (!railDuration()) return;
        scrubbing = true;
        rail.classList.add('is-scrubbing');
        // Capture, so a drag that wanders off the track keeps scrubbing instead of stopping
        // wherever the pointer crossed the edge.
        if (rail.setPointerCapture) rail.setPointerCapture(e.pointerId);
        seekTo(pointAt(e), !pausedByUser);
        // preventDefault stops the press selecting the page under it, and takes the focus with
        // it, so the focus is put back by hand: press once and the arrow keys work from there.
        // :focus-visible keeps the ring off for the mouse that just pressed it.
        e.preventDefault();
        rail.focus();
      });
      rail.addEventListener('pointermove', function (e) {
        if (scrubbing) seekTo(pointAt(e), false);
      });
      var release = function (e) {
        if (!scrubbing) return;
        scrubbing = false;
        rail.classList.remove('is-scrubbing');
        if (rail.releasePointerCapture && e.pointerId != null) {
          try {
            rail.releasePointerCapture(e.pointerId);
          } catch (err) {
            /* the capture was already given up */
          }
        }
      };
      rail.addEventListener('pointerup', release);
      rail.addEventListener('pointercancel', release);

      // Arrows five seconds, page keys fifteen, Home and End the two ends. These are the numbers
      // every video player uses, so nobody has to learn them here.
      rail.addEventListener('keydown', function (e) {
        var d = railDuration();
        if (!d) return;
        var t = video.currentTime || 0;
        var to = null;
        if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') to = t - 5;
        else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') to = t + 5;
        else if (e.key === 'PageDown') to = t - 15;
        else if (e.key === 'PageUp') to = t + 15;
        else if (e.key === 'Home') to = 0;
        // Not the last frame. The recording loops, so the frame after the last one is the first
        // one, and End landing there is Home with extra steps. A second and a half back is the
        // closing card, which is what somebody pressing End wants to see.
        else if (e.key === 'End') to = Math.max(0, d - 1.5);
        if (to === null) return;
        e.preventDefault();
        seekTo(to, !pausedByUser);
      });

      rail.hidden = false;
    }

    video.addEventListener('timeupdate', function () {
      // While a drag is down it owns the playhead. Without this the video's own time fights the
      // finger, and the handle snaps back on every frame the seek has not landed on yet.
      if (!scrubbing) paint(video.currentTime);
    });

    /* Chapters. A list elsewhere on the page can point at this player by the figure's id
       (data-chapters-for), with buttons carrying data-seek in seconds. Pressing one loads the
       recording if it has not been fetched yet, plays it, and seeks once the metadata is in.
       That is an explicit ask, so it goes ahead under reduced motion too. While the recording
       plays, the button and the step the playhead is in light up, so the list reads as the
       recording's own index. The buttons ship hidden and are revealed here, so a page with no
       script shows a list and never a button that does nothing. Each one also puts a tick on the
       rail above, which is the same index read as a shape rather than as a list. */
    var chapters = player.id
      ? document.querySelector('.chapters[data-chapters-for="' + player.id + '"]')
      : null;
    if (chapters) {
      var chips = Array.prototype.slice.call(chapters.querySelectorAll('.chapter-time[data-seek]'));
      Array.prototype.forEach.call(chapters.querySelectorAll('.chapter-times'), function (row) {
        row.hidden = false;
      });
      var placeTicks = function () {
        var d = railDuration();
        if (!d) return;
        ticks.forEach(function (tk) {
          tk.el.style.left = (Math.min(tk.at, d) / d) * 100 + '%';
        });
      };
      chips.forEach(function (chip) {
        chip.addEventListener('click', function () {
          seekTo(parseFloat(chip.getAttribute('data-seek')) || 0, true);
        });
      });
      if (rail) {
        chips.forEach(function (chip) {
          var b = document.createElement('b');
          b.title = chip.textContent.trim();
          rail.appendChild(b);
          ticks.push({ at: parseFloat(chip.getAttribute('data-seek')) || 0, el: b, chip: chip });
        });
        // Ticks are placed from data-duration until the real duration is in, so they are on
        // screen before anything is fetched, which under reduced motion is until someone presses
        // play.
        placeTicks();
        video.addEventListener('loadedmetadata', placeTicks);
      }
      video.addEventListener('timeupdate', function () {
        var t = video.currentTime;
        var on = null;
        for (var i = 0; i < chips.length; i++) {
          if (parseFloat(chips[i].getAttribute('data-seek')) <= t + 0.25) on = chips[i];
        }
        chips.forEach(function (c) {
          c.classList.toggle('is-on', c === on);
        });
        ticks.forEach(function (tk) {
          tk.el.classList.toggle('is-on', tk.chip === on);
        });
        Array.prototype.forEach.call(chapters.querySelectorAll('.chapter'), function (li) {
          li.classList.toggle('is-on', !!on && li.contains(on));
        });
      });
    }

    if (reduceMotion) {
      // Poster only. Nothing is fetched and nothing moves until they press play.
      player.classList.add('is-paused');
      if (toggle) toggle.setAttribute('aria-label', 'Play the demo');
      return;
    }

    if (!('IntersectionObserver' in window)) {
      play(); // Old browser: just play it. Better than a permanently blank frame.
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) play();
          else if (!video.paused) video.pause();
        });
      },
      // Start a little before it's actually on screen so it's already running by the time the
      // visitor's eye lands on it, rather than blinking to life underneath them.
      { rootMargin: '200px 0px', threshold: 0.01 }
    );
    observer.observe(player);
  });
})();
