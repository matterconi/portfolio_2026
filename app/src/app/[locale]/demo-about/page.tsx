"use client";

import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent, type MotionValue, AnimatePresence } from "framer-motion";
import { DemoTextReveal } from "./DemoTextReveal";
import { DemoTitleReveal } from "./DemoTitleReveal";
import Image from "next/image";
import { s } from "framer-motion/client";

const bioText =
  "I'm a developer driven by technology and creativity. I build performant web experiences with a focus on blockchain, 3D, Web3, and generative design. I love contributing to open-source projects.";

export default function DemoAboutPage() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [titleVisible, setTitleVisible] = useState(false);

  // TODO: scroll logic here
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  })

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    setTitleVisible(progress >= 0.08);
  })

  const titleProgress = useTransform(scrollYProgress, [0.08, 0.2], [0, 1])
  const textProgress = useTransform(scrollYProgress, [0, 0.23, 1], [-1, 0, 1])

  const imageOpacity = useTransform(textProgress, [0.05, 0.25], [0, 1]);
  const imageScale = useTransform(textProgress, [0.05, 0.25], [0.85, 1]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Spacer top */}
      <div className="h-screen flex items-center justify-center">
        <p
          className="text-foreground-subtle text-lg"
        >
          Scrolla giu
        </p>
      </div>

      {/* About section demo */}
      <section ref={sectionRef} className="relative px-6 sm:px-8" style={{ height: "350vh" }}>
        <div className="sticky top-0 flex flex-col pt-24 pb-12">
          <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_auto] gap-x-10 gap-y-6">

            {/* Title */}
            <DemoTitleReveal text="About Me" scrollProgress={titleProgress} className="text-5xl sm:text-6xl"/>

            {/* Profile Photo */}
            <motion.div
              className="order-1 md:order-none md:row-start-1 md:col-start-2 lg:row-start-2 shrink-0 self-center justify-self-center md:self-center lg:self-start"
              // TODO: style={{ opacity: imageOpacity, scale: imageScale }}
              style={{opacity: imageOpacity, scale: imageScale}}
            >
              <div
                className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-2xl p-px"
                style={{
                  background: "linear-gradient(135deg, #ff4da640, transparent 50%, #ff4da620)",
                  boxShadow: "0 0 25px #ff4da615, 0 0 50px #ff4da60d",
                }}
              >
                <div className="relative w-full h-full rounded-2xl overflow-hidden" >
                  <Image
                    src="/images/profile/matteo.png"
                    alt="Profile photo"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </motion.div>

            {/* Bio text */}
            <div className="order-3 md:order-none md:row-start-2 md:col-span-2 lg:col-span-1 lg:row-start-2 min-w-0">
            <DemoTextReveal text={bioText} scrollProgress={textProgress}/>
            </div>

          </div>
        </div>
      </section>

      {/* Spacer bottom */}
      <div className="h-screen flex items-center justify-center">
        <p
          className="text-foreground-subtle text-lg"
        >
          Scrolla su
        </p>
      </div>
    </div>
  );
}
