/**
 * Subset del payload original de YouTube que realmente usamos.
 * Sólo declaramos los campos que tocamos; el resto se ignora.
 */
export interface YoutubeThumbnail {
  url: string;
}

export interface YoutubeSnippet {
  title?: string;
  channelTitle?: string;
  publishedAt?: string;
  thumbnails?: {
    default?: YoutubeThumbnail;
    medium?: YoutubeThumbnail;
    high?: YoutubeThumbnail;
    standard?: YoutubeThumbnail;
    maxres?: YoutubeThumbnail;
  };
}

export interface YoutubeStatistics {
  viewCount?: string | number;
  likeCount?: string | number;
  /** Cuando los comentarios están deshabilitados, este campo viene ausente. */
  commentCount?: string | number;
}

export interface YoutubeRawItem {
  id?: string;
  snippet?: YoutubeSnippet;
  statistics?: YoutubeStatistics;
}

export interface YoutubeRawResponse {
  kind?: string;
  items?: YoutubeRawItem[];
}
