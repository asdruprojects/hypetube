/// <reference types="cypress" />

/**
 * Tests del buscador y del toggle "Solo tutoriales".
 * Se valida que el frontend dispara la query correcta y respeta la respuesta
 * mockeada sin necesitar un backend real.
 */
describe('HypeTube · filtros', () => {
  beforeEach(() => {
    cy.mockApi();
    cy.visit('/');
    cy.wait('@getVideos'); // primera carga
  });

  it('escribir en el buscador dispara una nueva consulta con `search`', () => {
    cy.intercept('GET', '**/api/videos*search=react*', { fixture: 'videos.json' }).as(
      'searchReact',
    );

    cy.get('input[type="search"]').type('react');

    // Por el debounce (300 ms) la query no se dispara inmediato; cy.wait absorbe
    // ese tiempo cómodamente.
    cy.wait('@searchReact').its('request.url').should('include', 'search=react');
  });

  it('"Solo tutoriales" alterna estado y dispara consulta con `tutorialsOnly=true`', () => {
    cy.intercept('GET', '**/api/videos*tutorialsOnly=true*', {
      fixture: 'videos-tutorials.json',
    }).as('tutorialsOnly');

    cy.contains('button', 'Solo tutoriales')
      .as('toggle')
      .should('have.attr', 'aria-pressed', 'false')
      .click()
      .should('have.attr', 'aria-pressed', 'true');

    cy.wait('@tutorialsOnly').its('request.url').should('include', 'tutorialsOnly=true');

    // Con el fixture filtrado, sólo deberían aparecer tutoriales.
    cy.contains('Node.js Tutorial completo').should('be.visible');
    cy.contains('Vue 2 Tutorial').should('be.visible');
    cy.contains('TypeScript en 2026').should('not.exist');
  });
});
