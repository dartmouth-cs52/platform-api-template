import { defineConfig } from 'cypress';

export default defineConfig({
  video: false,
  screenshotOnRunFailure: false,
  e2e: {
    baseUrl: 'http://localhost:9090',
    specPattern: 'cypress/e2e/platform-api.cy.js',
  },
});
