import { useEffect, useId, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from 'react';
import { ArrowUpDown, Check, ChevronDown, Eye, Flame, Heart, MessageSquare, Search, Sparkles } from 'lucide-react';
import { Input, cn } from '@hypetube/ui';
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

interface SortOption {
  value: VideoSortField;
  label: string;
  hint: string;
  icon: ReactNode;
}

const SORT_OPTIONS: SortOption[] = [
  { value: 'hype', label: 'Hype', hint: 'Score combinado', icon: <Flame className="h-3.5 w-3.5" /> },
  { value: 'views', label: 'Vistas', hint: 'Más reproducidos', icon: <Eye className="h-3.5 w-3.5" /> },
  { value: 'likes', label: 'Likes', hint: 'Más queridos', icon: <Heart className="h-3.5 w-3.5" /> },
  {
    value: 'comments',
    label: 'Comentarios',
    hint: 'Más conversación',
    icon: <MessageSquare className="h-3.5 w-3.5" />,
  },
  { value: 'newest', label: 'Más nuevo', hint: 'Recién publicados', icon: <Sparkles className="h-3.5 w-3.5" /> },
];

export function Filters({ value, onChange }: FiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full sm:max-w-sm">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
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
        <SortMenu
          value={value.sortBy}
          onChange={(next) => onChange({ ...value, sortBy: next })}
        />
        <button
          type="button"
          onClick={() => onChange({ ...value, tutorialsOnly: !value.tutorialsOnly })}
          className={cn(
            'inline-flex h-10 items-center gap-2 rounded-xl border px-3.5 text-sm font-medium transition-all duration-150',
            value.tutorialsOnly
              ? 'border-sky-400/40 bg-sky-400/10 text-sky-200 shadow-[0_0_0_1px_rgba(56,189,248,0.15)]'
              : 'border-white/15 bg-zinc-900/70 text-zinc-300 hover:border-white/25 hover:bg-zinc-900/85 hover:text-zinc-100',
          )}
          aria-pressed={value.tutorialsOnly}
        >
          Solo tutoriales
        </button>
      </div>
    </div>
  );
}

interface SortMenuProps {
  value: VideoSortField;
  onChange: (next: VideoSortField) => void;
}

/**
 * Combobox custom (sin dependencias) que reemplaza al <select> nativo:
 * teclado completo (↑/↓/Home/End/Enter/Esc), click-outside y aria-listbox.
 */
function SortMenu({ value, onChange }: SortMenuProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(() =>
    Math.max(0, SORT_OPTIONS.findIndex((o) => o.value === value)),
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listboxId = useId();

  const selected = SORT_OPTIONS.find((o) => o.value === value) ?? SORT_OPTIONS[0];

  // Al abrir: sincroniza "active" con el value actual y pasa foco al listbox.
  useEffect(() => {
    if (open) {
      setActiveIndex(Math.max(0, SORT_OPTIONS.findIndex((o) => o.value === value)));
      listRef.current?.focus();
    }
  }, [open, value]);

  // Click-outside + Escape global mientras está abierto.
  useEffect(() => {
    if (!open) return;
    const handlePointer = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener('mousedown', handlePointer);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handlePointer);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  const commit = (idx: number) => {
    const opt = SORT_OPTIONS[idx];
    if (!opt) return;
    onChange(opt.value);
    setOpen(false);
    buttonRef.current?.focus();
  };

  const onTriggerKeyDown = (e: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setOpen(true);
    }
  };

  const onListKeyDown = (e: ReactKeyboardEvent<HTMLUListElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % SORT_OPTIONS.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + SORT_OPTIONS.length) % SORT_OPTIONS.length);
    } else if (e.key === 'Home') {
      e.preventDefault();
      setActiveIndex(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setActiveIndex(SORT_OPTIONS.length - 1);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      commit(activeIndex);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onTriggerKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        className={cn(
          'group inline-flex h-10 items-center gap-2 rounded-xl border bg-zinc-900/70 pl-3 pr-2.5 text-sm font-medium text-zinc-200 transition-all duration-150',
          'shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]',
          open
            ? 'border-amber-300/50 bg-zinc-900/90 ring-2 ring-amber-300/20'
            : 'border-white/15 hover:border-white/25 hover:bg-zinc-900/85',
        )}
      >
        <ArrowUpDown className="h-3.5 w-3.5 text-zinc-400 transition-colors group-hover:text-zinc-200" />
        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
          Ordenar
        </span>
        <span className="text-zinc-100">{selected.label}</span>
        <ChevronDown
          className={cn(
            'h-4 w-4 text-zinc-400 transition-transform duration-200',
            open && 'rotate-180 text-zinc-200',
          )}
          aria-hidden
        />
      </button>

      {open ? (
        <ul
          id={listboxId}
          role="listbox"
          tabIndex={-1}
          aria-activedescendant={`${listboxId}-opt-${activeIndex}`}
          onKeyDown={onListKeyDown}
          ref={listRef}
          className={cn(
            // En mobile el dropdown se ancla a la izquierda del botón y se adapta al ancho disponible;
            // en >=sm vuelve al anclaje original a la derecha con ancho fijo.
            'absolute left-0 top-full z-30 mt-2 w-64 min-w-[14rem] max-w-[calc(100vw-2rem)] origin-top-left overflow-hidden rounded-xl border border-white/10 bg-zinc-950 p-1.5 shadow-2xl shadow-black/60',
            'sm:left-auto sm:right-0 sm:max-w-none sm:origin-top-right',
            'animate-fade-in-up outline-none ring-1 ring-white/5',
          )}
        >
          {SORT_OPTIONS.map((opt, idx) => {
            const isSelected = opt.value === value;
            const isActive = idx === activeIndex;
            return (
              <li
                key={opt.value}
                id={`${listboxId}-opt-${idx}`}
                role="option"
                aria-selected={isSelected}
                onMouseEnter={() => setActiveIndex(idx)}
                onClick={() => commit(idx)}
                className={cn(
                  'flex cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2 text-sm transition-colors',
                  isActive ? 'bg-white/10 text-zinc-50' : 'text-zinc-300',
                  isSelected && !isActive && 'text-amber-200',
                )}
              >
                <span
                  className={cn(
                    'flex h-7 w-7 items-center justify-center rounded-md border',
                    isSelected
                      ? 'border-amber-300/40 bg-amber-300/10 text-amber-200'
                      : 'border-white/10 bg-white/[0.03] text-zinc-400',
                  )}
                >
                  {opt.icon}
                </span>
                <span className="flex flex-1 flex-col leading-tight">
                  <span className="font-medium">{opt.label}</span>
                  <span className="text-[11px] text-zinc-500">{opt.hint}</span>
                </span>
                <Check
                  className={cn(
                    'h-4 w-4 shrink-0 transition-opacity',
                    isSelected ? 'text-amber-300 opacity-100' : 'opacity-0',
                  )}
                  aria-hidden
                />
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
