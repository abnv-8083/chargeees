'use client';
import React, { useEffect, useState } from 'react';
import { fetchSettings, updateSettingsAdmin } from '@/lib/api';
import type { SiteSettings } from '@/lib/types';
import { Save, CheckCircle2, AlertCircle, Settings, Globe, MapPin, Share2, Search, Menu as MenuIcon, LayoutTemplate, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';

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
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchSettings()
      .then((res: any) => { if (res && Object.keys(res).length > 0) setData(res); })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

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
      setMessage({ type: 'success', text: 'Site configuration updated across all modules!' });
      setTimeout(() => setMessage(null), 4000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update site settings.' });
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

  if (loading) return <div style={{ padding: '3rem', color: '#888' }}>Loading site configuration settings...</div>;

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, color: '#fff', marginBottom: '0.4rem' }}>
          Global Site Configuration & CMS Preferences
        </h1>
        <p style={{ color: '#888', fontSize: '0.875rem' }}>
          Manage corporate identity, navigation structure, contact details, social media links, and SEO tags.
        </p>
      </div>

      {message && (
        <div style={{
          background: message.type === 'success' ? 'rgba(74, 222, 128, 0.1)' : 'rgba(255, 107, 107, 0.1)',
          border: `1px solid ${message.type === 'success' ? 'rgba(74, 222, 128, 0.3)' : 'rgba(255, 107, 107, 0.3)'}`,
          color: message.type === 'success' ? '#4ade80' : '#ff6b6b',
          padding: '1rem 1.25rem',
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          marginBottom: '1.5rem',
          fontSize: '0.875rem',
        }}>
          {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Tabs Header */}
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', borderBottom: '1px solid #1f1f1f', paddingBottom: '0.75rem', marginBottom: '2rem' }}>
        {TABS.map(t => (
          <button
            key={t.key}
            type="button"
            onClick={() => setActiveTab(t.key as any)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.65rem 1.1rem',
              borderRadius: 8,
              background: activeTab === t.key ? '#fff' : 'transparent',
              color: activeTab === t.key ? '#000' : '#aaa',
              border: 'none',
              fontWeight: activeTab === t.key ? 600 : 500,
              fontSize: '0.85rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease',
            }}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} style={{ background: '#121212', border: '1px solid #222', borderRadius: 16, padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* TAB 1: General Brand */}
        {activeTab === 'general' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', color: '#aaa', marginBottom: '0.4rem', fontWeight: 500 }}>Company Name</label>
              <input
                type="text"
                value={data.companyName}
                onChange={e => setData({ ...data, companyName: e.target.value })}
                style={{ width: '100%', background: '#181818', border: '1px solid #2c2c2c', borderRadius: 8, padding: '0.75rem 1rem', color: '#fff', fontSize: '0.9rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', color: '#aaa', marginBottom: '0.4rem', fontWeight: 500 }}>Global Tagline / Motto</label>
              <input
                type="text"
                value={data.companyTagline}
                onChange={e => setData({ ...data, companyTagline: e.target.value })}
                style={{ width: '100%', background: '#181818', border: '1px solid #2c2c2c', borderRadius: 8, padding: '0.75rem 1rem', color: '#fff', fontSize: '0.9rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', color: '#aaa', marginBottom: '0.4rem', fontWeight: 500 }}>Corporate Description Summary</label>
              <textarea
                rows={3}
                value={data.companyDescription}
                onChange={e => setData({ ...data, companyDescription: e.target.value })}
                style={{ width: '100%', background: '#181818', border: '1px solid #2c2c2c', borderRadius: 8, padding: '0.75rem 1rem', color: '#fff', fontSize: '0.9rem', fontFamily: 'inherit' }}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', color: '#aaa', marginBottom: '0.4rem', fontWeight: 500 }}>Corporate Logo (Upload PNG/SVG)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => e.target.files?.[0] && setLogoFile(e.target.files[0])}
                  style={{ width: '100%', background: '#181818', border: '1px solid #2c2c2c', borderRadius: 8, padding: '0.65rem', color: '#fff', fontSize: '0.85rem' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', color: '#aaa', marginBottom: '0.4rem', fontWeight: 500 }}>Browser Favicon Icon (Upload ICO/PNG)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => e.target.files?.[0] && setFaviconFile(e.target.files[0])}
                  style={{ width: '100%', background: '#181818', border: '1px solid #2c2c2c', borderRadius: 8, padding: '0.65rem', color: '#fff', fontSize: '0.85rem' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Contact & Map */}
        {activeTab === 'contact' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', color: '#aaa', marginBottom: '0.4rem', fontWeight: 500 }}>Primary Corporate Email</label>
                <input
                  type="email"
                  value={data.contact?.email}
                  onChange={e => setData({ ...data, contact: { ...data.contact!, email: e.target.value } })}
                  style={{ width: '100%', background: '#181818', border: '1px solid #2c2c2c', borderRadius: 8, padding: '0.75rem 1rem', color: '#fff', fontSize: '0.9rem' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', color: '#aaa', marginBottom: '0.4rem', fontWeight: 500 }}>Primary Telephone Number</label>
                <input
                  type="text"
                  value={data.contact?.phone}
                  onChange={e => setData({ ...data, contact: { ...data.contact!, phone: e.target.value } })}
                  style={{ width: '100%', background: '#181818', border: '1px solid #2c2c2c', borderRadius: 8, padding: '0.75rem 1rem', color: '#fff', fontSize: '0.9rem' }}
                />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', color: '#aaa', marginBottom: '0.4rem', fontWeight: 500 }}>Headquarters Street Address</label>
                <textarea
                  rows={3}
                  value={data.contact?.address}
                  onChange={e => setData({ ...data, contact: { ...data.contact!, address: e.target.value } })}
                  style={{ width: '100%', background: '#181818', border: '1px solid #2c2c2c', borderRadius: 8, padding: '0.75rem 1rem', color: '#fff', fontSize: '0.9rem', fontFamily: 'inherit' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', color: '#aaa', marginBottom: '0.4rem', fontWeight: 500 }}>Standard Office Hours</label>
                <textarea
                  rows={3}
                  value={data.contact?.officeHours}
                  onChange={e => setData({ ...data, contact: { ...data.contact!, officeHours: e.target.value } })}
                  style={{ width: '100%', background: '#181818', border: '1px solid #2c2c2c', borderRadius: 8, padding: '0.75rem 1rem', color: '#fff', fontSize: '0.9rem', fontFamily: 'inherit' }}
                />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', color: '#aaa', marginBottom: '0.4rem', fontWeight: 500 }}>Google Maps Embed iframe URL (src only)</label>
              <input
                type="text"
                placeholder="https://www.google.com/maps/embed?pb=..."
                value={data.contact?.googleMapsEmbed || ''}
                onChange={e => setData({ ...data, contact: { ...data.contact!, googleMapsEmbed: e.target.value } })}
                style={{ width: '100%', background: '#181818', border: '1px solid #2c2c2c', borderRadius: 8, padding: '0.75rem 1rem', color: '#fff', fontSize: '0.9rem' }}
              />
            </div>
          </div>
        )}

        {/* TAB 3: Social Links */}
        {activeTab === 'social' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {['linkedin', 'twitter', 'instagram', 'facebook', 'youtube'].map(network => (
              <div key={network} style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '1rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: '#aaa', textTransform: 'capitalize', fontWeight: 600 }}>{network} URL</span>
                <input
                  type="text"
                  placeholder={`https://${network}.com/chargeease`}
                  value={(data.social as any)?.[network] || ''}
                  onChange={e => setData({ ...data, social: { ...data.social!, [network]: e.target.value } })}
                  style={{ background: '#181818', border: '1px solid #2c2c2c', borderRadius: 8, padding: '0.7rem 1rem', color: '#fff', fontSize: '0.85rem' }}
                />
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: SEO Metadata */}
        {activeTab === 'seo' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', color: '#aaa', marginBottom: '0.4rem', fontWeight: 500 }}>Global Page Title Tag (&lt;title&gt;)</label>
              <input
                type="text"
                value={data.seo?.metaTitle}
                onChange={e => setData({ ...data, seo: { ...data.seo!, metaTitle: e.target.value } })}
                style={{ width: '100%', background: '#181818', border: '1px solid #2c2c2c', borderRadius: 8, padding: '0.75rem 1rem', color: '#fff', fontSize: '0.9rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', color: '#aaa', marginBottom: '0.4rem', fontWeight: 500 }}>Meta Description Tag</label>
              <textarea
                rows={3}
                value={data.seo?.metaDescription}
                onChange={e => setData({ ...data, seo: { ...data.seo!, metaDescription: e.target.value } })}
                style={{ width: '100%', background: '#181818', border: '1px solid #2c2c2c', borderRadius: 8, padding: '0.75rem 1rem', color: '#fff', fontSize: '0.9rem', fontFamily: 'inherit' }}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', color: '#aaa', marginBottom: '0.4rem', fontWeight: 500 }}>Open Graph Image URL (Preview Banner)</label>
                <input
                  type="text"
                  value={data.seo?.ogImage || ''}
                  onChange={e => setData({ ...data, seo: { ...data.seo!, ogImage: e.target.value } })}
                  style={{ width: '100%', background: '#181818', border: '1px solid #2c2c2c', borderRadius: 8, padding: '0.75rem 1rem', color: '#fff', fontSize: '0.9rem' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', color: '#aaa', marginBottom: '0.4rem', fontWeight: 500 }}>Official Twitter / X Handle</label>
                <input
                  type="text"
                  value={data.seo?.twitterHandle || ''}
                  onChange={e => setData({ ...data, seo: { ...data.seo!, twitterHandle: e.target.value } })}
                  style={{ width: '100%', background: '#181818', border: '1px solid #2c2c2c', borderRadius: 8, padding: '0.75rem 1rem', color: '#fff', fontSize: '0.9rem' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: Navigation Menu */}
        {activeTab === 'navigation' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.85rem', color: '#aaa' }}>Reorder and manage public header navigation anchors.</span>
              <button
                type="button"
                onClick={addNavItem}
                style={{ background: '#222', color: '#fff', border: '1px solid #333', padding: '0.4rem 0.8rem', borderRadius: 6, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer' }}
              >
                <Plus size={14} /> Add Menu Item
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {(data.navigation || []).map((nav, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '50px 1fr 1fr auto', gap: '0.75rem', alignItems: 'center', background: '#181818', border: '1px solid #282828', padding: '0.75rem', borderRadius: 8 }}>
                  <span style={{ fontSize: '0.8rem', color: '#888', fontWeight: 600 }}>#{nav.order}</span>
                  <input
                    type="text"
                    placeholder="Link Label"
                    value={nav.label}
                    onChange={e => {
                      const updated = [...(data.navigation || [])];
                      updated[i].label = e.target.value;
                      setData({ ...data, navigation: updated });
                    }}
                    style={{ background: '#121212', border: '1px solid #2c2c2c', borderRadius: 6, padding: '0.5rem', color: '#fff', fontSize: '0.85rem' }}
                  />
                  <input
                    type="text"
                    placeholder="#section or /page"
                    value={nav.href}
                    onChange={e => {
                      const updated = [...(data.navigation || [])];
                      updated[i].href = e.target.value;
                      setData({ ...data, navigation: updated });
                    }}
                    style={{ background: '#121212', border: '1px solid #2c2c2c', borderRadius: 6, padding: '0.5rem', color: '#fff', fontSize: '0.85rem' }}
                  />
                  <div style={{ display: 'flex', gap: '0.3rem' }}>
                    <button type="button" onClick={() => moveNavItem(i, 'up')} style={{ background: '#222', border: 'none', color: '#fff', padding: '0.4rem', borderRadius: 4, cursor: 'pointer' }} title="Move Up">
                      <ArrowUp size={14} />
                    </button>
                    <button type="button" onClick={() => moveNavItem(i, 'down')} style={{ background: '#222', border: 'none', color: '#fff', padding: '0.4rem', borderRadius: 4, cursor: 'pointer' }} title="Move Down">
                      <ArrowDown size={14} />
                    </button>
                    <button type="button" onClick={() => removeNavItem(i)} style={{ background: 'transparent', border: 'none', color: '#ff6b6b', padding: '0.4rem', cursor: 'pointer' }} title="Delete">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: Footer */}
        {activeTab === 'footer' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', color: '#aaa', marginBottom: '0.4rem', fontWeight: 500 }}>Copyright Notice String</label>
              <input
                type="text"
                value={data.footer?.copyright}
                onChange={e => setData({ ...data, footer: { ...data.footer!, copyright: e.target.value } })}
                style={{ width: '100%', background: '#181818', border: '1px solid #2c2c2c', borderRadius: 8, padding: '0.75rem 1rem', color: '#fff', fontSize: '0.9rem' }}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', color: '#aaa', marginBottom: '0.4rem', fontWeight: 500 }}>Privacy Policy Target URL</label>
                <input
                  type="text"
                  value={data.footer?.privacyPolicyUrl}
                  onChange={e => setData({ ...data, footer: { ...data.footer!, privacyPolicyUrl: e.target.value } })}
                  style={{ width: '100%', background: '#181818', border: '1px solid #2c2c2c', borderRadius: 8, padding: '0.75rem 1rem', color: '#fff', fontSize: '0.9rem' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', color: '#aaa', marginBottom: '0.4rem', fontWeight: 500 }}>Terms of Service Target URL</label>
                <input
                  type="text"
                  value={data.footer?.termsUrl}
                  onChange={e => setData({ ...data, footer: { ...data.footer!, termsUrl: e.target.value } })}
                  style={{ width: '100%', background: '#181818', border: '1px solid #2c2c2c', borderRadius: 8, padding: '0.75rem 1rem', color: '#fff', fontSize: '0.9rem' }}
                />
              </div>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid #1f1f1f' }}>
          <button
            type="submit"
            disabled={saving}
            style={{ background: '#fff', color: '#000', border: 'none', padding: '0.75rem 1.5rem', borderRadius: 8, fontSize: '0.9rem', fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: saving ? 0.7 : 1 }}
          >
            <Save size={16} /> {saving ? 'Saving Configuration...' : 'Save All Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
