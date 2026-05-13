import { useState, type ImgHTMLAttributes } from 'react';
import { cn } from '../lib/cn';

export interface ThumbnailProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string | null;
  /** Texto usado para generar las iniciales del fallback cuando la imagen falla. */
  alt: string;
  /** Override del fondo en el fallback. */
  fallbackClassName?: string;
}

/**
 * Wrapper sobre `<img>` que muestra un fallback visual coherente cuando la URL
 * externa falla (ej.: via.placeholder.com caído o bloqueado por la red del
 * cliente). El fallback es un gradiente sobrio con las iniciales del título.
 */
export function Thumbnail({
  src,
  alt,
  className,
  fallbackClassName,
  loading = 'lazy',
  ...props
}: ThumbnailProps) {
  const [failed, setFailed] = useState(!src);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn(
          'relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br from-zinc-800 via-zinc-900 to-zinc-950 text-zinc-200',
          fallbackClassName,
          className,
        )}
      >
        <div
          aria-hidden
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, rgba(245,197,66,0.18), transparent 55%), radial-gradient(circle at 80% 80%, rgba(99,102,241,0.18), transparent 55%)',
          }}
        />
        <span className="relative font-mono text-2xl font-semibold tracking-widest text-zinc-300/90">
          {getInitials(alt)}
        </span>
      </div>
    );
  }

  return (
    <img
      {...props}
      src={src ?? undefined}
      alt={alt}
      loading={loading}
      onError={() => setFailed(true)}
      className={cn('h-full w-full object-cover', className)}
    />
  );
}

function getInitials(value: string): string {
  if (!value) return 'HT';
  const words = value
    .replace(/[^\p{Letter}\p{Number}\s.-]/gu, '')
    .split(/[\s.-]+/)
    .filter(Boolean);
  if (words.length === 0) return value.slice(0, 2).toUpperCase();
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}
