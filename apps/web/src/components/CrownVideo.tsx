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
    <article>
      {/* Sin halos absolutos con z-index: crean contextos de apilamiento que disparan
          capas GPU adicionales y artefactos grises en Chrome Android al hacer scroll. */}
      <div className="overflow-hidden rounded-2xl border-2 border-amber-400 bg-amber-50">
        <div className="grid grid-cols-1 md:grid-cols-[1.05fr_1fr]">
          {/* Imagen */}
          <div className="relative aspect-video overflow-hidden bg-stone-200 md:aspect-auto md:min-h-[360px]">
            <Thumbnail
              src={video.thumbnail}
              alt={video.title}
              className="h-full w-full object-cover"
              fallbackClassName="from-stone-300 via-stone-200 to-amber-100 text-stone-700"
              fetchPriority="high"
              sizes="(max-width: 767px) 100vw, 55vw"
            />
            <div className="absolute left-4 top-4">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400 bg-zinc-950 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-amber-200">
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
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-400 bg-amber-100 px-3 py-1.5 text-sm font-semibold text-amber-900">
                <Flame className="h-4 w-4" />
                {formatHype(video.hypeScore)}% hype
              </span>
              {video.isTutorial ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-400 bg-sky-100 px-3 py-1.5 text-xs font-medium text-sky-800">
                  <GraduationCap className="h-3.5 w-3.5" />
                  Tutorial · ×2
                </span>
              ) : null}
            </div>

            <dl className="grid grid-cols-3 gap-2 rounded-xl border border-amber-300 bg-amber-100 p-3 sm:gap-3 sm:p-4">
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
  value,
  fullValue,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  fullValue?: string;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5 overflow-hidden rounded-lg border border-amber-300 bg-white px-2.5 py-2 sm:px-3 sm:py-2.5">
      <dt className="flex min-w-0 items-center gap-1 text-[10px] font-bold uppercase tracking-[0.08em] text-amber-800 sm:gap-1.5 sm:tracking-[0.14em]">
        <span className="shrink-0 text-amber-600">{icon}</span>
        <span className="min-w-0 truncate" title={label}>
          {label}
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
