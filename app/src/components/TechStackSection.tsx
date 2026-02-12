"use client";

import React from "react";
import { motion } from "framer-motion";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";

const tools = [
  { name: "Next.js", logo: "https://assets.vercel.com/image/upload/v1662130559/nextjs/Icon_light_background.png" },
  { name: "React", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" },
  { name: "TypeScript", logo: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Typescript_logo_2020.svg" },
  { name: "Three.js", logo: "https://upload.wikimedia.org/wikipedia/commons/3/3f/Three.js_Icon.svg" },
  { name: "Framer Motion", logo: "https://user-images.githubusercontent.com/38039349/60953119-d3c6f300-a2fc-11e9-9596-4978e5d52180.png" },
  { name: "GSAP", logo: "https://cdn.worldvectorlogo.com/logos/gsap-greensock.svg" },
  { name: "Tailwind CSS", logo: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg" },
  { name: "Ethers.js", logo: "https://icons.llamao.fi/icons/protocols/ethers" },
  { name: "p5.js", logo: "https://upload.wikimedia.org/wikipedia/commons/c/c6/P5.js_icon.svg" },
];

const TechStackSection = () => {
  return (
    <section className="demo-reveal-section ">
      <div className="demo-reveal-container">
        <h2 className="mb-2 text-5xl sm:text-6xl font-bold tracking-tighter text-white" style={{ fontFamily: "'Clash Display', sans-serif" }}>My Stack</h2>
        <p className="mb-8 text-lg text-foreground-subtle" style={{ fontFamily: "'Clash Display', sans-serif" }}>Creative development, pixel-perfect execution.</p>

        {/* Infinite Moving Cards */}
        <div className="mb-8">
          <InfiniteMovingCards
            items={tools}
            direction="left"
            speed="slow"
            pauseOnHover={true}
            renderItem={(item) => (
              <div
                className="relative w-[220px] h-[200px] rounded-2xl border border-accent-cyan/20 group flex flex-col items-center justify-center gap-4 p-6"
                style={{
                  background: "linear-gradient(to bottom right, rgba(30,41,59,0.5), rgba(15,23,42,0.5))",
                  boxShadow: "0 4px 20px rgba(0, 255, 255, 0.06), 0 0 40px rgba(0, 255, 255, 0.04)",
                }}
              >
                <div className="w-24 h-24 flex items-center justify-center">
                  <img
                    src={item.logo}
                    alt={item.name}
                    className="w-full h-full object-contain transition-all duration-300 group-hover:scale-110 opacity-90"
                    loading="lazy"
                  />
                </div>
                <p className="text-foreground-subtle font-normal text-sm text-center group-hover:text-foreground-muted transition-colors">
                  {item.name}
                </p>
              </div>
            )}
          />
        </div>

        {/* Bottom text */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <p className="text-foreground-subtle text-sm">
            And many more tools tailored to your needs
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default TechStackSection;
