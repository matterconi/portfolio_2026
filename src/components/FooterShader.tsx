'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';

const WaterPlaneShader = dynamic(() => import('./WaterPlaneShader'), {
  ssr: false,
});

export default function FooterShader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { rootMargin: '200px', threshold: 0.01 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute overflow-hidden"
      style={{
        top: '1.5rem',
        left: '1.5rem',
        right: '1.5rem',
        bottom: '1.5rem',
        borderRadius: '1.5rem',
      }}
    >
      <WaterPlaneShader active={active} />
      <div className="absolute inset-0 bg-black/70" />
    </div>
  );
}
