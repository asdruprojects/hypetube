import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '../lib/cn';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'h-10 w-full rounded-xl border border-white/15 bg-zinc-900/70 px-3 text-sm text-zinc-100 placeholder:text-zinc-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]',
        'outline-none transition-all duration-150 hover:border-white/25 hover:bg-zinc-900/85',
        'focus:border-amber-300/50 focus:bg-zinc-900/90 focus:ring-2 focus:ring-amber-300/20',
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = 'Input';
