import { defineConfig } from '@playwright/test';

const token = process.env.GH_API_TOKEN;

export default defineConfig({
  testDir: './tests',
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'https://api.github.com',
    extraHTTPHeaders: {
      Accept: 'application/vnd.github+json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  },
});