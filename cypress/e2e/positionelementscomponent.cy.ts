describe('PositionElementsComponent', () => {
    beforeEach(() => {
        cy.visit('/item?id=1');
    });

    it('should show an alert if no results are found', () => {
        cy.intercept('GET', '**/reverse*', {
            statusCode: 200,
            body: null,
        }).as('getAddressNoResults');

        cy.on('window:alert', (text) => {
            expect(text).to.contains('No results found');
        });
    });

    it('should show an error alert if the API call fails', () => {
        cy.intercept('GET', '**/reverse*', {
            statusCode: 500,
        }).as('getAddressError');

        cy.on('window:alert', (text) => {
            expect(text).to.contains('Failed to fetch address');
        });
    });
});