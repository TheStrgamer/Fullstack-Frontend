if (Cypress.env('CI')) {
  describe.skip('ChatView', () => {});
} else {
describe('ChatView', () => {
    beforeEach(() => {
      cy.visit('/', {
        onBeforeLoad(win) {
          win.sessionStorage.setItem('jwtToken', 'mocked-jwt-token');
        },
      });
  
      cy.intercept('GET', '/api/users/validate', {
        statusCode: 200,
        body: { email: 'validuser@example.com', role: 'ADMIN' },
      });
  
      cy.intercept('GET', '**/negotiation/chat/my_chats', {
        fixture: 'mockChats.json',
      }).as('getChats');
  
      cy.visit('/chats');
      cy.wait('@getChats');
  
      cy.get('[data-cy="chat-list"]').should('be.visible');
    });
  
    it('should display the chat list on desktop view', () => {
      cy.viewport(1024, 768);
      cy.get('[data-cy="chat-page"]').should('exist');
      cy.get('[data-cy="chat-item"]').should('have.length.at.least', 1);
    });
  
    it('should navigate to message view when a chat is clicked (desktop)', () => {
      cy.viewport(1024, 768);
  
      cy.intercept('GET', '**/negotiation/chat/1', {
        statusCode: 200,
        fixture: 'mockMessages.json',
      }).as('getMessages');
  
      cy.get('[data-cy="chat-item"]').first().click();
      cy.wait('@getMessages');
      cy.get('[data-cy="message-list"]').should('be.visible');
    });

  });
}; 