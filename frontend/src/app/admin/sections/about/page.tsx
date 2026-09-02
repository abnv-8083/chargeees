'use client';
import React, { useEffect, useState } from 'react';
import { fetchAbout, updateAboutSection } from '@/lib/api';
import { showToast } from '@/lib/toast';
import type { AboutData } from '@/lib/types';
import { AdminLoading } from '@/app/admin/components';
import { adminInput, adminTextarea, adminLabel, adminBtn } from '@/app/admin/components/adminStyles';
import { Save, Sparkles, Plus, Trash2, Loader2 } from 'lucide-react';

const FALLBACK_ABOUT: AboutData = {
  heading: 'Architects of Digital Excellence',
  subheading: 'Who We Are',
  introduction: 'ChargEase is a premier corporate innovation firm dedicated to engineering seamless digital ecosystems.',
  story: 'Founded with a singular vision to redefine enterprise technology, we combine meticulous engineering with avant-garde design principles.',
  coreValues: [
    { title: 'Relentless Precision', description: 'Every line of code and interface pixel is crafted to exacting standards.', icon: 'target' },
    { title: 'Future-Forward Innovation', description: 'Anticipating industry shifts before they happen.', icon: 'zap' },
  ],
  whyUs: [{ title: 'Proven Track Record', description: 'Delivering excellence across enterprise engagements.' }],
  timeline: [
    { year: '2021', title: 'Inception', description: 'ChargEase founded with a focus on enterprise transformation.' },
    { year: '2023', title: 'Global Expansion', description: 'Expanded operations across three continents.' },
  ],
};

export default function AboutSectionEditorPage() {
  const [data, setData] = useState<AboutData>(FALLBACK_ABOUT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAbout().then((res: any) => { if (res) setData(res); }).finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateAboutSection(data);
      showToast.success('About section saved', 'Changes are now live.');
    } catch (err: any) {
      showToast.error('Save failed', err.message || 'Could not save about section.');
    } finally { setSaving(false); }
  };

  if (loading) return <AdminLoading text="Loading About section..." fullPage />;

  return (
    <div style={{ maxWidth: '900px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#52525b', fontSize: '0.75rem', marginBottom: '0.3rem' }}>
          <Sparkles size={13} /> Sections / About
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, color: '#fafafa' }}>About Section Editor</h1>
        <p style={{ color: '#71717a', fontSize: '0.875rem' }}>Manage company overview, core values, and timeline.</p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ background: '#09090b', border: '1px solid #18181b', borderRadius: 16, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fafafa', borderBottom: '1px solid #18181b', paddingBottom: '0.75rem' }}>Main Content</div>
          <div><label style={adminLabel}>Subheading</label><input type="text" value={data.subheading} onChange={e => setData({ ...data, subheading: e.target.value })} style={adminInput} /></div>
          <div><label style={adminLabel}>Heading</label><input type="text" value={data.heading} onChange={e => setData({ ...data, heading: e.target.value })} style={adminInput} /></div>
          <div><label style={adminLabel}>Introduction</label><textarea rows={3} value={data.introduction} onChange={e => setData({ ...data, introduction: e.target.value })} style={adminTextarea} /></div>
          <div><label style={adminLabel}>Story</label><textarea rows={4} value={data.story} onChange={e => setData({ ...data, story: e.target.value })} style={adminTextarea} /></div>
        </div>

        {/* Core Values */}
        <div style={{ background: '#09090b', border: '1px solid #18181b', borderRadius: 16, padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #18181b', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fafafa', margin: 0 }}>Core Values</h3>
            <button type="button" onClick={() => setData({ ...data, coreValues: [...(data.coreValues || []), { title: 'New Value', description: 'Description', icon: 'target' }] })} style={adminBtn.ghost}><Plus size={14} /> Add</button>
          </div>
          {(data.coreValues || []).map((v, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto', gap: '0.75rem', alignItems: 'center', marginBottom: '0.75rem' }}>
              <input type="text" placeholder="Title" value={v.title} onChange={e => { const u = [...(data.coreValues || [])]; u[i].title = e.target.value; setData({ ...data, coreValues: u }); }} style={adminInput} />
              <input type="text" placeholder="Description" value={v.description} onChange={e => { const u = [...(data.coreValues || [])]; u[i].description = e.target.value; setData({ ...data, coreValues: u }); }} style={adminInput} />
              <button type="button" onClick={() => { const u = [...(data.coreValues || [])]; u.splice(i, 1); setData({ ...data, coreValues: u }); }} style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer' }}><Trash2 size={15} /></button>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div style={{ background: '#09090b', border: '1px solid #18181b', borderRadius: 16, padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #18181b', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fafafa', margin: 0 }}>Timeline</h3>
            <button type="button" onClick={() => setData({ ...data, timeline: [...(data.timeline || []), { year: '2024', title: 'New Milestone', description: 'Details' }] })} style={adminBtn.ghost}><Plus size={14} /> Add Milestone</button>
          </div>
          {(data.timeline || []).map((t, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '80px 1fr 2fr auto', gap: '0.75rem', alignItems: 'center', marginBottom: '0.75rem' }}>
              <input type="text" placeholder="Year" value={t.year} onChange={e => { const u = [...(data.timeline || [])]; u[i].year = e.target.value; setData({ ...data, timeline: u }); }} style={adminInput} />
              <input type="text" placeholder="Title" value={t.title} onChange={e => { const u = [...(data.timeline || [])]; u[i].title = e.target.value; setData({ ...data, timeline: u }); }} style={adminInput} />
              <input type="text" placeholder="Description" value={t.description} onChange={e => { const u = [...(data.timeline || [])]; u[i].description = e.target.value; setData({ ...data, timeline: u }); }} style={adminInput} />
              <button type="button" onClick={() => { const u = [...(data.timeline || [])]; u.splice(i, 1); setData({ ...data, timeline: u }); }} style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer' }}><Trash2 size={15} /></button>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.5rem' }}>
          <button type="submit" disabled={saving} style={adminBtn.primary(saving)}>
            {saving && <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />}
            <Save size={15} /> {saving ? 'Saving...' : 'Save About'}
          </button>
        </div>
      </form>

      <style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
