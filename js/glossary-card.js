/* ========================================
   Otian AI | Glossary rendering
   js/glossary-card.js

   The glossary, parsed out of assets/ai-glossary-final.md and rendered as the entries, the
   two curated pill lists, and the A-Z rail. Pure: every function here takes text or entries
   and returns a string, touching no DOM and no network.

   IT IS PURE BECAUSE TWO CALLERS NEED IT AND ONLY ONE OF THEM IS A BROWSER.

   js/glossary.js calls it on load, and scripts/gen-glossary.mjs calls it through Node and
   writes the result into ai-explained/ as static HTML. Until that script existed the page
   shipped four empty elements and the words "Entries shown: 0", so 120 hand-written entries,
   34KB of the plainest language on this site, were invisible to every crawler, every answer
   engine and every link preview. llms.txt has been pointing machines at that page the whole
   time, which made it the one place we invited a machine to read and handed it nothing.

   Same arrangement, and the same reason, as js/blog-card.js and js/addon-card.js. See those
   files' headers: the marketplace grid had this bug until 2026-09-07 and the blog hub until
   the same day. `node scripts/gen-glossary.mjs --check` fails when the shipped HTML and the
   markdown disagree.
   ======================================== */

/* Every value below is interpolated into a string that becomes innerHTML, so it goes through
   here first. Today assets/ai-glossary-final.md is authored by hand and committed, so nothing
   in it is attacker-controlled and none of this is load-bearing. It is here because that is a
   fact about where the data comes from, not a property of this code, and the day the source
   changes the change would be one line elsewhere and this file would silently become an XSS
   sink. Same helper as js/blog-card.js, js/addon-card.js and js/phone.js. */
export function escapeHtml(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

/* The markdown was written in a word processor and pasted, so it carries en dashes, em dashes,
   and in places the mojibake those become when UTF-8 is read as Latin-1. All of them are the
   separator between a term and its definition, so all of them are normalized to one spaced
   hyphen before anything tries to split on it. */
export function cleanText(value) {
  return String(value || '')
    .replace(/\u00e2\u20ac[\u201c\u201d]/g, ' - ')
    .replace(/\u00e2\u20ac\u201c|\u00e2\u20ac\u201d/g, ' - ')
    .replace(/[\u2013\u2014]/g, ' - ')
    .replace(/\s+-\s+/g, ' - ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/* The id a term gets, and therefore the anchor every pill and every A-Z letter points at.
   Both callers must agree on it or the generated markup and the redrawn markup disagree about
   where "#context-window" is. */
export function slugify(term) {
  return term
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

/* The twelve a first-time reader should meet first, and the ones that are only ever in the
   news. Both lists are curated by hand rather than derived: the point of them is that somebody
   decided. A term named here that is not in the markdown is skipped rather than drawn, so a
   renamed entry leaves a shorter list instead of a dead anchor. */
export const START_HERE_TERMS = [
  'AI Assistant',
  'AI Agent',
  'Chatbot',
  'Human-in-the-Loop',
  'Hallucination',
  'Prompt',
  'Personal CRM',
  'Automation',
  'Generative AI',
  'ChatGPT',
  'Conversational AI',
  'Context Window'
];

export const BIG_PICTURE_TERMS = [
  'AGI (Artificial General Intelligence)',
  'ASI (Artificial Super Intelligence)',
  'Singularity',
  'Anthropomorphism',
  'Emergent Behavior'
];

/* One entry per `**Term** - definition` line, with the `Example:` line that follows it if one
   does before the next term starts. */
export function parseGlossaryMarkdown(markdown) {
  var lines = String(markdown || '').split(/\r?\n/);
  var entries = [];

  for (var i = 0; i < lines.length; i += 1) {
    var line = cleanText(lines[i].trim());
    var entryMatch = line.match(/^\*\*(.+?)\*\*\s*-\s*(.+)$/);
    if (!entryMatch) continue;

    var term = entryMatch[1].trim();
    var definition = cleanText(entryMatch[2].trim());
    var example = '';

    for (var j = i + 1; j < lines.length; j += 1) {
      var next = lines[j].trim();
      var exampleMatch = next.match(/^Example:\s*(.+)$/);
      if (exampleMatch) {
        example = cleanText(exampleMatch[1].trim());
        break;
      }
      if (/^\*\*.+\*\*/.test(next)) break;
    }

    entries.push({ term: term, definition: definition, example: example, slug: slugify(term) });
  }

  return entries;
}

/* First spelling of a term wins. Two entries with one slug would give the page two elements
   with the same id, and every anchor to it would land on whichever came first anyway. */
export function dedupeEntries(entries) {
  var seen = {};
  return entries.filter(function (entry) {
    var key = entry.term.toLowerCase();
    if (seen[key]) return false;
    seen[key] = true;
    return true;
  });
}

/* One entry. It ships closed, with aria-expanded="false", because that is the state the page
   loads in whether or not a script ever runs: the definition is in the markup either way, so a
   reader without JavaScript gets the text and a reader with it gets the accordion. */
export function makeEntryCard(entry) {
  return [
    '<article class="glossary-entry" id="' + escapeHtml(entry.slug) + '" data-term="' + escapeHtml(entry.term.toLowerCase()) + '">',
    '<button class="glossary-trigger" aria-expanded="false">',
    '<span>' + escapeHtml(entry.term) + '</span>',
    '<span class="glossary-plus" aria-hidden="true">+</span>',
    '</button>',
    '<div class="glossary-body">',
    '<p>' + escapeHtml(entry.definition) + '</p>',
    (entry.example ? '<p><strong>Example:</strong> ' + escapeHtml(entry.example) + '</p>' : ''),
    '</div>',
    '</article>'
  ].join('');
}

function makePills(entries, terms, className) {
  var byTerm = {};
  entries.forEach(function (entry) { byTerm[entry.term] = entry; });
  return terms
    .map(function (term) {
      if (!byTerm[term]) return '';
      return '<a href="#' + escapeHtml(byTerm[term].slug) + '" class="' + className + '">' + escapeHtml(term) + '</a>';
    })
    .filter(Boolean)
    .join('');
}

export function makeStartHere(entries) {
  return makePills(entries, START_HERE_TERMS, 'start-here-pill');
}

export function makeBigPicture(entries) {
  return makePills(entries, BIG_PICTURE_TERMS, 'big-picture-link');
}

/* All 26 letters always, so the rail is the same width on every render and a letter with no
   entries reads as empty rather than missing. Each live letter points at its first entry. */
export function makeJumpNav(entries) {
  var letters = {};
  entries.forEach(function (entry) {
    var letter = entry.term.charAt(0).toUpperCase();
    if (!/[A-Z]/.test(letter)) return;
    if (!letters[letter]) letters[letter] = entry.slug;
  });

  return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(function (letter) {
    if (!letters[letter]) {
      return '<span class="az-letter disabled">' + letter + '</span>';
    }
    return '<a class="az-letter" href="#' + escapeHtml(letters[letter]) + '">' + letter + '</a>';
  }).join('');
}

export function makeEntries(entries) {
  return entries.map(makeEntryCard).join('');
}
