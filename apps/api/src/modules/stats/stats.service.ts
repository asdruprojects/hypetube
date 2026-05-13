import { Injectable } from '@nestjs/common';
import type { StatsDTO, VideoDTO } from '@hypetube/contracts';
import { VideosService } from '../videos/videos.service';

@Injectable()
export class StatsService {
  constructor(private readonly videos: VideosService) {}

  async getStats(): Promise<StatsDTO> {
    const all = await this.videos.findAll();
    if (all.length === 0) {
      return {
        totalVideos: 0,
        averageHype: 0,
        totalTutorials: 0,
        topAuthor: null,
        topHypeVideo: null,
      };
    }

    const totalHype = all.reduce((acc, v) => acc + v.hypeScore, 0);
    const averageHype = Number.parseFloat((totalHype / all.length).toFixed(4));
    const totalTutorials = all.filter((v) => v.isTutorial).length;

    return {
      totalVideos: all.length,
      averageHype,
      totalTutorials,
      topAuthor: this.computeTopAuthor(all),
      topHypeVideo: this.computeTopHypeVideo(all),
    };
  }

  /**
   * "Top creator" se define como el autor con mayor hype acumulado entre todos
   * sus videos. Empates se rompen por mayor cantidad de videos (más prolífico).
   */
  private computeTopAuthor(videos: VideoDTO[]): string | null {
    const byAuthor = new Map<string, { hype: number; count: number }>();
    for (const v of videos) {
      const current = byAuthor.get(v.author) ?? { hype: 0, count: 0 };
      current.hype += v.hypeScore;
      current.count += 1;
      byAuthor.set(v.author, current);
    }

    let topAuthor: string | null = null;
    let topHype = -Infinity;
    let topCount = -Infinity;

    for (const [author, stats] of byAuthor) {
      if (stats.hype > topHype || (stats.hype === topHype && stats.count > topCount)) {
        topAuthor = author;
        topHype = stats.hype;
        topCount = stats.count;
      }
    }
    return topAuthor;
  }

  private computeTopHypeVideo(videos: VideoDTO[]): VideoDTO {
    return videos.reduce((top, curr) => (curr.hypeScore > top.hypeScore ? curr : top), videos[0]);
  }
}
