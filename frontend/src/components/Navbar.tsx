'use client';
import { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import type { SiteSettings } from '@/lib/types';

const FALLBACK_NAV = [
  { label: 'Home', href: '#hero', order: 1 },
  { label: 'About', href: '#about', order: 2 },
  { label: 'Vision', href: '#vision', order: 3 },
  { label: 'Mission', href: '#mission', order: 4 },
  { label: 'Founder', href: '#founder', order: 5 },
  { label: 'Projects', href: '#projects', order: 6 },
  { label: 'Services', href: '#services', order: 7 },
  { label: 'Gallery', href: '#gallery', order: 8 },
  { label: 'Certificate', href: '#certificate', order: 9 },
  { label: 'Contact', href: '#contact', order: 10 },
];

export default function Navbar({ settings }: { settings?: SiteSettings }) {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('hero');
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  const navItems = (settings?.navigation && settings.navigation.length > 0)
    ? [...settings.navigation].sort((a, b) => (a.order || 0) - (b.order || 0))
    : FALLBACK_NAV;

  // Add Certificate section link if missing from DB navigation settings
  if (!navItems.some(n => n.href === '#certificate')) {
    navItems.splice(navItems.length - 1, 0, { label: 'Certificate', href: '#certificate', order: 9 });
  }

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
      // Active section detection
      const sections = navItems.map(n => n.href.startsWith('#') ? n.href.slice(1) : '');
      for (let i = sections.length - 1; i >= 0; i--) {
        if (!sections[i]) continue;
        const el = document.getElementById(sections[i]);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120) { setActive(sections[i]); break; }
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [navItems]);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    if (!href.startsWith('#')) return;
    const id = href.slice(1);
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const y = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav
        ref={navRef}
        id="navbar"
        className={scrolled ? 'scrolled' : ''}
        style={{ padding: scrolled ? '0.75rem 0' : '1.25rem 0' }}
      >
        <div className="section-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <button
            onClick={() => handleNavClick('#hero')}
            style={{ background: 'none', border: 'none', padding: 0, display: 'flex', alignItems: 'center', gap: '0.6rem' }}
            aria-label="Home"
          >
            {settings?.logo ? (
              <img src={settings.logo} alt={settings.companyName || 'ChargEase'} style={{ height: 32, width: 'auto', objectFit: 'contain' }} />
            ) : null}
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.375rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--white)' }}>
              {settings?.companyName ? (
                settings.companyName
              ) : (
                <>Charg<span style={{ color: 'var(--gray-500)' }}>Ease</span></>
              )}
            </span>
          </button>

          {/* Desktop Nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }} className="desktop-nav" aria-label="Main navigation">
            {navItems.map(item => (
              <button
                key={item.href}
                onClick={() => handleNavClick(item.href)}
                className={`nav-link ${active === (item.href.startsWith('#') ? item.href.slice(1) : '') ? 'active' : ''}`}
                style={{ background: 'none', border: 'none', padding: '0.25rem 0' }}
                aria-current={active === (item.href.startsWith('#') ? item.href.slice(1) : '') ? 'page' : undefined}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Action Buttons: ONLY Get in Touch */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={() => handleNavClick('#contact')}
              className="btn-primary"
              style={{ padding: '0.6rem 1.5rem', fontSize: '0.8rem' }}
            >
              Get in Touch
            </button>

            <button
              className={`hamburger ${mobileOpen ? 'open' : ''}`}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Nav */}
      <div className={`mobile-nav ${mobileOpen ? 'open' : ''}`} aria-hidden={!mobileOpen}>
        {navItems.map((item, i) => (
          <button
            key={item.href}
            onClick={() => handleNavClick(item.href)}
            style={{
              background: 'none', border: 'none', padding: 0,
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.75rem, 5vw, 3rem)',
              fontWeight: 600,
              color: active === (item.href.startsWith('#') ? item.href.slice(1) : '') ? 'var(--white)' : 'var(--gray-600)',
              transition: 'color 0.25s ease',
              animationDelay: `${i * 0.05}s`,
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      <style jsx>{`
        @media (max-width: 900px) { .desktop-nav { display: none !important; } }
      `}</style>
    </>
  );
}
