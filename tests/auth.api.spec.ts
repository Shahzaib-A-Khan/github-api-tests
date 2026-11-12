import { test, expect } from '@playwright/test';

test('an authenticated request gets a higher rate limit', async ({ request }) => {
  test.skip(!process.env.GH_API_TOKEN, 'needs GH_API_TOKEN');
  const response = await request.get('/rate_limit');
  const body = await response.json();
  expect(body.resources.core.limit).toBeGreaterThan(60);
});