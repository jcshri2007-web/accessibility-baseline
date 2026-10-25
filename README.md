# Accessibility Baseline & Repository Architecture Audit

An audit of a real public service website, turned into an accessible, maintainable full-stack project foundation.

**Site audited:** [Thiruvananthapuram District, Departments page](https://trivandrum.nic.in/en/departments/)
**Audit date:** 25 October 2026
**Tools:** Lighthouse 13.5.0 (mobile emulation) and a keyboard-only navigation pass

## Audit summary

| Category | Score |
|---|---|
| Performance | 69 |
| Accessibility | 92 |
| Best Practices | 73 |
| SEO | 92 |

Five issues are documented with evidence, WCAG references, severity and fixes:

| ID | Issue | Severity |
|---|---|---|
| WEB-001 | Form elements without associated labels | High |
| WEB-003 | Slow render: LCP 6.4 s, render-blocking requests | High |
| WEB-002 | Lists contain elements other than `<li>` | Medium |
| WEB-004 | Uncached and unoptimised assets | Medium |
| WEB-005 | Console errors, deprecated API, wrong image aspect ratios | Medium |

Full details are in:
- [Audit report](docs/audit/audit-report.md)
- [Audit worksheet (CSV)](docs/audit/accessibility-audit-worksheet.csv)
- [Keyboard-only pass](docs/audit/keyboard-pass.md)
- [Lighthouse report (PDF)](docs/audit/lighthouse-report-trivandrum.pdf)
- [Screenshots](docs/audit/screenshots/)

## Architecture

```
accessibility-baseline/
├── client/            # Static front end (no build step): UI and accessibility behaviour
│   └── public/        # index.html, styles.css, app.js
├── server/            # HTTP API and static hosting: validation and persistence
│   ├── src/           # app.js (routing), validate.js (rules), store.js (disk), index.js (entry)
│   └── data/          # Runtime JSON data (git-ignored)
├── docs/
│   ├── audit/         # Audit report, worksheet CSV, keyboard pass, screenshots
│   └── architecture.md
├── tests/             # node:test API and validation tests
├── scripts/           # run-lighthouse.sh
└── package.json       # start, dev, test, audit:lighthouse
```

### Boundaries

| Layer | Folder | Responsibility | Must not |
|---|---|---|---|
| Client | `client/` | Markup, styling, focus and error behaviour | Hold business rules |
| Server | `server/` | Routing, validation, persistence | Render UI |
| Docs | `docs/` | Audit evidence, architecture decisions | Contain code |
| Tests | `tests/` | Verify the API and validation contract | Depend on client internals |

Inside `server/src`, `app.js` handles HTTP, `validate.js` holds the rules, and `store.js` is the only module that touches the disk. Replacing the JSON file with a database means changing `store.js` only.

## Local setup

Requires Node.js 18 or newer. No other dependencies are needed.

```bash
git clone <your-repo-url>
cd accessibility-baseline
npm test     # run the tests
npm start    # open http://localhost:3000
```

Optional: `npm run audit:lighthouse -- <url>` runs Lighthouse on any public site (needs Chrome and internet).

## First vertical slice: report an accessibility issue

A user fills in a form, the server validates it, stores it, and the page lists all reports.

`Form` → `POST /api/reports` → validation (422 with readable errors) → `store.js` → `GET /api/reports` → results table

It touches every layer, and applies what the audit found:
- every form field has a visible label, hint and error message
- an error summary with links to each field, and focus moves to it on errors
- skip link, landmarks, one `h1`, and a table with proper headers
- visible keyboard focus and 44 px minimum click targets
- results announced to screen readers through a status region
- small static assets with no framework, to keep load times low

## Roadmap

- Edit and close issues, with a status field
- Cache headers and compressed assets
- Authentication
- CSV export of the worksheet
- axe-core accessibility checks in CI
