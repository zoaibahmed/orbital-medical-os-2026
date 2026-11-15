import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  timeout: 90000,
  workers: 1,
  expect: { timeout: 30000 },
  use: {
    baseURL: 'http://127.0.0.1:5187', actionTimeout: 15000,
    trace: 'off', screenshot: 'off', video: 'off',
    launchOptions: { args: process.platform === 'win32' && process.env.BAY_RENDERER !== 'software' ? ['--use-angle=d3d11', '--ignore-gpu-blocklist', '--enable-gpu'] : [] },
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: [{
    command: 'node server/index.js',
    env: { API_PORT: '5002', DEMO_DATA_FILE: '.tools/browser-demo-data.json', CORS_ORIGINS: 'http://127.0.0.1:5187' },
    url: 'http://127.0.0.1:5002/api/health-check',
    reuseExistingServer: !process.env.CI,
  }, {
    command: 'npm run preview -- --port 5187 --strictPort',
    url: 'http://127.0.0.1:5187',
    reuseExistingServer: !process.env.CI,
    env: { API_PROXY_TARGET: 'http://127.0.0.1:5002' },
  }],
})
