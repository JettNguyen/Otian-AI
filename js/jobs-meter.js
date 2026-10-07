/* The "your day" meter on archie/pricing/, in the "What $30 a month adds" section.

   The reader switches on what they would hand their agent and sees where one day lands against the
   free tier's two lines: background work (emails and routines) stops at 15, everything stops at 20.
   The counting is the app's own: a reply to you is a job, a routine running is a job, an email the
   agent reacts to is a job (archie-domain/src/allowance.rs, FREE_JOBS_A_DAY and
   FREE_JOBS_KEPT_FOR_YOU). If either number moves there, it moves here and in FACTS.md.

   The markup carries a complete resting state (the default choices and their sentence), so a reader
   without JavaScript, and every crawler, sees a true answer. This only redraws it on change. */
(function () {
  "use strict";

  var DAY = 20;        // FREE_JOBS_A_DAY
  var UNATTENDED = 15; // FREE_JOBS_A_DAY - FREE_JOBS_KEPT_FOR_YOU
  var SCALE = 60;      // the bar's right edge, in jobs

  function pct(n) {
    return Math.min(100, (n / SCALE) * 100).toFixed(2) + "%";
  }

  function picked(meter, name) {
    var input = meter.querySelector('input[name="' + name + '"]:checked');
    return input ? Number(input.value) : 0;
  }

  function sentence(total, background) {
    var lead = "About " + total + " jobs a day.";
    if (background > UNATTENDED) {
      return [lead, "On the free tier, email and routines would stop at 15 for the rest of the day."];
    }
    if (total > DAY) {
      return [lead, "On the free tier, the day would end at 20."];
    }
    return [lead, "That fits the free tier."];
  }

  function draw(meter) {
    var asks = picked(meter, "jm-asks");
    var mail = picked(meter, "jm-mail");
    var routines = meter.querySelectorAll('input[name="jm-routine"]:checked').length;
    var background = mail + routines;
    var total = asks + background;

    meter.querySelector(".jm-fill--bg").style.width = pct(background);
    meter.querySelector(".jm-fill--you").style.width = pct(asks);
    meter.classList.toggle("jm--over", total > DAY || background > UNATTENDED);

    var words = sentence(total, background);
    var out = meter.querySelector(".jm-out");
    out.querySelector("b").textContent = words[0];
    out.querySelector("span").textContent = " " + words[1];
  }

  document.querySelectorAll("[data-jobs-meter]").forEach(function (meter) {
    meter.addEventListener("change", function () { draw(meter); });
    draw(meter);
  });
})();
