'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

/**
 * The site's only animation: a one-shot entrance rise as an element scrolls in.
 *
 * Content is never animation-gated. The hidden initial state is applied only
 * under the `.js` class that layout.tsx sets on <html>, so with JavaScript
 * disabled everything renders visible. `prefers-reduced-motion: reduce` skips
 * the transition entirely and shows the final state immediately.
 */
export default function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setShown(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShown(true);
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-reveal
      data-shown={shown ? 'true' : 'false'}
      style={{ transitionDelay: `${delay}ms` }}
      className={`h-full ${className}`}
    >
      {children}
    </div>
  );
}
