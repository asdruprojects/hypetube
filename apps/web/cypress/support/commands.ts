/// <reference types="cypress" />

/**
 * Custom commands compartidos por todos los specs.
 *  - `cy.mockApi()` intercepta /api/videos y /api/stats con fixtures, así no
 *     necesitamos un backend real corriendo para los tests.
 */
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      mockApi(): Chainable<void>;
    }
  }
}

Cypress.Commands.add('mockApi', () => {
  cy.intercept('GET', '**/api/videos*', { fixture: 'videos.json' }).as('getVideos');
  cy.intercept('GET', '**/api/stats', { fixture: 'stats.json' }).as('getStats');
});

export {};
