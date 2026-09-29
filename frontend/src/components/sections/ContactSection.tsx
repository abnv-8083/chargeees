'use client';
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import type { SiteSettings } from '@/lib/types';
import { Mail, Phone, MapPin, Clock, Linkedin, Instagram, Facebook, Youtube, Globe } from 'lucide-react';
import Parallax from '@/components/ui/Parallax';
import RevealText from '@/components/ui/RevealText';

/* X (formerly Twitter) SVG icon */
function XIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  );
}

const DEFAULT_SETTINGS: Partial<SiteSettings> = {
  contact: { email: 'info@chargeease.com', phone: '+1 (555) 000-0000', address: '100 Innovation Drive, Suite 500\nNew York, NY 10001', officeHours: 'Monday – Friday\n9:00 AM – 6:00 PM EST' },
  social: { linkedin: '#', twitter: '#', instagram: '#', facebook: '#', youtube: '#' },
};

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  linkedin: <Linkedin size={16} />, twitter: <XIcon size={15} />,
  instagram: <Instagram size={16} />, facebook: <Facebook size={16} />, youtube: <Youtube size={16} />,
};

export default function ContactSection({ settings }: { settings?: SiteSettings }) {
  const s = settings || DEFAULT_SETTINGS as SiteSettings;

  return (
    <section id="contact" className="section-py" style={{ background: 'var(--gray-900)', position: 'relative' }} data-cursor-color="#38bdf8">
      <Parallax speed={0.1}><div className="floating-orb" style={{ width: 500, height: 500, background: '#fff', bottom: '-15%', left: '-5%' }} /></Parallax>

      <div className="section-container">
        {/* Header + Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: 'clamp(3rem, 6vw, 5rem)' }}
        >
          <p className="label-sm" style={{ marginBottom: '1rem' }}>Get In Touch</p>
          <RevealText as="h2" className="heading-xl" delay={0.1}>Contact Us</RevealText>
        </motion.div>

        {/* Contact Info Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          {[
            { icon: <Mail size={22} />, label: 'Email', value: s.contact?.email, href: `mailto:${s.contact?.email}` },
            { icon: <Phone size={22} />, label: 'Phone', value: s.contact?.phone, href: `tel:${s.contact?.phone}` },
            { icon: <MapPin size={22} />, label: 'Address', value: s.contact?.address },
            { icon: <Clock size={22} />, label: 'Office Hours', value: s.contact?.officeHours },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '1.75rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              <div className="contact-icon">{item.icon}</div>
              <div>
                <p className="label-sm" style={{ marginBottom: '0.35rem' }}>{item.label}</p>
                {item.href ? (
                  <a href={item.href} style={{ color: 'var(--white)', textDecoration: 'none', fontFamily: 'var(--font-grotesk)', fontSize: '0.9375rem', fontWeight: 500, transition: 'color 0.2s ease' }}>
                    {item.value}
                  </a>
                ) : (
                  <p style={{ color: 'var(--white)', fontFamily: 'var(--font-grotesk)', fontSize: '0.9375rem', fontWeight: 500, whiteSpace: 'pre-line', margin: 0 }}>{item.value}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Social */}
        {s.social && Object.entries(s.social).some(([, v]) => v) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{
              paddingTop: '2rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1.5rem',
            }}
          >
            <div>
              <p className="label-sm" style={{ marginBottom: '0.25rem' }}>Follow Us</p>
              <p style={{ color: 'var(--white)', fontFamily: 'var(--font-grotesk)', fontSize: '1rem', margin: 0 }}>Connect with us on our social platforms</p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {Object.entries(s.social).map(([key, val]) =>
                val ? (
                  <a key={key} href={val} target="_blank" rel="noopener noreferrer" aria-label={key}
                    style={{ width: 44, height: 44, border: '1px solid var(--gray-700)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gray-400)', textDecoration: 'none', transition: 'all 0.25s ease' }}
                    className="contact-social-link"
                  >
                    {SOCIAL_ICONS[key] || <Globe size={16} />}
                  </a>
                ) : null
              )}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
