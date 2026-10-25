const form = document.getElementById('report-form');
const summary = document.getElementById('error-summary');
const rows = document.getElementById('report-rows');
const status = document.getElementById('status');
const FIELDS = ['page', 'description', 'severity'];

function clearErrors() {
  summary.hidden = true; summary.textContent = '';
  FIELDS.forEach((f) => {
    const e = document.getElementById(`${f}-error`); e.hidden = true; e.textContent = '';
    if (f !== 'severity') {
      const input = form.elements[f];
      input.removeAttribute('aria-invalid');
      input.closest('.field').classList.remove('invalid');
    }
  });
}

function showErrors(errors) {
  const list = document.createElement('ul');
  const h = document.createElement('h3'); h.textContent = 'There is a problem';
  Object.entries(errors).forEach(([field, msg]) => {
    const li = document.createElement('li'); const a = document.createElement('a');
    a.href = `#${field === 'severity' ? 'sev-low' : field}`; a.textContent = msg; li.append(a); list.append(li);
    const e = document.getElementById(`${field}-error`);
    if (e) { e.textContent = msg; e.hidden = false; }
    if (field !== 'severity' && form.elements[field]) {
      form.elements[field].setAttribute('aria-invalid', 'true');
      form.elements[field].closest('.field').classList.add('invalid');
    }
  });
  summary.replaceChildren(h, list); summary.hidden = false; summary.focus();
}

async function load() {
  const res = await fetch('/api/reports'); const items = await res.json();
  rows.replaceChildren();
  if (!items.length) { rows.innerHTML = '<tr><td colspan="4">No issues reported yet.</td></tr>'; return; }
  items.forEach((r) => {
    const tr = document.createElement('tr');
    [r.id, r.page, r.severity, r.description].forEach((v) => { const td = document.createElement('td'); td.textContent = v; tr.append(td); });
    rows.append(tr);
  });
}

form.addEventListener('submit', async (ev) => {
  ev.preventDefault(); clearErrors();
  const data = Object.fromEntries(new FormData(form));
  const res = await fetch('/api/reports', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  const body = await res.json();
  if (!res.ok) return showErrors(body.errors || { page: 'Something went wrong. Try again.' });
  form.reset(); await load();
  status.textContent = `Report ${body.id} submitted.`;
  document.getElementById('list-heading').focus();
});
load();
