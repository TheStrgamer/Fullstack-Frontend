describe('ContactInfoComponent', () => {
  beforeEach(() => {
    cy.visit('/Item');
  });

  it('should show a message when the user is not logged in', () => {
    cy.get('.contact-info-component').should('contain', 'Du må være innlogget for å se kontakt informasjon.');
  });
});