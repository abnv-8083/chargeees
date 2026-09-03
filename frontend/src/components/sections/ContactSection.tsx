'use client';
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import type { SiteSettings } from '@/lib/types';
import { Mail, Phone, MapPin, Clock, Linkedin, Twitter, Instagram, Facebook, Youtube, Globe } from 'lucide-react';

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let start = 0;
    const duration = 2000;
    const step = 1000 / 60;
    const increment = target / (duration / step);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) { start = target; clearInterval(timer); }
      el.textContent = Math.floor(start) + suffix;
    }, step);
    return () => clearInterval(timer);
  }, [target, suffix]);
  return <span ref={ref}>0{suffix}</span>;
}

const DEFAULT_SETTINGS: Partial<SiteSettings> = {
  contact: { email: 'info@chargeease.com', phone: '+1 (555) 000-0000', address: '100 Innovation Drive, Suite 500\nNew York, NY 10001', officeHours: 'Monday – Friday\n9:00 AM – 6:00 PM EST' },
  social: { linkedin: '#', twitter: '#', instagram: '#', facebook: '#', youtube: '#' },
};

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  linkedin: <Linkedin size={16} />, twitter: <Twitter size={16} />,
  instagram: <Instagram size={16} />, facebook: <Facebook size={16} />, youtube: <Youtube size={16} />,
};

export default function ContactSection({ settings }: { settings?: SiteSettings }) {
  const s = settings || DEFAULT_SETTINGS as SiteSettings;

  return (
    <section id="contact" className="section-py" style={{ background: 'var(--gray-900)', position: 'relative' }} data-cursor-color="#38bdf8">
      <div className="floating-orb" style={{ width: 500, height: 500, background: '#fff', bottom: '-15%', left: '-5%' }} />

      <div className="section-container">
        {/* Stats Row */}
        <motion.div
          className="stats-row"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          {[
            { target: 200, suffix: '+', label: 'Global Clients' },
            { target: 15, suffix: '+', label: 'Countries' },
            { target: 6, suffix: '+', label: 'Years of Excellence' },
            { target: 98, suffix: '%', label: 'Client Satisfaction' },
          ].map((stat, i) => (
            <div key={i} className="stat-item">
              <div className="stat-number">
                <AnimatedCounter target={stat.target} suffix={stat.suffix} />
              </div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Header + Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: 'clamp(3rem, 6vw, 5rem)' }}
        >
          <p className="label-sm" style={{ marginBottom: '1rem' }}>Get In Touch</p>
          <h2 className="heading-xl">Contact Us</h2>
        </motion.div>

        <div className="contact-grid">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            {[
              { icon: <Mail size={20} />, label: 'Email', value: s.contact?.email, href: `mailto:${s.contact?.email}` },
              { icon: <Phone size={20} />, label: 'Phone', value: s.contact?.phone, href: `tel:${s.contact?.phone}` },
              { icon: <MapPin size={20} />, label: 'Address', value: s.contact?.address },
              { icon: <Clock size={20} />, label: 'Office Hours', value: s.contact?.officeHours },
            ].map((item, i) => (
              <div key={i} className="contact-info-item">
                <div className="contact-icon">{item.icon}</div>
                <div>
                  <p className="label-sm" style={{ marginBottom: '0.25rem' }}>{item.label}</p>
                  {item.href ? (
                    <a href={item.href} style={{ color: 'var(--white)', textDecoration: 'none', fontFamily: 'var(--font-grotesk)', fontSize: '0.9375rem', transition: 'color 0.2s ease' }}>
                      {item.value}
                    </a>
                  ) : (
                    <p style={{ color: 'var(--white)', fontFamily: 'var(--font-grotesk)', fontSize: '0.9375rem', whiteSpace: 'pre-line', margin: 0 }}>{item.value}</p>
                  )}
                </div>
              </div>
            ))}

            {/* Social */}
            {s.social && Object.entries(s.social).some(([, v]) => v) && (
              <div style={{ marginTop: '2rem' }}>
                <p className="label-sm" style={{ marginBottom: '1rem' }}>Follow Us</p>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  {Object.entries(s.social).map(([key, val]) =>
                    val ? (
                      <a key={key} href={val} target="_blank" rel="noopener noreferrer" aria-label={key}
                        style={{ width: 40, height: 40, border: '1px solid var(--gray-700)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gray-400)', textDecoration: 'none', transition: 'all 0.25s ease' }}
                        className="contact-social-link"
                      >
                        {SOCIAL_ICONS[key] || <Globe size={16} />}
                      </a>
                    ) : null
                  )}
                </div>
              </div>
            )}
          </motion.div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="map-container">
              {s.contact?.googleMapsEmbed ? (
                <iframe src={s.contact.googleMapsEmbed} title="ChargEase Office Location" loading="lazy" allowFullScreen referrerPolicy="no-referrer-when-downgrade" />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--gray-800)', color: 'var(--gray-600)', flexDirection: 'column', gap: '0.75rem' }}>
                  <MapPin size={32} />
                  <p style={{ fontFamily: 'var(--font-grotesk)', fontSize: '0.875rem' }}>Map will appear when configured in admin</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
