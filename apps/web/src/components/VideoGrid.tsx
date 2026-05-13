import { useEffect, useMemo, useRef, useState } from 'react';
import type { VideoDTO } from '@hypetube/contracts';
import { VideoCard } from './VideoCard';
import { useNarrowScreen } from '../hooks/useNarrowScreen';

interface VideoGridProps {
  videos: VideoDTO[];
}

/** Batch inicial en móvil para no saturar el GPU al primer render. */
const MOBILE_PAGE = 10;

export function VideoGrid({ videos }: VideoGridProps) {
  const narrow = useNarrowScreen();
  const [mobilePages, setMobilePages] = useState(1);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const limit = narrow ? Math.min(videos.length, MOBILE_PAGE * mobilePages) : videos.length;
  const shown = useMemo(() => videos.slice(0, limit), [videos, limit]);
  const hasMore = narrow && videos.length > limit;

  // Reinicia al cambiar la lista (nuevo filtro/búsqueda).
  useEffect(() => {
    setMobilePages(1);
  }, [videos]);

  // Scroll infinito: cuando el sentinel entra en el viewport, cargamos el siguiente batch.
  useEffect(() => {
    if (!hasMore) return;
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setMobilePages((p) => p + 1);
        }
      },
      { rootMargin: '200px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore]);

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

      {/* Sentinel invisible: cuando aparece en pantalla, carga el siguiente batch. */}
      {hasMore ? (
        <div ref={sentinelRef} className="flex justify-center py-4">
          <span className="text-xs text-zinc-500">Cargando más…</span>
        </div>
      ) : null}
    </div>
  );
}
