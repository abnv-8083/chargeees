'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchDashboardStats } from '@/lib/api';
import { showToast } from '@/lib/toast';
import {
  Briefcase, Layers, Image as ImageIcon, Inbox, AlertCircle,
  ArrowRight, Sparkles, PlusCircle, CheckCircle2, Clock, RefreshCw,
  TrendingUp, Shield, Activity, Users, Award
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
  const [refreshing, setRefreshing] = useState(false);

  const loadStats = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const data = await fetchDashboardStats();
      setStats(data);
      if (isManual) {
        showToast.success('Dashboard synced successfully!');
      }
    } catch (err: any) {
      setStats(null);
      if (isManual) {
        showToast.error('Failed to sync dashboard data.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (loading) {
    return (
      <div style={{ padding: '4rem 0', textAlign: 'center', color: '#71717a' }}>
        <div className="w-9 h-9 border-2 border-sky-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>Fetching live overview analytics...</p>
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
    {
      label: 'Published Projects',
      value: s.projects,
      icon: <Briefcase size={22} color="#38bdf8" />,
      bg: 'rgba(56, 189, 248, 0.08)',
      borderColor: 'rgba(56, 189, 248, 0.25)',
      href: '/admin/projects',
      sub: 'Portfolio showcases',
    },
    {
      label: 'Active Services',
      value: s.services,
      icon: <Layers size={22} color="#a855f7" />,
      bg: 'rgba(168, 85, 247, 0.08)',
      borderColor: 'rgba(168, 85, 247, 0.25)',
      href: '/admin/services',
      sub: 'Core offerings',
    },
    {
      label: 'Gallery Media',
      value: s.gallery,
      icon: <ImageIcon size={22} color="#34d399" />,
      bg: 'rgba(52, 211, 153, 0.08)',
      borderColor: 'rgba(52, 211, 153, 0.25)',
      href: '/admin/gallery',
      sub: 'High-res assets',
    },
    {
      label: 'Total Inquiries',
      value: s.totalInquiries,
      icon: <Inbox size={22} color="#fbbf24" />,
      bg: 'rgba(251, 191, 36, 0.08)',
      borderColor: 'rgba(251, 191, 36, 0.25)',
      href: '/admin/inquiries',
      sub: 'Client messages',
    },
    {
      label: 'Unread Messages',
      value: s.unreadInquiries,
      icon: <AlertCircle size={22} color={s.unreadInquiries > 0 ? '#f87171' : '#4ade80'} />,
      bg: s.unreadInquiries > 0 ? 'rgba(248, 113, 113, 0.12)' : 'rgba(74, 222, 128, 0.08)',
      borderColor: s.unreadInquiries > 0 ? 'rgba(248, 113, 113, 0.35)' : 'rgba(74, 222, 128, 0.25)',
      href: '/admin/inquiries',
      highlight: s.unreadInquiries > 0,
      sub: s.unreadInquiries > 0 ? 'Action required' : 'All clear',
    },
  ];

  return (
    <div>
      {/* Welcome Header */}
      <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.25rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#38bdf8', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
            <Sparkles size={16} /> Executive Command Center
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', fontWeight: 700, color: '#fff', marginBottom: '0.4rem', letterSpacing: '-0.02em' }}>
            {getGreeting()}, Administrator
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '0.925rem', maxWidth: '600px', margin: 0 }}>
            Here is your live operational overview for ChargEase digital ecosystem.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button
            onClick={() => loadStats(true)}
            disabled={refreshing}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: '#121215',
              border: '1px solid #22222a',
              color: '#d4d4d8',
              padding: '0.65rem 1rem',
              borderRadius: 10,
              fontSize: '0.85rem',
              fontWeight: 500,
              cursor: refreshing ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} /> Sync Stats
          </button>

          <Link
            href="/admin/projects"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
              color: '#fff',
              padding: '0.65rem 1.25rem',
              borderRadius: 10,
              fontSize: '0.85rem',
              fontWeight: 600,
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(56, 189, 248, 0.35)',
              transition: 'all 0.2s ease',
            }}
          >
            <PlusCircle size={16} /> New Project
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        {STATS_CARDS.map((card, i) => (
          <Link
            key={i}
            href={card.href}
            style={{
              background: card.bg,
              border: `1px solid ${card.borderColor}`,
              borderRadius: 16,
              padding: '1.4rem 1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              textDecoration: 'none',
              backdropFilter: 'blur(8px)',
              transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
            }}
            className="stat-card"
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: '#09090b', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {card.icon}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#a1a1aa', fontSize: '0.75rem' }}>
                <span>View</span>
                <ArrowRight size={14} />
              </div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', fontWeight: 700, color: '#fff', lineHeight: 1 }}>
                {card.value}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#f4f4f5', marginTop: '0.4rem', fontWeight: 600 }}>
                {card.label}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.15rem' }}>
                {card.sub}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }} className="dashboard-columns">
        {/* Recent Inquiries Table */}
        <div style={{ background: '#09090b', border: '1px solid #1c1c21', borderRadius: 18, padding: '1.6rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 600, color: '#fff', margin: 0 }}>
                Recent Client Inquiries
              </h3>
              <p style={{ fontSize: '0.775rem', color: '#71717a', margin: '0.2rem 0 0 0' }}>Latest incoming messages from lead forms</p>
            </div>
            <Link href="/admin/inquiries" style={{ fontSize: '0.8rem', color: '#38bdf8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 500 }}>
              Inbox Portal <ArrowRight size={14} />
            </Link>
          </div>

          {s.recentInquiries.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: '#71717a', background: '#0e0e11', borderRadius: 12, border: '1px dashed #22222a' }}>
              <Inbox size={36} style={{ margin: '0 auto 0.6rem', opacity: 0.5, color: '#a1a1aa' }} />
              <p style={{ fontSize: '0.875rem', margin: 0, fontWeight: 500 }}>No inquiries received yet.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {s.recentInquiries.map((inq: any, i: number) => {
                const isUnread = inq.status === 'unread';
                return (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '1rem 1.1rem',
                      background: '#121215',
                      borderRadius: 12,
                      border: `1px solid ${isUnread ? 'rgba(248, 113, 113, 0.3)' : '#1c1c21'}`,
                      borderLeft: `4px solid ${isUnread ? '#f87171' : inq.status === 'replied' ? '#34d399' : '#38bdf8'}`,
                    }}
                  >
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#fff' }}>{inq.name}</span>
                        {inq.company && <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>• {inq.company}</span>}
                        <span
                          style={{
                            fontSize: '0.65rem',
                            padding: '0.15rem 0.5rem',
                            borderRadius: 6,
                            background: isUnread ? 'rgba(248, 113, 113, 0.15)' : inq.status === 'replied' ? 'rgba(52, 211, 153, 0.15)' : '#1f1f24',
                            color: isUnread ? '#f87171' : inq.status === 'replied' ? '#34d399' : '#a1a1aa',
                            textTransform: 'uppercase',
                            fontWeight: 700,
                            letterSpacing: '0.04em',
                          }}
                        >
                          {inq.status}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.8125rem', color: '#a1a1aa', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        <strong style={{ color: '#d4d4d8' }}>{inq.inquiryType || 'General'}:</strong> {inq.message}
                      </p>
                    </div>
                    <Link
                      href={`/admin/inquiries`}
                      style={{
                        background: '#1c1c21',
                        border: '1px solid #282830',
                        color: '#fff',
                        padding: '0.45rem 0.85rem',
                        borderRadius: 8,
                        fontSize: '0.775rem',
                        textDecoration: 'none',
                        fontWeight: 500,
                        flexShrink: 0,
                        marginLeft: '1rem',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      Review
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Actions & System Health */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ background: '#09090b', border: '1px solid #1c1c21', borderRadius: 18, padding: '1.5rem' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 600, color: '#fff', marginBottom: '1.1rem' }}>
              Quick Navigation
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <Link
                href="/admin/sections/hero"
                style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.8rem 0.9rem', background: '#121215', borderRadius: 10, border: '1px solid #1c1c21', color: '#e4e4e7', textDecoration: 'none', fontSize: '0.85rem', transition: 'all 0.2s ease' }}
              >
                <Sparkles size={16} color="#38bdf8" /> Edit Hero Headline & CTA
              </Link>
              <Link
                href="/admin/founders"
                style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.8rem 0.9rem', background: '#121215', borderRadius: 10, border: '1px solid #1c1c21', color: '#e4e4e7', textDecoration: 'none', fontSize: '0.85rem', transition: 'all 0.2s ease' }}
              >
                <Users size={16} color="#a855f7" /> Manage Executive Team
              </Link>
              <Link
                href="/admin/certificates"
                style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.8rem 0.9rem', background: '#121215', borderRadius: 10, border: '1px solid #1c1c21', color: '#e4e4e7', textDecoration: 'none', fontSize: '0.85rem', transition: 'all 0.2s ease' }}
              >
                <Award size={16} color="#fbbf24" /> Issue Verified Certificate
              </Link>
              <Link
                href="/admin/settings"
                style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.8rem 0.9rem', background: '#121215', borderRadius: 10, border: '1px solid #1c1c21', color: '#e4e4e7', textDecoration: 'none', fontSize: '0.85rem', transition: 'all 0.2s ease' }}
              >
                <Clock size={16} color="#34d399" /> Configure Site Settings & SEO
              </Link>
            </div>
          </div>

          {/* System Health Card */}
          <div style={{ background: 'linear-gradient(135deg, #09090b 0%, #0e131f 100%)', border: '1px solid #1e293b', borderRadius: 18, padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#34d399', fontSize: '0.875rem', fontWeight: 600 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#34d399', boxShadow: '0 0 10px #34d399', display: 'inline-block' }} />
                API Core Operational
              </div>
              <Shield size={16} color="#38bdf8" />
            </div>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
              MongoDB sync state active. Automatic fallback shielding enabled for static content sections.
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
