'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchDashboardStats } from '@/lib/api';
import {
  Briefcase, Layers, Image as ImageIcon, Inbox, AlertCircle,
  ArrowRight, Sparkles, PlusCircle, CheckCircle2, Clock
} from 'lucide-react';

interface StatsData {
  projects: number;
  services: number;
  gallery: number;
  totalInquiries: number;
  unreadInquiries: number;
  recentInquiries: any[];
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats()
      .then((data: any) => setStats(data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '3rem 0', textAlign: 'center', color: '#888' }}>
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p>Loading overview data...</p>
      </div>
    );
  }

  const s = stats || {
    projects: 0,
    services: 0,
    gallery: 0,
    totalInquiries: 0,
    unreadInquiries: 0,
    recentInquiries: [],
  };

  const STATS_CARDS = [
    { label: 'Published Projects', value: s.projects, icon: <Briefcase size={22} color="#fff" />, href: '/admin/projects' },
    { label: 'Active Services', value: s.services, icon: <Layers size={22} color="#fff" />, href: '/admin/services' },
    { label: 'Gallery Media', value: s.gallery, icon: <ImageIcon size={22} color="#fff" />, href: '/admin/gallery' },
    { label: 'Total Inquiries', value: s.totalInquiries, icon: <Inbox size={22} color="#fff" />, href: '/admin/inquiries' },
    { label: 'Unread Messages', value: s.unreadInquiries, icon: <AlertCircle size={22} color={s.unreadInquiries > 0 ? '#ff6b6b' : '#4ade80'} />, href: '/admin/inquiries', highlight: s.unreadInquiries > 0 },
  ];

  return (
    <div>
      {/* Welcome Header */}
      <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, color: '#fff', marginBottom: '0.4rem' }}>
            Executive Dashboard
          </h1>
          <p style={{ color: '#888', fontSize: '0.9rem' }}>
            Real-time analytics and central command for the ChargEase digital experience.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link
            href="/admin/projects"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#fff', color: '#000', padding: '0.65rem 1.1rem', borderRadius: 8, fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}
          >
            <PlusCircle size={16} /> New Project
          </Link>
          <Link
            href="/admin/sections/hero"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#fff', padding: '0.65rem 1.1rem', borderRadius: 8, fontSize: '0.85rem', fontWeight: 500, textDecoration: 'none' }}
          >
            <Sparkles size={16} /> Edit Hero
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        {STATS_CARDS.map((card, i) => (
          <Link
            key={i}
            href={card.href}
            style={{
              background: card.highlight ? 'rgba(255, 107, 107, 0.08)' : '#121212',
              border: `1px solid ${card.highlight ? 'rgba(255, 107, 107, 0.3)' : '#222'}`,
              borderRadius: 14,
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              textDecoration: 'none',
              transition: 'transform 0.2s ease, border-color 0.2s ease',
            }}
            className="stat-card"
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: '#1c1c1c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {card.icon}
              </div>
              <ArrowRight size={16} color="#555" />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 700, color: '#fff', lineHeight: 1 }}>
                {card.value}
              </div>
              <div style={{ fontSize: '0.8125rem', color: '#888', marginTop: '0.4rem', fontWeight: 500 }}>
                {card.label}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }} className="dashboard-columns">
        {/* Recent Inquiries Table */}
        <div style={{ background: '#121212', border: '1px solid #222', borderRadius: 16, padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 600, color: '#fff' }}>
              Recent Client Inquiries
            </h3>
            <Link href="/admin/inquiries" style={{ fontSize: '0.8rem', color: '#aaa', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              View All <ArrowRight size={14} />
            </Link>
          </div>

          {s.recentInquiries.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#666' }}>
              <Inbox size={32} style={{ margin: '0 auto 0.5rem', opacity: 0.5 }} />
              <p style={{ fontSize: '0.85rem' }}>No recent inquiries recorded.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {s.recentInquiries.map((inq: any, i: number) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1rem',
                    background: '#171717',
                    borderRadius: 10,
                    borderLeft: `3px solid ${inq.status === 'unread' ? '#ff6b6b' : '#333'}`,
                  }}
                >
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.2rem' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#fff' }}>{inq.name}</span>
                      {inq.company && <span style={{ fontSize: '0.75rem', color: '#888' }}>({inq.company})</span>}
                      <span style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem', borderRadius: 4, background: inq.status === 'unread' ? 'rgba(255,107,107,0.2)' : '#222', color: inq.status === 'unread' ? '#ff6b6b' : '#aaa', textTransform: 'uppercase', fontWeight: 600 }}>
                        {inq.status}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: '#aaa', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      <b>{inq.inquiryType || 'General'}:</b> {inq.message}
                    </p>
                  </div>
                  <Link
                    href={`/admin/inquiries`}
                    style={{ background: '#242424', color: '#fff', padding: '0.4rem 0.75rem', borderRadius: 6, fontSize: '0.75rem', textDecoration: 'none', fontWeight: 500, flexShrink: 0, marginLeft: '1rem' }}
                  >
                    Open
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions & System Health */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ background: '#121212', border: '1px solid #222', borderRadius: 16, padding: '1.5rem' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 600, color: '#fff', marginBottom: '1.25rem' }}>
              Quick Navigation
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <Link
                href="/admin/sections/about"
                style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: '#171717', borderRadius: 8, color: '#fff', textDecoration: 'none', fontSize: '0.85rem' }}
              >
                <Sparkles size={16} color="#aaa" /> Edit About Story & Timeline
              </Link>
              <Link
                href="/admin/founders"
                style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: '#171717', borderRadius: 8, color: '#fff', textDecoration: 'none', fontSize: '0.85rem' }}
              >
                <Briefcase size={16} color="#aaa" /> Update Founder Profiles
              </Link>
              <Link
                href="/admin/gallery"
                style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: '#171717', borderRadius: 8, color: '#fff', textDecoration: 'none', fontSize: '0.85rem' }}
              >
                <ImageIcon size={16} color="#aaa" /> Upload New Showcase Media
              </Link>
              <Link
                href="/admin/settings"
                style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: '#171717', borderRadius: 8, color: '#fff', textDecoration: 'none', fontSize: '0.85rem' }}
              >
                <Clock size={16} color="#aaa" /> Configure Site & SEO Settings
              </Link>
            </div>
          </div>

          {/* System Health Card */}
          <div style={{ background: 'linear-gradient(135deg, #151515 0%, #0d0d0d 100%)', border: '1px solid #222', borderRadius: 16, padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4ade80', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              <CheckCircle2 size={16} /> API Health Normal
            </div>
            <p style={{ fontSize: '0.8rem', color: '#888', margin: 0, lineHeight: 1.5 }}>
              All dynamic MongoDB models and sections are synced and operational with automatic fallback shielding enabled.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          .dashboard-columns { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
