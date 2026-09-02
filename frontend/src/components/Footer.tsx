'use client';
import { motion } from 'framer-motion';
import type { SiteSettings } from '@/lib/types';
import { Linkedin, Twitter, Instagram, Facebook, Youtube, Globe } from 'lucide-react';

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  linkedin:  <Linkedin  size={15} />,
  twitter:   <Twitter   size={15} />,
  instagram: <Instagram size={15} />,
  facebook:  <Facebook  size={15} />,
  youtube:   <Youtube   size={15} />,
};

const FALLBACK_NAV = [
  { label: 'Home',         href: '#hero',        order: 1 },
  { label: 'About',        href: '#about',       order: 2 },
  { label: 'Projects',     href: '#projects',    order: 3 },
  { label: 'Services',     href: '#services',    order: 4 },
  { label: 'Gallery',      href: '#gallery',     order: 5 },
  { label: 'Certificates', href: '#certificate', order: 6 },
  { label: 'Contact',      href: '#contact',     order: 7 },
];

/* Split nav links into 2 columns of roughly equal size */
function splitColumns<T>(arr: T[], cols: number): T[][] {
  const size = Math.ceil(arr.length / cols);
  return Array.from({ length: cols }, (_, i) => arr.slice(i * size, i * size + size));
}

export default function Footer({ settings }: { settings?: SiteSettings }) {
  const year   = new Date().getFullYear();
  const nav    = (settings?.navigation && settings.navigation.length > 0)
    ? [...settings.navigation].sort((a, b) => (a.order || 0) - (b.order || 0))
    : FALLBACK_NAV;
  const social  = settings?.social  || {};
  const contact = settings?.contact;
  const footer  = settings?.footer;
  const hasSocial = Object.values(social).some(Boolean);

  const scrollTo = (href: string) => {
    const el = document.getElementById(href.replace('#', ''));
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
  };

  /* nav split: col1 = pages, col2 = services/legal, col3 = contact info, col4 = quick */
  const [col1, col2] = splitColumns(nav, 2);

  const legalLinks = [
    { label: 'Privacy Policy',    href: footer?.privacyPolicyUrl || '/privacy-policy' },
    { label: 'Terms & Conditions', href: footer?.termsUrl         || '/terms'          },
  ];

  const contactItems = [
    contact?.email    && { label: contact.email,       href: `mailto:${contact.email}` },
    contact?.phone    && { label: contact.phone,       href: `tel:${contact.phone}` },
    contact?.address  && { label: contact.address,     href: '#contact' },
  ].filter(Boolean) as { label: string; href: string }[];

  /* link style */
  const lnk: React.CSSProperties = {
    display: 'block',
    background: 'none',
    border: 'none',
    padding: '0.22rem 0',
    textAlign: 'left',
    fontSize: '0.78rem',
    fontFamily: 'var(--font-grotesk)',
    fontWeight: 500,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: 'var(--gray-500)',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'color 0.2s',
    width: 'fit-content',
  };

  const colHead: React.CSSProperties = {
    fontSize: '0.7rem',
    fontFamily: 'var(--font-grotesk)',
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: 'var(--white)',
    marginBottom: '0.9rem',
  };

  return (
    <footer style={{ background: 'var(--black)', borderTop: '1px solid var(--gray-900)' }}>
      <div className="section-container">

        {/* ── Top row: Logo + nav columns ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '220px repeat(4, 1fr)',
          gap: 'clamp(1.5rem, 3vw, 3rem)',
          padding: 'clamp(2.5rem, 5vw, 4rem) 0 clamp(2rem, 4vw, 3rem)',
          alignItems: 'start',
        }} className="footer-top-grid">

          {/* Logo + tagline */}
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.6rem',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: 'var(--white)',
              marginBottom: '0.4rem',
              lineHeight: 1,
            }}>
              {settings?.companyName
                ? settings.companyName
                : <>Charg<span style={{ color: 'var(--gray-600)' }}>Ease</span></>}
            </div>
            <p style={{
              margin: 0,
              fontSize: '0.7rem',
              fontFamily: 'var(--font-grotesk)',
              fontWeight: 500,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--gray-600)',
            }}>
              {settings?.companyTagline || 'Powering Business Excellence'}
            </p>
          </motion.div>

          {/* Col 1 — first half of nav */}
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.06 }}>
            <p style={colHead}>Navigation</p>
            {col1.map(item => (
              <button key={item.href} onClick={() => scrollTo(item.href)}
                style={lnk}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--white)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--gray-500)')}>
                {item.label}
              </button>
            ))}
          </motion.div>

          {/* Col 2 — second half of nav */}
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}>
            <p style={colHead}>&nbsp;</p>
            {col2.map(item => (
              <button key={item.href} onClick={() => scrollTo(item.href)}
                style={lnk}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--white)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--gray-500)')}>
                {item.label}
              </button>
            ))}
          </motion.div>

          {/* Col 3 — Contact */}
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.14 }}>
            <p style={colHead}>Contact</p>
            {contactItems.length > 0
              ? contactItems.map((c, i) => (
                  <a key={i} href={c.href} style={{ ...lnk, display: 'block' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--white)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--gray-500)')}>
                    {c.label}
                  </a>
                ))
              : (
                <>
                  <a href="mailto:info@chargeease.com" style={{ ...lnk, display: 'block' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--white)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--gray-500)')}>
                    info@chargeease.com
                  </a>
                  <button onClick={() => scrollTo('#contact')} style={lnk}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--white)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--gray-500)')}>
                    Get in Touch
                  </button>
                </>
              )}
          </motion.div>

          {/* Col 4 — Legal */}
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.18 }}>
            <p style={colHead}>Legal</p>
            {legalLinks.map((l, i) => (
              <a key={i} href={l.href} style={{ ...lnk, display: 'block' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--white)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--gray-500)')}>
                {l.label}
              </a>
            ))}
            <button onClick={() => scrollTo('#inquiry')} style={lnk}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--white)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--gray-500)')}>
              Send Inquiry
            </button>
          </motion.div>

        </div>

        {/* ── Full-width divider ── */}
        <div style={{ height: 1, background: 'var(--gray-800)', width: '100%' }} />

        {/* ── Bottom: social icons centred + copyright centred ── */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          padding: 'clamp(1.5rem, 3vw, 2.5rem) 0',
        }}>
          {/* Social icon circles */}
          {hasSocial && (
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              {Object.entries(social).map(([key, val]) =>
                val ? (
                  <a key={key} href={val} target="_blank" rel="noopener noreferrer" aria-label={key}
                    style={{
                      width: 34, height: 34,
                      borderRadius: '50%',
                      border: '1px solid var(--gray-700)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'var(--gray-500)',
                      textDecoration: 'none',
                      transition: 'border-color 0.2s, color 0.2s',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--gray-400)';
                      (e.currentTarget as HTMLAnchorElement).style.color = 'var(--white)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--gray-700)';
                      (e.currentTarget as HTMLAnchorElement).style.color = 'var(--gray-500)';
                    }}>
                    {SOCIAL_ICONS[key] || <Globe size={15} />}
                  </a>
                ) : null
              )}
            </div>
          )}

          {/* Copyright */}
          <p style={{
            margin: 0,
            fontSize: '0.775rem',
            color: 'var(--gray-600)',
            fontFamily: 'var(--font-grotesk)',
            textAlign: 'center',
          }}>
            {footer?.copyright || `©Copyright ${year}. All rights reserved.`}
          </p>
        </div>

      </div>

      {/* Responsive collapse */}
      <style>{`
        @media (max-width: 900px) {
          .footer-top-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 540px) {
          .footer-top-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}
