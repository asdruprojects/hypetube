import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '../lib/cn';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'h-9 w-full rounded-lg border border-white/10 bg-zinc-950/60 px-3 text-sm text-zinc-100 placeholder:text-zinc-500',
        'outline-none transition-colors focus:border-white/25 focus:bg-zinc-950/80 focus:ring-2 focus:ring-white/10',
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = 'Input';
