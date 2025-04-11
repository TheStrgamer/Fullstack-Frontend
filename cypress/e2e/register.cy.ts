import { faker } from '@faker-js/faker';

describe('RegisterComponent', () => {
    beforeEach(() => {
        cy.visit('/register');
    });

    it('should display validation errors for empty fields', () => {
        cy.get('button[type="submit"]').click();
        cy.get('#firstName + .error-message').should('contain', 'First name cannot be empty');
        cy.get('#lastName + .error-message').should('contain', 'Last name cannot be empty');
        cy.get('#email + .error-message').should('contain', 'Please enter a valid email');
        cy.get('#phonenumber + .error-message').should('contain', 'Phone number must be 8 digits long');
        cy.get('#password + .error-message').should('contain', 'Password must be at least 3 characters long');
    });

    it('should display error for invalid email', () => {
        cy.get('#email').type('invalid-email');
        cy.get('button[type="submit"]').click();
        cy.get('#email + .error-message').should('contain', 'Please enter a valid email');
    });

    it('should display error for mismatched passwords', () => {
        cy.get('#password').type('password123');
        cy.get('#passwordConfirm').type('differentPassword');
        cy.get('button[type="submit"]').click();
        cy.get('#password + .error-message').should('contain', 'Passwords do not match');
    });

    it('should register successfully with valid inputs', () => {
        const firstName = faker.name.firstName();
        const lastName = faker.name.lastName();
        const email = faker.internet.email();
        const phoneNumber = faker.string.numeric(8);
        const password = 'password123';

        cy.get('#firstName').type(firstName);
        cy.get('#lastName').type(lastName);
        cy.get('#email').type(email);
        cy.get('#phonenumber').type(phoneNumber);
        cy.get('#password').type(password);
        cy.get('#passwordConfirm').type(password);

        cy.intercept('POST', '**/users/register', {
            statusCode: 200,
        }).as('registerUser');

        cy.get('button[type="submit"]').click();

        cy.wait('@registerUser');
        cy.url().should('include', '/login');
    });
});

describe('Register Page', () => {
    it('should display the registration form and allow user registration', () => {
        // Visit the register page
        cy.visit('/register');

        // Wait for the form to be visible
        cy.get('form.input-form-flex', { timeout: 10000 }).should('be.visible');

        // Fill out the registration form
        cy.get('input[name="firstName"]').type('John');
        cy.get('input[name="lastName"]').type('Doe');
        cy.get('input[name="email"]').type('johndoe@example.com');
        cy.get('input[name="phonenumber"]').type('12345678');
        cy.get('input[name="password"]').type('password123');
        cy.get('input[name="passwordConfirm"]').type('password123');

        // Mock the API response for successful registration
        cy.intercept('POST', '**/users/register', {
            statusCode: 200,
        }).as('registerUser');

        // Submit the form
        cy.get('button[type="submit"]').click();

        // Wait for the mocked API call
        cy.wait('@registerUser');

        // Verify redirection to the login page
        cy.url().should('include', '/login');
    });
});