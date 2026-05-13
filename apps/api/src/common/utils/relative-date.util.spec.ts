import { relativeFromIso } from './relative-date.util';

const NOW = new Date('2026-05-12T18:00:00.000Z');

describe('relativeFromIso', () => {
  it('formatea diferencias en días', () => {
    const iso = new Date(NOW.getTime() - 2 * 24 * 3600 * 1000).toISOString();
    expect(relativeFromIso(iso, NOW)).toBe('Hace 2 días');
  });

  it('usa singular para 1 unidad', () => {
    const iso = new Date(NOW.getTime() - 24 * 3600 * 1000).toISOString();
    expect(relativeFromIso(iso, NOW)).toBe('Hace 1 día');
  });

  it('formatea diferencias en meses', () => {
    const iso = new Date(NOW.getTime() - 3 * 30 * 24 * 3600 * 1000).toISOString();
    expect(relativeFromIso(iso, NOW)).toBe('Hace 3 meses');
  });

  it('formatea diferencias en años', () => {
    const iso = new Date(NOW.getTime() - 365 * 24 * 3600 * 1000).toISOString();
    expect(relativeFromIso(iso, NOW)).toBe('Hace 1 año');
  });

  it('maneja fechas futuras con prefijo "En"', () => {
    const iso = new Date(NOW.getTime() + 2 * 24 * 3600 * 1000).toISOString();
    expect(relativeFromIso(iso, NOW)).toBe('En 2 días');
  });

  it('marca diferencias muy pequeñas como "Hace un momento"', () => {
    const iso = new Date(NOW.getTime() - 10 * 1000).toISOString();
    expect(relativeFromIso(iso, NOW)).toBe('Hace un momento');
  });

  it('devuelve "Fecha desconocida" para ISO inválidos', () => {
    expect(relativeFromIso('no-es-una-fecha', NOW)).toBe('Fecha desconocida');
  });
});
