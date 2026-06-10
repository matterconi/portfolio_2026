'use client';

import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ComparisonSectionProps {
  translations: {
    title: string;
    description: string;
    aiLabel: string;
    devLabel: string;
  };
}

export default function ComparisonSection({ translations }: ComparisonSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!sectionRef.current || !maskRef.current) return;

    const ctx = gsap.context(() => {
      // ai-mask.svg: viewBox -1000 -1000 4200 4200 (padded square)
      // Spark bounding box in SVG coords: x 374–1827, y 245–1944
      // Center ~(1100, 1095). ViewBox center = (1100, 1100).
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      // background-size:cover → scale = max(vw/4200, vh/4200)
      const cs = Math.max(vw / 4200, vh / 4200);
      const sparkHalfW = 727 * cs; // 1827 - 1100
      const sparkHalfH = 855 * cs; // 1100 - 245
      const neededScale = Math.max(vw / (2 * sparkHalfW), vh / (2 * sparkHalfH));
      const startScale = Math.max(neededScale * 1.4, 5);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=150%',
          pin: true,
          scrub: true,
          pinSpacing: true,
          onLeaveBack: () => {
            if (!maskRef.current) return;
            gsap.set(maskRef.current, { scale: startScale, opacity: 0 });
          },
        },
      });

      // fromTo guarantees the animation always starts from startScale,
      // regardless of any inline styles or re-renders.
      tl.fromTo(
        maskRef.current,
        { scale: startScale, opacity: 0, transformOrigin: 'center center' },
        { opacity: 1, duration: 0.1, ease: 'none' }
      );
      tl.fromTo(
        maskRef.current,
        { scale: startScale },
        { scale: 1, ease: 'power2.out', duration: 0.9 },
        '<'
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative z-20 min-h-screen">
      <div className="relative h-screen overflow-hidden bg-black">

        {/* ── Video layer (below mask) ──────────────────────────────────── */}
        <div className="absolute inset-3 overflow-hidden rounded-2xl">
          <video src="/videos/comparison.mp4" autoPlay muted loop playsInline className="h-full w-full object-cover" />
        </div>

        {/* ── Mask overlay ─────────────────────────────────────────────── */}
        {/* background-size:cover guarantees the SVG always fills this div
            — no letterbox gaps regardless of viewport aspect ratio.
            Spark holes are transparent → video shows through.
            Black areas of the SVG block the video.
            GSAP scales this div from ~5× down to 1×. */}
        <div
          ref={maskRef}
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: 'url(/ai-mask.svg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        />

      </div>
    </section>
  );
}
