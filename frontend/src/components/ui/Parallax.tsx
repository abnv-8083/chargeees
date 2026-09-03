'use client';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ParallaxProps {
  children: React.ReactNode;
  speed?: number;        // pixels of offset per scroll (positive = moves down slower)
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Wraps any element and applies a smooth scroll-linked parallax offset.
 * `speed` controls intensity — default 0.15 gives a subtle drift.
 */
export default function Parallax({ children, speed = 0.15, className, style }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  // Map scroll progress → vertical offset (in pixels)
  const y = useTransform(scrollYProgress, [0, 1], [speed * -200, speed * 200]);

  return (
    <motion.div ref={ref} style={{ y, ...style }} className={className}>
      {children}
    </motion.div>
  );
}
