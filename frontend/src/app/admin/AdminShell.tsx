'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard, Sparkles, Users, Briefcase, Layers,
  Image as ImageIcon, Inbox, Settings, LogOut, ExternalLink,
  Menu, X, ShieldCheck, ChevronDown, ChevronRight, Award
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
      <div style={{ minHeight: '100vh', background: 'var(--black)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--white)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <p className="label-sm">Loading Admin Panel...</p>
        </div>
      </div>
    );
  }

  if (isAuthPage) {
    return <div style={{ minHeight: '100vh', background: 'var(--black)', color: 'var(--white)' }}>{children}</div>;
  }

  if (!user) {
    return null; // AuthContext will redirect
  }

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', background: '#0a0a0a', color: 'var(--white)', fontFamily: 'var(--font-inter)' }}>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)', zIndex: 90 }}
        />
      )}

      {/* Fixed Sidebar */}
      <aside
        style={{
          width: sidebarOpen ? '260px' : '72px',
          background: '#0d0d0d',
          borderRight: '1px solid #1a1a1a',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.25s ease, left 0.25s ease',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          height: '100vh',
          zIndex: 100,
          flexShrink: 0,
          overflow: 'hidden',
        }}
        className={`admin-sidebar ${mobileOpen ? 'mobile-open' : ''}`}
      >
        {/* Brand Header */}
        <div style={{ padding: '1.25rem 1rem', borderBottom: '1px solid #1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          {sidebarOpen ? (
            <Link href="/admin" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--white)' }}>
                Charg<span style={{ color: '#888' }}>Ease</span>
              </span>
              <span style={{ background: '#222', color: '#38bdf8', fontSize: '0.65rem', padding: '0.15rem 0.45rem', borderRadius: 4, fontWeight: 700, letterSpacing: '0.05em' }}>
                ADMIN
              </span>
            </Link>
          ) : (
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--white)', margin: '0 auto' }}>
              C<span style={{ color: '#888' }}>E</span>
            </span>
          )}
        </div>

        {/* Scrollable Navigation Items Container */}
        <nav
          style={{
            padding: '1rem 0.5rem',
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
                      borderRadius: 8,
                      background: isChildActive ? '#1a1a1a' : 'transparent',
                      color: isChildActive ? '#fff' : '#aaa',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ color: isChildActive ? '#38bdf8' : '#aaa' }}>{item.icon}</span>
                      {sidebarOpen && <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{item.label}</span>}
                    </div>
                    {sidebarOpen && (
                      <span style={{ transition: 'transform 0.2s ease', transform: sectionsOpen ? 'rotate(180deg)' : 'rotate(0deg)', color: '#666' }}>
                        <ChevronDown size={14} />
                      </span>
                    )}
                  </button>

                  {sidebarOpen && sectionsOpen && (
                    <div style={{ paddingLeft: '2.25rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.25rem' }}>
                      {item.children.map((child, ci) => {
                        const active = pathname === child.href;
                        return (
                          <Link
                            key={ci}
                            href={child.href}
                            onClick={() => setMobileOpen(false)}
                            style={{
                              padding: '0.45rem 0.65rem',
                              borderRadius: 6,
                              fontSize: '0.8125rem',
                              color: active ? '#38bdf8' : '#888',
                              background: active ? 'rgba(56, 189, 248, 0.1)' : 'transparent',
                              borderLeft: active ? '2px solid #38bdf8' : '2px solid transparent',
                              textDecoration: 'none',
                              fontWeight: active ? 600 : 400,
                              transition: 'all 0.2s ease',
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
                  borderRadius: 8,
                  background: active ? '#1f2937' : 'transparent',
                  color: active ? '#fff' : '#aaa',
                  borderLeft: active ? '3px solid #38bdf8' : '3px solid transparent',
                  textDecoration: 'none',
                  fontWeight: active ? 600 : 500,
                  fontSize: '0.875rem',
                  transition: 'all 0.2s ease',
                }}
              >
                <span style={{ color: active ? '#38bdf8' : 'inherit' }}>{item.icon}</span>
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}

          <div style={{ margin: '1rem 0 0.5rem', borderTop: '1px solid #1a1a1a' }} />

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
              borderRadius: 8,
              color: '#888',
              textDecoration: 'none',
              fontSize: '0.875rem',
              transition: 'all 0.2s ease',
            }}
          >
            <ExternalLink size={18} />
            {sidebarOpen && <span>View Live Site</span>}
          </a>
        </nav>

        {/* User Footer / Logout */}
        <div style={{ padding: '1rem', borderTop: '1px solid #1a1a1a', background: '#080808', display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'space-between' : 'center', gap: '0.5rem', flexShrink: 0 }}>
          {sidebarOpen && (
            <div style={{ overflow: 'hidden' }}>
              <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', margin: 0 }}>
                {user.name}
              </p>
              <p style={{ fontSize: '0.7rem', color: '#38bdf8', textTransform: 'uppercase', margin: 0, fontWeight: 600 }}>
                {user.role}
              </p>
            </div>
          )}
          <button
            onClick={logout}
            title="Logout"
            style={{
              background: '#1f1313',
              border: '1px solid #3b1c1c',
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
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          marginLeft: sidebarOpen ? '260px' : '72px',
          height: '100vh',
          overflowY: 'auto',
          transition: 'margin-left 0.25s ease'
        }}
        className="admin-main-content"
      >
        {/* Top Header Bar */}
        <header
          style={{
            height: '64px',
            background: '#0d0d0d',
            borderBottom: '1px solid #1a1a1a',
            padding: '0 1.5rem',
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
              style={{ background: '#1c1c1c', border: '1px solid #2a2a2a', color: '#fff', padding: '0.4rem', borderRadius: 6, cursor: 'pointer', display: 'flex' }}
            >
              <Menu size={18} />
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="mobile-toggle"
              style={{ background: '#1c1c1c', border: '1px solid #2a2a2a', color: '#fff', padding: '0.4rem', borderRadius: 6, cursor: 'pointer', display: 'none' }}
            >
              <Menu size={18} />
            </button>

            {/* Breadcrumb / Page Title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#888' }}>
              <span>Admin</span>
              <ChevronRight size={14} />
              <span style={{ color: '#fff', fontWeight: 600, textTransform: 'capitalize' }}>
                {pathname === '/admin' ? 'Dashboard' : pathname.replace('/admin/', '').replace(/\//g, ' / ')}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#181818', border: '1px solid #282828', padding: '0.35rem 0.75rem', borderRadius: 20, fontSize: '0.75rem', color: '#4ade80' }}>
              <ShieldCheck size={14} /> Secure CMS
            </span>
          </div>
        </header>

        {/* Content Area */}
        <main style={{ flex: 1, padding: '2rem 1.5rem', background: '#0a0a0a' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
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
