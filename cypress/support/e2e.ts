// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

import { mount } from 'cypress/vue';
import '@cypress/code-coverage/support';

// Add a TypeScript declaration for the __coverage__ property on the Window object
declare global {
  interface Window {
    __coverage__?: any;
  }
}

// Ensure Cypress is defined before using it
if (typeof Cypress !== 'undefined') {
  // Ensure Cypress.env() is an object before using it
  const cyEnvs = Cypress._.mapKeys(Cypress.env() || {}, (value, key) =>
    key.toLowerCase()
  );
}

// Make the `mount` function globally available for all test files
Cypress.Commands.add('mount', mount);

// Add a custom command to save coverage data after each test
Cypress.Commands.add('saveCoverage', () => {
  if (window.__coverage__) {
    cy.task('coverageReport', window.__coverage__);
  } else {
    console.warn('No coverage data found to save.');
  }
});

// Automatically save coverage data after each test
Cypress.on('test:after:run', () => {
  cy.saveCoverage();
});

// Add logging to confirm coverage collection
Cypress.on('test:after:run', (test, runnable) => {
  if (window.__coverage__) {
    console.log('Coverage data is being collected:', window.__coverage__);
  } else {
    console.warn('No coverage data found for this test:', test.title);
  }
});
