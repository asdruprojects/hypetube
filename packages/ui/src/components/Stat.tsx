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
        'flex min-w-0 flex-col gap-1.5 overflow-hidden rounded-xl border border-amber-500 bg-zinc-900 p-3 sm:p-4',
        className,
      )}
    >
      <div className="flex min-w-0 items-start justify-between gap-2">
        <span className="min-w-0 truncate text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-200">
          {label}
        </span>
        {icon ? <span className="shrink-0 text-amber-400">{icon}</span> : null}
      </div>
      <span
        className="min-w-0 max-w-full truncate text-base font-bold tabular-nums tracking-tight text-zinc-50 sm:text-2xl"
        title={valueTitle}
      >
        {value}
      </span>
      {hint ? (
        <span className="min-w-0 truncate text-xs font-medium text-zinc-400">{hint}</span>
      ) : null}
    </div>
  );
}
