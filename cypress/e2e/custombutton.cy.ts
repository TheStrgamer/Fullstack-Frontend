describe('CustomButton', () => {
  beforeEach(() => {
    cy.visit('/custom-button-test');
  });

  it('should display the button with the correct title', () => {
    cy.get('button.custom-button').should('contain', 'Button Title');
  });

  it('should emit the clicked event when the button is clicked', () => {
    cy.window().then((win) => {
      cy.spy(win.console, 'log').as('consoleLog');
    });

    cy.get('button.custom-button').click();

    cy.get('@consoleLog').should('be.calledWith', 'Button clicked');
  });

  it('should display an icon if the icon_path prop is provided', () => {
    cy.get('button.custom-button img').should('have.attr', 'src').and('include', '/icon-path.png');
  });
});