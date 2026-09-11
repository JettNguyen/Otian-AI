/* ========================================
   Otian AI | FAQ finder
   js/faq-find.js

   A box above the questions that narrows the list as you type. Thirty-two questions in six
   groups is more than anyone reads top to bottom; most people arrive with one question and
   want the two or three that might be it.

   Progressive by construction. The box ships with the `hidden` attribute and this file is what
   reveals it, so without JavaScript there is no dead control on the page, just the list. Every
   answer stays in the page word for word: nothing here fetches, and the browser's own
   find-in-page still reaches text this box has hidden.

   A match is every word of the query appearing somewhere in the question or its answer, in
   any order. Fuzzy matching would be friendlier on a typo and worse on everything else: the
   reader typing "email" wants the questions that say email, not the ones that say "detail".
   ======================================== */

(function () {
  var box = document.querySelector("[data-faq-find]");
  var input = document.getElementById("faqFind");
  var count = document.getElementById("faqFindCount");
  var none = document.getElementById("faqFindNone");
  if (!box || !input || !count || !none) return;

  var groups = Array.prototype.slice.call(document.querySelectorAll(".faq-group"));
  var items = Array.prototype.slice.call(document.querySelectorAll(".accordion-item"));
  if (!items.length) return;

  /* The text each question is searched by: the question, the tag, and the whole answer, read
     from the rendered DOM so entities come out as characters. Built once. */
  var index = items.map(function (item) {
    return (item.textContent || "").replace(/\s+/g, " ").toLowerCase();
  });

  /* The jump links dim when their group is empty, so the map at the top of the page keeps
     telling the truth about what is below it. */
  var jumps = {};
  Array.prototype.forEach.call(document.querySelectorAll(".faq-jump a[href^='#']"), function (a) {
    jumps[a.getAttribute("href").slice(1)] = a;
  });

  var total = items.length;

  function apply() {
    var terms = input.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
    var shown = 0;
    var last = null;

    items.forEach(function (item, i) {
      var hit = terms.every(function (t) { return index[i].indexOf(t) !== -1; });
      item.classList.toggle("is-hidden", !hit);
      if (hit) { shown++; last = item; }
    });

    groups.forEach(function (g) {
      var any = g.querySelector(".accordion-item:not(.is-hidden)");
      g.classList.toggle("is-hidden", !any);
      var a = jumps[g.id];
      if (a) a.classList.toggle("is-empty", !any);
    });

    if (!terms.length) {
      count.textContent = "";
      none.hidden = true;
      return;
    }
    count.textContent = shown + " of " + total;
    none.hidden = shown !== 0;

    /* One left is the answer, so open it. The page's own accordion script handles the
       opening (and closes the others), which is why this is a click and not a class. */
    if (shown === 1 && last && !last.classList.contains("open")) {
      var trigger = last.querySelector(".accordion-trigger");
      if (trigger) trigger.click();
    }
  }

  var timer = 0;
  input.addEventListener("input", function () {
    clearTimeout(timer);
    timer = setTimeout(apply, 60);
  });
  input.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && input.value) {
      input.value = "";
      apply();
    }
  });
  /* The form exists so the box has a landmark; submitting it would reload the page. */
  box.addEventListener("submit", function (e) { e.preventDefault(); });

  box.hidden = false;
})();
