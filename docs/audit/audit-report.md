# Accessibility Baseline Audit

**Site audited:** https://trivandrum.nic.in/en/departments/ (Thiruvananthapuram District, Government of Kerala)
**Date:** 25 October 2026
**Tools:** Lighthouse 13.5.0 in Chromium 156 (mobile emulation: Moto G Power, slow 4G, initial page load); keyboard-only pass
**Evidence file:** `lighthouse-report-trivandrum.pdf`

## 1. Lighthouse scores
| Category | Score | Notes |
|---|---|---|
| Performance | 69 | FCP 3.7 s, LCP 6.4 s, Speed Index 3.7 s, TBT 40 ms, CLS 0 |
| Accessibility | 92 | 2 failed audits, 10 items need manual checking |
| Best Practices | 73 | console errors, deprecated API, image aspect ratio |
| SEO | 92 | "Links are not crawlable" failed |

Screenshots: add images of the PDF score page and failed audits to `screenshots/`.

## 2. Keyboard pass summary
_To be completed from `keyboard-pass.md` after testing the live site with Tab / Shift+Tab / Enter / Esc._

## 3. Five documented issues
Full detail is in `accessibility-audit-worksheet.csv`.

| Priority | ID | Issue | WCAG | Severity |
|---|---|---|---|---|
| 1 | WEB-001 | Form elements without associated labels | 1.3.1, 3.3.2, 4.1.2 | High |
| 2 | WEB-003 | Slow render: LCP 6.4 s, render-blocking requests | n/a (usability) | High |
| 3 | WEB-002 | Lists contain non-`<li>` elements | 1.3.1 | Medium |
| 4 | WEB-004 | Uncached, unoptimised assets (about 2 MiB of savings) | n/a (architecture) | Medium |
| 5 | WEB-005 | Console errors, deprecated API, wrong image aspect ratios | best practice | Medium |

Priority rule: Critical (blocks a task for a user group) → High (major barrier or large impact) → Medium → Low.

Also worth checking in the keyboard pass: Lighthouse reports "Links are not crawlable" (SEO). If those are links without a real `href` driven by JavaScript, they may also be unreachable by keyboard (WCAG 2.1.1). Add it as a finding only if you confirm it.

## 4. How findings shaped this project
- Unlabelled form fields → every field in `client/public/index.html` has a visible `<label>` plus hint and error text.
- Invalid list markup → the repo uses semantic `ul`/`li`, landmarks and one `h1`.
- Slow, render-blocking pages → the client is a small static page with no framework, one stylesheet and one deferred-free script at the end of `<body>`.
- Uncached, unoptimised assets → the server only serves three small files; caching headers are the first item on the roadmap.
- Console errors and brittle scripts → `tests/api.test.js` covers the API, and validation lives on the server so the page never depends on client scripts alone.
