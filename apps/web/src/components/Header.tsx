import { Zap } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-zinc-950/85 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.6)] supports-[backdrop-filter]:bg-zinc-900/55 supports-[backdrop-filter]:backdrop-blur-md">
      <div className="container flex items-center justify-between py-4">
        <a href="/" className="group flex items-center gap-3" aria-label="HypeTube — inicio">
          <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-300 via-amber-400 to-rose-400 text-zinc-950 shadow-[0_10px_30px_-12px_rgba(245,197,66,0.55)] ring-1 ring-amber-200/40 transition-transform group-hover:scale-[1.04]">
            <Zap className="h-4 w-4" strokeWidth={2.5} />
          </span>
          <div className="flex flex-col gap-1 leading-tight">
            <span className="text-base font-semibold tracking-tight text-zinc-50">HypeTube</span>
            <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-300/95">
              Cartelera de hype tecnológico
            </span>
          </div>
        </a>
        <nav className="hidden items-center gap-5 text-xs text-zinc-400 sm:flex">
          <a
            href="https://github.com/asdruprojects/hypetube"
            target="_blank"
            rel="noreferrer noopener"
            className="transition-colors hover:text-zinc-100"
          >
            GitHub
          </a>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.18em] text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> en vivo
          </span>
        </nav>
      </div>
    </header>
  );
}
