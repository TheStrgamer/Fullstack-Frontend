describe('GeoCodingComponent', () => {
  beforeEach(() => {
    cy.visit('/geocoding');
  });

  it('should convert address to coordinates', () => {
    cy.get('.autocomplete-input').type('1600 Amphitheatre Parkway, Mountain View, CA');

    cy.contains('button', 'Submit').click();

    cy.get('p').contains('Latitude:').should('not.be.empty');
    cy.get('p').contains('Longitude:').should('not.be.empty');
  });

  it('should convert coordinates to address', () => {
    cy.get('input[placeholder="Latitude"]')
      .type('37.422');
    cy.get('input[placeholder="Longitude"]')
      .type('-122.084');

    cy.contains('button', 'Submit').click();

    cy.get('p').contains('Address:').should('not.be.empty');
  });

  it('should display an error message for invalid address', () => {
    cy.get('.autocomplete-input').type('Invalid Address');

    cy.contains('button', 'Submit').click();

    cy.on('window:alert', (text) => {
      expect(text).to.contains('No results found');
    });
  });

  it('should display an error message for invalid coordinates', () => {
    cy.get('input[placeholder="Latitude"]')
      .type('999');
    cy.get('input[placeholder="Longitude"]')
      .type('999');

    cy.contains('button', 'Submit').click();

    cy.on('window:alert', (text) => {
      expect(text).to.contains('No results found');
    });
  });
});