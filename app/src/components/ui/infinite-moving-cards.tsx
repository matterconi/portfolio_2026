import { useRef, useState, useEffect, useCallback, type ReactNode } from "react";

const SCROLL_SPEED_PX_PER_S = 50;

const cn = (...args: (string | boolean | undefined | null)[]) => args.filter(Boolean).join(" ");

interface InfiniteMovingCardsProps<T> {
  items: (T & { id?: string | number })[];
  direction?: "left" | "right";
  pauseOnHover?: boolean;
  className?: string;
  renderItem: (item: T, index: number) => ReactNode;
  gap?: string;
  oscillate?: boolean;
  oscillateAmplitude?: number;
  oscillateSpeed?: number;
}

const InfiniteMovingCards = <T,>({
  items,
  direction = "left",
  pauseOnHover = true,
  className,
  renderItem,
  gap = "gap-6",
  oscillate = false,
  oscillateAmplitude = 8,
  oscillateSpeed = 0.02,
}: InfiniteMovingCardsProps<T>) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLUListElement>(null);

  const [isReady, setIsReady] = useState(false);
  const [repeatCount, setRepeatCount] = useState(2);
  const [offsets, setOffsets] = useState<number[]>([]);
  const animationRef = useRef<number | null>(null);
  const angleRef = useRef(0);

  const updateAnimation = useCallback(() => {
    if(!scrollerRef.current || !containerRef.current) return;
    const children = scrollerRef.current.children;
    if (children.length < items.length * 2) return;
    const singleSetWidth = children[items.length - 1].getBoundingClientRect().right - children[0].getBoundingClientRect().left;

    const containerWidth = containerRef.current.offsetWidth;

    const needed = Math.ceil(containerWidth / singleSetWidth) + 1;

    if ((needed) > repeatCount) {
      setRepeatCount(needed)
      return;
    }

    const firstItem = children[0];
    const firstClone = children[items.length];
    const distance = firstClone.getBoundingClientRect().left - firstItem.getBoundingClientRect().left;

    const duration = distance / SCROLL_SPEED_PX_PER_S;

    containerRef.current.style.setProperty("--scroll-distance", `${distance}px`);
    containerRef.current.style.setProperty("--animation-duration", `${duration}s`);
  }, [items.length, repeatCount]);

  useEffect(() => {
    updateAnimation();
    queueMicrotask(() => setIsReady(true));
  }, [updateAnimation]);

  useEffect(() => {
    let timeoutId;
    const handler = () => {clearTimeout(timeoutId); timeoutId = setTimeout(updateAnimation, 150)}
    window.addEventListener("resize", handler);
    return () => {clearTimeout(timeoutId); window.removeEventListener("resize", handler)};
  }, [updateAnimation]);

  useEffect(() => {
    if (!oscillate || !isReady) return;
    const totalItems = items.length * repeatCount;
    const phaseStep = (Math.PI * 2 * 0.5) / items.length;

    const animate = () => {
      angleRef.current += oscillateSpeed;
      let yArray = [];
      for (let i = 0; i < totalItems; i++) {
        const y = Math.sin(angleRef.current + (i % items.length) * phaseStep) * oscillateAmplitude;
        yArray.push(y);
      }
      setOffsets(yArray);
      animationRef.current = requestAnimationFrame(animate);
    }
    animate();
    return () => { if (animationRef.current != null) cancelAnimationFrame(animationRef.current); };
  }, [isReady, items.length, oscillate, oscillateAmplitude, oscillateSpeed, repeatCount])

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
        "scroller relative z-20 max-w-[1200px] mx-auto overflow-x-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex w-max min-w-full shrink-0 flex-nowrap items-stretch",
          gap,
          isReady && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {Array.from({ length: repeatCount }).map((_, copyIdx) =>
          items.map((item, idx) => {
            const globalIdx = copyIdx * items.length + idx;
            return (
              <li
                key={`${copyIdx}-${item.id || idx}`}
                className="shrink-0 flex"
                style={oscillate && offsets.length > 0
                  ? { transform: `translateY(${offsets[globalIdx]}px)` }
                  : undefined}
              >
                {renderItem(item, idx)}
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
};

export default InfiniteMovingCards;
