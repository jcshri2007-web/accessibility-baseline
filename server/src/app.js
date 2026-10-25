const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const store = require('./store');
const { validateReport } = require('./validate');

const PUBLIC = path.join(__dirname, '..', '..', 'client', 'public');
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8' };

function send(res, status, body, type = 'application/json') {
  res.writeHead(status, { 'Content-Type': type, 'X-Content-Type-Options': 'nosniff' });
  res.end(typeof body === 'string' || Buffer.isBuffer(body) ? body : JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (c) => { data += c; if (data.length > 1e5) req.destroy(); });
    req.on('end', () => { try { resolve(JSON.parse(data || '{}')); } catch (e) { reject(e); } });
  });
}

function createServer() {
  return http.createServer(async (req, res) => {
    const url = new URL(req.url, 'http://localhost');
    if (url.pathname === '/api/health') return send(res, 200, { ok: true });
    if (url.pathname === '/api/reports' && req.method === 'GET') return send(res, 200, store.readAll());
    if (url.pathname === '/api/reports' && req.method === 'POST') {
      let body;
      try { body = await readBody(req); } catch { return send(res, 400, { errors: { form: 'Invalid request.' } }); }
      const { valid, errors, value } = validateReport(body);
      if (!valid) return send(res, 422, { errors });
      return send(res, 201, store.add(value));
    }
    let rel;
    try { rel = url.pathname === '/' ? 'index.html' : decodeURIComponent(url.pathname.slice(1)); }
    catch { return send(res, 400, 'Bad request', 'text/plain'); }
    const file = path.normalize(path.join(PUBLIC, rel));
    if (!file.startsWith(PUBLIC) || !fs.existsSync(file) || fs.statSync(file).isDirectory())
      return send(res, 404, 'Not found', 'text/plain');
    send(res, 200, fs.readFileSync(file), TYPES[path.extname(file)] || 'application/octet-stream');
  });
}
module.exports = { createServer };
