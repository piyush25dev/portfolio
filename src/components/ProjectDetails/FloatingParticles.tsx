"use client";

import { memo, useMemo } from "react";

type Particle = {
  x0: number; // start position, in vw / vh
  y0: number;
  x1: number; // end position
  y1: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
};

// Small seeded random generator: the particles are identical on every render
// (and on server/client), so nothing is recalculated and nothing jumps.
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface FloatingParticlesProps {
  count: number;
  colorA: string;
  colorB: string;
}

function FloatingParticles({ count, colorA, colorB }: FloatingParticlesProps) {
  const particles = useMemo<Particle[]>(() => {
    const rand = mulberry32(count * 9973 + 7);
    return Array.from({ length: count }, () => {
      const duration = 25 + rand() * 25;
      return {
        x0: rand() * 100,
        y0: rand() * 100,
        x1: rand() * 100,
        y1: rand() * 100,
        size: rand() * 4 + 3,
        opacity: rand() * 0.5 + 0.15,
        duration,
        delay: -rand() * duration, // negative delay = start somewhere along the path
      };
    });
  }, [count]);

  return (
    <>
      {particles.map((p, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="fp-particle"
          style={
            {
              "--x0": `${p.x0}vw`,
              "--y0": `${p.y0}vh`,
              "--x1": `${p.x1}vw`,
              "--y1": `${p.y1}vh`,
              width: p.size * 2,
              height: p.size * 2,
              opacity: p.opacity,
              // soft glow from a gradient instead of an expensive CSS blur filter
              background: `radial-gradient(circle, ${i % 2 === 0 ? colorA : colorB} 0%, transparent 70%)`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            } as React.CSSProperties
          }
        />
      ))}

      <style>{`
        .fp-particle {
          position: absolute;
          top: 0;
          left: 0;
          border-radius: 50%;
          pointer-events: none;
          will-change: transform;
          animation-name: fp-drift;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
          animation-direction: alternate;
        }
        @keyframes fp-drift {
          from { transform: translate3d(var(--x0), var(--y0), 0); }
          to   { transform: translate3d(var(--x1), var(--y1), 0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .fp-particle { animation: none; transform: translate3d(var(--x0), var(--y0), 0); }
        }
      `}</style>
    </>
  );
}

// memo: the parent re-renders when Firestore data arrives; the particles must not
export default memo(FloatingParticles);