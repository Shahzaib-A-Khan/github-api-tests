import { test, expect } from '@playwright/test';

test('repos are paginated with a Link header', async ({ request }) => {
  const user = await (await request.get('/users/octocat')).json();
  test.skip(user.public_repos < 2, 'needs at least 2 public repos to paginate');

  const response = await request.get('/users/octocat/repos?per_page=1');
  expect(response.status()).toBe(200);
  const repos = await response.json();
  expect(repos).toHaveLength(1);
  expect(response.headers()['link']).toContain('rel="next"');
});

test('each repo has the expected fields and types', async ({ request }) => {
  const response = await request.get('/users/octocat/repos?per_page=3');
  expect(response.status()).toBe(200);
  const repos = await response.json();
  expect(repos.length).toBeGreaterThan(0);

  for (const repo of repos) {
    expect(typeof repo.id).toBe('number');
    expect(typeof repo.name).toBe('string');
    expect(typeof repo.private).toBe('boolean');
    expect(repo.full_name).toBe(`${repo.owner.login}/${repo.name}`);
    expect(repo.owner.login).toBe('octocat');
  }
});

test('a bad token is rejected with 401', async ({ request }) => {
  const response = await request.get('/user', {
    headers: { Authorization: 'Bearer not-a-real-token' },
  });
  expect(response.status()).toBe(401);
  const body = await response.json();
  expect(body.message).toBe('Bad credentials');
});

test('the rate limit endpoint reports the core limit', async ({ request }) => {
  const response = await request.get('/rate_limit');
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(typeof body.resources.core.limit).toBe('number');
  expect(body.resources.core.remaining).toBeLessThanOrEqual(body.resources.core.limit);
});