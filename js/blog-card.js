/* ========================================
   Otian AI | Blog card rendering
   js/blog-card.js

   One article, rendered as the card the blog index shows. Pure: it takes an entry from
   assets/articles.json and returns a string, touching no DOM and no network.

   IT IS PURE BECAUSE TWO CALLERS NEED IT AND ONLY ONE OF THEM IS A BROWSER.

   js/blog.js calls it on load, and again on every keystroke in the search box and every category
   filter, which is what a reader is actually looking at. scripts/gen-blog.mjs calls it through
   Node and writes the unfiltered list into blog/ as static HTML, because until 2026-09-07 the
   feed was two empty elements filled in by script: the blog index carried 183 characters of
   readable text and named none of its fifteen posts. Every crawler, every answer engine and
   every link preview was served a hub page that linked to nothing.

   Same arrangement, and the same reason, as js/addon-card.js and the marketplace grid. See that
   file's header. `node scripts/gen-blog.mjs --check` fails when the shipped HTML and
   assets/articles.json disagree.
   ======================================== */

/* Every value below is interpolated into a string that becomes innerHTML, so it goes through
   here first. Today assets/articles.json is authored by hand and committed, so nothing in it is
   attacker-controlled and none of this is load-bearing. It is here because that is a fact about
   where the data comes from, not a property of this code, and the day the source changes (a CMS,
   a form, anything fetched) the change would be one line elsewhere and this file would silently
   become an XSS sink. Same helper as js/phone.js and js/addon-card.js. */
export function escapeHtml(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

/* A URL in an href needs more than entity-escaping: &quot; stops it breaking out of the
   attribute, and does nothing about javascript:. Relative post slugs are all this ever holds,
   so anything that is not one is dropped rather than sanitised. */
export function safeUrl(value) {
  var url = String(value == null ? '' : value);
  return /^[A-Za-z][A-Za-z0-9+.-]*:/.test(url) || url.indexOf('//') === 0 ? '' : escapeHtml(url);
}

export function formatDate(isoDate) {
  var date = new Date(isoDate + 'T00:00:00');
  if (isNaN(date.getTime())) {
    return isoDate;
  }
  // 'en-US' and not undefined: with the visitor's own locale this printed "19 Aug 2026" in
  // Britain and "Aug 19, 2026" here, so the index disagreed with the posts it linked to and
  // with itself depending on who was reading. The site is written in one language; its dates
  // are written in one format.
  //
  // The generator inherits that for free, and has to: a build machine in another timezone
  // writing a different date into the markup than the browser writes over it would be the same
  // bug again, one layer down and harder to see.
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function makeFeatured(article) {
  var titleHtml = article.url
    ? '<h3><a href="' + safeUrl(article.url) + '">' + escapeHtml(article.title) + '</a></h3>'
    : '<h3>' + escapeHtml(article.title) + '</h3>';
  var readMoreHtml = article.url
    ? '<a class="resource-read-more" href="' + safeUrl(article.url) + '">Read the full story &rarr;</a>'
    : '';
  return [
    '<span class="resource-featured-label">Featured</span>',
    titleHtml,
    '<p>' + escapeHtml(article.summary) + '</p>',
    '<div class="resource-meta">',
    '<span>' + escapeHtml(article.author) + '</span>',
    '<span>' + formatDate(article.date) + '</span>',
    '<span>' + escapeHtml(article.readTime) + '</span>',
    '</div>',
    '<div class="resource-tag-cloud">',
    '<span class="resource-tag">' + escapeHtml(article.category) + '</span>',
    article.tags.map(function (tag) {
      return '<span class="resource-tag">' + escapeHtml(tag) + '</span>';
    }).join(''),
    '</div>',
    readMoreHtml
  ].join('');
}

export function makeCard(article) {
  var titleHtml = article.url
    ? '<h3><a href="' + safeUrl(article.url) + '">' + escapeHtml(article.title) + '</a></h3>'
    : '<h3>' + escapeHtml(article.title) + '</h3>';
  return [
    '<article class="resource-card" role="listitem">',
    '<p class="resource-card-kicker">' + escapeHtml(article.category) + '</p>',
    titleHtml,
    '<p>' + escapeHtml(article.summary) + '</p>',
    '<div class="resource-meta">',
    '<span>' + escapeHtml(article.author) + '</span>',
    '<span>' + formatDate(article.date) + '</span>',
    '<span>' + escapeHtml(article.readTime) + '</span>',
    '</div>',
    '</article>'
  ].join('');
}

/* An entry missing any of these renders as a card with holes in it, so it is dropped rather than
   drawn. Both callers use it, so a malformed entry is absent from the markup and from the live
   feed alike instead of appearing in one of them. */
export function normalizeArticles(value) {
  if (!Array.isArray(value) || !value.length) {
    return [];
  }
  return value.filter(function (entry) {
    return entry && entry.title && entry.summary && entry.author && entry.date &&
      entry.category && Array.isArray(entry.tags);
  });
}
