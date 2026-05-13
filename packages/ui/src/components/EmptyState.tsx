import { SearchX } from 'lucide-react';
import type { ReactNode } from 'react';

export interface EmptyStateProps {
  title?: string;
  description?: ReactNode;
  icon?: ReactNode;
}

export function EmptyState({
  title = 'Sin resultados',
  description = 'Ajusta los filtros o la búsqueda para ver más videos.',
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-white/5 bg-zinc-950/40 p-10 text-center">
      {icon ?? <SearchX className="h-7 w-7 text-zinc-500" aria-hidden />}
      <div className="space-y-1">
        <p className="text-sm font-medium text-zinc-100">{title}</p>
        <p className="max-w-md text-xs text-zinc-400">{description}</p>
      </div>
    </div>
  );
}
