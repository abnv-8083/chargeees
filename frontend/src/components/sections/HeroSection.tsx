'use client';
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import type { HeroData } from '@/lib/types';
import { ArrowDown, ArrowRight } from 'lucide-react';

const FALLBACK: HeroData = {
  companyName: 'ChargEase',
  tagline: 'Charge-Up Your\nLife With Us',
  introduction: 'We deliver cutting-edge solutions that transform industries and accelerate growth through innovation, precision, and excellence.',
  primaryCTA: { label: 'Explore Our Work', link: '#projects' },
  secondaryCTA: { label: 'Get in Touch', link: '#contact' },
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

    const particles = Array.from({ length: 80 }, () => ({
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
      // Draw connections
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

const scrollTo = (href: string) => {
  const el = document.getElementById(href.replace('#', ''));
  if (el) { const y = el.getBoundingClientRect().top + window.scrollY - 80; window.scrollTo({ top: y, behavior: 'smooth' }); }
};

const container: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.15, delayChildren: 0.8 } } };
const fadeUp: Variants = { hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: 'easeOut' as const } } };

export default function HeroSection({ data }: { data?: HeroData }) {
  const d = data || FALLBACK;
  const words = d.tagline.split('\n');

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
            <span className="label-sm">{d.companyName}</span>
          </motion.div>

          {/* Main heading — word by word */}
          <motion.h1 className="heading-hero" style={{ color: 'var(--white)', marginBottom: '1rem' }}>
            {words.map((line, li) => (
              <div key={li} style={{ overflow: 'hidden', display: 'block' }}>
                {line.split(' ').map((word, wi) => (
                  <motion.span
                    key={wi}
                    variants={{
                      hidden: { opacity: 0, y: '100%' },
                      show: { opacity: 1, y: 0, transition: { duration: 1, delay: (li * 3 + wi) * 0.08, ease: [0.16, 1, 0.3, 1] } }
                    }}
                    style={{ display: 'inline-block', marginRight: '0.25em' }}
                  >
                    {word}
                  </motion.span>
                ))}
              </div>
            ))}
          </motion.h1>

          {/* Introduction */}
          <motion.p variants={fadeUp} className="body-lg" style={{ maxWidth: '560px', margin: '0 auto 2rem', color: 'var(--gray-400)' }}>
            {d.introduction}
          </motion.p>

          {/* CTAs */}
          <motion.div variants={fadeUp} style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn-primary" onClick={() => scrollTo(d.primaryCTA.link)}>
              {d.primaryCTA.label}
              <ArrowRight size={16} />
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="scroll-indicator" aria-hidden="true">
        <span className="label-sm" style={{ color: 'var(--gray-600)' }}>Scroll</span>
        <div className="scroll-line" />
      </div>
    </section>
  );
}
