describe('ItemMaximized View', () => {
  beforeEach(() => {
    cy.visit('/item/1');
  });

  it('should display the navbar', () => {
    cy.get('nav').should('exist');
  });
});