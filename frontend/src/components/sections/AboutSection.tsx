'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import type { AboutData } from '@/lib/types';
import { Shield, Lightbulb, Star, Heart, Zap, Globe, Users } from 'lucide-react';

const ICONS: Record<string, React.ReactNode> = {
  Shield: <Shield size={20} />, Lightbulb: <Lightbulb size={20} />,
  Star: <Star size={20} />, Heart: <Heart size={20} />,
  Zap: <Zap size={20} />, Globe: <Globe size={20} />, Users: <Users size={20} />,
};

const FALLBACK: AboutData = {
  heading: 'About ChargEase',
  subheading: 'Who We Are',
  introduction: 'ChargEase is a forward-thinking company committed to delivering transformative solutions across industries.',
  story: 'Founded with a singular vision — to redefine how businesses grow and operate — ChargEase has evolved into a trusted partner for organizations seeking precision, innovation, and sustainable progress.',
  coreValues: [
    { title: 'Integrity', description: 'We operate with transparency and honesty in every engagement.', icon: 'Shield' },
    { title: 'Innovation', description: 'We push boundaries and embrace emerging technologies.', icon: 'Lightbulb' },
    { title: 'Excellence', description: 'We deliver nothing short of the highest quality.', icon: 'Star' },
    { title: 'Client-First', description: 'Our clients are at the center of every decision.', icon: 'Heart' },
  ],
  whyUs: [],
  timeline: [
    { year: '2018', title: 'Founded', description: 'ChargEase established with a vision to transform business.' },
    { year: '2020', title: 'Expansion', description: 'Expanded to 3 countries with 50+ professionals.' },
    { year: '2022', title: 'Innovation Award', description: 'Recognized as most innovative company of the year.' },
    { year: '2024', title: 'Global Reach', description: 'Serving 200+ clients across 15+ countries worldwide.' },
  ],
};

function AnimatedBlock({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function AboutSection({ data }: { data?: AboutData }) {
  const d = data || FALLBACK;

  return (
    <section id="about" className="section-py" style={{ background: 'var(--black)', position: 'relative' }}>
      {/* Floating orb */}
      <div className="floating-orb" style={{ width: 600, height: 600, background: '#fff', top: '-20%', right: '-10%' }} />

      <div className="section-container">
        {/* Header */}
        <AnimatedBlock>
          <div style={{ marginBottom: 'clamp(3rem, 6vw, 6rem)', maxWidth: 680 }}>
            <p className="label-sm" style={{ marginBottom: '1rem' }}>{d.subheading}</p>
            <h2 className="heading-xl">{d.heading}</h2>
          </div>
        </AnimatedBlock>

        {/* Split Grid */}
        <div className="about-grid" style={{ marginBottom: 'clamp(4rem, 8vw, 8rem)' }}>
          {/* Left — Story */}
          <AnimatedBlock delay={0.1}>
            <div>
              <p className="body-lg" style={{ marginBottom: '2rem' }}>{d.introduction}</p>
              <p className="body-md">{d.story}</p>

              {/* Stats row */}
              <div style={{ display: 'flex', gap: '2.5rem', marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--gray-800)', flexWrap: 'wrap' }}>
                {[
                  { num: '200+', label: 'Clients' },
                  { num: '15+', label: 'Countries' },
                  { num: '6+', label: 'Years' },
                ].map(s => (
                  <div key={s.label}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', fontWeight: 700, color: 'var(--white)', lineHeight: 1 }}>{s.num}</div>
                    <div className="label-sm" style={{ marginTop: '0.5rem' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedBlock>

          {/* Right — Timeline */}
          <AnimatedBlock delay={0.2}>
            <div>
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
            </div>
          </AnimatedBlock>
        </div>

        {/* Core Values */}
        <AnimatedBlock delay={0.1}>
          <p className="label-sm" style={{ marginBottom: '2rem' }}>Core Values</p>
          <div className="values-grid">
            {d.coreValues.map((v, i) => (
              <motion.div
                key={i}
                className="value-card"
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
      </div>
    </section>
  );
}
