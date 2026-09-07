/* ========================================
   Otian AI | Blog Page
   js/blog.js
   ======================================== */

/* A module, not the IIFE this was, so it can import the renderers that scripts/gen-blog.mjs
   also calls. Nothing else changed: a module is strict and deferred, which the IIFE already
   was by hand and by where its <script> sits. */
import {
  makeFeatured, makeCard, normalizeArticles, escapeHtml,
} from './blog-card.js';

(function () {
  'use strict';

  var DATA_PATH = '../assets/articles.json';

  var featuredEl = document.getElementById('resourceFeatured');
  var gridEl = document.getElementById('resourceGrid');
  var searchEl = document.getElementById('blogSearch');
  var filtersEl = document.getElementById('resourceCategoryFilters');
  var countEl = document.getElementById('resourceCount');

  if (!featuredEl || !gridEl || !searchEl || !filtersEl || !countEl) {
    return;
  }

  var selectedCategory = 'All';

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