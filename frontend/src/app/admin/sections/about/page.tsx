'use client';
import React, { useEffect, useState } from 'react';
import { fetchAbout, updateAboutSection } from '@/lib/api';
import type { AboutData } from '@/lib/types';
import { showToast } from '@/lib/toast';
import { Save, Sparkles, Plus, Trash2 } from 'lucide-react';

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

  useEffect(() => {
    fetchAbout()
      .then((res: any) => { if (res) setData(res); })
      .catch(() => showToast.error('Failed to load About section data.'))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateAboutSection(data);
      showToast.success('About section updated successfully!');
    } catch (err: any) {
      showToast.error(err.message || 'Failed to update about section.');
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

  const addTimelineItem = () => {
    setData({
      ...data,
      timeline: [...(data.timeline || []), { year: '2025', title: 'Milestone Title', description: 'Milestone detail...' }],
    });
  };

  const removeTimelineItem = (index: number) => {
    const updated = [...(data.timeline || [])];
    updated.splice(index, 1);
    setData({ ...data, timeline: updated });
  };

  if (loading) {
    return (
      <div style={{ padding: '4rem 0', textAlign: 'center', color: '#71717a' }}>
        <div className="w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p style={{ fontSize: '0.875rem' }}>Loading About Section data...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '840px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#38bdf8', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>
          <Sparkles size={16} /> Sections / About Us
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, color: '#fff', margin: 0 }}>
          About Section & Timeline Editor
        </h1>
        <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginTop: '0.2rem' }}>
          Configure company narrative, core corporate values, timeline milestones, and value propositions.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
        {/* Core Narrative Card */}
        <div style={{ background: '#09090b', border: '1px solid #1c1c21', borderRadius: 18, padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, color: '#fff', margin: 0 }}>
            Corporate Narrative
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#d4d4d8', marginBottom: '0.4rem' }}>Main Heading</label>
              <input
                type="text"
                required
                value={data.heading}
                onChange={e => setData({ ...data, heading: e.target.value })}
                style={{ width: '100%', background: '#121215', border: '1px solid #22222a', borderRadius: 10, padding: '0.65rem 0.9rem', color: '#fff', fontSize: '0.875rem', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#d4d4d8', marginBottom: '0.4rem' }}>Subheading Label</label>
              <input
                type="text"
                required
                value={data.subheading}
                onChange={e => setData({ ...data, subheading: e.target.value })}
                style={{ width: '100%', background: '#121215', border: '1px solid #22222a', borderRadius: 10, padding: '0.65rem 0.9rem', color: '#fff', fontSize: '0.875rem', outline: 'none' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#d4d4d8', marginBottom: '0.4rem' }}>Introduction Text</label>
            <textarea
              rows={3}
              value={data.introduction}
              onChange={e => setData({ ...data, introduction: e.target.value })}
              style={{ width: '100%', background: '#121215', border: '1px solid #22222a', borderRadius: 10, padding: '0.65rem 0.9rem', color: '#fff', fontSize: '0.875rem', outline: 'none', resize: 'vertical' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#d4d4d8', marginBottom: '0.4rem' }}>Detailed Story</label>
            <textarea
              rows={4}
              value={data.story}
              onChange={e => setData({ ...data, story: e.target.value })}
              style={{ width: '100%', background: '#121215', border: '1px solid #22222a', borderRadius: 10, padding: '0.65rem 0.9rem', color: '#fff', fontSize: '0.875rem', outline: 'none', resize: 'vertical' }}
            />
          </div>
        </div>

        {/* Timeline Milestones Card */}
        <div style={{ background: '#09090b', border: '1px solid #1c1c21', borderRadius: 18, padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, color: '#fff', margin: 0 }}>
              Company History & Timeline
            </h2>
            <button
              type="button"
              onClick={addTimelineItem}
              style={{ background: '#121215', border: '1px solid #22222a', color: '#38bdf8', padding: '0.4rem 0.8rem', borderRadius: 8, fontSize: '0.775rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
            >
              <Plus size={14} /> Add Milestone
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {data.timeline?.map((item, idx) => (
              <div key={idx} style={{ background: '#121215', border: '1px solid #1c1c21', borderRadius: 12, padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <input
                    type="text"
                    value={item.year}
                    onChange={e => {
                      const updated = [...(data.timeline || [])];
                      updated[idx].year = e.target.value;
                      setData({ ...data, timeline: updated });
                    }}
                    placeholder="Year (e.g. 2024)"
                    style={{ width: '110px', background: '#09090b', border: '1px solid #22222a', borderRadius: 8, padding: '0.45rem 0.75rem', color: '#38bdf8', fontWeight: 700, fontSize: '0.85rem', outline: 'none' }}
                  />
                  <input
                    type="text"
                    value={item.title}
                    onChange={e => {
                      const updated = [...(data.timeline || [])];
                      updated[idx].title = e.target.value;
                      setData({ ...data, timeline: updated });
                    }}
                    placeholder="Milestone Title"
                    style={{ flex: 1, background: '#09090b', border: '1px solid #22222a', borderRadius: 8, padding: '0.45rem 0.75rem', color: '#fff', fontWeight: 600, fontSize: '0.85rem', outline: 'none' }}
                  />
                  <button
                    type="button"
                    onClick={() => removeTimelineItem(idx)}
                    style={{ background: 'rgba(239,68,68,0.1)', border: 'none', color: '#f87171', padding: '0.45rem', borderRadius: 8, cursor: 'pointer' }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <input
                  type="text"
                  value={item.description}
                  onChange={e => {
                    const updated = [...(data.timeline || [])];
                    updated[idx].description = e.target.value;
                    setData({ ...data, timeline: updated });
                  }}
                  placeholder="Milestone description..."
                  style={{ width: '100%', background: '#09090b', border: '1px solid #22222a', borderRadius: 8, padding: '0.45rem 0.75rem', color: '#a1a1aa', fontSize: '0.825rem', outline: 'none' }}
                />
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="submit"
            disabled={saving}
            style={{
              background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
              color: '#fff',
              border: 'none',
              padding: '0.7rem 1.5rem',
              borderRadius: 10,
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: saving ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 14px rgba(56, 189, 248, 0.35)',
            }}
          >
            <Save size={16} /> {saving ? 'Saving Changes...' : 'Save About Section'}
          </button>
        </div>
      </form>
    </div>
  );
}
