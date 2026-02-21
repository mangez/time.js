/**
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
    // Use rAF so the open-click doesn't immediately trigger the outside-click handler
    requestAnimationFrame(() => container.classList.add('timejs-open'));
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
        if (padding > 0) {
          rows += '<td></td>';
          padding--;
        } else if (dayCounter < totalDays) {
          dayCounter++;
          let cls = ['timejs-day'];
          if (col === 0) cls.push('timejs-sunday');
          if (dayCounter === today.getDate() && month === today.getMonth() && year === today.getFullYear()) cls.push('timejs-today');
          if (selectedDate && dayCounter === selectedDate.getDate() && month === selectedDate.getMonth() && year === selectedDate.getFullYear()) cls.push('timejs-selected');
          rows += `<td><span class="${cls.join(' ')}" data-day="${dayCounter}" tabindex="0" role="button" aria-label="${dayCounter} ${MONTH_NAMES_FULL[month]} ${year}">${dayCounter}</span></td>`;
        } else {
          rows += '<td></td>';
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
    container.style.display = 'block';
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
        const m = parseInt(container.querySelector('.timejs-month-select').value, 10);
        const y = parseInt(container.querySelector('.timejs-year-select').value, 10);
        _renderCalendar(container, new Date(y, m, 1), selectedDate);
      };
    });

    container.querySelector('.timejs-table').onclick = (e) => {
      const span = e.target.closest('.timejs-day');
      if (span && span.dataset.day) _selectDate(container, viewDate, parseInt(span.dataset.day, 10));
    };

    container.querySelector('.timejs-today-btn').onclick = (e) => {
      e.stopPropagation();
      const now = new Date();
      _selectDate(container, now, now.getDate());
    };

    container.querySelector('.timejs-clear-btn').onclick = (e) => {
      e.stopPropagation();
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
    if (!input) return;
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
      // Close on outside click — use capture phase so it runs before inner handlers
      document.addEventListener('click', (e) => {
        if (!c.classList.contains('timejs-open')) return;
        if (c.contains(e.target)) return;
        if (e.target.classList.contains('timejs-input')) return;
        _closeCalendar(c);
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
    if (input) input.classList.remove('timejs-active');
    setTimeout(() => {
      if (!c.classList.contains('timejs-open')) {
        c.style.display = 'none';
        if (input && document.body === document.activeElement) input.focus();
      }
    }, 200);
  }

  function _positionBelow(c, input) {
    c.style.display = 'block';
    const r = input.getBoundingClientRect();
    let top = r.bottom + window.scrollY + 4;
    let left = r.left + window.scrollX;
    // Keep within viewport bounds
    if (left + 300 > window.innerWidth) left = Math.max(8, window.innerWidth - 308);
    c.style.top = top + 'px';
    c.style.left = Math.max(8, left) + 'px';
  }

  function _parseInputValue(v) {
    if (!v) return null;
    const p = v.split('-');
    if (p.length !== 3) return null;
    const m = MONTH_NAMES_SHORT.indexOf(p[1]);
    return m !== -1 ? new Date(parseInt(p[2], 10), m, parseInt(p[0], 10)) : null;
  }

  global.openCalendar = openCalendar;
}(window));
