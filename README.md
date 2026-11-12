# GitHub API Tests

![API Tests](https://github.com/Shahzaib-A-Khan/github-api-tests/actions/workflows/api-tests.yml/badge.svg)

API tests for the public GitHub REST API, written with Playwright's request fixture in TypeScript and run in GitHub Actions.

## What it checks
- Reading a user: status code, fields and types
- Negative cases: an unknown user returns 404, and a bad token returns 401
- Pagination with per_page and the Link header
- Consistency rules on repo data (for example full_name equals owner and name)
- The rate limit headers and the rate limit endpoint
- Authentication: a token raises the rate limit (runs in CI, skipped locally without a token)

## Rate limits
Unauthenticated requests are limited to 60 per hour per IP, so the suite makes only a few requests per run. In CI the token GitHub provides for each run is passed in as GH_API_TOKEN.

## Run it
npm ci
npx playwright test

Optional: set GH_API_TOKEN in your terminal for a higher rate limit. Never commit a token.

## Notes
- The tests only read public data and send a few requests per run.
- The workflow limits the token to read-only permissions.
- CI runs on pushes, pull requests and nightly at 06:00 UTC.

## Project structure
- playwright.config.ts: base URL, headers and the optional token
- tests/: user, repo and authentication tests
- .github/workflows/api-tests.yml: CI workflow