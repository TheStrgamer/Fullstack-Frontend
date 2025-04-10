describe('Main View', () => {
    beforeEach(() => {
        cy.intercept('GET', '/api/categories', { fixture: 'categories.json' }).as('getCategories');
        cy.intercept('GET', '/api/listings/random?count=30', { fixture: 'listings.json' }).as('getListings');
        cy.visit('/');
        cy.wait('@getCategories');
        cy.wait('@getListings');
    });

    it('should display the Navbar component', () => {
        cy.get('nav').should('exist').and('be.visible');
    });

    it('should display the CategoryComponent', () => {
        cy.get('.category-wrapper', { timeout: 10000 }).should('exist').and('be.visible');
    });

    it('should display the SearchBarComponent', () => {
        cy.get('.search-bar', { timeout: 10000 }).should('exist').and('be.visible');
    });

    it('should display the ItemFeedComponent', () => {
        cy.get('#Item-Feed', { timeout: 10000 }).should('exist').and('be.visible');
    });
});