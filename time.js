/**
 * time.js - Modern lightweight vanilla JS date-picker / calendar widget
 * Repository: https://github.com/mangez/time.js
 * License: MIT
 */
'use strict';
(function (global) {
  const MONTH_NAMES_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const MONTH_NAMES_FULL  = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const DAY_HEADERS = ['Su','Mo','Tu','We','Th','Fr','Sa'];

  // ---- Public API ----
  function openCalendar(controlId) {
    var input = document.getElementById(controlId);
    if (!input) return;
    var container = _getOrCreateContainer();
    container.dataset.controlId = controlId;
    var startDate = _parseInputValue(input.value) || new Date();
    input.classList.add('timejs-active');
    _renderCalendar(container, startDate, startDate);
    _positionBelow(container, input);
    // rAF prevents the same click from immediately closing via the doc click handler
    requestAnimationFrame(function () { container.classList.add('timejs-open'); });
  }

  // ---- Rendering ----
  function _renderCalendar(container, viewDate, selectedDate) {
    var month = viewDate.getMonth();
    var year  = viewDate.getFullYear();
    var today = new Date();
    var firstWeekday = new Date(year, month, 1).getDay();
    var totalDays    = new Date(year, month + 1, 0).getDate();

    var monthOptions = MONTH_NAMES_FULL.map(function (name, i) {
      return '<option value="' + i + '"' + (i === month ? ' selected' : '') + '>' + name + '</option>';
    }).join('');
    var yearOptions = '';
    for (var y = year - 10; y <= year + 10; y++) {
      yearOptions += '<option value="' + y + '"' + (y === year ? ' selected' : '') + '>' + y + '</option>';
    }

    var rows = '';
    var dayCounter = 0;
    var padding = firstWeekday;
    for (var row = 0; row < 6 && dayCounter < totalDays; row++) {
      rows += '<tr>';
      for (var col = 0; col < 7; col++) {
        if (padding > 0) {
          rows += '<td></td>'; padding--;
        } else if (dayCounter < totalDays) {
          dayCounter++;
          var cls = 'timejs-day';
          if (col === 0) cls += ' timejs-sunday';
          if (dayCounter === today.getDate() && month === today.getMonth() && year === today.getFullYear()) cls += ' timejs-today';
          if (selectedDate && dayCounter === selectedDate.getDate() && month === selectedDate.getMonth() && year === selectedDate.getFullYear()) cls += ' timejs-selected';
          var label = dayCounter + ' ' + MONTH_NAMES_FULL[month] + ' ' + year;
          rows += '<td><span class="' + cls + '" data-day="' + dayCounter + '" tabindex="0" role="button" aria-label="' + label + '">' + dayCounter + '</span></td>';
        } else {
          rows += '<td></td>';
        }
      }
      rows += '</tr>';
    }

    var headerCells = DAY_HEADERS.map(function (d) { return '<th>' + d + '</th>'; }).join('');
    container.innerHTML =
      '<div class="timejs-header">' +
        '<button class="timejs-nav" data-dir="-1" aria-label="Previous month">‹</button>' +
        '<div class="timejs-header-selects">' +
          '<select class="timejs-month-select" aria-label="Select month">' + monthOptions + '</select>' +
          '<select class="timejs-year-select"  aria-label="Select year">'  + yearOptions  + '</select>' +
        '</div>' +
        '<button class="timejs-nav" data-dir="1" aria-label="Next month">›</button>' +
      '</div>' +
      '<div class="timejs-grid-wrap">' +
        '<table class="timejs-table"><thead><tr>' + headerCells + '</tr></thead><tbody>' + rows + '</tbody></table>' +
      '</div>' +
      '<div class="timejs-footer">' +
        '<button class="timejs-btn timejs-today-btn">Today</button>' +
        '<button class="timejs-btn timejs-clear-btn">Clear</button>' +
      '</div>';
    container.style.display = 'block';
    _attachEvents(container, viewDate, selectedDate);
  }

  // ---- Events ----
  function _attachEvents(container, viewDate, selectedDate) {
    container.querySelectorAll('.timejs-nav').forEach(function (btn) {
      btn.onclick = function (e) {
        e.stopPropagation();
        var dir = parseInt(btn.dataset.dir, 10);
        _renderCalendar(container, new Date(viewDate.getFullYear(), viewDate.getMonth() + dir, 1), selectedDate);
      };
    });
    container.querySelectorAll('select').forEach(function (sel) {
      sel.onchange = function () {
        var m = parseInt(container.querySelector('.timejs-month-select').value, 10);
        var y = parseInt(container.querySelector('.timejs-year-select').value, 10);
        _renderCalendar(container, new Date(y, m, 1), selectedDate);
      };
    });
    container.querySelector('.timejs-table').onclick = function (e) {
      var span = e.target.closest('.timejs-day');
      if (span && span.dataset.day) _selectDate(container, viewDate, parseInt(span.dataset.day, 10));
    };
    container.querySelector('.timejs-today-btn').onclick = function (e) {
      e.stopPropagation();
      var now = new Date();
      _selectDate(container, now, now.getDate());
    };
    container.querySelector('.timejs-clear-btn').onclick = function (e) {
      e.stopPropagation();
      var inp = document.getElementById(container.dataset.controlId);
      if (inp) { inp.value = ''; inp.dispatchEvent(new Event('change', {bubbles: true})); }
      _closeCalendar(container);
    };
  }

  function _selectDate(container, date, day) {
    var inp = document.getElementById(container.dataset.controlId);
    if (!inp) return;
    var d = new Date(date.getFullYear(), date.getMonth(), day);
    var dd = d.getDate() < 10 ? '0' + d.getDate() : '' + d.getDate();
    inp.value = dd + '-' + MONTH_NAMES_SHORT[d.getMonth()] + '-' + d.getFullYear();
    inp.dispatchEvent(new Event('change', {bubbles: true}));
    _closeCalendar(container);
  }

  // ---- Container ----
  function _getOrCreateContainer() {
    var c = document.getElementById('timejs-container');
    if (!c) {
      c = document.createElement('div');
      c.id = 'timejs-container';
      c.className = 'timejs-container';
      document.body.appendChild(c);
      document.addEventListener('click', function (e) {
        if (!c.classList.contains('timejs-open')) return;
        if (c.contains(e.target)) return;
        if (e.target.classList.contains('timejs-input')) return;
        _closeCalendar(c);
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') _closeCalendar(c);
      });
    }
    return c;
  }

  function _closeCalendar(c) {
    c.classList.remove('timejs-open');
    var inp = document.getElementById(c.dataset.controlId);
    if (inp) inp.classList.remove('timejs-active');
    setTimeout(function () {
      if (!c.classList.contains('timejs-open')) c.style.display = 'none';
    }, 200);
  }

  // ---- Helpers ----
  function _positionBelow(c, input) {
    c.style.display = 'block';
    var r = input.getBoundingClientRect();
    var top  = r.bottom + (window.scrollY || 0) + 4;
    var left = r.left   + (window.scrollX || 0);
    if (left + 300 > window.innerWidth) left = Math.max(8, window.innerWidth - 308);
    c.style.top  = top  + 'px';
    c.style.left = Math.max(8, left) + 'px';
  }

  function _parseInputValue(v) {
    if (!v) return null;
    var p = v.split('-');
    if (p.length !== 3) return null;
    var m = MONTH_NAMES_SHORT.indexOf(p[1]);
    return m !== -1 ? new Date(parseInt(p[2], 10), m, parseInt(p[0], 10)) : null;
  }

  global.openCalendar = openCalendar;
}(window));
