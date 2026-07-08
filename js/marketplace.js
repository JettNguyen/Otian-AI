/* ========================================
   Otian AI | Skills Marketplace Waitlist
   js/marketplace.js
   ======================================== */

(function () {
  'use strict';

  /* ── Category filter + search ── */
  var filterBar    = document.getElementById('marketplaceFilterBar');
  var searchInput  = document.getElementById('marketplaceSearchInput');
  var grid         = document.getElementById('marketplaceCategoryGrid');
  var emptyState   = document.getElementById('marketplaceFilterEmpty');

  if (filterBar && grid) {
    var pills = Array.prototype.slice.call(filterBar.querySelectorAll('.marketplace-filter-pill'));
    var cards = Array.prototype.slice.call(grid.querySelectorAll('[data-category]'));
    var activeFilter = 'all';

    function applyFilters() {
      var query = searchInput ? searchInput.value.trim().toLowerCase() : '';
      var visibleCount = 0;

      cards.forEach(function (card) {
        var matchesFilter = activeFilter === 'all' || card.dataset.category === activeFilter;
        var matchesSearch = !query || card.dataset.category.toLowerCase().indexOf(query) !== -1;
        var match = matchesFilter && matchesSearch;
        card.hidden = !match;
        if (match) visibleCount++;
      });

      if (emptyState) {
        emptyState.hidden = visibleCount !== 0;
      }
    }

    filterBar.addEventListener('click', function (e) {
      var pill = e.target.closest('.marketplace-filter-pill');
      if (!pill) return;

      pills.forEach(function (p) { p.classList.remove('is-active'); });
      pill.classList.add('is-active');
      activeFilter = pill.dataset.filter;
      applyFilters();
    });

    if (searchInput) {
      searchInput.addEventListener('input', applyFilters);
    }
  }

  var form         = document.getElementById('marketplaceWaitlistForm');
  var confirmation = document.getElementById('marketplaceConfirmationMessage');

  if (!form) return;

  /* ── Error helpers ── */
  function showError(input, msg) {
    input.classList.add('field-error');
    var errEl = input.parentElement.querySelector('.form-error-msg');
    if (errEl) {
      errEl.textContent = msg;
      errEl.classList.add('visible');
    }
  }

  function clearError(input) {
    input.classList.remove('field-error');
    var errEl = input.parentElement.querySelector('.form-error-msg');
    if (errEl) errEl.classList.remove('visible');
  }

  function isValidEmail(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  }

  /* Clear errors on input */
  form.querySelectorAll('.form-input').forEach(function (el) {
    el.addEventListener('input', function () { clearError(el); });
    el.addEventListener('change', function () { clearError(el); });
  });

  /* ── Submit ── */
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var nameEl     = document.getElementById('waitlistName');
    var emailEl    = document.getElementById('waitlistEmail');
    var interestEl = document.getElementById('waitlistInterest');
    var valid      = true;

    if (nameEl && !nameEl.value.trim()) {
      showError(nameEl, 'Please enter your name.');
      valid = false;
    }

    if (emailEl) {
      if (!emailEl.value.trim()) {
        showError(emailEl, 'Please enter your email address.');
        valid = false;
      } else if (!isValidEmail(emailEl.value.trim())) {
        showError(emailEl, 'Please enter a valid email address.');
        valid = false;
      }
    }

    if (interestEl && !interestEl.value) {
      showError(interestEl, 'Please choose an option.');
      valid = false;
    }

    if (!valid) return;

    /* Show confirmation inline */
    form.style.display = 'none';
    if (confirmation) {
      confirmation.classList.add('visible');
    }
  });
})();
