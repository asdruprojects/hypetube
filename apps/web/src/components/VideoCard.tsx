import { Eye, Flame, GraduationCap, Heart, MessageSquare, MessageSquareOff } from 'lucide-react';
import type { VideoDTO } from '@hypetube/contracts';
import { Badge, Card, Thumbnail } from '@hypetube/ui';
import { formatCompact, formatHype } from '../lib/format';

interface VideoCardProps {
  video: VideoDTO;
  /** Menos decodificaciones simultáneas en móvil (evita crash de Chrome). */
  fetchPriority?: 'high' | 'low' | 'auto';
}

export function VideoCard({ video, fetchPriority = 'low' }: VideoCardProps) {
  const commentsDisabled = video.comments === null;
  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <div className="relative aspect-video overflow-hidden bg-zinc-900">
        <Thumbnail
          src={video.thumbnail}
          alt={video.title}
          className="h-full w-full object-cover"
          fetchPriority={fetchPriority}
          sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw"
        />
        <div className="absolute left-2 top-2 flex flex-wrap gap-1.5">
          {video.isTutorial ? (
            <Badge variant="tutorial">
              <GraduationCap className="h-3 w-3" /> Tutorial
            </Badge>
          ) : null}
          {commentsDisabled ? (
            <Badge variant="muted">
              <MessageSquareOff className="h-3 w-3" /> Sin comentarios
            </Badge>
          ) : null}
        </div>
        <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full border border-amber-500 bg-zinc-950 px-2 py-0.5 text-[11px] font-semibold text-amber-200">
          <Flame className="h-3 w-3" />
          {formatHype(video.hypeScore)}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="space-y-1">
          <h3
            className="line-clamp-2 text-sm font-semibold leading-snug text-zinc-100"
            title={video.title}
          >
            {video.title || 'Sin título'}
          </h3>
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <span className="truncate">{video.author}</span>
            <span aria-hidden>·</span>
            <span className="shrink-0">{video.relativePublishedDate}</span>
          </div>
        </div>

        <div className="mt-auto grid grid-cols-3 gap-2 text-xs text-zinc-400">
          <Metric icon={<Eye className="h-3.5 w-3.5" />} label={formatCompact(video.views)} />
          <Metric icon={<Heart className="h-3.5 w-3.5" />} label={formatCompact(video.likes)} />
          <Metric
            icon={<MessageSquare className="h-3.5 w-3.5" />}
            label={commentsDisabled ? 'off' : formatCompact(video.comments)}
          />
        </div>
      </div>
    </Card>
  );
}

function Metric({ icon, label }: { icon: React.ReactNode; label: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-zinc-500">{icon}</span>
      <span className="font-medium text-zinc-300">{label}</span>
    </div>
  );
}
