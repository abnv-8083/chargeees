'use client';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import type { HeroData } from '@/lib/types';
import { ArrowRight } from 'lucide-react';

const FALLBACK: HeroData = {
  companyName: 'ChargEase',
  tagline: 'Charge-Up Your\nLife With Us',
  introduction: 'We deliver cutting-edge solutions that transform industries and accelerate growth.',
  primaryCTA: { label: 'Explore Our Work', link: '#projects' },
  secondaryCTA: { label: 'Get in Touch', link: '#inquiry' },
  backgroundType: 'particles',
};

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let W = canvas.width = canvas.offsetWidth;
    let H = canvas.height = canvas.offsetHeight;
    let raf: number;

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.3,
      o: Math.random() * 0.5 + 0.1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.o})`;
        ctx.fill();
      });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255,255,255,${0.06 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    const onResize = () => { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; };
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); };
  }, []);
  return <canvas ref={canvasRef} id="hero-canvas" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} aria-hidden="true" />;
}

/* ─── Typing animation hook ─────────────────────────────────────────────── */
function useTypingAnimation(text: string, speed = 60, delay = 800) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let i = 0;
    const start = () => {
      timeout = setTimeout(function type() {
        if (i < text.length) {
          setDisplayed(text.slice(0, i + 1));
          i++;
          timeout = setTimeout(type, text[i - 1] === '\n' ? 300 : speed);
        } else {
          setDone(true);
        }
      }, delay);
    };
    start();
    return () => clearTimeout(timeout);
  }, [text, speed, delay]);

  return { displayed, done };
}

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

const container: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.4 } } };
const fadeUp: Variants = { hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: 'easeOut' as const } } };

export default function HeroSection({ data }: { data?: HeroData }) {
  const d = data || FALLBACK;
  const lines = d.tagline.split('\n');
  const fullText = lines.join(' ');
  const { displayed, done } = useTypingAnimation(fullText, 55, 1000);

  // Split displayed text back into lines for rendering
  const displayedLines = displayed.split('\n');

  return (
    <section id="hero">
      <ParticleCanvas />

      {/* Gradient overlays */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(255,255,255,0.04) 0%, transparent 70%)' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%', background: 'linear-gradient(0deg, #000 0%, transparent 100%)' }} />

      <div className="hero-content">
        <motion.div variants={container} initial="hidden" animate="show">
          {/* Label */}
          <motion.div variants={fadeUp} className="hero-label" style={{ justifyContent: 'center' }}>
            <span className="hero-label-dot" />
            <span className="label-sm" style={{ fontSize: '1rem', letterSpacing: 'normal', color: 'var(--gray-300)', fontWeight: 600 }}>{d.companyName}</span>
          </motion.div>

          {/* Main heading — typing animation */}
          <h1 className="heading-hero" style={{ color: 'var(--white)', marginBottom: '1rem', minHeight: '1.1em' }}>
            {displayedLines.map((line, li) => (
              <span key={li} style={{ display: 'block' }}>
                {line.split(' ').map((word, wi) => (
                  <span key={wi} style={{ display: 'inline-block', marginRight: '0.25em' }}>
                    {word}
                  </span>
                ))}
              </span>
            ))}
            {!done && (
              <span className="hero-cursor" style={{
                display: 'inline-block',
                width: '3px',
                height: '0.9em',
                background: 'var(--white)',
                marginLeft: '2px',
                verticalAlign: 'text-bottom',
                animation: 'blink 1s step-end infinite',
              }} />
            )}
          </h1>

          {/* Introduction — fades in after typing */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={done ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="body-lg"
            style={{ maxWidth: '480px', margin: '0 auto 2rem', color: 'var(--gray-400)' }}
          >
            {d.introduction}
          </motion.p>

          {/* CTAs — slide up after intro */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={done ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
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
        animate={done ? { opacity: 1 } : {}}
        transition={{ delay: 0.5, duration: 0.8 }}
        aria-hidden="true"
        onClick={() => handleExploreClick('about')}
        style={{ cursor: 'pointer' }}
      >
        <span className="label-sm" style={{ color: 'var(--gray-600)' }}>Scroll</span>
        <div className="scroll-line" />
      </motion.div>

      <style>{`
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
      `}</style>
    </section>
  );
}
