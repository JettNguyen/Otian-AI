/* ========================================
   N&R AI Solutions | Contact Form
   js/contact.js
   ======================================== */

(function () {
  'use strict';

  var form            = document.getElementById('contactForm');
  var confirmation    = document.getElementById('confirmationMessage');

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
  form.querySelectorAll('.form-input, .form-textarea').forEach(function (el) {
    el.addEventListener('input', function () { clearError(el); });
  });

  /* ── Submit ── */
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var nameEl    = document.getElementById('contactName');
    var emailEl   = document.getElementById('contactEmail');
    var messageEl = document.getElementById('contactMessage');
    var valid     = true;

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

    if (messageEl && !messageEl.value.trim()) {
      showError(messageEl, 'Please enter a message.');
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
