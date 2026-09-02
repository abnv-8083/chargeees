'use client';
import React, { useEffect, useState } from 'react';
import { fetchSettings, updateSettingsAdmin } from '@/lib/api';
import { showToast } from '@/lib/toast';
import type { SiteSettings } from '@/lib/types';
import { AdminLoading } from '@/app/admin/components';
import { adminInput, adminTextarea, adminLabel, adminBtn } from '@/app/admin/components/adminStyles';
import { Save, Settings, MapPin, Share2, Search, Menu as MenuIcon, LayoutTemplate, Plus, Trash2, ArrowUp, ArrowDown, Upload, Loader2 } from 'lucide-react';

export default function SettingsManagerPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'contact' | 'social' | 'seo' | 'navigation' | 'footer'>('general');
  const [data, setData] = useState<Partial<SiteSettings>>({
    companyName: 'ChargEase', companyTagline: 'Powering the Future of Business',
    companyDescription: 'Leading corporate enterprise solutions provider.',
    contact: { email: 'info@chargeease.com', phone: '+1 (555) 000-0000', address: '100 Innovation Drive, Suite 500\nNew York, NY 10001', officeHours: 'Monday – Friday\n9:00 AM – 6:00 PM EST', googleMapsEmbed: '' },
    social: { linkedin: '#', twitter: '#', instagram: '#', facebook: '#', youtube: '#' },
    seo: { metaTitle: 'ChargEase — Corporate Solutions', metaDescription: 'Empowering global enterprises through innovation.', ogImage: '', twitterHandle: '@ChargEase' },
    navigation: [
      { label: 'About', href: '#about', order: 1 }, { label: 'Vision', href: '#vision', order: 2 },
      { label: 'Mission', href: '#mission', order: 3 }, { label: 'Leadership', href: '#founder', order: 4 },
      { label: 'Projects', href: '#projects', order: 5 }, { label: 'Services', href: '#services', order: 6 },
      { label: 'Gallery', href: '#gallery', order: 7 }, { label: 'Contact', href: '#contact', order: 8 },
    ],
    footer: { copyright: '© 2026 ChargEase Inc. All rights reserved.', privacyPolicyUrl: '/privacy', termsUrl: '/terms', quickLinks: [] },
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings()
      .then((res: any) => { if (res && Object.keys(res).length > 0) setData(res); })
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
      showToast.success('Settings saved', 'Configuration updated across all modules.');
    } catch (err: any) {
      showToast.error('Save failed', err.message || 'Could not update settings.');
    } finally { setSaving(false); }
  };

  const addNavItem = () => {
    const nav = [...(data.navigation || [])];
    nav.push({ label: 'New Link', href: '#section', order: nav.length + 1 });
    setData({ ...data, navigation: nav });
  };
  const removeNavItem = (index: number) => {
    const nav = [...(data.navigation || [])]; nav.splice(index, 1);
    setData({ ...data, navigation: nav });
  };
  const moveNavItem = (index: number, direction: 'up' | 'down') => {
    const nav = [...(data.navigation || [])];
    if (direction === 'up' && index > 0) { [nav[index], nav[index - 1]] = [nav[index - 1], nav[index]]; }
    else if (direction === 'down' && index < nav.length - 1) { [nav[index], nav[index + 1]] = [nav[index + 1], nav[index]]; }
    nav.forEach((it, i) => { it.order = i + 1; });
    setData({ ...data, navigation: nav });
  };

  const TABS = [
    { key: 'general', label: 'General', icon: <Settings size={14} /> },
    { key: 'contact', label: 'Contact', icon: <MapPin size={14} /> },
    { key: 'social', label: 'Social', icon: <Share2 size={14} /> },
    { key: 'seo', label: 'SEO', icon: <Search size={14} /> },
    { key: 'navigation', label: 'Navigation', icon: <MenuIcon size={14} /> },
    { key: 'footer', label: 'Footer', icon: <LayoutTemplate size={14} /> },
  ];

  if (loading) return <AdminLoading text="Loading site settings..." fullPage />;

  const tabBtn = (key: string) => ({
    display: 'flex', alignItems: 'center', gap: '0.45rem',
    padding: '0.55rem 0.95rem', borderRadius: 8,
    background: activeTab === key ? '#fafafa' : 'transparent',
    color: activeTab === key ? '#000' : '#71717a',
    border: 'none', fontWeight: activeTab === key ? 600 : 500,
    fontSize: '0.8rem', cursor: 'pointer', whiteSpace: 'nowrap' as const,
    transition: 'all 0.15s ease',
  });

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, color: '#fafafa', marginBottom: '0.4rem' }}>Site Configuration</h1>
        <p style={{ color: '#71717a', fontSize: '0.875rem' }}>Manage brand identity, navigation, contact, social, and SEO.</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.35rem', overflowX: 'auto', borderBottom: '1px solid #18181b', paddingBottom: '0.65rem', marginBottom: '2rem' }}>
        {TABS.map(t => <button key={t.key} onClick={() => setActiveTab(t.key as any)} style={tabBtn(t.key)}>{t.icon}{t.label}</button>)}
      </div>

      <form onSubmit={handleSubmit} style={{ background: '#09090b', border: '1px solid #18181b', borderRadius: 16, padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* General */}
        {activeTab === 'general' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div><label style={adminLabel}>Company Name</label><input type="text" value={data.companyName} onChange={e => setData({ ...data, companyName: e.target.value })} style={adminInput} /></div>
            <div><label style={adminLabel}>Tagline</label><input type="text" value={data.companyTagline} onChange={e => setData({ ...data, companyTagline: e.target.value })} style={adminInput} /></div>
            <div><label style={adminLabel}>Description</label><textarea rows={3} value={data.companyDescription} onChange={e => setData({ ...data, companyDescription: e.target.value })} style={adminTextarea} /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
              <div>
                <label style={adminLabel}>Logo</label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#0d0d0f', border: '1px dashed #3f3f46', borderRadius: 8, padding: '0.6rem 0.85rem', cursor: 'pointer', fontSize: '0.8rem', color: '#71717a' }}>
                  <Upload size={14} />{logoFile ? logoFile.name : 'Upload Logo (PNG/SVG)'}
                  <input type="file" accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (f) { setLogoFile(f); setLogoPreview(URL.createObjectURL(f)); } }} style={{ display: 'none' }} />
                </label>
              </div>
              <div>
                <label style={adminLabel}>Favicon</label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#0d0d0f', border: '1px dashed #3f3f46', borderRadius: 8, padding: '0.6rem 0.85rem', cursor: 'pointer', fontSize: '0.8rem', color: '#71717a' }}>
                  <Upload size={14} />{faviconFile ? faviconFile.name : 'Upload Favicon (ICO/PNG)'}
                  <input type="file" accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (f) { setFaviconFile(f); setFaviconPreview(URL.createObjectURL(f)); } }} style={{ display: 'none' }} />
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Contact */}
        {activeTab === 'contact' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
              <div><label style={adminLabel}>Email</label><input type="email" value={data.contact?.email} onChange={e => setData({ ...data, contact: { ...data.contact!, email: e.target.value } })} style={adminInput} /></div>
              <div><label style={adminLabel}>Phone</label><input type="text" value={data.contact?.phone} onChange={e => setData({ ...data, contact: { ...data.contact!, phone: e.target.value } })} style={adminInput} /></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
              <div><label style={adminLabel}>Address</label><textarea rows={3} value={data.contact?.address} onChange={e => setData({ ...data, contact: { ...data.contact!, address: e.target.value } })} style={adminTextarea} /></div>
              <div><label style={adminLabel}>Office Hours</label><textarea rows={3} value={data.contact?.officeHours} onChange={e => setData({ ...data, contact: { ...data.contact!, officeHours: e.target.value } })} style={adminTextarea} /></div>
            </div>
            <div><label style={adminLabel}>Google Maps Embed URL</label><input type="text" placeholder="https://www.google.com/maps/embed?pb=..." value={data.contact?.googleMapsEmbed || ''} onChange={e => setData({ ...data, contact: { ...data.contact!, googleMapsEmbed: e.target.value } })} style={adminInput} /></div>
          </div>
        )}

        {/* Social */}
        {activeTab === 'social' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {['linkedin', 'twitter', 'instagram', 'facebook', 'youtube'].map(network => (
              <div key={network} style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '0.85rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: '#71717a', textTransform: 'capitalize', fontWeight: 600 }}>{network}</span>
                <input type="text" placeholder={`https://${network}.com/chargeease`} value={(data.social as any)?.[network] || ''} onChange={e => setData({ ...data, social: { ...data.social!, [network]: e.target.value } })} style={adminInput} />
              </div>
            ))}
          </div>
        )}

        {/* SEO */}
        {activeTab === 'seo' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div><label style={adminLabel}>Page Title</label><input type="text" value={data.seo?.metaTitle} onChange={e => setData({ ...data, seo: { ...data.seo!, metaTitle: e.target.value } })} style={adminInput} /></div>
            <div><label style={adminLabel}>Meta Description</label><textarea rows={3} value={data.seo?.metaDescription} onChange={e => setData({ ...data, seo: { ...data.seo!, metaDescription: e.target.value } })} style={adminTextarea} /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
              <div><label style={adminLabel}>OG Image URL</label><input type="text" value={data.seo?.ogImage || ''} onChange={e => setData({ ...data, seo: { ...data.seo!, ogImage: e.target.value } })} style={adminInput} /></div>
              <div><label style={adminLabel}>Twitter Handle</label><input type="text" value={data.seo?.twitterHandle || ''} onChange={e => setData({ ...data, seo: { ...data.seo!, twitterHandle: e.target.value } })} style={adminInput} /></div>
            </div>
          </div>
        )}

        {/* Navigation */}
        {activeTab === 'navigation' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.8rem', color: '#71717a' }}>Reorder header navigation anchors.</span>
              <button type="button" onClick={addNavItem} style={adminBtn.ghost}><Plus size={14} /> Add Item</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {(data.navigation || []).map((nav, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '40px 1fr 1fr auto', gap: '0.6rem', alignItems: 'center', background: '#0d0d0f', border: '1px solid #18181b', padding: '0.65rem', borderRadius: 8 }}>
                  <span style={{ fontSize: '0.75rem', color: '#3f3f46', fontWeight: 600 }}>#{nav.order}</span>
                  <input type="text" placeholder="Label" value={nav.label} onChange={e => { const u = [...(data.navigation || [])]; u[i].label = e.target.value; setData({ ...data, navigation: u }); }} style={{ ...adminInput, padding: '0.5rem 0.65rem', fontSize: '0.8rem' }} />
                  <input type="text" placeholder="#section" value={nav.href} onChange={e => { const u = [...(data.navigation || [])]; u[i].href = e.target.value; setData({ ...data, navigation: u }); }} style={{ ...adminInput, padding: '0.5rem 0.65rem', fontSize: '0.8rem' }} />
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    <button type="button" onClick={() => moveNavItem(i, 'up')} style={adminBtn.iconBtn}><ArrowUp size={13} /></button>
                    <button type="button" onClick={() => moveNavItem(i, 'down')} style={adminBtn.iconBtn}><ArrowDown size={13} /></button>
                    <button type="button" onClick={() => removeNavItem(i)} style={{ ...adminBtn.iconBtn, color: '#f87171', borderColor: 'rgba(248,113,113,0.25)' }}><Trash2 size={13} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        {activeTab === 'footer' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div><label style={adminLabel}>Copyright</label><input type="text" value={data.footer?.copyright} onChange={e => setData({ ...data, footer: { ...data.footer!, copyright: e.target.value } })} style={adminInput} /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
              <div><label style={adminLabel}>Privacy Policy URL</label><input type="text" value={data.footer?.privacyPolicyUrl} onChange={e => setData({ ...data, footer: { ...data.footer!, privacyPolicyUrl: e.target.value } })} style={adminInput} /></div>
              <div><label style={adminLabel}>Terms URL</label><input type="text" value={data.footer?.termsUrl} onChange={e => setData({ ...data, footer: { ...data.footer!, termsUrl: e.target.value } })} style={adminInput} /></div>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.85rem', borderTop: '1px solid #18181b' }}>
          <button type="submit" disabled={saving} style={adminBtn.primary(saving)}>
            {saving && <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />}
            <Save size={15} /> {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>

      <style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
