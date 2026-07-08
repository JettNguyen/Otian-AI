/* ========================================
   Otian AI | Equipment Checklist
   js/equipment.js
   ======================================== */

(function () {
  'use strict';

  var STORAGE_KEY = 'nr-equipment-checklist';

  var checkboxes  = document.querySelectorAll('.checklist-checkbox');
  var progressFill = document.getElementById('checklistProgressFill');
  var progressLabel = document.getElementById('checklistProgressLabel');
  var resetBtn = document.getElementById('checklistReset');

  if (!checkboxes.length) return;

  function loadState() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch (e) {
      return {};
    }
  }

  function saveState(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      /* localStorage unavailable, skip persistence */
    }
  }

  function updateProgress() {
    var total = checkboxes.length;
    var checked = 0;
    checkboxes.forEach(function (cb) {
      if (cb.checked) checked++;
    });

    if (progressFill) {
      progressFill.style.width = (total ? Math.round((checked / total) * 100) : 0) + '%';
    }
    if (progressLabel) {
      progressLabel.textContent = checked + ' of ' + total + ' ready';
    }
  }

  var state = loadState();

  checkboxes.forEach(function (cb) {
    var key = cb.dataset.key;
    if (key && state[key]) cb.checked = true;

    cb.addEventListener('change', function () {
      var current = loadState();
      if (cb.checked) {
        current[key] = true;
      } else {
        delete current[key];
      }
      saveState(current);
      updateProgress();
    });
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      checkboxes.forEach(function (cb) {
        cb.checked = false;
      });
      saveState({});
      updateProgress();
    });
  }

  updateProgress();
})();
