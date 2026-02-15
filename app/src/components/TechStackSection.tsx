"use client";

import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { SectionTitle } from "./ui/section-title";
import ProofSection from "./ProofSection";

const tools = [
  { name: "Next.js", logo: "https://assets.vercel.com/image/upload/v1662130559/nextjs/Icon_light_background.png" },
  { name: "React", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" },
  { name: "TypeScript", logo: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Typescript_logo_2020.svg" },
  { name: "Three.js", logo: "https://upload.wikimedia.org/wikipedia/commons/3/3f/Three.js_Icon.svg", invert: true },
  { name: "Framer Motion", logo: "https://user-images.githubusercontent.com/38039349/60953119-d3c6f300-a2fc-11e9-9596-4978e5d52180.png" },
  { name: "GSAP", logo: "https://cdn.worldvectorlogo.com/logos/gsap-greensock.svg" },
  { name: "Tailwind CSS", logo: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg" },
  { name: "Ethers.js", logo: "https://icons.llamao.fi/icons/protocols/ethers" },
  { name: "p5.js", logo: "https://upload.wikimedia.org/wikipedia/commons/c/c6/P5.js_icon.svg" },
];

const TechStackSection = () => {
  return (
    <section className="demo-reveal-section">
      <div className="demo-reveal-container">
        <SectionTitle
          visible
          title="My Stack"
          className="text-5xl sm:text-6xl !text-right w-full mx-auto mt-8"
        />
        <p
          className="mb-8 text-lg text-foreground-subtle text-right"
          style={{ fontFamily: "'Clash Display', sans-serif" }}
        >
          Creative development, pixel-perfect execution.
        </p>

        {/* Infinite Moving Cards */}
        <div className="mb-8 py-10">
          <InfiniteMovingCards
            items={tools}
            direction="left"
            speed="slow"
            pauseOnHover={true}
            renderItem={(item) => (
              <div className="flex flex-col items-center gap-3 px-8 group">
                <img
                  src={item.logo}
                  alt={item.name}
                  className={`w-12 h-12 object-contain opacity-60 group-hover:opacity-100 transition-opacity duration-300 ${item.invert ? "invert" : ""}`}
                  loading="lazy"
                />
                <span
                  className="text-foreground-subtle text-xs font-medium tracking-wide group-hover:text-white transition-colors duration-300"
                  style={{ fontFamily: "'Clash Display', sans-serif" }}
                >
                  {item.name}
                </span>
              </div>
            )}
          />
        </div>
      </div>
    </section>
  );
};

export default TechStackSection;
