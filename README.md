# WLA E2E Tests

End-to-end test suite for the [Websites List App (WLA)](https://github.com/dyaroman/wla-react) —
built with [CodeceptJS](https://codecept.io/) v4 and [Playwright](https://playwright.dev/).

## Related Projects

- **[wla-react](https://github.com/dyaroman/wla-react)** – React 19 frontend (the app under test)
- **[wla-api-supabase](https://github.com/dyaroman/wla-api-supabase)** – Supabase Edge Function backend

---

## Test Coverage

| Test file                 | What it covers                                                    |
| ------------------------- | ----------------------------------------------------------------- |
| `text`                    | Page title, sidebar info (env, commit, timestamp), column headers |
| `pagination`              | Per-page selector, page navigation, correct row counts            |
| `links`                   | External links open in new tab, href values are valid             |
| `parse-url`               | URL params restore filter and display state on page load          |
| `quick-search`            | Search input filters rows, clears correctly, is case-insensitive  |
| `strict-equal-search`     | Strict-match filter returns only exact matches                    |
| `strict-not-equal-search` | Strict-not-equal filter excludes matched rows                     |
| `non-empty-input`         | Non-empty filter hides rows with blank values                     |
| `show-columns`            | Column visibility toggle shows/hides correct columns              |
| `customize-columns`       | Column reordering is reflected in the table                       |
| `page-column`             | Page-type column renders correct values                           |
| `sort-url-parameters`     | URL parameters are sorted deterministically                       |
| `color-cells`             | Cell background colors match expected palette                     |
| `highlight-text`          | Search term is highlighted in matching cells                      |
| `clipboard`               | Copy-to-clipboard action writes correct content                   |
| `shortcuts`               | Keyboard shortcuts trigger expected actions                       |
| `tags`                    | Tag filter enables/disables related options correctly             |
| `toggle-theme`            | Theme switch persists the selected mode                           |
| `info-modal`              | Info modal opens, displays correct data, closes                   |
| `empty`                   | Empty-state screen renders when no data is present                |

---

## Tech Stack

- **[CodeceptJS](https://codecept.io/) v4** — test runner with a human-readable DSL
- **[Playwright](https://playwright.dev/)** — browser automation (Chromium)
- **[Prettier](https://prettier.io/)** — code formatting
- **[Husky](https://typicode.github.io/husky/) + lint-staged** — pre-commit formatting hook

---

## Local Setup

### Prerequisites

- Node.js 18+
- A locally running instance of [wla-react](https://github.com/dyaroman/wla-react),
  or point the tests at the live demo by editing `misc/config.js`

### Install

```sh
npm install
npx playwright install chromium
```

### Run all tests

```sh
npx codeceptjs run
```

### Run in headless mode

```sh
HEADLESS=true npx codeceptjs run
```

### Run a single test file

```sh
npx codeceptjs run tests/pagination.test.js
```

### Run with step-by-step output

```sh
npx codeceptjs run --steps
```

Screenshots of failed tests are saved to the `output/` directory.
