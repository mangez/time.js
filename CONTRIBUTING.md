# Contributing to time.js

Thank you for your interest in contributing to **time.js**! Contributions of all kinds are welcome — bug fixes, new features, documentation improvements, and more.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Development Setup](#development-setup)
- [Coding Guidelines](#coding-guidelines)
- [Commit Message Format](#commit-message-format)
- [Pull Request Process](#pull-request-process)
- [Feature Ideas](#feature-ideas)

---

## Code of Conduct

This project follows our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it before participating.

---

## Getting Started

1. **Fork** this repository to your GitHub account.
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/<your-username>/time.js.git
   cd time.js
   ```
3. Create a new branch for your change:
   ```bash
   git checkout -b feat/my-new-feature
   ```
4. Make your changes, then push:
   ```bash
   git push origin feat/my-new-feature
   ```
5. Open a **Pull Request** against the `master` branch.

---

## How to Contribute

### Reporting Bugs

- Search [existing issues](https://github.com/mangez/time.js/issues) first.
- Open a new issue with a clear title, steps to reproduce, expected vs actual behaviour, and browser/OS details.

### Suggesting Features

- Open a [feature request issue](https://github.com/mangez/time.js/issues/new) describing the use-case and proposed API.

### Submitting Code

- Keep changes focused — one fix or feature per PR.
- Write clear commit messages (see below).
- Make sure `index.html` still works correctly in a browser before submitting.

---

## Development Setup

No build step is required. time.js is vanilla JavaScript.

1. Clone the repo (see above).
2. Open `index.html` directly in your browser, or use a simple local server:
   ```bash
   npx serve .
   # or
   python3 -m http.server
   ```
3. Edit `time.js` and `time.css`, then reload the browser to test.

---

## Coding Guidelines

- Use `'use strict';` at the top of all JS files.
- Prefer `const` / `let` over `var`.
- No global variable pollution — wrap code in IIFEs or modules.
- Use JSDoc comments for all public functions.
- Follow the existing 2-space indentation style.
- Ensure keyboard accessibility (tab focus, ARIA attributes where needed).
- Test in Chrome, Firefox, and Safari before submitting.

---

## Commit Message Format

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>: <short description>
```

| Type     | When to use                          |
|----------|--------------------------------------|
| `feat`   | New feature                          |
| `fix`    | Bug fix                              |
| `docs`   | Documentation only                   |
| `style`  | Formatting, no logic change          |
| `refactor` | Code restructure, no behaviour change |
| `test`   | Adding or updating tests             |
| `chore`  | Build scripts, config, CI            |

**Examples:**
```
feat: add time range picker support
fix: correct month boundary in calendar navigation
docs: update README with API table
```

---

## Pull Request Process

1. Fill in the PR template completely.
2. Reference any related issues (e.g., `Closes #12`).
3. Ensure all conversations in review are resolved before requesting a re-review.
4. A maintainer will review and merge once approved.
5. PRs that add features should also update the README.

---

## Feature Ideas

Looking for something to work on? Here are some ideas:

- **Time range picker** — allow selecting a start and end time.
- **Dark mode** — CSS custom properties for theming.
- **Locale support** — AM/PM vs 24-hour based on locale.
- **Keyboard navigation** — full arrow-key control of the picker.
- **React / Vue wrapper** — thin component wrapper around the core.
- **npm package** — publish to npm with ES module export.
- **Accessibility audit** — WCAG 2.1 AA compliance pass.

---

Thank you for contributing! 🎉
