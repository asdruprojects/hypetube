import type { ReactNode } from 'react';
import { cn } from '../lib/cn';

export interface StatProps {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  icon?: ReactNode;
  className?: string;
}

export function Stat({ label, value, hint, icon, className }: StatProps) {
  const valueTitle = typeof value === 'string' ? value : undefined;

  return (
    <div
      className={cn(
        'relative isolate flex min-h-0 min-w-0 flex-col gap-1.5 overflow-hidden rounded-2xl border border-amber-400/35 bg-gradient-to-b from-zinc-900/90 to-zinc-900/75 p-3 shadow-[0_0_0_1px_rgba(251,191,36,0.12),0_12px_36px_-14px_rgba(245,197,66,0.18)] ring-1 ring-inset ring-amber-400/15 sm:p-4',
        'before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(120%_80%_at_50%_-20%,rgba(251,191,36,0.12),transparent_55%)]',
        className,
      )}
    >
      <div className="relative flex min-w-0 items-start justify-between gap-2 text-zinc-400">
        <span className="min-w-0 truncate text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-100/70">
          {label}
        </span>
        {icon ? (
          <span className="shrink-0 text-amber-400/90 drop-shadow-[0_0_8px_rgba(251,191,36,0.35)]">{icon}</span>
        ) : null}
      </div>
      <span
        className="relative min-w-0 max-w-full truncate text-left text-base font-bold tabular-nums tracking-tight text-zinc-50 drop-shadow-sm sm:text-2xl"
        title={valueTitle}
      >
        {value}
      </span>
      {hint ? (
        <span className="relative min-w-0 truncate text-xs font-medium text-zinc-400">{hint}</span>
      ) : null}
    </div>
  );
}
