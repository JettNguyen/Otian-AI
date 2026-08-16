/* ========================================
   Otian AI | Contact Form
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

    /* Actually send it. This handler used to hide the form and show the confirmation without
       posting anything anywhere: a reader was thanked for a message nobody received. Same
       Formspree inbox as the questionnaire, with a source field to tell the two apart. */
    var submitBtn = form.querySelector('button[type="submit"]');
    var idleLabel = submitBtn ? submitBtn.textContent : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending\u2026';
    }

    var data = new FormData(form);
    data.append('form', 'contact');

    fetch('https://formspree.io/f/mgobddpy', {
      method: 'POST',
      body: data,
      headers: { 'Accept': 'application/json' }
    })
    .then(function (res) {
      if (!res.ok) throw new Error('send failed');
      form.style.display = 'none';
      if (confirmation) confirmation.classList.add('visible');
    })
    .catch(function () {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = idleLabel;
      }
      showFormError('Something went wrong and your message was not sent. Please try again, or email us at questions@otianai.com.');
    });
  });

  /* One form-level error line above the submit button, for failures that belong to the whole
     form rather than one field. Created on first use; announced via role="alert". */
  function showFormError(msg) {
    var el = form.querySelector('.form-error-msg--form');
    if (!el) {
      el = document.createElement('p');
      el.className = 'form-error-msg form-error-msg--form visible';
      el.setAttribute('role', 'alert');
      var btn = form.querySelector('button[type="submit"]');
      form.insertBefore(el, btn);
    }
    el.textContent = msg;
    el.classList.add('visible');
  }
})();
