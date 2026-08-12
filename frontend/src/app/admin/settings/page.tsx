'use client';
import React, { useEffect, useState } from 'react';
import { fetchSettings, updateSettingsAdmin } from '@/lib/api';
import type { SiteSettings } from '@/lib/types';
import { showToast } from '@/lib/toast';
import {
  Save, CheckCircle2, AlertCircle, Settings, Globe, MapPin, Share2,
  Search, Menu as MenuIcon, LayoutTemplate, Plus, Trash2, ArrowUp,
  ArrowDown, Sparkles
} from 'lucide-react';

export default function SettingsManagerPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'contact' | 'social' | 'seo' | 'navigation' | 'footer'>('general');
  const [data, setData] = useState<Partial<SiteSettings>>({
    companyName: 'ChargEase',
    companyTagline: 'Powering the Future of Business',
    companyDescription: 'Leading corporate enterprise solutions provider.',
    contact: {
      email: 'info@chargeease.com',
      phone: '+1 (555) 000-0000',
      address: '100 Innovation Drive, Suite 500\nNew York, NY 10001',
      officeHours: 'Monday – Friday\n9:00 AM – 6:00 PM EST',
      googleMapsEmbed: '',
    },
    social: { linkedin: '#', twitter: '#', instagram: '#', facebook: '#', youtube: '#' },
    seo: { metaTitle: 'ChargEase — Corporate Solutions', metaDescription: 'Empowering global enterprises through innovation.', ogImage: '', twitterHandle: '@ChargEase' },
    navigation: [
      { label: 'About', href: '#about', order: 1 },
      { label: 'Vision', href: '#vision', order: 2 },
      { label: 'Mission', href: '#mission', order: 3 },
      { label: 'Leadership', href: '#founder', order: 4 },
      { label: 'Projects', href: '#projects', order: 5 },
      { label: 'Services', href: '#services', order: 6 },
      { label: 'Gallery', href: '#gallery', order: 7 },
      { label: 'Contact', href: '#contact', order: 8 },
    ],
    footer: {
      copyright: '© 2026 ChargEase Inc. All rights reserved.',
      privacyPolicyUrl: '/privacy',
      termsUrl: '/terms',
      quickLinks: [
        { label: 'Corporate Overview', href: '#about' },
        { label: 'Executive Leadership', href: '#founder' },
      ],
    },
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings()
      .then((res: any) => { if (res && Object.keys(res).length > 0) setData(res); })
      .catch(() => showToast.error('Failed to fetch site settings.'))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = new FormData();
      payload.append('companyName', data.companyName || '');
      payload.append('companyTagline', data.companyTagline || '');
      payload.append('companyDescription', data.companyDescription || '');
      payload.append('contact', JSON.stringify(data.contact));
      payload.append('social', JSON.stringify(data.social));
      payload.append('seo', JSON.stringify(data.seo));
      payload.append('navigation', JSON.stringify(data.navigation));
      payload.append('footer', JSON.stringify(data.footer));

      if (logoFile) payload.append('logo', logoFile);
      if (faviconFile) payload.append('favicon', faviconFile);

      await updateSettingsAdmin(payload);
      showToast.success('Site configuration saved successfully!');
    } catch (err: any) {
      showToast.error(err.message || 'Failed to update site settings.');
    } finally {
      setSaving(false);
    }
  };

  const addNavItem = () => {
    const nav = [...(data.navigation || [])];
    nav.push({ label: 'New Link', href: '#section', order: nav.length + 1 });
    setData({ ...data, navigation: nav });
  };

  const removeNavItem = (index: number) => {
    const nav = [...(data.navigation || [])];
    nav.splice(index, 1);
    setData({ ...data, navigation: nav });
  };

  const moveNavItem = (index: number, direction: 'up' | 'down') => {
    const nav = [...(data.navigation || [])];
    if (direction === 'up' && index > 0) {
      const temp = nav[index];
      nav[index] = nav[index - 1];
      nav[index - 1] = temp;
    } else if (direction === 'down' && index < nav.length - 1) {
      const temp = nav[index];
      nav[index] = nav[index + 1];
      nav[index + 1] = temp;
    }
    nav.forEach((it, i) => { it.order = i + 1; });
    setData({ ...data, navigation: nav });
  };

  const TABS = [
    { key: 'general', label: 'General Brand', icon: <Settings size={15} /> },
    { key: 'contact', label: 'Contact & Map', icon: <MapPin size={15} /> },
    { key: 'social', label: 'Social Channels', icon: <Share2 size={15} /> },
    { key: 'seo', label: 'SEO Metadata', icon: <Search size={15} /> },
    { key: 'navigation', label: 'Navigation Menu', icon: <MenuIcon size={15} /> },
    { key: 'footer', label: 'Footer Links', icon: <LayoutTemplate size={15} /> },
  ];

  if (loading) {
    return (
      <div style={{ padding: '4rem 0', textAlign: 'center', color: '#71717a' }}>
        <div className="w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p style={{ fontSize: '0.875rem' }}>Loading site configuration settings...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.25rem', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#38bdf8', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>
            <Settings size={16} /> Global Configuration
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>
            Site & Portal Settings
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Manage brand identity, contact endpoints, social links, SEO tags, and navigation hierarchy.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          style={{
            background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
            color: '#fff',
            border: 'none',
            padding: '0.7rem 1.4rem',
            borderRadius: 10,
            fontSize: '0.875rem',
            fontWeight: 600,
            cursor: saving ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 4px 14px rgba(56, 189, 248, 0.35)',
            transition: 'all 0.2s ease',
          }}
        >
          <Save size={16} /> {saving ? 'Saving Changes...' : 'Save Configuration'}
        </button>
      </div>

      {/* Tabs Navigation */}
      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', borderBottom: '1px solid #1c1c21', paddingBottom: '0.75rem', marginBottom: '1.75rem' }}>
        {TABS.map(t => {
          const active = activeTab === t.key;
          return (
            <button
              type="button"
              key={t.key}
              onClick={() => setActiveTab(t.key as any)}
              style={{
                background: active ? 'rgba(56, 189, 248, 0.12)' : '#09090b',
                color: active ? '#38bdf8' : '#a1a1aa',
                border: active ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid #1c1c21',
                padding: '0.55rem 1rem',
                borderRadius: 10,
                fontSize: '0.825rem',
                fontWeight: active ? 600 : 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                transition: 'all 0.15s ease',
              }}
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div style={{ background: '#09090b', border: '1px solid #1c1c21', borderRadius: 18, padding: '2rem' }}>
        {/* General Brand Tab */}
        {activeTab === 'general' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '680px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#d4d4d8', marginBottom: '0.4rem' }}>Company Name</label>
              <input
                type="text"
                value={data.companyName || ''}
                onChange={e => setData({ ...data, companyName: e.target.value })}
                style={{ width: '100%', background: '#121215', border: '1px solid #22222a', borderRadius: 10, padding: '0.65rem 0.9rem', color: '#fff', fontSize: '0.875rem', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#d4d4d8', marginBottom: '0.4rem' }}>Tagline / Slogan</label>
              <input
                type="text"
                value={data.companyTagline || ''}
                onChange={e => setData({ ...data, companyTagline: e.target.value })}
                style={{ width: '100%', background: '#121215', border: '1px solid #22222a', borderRadius: 10, padding: '0.65rem 0.9rem', color: '#fff', fontSize: '0.875rem', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#d4d4d8', marginBottom: '0.4rem' }}>Corporate Summary</label>
              <textarea
                rows={3}
                value={data.companyDescription || ''}
                onChange={e => setData({ ...data, companyDescription: e.target.value })}
                style={{ width: '100%', background: '#121215', border: '1px solid #22222a', borderRadius: 10, padding: '0.65rem 0.9rem', color: '#fff', fontSize: '0.875rem', outline: 'none', resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#d4d4d8', marginBottom: '0.4rem' }}>Brand Logo Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => setLogoFile(e.target.files?.[0] || null)}
                  style={{ width: '100%', background: '#121215', border: '1px solid #22222a', borderRadius: 10, padding: '0.5rem', color: '#a1a1aa', fontSize: '0.8rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#d4d4d8', marginBottom: '0.4rem' }}>Favicon Icon (.ico / .png)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => setFaviconFile(e.target.files?.[0] || null)}
                  style={{ width: '100%', background: '#121215', border: '1px solid #22222a', borderRadius: 10, padding: '0.5rem', color: '#a1a1aa', fontSize: '0.8rem' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Contact Tab */}
        {activeTab === 'contact' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '680px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#d4d4d8', marginBottom: '0.4rem' }}>Primary Email</label>
                <input
                  type="email"
                  value={data.contact?.email || ''}
                  onChange={e => setData({ ...data, contact: { ...data.contact!, email: e.target.value } })}
                  style={{ width: '100%', background: '#121215', border: '1px solid #22222a', borderRadius: 10, padding: '0.65rem 0.9rem', color: '#fff', fontSize: '0.875rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#d4d4d8', marginBottom: '0.4rem' }}>Phone Number</label>
                <input
                  type="text"
                  value={data.contact?.phone || ''}
                  onChange={e => setData({ ...data, contact: { ...data.contact!, phone: e.target.value } })}
                  style={{ width: '100%', background: '#121215', border: '1px solid #22222a', borderRadius: 10, padding: '0.65rem 0.9rem', color: '#fff', fontSize: '0.875rem', outline: 'none' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#d4d4d8', marginBottom: '0.4rem' }}>Headquarters Address</label>
              <textarea
                rows={3}
                value={data.contact?.address || ''}
                onChange={e => setData({ ...data, contact: { ...data.contact!, address: e.target.value } })}
                style={{ width: '100%', background: '#121215', border: '1px solid #22222a', borderRadius: 10, padding: '0.65rem 0.9rem', color: '#fff', fontSize: '0.875rem', outline: 'none', resize: 'vertical' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#d4d4d8', marginBottom: '0.4rem' }}>Google Maps Embed iframe Source URL</label>
              <input
                type="text"
                value={data.contact?.googleMapsEmbed || ''}
                onChange={e => setData({ ...data, contact: { ...data.contact!, googleMapsEmbed: e.target.value } })}
                placeholder="https://www.google.com/maps/embed?pb=..."
                style={{ width: '100%', background: '#121215', border: '1px solid #22222a', borderRadius: 10, padding: '0.65rem 0.9rem', color: '#fff', fontSize: '0.85rem', outline: 'none' }}
              />
            </div>
          </div>
        )}

        {/* Social Channels */}
        {activeTab === 'social' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '680px' }}>
            {['linkedin', 'twitter', 'instagram', 'facebook', 'youtube'].map(key => (
              <div key={key}>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#d4d4d8', marginBottom: '0.4rem', textTransform: 'capitalize' }}>
                  {key} Page URL
                </label>
                <input
                  type="text"
                  value={(data.social as any)?.[key] || ''}
                  onChange={e => setData({ ...data, social: { ...data.social, [key]: e.target.value } })}
                  placeholder={`https://${key}.com/...`}
                  style={{ width: '100%', background: '#121215', border: '1px solid #22222a', borderRadius: 10, padding: '0.65rem 0.9rem', color: '#fff', fontSize: '0.875rem', outline: 'none' }}
                />
              </div>
            ))}
          </div>
        )}

        {/* SEO Metadata */}
        {activeTab === 'seo' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '680px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#d4d4d8', marginBottom: '0.4rem' }}>Default Meta Title</label>
              <input
                type="text"
                value={data.seo?.metaTitle || ''}
                onChange={e => setData({ ...data, seo: { ...data.seo!, metaTitle: e.target.value } })}
                style={{ width: '100%', background: '#121215', border: '1px solid #22222a', borderRadius: 10, padding: '0.65rem 0.9rem', color: '#fff', fontSize: '0.875rem', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#d4d4d8', marginBottom: '0.4rem' }}>Default Meta Description</label>
              <textarea
                rows={3}
                value={data.seo?.metaDescription || ''}
                onChange={e => setData({ ...data, seo: { ...data.seo!, metaDescription: e.target.value } })}
                style={{ width: '100%', background: '#121215', border: '1px solid #22222a', borderRadius: 10, padding: '0.65rem 0.9rem', color: '#fff', fontSize: '0.875rem', outline: 'none', resize: 'vertical' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#d4d4d8', marginBottom: '0.4rem' }}>Twitter / X Handle</label>
              <input
                type="text"
                value={data.seo?.twitterHandle || ''}
                onChange={e => setData({ ...data, seo: { ...data.seo!, twitterHandle: e.target.value } })}
                placeholder="@ChargEase"
                style={{ width: '100%', background: '#121215', border: '1px solid #22222a', borderRadius: 10, padding: '0.65rem 0.9rem', color: '#fff', fontSize: '0.875rem', outline: 'none' }}
              />
            </div>
          </div>
        )}

        {/* Navigation Menu Editor */}
        {activeTab === 'navigation' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '780px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#fff' }}>Header Navigation Items</span>
              <button
                type="button"
                onClick={addNavItem}
                style={{ background: '#121215', border: '1px solid #22222a', color: '#38bdf8', padding: '0.4rem 0.8rem', borderRadius: 8, fontSize: '0.775rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
              >
                <Plus size={14} /> Add Link Item
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {data.navigation?.map((nav, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', background: '#121215', border: '1px solid #1c1c21', padding: '0.75rem 1rem', borderRadius: 10 }}>
                  <span style={{ fontSize: '0.75rem', color: '#71717a', fontWeight: 600, width: 24 }}>#{idx + 1}</span>
                  <input
                    type="text"
                    value={nav.label}
                    onChange={e => {
                      const updated = [...(data.navigation || [])];
                      updated[idx].label = e.target.value;
                      setData({ ...data, navigation: updated });
                    }}
                    placeholder="Link Label"
                    style={{ flex: 1, background: '#09090b', border: '1px solid #22222a', borderRadius: 8, padding: '0.45rem 0.75rem', color: '#fff', fontSize: '0.825rem', outline: 'none' }}
                  />
                  <input
                    type="text"
                    value={nav.href}
                    onChange={e => {
                      const updated = [...(data.navigation || [])];
                      updated[idx].href = e.target.value;
                      setData({ ...data, navigation: updated });
                    }}
                    placeholder="Href (#section or /path)"
                    style={{ flex: 1, background: '#09090b', border: '1px solid #22222a', borderRadius: 8, padding: '0.45rem 0.75rem', color: '#fff', fontSize: '0.825rem', outline: 'none' }}
                  />
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    <button type="button" onClick={() => moveNavItem(idx, 'up')} style={{ background: '#1c1c21', border: 'none', color: '#a1a1aa', padding: '0.4rem', borderRadius: 6, cursor: 'pointer' }}><ArrowUp size={13} /></button>
                    <button type="button" onClick={() => moveNavItem(idx, 'down')} style={{ background: '#1c1c21', border: 'none', color: '#a1a1aa', padding: '0.4rem', borderRadius: 6, cursor: 'pointer' }}><ArrowDown size={13} /></button>
                    <button type="button" onClick={() => removeNavItem(idx)} style={{ background: 'rgba(239, 68, 68, 0.1)', border: 'none', color: '#f87171', padding: '0.4rem', borderRadius: 6, cursor: 'pointer' }}><Trash2 size={13} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Links */}
        {activeTab === 'footer' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '680px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#d4d4d8', marginBottom: '0.4rem' }}>Copyright Line</label>
              <input
                type="text"
                value={data.footer?.copyright || ''}
                onChange={e => setData({ ...data, footer: { ...data.footer!, copyright: e.target.value } })}
                style={{ width: '100%', background: '#121215', border: '1px solid #22222a', borderRadius: 10, padding: '0.65rem 0.9rem', color: '#fff', fontSize: '0.875rem', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#d4d4d8', marginBottom: '0.4rem' }}>Privacy Policy Link</label>
                <input
                  type="text"
                  value={data.footer?.privacyPolicyUrl || ''}
                  onChange={e => setData({ ...data, footer: { ...data.footer!, privacyPolicyUrl: e.target.value } })}
                  style={{ width: '100%', background: '#121215', border: '1px solid #22222a', borderRadius: 10, padding: '0.65rem 0.9rem', color: '#fff', fontSize: '0.875rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#d4d4d8', marginBottom: '0.4rem' }}>Terms & Conditions Link</label>
                <input
                  type="text"
                  value={data.footer?.termsUrl || ''}
                  onChange={e => setData({ ...data, footer: { ...data.footer!, termsUrl: e.target.value } })}
                  style={{ width: '100%', background: '#121215', border: '1px solid #22222a', borderRadius: 10, padding: '0.65rem 0.9rem', color: '#fff', fontSize: '0.875rem', outline: 'none' }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </form>
  );
}
