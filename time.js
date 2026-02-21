/**
 * time.js - Modern lightweight vanilla JS date-picker / calendar widget
 * Repository: https://github.com/mangez/time.js
 * License: MIT
 *
 * Features:/**
 * time.js - Modern lightweight vanilla JS date-picker / calendar widget
 * Repository: https://github.com/mangez/time.js
 * License: MIT
 */
'use strict';
(function (global) {
  const MONTH_NAMES_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const MONTH_NAMES_FULL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const DAY_HEADERS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  function openCalendar(controlId) {
    const input = document.getElementById(controlId);
    if (!controlId || !input) return;
    const container = _getOrCreateContainer();
    container.dataset.controlId = controlId;
    let startDate = _parseInputValue(input.value) || new Date();
    input.classList.add('timejs-active');
    _renderCalendar(container, startDate, startDate);
    _positionBelow(container, input);
    container.classList.add('timejs-open');
  }

  function _renderCalendar(container, viewDate, selectedDate) {
    const month = viewDate.getMonth(), year = viewDate.getFullYear();
    const today = new Date();
    const firstWeekday = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    
    let monthOptions = MONTH_NAMES_FULL.map((name, i) => `<option value="${i}" ${i === month ? 'selected' : ''}>${name}</option>`).join('');
    let yearOptions = '';
    for (let y = year - 10; y <= year + 10; y++) {
      yearOptions += `<option value="${y}" ${y === year ? 'selected' : ''}>${y}</option>`;
    }

    let rows = '';
    let dayCounter = 0;
    let padding = firstWeekday;
    for (let row = 0; row < 6 && dayCounter < totalDays; row++) {
      rows += '<tr>';
      for (let col = 0; col < 7; col++) {
        if (dayCounter >= totalDays || padding > 0) {
          rows += '<td></td>';
          if (padding > 0) padding--;
        } else {
          dayCounter++;
          let cls = ['timejs-day'];
          if (col === 0) cls.push('timejs-sunday');
          if (dayCounter === today.getDate() && month === today.getMonth() && year === today.getFullYear()) cls.push('timejs-today');
          if (selectedDate && dayCounter === selectedDate.getDate() && month === selectedDate.getMonth() && year === selectedDate.getFullYear()) cls.push('timejs-selected');
          rows += `<td><span class="${cls.join(' ')}" data-day="${dayCounter}" tabindex="0" role="button" aria-label="${dayCounter} ${MONTH_NAMES_FULL[month]} ${year}">${dayCounter}</span></td>`;
        }
      }
      rows += '</tr>';
    }

    container.innerHTML = `
      <div class="timejs-header">
        <button class="timejs-nav" data-dir="-1" aria-label="Previous month">‹</button>
        <div class="timejs-header-selects">
          <select class="timejs-month-select" aria-label="Select month">${monthOptions}</select>
          <select class="timejs-year-select" aria-label="Select year">${yearOptions}</select>
        </div>
        <button class="timejs-nav" data-dir="1" aria-label="Next month">›</button>
      </div>
      <div class="timejs-grid-wrap">
        <table class="timejs-table">
          <thead><tr>${DAY_HEADERS.map(d => `<th>${d}</th>`).join('')}</tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
      <div class="timejs-footer">
        <button class="timejs-btn timejs-today-btn">Today</button>
        <button class="timejs-btn timejs-clear-btn">Clear</button>
      </div>`;
    _attachEvents(container, viewDate, selectedDate);
  }

  function _attachEvents(container, viewDate, selectedDate) {
    container.querySelectorAll('.timejs-nav').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        _renderCalendar(container, new Date(viewDate.getFullYear(), viewDate.getMonth() + parseInt(btn.dataset.dir), 1), selectedDate);
      };
    });

    container.querySelectorAll('select').forEach(sel => {
      sel.onchange = () => {
        const m = container.querySelector('.timejs-month-select').value;
        const y = container.querySelector('.timejs-year-select').value;
        _renderCalendar(container, new Date(y, m, 1), selectedDate);
      };
    });

    container.querySelector('.timejs-table').onclick = (e) => {
      const span = e.target.closest('.timejs-day');
      if (span) _selectDate(container, viewDate, span.dataset.day);
    };

    container.querySelector('.timejs-today-btn').onclick = () => {
      const now = new Date();
      _selectDate(container, now, now.getDate());
    };

    container.querySelector('.timejs-clear-btn').onclick = () => {
      const input = document.getElementById(container.dataset.controlId);
      if (input) {
        input.value = '';
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
      _closeCalendar(container);
    };
  }

  function _selectDate(container, date, day) {
    const input = document.getElementById(container.dataset.controlId);
    const d = new Date(date.getFullYear(), date.getMonth(), day);
    input.value = `${String(d.getDate()).padStart(2, '0')}-${MONTH_NAMES_SHORT[d.getMonth()]}-${d.getFullYear()}`;
    input.dispatchEvent(new Event('change', { bubbles: true }));
    _closeCalendar(container);
  }

  function _getOrCreateContainer() {
    let c = document.getElementById('timejs-container');
    if (!c) {
      c = document.createElement('div');
      c.id = 'timejs-container';
      c.className = 'timejs-container';
      document.body.appendChild(c);
      document.addEventListener('click', (e) => {
        if (!c.contains(e.target) && !e.target.classList.contains('timejs-input')) _closeCalendar(c);
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') _closeCalendar(c);
      });
    }
    return c;
  }

  function _closeCalendar(c) {
    c.classList.remove('timejs-open');
    const input = document.getElementById(c.dataset.controlId);
    if (input) {
      input.classList.remove('timejs-active');
      if (document.activeElement === document.body) input.focus();
    }
    setTimeout(() => { if(!c.classList.contains('timejs-open')) c.style.display = 'none'; }, 200);
  }

  function _positionBelow(c, input) {
    const r = input.getBoundingClientRect();
    c.style.display = 'block';
    let top = r.bottom + window.scrollY + 4;
    let left = r.left + window.scrollX;
    if (left + 300 > window.innerWidth) left = window.innerWidth - 310;
    c.style.top = top + 'px';
    c.style.left = Math.max(10, left) + 'px';
  }

  function _parseInputValue(v) {
    if (!v) return null;
    const p = v.split('-');
    const m = MONTH_NAMES_SHORT.indexOf(p[1]);
    return (p.length === 3 && m !== -1) ? new Date(p[2], m, p[0]) : null;
  }

  global.openCalendar = openCalendar;
}(window));
 * - Modern card-style UI with smooth animations
 * - Month/Year quick-jump dropdowns
 * - "Today" button jumps to current date
 * - "Clear" button resets the input
 * - Hover tooltips on day cells
 * - Positions itself below the triggering input
 * - Closes on outside click or Escape key
 * - Fires native 'change' event on selection
 * - Zero dependencies, no build step
 */
'use strict';
(function (global) {
  // -------------------------------------------------------------------------
  // Constants
  // -------------------------------------------------------------------------
  const MONTH_NAMES_SHORT = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  const MONTH_NAMES_FULL = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const DAY_HEADERS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  // -------------------------------------------------------------------------
  // Public API
  // -------------------------------------------------------------------------
  /**
   * Open (or reposition) the calendar picker for the given input element.
   * @param {string} controlId - The id of the <input> element to populate.
   */
  function openCalendar(controlId) {
    const input = document.getElementById(controlId);
    if (!controlId || !input) {
      console.error('time.js: element with id "' + controlId + '" not found.');
      return;
    }
    const container = _getOrCreateContainer();
    container.dataset.controlId = controlId;
    // Parse existing value if present, else use today
    let startDate = _parseInputValue(input.value) || new Date();
    _renderCalendar(container, startDate, startDate);
    // Position below the input field
    _positionBelow(container, input);
    container.classList.add('timejs-open');
  }

  // Expose globally
  global.openCalendar = openCalendar;

  // -------------------------------------------------------------------------
  // Rendering
  // -------------------------------------------------------------------------
  /**
   * Build and inject the full calendar HTML into the container.
   * FIX: .timejs-day class is on an inner <span> inside <td>,
   *      NOT on the <td> itself, so table-layout is preserved.
   * @param {HTMLElement} container
   * @param {Date} viewDate - The month being shown
   * @param {Date} selectedDate - Currently selected date (or today)
   */
  function _renderCalendar(container, viewDate, selectedDate) {
    const month = viewDate.getMonth();
    const year  = viewDate.getFullYear();
    const today = new Date();
    const todayDay   = today.getDate();
    const todayMonth = today.getMonth();
    const todayYear  = today.getFullYear();
    const firstWeekday = new Date(year, month, 1).getDay();
    const totalDays    = new Date(year, month + 1, 0).getDate();
    const selDay   = selectedDate ? selectedDate.getDate()     : -1;
    const selMonth = selectedDate ? selectedDate.getMonth()    : -1;
    const selYear  = selectedDate ? selectedDate.getFullYear() : -1;

    // -- Header: month dropdown + year dropdown + nav arrows --
    let monthOptions = MONTH_NAMES_FULL.map(function (name, i) {
      return '<option value="' + i + '"' + (i === month ? ' selected' : '') + '>' + name + '</option>';
    }).join('');

    let yearOptions = '';
    for (let y = year - 10; y <= year + 10; y++) {
      yearOptions += '<option value="' + y + '"' + (y === year ? ' selected' : '') + '>' + y + '</option>';
    }

    // -- Day header row --
    let headerRow = '<tr>' + DAY_HEADERS.map(function (d, i) {
      return '<th class="' + (i === 0 ? 'timejs-sunday' : '') + '">' + d + '</th>';
    }).join('') + '</tr>';

    // -- Day cells --
    // KEY FIX: Each <td> is a plain table cell.
    // The clickable circle is an inner <span class="timejs-day">.
    // This preserves table-layout:fixed grid alignment.
    let rows = '';
    let dayCounter = 0;
    let padding    = firstWeekday;

    for (let row = 0; row < 6 && dayCounter < totalDays; row++) {
      rows += '<tr>';
      for (let col = 0; col < 7; col++) {
        if (dayCounter >= totalDays) {
          rows += '<td></td>';
        } else if (padding > 0) {
          rows += '<td></td>';
          padding--;
        } else {
          dayCounter++;
          let cls = ['timejs-day'];
          if (col === 0)                                                              cls.push('timejs-sunday');
          if (dayCounter === todayDay && month === todayMonth && year === todayYear)  cls.push('timejs-today');
          if (dayCounter === selDay   && month === selMonth   && year === selYear)    cls.push('timejs-selected');
          const label = dayCounter + ' ' + MONTH_NAMES_FULL[month] + ' ' + year;
          rows += '<td data-day="' + dayCounter + '"><span class="' + cls.join(' ') +
                  '" data-day="' + dayCounter + '" title="' + label + '">' +
                  dayCounter + '</span></td>';
        }
      }
      rows += '</tr>';
    }

    container.innerHTML =
      '<div class="timejs-header">' +
        '<button class="timejs-nav timejs-prev" data-dir="-1" title="Previous month">&#8249;</button>' +
        '<div class="timejs-header-selects">' +
          '<select class="timejs-month-select" data-field="month">' + monthOptions + '</select>' +
          '<select class="timejs-year-select" data-field="year">' + yearOptions + '</select>' +
        '</div>' +
        '<button class="timejs-nav timejs-next" data-dir="1" title="Next month">&#8250;</button>' +
      '</div>' +
      '<table class="timejs-table"><thead>' + headerRow + '</thead><tbody>' + rows + '</tbody></table>' +
      '<div class="timejs-footer">' +
        '<button class="timejs-btn timejs-today-btn" title="Go to today">Today</button>' +
        '<button class="timejs-btn timejs-clear-btn" title="Clear date">Clear</button>' +
      '</div>';

    container.style.display = 'block';
    _attachEvents(container, viewDate, selectedDate);
  }

  // -------------------------------------------------------------------------
  // Events
  // -------------------------------------------------------------------------
  /**
   * Attach event listeners to the rendered calendar.
   */
  function _attachEvents(container, viewDate, selectedDate) {
    // Prev / Next month navigation
    container.querySelectorAll('.timejs-nav').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        const dir     = parseInt(btn.dataset.dir, 10);
        const newView = _addMonths(viewDate, dir);
        _renderCalendar(container, newView, selectedDate);
      });
    });

    // Month/Year dropdown quick-jump
    container.querySelectorAll('.timejs-month-select, .timejs-year-select').forEach(function (sel) {
      sel.addEventListener('change', function (e) {
        e.stopPropagation();
        const newMonth = parseInt(container.querySelector('.timejs-month-select').value, 10);
        const newYear  = parseInt(container.querySelector('.timejs-year-select').value,  10);
        const newView  = new Date(newYear, newMonth, 1);
        _renderCalendar(container, newView, selectedDate);
      });
    });

    // Day span click — target .timejs-day span inside <td>
    container.querySelector('.timejs-table').addEventListener('click', function (e) {
      const span = e.target.closest('.timejs-day');
      if (!span || !span.dataset.day) return;
      e.stopPropagation();
      const day   = parseInt(span.dataset.day, 10);
      const month = viewDate.getMonth();
      const year  = viewDate.getFullYear();
      const input = document.getElementById(container.dataset.controlId);
      if (!input) return;
      // Format: DD-Mon-YYYY (e.g. 21-Feb-2026)
      const formatted = _pad(day) + '-' + MONTH_NAMES_SHORT[month] + '-' + year;
      input.value = formatted;
      input.dispatchEvent(new Event('change', { bubbles: true }));
      _closeCalendar(container);
    });

    // Today button
    container.querySelector('.timejs-today-btn').addEventListener('click', function (e) {
      e.stopPropagation();
      const now = new Date();
      _renderCalendar(container, now, now);
    });

    // Clear button
    container.querySelector('.timejs-clear-btn').addEventListener('click', function (e) {
      e.stopPropagation();
      const input = document.getElementById(container.dataset.controlId);
      if (input) {
        input.value = '';
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
      _closeCalendar(container);
    });
  }

  // -------------------------------------------------------------------------
  // Container management
  // -------------------------------------------------------------------------
  function _getOrCreateContainer() {
    let container = document.getElementById('timejs-container');
    if (!container) {
      container = document.createElement('div');
      container.id        = 'timejs-container';
      container.className = 'timejs-container';
      document.body.appendChild(container);

      // Close on outside click
      document.addEventListener('click', function (e) {
        if (!container.contains(e.target) && !e.target.classList.contains('timejs-input')) {
          _closeCalendar(container);
        }
      });

      // Close on Escape key
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') _closeCalendar(container);
      });
    }
    return container;
  }

  function _closeCalendar(container) {
    container.classList.remove('timejs-open');
    setTimeout(function () {
      container.style.display = 'none';
      container.innerHTML     = '';
    }, 180);
  }

  // -------------------------------------------------------------------------
  // Helpers
  // -------------------------------------------------------------------------
  /**
   * Position the calendar directly below the given input element.
   * @param {HTMLElement} container
   * @param {HTMLElement} input
   */
  function _positionBelow(container, input) {
    const rect       = input.getBoundingClientRect();
    const scrollTop  = window.scrollY  || document.documentElement.scrollTop;
    const scrollLeft = window.scrollX  || document.documentElement.scrollLeft;
    container.style.top  = (rect.bottom + scrollTop  + 4) + 'px';
    container.style.left = (rect.left   + scrollLeft)     + 'px';
  }

  /**
   * Add (or subtract) months to a Date without day overflow.
   * @param {Date} date
   * @param {number} delta
   * @returns {Date}
   */
  function _addMonths(date, delta) {
    const result  = new Date(date.getFullYear(), date.getMonth() + delta, 1);
    const lastDay = new Date(result.getFullYear(), result.getMonth() + 1, 0).getDate();
    result.setDate(Math.min(date.getDate(), lastDay));
    return result;
  }

  /**
   * Try to parse a "DD-Mon-YYYY" string back into a Date.
   * @param {string} val
   * @returns {Date|null}
   */
  function _parseInputValue(val) {
    if (!val) return null;
    const parts = val.split('-');
    if (parts.length !== 3) return null;
    const day   = parseInt(parts[0], 10);
    const month = MONTH_NAMES_SHORT.indexOf(parts[1]);
    const year  = parseInt(parts[2], 10);
    if (isNaN(day) || month < 0 || isNaN(year)) return null;
    return new Date(year, month, day);
  }

  /**
   * Zero-pad a number to 2 digits.
   * @param {number} n
   * @returns {string}
   */
  function _pad(n) {
    return n < 10 ? '0' + n : String(n);
  }

}(window));

