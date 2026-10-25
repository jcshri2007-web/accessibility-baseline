// Server-side validation. Messages are written for humans (WCAG 3.3.1 Error Identification).
const SEVERITIES = ['low', 'medium', 'high', 'critical'];

function validateReport(body) {
  const errors = {};
  const page = String(body.page || '').trim();
  const description = String(body.description || '').trim();
  const severity = String(body.severity || '').trim();
  if (!page) errors.page = 'Enter the page or component where you found the problem.';
  if (description.length < 10) errors.description = 'Describe the problem in at least 10 characters.';
  if (!SEVERITIES.includes(severity)) errors.severity = 'Choose a severity: low, medium, high or critical.';
  return { valid: Object.keys(errors).length === 0, errors, value: { page, description, severity } };
}
module.exports = { validateReport, SEVERITIES };
