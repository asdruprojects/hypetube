import { useLayoutEffect, useState } from 'react';

/**
 * true cuando el viewport es estrecho (móvil). Usado para aliviar carga en Chrome Android
 * (menos imágenes montadas a la vez = menos riesgo de crash del tab).
 */
export function useNarrowScreen(maxWidthPx = 639): boolean {
  const [narrow, setNarrow] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(`(max-width: ${maxWidthPx}px)`).matches : false,
  );

  useLayoutEffect(() => {
    const mq = window.matchMedia(`(max-width: ${maxWidthPx}px)`);
    const onChange = () => setNarrow(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [maxWidthPx]);

  return narrow;
}
