describe('Navbar Component', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display the logo correctly', () => {
    cy.get('.logo-container img.logo-icon').should('be.visible');
    cy.get('.logo-container img.logo-text').should('be.visible');
  });

  it('should check if the hamburger button is clickable and visible in mobile view', () => {
    cy.viewport('iphone-6');
    cy.get('.menu-toggle').should('exist').and('be.visible').click();
  });
});