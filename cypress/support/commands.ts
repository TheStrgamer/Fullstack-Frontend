/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//

Cypress.Commands.add('mockLoginBackend', () => {
    cy.intercept('POST', '/users/login', (req) => {
        const { email, password } = req.body;

        if (email === 'validuser@example.com' && password === 'validpassword') {
            req.reply({
                statusCode: 200,
                body: {
                    token: 'mocked-jwt-token',
                    expiration: 3600,
                },
            });
        } else {
            req.reply({
                statusCode: 401,
                body: {
                    message: 'Invalid credentials',
                },
            });
        }
    });
});

Cypress.Commands.add('login', () => {
    cy.mockLoginBackend();
    cy.visit('/login');
    cy.get('#email').type('validuser@example.com');
    cy.get('#password').type('validpassword');
    cy.get('button[type="submit"]').click();
});

Cypress.Commands.add('logout', () => {
    cy.visit('/logout');
});

declare global {
    namespace Cypress {
        interface Chainable {
            mockLoginBackend(): void;
            login(): void;
            logout(): void;
            mount: typeof import('cypress/vue').mount;
            saveCoverage(): void;
        }
    }
}

export {}
