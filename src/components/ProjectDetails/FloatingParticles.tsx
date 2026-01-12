"use client";

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

type Particle = {
  x: number;
  y: number;
  size: number;
  opacity: number;
};

export default function FloatingParticles({
  count,
  colorA,
  colorB,
}: {
  count: number;
  colorA: string;
  colorB: string;
}) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [viewport, setViewport] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;

    setViewport({ w, h });

    // 🔒 Freeze randomness ONCE
    setParticles(
      Array.from({ length: count }).map(() => ({
        x: Math.random() * w,
        y: Math.random() * h,
        size: Math.random() * 4 + 2,
        opacity: Math.random() * 0.5 + 0.1,
      }))
    );
  }, [count]);

  if (!viewport.w) return null;

  return (
    <>
      {particles.map((p, i) => (
        <motion.div
          key={i}
          initial={{ x: p.x, y: p.y }}
          animate={{
            x: Math.random() * viewport.w,
            y: Math.random() * viewport.h,
          }}
          transition={{
            duration: 20 + Math.random() * 20,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'linear',
          }}
          style={{
            position: 'absolute',
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: i % 2 === 0 ? colorA : colorB,
            opacity: p.opacity,
            filter: 'blur(1px)',
          }}
        />
      ))}
    </>
  );
}
