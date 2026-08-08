import { useEffect, useRef, useState } from 'react';

interface Options {
  from?: number;
  duration?: number;
  decimals?: number;
}

/** Animates a number from 0 (or `from`) to `value` on mount and when value changes. */
export function useCountUp(value: number, opts: Options = {}) {
  const { duration = 1000, decimals = 0 } = opts;
  const [display, setDisplay] = useState(0);
  const rafRef = useRef<number | null>(null);
  const fromRef = useRef(0);

  useEffect(() => {
    const start = performance.now();
    const from = fromRef.current;
    const delta = value - from;
    fromRef.current = value;
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(from + delta * eased);
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [value, duration]);

  return decimals === 0 ? Math.round(display) : Number(display.toFixed(decimals));
}
