'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 18 + 4;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setTimeout(() => setDone(true), 600);
      }
      setProgress(Math.min(Math.round(p), 100));
      if (lineRef.current) lineRef.current.style.width = `${Math.min(p, 100)}%`;
    }, 120);
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          id="loading-screen"
          key="loading"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] } }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="loading-logo">
              {'ChargEase'.split('').map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 + 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  style={{ display: 'inline-block' }}
                >
                  {char}
                </motion.span>
              ))}
            </div>
          </motion.div>
          <div style={{ width: '240px', height: '1px', background: 'rgba(255,255,255,0.08)', marginTop: '2.5rem', borderRadius: '1px', overflow: 'hidden' }}>
            <div
              ref={lineRef}
              style={{ height: '100%', background: 'rgba(255,255,255,0.7)', transition: 'width 0.15s ease', width: '0%' }}
            />
          </div>
          <div className="loading-counter" style={{ marginTop: '1rem' }}>{progress}%</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
