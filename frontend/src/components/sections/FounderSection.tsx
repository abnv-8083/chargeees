'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import type { FounderData } from '@/lib/types';
import { Linkedin, Twitter, Instagram, Globe, Award, BookOpen, Briefcase } from 'lucide-react';

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  linkedin: <Linkedin size={16} />, twitter: <Twitter size={16} />,
  instagram: <Instagram size={16} />, facebook: <Globe size={16} />, website: <Globe size={16} />,
};

function PlaceholderImage({ name }: { name: string }) {
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, var(--gray-800), var(--gray-900))', position: 'relative' }}>
      <span style={{ fontFamily: 'var(--font-display)', fontSize: '5rem', fontWeight: 700, color: 'var(--gray-700)' }}>{initials}</span>
    </div>
  );
}

function FounderCard({ founder, reversed = false, sectionId }: { founder: FounderData; reversed?: boolean; sectionId: string }) {
  return (
    <section id={sectionId} className="section-py" style={{ background: 'var(--black)', position: 'relative', borderTop: '1px solid var(--gray-900)' }}>
      <div className="floating-orb" style={{ width: 400, height: 400, background: '#fff', top: '50%', right: reversed ? 'auto' : '-5%', left: reversed ? '-5%' : 'auto', transform: 'translateY(-50%)' }} />
      <div className="section-container">
        <div className={`founder-layout ${reversed ? 'reversed' : ''}`}>
          {/* Image */}
          <motion.div
            className="founder-image-wrapper"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            {founder.profileImage ? (
              <Image src={founder.profileImage} alt={founder.name} fill style={{ objectFit: 'cover' }} />
            ) : (
              <PlaceholderImage name={founder.name} />
            )}
            <div className="founder-image-overlay" />
            {/* Name overlay on image */}
            <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', right: '1.5rem' }}>
              <p style={{ fontFamily: 'var(--font-grotesk)', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginBottom: '0.25rem' }}>{founder.title}</p>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--white)' }}>{founder.name}</h3>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: reversed ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            <p className="label-sm" style={{ marginBottom: '0.75rem' }}>{founder.title}</p>
            <h2 className="heading-lg" style={{ marginBottom: '1.5rem' }}>{founder.name}</h2>

            <p className="body-lg" style={{ marginBottom: '2rem' }}>{founder.biography}</p>

            {/* Experience */}
            {founder.experience && (
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', padding: '1rem 1.25rem', border: '1px solid var(--gray-800)', borderRadius: 12, alignItems: 'flex-start' }}>
                <Briefcase size={16} style={{ color: 'var(--gray-500)', flexShrink: 0, marginTop: '0.15rem' }} />
                <p className="body-md" style={{ fontSize: '0.875rem', margin: 0 }}>{founder.experience}</p>
              </div>
            )}

            {/* Achievements */}
            {founder.achievements.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <p className="label-sm" style={{ marginBottom: '1rem' }}>
                  <Award size={12} style={{ display: 'inline', marginRight: '0.4rem' }} />Achievements
                </p>
                {founder.achievements.map((ach, i) => (
                  <div key={i} className="achievement-item">
                    <span style={{ color: 'var(--gray-600)', fontFamily: 'var(--font-grotesk)', fontSize: '0.7rem', fontWeight: 600 }}>0{i + 1}</span>
                    <span className="body-md" style={{ fontSize: '0.875rem' }}>{ach}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Education */}
            {founder.education.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <p className="label-sm" style={{ marginBottom: '1rem' }}>
                  <BookOpen size={12} style={{ display: 'inline', marginRight: '0.4rem' }} />Education
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {founder.education.map((edu, i) => (
                    <div key={i} style={{ padding: '1rem', border: '1px solid var(--gray-800)', borderRadius: 10 }}>
                      <p style={{ fontFamily: 'var(--font-grotesk)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--white)', marginBottom: '0.25rem' }}>{edu.degree}</p>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--gray-500)', margin: 0 }}>{edu.institution} · {edu.year}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Message */}
            {founder.messageFromFounder && (
              <div className="founder-quote">
                "{founder.messageFromFounder}"
              </div>
            )}

            {/* Social */}
            {Object.entries(founder.socialLinks).some(([, v]) => v) && (
              <div className="founder-social" style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                {Object.entries(founder.socialLinks).map(([key, val]) =>
                  val ? (
                    <a key={key} href={val} target="_blank" rel="noopener noreferrer" aria-label={key}>
                      {SOCIAL_ICONS[key] || <Globe size={16} />}
                    </a>
                  ) : null
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function FounderSection({ data }: { data?: FounderData[] }) {
  const founders = data || [{
    _id: '1', type: 'founder' as const,
    name: 'Alexandra Morgan', title: 'Founder & CEO',
    biography: 'Alexandra Morgan is a visionary entrepreneur with over 15 years of experience in building high-impact businesses.',
    experience: '15+ years in business strategy and technology leadership.',
    achievements: ['Forbes 30 Under 30', 'Built ChargEase from 0 to $50M ARR', 'Speaker at Davos and TED'],
    education: [{ degree: 'MBA — Strategy & Innovation', institution: 'Harvard Business School', year: '2009' }],
    messageFromFounder: 'ChargEase was born from a simple belief: that every business deserves access to world-class tools and expertise.',
    socialLinks: { linkedin: '#', twitter: '#', instagram: '#', facebook: '', website: '' },
  }];
  return (
    <>
      {founders.map((f, i) => (
        <FounderCard key={f._id} founder={f} reversed={i % 2 === 1} sectionId={i === 0 ? 'founder' : `founder-${i}`} />
      ))}
    </>
  );
}

export function CoFounderSection({ data }: { data?: FounderData[] }) {
  const cofounders = data || [{
    _id: '2', type: 'cofounder' as const,
    name: 'Daniel Reeves', title: 'Co-Founder & CTO',
    biography: 'Daniel Reeves is a technology architect who has spent two decades designing the systems that power modern business.',
    experience: '20+ years in software engineering and enterprise technology architecture.',
    achievements: ['Architected systems serving 50M+ users', 'Multiple patents in distributed computing', 'MIT Technology Review Innovator'],
    education: [{ degree: 'PhD — Computer Science', institution: 'Stanford University', year: '2005' }],
    messageFromFounder: 'Technology should serve people, not the other way around. We build tools that are powerful yet human.',
    socialLinks: { linkedin: '#', twitter: '#', instagram: '#', facebook: '', website: '' },
  }];
  return (
    <>
      {cofounders.map((f, i) => (
        <FounderCard key={f._id} founder={f} reversed={i % 2 === 0} sectionId={i === 0 ? 'cofounder' : `cofounder-${i}`} />
      ))}
    </>
  );
}
