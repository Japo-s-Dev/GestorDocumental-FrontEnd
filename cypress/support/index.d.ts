// cypress/support/index.d.ts
/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to perform login
     * @example cy.login('demo1', 'welcome')
     */
    login(username: string, password: string): Chainable<void>;
  }
}
