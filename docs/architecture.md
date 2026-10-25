# Architecture tree

```
accessibility-baseline/
├── client/            # Static front end (no build step): UI + accessibility behaviour
│   └── public/        # index.html, styles.css, app.js
├── server/            # HTTP API + static hosting: validation and persistence
│   ├── src/           # app.js (routing), validate.js (rules), store.js (disk), index.js (entry)
│   └── data/          # Runtime JSON data (git-ignored)
├── docs/
│   ├── audit/         # audit-report.md, worksheet CSV, keyboard-pass.md, screenshots/
│   └── architecture.md
├── tests/             # node:test API + validation tests
├── scripts/           # run-lighthouse.sh
└── package.json       # start, dev, test, audit:lighthouse
```
