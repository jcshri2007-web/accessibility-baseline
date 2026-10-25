#!/bin/sh
# Usage: sh scripts/run-lighthouse.sh https://example.gov.in
# Requires Chrome + internet. Saves reports into docs/audit/lighthouse/
URL="${1:?Pass the public URL to audit}"
mkdir -p docs/audit/lighthouse
npx --yes lighthouse "$URL" --only-categories=accessibility,best-practices,seo,performance \
  --output=html --output=json --output-path=docs/audit/lighthouse/report
echo "Saved to docs/audit/lighthouse/. Open report.report.html and screenshot the score + failed audits."
