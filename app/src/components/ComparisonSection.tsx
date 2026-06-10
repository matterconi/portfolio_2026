'use client';

import { useRef, useLayoutEffect } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const LINES = ['AI is not enough', 'without a great developer.'];

function RevealChar({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const color = useTransform(progress, range, ['rgba(255,255,255,0.15)', 'rgba(255,255,255,1)']);
  return <motion.span style={{ color }} className="inline-block">{children}</motion.span>;
}

function RevealHeading() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'start 0.2'] });

  const totalChars = LINES.reduce((acc, l) => acc + l.replace(/ /g, '').length, 0);
  let charIndex = 0;

  return (
    <div ref={ref} className="bg-black px-6 py-32 text-center">
      {LINES.map((line, li) => (
        <p key={li} className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tighter leading-none">
          {line.split(' ').map((word, wi) => (
            <span key={wi} className={`inline-block ${wi < line.split(' ').length - 1 ? 'mr-[0.25em]' : ''}`}>
              {word.split('').map((char) => {
                const start = charIndex / totalChars;
                const end = (charIndex + 1) / totalChars;
                charIndex++;
                return <RevealChar key={charIndex} progress={scrollYProgress} range={[start, end]}>{char}</RevealChar>;
              })}
            </span>
          ))}
        </p>
      ))}
    </div>
  );
}

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
    <>
    <section ref={sectionRef} className="relative z-20 min-h-screen">
      <div className="relative h-screen overflow-hidden bg-black">

        {/* ── Video layer (below mask) ──────────────────────────────────── */}
        <div className="absolute inset-3 overflow-hidden rounded-2xl border border-white/10">
          <div className="absolute inset-0">
            <video src="/videos/dev.mp4" autoPlay muted loop playsInline className="h-full w-full object-cover" />
          </div>
          <div className="absolute inset-0" style={{ clipPath: 'inset(0 50% 0 0)' }}>
            <video src="/videos/ai.mp4" autoPlay muted loop playsInline className="h-full w-full object-cover" />
          </div>
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

    <RevealHeading />
    </>
  );
}
