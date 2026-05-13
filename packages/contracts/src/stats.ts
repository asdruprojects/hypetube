import type { VideoDTO } from './videos';

export interface StatsDTO {
  totalVideos: number;
  averageHype: number;
  totalTutorials: number;
  topAuthor: string | null;
  topHypeVideo: VideoDTO | null;
}
