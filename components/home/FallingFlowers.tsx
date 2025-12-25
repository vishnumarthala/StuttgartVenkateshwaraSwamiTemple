'use client';

import { useEffect, useRef } from 'react';

interface FlowerProps {
  id: number;
  side: 'left' | 'right';
  size: number;
  left: number;
  delay: number;
  duration: number;
  startTop: number;
  opacity: number;
}

// Seeded PRNG (Mulberry32) to keep output deterministic across renders.
const mulberry32 = (seed: number) => {
  return () => {
    let t = (seed += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const generateFlowers = (): FlowerProps[] => {
  const rng = mulberry32(20251225);
  const totalFlowers = 80;
  const flowers: FlowerProps[] = [];

  for (let i = 0; i < totalFlowers; i++) {
    // Full-width spread (covers Swami too).
    const left = rng() * 100;
    const side: FlowerProps['side'] = left < 50 ? 'left' : 'right';

    // Natural variation.
    const size = Math.round(16 + rng() * 32); // 16..48
    const duration = 7 + rng() * 11; // 7..18s
    const delay = rng() * 9; // 0..9s
    const startTop = -(2 + rng() * 20); // -2..-22%
    const opacity = clamp(0.6 + rng() * 0.4, 0.6, 0.95);

    flowers.push({
      id: i,
      side,
      size,
      left,
      delay,
      duration,
      startTop,
      opacity,
    });
  }

  return flowers;
};

const flowers = generateFlowers();

export default function FallingFlowers() {
  const rafRef = useRef<number | null>(null);
  const isLoopingRef = useRef(false);
  const targetMouseX = useRef<number | null>(null);
  const currentMouseX = useRef<number | null>(null);
  const viewportWidth = useRef<number>(0);
  const flowerInnerRefs = useRef<Array<HTMLDivElement | null>>([]);
  const currentOffsets = useRef<Float32Array>(new Float32Array(flowers.length));

  useEffect(() => {
    // Only enable on devices that actually have hover + fine pointer.
    const canHover =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    if (!canHover) return;

    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) return;

    const updateViewport = () => {
      viewportWidth.current = window.innerWidth || 0;
    };
    updateViewport();

    const applyOffsetsFrame = () => {
      rafRef.current = null;

      const vw = viewportWidth.current;
      const mx = targetMouseX.current;
      if (!vw || mx === null) {
        isLoopingRef.current = false;
        return;
      }

      // Smooth the cursor value to avoid jitter.
      const current = currentMouseX.current ?? mx;
      const smoothed = current + (mx - current) * 0.18;
      currentMouseX.current = smoothed;

      const threshold = 240; // px range of influence (dramatic)
      const maxPush = 90; // px max displacement (dramatic)
      const easing = 0.16; // per-flower smoothing

      let anyMoving = false;

      for (let i = 0; i < flowers.length; i++) {
        const el = flowerInnerRefs.current[i];
        if (!el) continue;

        const baseX = (flowers[i].left / 100) * vw;
        const dx = baseX - smoothed;
        const distance = Math.abs(dx);

        let targetOffset = 0;
        if (distance < threshold) {
          const strength = (threshold - distance) / threshold;
          // Slightly non-linear ramp for a punchier feel near the cursor.
          const curved = strength * strength;
          targetOffset = Math.sign(dx || 1) * curved * maxPush;
        }

        const currentOffset = currentOffsets.current[i] ?? 0;
        const nextOffset = currentOffset + (targetOffset - currentOffset) * easing;
        currentOffsets.current[i] = nextOffset;

        if (Math.abs(targetOffset - nextOffset) > 0.3) anyMoving = true;

        // translateZ(0) helps keep this on the GPU.
        el.style.transform = `translate3d(${nextOffset.toFixed(2)}px, 0, 0)`;
      }

      if (anyMoving) {
        rafRef.current = window.requestAnimationFrame(applyOffsetsFrame);
      } else {
        isLoopingRef.current = false;
      }
    };

    const startLoop = () => {
      if (isLoopingRef.current) return;
      isLoopingRef.current = true;
      rafRef.current = window.requestAnimationFrame(applyOffsetsFrame);
    };

    const onMove = (e: MouseEvent) => {
      targetMouseX.current = e.clientX;
      startLoop();
    };

    const onLeave = () => {
      targetMouseX.current = null;
      currentMouseX.current = null;
      // Ease everything back to 0.
      for (let i = 0; i < currentOffsets.current.length; i++) {
        currentOffsets.current[i] = 0;
        const el = flowerInnerRefs.current[i];
        if (el) el.style.transform = 'translate3d(0px, 0, 0)';
      }
      isLoopingRef.current = false;
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseleave', onLeave);
    window.addEventListener('resize', updateViewport, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('resize', updateViewport);
      if (rafRef.current !== null) window.cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[5]">
      {flowers.map((flower, index) => (
        <div
          key={flower.id}
          className="absolute"
          style={{
            left: `${flower.left}%`,
            top: `${flower.startTop}%`,
            width: flower.size,
            height: flower.size,
            opacity: flower.opacity,
            animation: `flower-fall-${flower.side} ${flower.duration}s ease-in-out infinite`,
            animationDelay: `${flower.delay}s`,
            willChange: 'transform',
          }}
        >
          <div
            ref={(el) => {
              flowerInnerRefs.current[index] = el;
            }}
            className="w-full h-full"
            style={{
              transform: 'translate3d(0px, 0, 0)',
              willChange: 'transform',
            }}
          >
            <img
              src="/images/flower.png"
              alt=""
              className="w-full h-full object-contain drop-shadow-lg"
              aria-hidden="true"
              draggable={false}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
