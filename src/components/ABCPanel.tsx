'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import ShaderText from './ShaderText';
import type { ShaderVariant } from './WaterPlaneShader';

export interface TopicData {
  title: string;
  description: string;
  image: string;
  emphasize?: string[];
}

export interface PanelData {
  letter: string;
  color: string;
  topics: TopicData[];
  shaderVariant: ShaderVariant;
}

export default function ABCPanel({ panel }: { panel: PanelData }) {
  return (
    <div
      className="relative shrink-0 flex flex-col items-center"
      style={{
        width: '80vw',
        maxWidth: '550px',
      }}
    >
      {/* Card */}
      <div
        className="relative w-full rounded-2xl p-px"
        style={{
          background: `linear-gradient(135deg, ${panel.color}40, transparent 50%, ${panel.color}20)`,
          boxShadow: `0 0 25px ${panel.color}15, 0 0 50px ${panel.color}0d`,
        }}
      >
        <div className="relative overflow-hidden rounded-2xl bg-white/[0.08] backdrop-blur-xl border border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)]">
          {/* Shader letter — behind content on desktop */}
          <div className="pointer-events-none absolute inset-0 hidden sm:flex items-center justify-center">
            <ShaderText
              fontSize={480}
              fontWeight="900"
              fontFamily="Arial, Helvetica, sans-serif"
              shaderVariant={panel.shaderVariant}
              className="w-full h-full"
            >
              {panel.letter}
            </ShaderText>
          </div>

          {/* Dark overlay above shader for readability — desktop/tablet only */}
          <div className="pointer-events-none absolute inset-0 hidden sm:block bg-black/50" />

          {/* Content */}
          <div className="relative z-10 px-0 pt-0 pb-6 sm:p-8">
            <div className="flex flex-col gap-6">
              {panel.topics.map((topic, i) => {
                const imageFirst = i % 2 === 0;

              const imageBlock = (
                <div className="relative h-48 w-full shrink-0 overflow-hidden border-b border-white/10 sm:border-b-0 sm:rounded-xl sm:h-40 sm:w-40">
                  <Image
                    src={topic.image}
                    alt={topic.title}
                    fill
                    className="object-cover"
                    loading="lazy"
                  />
                  {/* Shader letter overlay — mobile only */}
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center sm:hidden">
                    <ShaderText
                      fontSize={400}
                      fontWeight="900"
                      fontFamily="Arial, Helvetica, sans-serif"
                      shaderVariant={panel.shaderVariant}
                      className="w-full h-full"
                    >
                      {panel.letter}
                    </ShaderText>
                  </div>
                </div>
              );

              const emphasisSet = new Set(topic.emphasize ?? []);
              const words = topic.description.split(' ');

              const textBlock = (
                <div className="min-w-0">
                  <h3
                    className="text-lg font-bold tracking-tight text-white sm:text-xl"
                  >
                    {topic.title}
                  </h3>
                  <p
                    className="mt-2 text-[15px] leading-relaxed text-zinc-400 font-medium sm:text-base"
                  >
                    {words.map((word, wi) => {
                      const bare = word.replace(/[.,;:!?]+$/, '');
                      const isEmphasized = emphasisSet.has(word) || emphasisSet.has(bare);
                      if (isEmphasized) {
                        return (
                          <span
                            key={wi}
                            className="italic px-1 rounded"
                            style={{ backgroundColor: `${panel.color}20` }}
                          >
                            {word}{' '}
                          </span>
                        );
                      }
                      return <span key={wi}>{word} </span>;
                    })}
                  </p>
                </div>
              );

              return (
                <motion.div
                  key={topic.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                  className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-6"
                >
                  {/* Mobile: always image then text (vertical). Desktop: alternate order */}
                  <div className="sm:hidden flex flex-col items-center gap-4 w-full">
                    {i === 0 && imageBlock}
                    <div className={`px-6 w-full ${i % 2 !== 0 ? 'text-right' : 'text-left'}`}>{textBlock}</div>
                  </div>
                  <div className="hidden sm:contents">
                    {imageFirst ? (
                      <>
                        {imageBlock}
                        {textBlock}
                      </>
                    ) : (
                      <>
                        {textBlock}
                        {imageBlock}
                      </>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
