'use client';
import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import type { VisionData } from '@/lib/types';

const FALLBACK: VisionData = {
  heading: 'Our Vision',
  statement: 'To be the global benchmark of excellence — where innovation meets integrity, and ambition is realized with purpose.',
  futureGoals: [
    { title: 'Global Leadership', description: 'Establish ChargEase as the #1 trusted partner in our domain globally.' },
    { title: 'Sustainable Impact', description: 'Drive sustainable growth for our clients and communities alike.' },
    { title: 'Technological Frontier', description: 'Pioneer the next generation of intelligent business solutions.' },
  ],
  strategicDirection: 'We aim to leverage emerging technologies to create scalable, future-proof solutions that stand the test of time.',
};

export default function VisionSection({ data }: { data?: VisionData }) {
  const d = data || FALLBACK;
  const sectionRef = useRef<HTMLElement>(null);
  const statementRef = useRef<HTMLDivElement>(null);
  const statementInView = useInView(statementRef, { once: true, margin: '-100px' });

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);

  const words = d.statement.split(' ');

  return (
    <section ref={sectionRef} id="vision" className="section-py" style={{ background: 'var(--gray-900)', overflow: 'hidden', position: 'relative' }}>
      {/* Floating orb */}
      <div className="floating-orb" style={{ width: 800, height: 800, background: '#fff', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />

      {/* Parallax label */}
      <motion.div style={{ y }} className="section-container">
        <div style={{ marginBottom: 'clamp(3rem, 6vw, 6rem)' }}>
          <motion.p
            className="label-sm"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{ marginBottom: '1rem' }}
          >
            Forward Thinking
          </motion.p>
          <motion.h2
            className="heading-xl"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            {d.heading}
          </motion.h2>
        </div>

        {/* Vision Statement — word-by-word reveal */}
        <div ref={statementRef} style={{ marginBottom: 'clamp(4rem, 8vw, 8rem)', maxWidth: 960 }}>
          <div className="vision-statement">
            {words.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0.15 }}
                animate={statementInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: i * 0.04 }}
                style={{ display: 'inline-block', marginRight: '0.3em' }}
              >
                {word}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Goals Grid */}
        <div className="vision-goals-grid">
          {d.futureGoals.map((goal, i) => (
            <motion.div
              key={i}
              className="vision-goal-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', fontWeight: 700, color: 'var(--gray-800)', lineHeight: 1, marginBottom: '1.5rem' }}>
                0{i + 1}
              </div>
              <h3 className="heading-md" style={{ color: 'var(--white)', marginBottom: '0.75rem' }}>{goal.title}</h3>
              <p className="body-md">{goal.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Strategic Direction */}
        {d.strategicDirection && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            style={{ marginTop: '4rem', padding: '2.5rem', border: '1px solid var(--gray-700)', borderRadius: 20, maxWidth: 800 }}
          >
            <p className="label-sm" style={{ marginBottom: '1rem' }}>Strategic Direction</p>
            <p className="body-lg">{d.strategicDirection}</p>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
