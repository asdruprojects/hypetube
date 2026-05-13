/**
 * El payload de YouTube llega con números expresados como strings.
 * Centralizamos el parseo defensivo: devuelve `null` si no es convertible,
 * para distinguir "0 vistas" de "campo ausente".
 */
export function parseNumeric(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim() !== '') {
    const n = Number(value);
    if (Number.isFinite(n)) return n;
  }
  return null;
}
