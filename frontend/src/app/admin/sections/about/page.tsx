'use client';
import React, { useEffect, useState } from 'react';
import { fetchAbout, updateAboutSection } from '@/lib/api';
import type { AboutData } from '@/lib/types';
import { Save, CheckCircle2, AlertCircle, Sparkles, Plus, Trash2 } from 'lucide-react';

const FALLBACK_ABOUT: AboutData = {
  heading: 'Architects of Digital Excellence',
  subheading: 'Who We Are',
  introduction: 'ChargEase is a premier corporate innovation firm dedicated to engineering seamless digital ecosystems.',
  story: 'Founded with a singular vision to redefine enterprise technology, we combine meticulous engineering with avant-garde design principles to deliver transformative digital solutions across global markets.',
  coreValues: [
    { title: 'Relentless Precision', description: 'Every line of code and interface pixel is crafted to exacting standards.', icon: 'target' },
    { title: 'Future-Forward Innovation', description: 'Anticipating industry shifts before they happen.', icon: 'zap' },
  ],
  whyUs: [
    { title: 'Proven Track Record', description: 'Delivering excellence across enterprise engagements.' },
  ],
  timeline: [
    { year: '2021', title: 'Inception', description: 'ChargEase founded with a focus on enterprise transformation.' },
    { year: '2023', title: 'Global Expansion', description: 'Expanded operations across three continents.' },
  ],
};

export default function AboutSectionEditorPage() {
  const [data, setData] = useState<AboutData>(FALLBACK_ABOUT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchAbout()
      .then((res: any) => { if (res) setData(res); })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await updateAboutSection(data);
      setMessage({ type: 'success', text: 'About section updated successfully!' });
      setTimeout(() => setMessage(null), 4000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update about section.' });
    } finally {
      setSaving(false);
    }
  };

  const addCoreValue = () => {
    setData({
      ...data,
      coreValues: [...(data.coreValues || []), { title: 'New Value', description: 'Description here', icon: 'target' }],
    });
  };

  const removeCoreValue = (index: number) => {
    const updated = [...(data.coreValues || [])];
    updated.splice(index, 1);
    setData({ ...data, coreValues: updated });
  };

  const addTimelineEntry = () => {
    setData({
      ...data,
      timeline: [...(data.timeline || []), { year: '2024', title: 'Milestone Title', description: 'Milestone description' }],
    });
  };

  const removeTimelineEntry = (index: number) => {
    const updated = [...(data.timeline || [])];
    updated.splice(index, 1);
    setData({ ...data, timeline: updated });
  };

  if (loading) return <div style={{ padding: '2rem', color: '#888' }}>Loading About Section data...</div>;

  return (
    <div style={{ maxWidth: '900px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#888', fontSize: '0.8125rem', marginBottom: '0.3rem' }}>
          <Sparkles size={14} /> Sections / About
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, color: '#fff' }}>
          About Section & Timeline Editor
        </h1>
        <p style={{ color: '#888', fontSize: '0.875rem' }}>
          Manage company overview, core values cards, and historical milestone timeline.
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

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Main Content Card */}
        <div style={{ background: '#121212', border: '1px solid #222', borderRadius: 16, padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', margin: 0, borderBottom: '1px solid #1f1f1f', paddingBottom: '0.75rem' }}>
            Main Content
          </h3>
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', color: '#aaa', marginBottom: '0.4rem', fontWeight: 500 }}>Subheading Badge</label>
            <input
              type="text"
              value={data.subheading}
              onChange={e => setData({ ...data, subheading: e.target.value })}
              style={{ width: '100%', background: '#181818', border: '1px solid #2c2c2c', borderRadius: 8, padding: '0.75rem 1rem', color: '#fff', fontSize: '0.9rem' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', color: '#aaa', marginBottom: '0.4rem', fontWeight: 500 }}>Main Heading</label>
            <input
              type="text"
              value={data.heading}
              onChange={e => setData({ ...data, heading: e.target.value })}
              style={{ width: '100%', background: '#181818', border: '1px solid #2c2c2c', borderRadius: 8, padding: '0.75rem 1rem', color: '#fff', fontSize: '0.9rem' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', color: '#aaa', marginBottom: '0.4rem', fontWeight: 500 }}>Introduction Text</label>
            <textarea
              rows={3}
              value={data.introduction}
              onChange={e => setData({ ...data, introduction: e.target.value })}
              style={{ width: '100%', background: '#181818', border: '1px solid #2c2c2c', borderRadius: 8, padding: '0.75rem 1rem', color: '#fff', fontSize: '0.9rem' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', color: '#aaa', marginBottom: '0.4rem', fontWeight: 500 }}>Detailed Story Paragraph</label>
            <textarea
              rows={4}
              value={data.story}
              onChange={e => setData({ ...data, story: e.target.value })}
              style={{ width: '100%', background: '#181818', border: '1px solid #2c2c2c', borderRadius: 8, padding: '0.75rem 1rem', color: '#fff', fontSize: '0.9rem' }}
            />
          </div>
        </div>

        {/* Core Values Card */}
        <div style={{ background: '#121212', border: '1px solid #222', borderRadius: 16, padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1f1f1f', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', margin: 0 }}>Core Values</h3>
            <button
              type="button"
              onClick={addCoreValue}
              style={{ background: '#242424', color: '#fff', border: '1px solid #333', borderRadius: 6, padding: '0.4rem 0.8rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer' }}
            >
              <Plus size={14} /> Add Value
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {(data.coreValues || []).map((v, i) => (
              <div key={i} style={{ background: '#181818', border: '1px solid #282828', borderRadius: 10, padding: '1.25rem', display: 'grid', gridTemplateColumns: '1fr 2fr auto', gap: '1rem', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="Title"
                  value={v.title}
                  onChange={e => {
                    const updated = [...(data.coreValues || [])];
                    updated[i].title = e.target.value;
                    setData({ ...data, coreValues: updated });
                  }}
                  style={{ background: '#121212', border: '1px solid #2c2c2c', borderRadius: 6, padding: '0.6rem', color: '#fff', fontSize: '0.85rem' }}
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={v.description}
                  onChange={e => {
                    const updated = [...(data.coreValues || [])];
                    updated[i].description = e.target.value;
                    setData({ ...data, coreValues: updated });
                  }}
                  style={{ background: '#121212', border: '1px solid #2c2c2c', borderRadius: 6, padding: '0.6rem', color: '#fff', fontSize: '0.85rem' }}
                />
                <button
                  type="button"
                  onClick={() => removeCoreValue(i)}
                  style={{ background: 'transparent', border: 'none', color: '#ff6b6b', cursor: 'pointer', padding: '0.4rem' }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline Card */}
        <div style={{ background: '#121212', border: '1px solid #222', borderRadius: 16, padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1f1f1f', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', margin: 0 }}>Company Timeline Milestones</h3>
            <button
              type="button"
              onClick={addTimelineEntry}
              style={{ background: '#242424', color: '#fff', border: '1px solid #333', borderRadius: 6, padding: '0.4rem 0.8rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer' }}
            >
              <Plus size={14} /> Add Milestone
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {(data.timeline || []).map((t, i) => (
              <div key={i} style={{ background: '#181818', border: '1px solid #282828', borderRadius: 10, padding: '1.25rem', display: 'grid', gridTemplateColumns: '100px 1fr 2fr auto', gap: '1rem', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="Year"
                  value={t.year}
                  onChange={e => {
                    const updated = [...(data.timeline || [])];
                    updated[i].year = e.target.value;
                    setData({ ...data, timeline: updated });
                  }}
                  style={{ background: '#121212', border: '1px solid #2c2c2c', borderRadius: 6, padding: '0.6rem', color: '#fff', fontSize: '0.85rem' }}
                />
                <input
                  type="text"
                  placeholder="Milestone Title"
                  value={t.title}
                  onChange={e => {
                    const updated = [...(data.timeline || [])];
                    updated[i].title = e.target.value;
                    setData({ ...data, timeline: updated });
                  }}
                  style={{ background: '#121212', border: '1px solid #2c2c2c', borderRadius: 6, padding: '0.6rem', color: '#fff', fontSize: '0.85rem' }}
                />
                <input
                  type="text"
                  placeholder="Milestone Description"
                  value={t.description}
                  onChange={e => {
                    const updated = [...(data.timeline || [])];
                    updated[i].description = e.target.value;
                    setData({ ...data, timeline: updated });
                  }}
                  style={{ background: '#121212', border: '1px solid #2c2c2c', borderRadius: 6, padding: '0.6rem', color: '#fff', fontSize: '0.85rem' }}
                />
                <button
                  type="button"
                  onClick={() => removeTimelineEntry(i)}
                  style={{ background: 'transparent', border: 'none', color: '#ff6b6b', cursor: 'pointer', padding: '0.4rem' }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem' }}>
          <button
            type="submit"
            disabled={saving}
            style={{ background: '#fff', color: '#000', border: 'none', padding: '0.75rem 1.5rem', borderRadius: 8, fontSize: '0.9rem', fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: saving ? 0.7 : 1 }}
          >
            <Save size={16} /> {saving ? 'Saving Changes...' : 'Save About Section'}
          </button>
        </div>
      </form>
    </div>
  );
}
