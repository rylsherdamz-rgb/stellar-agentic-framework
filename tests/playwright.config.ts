import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: ".",
  testMatch: "*.spec.ts",
  timeout: 60000,
  retries: 1,
  use: {
    baseURL: process.env.FRONTEND_URL || "http://localhost:3000",
    headless: true,
  },
  webServer: [
    {
      command: "npm run dev --prefix frontend",
      port: 3000,
      reuseExistingServer: true,
    },
    {
      command: "npm run dev --prefix backend",
      port: 3001,
      reuseExistingServer: true,
    },
  ],
});
