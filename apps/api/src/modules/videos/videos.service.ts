import { Injectable } from '@nestjs/common';
import type { VideoDTO, VideoSortField, VideosQuery } from '@hypetube/contracts';
import { VideosRepository } from './videos.repository';

@Injectable()
export class VideosService {
  constructor(private readonly repo: VideosRepository) {}

  /** Devuelve los videos transformados aplicando filtros y orden. */
  async findAll(query: VideosQuery = {}): Promise<VideoDTO[]> {
    const all = await this.repo.findAll();
    const filtered = this.applyFilters(all, query);
    return this.applySort(filtered, query.sortBy, query.order);
  }

  /** Video con mayor hype, o `null` si no hay candidatos válidos. */
  async findCrown(): Promise<VideoDTO | null> {
    const all = await this.repo.findAll();
    if (all.length === 0) return null;
    return all.reduce((top, curr) => (curr.hypeScore > top.hypeScore ? curr : top), all[0]);
  }

  private applyFilters(list: VideoDTO[], query: VideosQuery): VideoDTO[] {
    const search = query.search?.toLowerCase().trim();
    const onlyTutorials = query.tutorialsOnly === true;

    if (!search && !onlyTutorials) return list;

    return list.filter((v) => {
      if (onlyTutorials && !v.isTutorial) return false;
      if (search) {
        const haystack = `${v.title} ${v.author}`.toLowerCase();
        if (!haystack.includes(search)) return false;
      }
      return true;
    });
  }

  private applySort(
    list: VideoDTO[],
    sortBy: VideoSortField | undefined,
    order: 'asc' | 'desc' | undefined,
  ): VideoDTO[] {
    const field: VideoSortField = sortBy ?? 'hype';
    const direction = order === 'asc' ? 1 : -1;

    const value = (v: VideoDTO): number => {
      switch (field) {
        case 'hype':
          return v.hypeScore;
        case 'views':
          return v.views;
        case 'likes':
          return v.likes;
        case 'comments':
          return v.comments ?? -1;
        case 'newest':
          return new Date(v.publishedAt).getTime() || 0;
        default:
          return 0;
      }
    };

    // Copia para no mutar el array cacheado del repositorio.
    return [...list].sort((a, b) => (value(a) - value(b)) * direction);
  }
}
