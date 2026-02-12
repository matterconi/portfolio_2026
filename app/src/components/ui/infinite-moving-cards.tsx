"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState, useCallback, useRef } from "react";

const SCROLL_SPEED_PX_PER_S = 50;

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  pauseOnHover = true,
  className,
  renderItem,
  gap = "gap-6",
}: {
  items: { id?: string; [key: string]: unknown }[];
  direction?: "left" | "right";
  speed?: string;
  pauseOnHover?: boolean;
  className?: string;
  renderItem: (item: any, index: number) => React.ReactNode;
  gap?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLUListElement>(null);
  const [ready, setReady] = useState(false);

  const updateAnimation = useCallback(() => {
    if (!scrollerRef.current || !containerRef.current) return;

    const children = scrollerRef.current.children;
    if (children.length < items.length * 2) return;

    const firstItem = children[0];
    const firstClone = children[items.length];
    const distance =
      firstClone.getBoundingClientRect().left -
      firstItem.getBoundingClientRect().left;

    const duration = distance / SCROLL_SPEED_PX_PER_S;

    containerRef.current.style.setProperty("--scroll-distance", `${distance}px`);
    containerRef.current.style.setProperty("--animation-duration", `${duration}s`);
  }, [items.length]);

  useEffect(() => {
    updateAnimation();
    setReady(true);
  }, [updateAnimation]);

  useEffect(() => {
    if (!ready) return;

    let timeoutId: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateAnimation, 150);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", handleResize);
    };
  }, [ready, updateAnimation]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.setProperty(
        "--animation-direction",
        direction === "left" ? "forwards" : "reverse"
      );
    }
  }, [direction]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 w-full overflow-x-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className
      )}>
      <ul
        ref={scrollerRef}
        className={cn(
          "flex w-max min-w-full shrink-0 flex-nowrap items-stretch",
          gap,
          ready && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}>
        {items.map((item, idx) => (
          <li key={`a-${item.id || idx}`} className="shrink-0 flex">
            {renderItem(item, idx)}
          </li>
        ))}
        {items.map((item, idx) => (
          <li key={`b-${item.id || idx}`} className="shrink-0 flex">
            {renderItem(item, idx)}
          </li>
        ))}
      </ul>
    </div>
  );
};
