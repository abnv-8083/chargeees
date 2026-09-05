'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import type { FounderData } from '@/lib/types';
import { Linkedin, Twitter, Instagram, Globe, Award, BookOpen, Briefcase, ChevronDown } from 'lucide-react';
import Parallax from '@/components/ui/Parallax';
import RevealText from '@/components/ui/RevealText';

/* ─── fallback data ──────────────────────────────────────────────────────── */
const FALLBACK: FounderData[] = [
  {
    _id: '1', type: 'founder',
    name: 'Alexandra Morgan', title: 'Founder & CEO',
    profileImage: '',
    biography: 'Visionary entrepreneur with 15+ years building high-impact tech & strategy solutions.',
    experience: '15+ years in business strategy and technology leadership.',
    achievements: ['Forbes 30 Under 30', 'Built ChargEase from 0 to $50M ARR', 'Speaker at Davos and TED'],
    education: [{ degree: 'MBA — Strategy & Innovation', institution: 'Harvard Business School', year: '2009' }],
    messageFromFounder: 'ChargEase was born from a simple belief: that every business deserves access to world-class tools and expertise.',
    socialLinks: { linkedin: '#', twitter: '#', instagram: '#', facebook: '', website: '' },
  },
  {
    _id: '2', type: 'cofounder',
    name: 'Daniel Reeves', title: 'Co-Founder & CTO',
    profileImage: '',
    biography: 'Technology architect designing systems that power modern business at scale.',
    experience: '20+ years in software engineering and enterprise technology architecture.',
    achievements: ['Architected systems serving 50M+ users', 'Multiple patents in distributed computing', 'MIT Technology Review Innovator'],
    education: [{ degree: 'PhD — Computer Science', institution: 'Stanford University', year: '2005' }],
    messageFromFounder: 'Technology should serve people, not the other way around. We build tools that are powerful yet human.',
    socialLinks: { linkedin: '#', twitter: '#', instagram: '#', facebook: '', website: '' },
  },
];

const CARD_THEMES = [
  { bg: 'linear-gradient(145deg, #1e293b, #0f172a)', border: 'rgba(56, 189, 248, 0.25)', accent: '#38bdf8', glow: 'rgba(56, 189, 248, 0.15)' },
  { bg: 'linear-gradient(145deg, #271e0c, #140f06)', border: 'rgba(251, 191, 36, 0.25)', accent: '#fbbf24', glow: 'rgba(251, 191, 36, 0.15)' },
  { bg: 'linear-gradient(145deg, #06281e, #031510)', border: 'rgba(52, 211, 153, 0.25)', accent: '#34d399', glow: 'rgba(52, 211, 153, 0.15)' },
  { bg: 'linear-gradient(145deg, #25123d, #12091f)', border: 'rgba(168, 85, 247, 0.25)', accent: '#c084fc', glow: 'rgba(168, 85, 247, 0.15)' },
];

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  linkedin: <Linkedin size={15} />,
  twitter: <Twitter size={15} />,
  instagram: <Instagram size={15} />,
  facebook: <Globe size={15} />,
  website: <Globe size={15} />,
};

/* ─── placeholder initials ───────────────────────────────────────────────── */
function Initials({ name, accent }: { name: string; accent: string }) {
  const letters = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem, 6vw, 4.5rem)', fontWeight: 700, color: accent, opacity: 0.85 }}>
        {letters}
      </span>
    </div>
  );
}

/* ─── expanded detail drawer ─────────────────────────────────────────────── */
function DetailDrawer({ founder: f, accent }: { founder: FounderData; accent: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0, y: 10 }}
      animate={{ opacity: 1, height: 'auto', y: 0 }}
      exit={{ opacity: 0, height: 0, y: 10 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      style={{
        marginTop: '1rem',
        padding: '1.25rem',
        borderRadius: 16,
        background: 'var(--gray-900)',
        border: '1px solid var(--gray-800)',
        textAlign: 'left',
        overflow: 'hidden',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {f.experience && (
          <p className="label-sm" style={{ margin: 0, color: accent }}>
            <Briefcase size={12} style={{ display: 'inline', marginRight: '0.35rem' }} />
            {f.experience}
          </p>
        )}
        
        {f.messageFromFounder && (
          <div style={{ padding: '0.75rem 1rem', background: 'var(--black)', borderRadius: 10, borderLeft: `3px solid ${accent}`, fontSize: '0.825rem', color: 'var(--gray-300)', fontStyle: 'italic' }}>
            "{f.messageFromFounder}"
          </div>
        )}

        {f.achievements?.length > 0 && (
          <div>
            <p className="label-sm" style={{ marginBottom: '0.5rem', color: 'var(--gray-400)' }}>
              <Award size={11} style={{ display: 'inline', marginRight: '0.35rem' }} />Achievements
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {f.achievements.map((a, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span style={{ color: accent, fontFamily: 'var(--font-grotesk)', fontSize: '0.65rem', fontWeight: 600 }}>0{i + 1}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--gray-300)' }}>{a}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {f.education?.length > 0 && (
          <div>
            <p className="label-sm" style={{ marginBottom: '0.5rem', color: 'var(--gray-400)' }}>
              <BookOpen size={11} style={{ display: 'inline', marginRight: '0.35rem' }} />Education
            </p>
            {f.education.map((edu, i) => (
              <div key={i} style={{ padding: '0.5rem 0.75rem', border: '1px solid var(--gray-800)', borderRadius: 8, background: 'var(--black)', marginBottom: '0.35rem' }}>
                <p style={{ fontFamily: 'var(--font-grotesk)', fontSize: '0.8rem', fontWeight: 600, color: 'var(--white)', margin: '0 0 0.1rem' }}>{edu.degree}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)', margin: 0 }}>{edu.institution}{edu.year ? ` · ${edu.year}` : ''}</p>
              </div>
            ))}
          </div>
        )}

        {Object.entries(f.socialLinks || {}).some(([, v]) => v) && (
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', paddingTop: '0.25rem' }}>
            {Object.entries(f.socialLinks).map(([key, val]) =>
              val ? (
                <a
                  key={key}
                  href={val}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={key}
                  style={{
                    width: 30, height: 30,
                    borderRadius: '50%',
                    border: '1px solid var(--gray-700)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--gray-400)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {SOCIAL_ICONS[key] || <Globe size={13} />}
                </a>
              ) : null
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ─── Reference-Style Founder Card ───────────────────────────────────────── */
function FounderCard({ founder: f, index, expanded, onToggle }: {
  founder: FounderData;
  index: number;
  expanded: boolean;
  onToggle: () => void;
}) {
  const theme = CARD_THEMES[index % CARD_THEMES.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: index * 0.1 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        width: '100%',
      }}
    >
      {/* 1. Photo Box (Rounded square card container) */}
      <motion.div
        whileHover={{ scale: 1.02, y: -4 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '1/1',
          borderRadius: 24,
          overflow: 'hidden',
          background: theme.bg,
          border: `1px solid ${theme.border}`,
          boxShadow: `0 12px 36px ${theme.glow}`,
          cursor: 'pointer',
        }}
        onClick={onToggle}
      >
        {f.profileImage ? (
          <Image
            src={f.profileImage}
            alt={f.name}
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <Initials name={f.name} accent={theme.accent} />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 65%, rgba(0,0,0,0.6) 100%)' }} />
      </motion.div>

      {/* 2. Name — Title / Role and Parenthetical Description */}
      <div style={{ marginTop: '1.25rem', width: '100%', padding: '0 0.5rem' }}>
        {/* Name — Role */}
        <h3
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(1.15rem, 2vw, 1.45rem)',
            fontWeight: 700,
            color: 'var(--white)',
            margin: '0 0 0.35rem',
            lineHeight: 1.3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '0.4rem',
          }}
        >
          <span>{f.name}</span>
          <span style={{ color: 'var(--gray-600)', fontWeight: 300 }}>—</span>
          <span style={{ color: theme.accent, fontWeight: 600 }}>{f.title}</span>
        </h3>

        {/* (Bio / Tagline in parentheses style) */}
        {f.biography && (
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.875rem',
              color: 'var(--gray-400)',
              margin: '0 0 0.75rem',
              lineHeight: 1.5,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            ({f.biography})
          </p>
        )}

        {/* Toggle profile detail */}
        <button
          onClick={onToggle}
          aria-expanded={expanded}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            background: 'transparent',
            border: 'none',
            color: theme.accent,
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: 'pointer',
            padding: '0.25rem 0.5rem',
            borderRadius: 6,
            transition: 'opacity 0.2s ease',
          }}
        >
          {expanded ? 'Hide Details' : 'View Profile'}
          <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
            <ChevronDown size={13} />
          </motion.span>
        </button>
      </div>

      {/* 3. Detail Drawer on expand */}
      <AnimatePresence>
        {expanded && <DetailDrawer founder={f} accent={theme.accent} />}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Main Section ───────────────────────────────────────────────────────── */
export function FounderSection({ data }: { data?: FounderData[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const all = (data && data.length > 0) ? data : FALLBACK;

  const toggle = (id: string) => setExpandedId(prev => (prev === id ? null : id));

  return (
    <section id="founder" className="section-py" style={{ background: 'var(--black)', position: 'relative', borderTop: '1px solid var(--gray-900)' }}>
      {/* background orb */}
      <Parallax speed={0.06}><div className="floating-orb" style={{ width: 500, height: 500, background: '#fff', top: '20%', right: '-8%', opacity: 0.018 }} /></Parallax>

      <div className="section-container">
        {/* section heading matching the reference style */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: 'clamp(2.5rem, 5vw, 4rem)', textAlign: 'center' }}
        >
          <p className="label-sm" style={{ marginBottom: '0.75rem' }}>The People Behind ChargEase</p>
          <RevealText as="h2" className="heading-xl" delay={0.1}>Leadership Team</RevealText>
        </motion.div>

        {/* ── Founders grid ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
            gap: 'clamp(2rem, 4vw, 3rem)',
            justifyContent: 'center',
            alignItems: 'start',
            maxWidth: all.length <= 2 ? 760 : 1100,
            margin: '0 auto',
          }}
        >
          {all.map((f, i) => (
            <FounderCard
              key={f._id}
              founder={f}
              index={i}
              expanded={expandedId === f._id}
              onToggle={() => toggle(f._id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CoFounderSection kept as alias so ClientPage import doesn't break ──── */
export function CoFounderSection({ data: _ }: { data?: FounderData[] }) {
  return null;
}
