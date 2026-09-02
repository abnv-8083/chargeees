'use client';
import { motion } from 'framer-motion';
import type { SiteSettings } from '@/lib/types';
import { Linkedin, Twitter, Instagram, Facebook, Youtube, ArrowUp, Globe, Mail, Phone, Clock } from 'lucide-react';

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  linkedin:  <Linkedin  size={16} />,
  twitter:   <Twitter   size={16} />,
  instagram: <Instagram size={16} />,
  facebook:  <Facebook  size={16} />,
  youtube:   <Youtube   size={16} />,
};

const FALLBACK_NAV = [
  { label: 'Home',     href: '#hero',     order: 1 },
  { label: 'About',   href: '#about',    order: 2 },
  { label: 'Projects',href: '#projects', order: 3 },
  { label: 'Services',href: '#services', order: 4 },
  { label: 'Gallery', href: '#gallery',  order: 5 },
  { label: 'Contact', href: '#contact',  order: 6 },
];

export default function Footer({ settings }: { settings?: SiteSettings }) {
  const year = new Date().getFullYear();
  const nav = (settings?.navigation && settings.navigation.length > 0)
    ? [...settings.navigation].sort((a, b) => (a.order || 0) - (b.order || 0))
    : FALLBACK_NAV;
  const social  = settings?.social  || {};
  const contact = settings?.contact;
  const footer  = settings?.footer;

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const scrollTo  = (href: string) => {
    const el = document.getElementById(href.replace('#', ''));
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <footer
      style={{
        background: 'var(--black)',
        borderTop: '1px solid var(--gray-800)',
        paddingTop: 'clamp(3rem, 6vw, 5rem)',
        paddingBottom: '2rem',
      }}
    >
      <div className="section-container">

        {/* ── Top grid: Brand | Nav | Contact ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr',
          gap: 'clamp(2rem, 4vw, 5rem)',
          marginBottom: 'clamp(2.5rem, 5vw, 4rem)',
          alignItems: 'start',
        }}
          className="footer-grid"
        >

          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.6rem',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: 'var(--white)',
              marginBottom: '1rem',
            }}>
              {settings?.companyName
                ? settings.companyName
                : <>Charg<span style={{ color: 'var(--gray-600)' }}>Ease</span></>}
            </div>

            <p style={{
              fontSize: '0.875rem',
              color: 'var(--gray-500)',
              lineHeight: 1.7,
              maxWidth: 320,
              marginBottom: '1.75rem',
            }}>
              {settings?.companyDescription
                || 'Powering the future of business through innovation, precision, and unwavering excellence.'}
            </p>

            {/* Social icons */}
            {Object.entries(social).some(([, v]) => v) && (
              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                {Object.entries(social).map(([key, val]) =>
                  val ? (
                    <a
                      key={key}
                      href={val}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={key}
                      style={{
                        width: 36,
                        height: 36,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid var(--gray-800)',
                        borderRadius: 8,
                        color: 'var(--gray-500)',
                        transition: 'border-color 0.2s, color 0.2s',
                        textDecoration: 'none',
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--gray-500)';
                        (e.currentTarget as HTMLAnchorElement).style.color = 'var(--white)';
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--gray-800)';
                        (e.currentTarget as HTMLAnchorElement).style.color = 'var(--gray-500)';
                      }}
                    >
                      {SOCIAL_ICONS[key] || <Globe size={16} />}
                    </a>
                  ) : null
                )}
              </div>
            )}
          </motion.div>

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <p style={{
              fontSize: '0.7rem',
              fontFamily: 'var(--font-grotesk)',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--gray-600)',
              marginBottom: '1.25rem',
            }}>
              Navigation
            </p>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }} aria-label="Footer navigation">
              {nav.map(link => (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    textAlign: 'left',
                    fontSize: '0.875rem',
                    color: 'var(--gray-500)',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-sans)',
                    transition: 'color 0.2s ease',
                    width: 'fit-content',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--white)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--gray-500)')}
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <p style={{
              fontSize: '0.7rem',
              fontFamily: 'var(--font-grotesk)',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--gray-600)',
              marginBottom: '1.25rem',
            }}>
              Contact
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {(contact?.email || !contact) && (
                <a
                  href={`mailto:${contact?.email || 'info@chargeease.com'}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', fontSize: '0.85rem', color: 'var(--gray-500)', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--white)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--gray-500)')}
                >
                  <Mail size={14} style={{ flexShrink: 0 }} />
                  {contact?.email || 'info@chargeease.com'}
                </a>
              )}
              {contact?.phone && (
                <a
                  href={`tel:${contact.phone}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', fontSize: '0.85rem', color: 'var(--gray-500)', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--white)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--gray-500)')}
                >
                  <Phone size={14} style={{ flexShrink: 0 }} />
                  {contact.phone}
                </a>
              )}
              {contact?.officeHours && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.55rem', fontSize: '0.8rem', color: 'var(--gray-600)', lineHeight: 1.5 }}>
                  <Clock size={14} style={{ flexShrink: 0, marginTop: '0.15rem' }} />
                  <span style={{ whiteSpace: 'pre-line' }}>{contact.officeHours}</span>
                </div>
              )}
              {/* Legal links */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--gray-900)' }}>
                <a
                  href={footer?.privacyPolicyUrl || '/privacy-policy'}
                  style={{ fontSize: '0.8rem', color: 'var(--gray-600)', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--gray-400)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--gray-600)')}
                >
                  Privacy Policy
                </a>
                <a
                  href={footer?.termsUrl || '/terms'}
                  style={{ fontSize: '0.8rem', color: 'var(--gray-600)', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--gray-400)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--gray-600)')}
                >
                  Terms & Conditions
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Bottom bar ── */}
        <div style={{
          borderTop: '1px solid var(--gray-900)',
          paddingTop: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--gray-700)', fontFamily: 'var(--font-grotesk)', margin: 0 }}>
            {footer?.copyright || `© ${year} ChargEase. All rights reserved.`}
          </p>

          <button
            onClick={scrollTop}
            aria-label="Scroll to top"
            style={{
              width: 38,
              height: 38,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid var(--gray-800)',
              borderRadius: '50%',
              background: 'transparent',
              color: 'var(--gray-600)',
              cursor: 'pointer',
              transition: 'border-color 0.2s, color 0.2s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--gray-500)';
              (e.currentTarget as HTMLButtonElement).style.color = 'var(--white)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--gray-800)';
              (e.currentTarget as HTMLButtonElement).style.color = 'var(--gray-600)';
            }}
          >
            <ArrowUp size={15} />
          </button>
        </div>

      </div>

      {/* Responsive grid collapse */}
      <style>{`
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}
