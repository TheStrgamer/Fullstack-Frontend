describe('LoginComponent', () => {
    beforeEach(() => {
        cy.mockLoginBackend();
        cy.visit('/login');
    });

    it('should display error messages for invalid email and password', () => {
        cy.get('#email').type('invalid-email');
        cy.get('#password').type('12');
        cy.get('button[type="submit"]').click();

        cy.get('.error-message').contains('Please enter a valid email');
        cy.get('.error-message').contains('Password must be at least 3 characters long');
    });

    it('should display error for incorrect credentials', () => {
        cy.get('#email').type('nonexistent@example.com');
        cy.get('#password').type('wrongpassword');
        cy.get('button[type="submit"]').click();

        cy.get('.error-message').contains('No user with given email');
    });
});