/**
 * Helpers de presentación reutilizables. Mantener acá las funciones puras de
 * formato evita duplicarlas entre la grilla y la tarjeta destacada.
 */
const compact = new Intl.NumberFormat('es', {
  notation: 'compact',
  maximumFractionDigits: 1,
});

const integer = new Intl.NumberFormat('es');

export function formatCompact(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return '—';
  return compact.format(value);
}

export function formatInteger(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return '—';
  return integer.format(value);
}

/** Hype score lo mostramos como porcentaje legible (ej. 18.5). */
export function formatHype(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return '0.0';
  return (value * 100).toFixed(1);
}
