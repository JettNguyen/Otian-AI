/* ========================================
   N&R AI Solutions — Questionnaire Form
   js/questionnaire.js
   ======================================== */

(function () {
  'use strict';

  const TOTAL_STEPS = 6;

  const stepLabels = [
    'About You',
    'What You Want Help With',
    'How Hands-On You Want to Be',
    'Your Comfort Level',
    'Powering Your Assistant',
    'Anything Else'
  ];

  let currentStep = 0;

  /* ── Element references ── */
  const steps        = document.querySelectorAll('.form-step');
  const progressFill = document.getElementById('progressFill');
  const progressLabel = document.getElementById('progressLabel');
  const progressCount = document.getElementById('progressCount');
  const formEl       = document.getElementById('questionnaireForm');
  const thankyou     = document.getElementById('thankyouScreen');
  const progressWrap = document.getElementById('progressWrap');

  /* ── Update progress bar ── */
  function updateProgress() {
    const pct = Math.round(((currentStep + 1) / TOTAL_STEPS) * 100);
    if (progressFill)  progressFill.style.width = pct + '%';
    if (progressLabel) progressLabel.textContent = stepLabels[currentStep];
    if (progressCount) progressCount.textContent = 'Step ' + (currentStep + 1) + ' of ' + TOTAL_STEPS;
  }

  /* ── Show a specific step ── */
  function showStep(index) {
    steps.forEach(function (step, i) {
      step.classList.toggle('active', i === index);
    });
    currentStep = index;
    updateProgress();

    /* Scroll to top of form area */
    if (progressWrap) {
      window.scrollTo({ top: progressWrap.offsetTop - 20, behavior: 'smooth' });
    }
  }

  /* ── Validation helpers ── */
  function showError(input, msg) {
    input.classList.add('field-error');
    const errEl = input.parentElement.querySelector('.form-error-msg');
    if (errEl) {
      errEl.textContent = msg;
      errEl.classList.add('visible');
    }
  }

  function clearError(input) {
    input.classList.remove('field-error');
    const errEl = input.parentElement.querySelector('.form-error-msg');
    if (errEl) errEl.classList.remove('visible');
  }

  function clearAllErrors(stepEl) {
    stepEl.querySelectorAll('.field-error').forEach(function (el) {
      el.classList.remove('field-error');
    });
    stepEl.querySelectorAll('.form-error-msg.visible').forEach(function (el) {
      el.classList.remove('visible');
    });
  }

  function isValidEmail(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  }

  /* ── Validate the current step ── */
  function validateStep(stepIndex) {
    const stepEl = steps[stepIndex];
    clearAllErrors(stepEl);
    let valid = true;

    /* Helper to mark a text/email/tel input as required */
    function requireInput(id, msg) {
      const el = document.getElementById(id);
      if (!el) return;
      if (!el.value.trim()) {
        showError(el, msg || 'This field is required.');
        valid = false;
      }
    }

    switch (stepIndex) {
      case 0: /* About You */
        requireInput('fullName', 'Please enter your full name.');
        var emailEl = document.getElementById('emailAddress');
        if (emailEl) {
          if (!emailEl.value.trim()) {
            showError(emailEl, 'Please enter your email address.');
            valid = false;
          } else if (!isValidEmail(emailEl.value.trim())) {
            showError(emailEl, 'Please enter a valid email address.');
            valid = false;
          }
        }
        requireInput('yourWorld', 'Please tell us a bit about your world.');
        break;

      case 1: /* What You Want Help With */
        requireInput('handOffTask', 'Please describe the task you\'d like to hand off.');
        /* At least one checkbox in helpOptions */
        var checkboxes = document.querySelectorAll('input[name="helpOptions"]');
        var anyChecked = false;
        checkboxes.forEach(function (cb) { if (cb.checked) anyChecked = true; });
        if (!anyChecked) {
          var groupErr = document.getElementById('helpOptionsError');
          if (groupErr) groupErr.classList.add('visible');
          valid = false;
        }
        /* Time radio */
        var timeChecked = document.querySelector('input[name="timeSpent"]:checked');
        if (!timeChecked) {
          var timeErr = document.getElementById('timeSpentError');
          if (timeErr) timeErr.classList.add('visible');
          valid = false;
        }
        /* Messaging radio */
        var msgChecked = document.querySelector('input[name="messagingPref"]:checked');
        if (!msgChecked) {
          var msgErr = document.getElementById('messagingPrefError');
          if (msgErr) msgErr.classList.add('visible');
          valid = false;
        }
        break;

      case 2: /* Hands-On */
        if (!document.querySelector('input[name="taskApproval"]:checked')) {
          var taErr = document.getElementById('taskApprovalError');
          if (taErr) taErr.classList.add('visible');
          valid = false;
        }
        if (!document.querySelector('input[name="urgentNotify"]:checked')) {
          var unErr = document.getElementById('urgentNotifyError');
          if (unErr) unErr.classList.add('visible');
          valid = false;
        }
        if (!document.querySelector('input[name="summaryFreq"]:checked')) {
          var sfErr = document.getElementById('summaryFreqError');
          if (sfErr) sfErr.classList.add('visible');
          valid = false;
        }
        break;

      case 3: /* Comfort Level */
        if (!document.querySelector('input[name="techExperience"]:checked')) {
          var teErr = document.getElementById('techExperienceError');
          if (teErr) teErr.classList.add('visible');
          valid = false;
        }
        if (!document.querySelector('input[name="aiExperience"]:checked')) {
          var aeErr = document.getElementById('aiExperienceError');
          if (aeErr) aeErr.classList.add('visible');
          valid = false;
        }
        if (!document.querySelector('input[name="managePref"]:checked')) {
          var mpErr = document.getElementById('managePrefError');
          if (mpErr) mpErr.classList.add('visible');
          valid = false;
        }
        break;

      case 4: /* Powering */
        /* At least one AI checkbox */
        var aiCBs = document.querySelectorAll('input[name="aiTools"]');
        var aiAny = false;
        aiCBs.forEach(function (cb) { if (cb.checked) aiAny = true; });
        if (!aiAny) {
          var aiErr = document.getElementById('aiToolsError');
          if (aiErr) aiErr.classList.add('visible');
          valid = false;
        }
        break;

      case 5: /* Anything Else — no required fields */
        break;
    }

    return valid;
  }

  /* ── Next button handler ── */
  document.querySelectorAll('.btn-next').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (validateStep(currentStep)) {
        if (currentStep < TOTAL_STEPS - 1) {
          showStep(currentStep + 1);
        }
      }
    });
  });

  /* ── Back button handler ── */
  document.querySelectorAll('.btn-back').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (currentStep > 0) {
        showStep(currentStep - 1);
      }
    });
  });

  /* ── Clear errors on input ── */
  document.querySelectorAll('.form-input, .form-textarea').forEach(function (el) {
    el.addEventListener('input', function () {
      clearError(el);
    });
  });

  /* ── "Something else" checkbox → reveal text input ── */
  var somethingElseCB   = document.getElementById('helpOther');
  var somethingElseText = document.getElementById('somethingElseField');
  if (somethingElseCB && somethingElseText) {
    somethingElseCB.addEventListener('change', function () {
      somethingElseText.classList.toggle('visible', somethingElseCB.checked);
    });
  }

  /* ── Summary frequency → reveal preferred time ── */
  var summaryRadios  = document.querySelectorAll('input[name="summaryFreq"]');
  var summaryTimeRow = document.getElementById('summaryTimeRow');
  summaryRadios.forEach(function (radio) {
    radio.addEventListener('change', function () {
      var val = document.querySelector('input[name="summaryFreq"]:checked');
      if (summaryTimeRow) {
        summaryTimeRow.classList.toggle('visible', val && val.value !== 'none');
      }
    });
  });

  /* ── Submit handler ── */
  var submitBtn = document.getElementById('submitBtn');
  if (submitBtn) {
    submitBtn.addEventListener('click', function (e) {
      e.preventDefault();
      if (!validateStep(currentStep)) return;

      /* Get first name for personalised thank-you */
      var fullName  = (document.getElementById('fullName') || {}).value || '';
      var firstName = fullName.trim().split(' ')[0] || 'there';

      /* Show thank-you screen */
      if (formEl)   formEl.style.display = 'none';
      if (progressWrap) progressWrap.style.display = 'none';
      if (thankyou) {
        thankyou.classList.add('visible');
        var nameEl = document.getElementById('thankyouName');
        if (nameEl) nameEl.textContent = firstName;
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── Init ── */
  showStep(0);
})();
