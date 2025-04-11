import { defineConfig } from 'cypress';
import codeCoverageTask from '@cypress/code-coverage/task';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    setupNodeEvents(on, config) {
      try {
        // Initialize the code coverage task
        console.log('Cypress code coverage task is being executed.');
        codeCoverageTask(on, config);
      } catch (error) {
        console.error('Error in setupNodeEvents:', error);
      }
      return config;
    },
    env: {
      CI: process.env.CI || false
    },
    specPattern: 'cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}',
  },
});
