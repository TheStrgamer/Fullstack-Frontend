describe('CategoryListings View', () => {
  beforeEach(() => {
    cy.visit('/category/some-category');
  });

  it('should display the navbar', () => {
    cy.get('nav').should('exist');
  });

  it('should display the category name', () => {
    cy.get('.category-pill').should('contain.text', 'some-category');
  });

  it('should navigate to a new category when the route changes', () => {
    cy.visit('/category/another-category');
    cy.get('.category-pill').should('contain.text', 'another-category');
  });
});