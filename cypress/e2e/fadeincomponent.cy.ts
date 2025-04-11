describe('FadeInComponent', () => {
  beforeEach(() => {
    cy.visit('/test-fadein');
  });

  it('should fade in when it comes into view', () => {
    cy.get('.fade-in-container').first().should('not.have.class', 'visible');

    cy.get('.fade-in-container').first().scrollIntoView();

    cy.get('.fade-in-container').first().should('have.class', 'visible');
  });

  it('should apply the correct direction class', () => {
    cy.get('.fade-in-container').first().should('have.class', 'from-top');
  });

  it('should respect the transition duration', () => {
    cy.get('.fade-in-container')
      .first()
      .should('have.attr', 'style')
      .and('include', 'transition-duration: 400ms');
  });
});