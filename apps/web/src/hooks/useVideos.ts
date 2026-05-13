import { useQuery } from '@tanstack/react-query';
import type { StatsDTO, VideoDTO, VideosQuery } from '@hypetube/contracts';
import { videosService } from '../lib/api';

export function useVideos(query: VideosQuery) {
  return useQuery<VideoDTO[]>({
    queryKey: ['videos', query],
    queryFn: () => videosService.list(query),
  });
}

export function useStats() {
  return useQuery<StatsDTO>({
    queryKey: ['stats'],
    queryFn: () => videosService.stats(),
  });
}
