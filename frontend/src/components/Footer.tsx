'use client';
import { motion } from 'framer-motion';
import type { SiteSettings } from '@/lib/types';
import { Linkedin, Twitter, Instagram, Facebook, Youtube, Globe } from 'lucide-react';

/* X (formerly Twitter) SVG icon */
function XIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  );
}

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  linkedin:  <Linkedin  size={15} />,
  twitter:   <XIcon size={14} />,
  instagram: <Instagram size={15} />,
  facebook:  <Facebook  size={15} />,
  youtube:   <Youtube   size={15} />,
};

const FALLBACK_SOCIAL = [
  { key: 'instagram', href: 'https://www.instagram.com/',  icon: <Instagram size={15} />, label: 'Instagram' },
  { key: 'linkedin',  href: 'https://www.linkedin.com/',   icon: <Linkedin  size={15} />, label: 'LinkedIn'  },
  { key: 'twitter',   href: 'https://x.com/',              icon: <XIcon size={14} />,     label: 'X'         },
];

const FALLBACK_NAV = [
  { label: 'Home',         href: '#hero',        order: 1 },
  { label: 'About',        href: '#about',       order: 2 },
  { label: 'Projects',     href: '#projects',    order: 3 },
  { label: 'Services',     href: '#services',    order: 4 },
  { label: 'Credentials', href: '/certificates', order: 5 },
  { label: 'Contact',      href: '#contact',     order: 6 },
];

function splitColumns<T>(arr: T[], cols: number): T[][] {
  const size = Math.ceil(arr.length / cols);
  return Array.from({ length: cols }, (_, i) => arr.slice(i * size, i * size + size));
}

export default function Footer({ settings }: { settings?: SiteSettings }) {
  const year   = new Date().getFullYear();
  const nav = FALLBACK_NAV;
  const social  = settings?.social  || {};
  const contact = settings?.contact;
  const footer  = settings?.footer;

  const scrollTo = (href: string) => {
    if (typeof window === 'undefined') return;

    if (href.startsWith('/') && !href.startsWith('/#')) {
      if (window.location.pathname === href) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        window.location.href = href;
      }
      return;
    }

    const cleanId = href.replace(/^(\/|#)+/, '').replace(/\/$/, '');
    const isHomePage = window.location.pathname === '/' || window.location.pathname === '';

    if (isHomePage) {
      const el = document.getElementById(cleanId);
      if (el) {
        window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
        return;
      }
    }

    window.location.href = `/#${cleanId}`;
  };

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
          {(() => {
            const cmsLinks = Object.entries(social).filter(([, v]) => v);
            const items = cmsLinks.length > 0
              ? cmsLinks.map(([key, val]) => ({
                  key, href: val as string,
                  icon: SOCIAL_ICONS[key] || <Globe size={15} />,
                  label: key,
                }))
              : FALLBACK_SOCIAL;

            return (
              <div style={{ display: 'flex', gap: '0.6rem' }}>
                {items.map(item => (
                  <a key={item.key} href={item.href} target="_blank"
                    rel="noopener noreferrer" aria-label={item.label}
                    style={{
                      width: 38, height: 38, borderRadius: '50%',
                      border: '1px solid var(--gray-500)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'var(--white)', textDecoration: 'none',
                      transition: 'border-color 0.2s, color 0.2s, background 0.2s, transform 0.2s',
                      background: 'rgba(255,255,255,0.08)',
                    }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLAnchorElement;
                      el.style.borderColor = 'var(--white)';
                      el.style.background = 'rgba(255,255,255,0.18)';
                      el.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLAnchorElement;
                      el.style.borderColor = 'var(--gray-500)';
                      el.style.background = 'rgba(255,255,255,0.08)';
                      el.style.transform = 'translateY(0)';
                    }}>
                    {item.icon}
                  </a>
                ))}
              </div>
            );
          })()}

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
