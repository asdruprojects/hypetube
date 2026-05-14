import type { HTMLAttributes } from 'react';
import { cn } from '../lib/cn';

type Variant = 'default' | 'tutorial' | 'crown' | 'muted' | 'outline';

const styles: Record<Variant, string> = {
  default: 'bg-emerald-950 text-emerald-300 border border-emerald-700',
  tutorial: 'bg-zinc-950 text-sky-100 border border-sky-500 font-semibold',
  crown: 'bg-amber-950 text-amber-200 border border-amber-500',
  muted: 'bg-zinc-950 text-zinc-100 border border-zinc-600 font-semibold',
  outline: 'text-zinc-300 border border-zinc-700',
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
