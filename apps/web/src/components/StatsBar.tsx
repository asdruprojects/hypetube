import { Flame, GraduationCap, Sparkles, UserRound } from 'lucide-react';
import { Skeleton, Stat } from '@hypetube/ui';
import { useStats } from '../hooks/useVideos';
import { formatHype, formatInteger } from '../lib/format';

export function StatsBar() {
  const { data, isLoading, isError } = useStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <p className="text-xs text-zinc-500">No pudimos cargar las métricas. Reintenta más tarde.</p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <Stat
        label="Videos"
        value={formatInteger(data.totalVideos)}
        hint="En la cartelera"
        icon={<Sparkles className="h-4 w-4" />}
      />
      <Stat
        label="Hype promedio"
        value={`${formatHype(data.averageHype)}%`}
        hint="(likes + comments) / views"
        icon={<Flame className="h-4 w-4" />}
      />
      <Stat
        label="Tutoriales"
        value={formatInteger(data.totalTutorials)}
        hint="Detectados por título"
        icon={<GraduationCap className="h-4 w-4" />}
      />
      <Stat
        label="Top creator"
        value={data.topAuthor ?? '—'}
        hint="Mayor hype acumulado"
        icon={<UserRound className="h-4 w-4" />}
      />
    </div>
  );
}
