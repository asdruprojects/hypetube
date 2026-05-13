import { forwardRef, type SelectHTMLAttributes } from 'react';
import { cn } from '../lib/cn';

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        'h-9 rounded-lg border border-white/10 bg-zinc-950/60 px-3 text-sm text-zinc-100',
        'outline-none transition-colors focus:border-white/25 focus:ring-2 focus:ring-white/10',
        'appearance-none bg-[url("data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20fill=%27none%27%20viewBox=%270%200%2024%2024%27%20stroke-width=%271.5%27%20stroke=%27%23a1a1aa%27%3E%3Cpath%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27%20d=%27M8.25%2015%2012%2018.75%2015.75%2015m-7.5-6L12%205.25%2015.75%209%27%20/%3E%3C/svg%3E")] bg-[length:14px_14px] bg-[right_0.5rem_center] bg-no-repeat pr-8',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  ),
);
Select.displayName = 'Select';
