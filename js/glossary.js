/* ========================================
   Otian AI | Glossary Page
   js/glossary.js

   The page's behaviour: the accordion, the search box, the jump links and opening an entry
   straight from a #hash. The rendering it shares with scripts/gen-glossary.mjs, which writes
   the same markup into the page so a reader who never runs a script still gets all 120 terms.
   See js/glossary-card.js for why that split exists.
   ======================================== */

import {
  parseGlossaryMarkdown,
  dedupeEntries,
  makeEntries,
  makeStartHere,
  makeBigPicture,
  makeJumpNav
} from './glossary-card.js?v=20260918-34';

(function () {
  'use strict';

  var DATA_PATH = '../assets/ai-glossary-final.md';

  var searchInput = document.getElementById('glossarySearch');
  var jumpWrap = document.getElementById('azJumpNav');
  var startHereWrap = document.getElementById('startHereList');
  var bigPictureWrap = document.getElementById('bigPictureList');
  var entriesWrap = document.getElementById('glossaryEntries');
  var countEl = document.getElementById('glossaryCount');

  function getScrollOffset() {
    var nav = document.getElementById('nav');
    return (nav ? nav.offsetHeight : 72) + 16;
  }

  function scrollToEntry(card) {
    var top = card.getBoundingClientRect().top + window.scrollY - getScrollOffset();
    window.scrollTo({ top: top, behavior: 'smooth' });
  }

  function openEntry(card) {
    if (!card || card.classList.contains('open')) return;
    var button = card.querySelector('.glossary-trigger');
    var body = card.querySelector('.glossary-body');
    if (!button || !body) return;
    card.classList.add('open');
    button.setAttribute('aria-expanded', 'true');
    body.style.maxHeight = body.scrollHeight + 'px';
  }

  function bindJumpLinks() {
    var selectors = '.start-here-pill, .big-picture-link, .az-letter[href^="#"]';
    document.querySelectorAll(selectors).forEach(function (link) {
      link.addEventListener('click', function (event) {
        var hash = link.getAttribute('href') || '';
        if (!hash.startsWith('#')) return;
        var card = document.querySelector(hash);
        if (!card) return;

        event.preventDefault();
        if (link.classList.contains('start-here-pill') || link.classList.contains('big-picture-link')) {
          openEntry(card);
        }
        scrollToEntry(card);
        if (history && history.replaceState) {
          history.replaceState(null, '', hash);
        }
      });
    });
  }

  function openFromHashIfPresent() {
    if (!window.location.hash) return;
    var card = document.querySelector(window.location.hash);
    if (!card) return;
    openEntry(card);
    setTimeout(function () {
      scrollToEntry(card);
    }, 0);
  }

  function bindAccordion() {
    var triggers = entriesWrap.querySelectorAll('.glossary-trigger');
    triggers.forEach(function (button) {
      button.addEventListener('click', function () {
        var card = button.closest('.glossary-entry');
        var body = card.querySelector('.glossary-body');
        var isOpen = card.classList.contains('open');

        card.classList.toggle('open', !isOpen);
        button.setAttribute('aria-expanded', String(!isOpen));
        body.style.maxHeight = !isOpen ? (body.scrollHeight + 'px') : null;
      });
    });
  }

  function bindSearch() {
    searchInput.addEventListener('input', function () {
      var query = searchInput.value.trim().toLowerCase();
      var visibleCount = 0;
      var cards = entriesWrap.querySelectorAll('.glossary-entry');

      cards.forEach(function (card) {
        var text = card.textContent.toLowerCase();
        var match = !query || text.indexOf(query) !== -1;
        card.style.display = match ? '' : 'none';
        if (match) visibleCount += 1;
      });

      countEl.textContent = String(visibleCount);
    });
  }

  function init(entries) {
    /* Redrawn even though scripts/gen-glossary.mjs already wrote all four of these into the
       page. The markup and this are the same builder over the same file, so the redraw is a
       no-op a reader cannot see; what it buys is that an edit to the markdown shows up live
       before anybody remembers to run the generator, and the generator's --check is what says
       the committed copy has fallen behind. */
    startHereWrap.innerHTML = makeStartHere(entries);
    bigPictureWrap.innerHTML = makeBigPicture(entries);
    jumpWrap.innerHTML = makeJumpNav(entries);
    entriesWrap.innerHTML = makeEntries(entries);

    bindAccordion();
    bindSearch();
    bindJumpLinks();
    openFromHashIfPresent();
    countEl.textContent = String(entries.length);
  }

  function loadGlossary() {
    return fetch(DATA_PATH, { cache: 'no-cache' })
      .then(function (res) {
        if (!res.ok) {
          throw new Error('Failed to load glossary markdown');
        }
        return res.text();
      })
      .then(function (markdown) {
        var entries = dedupeEntries(parseGlossaryMarkdown(markdown));
        if (!entries.length) {
          throw new Error('No glossary entries parsed');
        }
        init(entries);
      });
  }

  loadGlossary().catch(function () {
    /* One retry covers a flaky first load (e.g. a stale cached response); only show the error after that fails too. */
    loadGlossary().catch(function () {
      entriesWrap.innerHTML = '<p>Unable to load glossary entries right now. Please refresh the page.</p>';
    });
  });
})();
