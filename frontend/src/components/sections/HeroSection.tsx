'use client';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import type { HeroData } from '@/lib/types';
import { ArrowRight } from 'lucide-react';

const GradientWaves = dynamic(() => import('@/components/ui/GradientWaves'), { ssr: false });
const FoldText = dynamic(() => import('@/components/ui/FoldText'), { ssr: false });

const FALLBACK: HeroData = {
  companyName: 'ChargEase',
  tagline: 'Charge-Up Your\nLife With Us',
  introduction: 'We deliver cutting-edge solutions that transform industries and accelerate growth.',
  primaryCTA: { label: 'Explore Our Work', link: '#projects' },
  secondaryCTA: { label: 'Get in Touch', link: '#inquiry' },
  backgroundType: 'particles',
};

const handleExploreClick = (link?: string) => {
  if (typeof window === 'undefined') return;
  const cleanId = (link || 'projects').replace(/^(\/|#)+/, '').replace(/\/$/, '');
  const targetId = cleanId || 'projects';
  const isHomePage = window.location.pathname === '/' || window.location.pathname === '';

  if (isHomePage) {
    const el = document.getElementById(targetId) || document.getElementById('projects');
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
      return;
    }
  }
  window.location.href = `/#${targetId}`;
};

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15, delayChildren: 0.3 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

export default function HeroSection({ data }: { data?: HeroData }) {
  const d = data || FALLBACK;

  return (
    <section id="hero" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* 3D WebGL Gradient Waves Background */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <GradientWaves
          horizonColor="#5227FF"
          waveColor="#FF9FFC"
          crestColor="#FFFFFF"
          speed={0.4}
          amplitude={2.5}
          waveScale={0.6}
          waveRatio={0.9}
          swell={35}
          turbulence={20}
          tilt={1.11}
          zoom={1.0}
          height={5.5}
          fogDepth={15}
          detail="medium"
          brightness={1.0}
          opacity={1.0}
          mouseInteraction={true}
          parallaxStrength={0.5}
          grain={true}
          grainIntensity={0.05}
        />
      </div>

      {/* Subtle vignette & bottom fade overlays to ensure hero text is crisp & readable */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 85% 75% at 50% 50%, rgba(5, 5, 15, 0.35) 0%, rgba(5, 5, 15, 0.78) 100%)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '40%',
          background: 'linear-gradient(0deg, #05050f 0%, transparent 100%)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      <div className="hero-content" style={{ position: 'relative', zIndex: 2 }}>
        <motion.div variants={container} initial="hidden" animate="show">
          {/* Label */}
          <motion.div variants={fadeUp} className="hero-label" style={{ justifyContent: 'center' }}>
            <span className="hero-label-dot" />
            <span className="label-sm" style={{ fontSize: '1rem', letterSpacing: 'normal', color: 'var(--gray-300)', fontWeight: 600 }}>{d.companyName}</span>
          </motion.div>

          {/* Main heading — 3D FoldText animation */}
          <h1 className="heading-hero" style={{ color: 'var(--white)', marginBottom: '1.25rem', minHeight: '1.1em' }}>
            <FoldText
              text={d.tagline}
              splitBy="char"
              hinge="top"
              trigger="mount"
              duration={0.65}
              stagger={0.035}
              ease="power3.out"
              perspective={700}
              creaseShading={0.55}
              fontSize="clamp(2.5rem, 6.5vw, 4.75rem)"
              fontWeight={700}
              color="#ffffff"
            />
          </h1>

          {/* Introduction */}
          <motion.p
            variants={fadeUp}
            className="body-lg"
            style={{ maxWidth: '480px', margin: '0 auto 2rem', color: 'var(--gray-400)' }}
          >
            {d.introduction}
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeUp}
            style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <button className="btn-primary" onClick={() => handleExploreClick(d.primaryCTA?.link)}>
              {d.primaryCTA?.label || 'Explore Our Work'}
              <ArrowRight size={16} />
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="scroll-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        aria-hidden="true"
        onClick={() => handleExploreClick('about')}
        style={{ cursor: 'pointer' }}
      >
        <span className="label-sm" style={{ color: 'var(--gray-600)' }}>Scroll</span>
        <div className="scroll-line" />
      </motion.div>
    </section>
  );
}

