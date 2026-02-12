'use client';

import dynamic from 'next/dynamic';

const WaterPlaneShader = dynamic(() => import('./WaterPlaneShader'), {
  ssr: false,
});

export default function HeroShader() {
  return (
    <div
      style={{
        position: 'absolute',
        top: '5rem',
        left: '1.5rem',
        right: '1.5rem',
        bottom: '1.5rem',
        borderRadius: '1.5rem',
        overflow: 'hidden',
      }}
    >
      <WaterPlaneShader />
    </div>
  );
}
