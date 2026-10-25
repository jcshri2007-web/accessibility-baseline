const test = require('node:test');
const assert = require('node:assert');
const os = require('node:os');
const path = require('node:path');
process.env.DATA_FILE = path.join(os.tmpdir(), `reports-${Date.now()}.json`);
const { createServer } = require('../server/src/app');
const { validateReport } = require('../server/src/validate');

test('validation rejects empty input with readable messages', () => {
  const r = validateReport({});
  assert.equal(r.valid, false);
  assert.ok(r.errors.page && r.errors.description && r.errors.severity);
});

test('API: health, create, list, reject, serves client, blocks traversal', async () => {
  const server = createServer(); await new Promise((r) => server.listen(0, r));
  const base = `http://localhost:${server.address().port}`;
  assert.equal((await fetch(`${base}/api/health`)).status, 200);
  assert.equal((await fetch(`${base}/api/reports`, { method: 'POST', body: '{}' })).status, 422);
  const ok = await fetch(`${base}/api/reports`, { method: 'POST', body: JSON.stringify({ page: 'Nav', description: 'Menu not keyboard reachable', severity: 'high' }) });
  assert.equal(ok.status, 201);
  assert.equal((await (await fetch(`${base}/api/reports`)).json()).length, 1);
  assert.match(await (await fetch(`${base}/`)).text(), /Skip to main content/);
  assert.equal((await fetch(`${base}/..%2f..%2fpackage.json`)).status, 404);
  server.close();
});
