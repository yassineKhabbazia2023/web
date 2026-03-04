import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  globalSetup: './global-setup.config',
  testDir: './tests',
  testMatch: '**/*.e2e.ts',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 2, // limit workers to avoid cold vite start
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
    ...(process.env.CI ? [['junit', { outputFile: 'e2e-results/junit.xml' }] as const] : []),
  ],
  use: {
    baseURL: 'http://localhost:1339',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  timeout: 30000,
  expect: {
    timeout: 5000,
  },
  webServer: {
    command: 'npm run dev:e2e --workspace=@pulse/backoffice',
    url: 'http://localhost:1339',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
    cwd: '../../../..',
  },
})
