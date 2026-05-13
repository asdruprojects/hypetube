import { useMemo, useState } from 'react';
import type { VideoDTO, VideosQuery } from '@hypetube/contracts';
import { EmptyState, ErrorState } from '@hypetube/ui';
import { Header } from './components/Header';
import { StatsBar } from './components/StatsBar';
import { Filters, type FiltersState } from './components/Filters';
import { VideoGrid } from './components/VideoGrid';
import { VideoGridSkeleton } from './components/VideoGridSkeleton';
import { CrownVideo } from './components/CrownVideo';
import { useDebouncedValue } from './hooks/useDebouncedValue';
import { useVideos } from './hooks/useVideos';

const DEFAULT_FILTERS: FiltersState = {
  search: '',
  sortBy: 'hype',
  tutorialsOnly: false,
};

export function App() {
  const [filters, setFilters] = useState<FiltersState>(DEFAULT_FILTERS);
  const debouncedSearch = useDebouncedValue(filters.search.trim(), 300);

  const query: VideosQuery = useMemo(
    () => ({
      search: debouncedSearch || undefined,
      sortBy: filters.sortBy,
      order: 'desc',
      tutorialsOnly: filters.tutorialsOnly || undefined,
    }),
    [debouncedSearch, filters.sortBy, filters.tutorialsOnly],
  );

  const { data, isLoading, isError, refetch, isFetching } = useVideos(query);

  // La joya de la corona se calcula sobre el resultado actual: si el usuario
  // filtra, el "top" representa lo mejor de su contexto. No-search and no-filter
  // = top global.
  const { crown, rest } = useMemo(() => splitCrown(data ?? []), [data]);
  const hasActiveFilters = Boolean(debouncedSearch) || filters.tutorialsOnly;

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container space-y-10 py-8 md:py-12">
        <section aria-labelledby="overview-heading" className="space-y-6">
          <div className="space-y-2">
            <h1
              id="overview-heading"
              className="text-2xl font-semibold tracking-tight text-zinc-50 md:text-3xl"
            >
              Tu cartelera de conocimiento
            </h1>
            <p className="max-w-2xl text-sm text-zinc-400">
              Filtramos el ruido del payload de YouTube y dejamos solo lo que importa: hype real,
              tutoriales detectados y un pulso del top creator.
            </p>
          </div>
          <StatsBar />
        </section>

        <section aria-labelledby="catalog-heading" className="space-y-5">
          <div className="flex flex-col gap-2">
            <h2 id="catalog-heading" className="sr-only">
              Catálogo de videos
            </h2>
            <Filters value={filters} onChange={setFilters} />
          </div>

          {isLoading ? (
            <>
              <div className="h-[260px] animate-pulse rounded-3xl border border-white/5 bg-zinc-950/40 sm:h-[320px]" />
              <VideoGridSkeleton />
            </>
          ) : isError ? (
            <ErrorState onRetry={() => refetch()} />
          ) : !data || data.length === 0 ? (
            <EmptyState
              title={hasActiveFilters ? 'Sin coincidencias' : 'No hay videos disponibles'}
              description={
                hasActiveFilters
                  ? 'Ajusta tu búsqueda o quita los filtros para ver toda la cartelera.'
                  : 'El dump no contiene videos válidos. Verifica el archivo fuente.'
              }
            />
          ) : (
            <div className="space-y-6">
              {crown ? <CrownVideo video={crown} /> : null}
              {rest.length > 0 ? (
                <VideoGrid videos={rest} />
              ) : crown ? (
                <p className="text-xs text-zinc-500">Solo encontramos un match para tu filtro.</p>
              ) : null}
            </div>
          )}

          {isFetching && !isLoading ? (
            <p className="pt-2 text-center text-[11px] uppercase tracking-[0.18em] text-zinc-500">
              Actualizando…
            </p>
          ) : null}
        </section>
      </main>

      <footer className="border-t border-white/5 py-6 text-center text-xs text-zinc-500">
        Hecho con criterio · HypeTube
      </footer>
    </div>
  );
}

/**
 * Separa el video con mayor hype del resto. Si el listado viene ordenado por hype
 * desc (caso por defecto) basta con tomar el primero; pero el helper es agnóstico
 * al sortBy actual: siempre elige el de hype más alto.
 */
function splitCrown(videos: VideoDTO[]): { crown: VideoDTO | null; rest: VideoDTO[] } {
  if (videos.length === 0) return { crown: null, rest: [] };
  let crown = videos[0];
  for (const v of videos) {
    if (v.hypeScore > crown.hypeScore) crown = v;
  }
  // Solo destacamos cuando el hype del top es estrictamente mayor a 0;
  // si todo el catálogo tiene hype 0 (p. ej. todos sin comentarios), no
  // tiene sentido mostrar "joya de la corona".
  if (crown.hypeScore <= 0) return { crown: null, rest: videos };
  return { crown, rest: videos.filter((v) => v.id !== crown.id) };
}
