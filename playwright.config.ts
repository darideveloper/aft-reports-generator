import fs from 'fs';
import dotenv from 'dotenv';
import { defineConfig } from '@playwright/test';

// Load .env first (base configuration)
dotenv.config();

// Get mode from NODE_ENV or command line arguments
// Check if we're running in production mode
const isProd = process.env.NODE_ENV === 'production'
const mode = isProd ? 'production' : 'local';
console.log('Mode:', mode);

// Load the appropriate env file based on mode
const envFile = mode === 'production' ? '.env.production' : '.env.local';
console.log({envFile})
console.log('Loading environment file:', envFile);

// Show all env variables
console.log('Environment variables:', process.env.VITE_API_ENDPOINT);

if (fs.existsSync(envFile)) {
  dotenv.config({ path: envFile });
  console.log('Environment file loaded successfully');
} else {
  console.warn(`Environment file ${envFile} not found, using base .env`);
}

console.log('Production mode:', isProd);

export default defineConfig({
  testDir: './tests',              // folder for tests
  timeout: 30 * 1000,              // 30s per test
  webServer: {
    command: isProd ? 'npm run build && npm run preview' : 'npm run dev',
    port: isProd ? 4173 : 5173,
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000, // 2 minutes for build + preview
  },
  use: {
    baseURL: isProd ? 'http://localhost:4173' : 'http://localhost:5173',
    headless: true,                // run without UI
    viewport: { width: 1280, height: 720 },
    video: 'retain-on-failure',    // record video if test fails
  },
});
