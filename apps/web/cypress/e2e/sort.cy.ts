/// <reference types="cypress" />

/**
 * Test del dropdown custom de "Ordenar".
 * Verifica que el listbox se abre, que las opciones son accesibles vía rol y
 * que al elegir una nueva opción se dispara la consulta con el `sortBy` correcto.
 */
describe('HypeTube · ordenar', () => {
  beforeEach(() => {
    cy.mockApi();
    cy.visit('/');
    cy.wait('@getVideos');
  });

  it('abre el listbox y muestra todas las opciones', () => {
    cy.contains('button', 'Ordenar').click();

    cy.get('[role="listbox"]').should('be.visible');
    cy.get('[role="option"]').should('have.length', 5);

    cy.contains('[role="option"]', 'Hype').should('be.visible');
    cy.contains('[role="option"]', 'Vistas').should('be.visible');
    cy.contains('[role="option"]', 'Likes').should('be.visible');
    cy.contains('[role="option"]', 'Comentarios').should('be.visible');
    cy.contains('[role="option"]', 'Más nuevo').should('be.visible');
  });

  it('al elegir "Vistas" dispara una consulta con `sortBy=views`', () => {
    cy.intercept('GET', '**/api/videos*sortBy=views*', { fixture: 'videos.json' }).as(
      'sortByViews',
    );

    cy.contains('button', 'Ordenar').click();
    cy.contains('[role="option"]', 'Vistas').click();

    cy.wait('@sortByViews').its('request.url').should('include', 'sortBy=views');

    // El trigger debe reflejar la nueva selección.
    cy.contains('button', 'Ordenar').should('contain.text', 'Vistas');
  });

  it('cierra el listbox al presionar Escape', () => {
    cy.contains('button', 'Ordenar').click();
    cy.get('[role="listbox"]').should('be.visible');

    cy.get('body').type('{esc}');
    cy.get('[role="listbox"]').should('not.exist');
  });
});
