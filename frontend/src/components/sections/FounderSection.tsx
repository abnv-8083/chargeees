'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import type { FounderData } from '@/lib/types';
import { Linkedin, Twitter, Instagram, Globe, Award, BookOpen, Briefcase, X, ChevronDown } from 'lucide-react';

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
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      style={{ marginTop: '1.5rem', background: 'var(--gray-900)', border: '1px solid var(--gray-800)', borderRadius: 16, padding: 'clamp(1.25rem, 3vw, 2rem)', position: 'relative' }}
    >
      <button onClick={onClose} aria-label="Close details" style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: '1px solid var(--gray-700)', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gray-400)', cursor: 'pointer' }}>
        <X size={14} />
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem' }}>
        {/* left: bio + quote */}
        <div>
          <p className="label-sm" style={{ marginBottom: '0.75rem' }}>
            <Briefcase size={11} style={{ display: 'inline', marginRight: '0.35rem' }} />
            {f.experience}
          </p>
          <p className="body-md" style={{ color: 'var(--gray-300)', lineHeight: 1.7, marginBottom: '1.5rem' }}>{f.biography}</p>
          {f.messageFromFounder && (
            <div className="founder-quote" style={{ marginBottom: 0 }}>"{f.messageFromFounder}"</div>
          )}
        </div>

        {/* right: achievements + education + social */}
        <div>
          {f.achievements?.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <p className="label-sm" style={{ marginBottom: '0.75rem' }}>
                <Award size={11} style={{ display: 'inline', marginRight: '0.35rem' }} />Achievements
              </p>
              {f.achievements.map((a, i) => (
                <div key={i} className="achievement-item">
                  <span style={{ color: 'var(--gray-600)', fontFamily: 'var(--font-grotesk)', fontSize: '0.65rem', fontWeight: 600, flexShrink: 0 }}>0{i + 1}</span>
                  <span style={{ fontSize: '0.825rem', color: 'var(--gray-300)' }}>{a}</span>
                </div>
              ))}
            </div>
          )}

          {f.education?.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <p className="label-sm" style={{ marginBottom: '0.75rem' }}>
                <BookOpen size={11} style={{ display: 'inline', marginRight: '0.35rem' }} />Education
              </p>
              {f.education.map((edu, i) => (
                <div key={i} style={{ padding: '0.75rem 1rem', border: '1px solid var(--gray-800)', borderRadius: 10, marginBottom: '0.5rem' }}>
                  <p style={{ fontFamily: 'var(--font-grotesk)', fontSize: '0.825rem', fontWeight: 600, color: 'var(--white)', marginBottom: '0.2rem' }}>{edu.degree}</p>
                  <p style={{ fontSize: '0.775rem', color: 'var(--gray-500)', margin: 0 }}>{edu.institution}{edu.year ? ` · ${edu.year}` : ''}</p>
                </div>
              ))}
            </div>
          )}

          {Object.entries(f.socialLinks || {}).some(([, v]) => v) && (
            <div className="founder-social" style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              {Object.entries(f.socialLinks).map(([key, val]) =>
                val ? (
                  <a key={key} href={val} target="_blank" rel="noopener noreferrer" aria-label={key}>
                    {SOCIAL_ICONS[key] || <Globe size={15} />}
                  </a>
                ) : null
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── single founder card ────────────────────────────────────────────────── */
function FounderCard({ founder: f, index, expanded, onToggle }: {
  founder: FounderData;
  index: number;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: index * 0.1 }}
    >
      {/* card header row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 'clamp(1.25rem, 3vw, 2.5rem)', alignItems: 'flex-start' }}>

        {/* photo */}
        <motion.div
          style={{ position: 'relative', width: 'clamp(100px, 15vw, 160px)', aspectRatio: '3/4', borderRadius: 14, overflow: 'hidden', background: 'var(--gray-900)', flexShrink: 0 }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.4 }}
        >
          {f.profileImage
            ? <Image src={f.profileImage} alt={f.name} fill style={{ objectFit: 'cover' }} />
            : <Initials name={f.name} />}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 55%, rgba(0,0,0,0.75) 100%)' }} />
        </motion.div>

        {/* identity + short bio + toggle */}
        <div style={{ paddingTop: '0.25rem' }}>
          <span style={{ display: 'inline-block', fontSize: '0.65rem', padding: '0.2rem 0.6rem', borderRadius: 4, background: f.type === 'founder' ? 'rgba(255,255,255,0.1)' : 'var(--gray-800)', color: f.type === 'founder' ? 'var(--white)' : 'var(--gray-400)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.6rem' }}>
            {f.type === 'founder' ? 'Founder' : 'Co-Founder'}
          </span>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.35rem, 2.5vw, 1.9rem)', fontWeight: 700, color: 'var(--white)', margin: '0 0 0.25rem' }}>{f.name}</h3>
          <p style={{ fontFamily: 'var(--font-grotesk)', fontSize: '0.8rem', color: 'var(--gray-500)', letterSpacing: '0.05em', textTransform: 'uppercase', margin: '0 0 0.85rem' }}>{f.title}</p>

          {/* one-line bio teaser */}
          <p style={{ fontSize: '0.875rem', color: 'var(--gray-400)', lineHeight: 1.65, margin: '0 0 1.1rem', maxWidth: 560, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {f.biography}
          </p>

          {/* expand button */}
          <button
            onClick={onToggle}
            aria-expanded={expanded}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'transparent', border: '1px solid var(--gray-700)', borderRadius: 8, padding: '0.45rem 0.9rem', fontSize: '0.775rem', fontWeight: 600, color: 'var(--gray-300)', cursor: 'pointer', transition: 'border-color 0.2s, color 0.2s' }}
          >
            {expanded ? 'Show Less' : 'View Full Profile'}
            <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
              <ChevronDown size={13} />
            </motion.span>
          </button>
        </div>
      </div>

      {/* expandable drawer */}
      <AnimatePresence>
        {expanded && <DetailDrawer founder={f} onClose={onToggle} />}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── main exported section (replaces both FounderSection + CoFounderSection) */
export function FounderSection({ data }: { data?: FounderData[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const all = (data && data.length > 0) ? data : FALLBACK;

  const founders = all.filter(f => f.type === 'founder');
  const cofounders = all.filter(f => f.type === 'cofounder');

  const toggle = (id: string) => setExpandedId(prev => (prev === id ? null : id));

  return (
    <section id="founder" className="section-py" style={{ background: 'var(--black)', position: 'relative', borderTop: '1px solid var(--gray-900)' }}>
      {/* background orb */}
      <div className="floating-orb" style={{ width: 500, height: 500, background: '#fff', top: '20%', right: '-8%', opacity: 0.018 }} />

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
          <h2 className="heading-xl">Leadership <em>Team</em></h2>
        </motion.div>

        {/* ── founders group ── */}
        {founders.length > 0 && (
          <div style={{ marginBottom: cofounders.length > 0 ? 'clamp(2.5rem, 5vw, 4rem)' : 0 }}>
            {founders.length > 1 && (
              <p className="label-sm" style={{ marginBottom: '1.5rem', color: 'var(--gray-600)' }}>Founders</p>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(2rem, 4vw, 3rem)' }}>
              {founders.map((f, i) => (
                <div key={f._id}>
                  <FounderCard founder={f} index={i} expanded={expandedId === f._id} onToggle={() => toggle(f._id)} />
                  {i < founders.length - 1 && <div style={{ height: 1, background: 'var(--gray-900)', marginTop: 'clamp(2rem, 4vw, 3rem)' }} />}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* divider between groups */}
        {founders.length > 0 && cofounders.length > 0 && (
          <div style={{ height: 1, background: 'var(--gray-800)', margin: 'clamp(2.5rem, 5vw, 4rem) 0' }} />
        )}

        {/* ── co-founders group ── */}
        {cofounders.length > 0 && (
          <div>
            {cofounders.length > 1 && (
              <p className="label-sm" style={{ marginBottom: '1.5rem', color: 'var(--gray-600)' }}>Co-Founders & Executives</p>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(2rem, 4vw, 3rem)' }}>
              {cofounders.map((f, i) => (
                <div key={f._id}>
                  <FounderCard founder={f} index={i} expanded={expandedId === f._id} onToggle={() => toggle(f._id)} />
                  {i < cofounders.length - 1 && <div style={{ height: 1, background: 'var(--gray-900)', marginTop: 'clamp(2rem, 4vw, 3rem)' }} />}
                </div>
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
  // Rendering is handled entirely by FounderSection above.
  // This stub prevents a broken import while ClientPage is unchanged.
  return null;
}
