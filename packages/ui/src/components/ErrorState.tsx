import { AlertTriangle } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from './Button';

export interface ErrorStateProps {
  title?: string;
  description?: ReactNode;
  onRetry?: () => void;
  retryLabel?: string;
}

export function ErrorState({
  title = 'No pudimos cargar la cartelera',
  description = 'Algo se cayó en el servicio. Reintenta en un momento.',
  onRetry,
  retryLabel = 'Reintentar',
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-red-500/15 bg-red-500/5 p-10 text-center">
      <AlertTriangle className="h-7 w-7 text-red-300" aria-hidden />
      <div className="space-y-1">
        <p className="text-sm font-medium text-red-100">{title}</p>
        <p className="max-w-md text-xs text-red-200/80">{description}</p>
      </div>
      {onRetry ? (
        <Button variant="outline" size="sm" onClick={onRetry}>
          {retryLabel}
        </Button>
      ) : null}
    </div>
  );
}
