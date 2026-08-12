'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Toaster } from 'sonner';
import {
  LayoutDashboard, Sparkles, Users, Briefcase, Layers,
  Image as ImageIcon, Inbox, Settings, LogOut, ExternalLink,
  Menu, X, ShieldCheck, ChevronDown, ChevronRight, Award,
  Sparkle, Bell, Search, Command
} from 'lucide-react';

const SIDEBAR_NAV = [
  { label: 'Dashboard', href: '/admin', icon: <LayoutDashboard size={18} /> },
  {
    label: 'Sections',
    icon: <Sparkles size={18} />,
    children: [
      { label: 'Hero Section', href: '/admin/sections/hero' },
      { label: 'About Section', href: '/admin/sections/about' },
      { label: 'Vision Section', href: '/admin/sections/vision' },
      { label: 'Mission Section', href: '/admin/sections/mission' },
    ]
  },
  { label: 'Founders', href: '/admin/founders', icon: <Users size={18} /> },
  { label: 'Projects', href: '/admin/projects', icon: <Briefcase size={18} /> },
  { label: 'Services', href: '/admin/services', icon: <Layers size={18} /> },
  { label: 'Gallery', href: '/admin/gallery', icon: <ImageIcon size={18} /> },
  { label: 'Certificates', href: '/admin/certificates', icon: <Award size={18} /> },
  { label: 'Inquiries', href: '/admin/inquiries', icon: <Inbox size={18} /> },
  { label: 'Site Settings', href: '/admin/settings', icon: <Settings size={18} /> },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sectionsOpen, setSectionsOpen] = useState(pathname.startsWith('/admin/sections'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAuthPage = ['/admin/login', '/admin/forgot-password', '/admin/reset-password'].some(p => pathname.startsWith(p));

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
        <Toaster position="top-right" theme="dark" richColors expand closeButton />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', background: '#0d0d0d', padding: '2.5rem 3rem', borderRadius: '16px', border: '1px solid #1f1f1f', boxShadow: '0 20px 40px rgba(0,0,0,0.8)' }}>
          <div className="w-9 h-9 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontWeight: 600, fontSize: '0.95rem', margin: 0, color: '#fff' }}>ChargEase CMS Panel</p>
            <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.2rem', margin: 0 }}>Authenticating session...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isAuthPage) {
    return (
      <div style={{ minHeight: '100vh', background: '#050505', color: 'var(--white)' }}>
        <Toaster position="top-right" theme="dark" richColors expand closeButton />
        {children}
      </div>
    );
  }

  if (!user) {
    return null; // AuthContext will redirect
  }

  const userInitial = user.name ? user.name.charAt(0).toUpperCase() : 'A';

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', background: '#050505', color: '#fff', fontFamily: 'var(--font-inter)' }}>
      {/* Global Toast Provider */}
      <Toaster
        position="top-right"
        theme="dark"
        richColors
        expand
        closeButton
        toastOptions={{
          style: {
            background: '#121212',
            border: '1px solid #282828',
            color: '#fff',
            borderRadius: '12px',
            fontFamily: 'inherit',
          },
        }}
      />

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)', zIndex: 90 }}
        />
      )}

      {/* Fixed Sidebar */}
      <aside
        style={{
          width: sidebarOpen ? '260px' : '76px',
          background: '#09090b',
          borderRight: '1px solid #1c1c21',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.25s cubic-bezier(0.16, 1, 0.3, 1), left 0.25s ease',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          height: '100vh',
          zIndex: 100,
          flexShrink: 0,
          overflow: 'hidden',
          boxShadow: '4px 0 24px rgba(0,0,0,0.4)',
        }}
        className={`admin-sidebar ${mobileOpen ? 'mobile-open' : ''}`}
      >
        {/* Brand Header */}
        <div style={{ padding: '1.25rem 1.1rem', borderBottom: '1px solid #1c1c21', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          {sidebarOpen ? (
            <Link href="/admin" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 15px rgba(56, 189, 248, 0.4)' }}>
                <Sparkle size={18} color="#fff" />
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, color: '#fff', lineHeight: 1.1 }}>
                  Charg<span style={{ color: '#38bdf8' }}>Ease</span>
                </div>
                <span style={{ fontSize: '0.625rem', color: '#888', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Enterprise Admin
                </span>
              </div>
            </Link>
          ) : (
            <Link href="/admin" style={{ margin: '0 auto', textDecoration: 'none' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 15px rgba(56, 189, 248, 0.4)' }}>
                <Sparkle size={20} color="#fff" />
              </div>
            </Link>
          )}
        </div>

        {/* Scrollable Navigation Items Container */}
        <nav
          style={{
            padding: '1rem 0.6rem',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem',
            overflowY: 'auto',
            scrollbarWidth: 'thin',
          }}
        >
          {SIDEBAR_NAV.map((item, i) => {
            if (item.children) {
              const isChildActive = item.children.some(c => pathname === c.href);
              return (
                <div key={i}>
                  <button
                    onClick={() => sidebarOpen ? setSectionsOpen(!sectionsOpen) : setSidebarOpen(true)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: sidebarOpen ? 'space-between' : 'center',
                      padding: '0.65rem 0.75rem',
                      borderRadius: 10,
                      background: isChildActive ? 'rgba(56, 189, 248, 0.08)' : 'transparent',
                      color: isChildActive ? '#38bdf8' : '#a1a1aa',
                      border: isChildActive ? '1px solid rgba(56, 189, 248, 0.2)' : '1px solid transparent',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ color: isChildActive ? '#38bdf8' : '#71717a' }}>{item.icon}</span>
                      {sidebarOpen && <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{item.label}</span>}
                    </div>
                    {sidebarOpen && (
                      <span style={{ transition: 'transform 0.2s ease', transform: sectionsOpen ? 'rotate(180deg)' : 'rotate(0deg)', color: '#71717a' }}>
                        <ChevronDown size={14} />
                      </span>
                    )}
                  </button>

                  {sidebarOpen && sectionsOpen && (
                    <div style={{ paddingLeft: '2.25rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.3rem' }}>
                      {item.children.map((child, ci) => {
                        const active = pathname === child.href;
                        return (
                          <Link
                            key={ci}
                            href={child.href}
                            onClick={() => setMobileOpen(false)}
                            style={{
                              padding: '0.5rem 0.75rem',
                              borderRadius: 8,
                              fontSize: '0.8125rem',
                              color: active ? '#38bdf8' : '#a1a1aa',
                              background: active ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
                              borderLeft: active ? '2px solid #38bdf8' : '2px solid transparent',
                              textDecoration: 'none',
                              fontWeight: active ? 600 : 400,
                              transition: 'all 0.15s ease',
                            }}
                          >
                            {child.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            const active = pathname === item.href;
            return (
              <Link
                key={i}
                href={item.href!}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: sidebarOpen ? 'flex-start' : 'center',
                  gap: '0.75rem',
                  padding: '0.65rem 0.75rem',
                  borderRadius: 10,
                  background: active ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
                  color: active ? '#fff' : '#a1a1aa',
                  border: active ? '1px solid rgba(56, 189, 248, 0.25)' : '1px solid transparent',
                  borderLeft: active ? '3px solid #38bdf8' : '1px solid transparent',
                  textDecoration: 'none',
                  fontWeight: active ? 600 : 500,
                  fontSize: '0.875rem',
                  transition: 'all 0.15s ease',
                }}
              >
                <span style={{ color: active ? '#38bdf8' : '#71717a' }}>{item.icon}</span>
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}

          <div style={{ margin: '1rem 0 0.5rem', borderTop: '1px solid #1c1c21' }} />

          {/* View Live Site */}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: sidebarOpen ? 'flex-start' : 'center',
              gap: '0.75rem',
              padding: '0.65rem 0.75rem',
              borderRadius: 10,
              color: '#71717a',
              textDecoration: 'none',
              fontSize: '0.875rem',
              transition: 'all 0.2s ease',
              background: '#121215',
              border: '1px solid #1c1c21',
            }}
          >
            <ExternalLink size={17} color="#38bdf8" />
            {sidebarOpen && <span style={{ color: '#e4e4e7', fontSize: '0.8125rem' }}>View Live Site</span>}
          </a>
        </nav>

        {/* User Footer / Logout */}
        <div style={{ padding: '0.85rem 1rem', borderTop: '1px solid #1c1c21', background: '#070709', display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'space-between' : 'center', gap: '0.5rem', flexShrink: 0 }}>
          {sidebarOpen ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', overflow: 'hidden' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', border: '1px solid #334155', color: '#38bdf8', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {userInitial}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', margin: 0 }}>
                  {user.name}
                </p>
                <p style={{ fontSize: '0.6875rem', color: '#38bdf8', textTransform: 'uppercase', margin: 0, fontWeight: 600, letterSpacing: '0.04em' }}>
                  {user.role}
                </p>
              </div>
            </div>
          ) : (
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', border: '1px solid #334155', color: '#38bdf8', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {userInitial}
            </div>
          )}

          {sidebarOpen && (
            <button
              onClick={logout}
              title="Logout"
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                color: '#f87171',
                padding: '0.5rem',
                borderRadius: 8,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
              }}
            >
              <LogOut size={15} />
            </button>
          )}
        </div>
      </aside>

      {/* Main Container */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          marginLeft: sidebarOpen ? '260px' : '76px',
          height: '100vh',
          overflowY: 'auto',
          transition: 'margin-left 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          background: '#050505',
        }}
        className="admin-main-content"
      >
        {/* Top Header Bar */}
        <header
          style={{
            height: '64px',
            background: 'rgba(9, 9, 11, 0.85)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid #1c1c21',
            padding: '0 1.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 30,
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="desktop-toggle"
              style={{ background: '#121215', border: '1px solid #22222a', color: '#fff', padding: '0.45rem', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Menu size={18} />
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="mobile-toggle"
              style={{ background: '#121215', border: '1px solid #22222a', color: '#fff', padding: '0.45rem', borderRadius: 8, cursor: 'pointer', display: 'none', alignItems: 'center', justifyContent: 'center' }}
            >
              <Menu size={18} />
            </button>

            {/* Breadcrumb / Page Title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#71717a' }}>
              <span style={{ fontWeight: 500 }}>Admin</span>
              <ChevronRight size={14} color="#52525b" />
              <span style={{ color: '#fff', fontWeight: 600, textTransform: 'capitalize' }}>
                {pathname === '/admin' ? 'Dashboard Overview' : pathname.replace('/admin/', '').replace(/\//g, ' / ')}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#0e1726', border: '1px solid #1e293b', color: '#38bdf8', padding: '0.35rem 0.8rem', borderRadius: 20, fontSize: '0.75rem', fontWeight: 600 }}>
              <ShieldCheck size={14} /> Encrypted Session
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main style={{ flex: 1, padding: '2.25rem 1.75rem', background: '#050505' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            {children}
          </div>
        </main>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          .admin-sidebar {
            position: fixed !important;
            left: ${mobileOpen ? '0' : '-280px'};
            width: 260px !important;
            top: 0 !important;
            bottom: 0 !important;
          }
          .admin-main-content {
            margin-left: 0 !important;
          }
          .desktop-toggle { display: none !important; }
          .mobile-toggle { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
