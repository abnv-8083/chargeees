'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface RevealTextProps {
  children: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  className?: string;
  style?: React.CSSProperties;
  /** Delay before first word animates (seconds) */
  delay?: number;
}

/**
 * Splits `children` into words and fades+slides each one in on scroll.
 */
export default function RevealText({
  children,
  as: Tag = 'h2',
  className,
  style,
  delay = 0,
}: RevealTextProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const words = children.split(' ');

  return (
    // @ts-expect-error — Tag is a valid HTML tag string
    <Tag ref={ref} className={className} style={{ ...style, overflow: 'hidden' }}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: '100%' }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.6,
            delay: delay + i * 0.04,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{ display: 'inline-block', marginRight: '0.3em' }}
        >
          {word}
        </motion.span>
      ))}
    </Tag>
  );
}
