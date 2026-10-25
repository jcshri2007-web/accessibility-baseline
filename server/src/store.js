// Tiny JSON-file store. Boundary: only this module touches the disk.
const fs = require('node:fs');
const path = require('node:path');

function file() { return process.env.DATA_FILE || path.join(__dirname, '..', 'data', 'reports.json'); }

function readAll() {
  try { return JSON.parse(fs.readFileSync(file(), 'utf8')); }
  catch { return []; }
}
function writeAll(items) {
  fs.mkdirSync(path.dirname(file()), { recursive: true });
  fs.writeFileSync(file(), JSON.stringify(items, null, 2));
}
function add(item) {
  const items = readAll();
  const saved = { id: items.length + 1, createdAt: new Date().toISOString(), ...item };
  items.push(saved);
  writeAll(items);
  return saved;
}
module.exports = { readAll, add };
