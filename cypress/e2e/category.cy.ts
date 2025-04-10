describe('CategoryComponent', () => {
  beforeEach(() => {
    cy.visit('/')
  });

  it('should toggle the category menu when the button is clicked on mobile screens', () => {
    cy.viewport(500, 800);

    cy.get('.category-toggle').click();
    cy.get('.category-list').should('be.visible');

    cy.get('.category-toggle').click();
    cy.get('.category-list').should('not.exist');
  });

  it('should display categories fetched from the API', () => {
    cy.intercept('GET', '/api/categories', {
      body: ['Category 1', 'Category 2', 'Category 3']
    }).as('getCategories');

    cy.visit('/');

    cy.wait('@getCategories');

    cy.get('.category-list li').should('have.length', 3);
    cy.get('.category-list li').eq(0).should('contain', 'Category 1');
    cy.get('.category-list li').eq(1).should('contain', 'Category 2');
    cy.get('.category-list li').eq(2).should('contain', 'Category 3');
  });

  it('should navigate to the correct category page when a category is clicked', () => {
    cy.intercept('GET', '/api/categories', {
      body: ['Category 1', 'Category 2']
    }).as('getCategories');

    cy.visit('/');

    cy.wait('@getCategories');

    cy.get('.category-list li').contains('Category 1').click();

    cy.url().should('include', '/category/Category%201');
  });

  it('should adapt to screen size changes', () => {
    cy.viewport(500, 800);
    cy.get('.category-list').should('not.exist');

    cy.viewport(1024, 800);
    cy.get('.category-list').should('be.visible');
  });
});