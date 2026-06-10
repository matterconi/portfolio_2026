'use client';

import React, { useId } from 'react';

interface CircularCTAProps {
  label: string;
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  className?: string;
}

export default function CircularCTA({
  label,
  children,
  onClick,
  href,
  disabled,
  className = '',
}: CircularCTAProps) {
  const uid = useId();
  const pathId = `circlePath-${uid}`;

  const content = (
    <>
      <svg
        className="absolute inset-0 w-full h-full animate-[spin_12s_linear_infinite]"
        viewBox="0 0 144 144"
      >
        <defs>
          <path
            id={pathId}
            d="M 72,72 m -56,0 a 56,56 0 1,1 112,0 a 56,56 0 1,1 -112,0"
          />
        </defs>
        <text
          fill="currentColor"
          className="text-foreground-muted text-[13px] uppercase tracking-[0.3em] transition-colors group-hover:text-accent-cyan"
        >
          <textPath href={`#${pathId}`}>
            {label} · {label} ·&nbsp;
          </textPath>
        </text>
      </svg>
      <div className="relative flex items-center justify-center text-white transition-colors group-hover:text-accent-cyan">
        {children}
      </div>
    </>
  );

  const baseClasses =
    'group relative inline-flex items-center justify-center w-36 h-36 rounded-full bg-black/90 transition-all';

  return (
    <div
      className={`relative rounded-full p-px transition-transform hover:scale-110 ${className}`}
      style={{
        background: 'linear-gradient(135deg, #ffffff40, transparent 50%, #ffffff20)',
        boxShadow: '0 0 25px #ffffff15, 0 0 50px #ffffff0d',
      }}
    >
      {href ? (
        <a href={href} className={baseClasses}>
          {content}
        </a>
      ) : (
        <button
          type="button"
          onClick={onClick}
          disabled={disabled}
          className={`${baseClasses} ${disabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'}`}
        >
          {content}
        </button>
      )}
    </div>
  );
}
