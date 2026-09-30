/* The Learning Library's player (learn/<slug>/, written by scripts/gen-library.mjs).
 *
 * Nothing reaches YouTube until the reader presses play (TRUST.md, the video library). The page
 * ships our own poster inside a plain link to the video on youtube.com; this swaps that link for
 * the youtube-nocookie player on the press and starts it. Without this script the link still goes
 * to YouTube, which is the reader's choice either way.
 *
 * Once it is playing, a reader who scrolls down to the notes keeps the video: it docks in the
 * corner (across the bottom on a phone) until they scroll back up to it, press Back to the video,
 * or press Close, which pauses it and puts it back in its place for good (Jett, 2026-09-30). Only
 * the style moves, never the frame, because a frame moved in the page reloads and starts over.
 */
(function () {
  "use strict";
  var DOCK_BELOW = 0.4; // dock once less than this much of the player's place is on screen

  document.querySelectorAll(".lib-play[data-yt]").forEach(function (link) {
    link.addEventListener("click", function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return; // a new tab is theirs to open
      e.preventDefault();
      var frame = document.createElement("iframe");
      frame.className = "lib-frame";
      // enablejsapi lets Close pause it by message; it loads nothing more than the player already does.
      frame.src = "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(link.dataset.yt) + "?autoplay=1&rel=0&playsinline=1&enablejsapi=1";
      frame.title = "Video: " + link.dataset.title;
      frame.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
      frame.allowFullscreen = true;
      link.replaceWith(frame);
      frame.focus();
      dockWhenScrolledPast(frame);
    });
  });

  function dockWhenScrolledPast(frame) {
    var screen = frame.closest(".lib-screen");
    var slot = frame.closest(".lib-slot");
    if (!screen || !slot || !("IntersectionObserver" in window)) return;

    var bar = document.createElement("div");
    bar.className = "lib-dock-bar";
    bar.hidden = true;
    bar.innerHTML = '<button type="button" data-act="back">Back to the video</button>' +
      '<button type="button" data-act="close" aria-label="Close the small player and pause the video">Close</button>';
    screen.appendChild(bar);

    var dock = function (on) {
      screen.classList.toggle("is-docked", on);
      bar.hidden = !on;
    };

    // The fixed bar covers the top of the window, so the player counts as gone once it is under it.
    var nav = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--nav-height"), 10) || 0;
    var watch = new IntersectionObserver(function (entries) {
      var e = entries[entries.length - 1];
      var top = e.rootBounds ? e.rootBounds.top : nav;
      // Only when the reader has scrolled down past it, never while it is still below them.
      dock(e.intersectionRatio < DOCK_BELOW && e.boundingClientRect.top < top);
    }, { rootMargin: "-" + nav + "px 0px 0px 0px", threshold: [0, DOCK_BELOW, 1] });
    watch.observe(slot);

    bar.addEventListener("click", function (ev) {
      var b = ev.target.closest("button");
      if (!b) return;
      if (b.dataset.act === "back") {
        slot.scrollIntoView({ block: "center" });
        return;
      }
      watch.disconnect();
      dock(false);
      try {
        frame.contentWindow.postMessage(JSON.stringify({ event: "command", func: "pauseVideo", args: "" }), "https://www.youtube-nocookie.com");
      } catch (err) { /* it stays playing in its place, which is where Close puts it anyway */ }
    });
  }
})();
