/* Archie Docs (docs/, written by scripts/gen-docs.mjs): search, copy buttons, the "On this page"
   highlight, and the filters on Every feature. Every page reads in full without this file: the
   search box and the Copy buttons are hidden until it runs, and the filters show everything. */
(function () {
  "use strict";

  /* ---------- search ---------- */
  var input = document.getElementById("dx-q");
  if (input) {
    var box = document.getElementById("dx-hits");
    var count = box.querySelector(".dx-hits-n");
    var list = box.querySelector("ul");
    var root = input.getAttribute("data-root");
    var entries = null;
    var loading = null;

    function load() {
      if (!loading) {
        loading = fetch(input.getAttribute("data-index"))
          .then(function (r) { return r.json(); })
          .then(function (d) {
            entries = d.entries.map(function (e) {
              e.lt = e.t.toLowerCase(); e.lh = e.h.toLowerCase();
              e.ls = e.s.toLowerCase(); e.lx = e.x.toLowerCase();
              return e;
            });
          })
          .catch(function () { entries = []; });
      }
      return loading;
    }

    /* Every word typed has to appear somewhere; a word in the title counts most. */
    function score(e, terms) {
      var total = 0;
      for (var i = 0; i < terms.length; i++) {
        var w = terms[i], s = 0;
        if (e.lt.indexOf(w) >= 0) s += e.lt.indexOf(w) === 0 ? 12 : 8;
        if (e.lh.indexOf(w) >= 0) s += 4;
        if (e.ls.indexOf(w) >= 0) s += 3;
        if (e.lx.indexOf(w) >= 0) s += 1;
        if (!s) return 0;
        total += s;
      }
      return total;
    }

    function close() {
      box.hidden = true;
      input.setAttribute("aria-expanded", "false");
    }

    function show() {
      var q = input.value.trim().toLowerCase();
      if (!q) { close(); return; }
      var terms = q.split(/\s+/).filter(function (w) { return w.length > 1 || q.length === 1; });
      var hits = entries
        .map(function (e) { return { e: e, s: score(e, terms) }; })
        .filter(function (h) { return h.s > 0; })
        .sort(function (a, b) { return b.s - a.s; })
        .slice(0, 8);
      list.textContent = "";
      hits.forEach(function (h) {
        var li = document.createElement("li");
        var a = document.createElement("a");
        a.href = root + h.e.u;
        [["dx-hit-k", h.e.k], ["dx-hit-t", h.e.t], ["dx-hit-s", h.e.s]].forEach(function (p) {
          var span = document.createElement("span");
          span.className = p[0];
          span.textContent = p[1];
          a.appendChild(span);
        });
        li.appendChild(a);
        list.appendChild(li);
      });
      count.textContent = hits.length
        ? (hits.length === 1 ? "1 match" : hits.length + " matches")
        : "Nothing matches “" + input.value.trim() + "”. Try one word, such as email or Telegram.";
      box.hidden = false;
      input.setAttribute("aria-expanded", "true");
    }

    input.addEventListener("focus", load);
    input.addEventListener("input", function () { load().then(show); });
    input.addEventListener("keydown", function (ev) {
      if (ev.key === "ArrowDown") {
        var first = list.querySelector("a");
        if (first) { ev.preventDefault(); first.focus(); }
      } else if (ev.key === "Escape") {
        close();
      } else if (ev.key === "Enter") {
        var top = list.querySelector("a");
        if (top && !box.hidden) { ev.preventDefault(); top.click(); }
      }
    });
    box.addEventListener("keydown", function (ev) {
      var links = Array.prototype.slice.call(list.querySelectorAll("a"));
      var i = links.indexOf(document.activeElement);
      if (ev.key === "ArrowDown" && i < links.length - 1) { ev.preventDefault(); links[i + 1].focus(); }
      else if (ev.key === "ArrowUp") { ev.preventDefault(); (i > 0 ? links[i - 1] : input).focus(); }
      else if (ev.key === "Escape") { close(); input.focus(); }
    });
    document.addEventListener("click", function (ev) {
      if (!box.hidden && !box.contains(ev.target) && ev.target !== input) close();
    });
    /* "/" anywhere on the page goes to the search box, unless somebody is typing. */
    document.addEventListener("keydown", function (ev) {
      if (ev.key !== "/" || ev.metaKey || ev.ctrlKey || ev.altKey) return;
      var t = ev.target;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      ev.preventDefault();
      input.focus();
    });
  }

  /* ---------- copy ---------- */
  document.addEventListener("click", function (ev) {
    var b = ev.target.closest && ev.target.closest(".dx-copy-b");
    if (!b || !navigator.clipboard) return;
    navigator.clipboard.writeText(b.getAttribute("data-copy")).then(function () {
      b.textContent = "Copied";
      setTimeout(function () { b.textContent = "Copy"; }, 1600);
    }, function () {
      b.textContent = "Select it and copy";
    });
  });

  /* ---------- on this page ---------- */
  var tocLinks = Array.prototype.slice.call(document.querySelectorAll(".dx-toc a"));
  if (tocLinks.length && "IntersectionObserver" in window) {
    var byId = {};
    tocLinks.forEach(function (a) { byId[a.getAttribute("href").slice(1)] = a; });
    var visible = {};
    var mark = function () {
      var ids = Object.keys(byId);
      var current = null;
      for (var i = 0; i < ids.length; i++) if (visible[ids[i]]) { current = ids[i]; break; }
      if (!current) return;
      tocLinks.forEach(function (a) { a.removeAttribute("aria-current"); });
      byId[current].setAttribute("aria-current", "true");
    };
    var io = new IntersectionObserver(function (seen) {
      seen.forEach(function (s) { visible[s.target.id] = s.isIntersecting; });
      mark();
    }, { rootMargin: "-80px 0px -55% 0px" });
    Object.keys(byId).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) io.observe(el);
    });
  }

  /* ---------- every feature ---------- */
  var form = document.querySelector("[data-filter]");
  if (form) {
    var area = document.getElementById("dx-f-area");
    var phone = document.getElementById("dx-f-phone");
    var ed = document.getElementById("dx-f-ed");
    var out = form.querySelector("output");
    var groups = Array.prototype.slice.call(document.querySelectorAll(".dx-all-g"));
    var apply = function () {
      var n = 0;
      groups.forEach(function (g) {
        var shown = 0;
        Array.prototype.forEach.call(g.querySelectorAll("li[data-area]"), function (li) {
          var e = li.getAttribute("data-editions");
          var ok = (!area.value || li.getAttribute("data-area") === area.value) &&
            (!phone.checked || li.getAttribute("data-phone") === "yes") &&
            (!ed.value || (ed.value === "teams" ? e !== "individual" : e !== "teams"));
          li.hidden = !ok;
          if (ok) shown++;
        });
        g.hidden = !shown;
        n += shown;
      });
      out.textContent = n === 1 ? "1 feature" : n + " features";
    };
    form.addEventListener("change", apply);
    form.addEventListener("submit", function (ev) { ev.preventDefault(); });
  }
})();
