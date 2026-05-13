import type { HTMLAttributes } from 'react';
import { cn } from '../lib/cn';

type Variant = 'default' | 'tutorial' | 'crown' | 'muted' | 'outline';

const styles: Record<Variant, string> = {
  default: 'bg-emerald-500/10 text-emerald-300 ring-1 ring-inset ring-emerald-500/20',
  /** Contraste alto sobre miniaturas claras u oscuras (no solo sobre fondo oscuro de la app). */
  tutorial:
    'bg-zinc-950/90 text-sky-100 ring-1 ring-inset ring-sky-400/70 shadow-md backdrop-blur-sm font-semibold',
  crown:
    'bg-gradient-to-r from-amber-300/20 via-amber-200/10 to-amber-300/20 text-amber-200 ring-1 ring-inset ring-amber-300/40',
  muted:
    'bg-zinc-950/90 text-zinc-100 ring-1 ring-inset ring-white/30 shadow-md backdrop-blur-sm font-semibold',
  outline: 'text-zinc-300 ring-1 ring-inset ring-white/15',
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
}

export function Badge({ variant = 'default', className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium tracking-wide',
        styles[variant],
        className,
      )}
      {...props}
    />
  );
}
