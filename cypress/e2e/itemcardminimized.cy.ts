describe('ItemCardMinimized Component', () => {
  beforeEach(() => {
    cy.visit('/');
  });
  const isCI = Cypress.env('CI');

  (isCI ? it.skip : it)('should display item details correctly', () => {
    cy.get('.item-card-minimized').first().within(() => {
      cy.get('.item-title').should('be.visible').and('not.be.empty');
      cy.get('.item-price-pill').should('be.visible').and('contain.text', 'kr');
      cy.get('.item-description').should('be.visible');
      cy.get('img.item-image').should('have.attr', 'src').and('not.be.empty');
    });
  });
});