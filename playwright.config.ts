// playwright.config.ts (Final Corrected Code)

import { defineConfig, devices } from '@playwright/test';

const baseURL = 'https://test1.gotrade.goquant.io/'; 

export default defineConfig({
  testDir: './tests', // Default test location
  fullyParallel: true, 
  forbidOnly: !!process.env.CI, 
  retries: process.env.CI ? 2 : 0, 
  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: './reports/html-report' }],
  ],

  use: {
    baseURL: baseURL, 
    trace: 'on-first-retry', 
    screenshot: 'only-on-failure', 
    video: 'retain-on-failure',
  },

  projects: [
    // 1. AUTHENTICATION SETUP PROJECT (FIXED PATH)
    {
      name: 'setup',
      // CRITICAL FIX: Explicitly specify the path relative to the project root
      testMatch: /auth.setup.ts/, 
      use: { 
        storageState: undefined, 
      },
    },

    // 2. TESTING PROJECTS (Depend on setup)
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],
    },
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    //   dependencies: ['setup'],
    // },
    {
      name: 'microsoft-edge',
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
      dependencies: ['setup'],
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
      dependencies: ['setup'],
    },
  ],
});