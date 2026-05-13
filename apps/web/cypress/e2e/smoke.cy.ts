/// <reference types="cypress" />

/**
 * Smoke E2E: la app monta, pide los datos al API mockeado y renderiza la
 * "Joya de la Corona" + grilla y métricas básicas.
 */
describe('HypeTube · smoke', () => {
  beforeEach(() => {
    cy.mockApi();
    cy.visit('/');
  });

  it('renderiza el header con el nombre del producto', () => {
    cy.contains('header', 'HypeTube').should('be.visible');
    cy.contains('Cartelera de hype tecnológico').should('be.visible');
  });

  it('llama al API y muestra los stats agregados', () => {
    cy.wait('@getStats');
    cy.contains('Top creator').should('be.visible');
    cy.contains('Coder A').should('be.visible');
    cy.contains('Tutoriales').should('be.visible');
  });

  it('muestra la "Joya de la Corona" como banner del top hype', () => {
    cy.wait('@getVideos');
    cy.contains('Joya de la Corona').should('be.visible');
    cy.contains('Node.js Tutorial completo').should('be.visible');
    cy.contains('Mayor hype de la cartelera').should('be.visible');
  });

  it('renderiza el resto de los videos en la grilla (sin la joya)', () => {
    cy.wait('@getVideos');
    cy.contains('Vue 2 Tutorial').should('be.visible');
    cy.contains('React patterns avanzados').should('be.visible');
    cy.contains('TypeScript en 2026').should('be.visible');
    // El badge "Sin comentarios" aparece en el video con comentarios deshabilitados.
    cy.contains('Sin comentarios').should('be.visible');
  });
});
