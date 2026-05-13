import { Crown, Eye, Flame, GraduationCap, Heart, MessageSquare } from 'lucide-react';
import type { ReactNode } from 'react';
import type { VideoDTO } from '@hypetube/contracts';
import { Thumbnail } from '@hypetube/ui';
import { formatCompact, formatHype } from '../lib/format';

interface CrownVideoProps {
  video: VideoDTO;
}

/**
 * Banner del video con mayor hype. Tono claro/premium para diferenciarse
 * radicalmente de la grilla oscura: actúa como un "spotlight" sobrio,
 * no como otra card del catálogo.
 */
export function CrownVideo({ video }: CrownVideoProps) {
  const commentsDisabled = video.comments === null;

  return (
    <article className="relative animate-fade-in-up">
      {/* Halo dorado externo — recortado en mobile para que no genere overflow horizontal */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-4 -z-10 rounded-[2.25rem] bg-[radial-gradient(70%_65%_at_50%_45%,rgba(251,191,36,0.4),rgba(245,197,66,0.13)_45%,transparent_75%)] blur-[2px] sm:-inset-8 md:-inset-12 md:rounded-[3rem]"
      />
      {/* Brillo interior secundario (más sutil) */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-2 -z-10 rounded-[2rem] bg-[radial-gradient(60%_55%_at_50%_50%,rgba(255,224,140,0.22),transparent_70%)]"
      />

      <div className="relative overflow-hidden rounded-3xl border border-amber-300/55 bg-gradient-to-br from-amber-50 via-white to-stone-100 shadow-[0_0_0_1px_rgba(251,191,36,0.1),0_0_52px_-10px_rgba(245,197,66,0.4),0_32px_64px_-24px_rgba(120,80,20,0.32)]">
        <div className="grid grid-cols-1 md:grid-cols-[1.05fr_1fr]">
          {/* Imagen */}
          <div className="relative aspect-video overflow-hidden bg-stone-200 md:aspect-auto md:min-h-[360px]">
            <Thumbnail
              src={video.thumbnail}
              alt={video.title}
              className="h-full w-full object-cover"
              fallbackClassName="from-stone-300 via-stone-200 to-amber-100 text-stone-700"
            />
            {/* Tinte sutil dorado sobre la imagen para integrarla al fondo claro */}
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-tr from-amber-900/10 via-transparent to-white/20 mix-blend-soft-light"
            />
            <div className="absolute left-4 top-4">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/60 bg-zinc-950/90 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-amber-200 shadow-[0_0_28px_-2px_rgba(251,191,36,0.7)] backdrop-blur-sm">
                <Crown className="h-3.5 w-3.5 text-amber-300" />
                Joya de la Corona
              </span>
            </div>
          </div>

          {/* Contenido */}
          <div className="flex flex-col justify-center gap-6 p-6 md:p-9">
            <div className="space-y-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-amber-700">
                Mayor hype de la cartelera
              </p>
              <h2 className="text-2xl font-semibold leading-[1.15] tracking-tight text-zinc-900 md:text-[28px]">
                {video.title}
              </h2>
              <div className="flex items-center gap-2 text-sm text-zinc-500">
                <span className="font-medium text-zinc-800">{video.author}</span>
                <span aria-hidden className="text-zinc-300">·</span>
                <span>{video.relativePublishedDate}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-amber-100/80 px-3 py-1.5 text-sm font-semibold text-amber-900 ring-1 ring-inset ring-amber-300/60">
                <Flame className="h-4 w-4" />
                {formatHype(video.hypeScore)}% hype
              </span>
              {video.isTutorial ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-100 px-3 py-1.5 text-xs font-medium text-sky-800 ring-1 ring-inset ring-sky-300/60">
                  <GraduationCap className="h-3.5 w-3.5" />
                  Tutorial · ×2
                </span>
              ) : null}
            </div>

            <dl className="grid grid-cols-3 gap-2 rounded-2xl border border-amber-200/80 bg-gradient-to-b from-amber-50/95 to-amber-100/40 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] ring-1 ring-amber-300/40 sm:gap-3 sm:p-4">
              <CrownMetric
                icon={<Eye className="h-4 w-4" />}
                label="Vistas"
                value={formatCompact(video.views)}
              />
              <CrownMetric
                icon={<Heart className="h-4 w-4" />}
                label="Likes"
                value={formatCompact(video.likes)}
              />
              <CrownMetric
                icon={<MessageSquare className="h-4 w-4" />}
                label="Comentarios"
                shortLabel="Coments"
                value={commentsDisabled ? 'Off' : formatCompact(video.comments)}
                fullValue={commentsDisabled ? 'Desactivados' : undefined}
              />
            </dl>
          </div>
        </div>
      </div>
    </article>
  );
}

function CrownMetric({
  icon,
  label,
  shortLabel,
  value,
  fullValue,
}: {
  icon: ReactNode;
  label: string;
  shortLabel?: string;
  value: ReactNode;
  fullValue?: string;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5 overflow-hidden rounded-xl border border-amber-300/50 bg-white/70 px-2.5 py-2 shadow-sm ring-1 ring-inset ring-white/60 sm:px-3 sm:py-2.5">
      <dt className="flex min-w-0 items-center gap-1 text-[10px] font-bold uppercase tracking-[0.1em] text-amber-800/80 sm:gap-1.5 sm:tracking-[0.18em]">
        <span className="shrink-0 text-amber-600">{icon}</span>
        {/* En mobile mostramos una etiqueta corta para que el card no se rompa;
         * la versión completa queda accesible para lectores de pantalla. */}
        <span className="min-w-0 truncate">
          <span className="sm:hidden">{shortLabel ?? label}</span>
          <span className="hidden sm:inline">{label}</span>
        </span>
      </dt>
      <dd
        className="whitespace-nowrap text-base font-bold tabular-nums tracking-tight text-zinc-900 sm:text-xl"
        title={fullValue}
      >
        {value}
      </dd>
    </div>
  );
}
