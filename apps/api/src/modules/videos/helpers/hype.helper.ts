export interface HypeInput {
  title: string;
  views: number;
  likes: number;
  /** `null` indica "comentarios deshabilitados" (campo ausente en el payload). */
  comments: number | null;
}

export interface HypeResult {
  score: number;
  isTutorial: boolean;
}

const TUTORIAL_MULTIPLIER = 2;
const TUTORIAL_REGEX = /\btutorial\b/i;

export function isTutorialTitle(title: string): boolean {
  return TUTORIAL_REGEX.test(title ?? '');
}

/**
 * Calcula el hype score aplicando las reglas de negocio:
 *  1. Si los comentarios están deshabilitados (`null`) → 0.
 *  2. Si no hay vistas (>0) → 0 (evita división por cero y resultados engañosos).
 *  3. Base: (likes + comments) / views.
 *  4. Si el título contiene "tutorial" (case insensitive) → score * 2.
 *  5. Se preserva como número decimal con precisión razonable (4 decimales).
 */
export function calculateHype(input: HypeInput): HypeResult {
  const isTutorial = isTutorialTitle(input.title);

  if (input.comments === null) {
    return { score: 0, isTutorial };
  }

  if (!Number.isFinite(input.views) || input.views <= 0) {
    return { score: 0, isTutorial };
  }

  const numerator = (input.likes ?? 0) + input.comments;
  const base = numerator / input.views;
  const score = isTutorial ? base * TUTORIAL_MULTIPLIER : base;

  // Redondeo defensivo: hype es siempre <= 2 (likes+comments <= views * algo),
  // pero pasamos por toFixed/parseFloat para evitar 0.13000000000002.
  return { score: Number.parseFloat(score.toFixed(4)), isTutorial };
}
