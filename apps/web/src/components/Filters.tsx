import { Search } from 'lucide-react';
import { Input, Select, cn } from '@hypetube/ui';
import type { VideoSortField } from '@hypetube/contracts';

export interface FiltersState {
  search: string;
  sortBy: VideoSortField;
  tutorialsOnly: boolean;
}

interface FiltersProps {
  value: FiltersState;
  onChange: (next: FiltersState) => void;
}

export function Filters({ value, onChange }: FiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full sm:max-w-sm">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
          aria-hidden
        />
        <Input
          type="search"
          placeholder="Buscar por título o autor…"
          value={value.search}
          onChange={(e) => onChange({ ...value, search: e.target.value })}
          className="pl-9"
          aria-label="Buscar videos"
        />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Select
          value={value.sortBy}
          onChange={(e) => onChange({ ...value, sortBy: e.target.value as VideoSortField })}
          aria-label="Ordenar por"
        >
          <option value="hype">Ordenar: Hype</option>
          <option value="views">Ordenar: Vistas</option>
          <option value="likes">Ordenar: Likes</option>
          <option value="comments">Ordenar: Comentarios</option>
          <option value="newest">Ordenar: Más nuevo</option>
        </Select>
        <button
          type="button"
          onClick={() => onChange({ ...value, tutorialsOnly: !value.tutorialsOnly })}
          className={cn(
            'inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-sm font-medium transition-colors',
            value.tutorialsOnly
              ? 'border-sky-400/30 bg-sky-400/10 text-sky-200'
              : 'border-white/10 bg-zinc-950/60 text-zinc-300 hover:border-white/20 hover:text-zinc-100',
          )}
          aria-pressed={value.tutorialsOnly}
        >
          Solo tutoriales
        </button>
      </div>
    </div>
  );
}
