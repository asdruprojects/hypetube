import type { VideoDTO } from '@hypetube/contracts';
import { parseNumeric } from '../../../common/utils/number.util';
import { relativeFromIso } from '../../../common/utils/relative-date.util';
import { calculateHype } from '../helpers/hype.helper';
import type { YoutubeRawItem } from '../types/youtube.types';

const PLACEHOLDER_THUMB =
  'https://via.placeholder.com/640x360/0b0b0d/a1a1aa?text=HypeTube';

function pickThumbnail(item: YoutubeRawItem): string {
  const t = item.snippet?.thumbnails;
  return (
    t?.maxres?.url ||
    t?.standard?.url ||
    t?.high?.url ||
    t?.medium?.url ||
    t?.default?.url ||
    PLACEHOLDER_THUMB
  );
}

/**
 * Convierte un item crudo de YouTube en el DTO público de HypeTube.
 * Aplica reglas:
 *  - parsea strings numéricos
 *  - distingue comentarios deshabilitados (campo ausente) vs 0
 *  - calcula hype y `isTutorial`
 *  - genera la fecha relativa con utilitario nativo
 * Si el item no tiene `id` válido, devuelve `null` (se descarta en el repo).
 */
export function transformYoutubeItem(
  item: YoutubeRawItem,
  now: Date = new Date(),
): VideoDTO | null {
  if (!item || typeof item.id !== 'string' || item.id.trim() === '') {
    return null;
  }

  const title = item.snippet?.title?.trim() ?? '';
  const author = item.snippet?.channelTitle?.trim() ?? 'Desconocido';
  const publishedAt = item.snippet?.publishedAt ?? '';

  const views = parseNumeric(item.statistics?.viewCount) ?? 0;
  const likes = parseNumeric(item.statistics?.likeCount) ?? 0;
  // El campo ausente representa "comentarios deshabilitados" según las reglas.
  const commentsRaw = item.statistics?.commentCount;
  const comments = commentsRaw === undefined ? null : (parseNumeric(commentsRaw) ?? 0);

  const { score, isTutorial } = calculateHype({ title, views, likes, comments });

  return {
    id: item.id,
    title,
    author,
    thumbnail: pickThumbnail(item),
    relativePublishedDate: publishedAt ? relativeFromIso(publishedAt, now) : 'Fecha desconocida',
    publishedAt,
    views,
    likes,
    comments,
    hypeScore: score,
    isTutorial,
  };
}
