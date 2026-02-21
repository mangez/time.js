# time.js

> Lightweight vanilla JavaScript date-picker / calendar widget. No dependencies. No build step.

![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?logo=javascript)
![CSS3](https://img.shields.io/badge/CSS3-styled-blue?logo=css3)
![License](https://img.shields.io/badge/License-MIT-green)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)

---

## Demo

Open `index.html` directly in any modern browser — no server required.

A live GitHub Pages demo is available at:
**https://mangez.github.io/time.js/**

---

## Features

- Zero dependencies — pure vanilla JS + CSS
- Lightweight: `< 10 KB` JS, `< 3 KB` CSS (unminified)
- Multiple independent date-pickers on the same page
- Today's date highlighted automatically
- Sunday column highlighted in red
- Month navigation (previous / next)
- Fires a native `change` event on the input when a date is selected
- Closes automatically when clicking outside
- `'use strict'` mode — no implicit globals
- JSDoc-documented public API

---

## Quick Start

1. Copy `time.js` and `time.css` into your project.

2. Add the stylesheet in `<head>`:

```html
<link rel="stylesheet" href="time.css" />
```

3. Add the script before `</body>`:

```html
<script src="time.js"></script>
```

4. Create an input and attach the picker via `addEventListener`:

```html
<input type="text" id="myDate" class="timejs-input" placeholder="DD-Mon-YYYY" readonly />

<script>
  document.getElementById('myDate').addEventListener('click', function () {
    openCalendar(this.id);
  });
</script>
```

### Multiple pickers

Each input gets its own picker — no configuration needed:

```html
<input type="text" id="startDate" class="timejs-input" readonly />
<input type="text" id="endDate"   class="timejs-input" readonly />

<script>
  document.querySelectorAll('.timejs-input').forEach(function (input) {
    input.addEventListener('click', function () {
      openCalendar(this.id);
    });
  });
</script>
```

---

## API

### `openCalendar(controlId)`

Opens the calendar picker and binds it to the input element with the given `id`.

| Parameter   | Type     | Description                              |
|-------------|----------|------------------------------------------|
| `controlId` | `string` | The `id` of the target `<input>` element |

When the user clicks a date, the input's `value` is set to `DD-Mon-YYYY` format (e.g. `21-Feb-2026`) and a native `change` event is dispatched on the input.

---

## Output Format

Selected dates are written as `DD-Mon-YYYY`, for example:

| Selected   | Written value |
|------------|---------------|
| 1 Jan 2026 | `1-Jan-2026`  |
| 21 Feb 2026 | `21-Feb-2026` |

---

## Browser Support

Works in all modern browsers (Chrome, Firefox, Safari, Edge). Requires ES6+ (`class`, `const`, template literals).

---

## Project Structure

```
time.js/
├── time.js             # Calendar widget — core logic
├── time.css            # Calendar widget — styles
├── index.html          # Demo page (two independent pickers)
├── CONTRIBUTING.md     # Contribution guide
├── CODE_OF_CONDUCT.md  # Community standards
├── LICENSE             # MIT License
└── README.md           # This file
```

---

## Contributing

Contributions are welcome!

- To use the widget: just copy `time.js` and `time.css` — no sign-up required.
- To propose a fix or feature: fork → branch → PR against `master`.

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full workflow, branch naming conventions, and feature ideas.

---

## License

[MIT](LICENSE) © mangez
