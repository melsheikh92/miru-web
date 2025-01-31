import { defineConfig } from 'cypress'

export default defineConfig({
  projectId: 'upc13x',
  trashAssetsBeforeRuns: true,
  e2e: {
    baseUrl: 'https://app.miru.so',
    specPattern: 'cypress/e2e/production/**/*.{js,jsx,ts,tsx}',
    defaultCommandTimeout: 10000,
    requestTimeout:30000,
    pageLoadTimeout:60000,
    responseTimeout:10000,
    supportFile:"cypress/support/e2e.ts",
    viewportWidth: 1536,
    viewportHeight: 960,
    retries: {
      "runMode": 2,
      "openMode": 2
    },
  },
})
