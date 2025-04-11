describe('NotFound Page', () => {
  it('should display 404 message and navigate to the NotFound page for an invalid route', () => {
    cy.visit('/invalid-route', { failOnStatusCode: false });

    cy.contains('404 - Not Found').should('be.visible');
    cy.contains('All paths lead to Rome, but not this one.').should('be.visible');

    cy.get('nav').should('exist');
  });
});