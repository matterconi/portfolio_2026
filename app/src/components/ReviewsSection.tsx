'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { SectionTitle } from './ui/section-title';
import type { Review } from '@data/types';

interface ReviewsSectionProps {
  title: string;
  reviews: Review[];
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`h-4 w-4 ${i < rating ? 'text-accent-green' : 'text-white/15'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div
      className="w-[350px] shrink-0 rounded-2xl p-px sm:w-[400px]"
      style={{
        background:
          'linear-gradient(135deg, rgba(180,120,255,0.25), transparent 50%, rgba(0,255,255,0.12))',
        boxShadow: '0 0 25px rgba(180,120,255,0.08), 0 0 50px rgba(180,120,255,0.05)',
      }}
    >
      <div className="flex h-full flex-col justify-between rounded-2xl bg-[#0f0a14] p-6 sm:p-8">
        <div>
          <StarRating rating={review.rating} />
          <p className="mt-4 text-sm leading-relaxed text-foreground-muted">
            &ldquo;{review.content}&rdquo;
          </p>
        </div>
        <div className="mt-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-purple/20 text-sm font-bold text-accent-purple">
            {review.author
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{review.author}</p>
            <p className="text-xs text-foreground-subtle">
              {review.role}, {review.company}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfiniteRow({
  reviews,
  direction = 'left',
  speed = 30,
}: {
  reviews: Review[];
  direction?: 'left' | 'right';
  speed?: number;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [scrollDistance, setScrollDistance] = useState(0);

  // Duplicate enough times to guarantee seamless loop
  const duplicates = Math.max(8, Math.ceil(20 / reviews.length));
  const items = Array.from({ length: duplicates }).flatMap(() => reviews);

  useEffect(() => {
    if (!rowRef.current) return;
    // Scroll distance = width of one set of cards
    const singleSetWidth = rowRef.current.scrollWidth / duplicates;
    setScrollDistance(singleSetWidth);
  }, [reviews.length, duplicates]);

  return (
    <div className="group overflow-hidden">
      <div
        ref={rowRef}
        className="flex gap-6 animate-scroll"
        style={
          {
            '--scroll-distance': `${scrollDistance}px`,
            '--animation-duration': `${speed}s`,
            '--animation-direction': direction === 'right' ? 'reverse' : 'forwards',
            animationPlayState: 'running',
          } as React.CSSProperties
        }
        onMouseEnter={(e) => {
          (e.currentTarget.style.animationPlayState = 'paused');
        }}
        onMouseLeave={(e) => {
          (e.currentTarget.style.animationPlayState = 'running');
        }}
      >
        {items.map((review, i) => (
          <ReviewCard key={`${review.id}-${i}`} review={review} />
        ))}
      </div>
    </div>
  );
}

export default function ReviewsSection({ title, reviews }: ReviewsSectionProps) {
  return (
    <section id="reviews" className="py-20">
      <div className="mx-auto mb-12 w-full max-w-7xl px-6 sm:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <SectionTitle visible title={title} className="text-5xl sm:text-6xl" />
        </motion.div>
      </div>

      <div className="flex flex-col gap-6">
        <InfiniteRow reviews={reviews} direction="left" speed={35} />
        <InfiniteRow reviews={reviews} direction="right" speed={40} />
      </div>
    </section>
  );
}
