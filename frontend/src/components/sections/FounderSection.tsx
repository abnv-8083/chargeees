'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import type { FounderData } from '@/lib/types';
import { Linkedin, Twitter, Instagram, Globe, Award, BookOpen, Briefcase, X, ChevronDown } from 'lucide-react';
import Parallax from '@/components/ui/Parallax';
import RevealText from '@/components/ui/RevealText';

/* ─── fallback data ──────────────────────────────────────────────────────── */
const FALLBACK: FounderData[] = [
  {
    _id: '1', type: 'founder',
    name: 'Alexandra Morgan', title: 'Founder & CEO',
    profileImage: '',
    biography: 'Alexandra Morgan is a visionary entrepreneur with over 15 years of experience in building high-impact businesses across technology, consulting, and finance.',
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
    biography: 'Daniel Reeves is a technology architect who has spent two decades designing the systems that power modern business at scale.',
    experience: '20+ years in software engineering and enterprise technology architecture.',
    achievements: ['Architected systems serving 50M+ users', 'Multiple patents in distributed computing', 'MIT Technology Review Innovator'],
    education: [{ degree: 'PhD — Computer Science', institution: 'Stanford University', year: '2005' }],
    messageFromFounder: 'Technology should serve people, not the other way around. We build tools that are powerful yet human.',
    socialLinks: { linkedin: '#', twitter: '#', instagram: '#', facebook: '', website: '' },
  },
];

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  linkedin: <Linkedin size={15} />,
  twitter: <Twitter size={15} />,
  instagram: <Instagram size={15} />,
  facebook: <Globe size={15} />,
  website: <Globe size={15} />,
};

/* ─── placeholder initials ───────────────────────────────────────────────── */
function Initials({ name }: { name: string }) {
  const letters = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, var(--gray-800), var(--gray-900))' }}>
      <span style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700, color: 'var(--gray-700)' }}>{letters}</span>
    </div>
  );
}

/* ─── expanded detail drawer ─────────────────────────────────────────────── */
function DetailDrawer({ founder: f, onClose }: { founder: FounderData; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0, y: 15 }}
      animate={{ opacity: 1, height: 'auto', y: 0 }}
      exit={{ opacity: 0, height: 0, y: 10 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      style={{
        marginTop: '1.25rem',
        paddingTop: '1.25rem',
        borderTop: '1px solid var(--gray-800)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Bio + Experience + Quote */}
        <div>
          {f.experience && (
            <p className="label-sm" style={{ marginBottom: '0.6rem' }}>
              <Briefcase size={11} style={{ display: 'inline', marginRight: '0.35rem' }} />
              {f.experience}
            </p>
          )}
          <p className="body-md" style={{ color: 'var(--gray-300)', lineHeight: 1.65, fontSize: '0.875rem', marginBottom: '1rem' }}>
            {f.biography}
          </p>
          {f.messageFromFounder && (
            <div className="founder-quote" style={{ margin: '0.75rem 0', padding: '0.85rem 1rem', background: 'var(--gray-900)', borderRadius: 10, borderLeft: '3px solid var(--white)', fontSize: '0.825rem', color: 'var(--gray-300)', fontStyle: 'italic' }}>
              "{f.messageFromFounder}"
            </div>
          )}
        </div>

        {/* Achievements */}
        {f.achievements?.length > 0 && (
          <div>
            <p className="label-sm" style={{ marginBottom: '0.5rem' }}>
              <Award size={11} style={{ display: 'inline', marginRight: '0.35rem' }} />Achievements
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {f.achievements.map((a, i) => (
                <div key={i} className="achievement-item" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span style={{ color: 'var(--gray-600)', fontFamily: 'var(--font-grotesk)', fontSize: '0.65rem', fontWeight: 600, flexShrink: 0 }}>0{i + 1}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--gray-300)' }}>{a}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {f.education?.length > 0 && (
          <div>
            <p className="label-sm" style={{ marginBottom: '0.5rem' }}>
              <BookOpen size={11} style={{ display: 'inline', marginRight: '0.35rem' }} />Education
            </p>
            {f.education.map((edu, i) => (
              <div key={i} style={{ padding: '0.6rem 0.85rem', border: '1px solid var(--gray-800)', borderRadius: 8, marginBottom: '0.4rem', background: 'var(--gray-900)' }}>
                <p style={{ fontFamily: 'var(--font-grotesk)', fontSize: '0.8rem', fontWeight: 600, color: 'var(--white)', marginBottom: '0.15rem' }}>{edu.degree}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)', margin: 0 }}>{edu.institution}{edu.year ? ` · ${edu.year}` : ''}</p>
              </div>
            ))}
          </div>
        )}

        {/* Social */}
        {Object.entries(f.socialLinks || {}).some(([, v]) => v) && (
          <div className="founder-social" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', paddingTop: '0.25rem' }}>
            {Object.entries(f.socialLinks).map(([key, val]) =>
              val ? (
                <a
                  key={key}
                  href={val}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={key}
                  style={{
                    width: 32, height: 32,
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

/* ─── vertical founder card ──────────────────────────────────────────────── */
function FounderCard({ founder: f, index, expanded, onToggle }: {
  founder: FounderData;
  index: number;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: index * 0.1 }}
      style={{
        background: 'var(--gray-900)',
        border: '1px solid var(--gray-800)',
        borderRadius: 20,
        padding: 'clamp(1.25rem, 2.5vw, 1.75rem)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        transition: 'border-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease',
      }}
      whileHover={{ borderColor: 'rgba(255,255,255,0.2)', translateY: -4 }}
    >
      {/* 1. Photo on TOP (Vertical layout) */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '4/3',
          borderRadius: 14,
          overflow: 'hidden',
          background: 'var(--black)',
          marginBottom: '1.25rem',
        }}
      >
        {f.profileImage
          ? <Image src={f.profileImage} alt={f.name} fill style={{ objectFit: 'cover' }} />
          : <Initials name={f.name} />}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 55%, rgba(0,0,0,0.7) 100%)' }} />
      </div>

      {/* 2. Identity + details vertically stacked */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ marginBottom: '0.75rem' }}>
          <span style={{
            display: 'inline-block',
            fontSize: '0.65rem',
            padding: '0.2rem 0.6rem',
            borderRadius: 4,
            background: f.type === 'founder' ? 'rgba(255,255,255,0.1)' : 'var(--gray-800)',
            color: f.type === 'founder' ? 'var(--white)' : 'var(--gray-400)',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '0.5rem',
          }}>
            {f.type === 'founder' ? 'Founder' : 'Co-Founder'}
          </span>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.25rem, 2vw, 1.6rem)', fontWeight: 700, color: 'var(--white)', margin: '0 0 0.2rem' }}>
            {f.name}
          </h3>
          <p style={{ fontFamily: 'var(--font-grotesk)', fontSize: '0.775rem', color: 'var(--gray-500)', letterSpacing: '0.05em', textTransform: 'uppercase', margin: 0 }}>
            {f.title}
          </p>
        </div>

        {/* Bio preview */}
        <p style={{
          fontSize: '0.85rem',
          color: 'var(--gray-400)',
          lineHeight: 1.6,
          margin: '0 0 1.25rem',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          flex: 1,
        }}>
          {f.biography}
        </p>

        {/* Expand / Collapse Button */}
        <button
          onClick={onToggle}
          aria-expanded={expanded}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem',
            background: 'var(--black)',
            border: '1px solid var(--gray-700)',
            borderRadius: 8,
            padding: '0.55rem 1rem',
            fontSize: '0.8rem',
            fontWeight: 600,
            color: 'var(--gray-200)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            width: '100%',
          }}
        >
          {expanded ? 'Show Less' : 'View Full Profile'}
          <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
            <ChevronDown size={14} />
          </motion.span>
        </button>
      </div>

      {/* 3. Expandable drawer inside the vertical card */}
      <AnimatePresence>
        {expanded && <DetailDrawer founder={f} onClose={onToggle} />}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── main exported section ──────────────────────────────────────────────── */
export function FounderSection({ data }: { data?: FounderData[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const all = (data && data.length > 0) ? data : FALLBACK;

  const founders = all.filter(f => f.type === 'founder');
  const cofounders = all.filter(f => f.type === 'cofounder');

  const toggle = (id: string) => setExpandedId(prev => (prev === id ? null : id));

  return (
    <section id="founder" className="section-py" style={{ background: 'var(--black)', position: 'relative', borderTop: '1px solid var(--gray-900)' }}>
      {/* background orb */}
      <Parallax speed={0.06}><div className="floating-orb" style={{ width: 500, height: 500, background: '#fff', top: '20%', right: '-8%', opacity: 0.018 }} /></Parallax>

      <div className="section-container">
        {/* section heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: 'clamp(2.5rem, 5vw, 4rem)' }}
        >
          <p className="label-sm" style={{ marginBottom: '0.75rem' }}>The People Behind ChargEase</p>
          <RevealText as="h2" className="heading-xl" delay={0.1}>Leadership Team</RevealText>
        </motion.div>

        {/* ── founders group in vertical grid ── */}
        {founders.length > 0 && (
          <div style={{ marginBottom: cofounders.length > 0 ? 'clamp(3rem, 5vw, 4.5rem)' : 0 }}>
            {founders.length > 1 && (
              <p className="label-sm" style={{ marginBottom: '1.5rem', color: 'var(--gray-600)' }}>Founders</p>
            )}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
              gap: 'clamp(1.5rem, 3vw, 2.5rem)',
              alignItems: 'start',
            }}>
              {founders.map((f, i) => (
                <FounderCard key={f._id} founder={f} index={i} expanded={expandedId === f._id} onToggle={() => toggle(f._id)} />
              ))}
            </div>
          </div>
        )}

        {/* ── co-founders group in vertical grid ── */}
        {cofounders.length > 0 && (
          <div>
            {cofounders.length > 1 && (
              <p className="label-sm" style={{ marginBottom: '1.5rem', color: 'var(--gray-600)' }}>Co-Founders & Executives</p>
            )}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
              gap: 'clamp(1.5rem, 3vw, 2.5rem)',
              alignItems: 'start',
            }}>
              {cofounders.map((f, i) => (
                <FounderCard key={f._id} founder={f} index={i} expanded={expandedId === f._id} onToggle={() => toggle(f._id)} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* ─── CoFounderSection kept as alias so ClientPage import doesn't break ──── */
export function CoFounderSection({ data: _ }: { data?: FounderData[] }) {
  return null;
}
