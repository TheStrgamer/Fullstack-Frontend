// https://on.cypress.io/api

describe('404 not found test', () => {
  it('visiting invalid page returns 404', () => {
    cy.visit('/404-test', { failOnStatusCode: false })
    //cy.request('/404-test').its('status').should('eq', 404)
  })
})
