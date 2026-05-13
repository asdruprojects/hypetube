import type { StatsDTO, VideoDTO, VideosQuery } from '@hypetube/contracts';
import type { ApiClient } from './apiClient';

export interface VideosService {
  list(query?: VideosQuery): Promise<VideoDTO[]>;
  stats(): Promise<StatsDTO>;
}

export function createVideosService(client: ApiClient): VideosService {
  return {
    async list(query) {
      const res = await client.get<VideoDTO[]>('/api/videos', {
        params: query as Record<string, string | number | boolean | undefined>,
      });
      return res.data;
    },
    async stats() {
      const res = await client.get<StatsDTO>('/api/stats');
      return res.data;
    },
  };
}
