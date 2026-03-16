'use client';

import dynamic from 'next/dynamic';

const WaterPlaneShader = dynamic(() => import('./WaterPlaneShader'), {
  ssr: false,
});

export default function FooterShader() {
  return (
    <div
      className="pointer-events-none absolute overflow-hidden"
      style={{
        top: '1.5rem',
        left: '1.5rem',
        right: '1.5rem',
        bottom: '1.5rem',
        borderRadius: '1.5rem',
      }}
    >
      <WaterPlaneShader />
      <div className="absolute inset-0 bg-black/70" />
    </div>
  );
}
