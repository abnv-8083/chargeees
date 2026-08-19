'use client';
import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import type { AboutData, VisionData, MissionData } from '@/lib/types';
import { Shield, Lightbulb, Star, Heart, Zap, Globe, Users, CheckCircle, Eye, Target } from 'lucide-react';

const ICONS: Record<string, React.ReactNode> = {
  Shield: <Shield size={20} />, Lightbulb: <Lightbulb size={20} />,
  Star: <Star size={20} />, Heart: <Heart size={20} />,
  Zap: <Zap size={20} />, Globe: <Globe size={20} />, Users: <Users size={20} />,
};

const FALLBACK_ABOUT: AboutData = {
  heading: 'About ChargEase',
  subheading: 'Who We Are',
  introduction: 'ChargEase is a forward-thinking company committed to delivering transformative solutions across industries.',
  story: 'Founded with a singular vision — to redefine how businesses grow and operate — ChargEase has evolved into a trusted partner for organizations seeking precision, innovation, and sustainable progress.',
  coreValues: [
    { title: 'Integrity',    description: 'We operate with transparency and honesty in every engagement.', icon: 'Shield' },
    { title: 'Innovation',   description: 'We push boundaries and embrace emerging technologies.',         icon: 'Lightbulb' },
    { title: 'Excellence',   description: 'We deliver nothing short of the highest quality.',              icon: 'Star' },
    { title: 'Client-First', description: 'Our clients are at the center of every decision.',              icon: 'Heart' },
  ],
  whyUs: [],
  timeline: [
    { year: '2018', title: 'Founded',          description: 'ChargEase established with a vision to transform business.' },
    { year: '2020', title: 'Expansion',         description: 'Expanded to 3 countries with 50+ professionals.' },
    { year: '2022', title: 'Innovation Award',  description: 'Recognized as most innovative company of the year.' },
    { year: '2024', title: 'Global Reach',      description: 'Serving 200+ clients across 15+ countries worldwide.' },
  ],
};

const FALLBACK_VISION: VisionData = {
  heading: 'Our Vision',
  statement: 'To be the global benchmark of excellence — where innovation meets integrity, and ambition is realized with purpose.',
  futureGoals: [
    { title: 'Global Leadership',       description: 'Establish ChargEase as the #1 trusted partner in our domain globally.' },
    { title: 'Sustainable Impact',      description: 'Drive sustainable growth for our clients and communities alike.' },
    { title: 'Technological Frontier',  description: 'Pioneer the next generation of intelligent business solutions.' },
  ],
  strategicDirection: 'We aim to leverage emerging technologies to create scalable, future-proof solutions that stand the test of time.',
};

const FALLBACK_MISSION: MissionData = {
  heading: 'Our Mission',
  statement: 'To empower organizations with intelligent solutions, uncompromising quality, and a relentless commitment to client success.',
  commitments: [
    { title: 'Quality Assurance',    description: 'Every deliverable undergoes rigorous quality checks before reaching our clients.' },
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

function AnimatedBlock({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Vision tab content ─────────────────────────────────────────────────── */
function VisionContent({ data }: { data: VisionData }) {
  const words = data.statement.split(' ');
  return (
    <motion.div
      key="vision"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* statement */}
      <div style={{ marginBottom: '2.5rem', padding: '2rem', background: 'var(--gray-900)', borderRadius: 16, border: '1px solid var(--gray-800)' }}>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.1rem, 2vw, 1.5rem)', fontStyle: 'italic', color: 'var(--white)', lineHeight: 1.55, margin: 0 }}>
          "{data.statement}"
        </p>
      </div>

      {/* goals */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: data.strategicDirection ? '2rem' : 0 }}>
        {data.futureGoals.map((g, i) => (
          <div key={i} style={{ padding: '1.5rem', border: '1px solid var(--gray-800)', borderRadius: 14, background: 'var(--black)' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, color: 'var(--gray-800)', marginBottom: '1rem', lineHeight: 1 }}>0{i + 1}</div>
            <h4 style={{ fontFamily: 'var(--font-grotesk)', fontSize: '0.9rem', fontWeight: 700, color: 'var(--white)', marginBottom: '0.5rem' }}>{g.title}</h4>
            <p style={{ fontSize: '0.825rem', color: 'var(--gray-500)', lineHeight: 1.6, margin: 0 }}>{g.description}</p>
          </div>
        ))}
      </div>

      {data.strategicDirection && (
        <div style={{ padding: '1.5rem 2rem', border: '1px solid var(--gray-700)', borderRadius: 12, marginTop: '1rem' }}>
          <p className="label-sm" style={{ marginBottom: '0.5rem' }}>Strategic Direction</p>
          <p style={{ fontSize: '0.875rem', color: 'var(--gray-300)', lineHeight: 1.65, margin: 0 }}>{data.strategicDirection}</p>
        </div>
      )}
    </motion.div>
  );
}

/* ─── Mission tab content ────────────────────────────────────────────────── */
function MissionContent({ data }: { data: MissionData }) {
  return (
    <motion.div
      key="mission"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* statement */}
      <div style={{ marginBottom: '2rem', padding: '2rem', background: 'var(--gray-900)', borderRadius: 16, border: '1px solid var(--gray-800)' }}>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.1rem, 2vw, 1.5rem)', fontStyle: 'italic', color: 'var(--white)', lineHeight: 1.55, margin: 0 }}>
          "{data.statement}"
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
        {/* commitments */}
        <div>
          <p className="label-sm" style={{ marginBottom: '1rem' }}>Commitments</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {data.commitments.map((c, i) => (
              <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', padding: '1rem', border: '1px solid var(--gray-800)', borderRadius: 12 }}>
                <span style={{ fontFamily: 'var(--font-grotesk)', fontSize: '0.65rem', fontWeight: 700, color: 'var(--gray-600)', paddingTop: '0.2rem', flexShrink: 0 }}>0{i + 1}</span>
                <div>
                  <h5 style={{ fontFamily: 'var(--font-grotesk)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--white)', marginBottom: '0.2rem' }}>{c.title}</h5>
                  <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)', lineHeight: 1.55, margin: 0 }}>{c.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* objectives */}
        <div>
          <p className="label-sm" style={{ marginBottom: '1rem' }}>Key Objectives</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {data.objectives.map((obj, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.65rem', alignItems: 'flex-start' }}>
                <CheckCircle size={15} style={{ color: 'var(--gray-600)', flexShrink: 0, marginTop: '0.15rem' }} />
                <span style={{ fontSize: '0.85rem', color: 'var(--gray-400)', lineHeight: 1.55 }}>{obj}</span>
              </div>
            ))}
          </div>

          {data.customerFirst && (
            <div style={{ marginTop: '1.5rem', padding: '1.25rem', background: 'var(--gray-900)', borderRadius: 12, border: '1px solid var(--gray-800)' }}>
              <p className="label-sm" style={{ marginBottom: '0.5rem' }}>Customer First</p>
              <p style={{ fontSize: '0.825rem', color: 'var(--gray-400)', fontStyle: 'italic', lineHeight: 1.6, margin: 0 }}>"{data.customerFirst}"</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Main exported component ────────────────────────────────────────────── */
export default function AboutSection({
  data, vision, mission,
}: {
  data?: AboutData;
  vision?: VisionData;
  mission?: MissionData;
}) {
  const d = data || FALLBACK_ABOUT;
  const v = vision || FALLBACK_VISION;
  const m = mission || FALLBACK_MISSION;
  const [tab, setTab] = useState<'vision' | 'mission'>('vision');

  return (
    <section id="about" className="section-py" style={{ background: 'var(--black)', position: 'relative' }}>
      <div className="floating-orb" style={{ width: 600, height: 600, background: '#fff', top: '-20%', right: '-10%' }} />

      <div className="section-container">

        {/* ── Header ── */}
        <AnimatedBlock>
          <div style={{ marginBottom: 'clamp(3rem, 6vw, 6rem)', maxWidth: 680 }}>
            <p className="label-sm" style={{ marginBottom: '1rem' }}>{d.subheading}</p>
            <h2 className="heading-xl">{d.heading}</h2>
          </div>
        </AnimatedBlock>

        {/* ── Story + Timeline ── */}
        <div className="about-grid" style={{ marginBottom: 'clamp(4rem, 8vw, 8rem)' }}>
          <AnimatedBlock delay={0.1}>
            <p className="body-lg" style={{ marginBottom: '2rem' }}>{d.introduction}</p>
            <p className="body-md">{d.story}</p>
            <div style={{ display: 'flex', gap: '2.5rem', marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--gray-800)', flexWrap: 'wrap' }}>
              {[{ num: '200+', label: 'Clients' }, { num: '15+', label: 'Countries' }, { num: '6+', label: 'Years' }].map(s => (
                <div key={s.label}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', fontWeight: 700, color: 'var(--white)', lineHeight: 1 }}>{s.num}</div>
                  <div className="label-sm" style={{ marginTop: '0.5rem' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </AnimatedBlock>

          <AnimatedBlock delay={0.2}>
            <p className="label-sm" style={{ marginBottom: '2rem' }}>Our Journey</p>
            {d.timeline.map((item, i) => (
              <div key={i} className="timeline-item">
                <div className="timeline-year">{item.year}</div>
                <div>
                  <h4 style={{ fontFamily: 'var(--font-grotesk)', fontSize: '1rem', fontWeight: 600, color: 'var(--white)', marginBottom: '0.5rem' }}>{item.title}</h4>
                  <p className="body-md" style={{ fontSize: '0.875rem' }}>{item.description}</p>
                </div>
              </div>
            ))}
          </AnimatedBlock>
        </div>

        {/* ── Core Values ── */}
        <AnimatedBlock delay={0.1}>
          <p className="label-sm" style={{ marginBottom: '2rem' }}>Core Values</p>
          <div className="values-grid" style={{ marginBottom: 'clamp(4rem, 8vw, 8rem)' }}>
            {d.coreValues.map((v, i) => (
              <motion.div key={i} className="value-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div style={{ color: 'var(--gray-400)' }}>{ICONS[v.icon] || <Zap size={20} />}</div>
                  <h4 style={{ fontFamily: 'var(--font-grotesk)', fontSize: '0.9375rem', fontWeight: 600, color: 'var(--white)' }}>{v.title}</h4>
                </div>
                <p className="body-md" style={{ fontSize: '0.875rem', margin: 0 }}>{v.description}</p>
              </motion.div>
            ))}
          </div>
        </AnimatedBlock>

        {/* ── Vision & Mission tabs ── */}
        <AnimatedBlock delay={0.15}>
          <div>
            {/* tab header */}
            <div style={{ display: 'flex', gap: '0', marginBottom: '2rem', borderBottom: '1px solid var(--gray-800)' }}>
              {([
                { key: 'vision',  label: 'Our Vision',  icon: <Eye size={15} /> },
                { key: 'mission', label: 'Our Mission', icon: <Target size={15} /> },
              ] as const).map(t => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.45rem',
                    padding: '0.85rem 1.5rem',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: tab === t.key ? '2px solid var(--white)' : '2px solid transparent',
                    color: tab === t.key ? 'var(--white)' : 'var(--gray-600)',
                    fontSize: '0.875rem',
                    fontWeight: tab === t.key ? 700 : 400,
                    fontFamily: 'var(--font-grotesk)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    marginBottom: '-1px',
                    letterSpacing: '0.02em',
                  }}
                >
                  {t.icon} {t.label}
                </button>
              ))}
            </div>

            {/* tab body */}
            <AnimatePresence mode="wait">
              {tab === 'vision'
                ? <VisionContent key="vision" data={v} />
                : <MissionContent key="mission" data={m} />}
            </AnimatePresence>
          </div>
        </AnimatedBlock>

      </div>
    </section>
  );
}
