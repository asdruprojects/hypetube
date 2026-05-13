import { useEffect, useMemo, useState } from 'react';
import type { VideoDTO } from '@hypetube/contracts';
import { VideoCard } from './VideoCard';
import { useNarrowScreen } from '../hooks/useNarrowScreen';

interface VideoGridProps {
  videos: VideoDTO[];
}

/** En móvil Chrome decodifica pocas imágenes por batch; 50 a la vez puede tumbar el tab. */
const MOBILE_PAGE = 10;

export function VideoGrid({ videos }: VideoGridProps) {
  const narrow = useNarrowScreen();
  const [mobilePages, setMobilePages] = useState(1);

  const limit = narrow ? Math.min(videos.length, MOBILE_PAGE * mobilePages) : videos.length;
  const shown = useMemo(() => videos.slice(0, limit), [videos, limit]);
  const remaining = videos.length - shown.length;

  useEffect(() => {
    setMobilePages(1);
  }, [videos]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {shown.map((video, index) => (
          <VideoCard
            key={video.id}
            video={video}
            fetchPriority={index < 4 ? 'high' : 'low'}
          />
        ))}
      </div>
      {narrow && remaining > 0 ? (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setMobilePages((p) => p + 1)}
            className="rounded-xl border border-white/15 bg-zinc-900/80 px-4 py-2.5 text-sm font-medium text-zinc-200 transition-colors hover:border-white/25 hover:bg-zinc-900"
          >
            Cargar más ({remaining} restantes)
          </button>
        </div>
      ) : null}
    </div>
  );
}
