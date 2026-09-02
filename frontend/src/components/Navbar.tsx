'use client';
import { useEffect, useRef, useState } from 'react';
import type { SiteSettings } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import { User, LogIn, LogOut, ChevronDown, Award, Settings } from 'lucide-react';
import Link from 'next/link';

const FALLBACK_NAV = [
  { label: 'Home',     href: '#hero',     order: 1 },
  { label: 'About',   href: '#about',    order: 2 },
  { label: 'Projects',href: '#projects', order: 3 },
  { label: 'Services',href: '#services', order: 4 },
  { label: 'Gallery', href: '#gallery',  order: 5 },
  { label: 'Contact', href: '#contact',  order: 6 },
];

export default function Navbar({ settings }: { settings?: SiteSettings }) {
  const [scrolled, setScrolled]     = useState(false);
  const [active, setActive]         = useState('hero');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navRef    = useRef<HTMLElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { user, logout, openAuthModal } = useAuth();

  const navItems = (settings?.navigation && settings.navigation.length > 0)
    ? [...settings.navigation].sort((a, b) => (a.order || 0) - (b.order || 0))
    : FALLBACK_NAV;

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
      const sections = navItems.map(n => n.href.startsWith('#') ? n.href.slice(1) : '');
      for (let i = sections.length - 1; i >= 0; i--) {
        if (!sections[i]) continue;
        const el = document.getElementById(sections[i]);
        if (el && el.getBoundingClientRect().top <= 120) { setActive(sections[i]); break; }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [navItems]);

  /* close user dropdown on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    if (!href.startsWith('#')) return;
    const el = document.getElementById(href.slice(1));
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
  };

  const handleLogout = async () => {
    setUserMenuOpen(false);
    await logout();
  };

  return (
    <>
      {/* ── Top utility bar (edistrict-style) ── */}
      <div style={{
        background: '#fff',
        borderBottom: '1px solid #e8e8e8',
        padding: '0.35rem 0',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1001,
      }}>
        <div className="section-container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.75rem',
          fontFamily: 'var(--font-grotesk)',
        }}>
          {/* left: site label */}
          <span style={{ color: '#525252', letterSpacing: '0.02em' }}>
            {settings?.companyName || 'ChargEase'} — Official Portal
          </span>

          {/* right: user controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {user ? (
              <div ref={userMenuRef} style={{ position: 'relative' }}>
                <button
                  onClick={() => setUserMenuOpen(v => !v)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.4rem',
                    background: 'none', border: '1px solid #e8e8e8', borderRadius: 6,
                    padding: '0.3rem 0.7rem', cursor: 'pointer',
                    color: '#333', fontSize: '0.75rem', fontWeight: 600,
                    fontFamily: 'var(--font-grotesk)',
                  }}
                >
                  <User size={13} />
                  {user.name || user.email}
                  <ChevronDown size={12} style={{ transform: userMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </button>

                {userMenuOpen && (
                  <div style={{
                    position: 'absolute', top: 'calc(100% + 6px)', right: 0,
                    background: '#fff', border: '1px solid #e8e8e8',
                    borderRadius: 10, minWidth: 180, boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                    zIndex: 10, overflow: 'hidden',
                  }}>
                    <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #f4f4f4' }}>
                      <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 700, color: '#111' }}>{user.name}</p>
                      <p style={{ margin: 0, fontSize: '0.7rem', color: '#888' }}>{user.email}</p>
                    </div>
                    <Link href="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1rem', fontSize: '0.8rem', color: '#333', textDecoration: 'none', transition: 'background 0.15s' }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#f4f4f4')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <Award size={13} /> My Certificates
                    </Link>
                    {(user.role === 'admin' || user.role === 'superadmin') && (
                      <Link href="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1rem', fontSize: '0.8rem', color: '#333', textDecoration: 'none' }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#f4f4f4')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >
                        <Settings size={13} /> Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1rem', fontSize: '0.8rem', color: '#ef4444', background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', borderTop: '1px solid #f4f4f4' }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#fff5f5')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <LogOut size={13} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => openAuthModal('login')}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                  background: 'none', border: '1px solid #d1d1d1', borderRadius: 6,
                  padding: '0.3rem 0.7rem', cursor: 'pointer',
                  color: '#333', fontSize: '0.75rem', fontWeight: 600,
                  fontFamily: 'var(--font-grotesk)',
                  transition: 'border-color 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = '#999')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#d1d1d1')}
              >
                <LogIn size={13} /> Sign In
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Main navbar ── */}
      <nav
        ref={navRef}
        id="navbar"
        className={scrolled ? 'scrolled' : ''}
        style={{ top: 32, padding: scrolled ? '0.65rem 0' : '1rem 0' }}
      >
        <div className="section-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <button
            onClick={() => handleNavClick('#hero')}
            style={{ background: 'none', border: 'none', padding: 0, display: 'flex', alignItems: 'center', gap: '0.6rem' }}
            aria-label="Home"
          >
            {settings?.logo && (
              <img src={settings.logo} alt={settings.companyName || 'ChargEase'} style={{ height: 30, width: 'auto', objectFit: 'contain' }} />
            )}
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.375rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--white)' }}>
              {settings?.companyName || <>Charg<span style={{ color: 'var(--gray-500)' }}>Ease</span></>}
            </span>
          </button>

          {/* Desktop links */}
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

          {/* CTA + hamburger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={() => handleNavClick('#contact')}
              className="btn-primary desktop-nav"
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
              color: active === (item.href.startsWith('#') ? item.href.slice(1) : '') ? 'var(--white)' : 'var(--gray-600)',
              transition: 'color 0.25s ease',
              animationDelay: `${i * 0.05}s`,
            }}
          >
            {item.label}
          </button>
        ))}
        {/* mobile sign-in */}
        <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--gray-800)' }}>
          {user ? (
            <button onClick={handleLogout} style={{ background: 'none', border: '1px solid var(--gray-700)', borderRadius: 8, padding: '0.6rem 1.25rem', color: 'var(--gray-400)', fontSize: '0.875rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <LogOut size={15} /> Sign Out
            </button>
          ) : (
            <button onClick={() => { setMobileOpen(false); openAuthModal('login'); }} style={{ background: 'none', border: '1px solid var(--gray-700)', borderRadius: 8, padding: '0.6rem 1.25rem', color: 'var(--gray-400)', fontSize: '0.875rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <LogIn size={15} /> Sign In
            </button>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) { .desktop-nav { display: none !important; } }
      `}</style>
    </>
  );
}
