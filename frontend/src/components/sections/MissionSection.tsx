'use client';
import { motion } from 'framer-motion';
import type { MissionData } from '@/lib/types';
import { CheckCircle } from 'lucide-react';

const FALLBACK: MissionData = {
  heading: 'Our Mission',
  statement: 'To empower organizations with intelligent solutions, uncompromising quality, and a relentless commitment to client success.',
  commitments: [
    { title: 'Quality Assurance', description: 'Every deliverable undergoes rigorous quality checks before reaching our clients.' },
    { title: 'Continuous Innovation', description: 'We invest in R&D to stay ahead of industry trends and client needs.' },
    { title: 'Partnership Approach', description: 'We build long-term relationships, not just one-time transactions.' },
  ],
  objectives: [
    'Deliver measurable business outcomes for every client',
    'Maintain the highest standards of professional ethics',
    'Foster a culture of continuous learning and growth',
    'Create solutions that scale with our clients\' ambitions',
  ],
  customerFirst: 'Every strategy, product, and decision at ChargEase is crafted with our clients\' success as the primary objective.',
};

export default function MissionSection({ data }: { data?: MissionData }) {
  const d = data || FALLBACK;

  return (
    <section id="mission" className="section-py" style={{ background: 'var(--black)', position: 'relative' }}>
      <div className="floating-orb" style={{ width: 500, height: 500, background: '#fff', bottom: '-10%', left: '-5%' }} />

      <div className="section-container">
        {/* Header */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(3rem, 6vw, 8rem)', marginBottom: 'clamp(4rem, 8vw, 8rem)', alignItems: 'center' }}>
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="label-sm" style={{ marginBottom: '1rem' }}>Purpose Driven</p>
            <h2 className="heading-xl" style={{ marginBottom: '2rem' }}>{d.heading}</h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mission-statement-wrapper">
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.2rem, 2.5vw, 1.75rem)', fontStyle: 'italic', fontWeight: 400, color: 'var(--white)', lineHeight: 1.5 }}>
                "{d.statement}"
              </p>
            </div>
          </motion.div>
        </div>

        {/* Commitments — alternating blocks */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: 'clamp(3rem, 6vw, 6rem)' }}>
          {d.commitments.map((c, i) => (
            <motion.div
              key={i}
              className="commitment-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="commitment-number">0{i + 1}</div>
              <div>
                <h3 className="heading-md" style={{ color: 'var(--white)', marginBottom: '0.5rem' }}>{c.title}</h3>
                <p className="body-md">{c.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Objectives + Customer First */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(2rem, 4vw, 6rem)' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="label-sm" style={{ marginBottom: '1.5rem' }}>Key Objectives</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {d.objectives.map((obj, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <CheckCircle size={16} style={{ color: 'var(--gray-500)', flexShrink: 0, marginTop: '0.2rem' }} />
                  <span className="body-md" style={{ fontSize: '0.9rem' }}>{obj}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {d.customerFirst && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              style={{ padding: '2.5rem', background: 'var(--gray-900)', borderRadius: 20, border: '1px solid var(--gray-800)', alignSelf: 'start' }}
            >
              <p className="label-sm" style={{ marginBottom: '1.25rem' }}>Customer First</p>
              <p className="body-lg" style={{ fontStyle: 'italic' }}>"{d.customerFirst}"</p>
            </motion.div>
          )}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
