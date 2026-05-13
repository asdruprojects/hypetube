/**
 * Convierte una fecha ISO a un texto humano relativo en español, usando
 * exclusivamente APIs nativas de JavaScript (sin moment / date-fns / luxon).
 *
 * Reglas:
 *  - Fechas inválidas devuelven "Fecha desconocida".
 *  - Fechas en el futuro devuelven el equivalente con prefijo "En …".
 *  - Para diferencias menores a un minuto devolvemos "Hace un momento".
 *  - Pluralización manual: día / días, mes / meses, año / años.
 */
const MINUTE = 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;
const MONTH = DAY * 30; // suficiente para feedback humano; no pretendemos precisión calendárica
const YEAR = DAY * 365;

interface Unit {
  seconds: number;
  singular: string;
  plural: string;
}

const UNITS: Unit[] = [
  { seconds: YEAR, singular: 'año', plural: 'años' },
  { seconds: MONTH, singular: 'mes', plural: 'meses' },
  { seconds: DAY, singular: 'día', plural: 'días' },
  { seconds: HOUR, singular: 'hora', plural: 'horas' },
  { seconds: MINUTE, singular: 'minuto', plural: 'minutos' },
];

export function relativeFromIso(iso: string, now: Date = new Date()): string {
  const then = new Date(iso);
  if (Number.isNaN(then.getTime())) {
    return 'Fecha desconocida';
  }

  const deltaSec = Math.round((now.getTime() - then.getTime()) / 1000);
  const absSec = Math.abs(deltaSec);

  if (absSec < MINUTE) {
    return 'Hace un momento';
  }

  for (const unit of UNITS) {
    if (absSec >= unit.seconds) {
      const value = Math.floor(absSec / unit.seconds);
      const label = value === 1 ? unit.singular : unit.plural;
      return deltaSec >= 0 ? `Hace ${value} ${label}` : `En ${value} ${label}`;
    }
  }

  return 'Hace un momento';
}
