import { test, expect } from '@playwright/test';

test('an existing user is returned with the expected fields', async ({ request }) => {
  const response = await request.get('/users/octocat');
  expect(response.status()).toBe(200);
  const user = await response.json();
  expect(user.login).toBe('octocat');
  expect(user.type).toBe('User');
  expect(user.html_url).toBe('https://github.com/octocat');
  expect(typeof user.public_repos).toBe('number');
});

test('an unknown user returns 404 with a message', async ({ request }) => {
  const response = await request.get(`/users/no-such-user-${Date.now()}`);
  expect(response.status()).toBe(404);
  const body = await response.json();
  expect(body.message).toBe('Not Found');
});

test('responses include rate limit headers', async ({ request }) => {
  const response = await request.get('/users/octocat');
  const headers = response.headers();
  const limit = Number(headers['x-ratelimit-limit']);
  const remaining = Number(headers['x-ratelimit-remaining']);
  expect(limit).toBeGreaterThan(0);
  expect(remaining).toBeLessThanOrEqual(limit);
});