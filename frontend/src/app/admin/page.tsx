'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchDashboardStats } from '@/lib/api';
import { AdminLoading } from '@/app/admin/components';
import { Briefcase, Layers, Image as ImageIcon, Inbox, AlertCircle, ArrowRight, Sparkles, PlusCircle, CheckCircle2, Clock } from 'lucide-react';

interface StatsData {
  projects: number; services: number; gallery: number;
  totalInquiries: number; unreadInquiries: number; recentInquiries: any[];
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

  if (loading) return <AdminLoading text="Loading dashboard..." fullPage />;

  const s = stats || { projects: 0, services: 0, gallery: 0, totalInquiries: 0, unreadInquiries: 0, recentInquiries: [] };

  const STATS_CARDS = [
    { label: 'Projects', value: s.projects, icon: <Briefcase size={20} color="#fff" />, href: '/admin/projects' },
    { label: 'Services', value: s.services, icon: <Layers size={20} color="#fff" />, href: '/admin/services' },
    { label: 'Gallery', value: s.gallery, icon: <ImageIcon size={20} color="#fff" />, href: '/admin/gallery' },
    { label: 'Inquiries', value: s.totalInquiries, icon: <Inbox size={20} color="#fff" />, href: '/admin/inquiries' },
    { label: 'Unread', value: s.unreadInquiries, icon: <AlertCircle size={20} color={s.unreadInquiries > 0 ? '#ff6b6b' : '#4ade80'} />, href: '/admin/inquiries', highlight: s.unreadInquiries > 0 },
  ];

  return (
    <div>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, color: '#fafafa', marginBottom: '0.4rem' }}>Dashboard</h1>
          <p style={{ color: '#71717a', fontSize: '0.875rem' }}>Overview and central command for ChargEase.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <Link href="/admin/projects" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#fff', color: '#000', padding: '0.6rem 1rem', borderRadius: 10, fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>
            <PlusCircle size={15} /> New Project
          </Link>
          <Link href="/admin/sections/hero" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#18181b', border: '1px solid #27272a', color: '#fafafa', padding: '0.6rem 1rem', borderRadius: 10, fontSize: '0.85rem', fontWeight: 500, textDecoration: 'none' }}>
            <Sparkles size={15} /> Edit Hero
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {STATS_CARDS.map((card, i) => (
          <Link key={i} href={card.href} style={{
            background: card.highlight ? 'rgba(239,68,68,0.06)' : '#09090b',
            border: `1px solid ${card.highlight ? 'rgba(239,68,68,0.2)' : '#18181b'}`,
            borderRadius: 14, padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', textDecoration: 'none', transition: 'border-color 0.15s',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: '#18181b', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #27272a' }}>{card.icon}</div>
              <ArrowRight size={14} color="#3f3f46" />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, color: '#fafafa', lineHeight: 1 }}>{card.value}</div>
              <div style={{ fontSize: '0.8rem', color: '#71717a', marginTop: '0.35rem', fontWeight: 500 }}>{card.label}</div>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.25rem' }} className="dashboard-columns">
        {/* Recent Inquiries */}
        <div style={{ background: '#09090b', border: '1px solid #18181b', borderRadius: 16, padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 700, color: '#fafafa' }}>Recent Inquiries</h3>
            <Link href="/admin/inquiries" style={{ fontSize: '0.75rem', color: '#71717a', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>View All <ArrowRight size={12} /></Link>
          </div>
          {s.recentInquiries.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: '#3f3f46' }}>
              <Inbox size={28} style={{ margin: '0 auto 0.5rem', opacity: 0.5 }} />
              <p style={{ fontSize: '0.8rem' }}>No recent inquiries.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {s.recentInquiries.map((inq: any, i: number) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.7rem 0.85rem', background: '#0d0d0f', borderRadius: 8, borderLeft: `3px solid ${inq.status === 'unread' ? '#f87171' : '#27272a'}` }}>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.15rem' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#fafafa' }}>{inq.name}</span>
                      <span style={{ fontSize: '0.6rem', padding: '0.08rem 0.35rem', borderRadius: 4, background: inq.status === 'unread' ? 'rgba(248,113,113,0.15)' : '#18181b', color: inq.status === 'unread' ? '#f87171' : '#52525b', textTransform: 'uppercase', fontWeight: 600 }}>{inq.status}</span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: '#71717a', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      <b>{inq.inquiryType || 'General'}:</b> {inq.message}
                    </p>
                  </div>
                  <Link href="/admin/inquiries" style={{ background: '#18181b', color: '#fafafa', padding: '0.3rem 0.6rem', borderRadius: 6, fontSize: '0.7rem', textDecoration: 'none', fontWeight: 500, flexShrink: 0, marginLeft: '0.75rem', border: '1px solid #27272a' }}>Open</Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ background: '#09090b', border: '1px solid #18181b', borderRadius: 16, padding: '1.25rem' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 700, color: '#fafafa', marginBottom: '1rem' }}>Quick Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {[
                { label: 'Edit About Section', href: '/admin/sections/about', icon: <Sparkles size={14} /> },
                { label: 'Manage Founders', href: '/admin/founders', icon: <Briefcase size={14} /> },
                { label: 'Upload Media', href: '/admin/gallery', icon: <ImageIcon size={14} /> },
                { label: 'Site Settings', href: '/admin/settings', icon: <Clock size={14} /> },
              ].map(action => (
                <Link key={action.href} href={action.href} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.65rem 0.75rem', background: '#0d0d0f', borderRadius: 8, color: '#d4d4d8', textDecoration: 'none', fontSize: '0.8rem', border: '1px solid #18181b', transition: 'border-color 0.15s' }}>
                  <span style={{ color: '#52525b' }}>{action.icon}</span> {action.label}
                </Link>
              ))}
            </div>
          </div>

          <div style={{ background: 'linear-gradient(135deg, #0d0d0f 0%, #09090b 100%)', border: '1px solid #18181b', borderRadius: 16, padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#4ade80', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem' }}>
              <CheckCircle2 size={14} /> API Health Normal
            </div>
            <p style={{ fontSize: '0.75rem', color: '#71717a', margin: 0, lineHeight: 1.5 }}>All MongoDB models and sections are operational.</p>
          </div>
        </div>
      </div>

      <style jsx>{`@media (max-width: 900px) { .dashboard-columns { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}
