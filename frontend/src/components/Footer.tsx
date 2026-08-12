'use client';
import { motion } from 'framer-motion';
import type { SiteSettings } from '@/lib/types';
import { Linkedin, Twitter, Instagram, Facebook, Youtube, ArrowUp, Globe } from 'lucide-react';

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  linkedin: <Linkedin size={15} />, twitter: <Twitter size={15} />,
  instagram: <Instagram size={15} />, facebook: <Facebook size={15} />, youtube: <Youtube size={15} />,
};

export default function Footer({ settings }: { settings?: SiteSettings }) {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const year = new Date().getFullYear();
  const nav = settings?.navigation || [
    { label: 'About', href: '#about', order: 1 }, { label: 'Vision', href: '#vision', order: 2 },
    { label: 'Mission', href: '#mission', order: 3 }, { label: 'Projects', href: '#projects', order: 4 },
    { label: 'Services', href: '#services', order: 5 }, { label: 'Gallery', href: '#gallery', order: 6 },
    { label: 'Contact', href: '#contact', order: 7 },
  ];
  const social = settings?.social || {};
  const footer = settings?.footer;
  const scrollTo = (href: string) => {
    const el = document.getElementById(href.replace('#', ''));
    if (el) { const y = el.getBoundingClientRect().top + window.scrollY - 80; window.scrollTo({ top: y, behavior: 'smooth' }); }
  };

  return (
    <footer id="footer" className="section-py" style={{ borderTop: '1px solid var(--gray-800)' }}>
      <div className="section-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'clamp(3rem, 5vw, 5rem)', flexWrap: 'wrap', gap: '3rem' }}>
          {/* Brand Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ maxWidth: 360 }}
          >
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--white)', marginBottom: '1.25rem' }}>
              Charg<span style={{ color: 'var(--gray-600)' }}>Ease</span>
            </div>
            <p className="body-md" style={{ marginBottom: '2rem' }}>
              {settings?.companyDescription || 'Powering the Future of Business through innovation, precision, and unwavering excellence.'}
            </p>
            <div className="footer-social" style={{ display: 'flex', gap: '0.625rem' }}>
              {Object.entries(social).map(([key, val]) =>
                val ? (
                  <a key={key} href={val} target="_blank" rel="noopener noreferrer" aria-label={key}>
                    {SOCIAL_ICONS[key] || <Globe size={15} />}
                  </a>
                ) : null
              )}
            </div>
          </motion.div>

          {/* Nav Columns */}
          <div style={{ display: 'flex', gap: 'clamp(2rem, 5vw, 6rem)', flexWrap: 'wrap' }}>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
              <p className="label-sm" style={{ marginBottom: '1.5rem', color: 'var(--gray-700)' }}>Navigation</p>
              <nav aria-label="Footer navigation">
                {nav.sort((a, b) => a.order - b.order).map((link) => (
                  <button key={link.href} onClick={() => scrollTo(link.href)} className="footer-link" style={{ background: 'none', border: 'none', padding: '0.3rem 0', display: 'block', textAlign: 'left', width: '100%' }}>
                    {link.label}
                  </button>
                ))}
              </nav>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }}>
              <p className="label-sm" style={{ marginBottom: '1.5rem', color: 'var(--gray-700)' }}>Legal</p>
              <a href={footer?.privacyPolicyUrl || '/privacy-policy'} className="footer-link">Privacy Policy</a>
              <a href={footer?.termsUrl || '/terms'} className="footer-link">Terms & Conditions</a>
              <button onClick={() => scrollTo('#inquiry')} className="footer-link" style={{ background: 'none', border: 'none', padding: '0.3rem 0', display: 'block', textAlign: 'left', width: '100%' }}>Contact Us</button>
            </motion.div>

            {settings?.contact && (
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
                <p className="label-sm" style={{ marginBottom: '1.5rem', color: 'var(--gray-700)' }}>Contact</p>
                {settings.contact.email && <a href={`mailto:${settings.contact.email}`} className="footer-link">{settings.contact.email}</a>}
                {settings.contact.phone && <a href={`tel:${settings.contact.phone}`} className="footer-link">{settings.contact.phone}</a>}
                {settings.contact.officeHours && <p className="footer-link" style={{ whiteSpace: 'pre-line', fontSize: '0.8rem' }}>{settings.contact.officeHours}</p>}
              </motion.div>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="divider" style={{ marginBottom: '2rem' }} />

        {/* Bottom Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <p style={{ fontSize: '0.8125rem', color: 'var(--gray-600)', fontFamily: 'var(--font-grotesk)' }}>
            {footer?.copyright || `© ${year} ChargEase. All rights reserved.`}
          </p>
          <button
            onClick={scrollTop}
            style={{ width: 40, height: 40, border: '1px solid var(--gray-700)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', color: 'var(--gray-500)', transition: 'all 0.25s ease' }}
            aria-label="Scroll to top"
            className="scroll-top-btn"
          >
            <ArrowUp size={16} />
          </button>
        </div>
      </div>
    </footer>
  );
}
