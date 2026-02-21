/**
 * time.js - Lightweight vanilla JS date-picker / calendar widget
 * Repository: https://github.com/mangez/time.js
 * License: MIT
 */

'use strict';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Open the calendar picker attached to the given input element.
 * @param {string} controlId - The id of the <input> element to populate.
 */
function openCalendar(controlId) {
  if (!controlId || !document.getElementById(controlId)) {
    console.error('time.js: element with id "' + controlId + '" not found.');
    return;
  }

  // Store controlId on the calendar container so multiple pickers on the
  // same page do not interfere with each other.
  const container = _getOrCreateContainer();
  container.dataset.controlId = controlId;

  const cal = new Calendar(new Date());
  cal.render(container);
  _attachEvents(cal, container);
}

// ---------------------------------------------------------------------------
// Date helpers
// ---------------------------------------------------------------------------

/**
 * Add (or subtract) a number of months to a Date, clamping the day to the
 * last day of the resulting month when necessary.
 *
 * @param {Date}   date  - Source date.
 * @param {number} delta - Months to add (negative to subtract).
 * @returns {Date} New Date in the target month.
 */
function _addMonths(date, delta) {
  // Work from the 1st to avoid day-overflow while changing month.
  const result = new Date(date.getFullYear(), date.getMonth(), 1);
  result.setMonth(result.getMonth() + delta);

  // Clamp day: if the original day exceeds the last day of the target month,
  // use the last day instead.
  const lastDay = new Date(result.getFullYear(), result.getMonth() + 1, 0).getDate();
  result.setDate(Math.min(date.getDate(), lastDay));
  return result;
}

// ---------------------------------------------------------------------------
// Navigation handlers (called from rendered calendar HTML)
// ---------------------------------------------------------------------------

/**
 * Navigate the open calendar to the previous month.
 * @param {number} day   - Current day.
 * @param {number} month - Current month index (0-based).
 * @param {number} year  - Current full year.
 * @param {string} containerId - Id of the calendar container element.
 */
function navigateToPreviousMonth(day, month, year, containerId) {
  const current = new Date(year, month, day);
  const prev = _addMonths(current, -1);
  const container = document.getElementById(containerId);
  if (!container) return;
  const cal = new Calendar(prev);
  cal.render(container);
  _attachEvents(cal, container);
}

/**
 * Navigate the open calendar to the next month.
 * @param {number} day   - Current day.
 * @param {number} month - Current month index (0-based).
 * @param {number} year  - Current full year.
 * @param {string} containerId - Id of the calendar container element.
 */
function navigateToNextMonth(day, month, year, containerId) {
  const current = new Date(year, month, day);
  const next = _addMonths(current, 1);
  const container = document.getElementById(containerId);
  if (!container) return;
  const cal = new Calendar(next);
  cal.render(container);
  _attachEvents(cal, container);
}

// ---------------------------------------------------------------------------
// Calendar class
// ---------------------------------------------------------------------------

class Calendar {
  /**
   * @param {Date} date - The month/day this calendar instance represents.
   */
  constructor(date) {
    this.d = date;
    this.day   = date.getDate();
    this.month = date.getMonth();
    this.year  = date.getFullYear();

    this.firstDayOfMonth = new Date(this.year, this.month, 1);
    this.lastDayOfMonth  = new Date(this.year, this.month + 1, 0);

    const today = new Date();
    this.todayDay   = today.getDate();
    this.todayMonth = today.getMonth();
    this.todayYear  = today.getFullYear();
  }

  /**
   * Build the calendar HTML and inject it into the given container element.
   * @param {HTMLElement} container
   */
  render(container) {
    const containerId = container.id;
    const { month, year, day } = this;
    const firstWeekday   = this.firstDayOfMonth.getDay(); // 0 = Sunday
    const totalDays      = this.lastDayOfMonth.getDate();

    // Navigation arrows pass the container id so multiple pickers work independently.
    let html = `
      <table class="calendar-table" id="calTable_${containerId}">
        <caption class="calendar-caption">
          <span class="nav-arrow nav-left"
            onclick="navigateToPreviousMonth(${day},${month},${year},'${containerId}')"
            role="button" aria-label="Previous month">&#9664;</span>
          ${MONTH_NAMES[month]} ${year}
          <span class="nav-arrow nav-right"
            onclick="navigateToNextMonth(${day},${month},${year},'${containerId}')"
            role="button" aria-label="Next month">&#9654;</span>
        </caption>
        <thead>
          <tr>
            <th scope="col">S</th><th scope="col">M</th><th scope="col">T</th>
            <th scope="col">W</th><th scope="col">T</th><th scope="col">F</th>
            <th scope="col">S</th>
          </tr>
        </thead>
        <tbody>`;

    let dayCounter = 0;
    let padding = firstWeekday;

    for (let row = 0; row < 6 && dayCounter < totalDays; row++) {
      html += '<tr>';
      for (let col = 0; col < 7 && dayCounter < totalDays; col++) {
        if (padding > 0) {
          html += '<td></td>';
          padding--;
        } else {
          dayCounter++;
          let cls = '';
          if (col === 0) cls += ' sunday';
          if (
            dayCounter === this.todayDay &&
            month === this.todayMonth &&
            year === this.todayYear
          ) cls += ' today';

          html += `<td class="${cls.trim()}" data-day="${dayCounter}">${dayCounter}</td>`;
        }
      }
      html += '</tr>';
    }

    html += '</tbody></table>';
    container.innerHTML = html;
    container.style.display = 'block';
  }
}

// ---------------------------------------------------------------------------
// Event handling
// ---------------------------------------------------------------------------

/**
 * Attach a single delegated click listener to the calendar container.
 * Replaces the old listener each time to avoid accumulation.
 *
 * @param {Calendar}    cal       - The active Calendar instance.
 * @param {HTMLElement} container - The calendar container element.
 */
function _attachEvents(cal, container) {
  // Remove previous listener by cloning the table node.
  const oldTable = container.querySelector('.calendar-table');
  if (oldTable) {
    const newTable = oldTable.cloneNode(true);
    oldTable.parentNode.replaceChild(newTable, oldTable);
  }

  const table = container.querySelector('.calendar-table');
  if (!table) return;

  table.addEventListener('click', function (event) {
    const td = event.target;
    if (td.tagName !== 'TD' || !td.dataset.day) return;

    const selectedDay = td.dataset.day;
    const controlId   = container.dataset.controlId;
    const input       = document.getElementById(controlId);

    if (!input) {
      console.error('time.js: target input "' + controlId + '" not found.');
      return;
    }

    // Write date in DD-Mon-YYYY format (e.g. 21-Feb-2026).
    input.value = selectedDay + '-' + MONTH_NAMES[cal.month] + '-' + cal.year;

    // Dispatch a native change event so frameworks and listeners are notified.
    input.dispatchEvent(new Event('change', { bubbles: true }));

    // Close the calendar.
    container.style.display = 'none';
    container.innerHTML = '';
  });
}

// ---------------------------------------------------------------------------
// Container management
// ---------------------------------------------------------------------------

/**
 * Return (or create) the shared calendar container div.
 * Using a single container per page keeps the DOM clean.
 * @returns {HTMLElement}
 */
function _getOrCreateContainer() {
  let container = document.getElementById('timejs-calendar-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'timejs-calendar-container';
    container.className = 'calendar-container';
    // Close calendar when clicking outside.
    document.addEventListener('click', function (e) {
      if (!container.contains(e.target) && !e.target.classList.contains('timejs-input')) {
        container.style.display = 'none';
        container.innerHTML = '';
      }
    });
    document.body.appendChild(container);
  }
  return container;
}
