describe('ItemComponentMaximized', () => {
  beforeEach(() => {
    cy.visit('/item?id=1');
  });

  it('should display the item title and price', () => {
    cy.get('.item-title').should('be.visible').and('not.be.empty');
    cy.get('.item-price-pill').should('be.visible').and('contain.text', 'kr');
  });

  it('should display item details like category, condition, and description', () => {
    cy.get('.item-category').should('be.visible').and('not.be.empty');
    cy.get('.item-subinfo').should('be.visible');
    cy.get('.description .item-description').should('be.visible').and('not.be.empty');
  });

  it('should display location and seller information', () => {
    cy.get('.location').should('be.visible');
    cy.get('.section-title').contains('Selger').should('be.visible');
  });
});