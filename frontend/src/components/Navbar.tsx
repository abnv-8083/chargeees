'use client';
import { useEffect, useRef, useState } from 'react';
import type { SiteSettings } from '@/lib/types';

const FALLBACK_NAV = [
  { label: 'Home',         href: '#hero',        id: 'hero',        order: 1 },
  { label: 'About',        href: '#about',       id: 'about',       order: 2 },
  { label: 'Projects',     href: '#projects',    id: 'projects',    order: 3 },
  { label: 'Services',     href: '#services',    id: 'services',    order: 4 },
  { label: 'Credentials', href: '/certificates', id: 'certificates', order: 5 },
  { label: 'Contact',      href: '#contact',     id: 'contact',     order: 6 },
];

export default function Navbar({ settings }: { settings?: SiteSettings }) {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('hero');
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  const navItems = FALLBACK_NAV;

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if on /certificates page
    if (window.location.pathname === '/certificates' || window.location.pathname.startsWith('/certificates')) {
      setActive('certificates');
      const onScrollCert = () => setScrolled(window.scrollY > 30);
      window.addEventListener('scroll', onScrollCert, { passive: true });
      return () => window.removeEventListener('scroll', onScrollCert);
    }

    const onScroll = () => {
      setScrolled(window.scrollY > 50);

      // Active section detection on home page
      const sectionIds = ['contact', 'services', 'projects', 'about', 'hero'];
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 160) {
            setActive(id);
            break;
          }
        }
      }
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);

    if (typeof window === 'undefined') return;

    // 1. Direct page route (e.g. /certificates)
    if (href.startsWith('/') && !href.startsWith('/#')) {
      if (window.location.pathname === href) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        window.location.href = href;
      }
      return;
    }

    // 2. Section anchor link (e.g. #hero, #about, #projects, #services, #inquiry, #contact)
    const id = href.replace(/^(\/|#)+/, '').replace(/\/$/, '');
    const isHomePage = window.location.pathname === '/' || window.location.pathname === '';

    if (isHomePage) {
      const el = document.getElementById(id);
      if (el) {
        const offset = 80;
        const y = el.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: y, behavior: 'smooth' });
        setActive(id === 'inquiry' ? 'contact' : id);
        return;
      }
    }

    // If on /certificates or other subpage, navigate to homepage section
    window.location.href = `/#${id}`;
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
            style={{ background: 'none', border: 'none', padding: 0, display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer' }}
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
                className={`nav-link ${active === item.id ? 'active' : ''}`}
                style={{ background: 'none', border: 'none', padding: '0.25rem 0', cursor: 'pointer' }}
                aria-current={active === item.id ? 'page' : undefined}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Get in Touch CTA (Goes to Inquiry) + Hamburger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={() => handleNavClick('#inquiry')}
              className="btn-primary"
              style={{ padding: '0.55rem 1.25rem', fontSize: '0.8rem' }}
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
              color: active === item.id ? 'var(--white)' : 'var(--gray-600)',
              transition: 'color 0.25s ease',
              animationDelay: `${i * 0.05}s`,
              cursor: 'pointer',
            }}
          >
            {item.label}
          </button>
        ))}
        <button
          onClick={() => handleNavClick('#inquiry')}
          className="btn-primary"
          style={{ marginTop: '1.5rem', padding: '0.75rem 2rem', fontSize: '1rem' }}
        >
          Get in Touch
        </button>
      </div>

      <style jsx>{`
        @media (max-width: 900px) { .desktop-nav { display: none !important; } }
      `}</style>
    </>
  );
}
