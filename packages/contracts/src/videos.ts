/**
 * Video ya transformado y listo para consumir en el frontend.
 * Es el único contrato público del endpoint GET /api/videos.
 */
export interface VideoDTO {
  id: string;
  title: string;
  author: string;
  thumbnail: string;
  /** Texto humano calculado en el backend, p.ej. "Hace 2 meses". */
  relativePublishedDate: string;
  /** ISO original — útil para sorting en cliente sin recalcular en el server. */
  publishedAt: string;
  views: number;
  likes: number;
  /** `null` cuando el video tiene los comentarios deshabilitados. */
  comments: number | null;
  /** Hype final, con multiplicador de tutorial aplicado cuando corresponde. */
  hypeScore: number;
  isTutorial: boolean;
}

export const VIDEO_SORT_FIELDS = ['hype', 'views', 'likes', 'comments', 'newest'] as const;
export type VideoSortField = (typeof VIDEO_SORT_FIELDS)[number];

export const SORT_ORDERS = ['asc', 'desc'] as const;
export type SortOrder = (typeof SORT_ORDERS)[number];

export interface VideosQuery {
  search?: string;
  sortBy?: VideoSortField;
  order?: SortOrder;
  tutorialsOnly?: boolean;
}
