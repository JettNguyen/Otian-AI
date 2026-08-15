/* ========================================
   Otian AI | Blog Page
   js/blog.js
   ======================================== */

(function () {
  'use strict';

  var DATA_PATH = '../assets/articles.json';

  /* Every value below is interpolated into a string that becomes innerHTML, so it goes through
     here first. Today assets/articles.json is authored by hand and committed, so nothing in it is
     attacker-controlled and none of this is load-bearing. It is here because that is a fact about
     where the data comes from, not a property of this code, and the day the source changes (a CMS,
     a form, anything fetched) the change would be one line elsewhere and this file would silently
     become an XSS sink. Same helper as js/phone.js and js/marketplace.js. */
  function escapeHtml(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* A URL in an href needs more than entity-escaping: &quot; stops it breaking out of the
     attribute, and does nothing about javascript:. Relative post slugs are all this ever holds,
     so anything that is not one is dropped rather than sanitised. */
  function safeUrl(value) {
    var url = String(value == null ? '' : value);
    return /^[A-Za-z][A-Za-z0-9+.-]*:/.test(url) || url.indexOf('//') === 0 ? '' : escapeHtml(url);
  }

  var featuredEl = document.getElementById('resourceFeatured');
  var gridEl = document.getElementById('resourceGrid');
  var searchEl = document.getElementById('blogSearch');
  var filtersEl = document.getElementById('resourceCategoryFilters');
  var countEl = document.getElementById('resourceCount');

  if (!featuredEl || !gridEl || !searchEl || !filtersEl || !countEl) {
    return;
  }

  var selectedCategory = 'All';

  function formatDate(isoDate) {
    var date = new Date(isoDate + 'T00:00:00');
    if (isNaN(date.getTime())) {
      return isoDate;
    }
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  function makeFeatured(article) {
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

  function makeCard(article) {
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

  function uniqueCategories(items) {
    var map = { All: true };
    items.forEach(function (item) {
      map[item.category] = true;
    });
    return Object.keys(map);
  }

  function renderFilters(items, onChange) {
    var categories = uniqueCategories(items);
    if (categories.length <= 1) {
      filtersEl.innerHTML = '';
      return;
    }

    filtersEl.innerHTML = categories.map(function (category) {
      var isActive = category === selectedCategory;
      return '<button class="resource-filter' + (isActive ? ' is-active' : '') + '" data-category="' + escapeHtml(category) + '" type="button">' + escapeHtml(category) + '</button>';
    }).join('');

    filtersEl.querySelectorAll('.resource-filter').forEach(function (button) {
      button.addEventListener('click', function () {
        selectedCategory = button.getAttribute('data-category') || 'All';
        onChange();
      });
    });
  }

  function matchesQuery(article, query) {
    if (!query) return true;
    var haystack = [
      article.title,
      article.summary,
      article.author,
      article.category,
      article.tags.join(' ')
    ].join(' ').toLowerCase();
    return haystack.indexOf(query) !== -1;
  }

  function filterItems(items) {
    var query = searchEl.value.trim().toLowerCase();
    return items.filter(function (item) {
      var categoryMatch = selectedCategory === 'All' || item.category === selectedCategory;
      return categoryMatch && matchesQuery(item, query);
    });
  }

  function render(articles) {
    var filtered = filterItems(articles);
    var featured = filtered[0] || articles[0];

    if (!articles.length) {
      featuredEl.innerHTML = [
        '<span class="resource-featured-label">No Posts Yet</span>',
        '<h3>New articles are on the way.</h3>',
        '<p>Check back soon for AI notes and call recaps from the Otian AI team.</p>'
      ].join('');
      gridEl.innerHTML = '';
      countEl.textContent = 'No published posts yet.';
      filtersEl.innerHTML = '';
      return;
    }

    featuredEl.innerHTML = featured ? makeFeatured(featured) : '<p>No featured article yet.</p>';

    gridEl.innerHTML = filtered.slice(1).map(makeCard).join('');
    countEl.textContent = filtered.length ? 'Showing ' + filtered.length + ' article' + (filtered.length > 1 ? 's' : '') + '.' : 'No matching articles yet.';

    renderFilters(articles, function () {
      render(articles);
    });
  }

  function normalizeArticles(value) {
    if (!Array.isArray(value) || !value.length) {
      return [];
    }
    return value.filter(function (entry) {
      return entry && entry.title && entry.summary && entry.author && entry.date && entry.category && Array.isArray(entry.tags);
    });
  }

  function boot(articles) {
    var activeArticles = normalizeArticles(articles);
    searchEl.addEventListener('input', function () {
      render(activeArticles);
    });
    render(activeArticles);
  }

  fetch(DATA_PATH)
    .then(function (res) {
      if (!res.ok) {
        throw new Error('Failed to load articles.json');
      }
      return res.json();
    })
    .then(function (data) {
      boot(data);
    })
    .catch(function () {
      boot([]);
    });
})();