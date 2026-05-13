import { defineConfig } from 'cypress';

/**
 * Configuración mínima para tests E2E del frontend.
 * Asume que el dev server (`pnpm dev`) corre en http://localhost:5173.
 *
 * Los specs interceptan las llamadas al API con `cy.intercept`, así que no es
 * necesario tener el backend levantado para correr Cypress.
 */
export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    specPattern: 'cypress/e2e/**/*.cy.{ts,tsx}',
    supportFile: 'cypress/support/e2e.ts',
    video: false,
    screenshotOnRunFailure: false,
    viewportWidth: 1280,
    viewportHeight: 800,
    defaultCommandTimeout: 8000,
  },
});
