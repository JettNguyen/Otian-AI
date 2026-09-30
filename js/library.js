/* The Learning Library's player (learn/<slug>/, written by scripts/gen-library.mjs).
 *
 * Nothing reaches YouTube until the reader presses play (TRUST.md, the video library). The page
 * ships our own poster inside a plain link to the video on youtube.com; this swaps that link for
 * the youtube-nocookie player on the press and starts it. Without this script the link still goes
 * to YouTube, which is the reader's choice either way.
 */
(function () {
  "use strict";
  document.querySelectorAll(".lib-play[data-yt]").forEach(function (link) {
    link.addEventListener("click", function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return; // a new tab is theirs to open
      e.preventDefault();
      var frame = document.createElement("iframe");
      frame.className = "lib-frame";
      frame.src = "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(link.dataset.yt) + "?autoplay=1&rel=0&playsinline=1";
      frame.title = "Video: " + link.dataset.title;
      frame.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
      frame.allowFullscreen = true;
      link.replaceWith(frame);
      frame.focus();
    });
  });
})();
