import fs from 'fs';
import dotenv from 'dotenv';
import { defineConfig } from '@playwright/test';

// Detect mode based on npm lifecycle event or NODE_ENV
const npmScript = process.env.npm_lifecycle_event;
const isProd = npmScript?.includes('prod');

// Load the appropriate env file
const envFile = isProd ? '.env.production' : '.env.local';
if (fs.existsSync(envFile)) {
  dotenv.config({ path: envFile });
}

export default defineConfig({
  testDir: './tests',              // folder for tests
  timeout: 30 * 1000,              // 30s per test
  webServer: {
    command: isProd ? 'npm run dev:prod' : 'npm run dev',
    port: isProd ? 4173 : 5173,    // vite preview defaults to 4173
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: isProd ? 'http://localhost:4173' : 'http://localhost:5173',
    headless: true,                // run without UI
    viewport: { width: 1280, height: 720 },
    video: 'retain-on-failure',    // record video if test fails
  },
});
