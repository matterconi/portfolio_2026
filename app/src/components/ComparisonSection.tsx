'use client';

import { useRef, useEffect } from 'react';
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
  const maskWrapRef = useRef<HTMLDivElement>(null);
  const maskImgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !maskImgRef.current || !maskWrapRef.current) return;

    const ctx = gsap.context(() => {
      // ai-mask.svg: viewBox 0 0 2200 2200 (square), 4 spark shapes
      // Combined bounding box: x 374–1827, y 245–1944 (center ~1100, 1095)
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const cs = Math.max(vw / 2200, vh / 2200); // object-fit: cover on square viewBox
      // Distance from combined shapes' edges to SVG center (1100, 1100)
      const sparkHalfW = 727 * cs; // right edge: 1827 - 1100
      const sparkHalfH = 855 * cs; // top edge: 1100 - 245
      const neededScale = Math.max(vw / (2 * sparkHalfW), vh / (2 * sparkHalfH));
      const startScale = Math.max(neededScale * 1.4, 5); // 40% safety margin, min 5

      gsap.set(maskWrapRef.current, { opacity: 0 });
      gsap.set(maskImgRef.current, {
        scale: startScale,
        transformOrigin: 'center center',
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=150%',
          pin: true,
          scrub: 1,
          pinSpacing: true,
        },
      });

      tl.to(maskWrapRef.current, { opacity: 1, duration: 0.1, ease: 'none' });
      // End at 1.01 instead of 1 to keep a tiny bleed margin of black around the edges
      tl.to(maskImgRef.current, { scale: 1.01, ease: 'power2.out', duration: 0.9 }, '<');
    }, sectionRef);

    return () => ctx.revert();
  }, []);


  return (
    <>
    <section ref={sectionRef} className="relative min-h-screen">

      {/* ── Video slider ───────────────────────────────────────────────────── */}
      <div className="relative h-screen overflow-hidden bg-black">
        <div className="absolute inset-3 overflow-hidden rounded-2xl border border-white/10">
          <div className="absolute inset-0">
            <video src="/videos/dev.mp4" autoPlay muted loop playsInline className="h-full w-full object-cover" />
          </div>
          <div className="absolute inset-0" style={{ clipPath: 'inset(0 50% 0 0)' }}>
            <video src="/videos/ai.mp4" autoPlay muted loop playsInline className="h-full w-full object-cover" />
          </div>
        </div>

        {/* ── Mask overlay ─────────────────────────────────────────────────── */}
        <div
          ref={maskWrapRef}
          className="pointer-events-none absolute inset-0 overflow-hidden flex items-center justify-center"
        >
          <img
            ref={maskImgRef}
            src="/ai-mask.svg"
            alt=""
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              /* preserveAspectRatio="xMidYMid slice" nel SVG gestisce il cover */
            }}
          />
        </div>
      </div>

    </section>

    <RevealHeading />
    </>
  );
}
