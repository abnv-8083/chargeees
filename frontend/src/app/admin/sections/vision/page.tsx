'use client';
import React, { useEffect, useState } from 'react';
import { fetchVision, updateVisionSection } from '@/lib/api';
import type { VisionData } from '@/lib/types';
import { showToast } from '@/lib/toast';
import { Save, Sparkles, Plus, Trash2 } from 'lucide-react';

const FALLBACK_VISION: VisionData = {
  heading: 'Pioneering the Digital Frontier',
  statement: 'To be the global catalyst for intelligent enterprise transformation, where cutting-edge technology meets timeless engineering discipline.',
  futureGoals: [
    { title: 'AI-Native Architectures', description: 'Embedding autonomous intelligence directly into enterprise core systems.' },
    { title: 'Zero-Latency Ecosystems', description: 'Building hyper-connected, real-time data infrastructure.' },
    { title: 'Sustainable Innovation', description: 'Creating green, energy-efficient cloud computing paradigms.' },
  ],
  strategicDirection: 'Our roadmap for the next decade centers on autonomous enterprise infrastructure and deep vertical AI integration.',
};

export default function VisionSectionEditorPage() {
  const [data, setData] = useState<VisionData>(FALLBACK_VISION);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchVision()
      .then((res: any) => { if (res) setData(res); })
      .catch(() => showToast.error('Failed to load Vision section data.'))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateVisionSection(data);
      showToast.success('Vision section updated successfully!');
    } catch (err: any) {
      showToast.error(err.message || 'Failed to update vision section.');
    } finally {
      setSaving(false);
    }
  };

  const addGoal = () => {
    setData({
      ...data,
      futureGoals: [...(data.futureGoals || []), { title: 'New Strategic Goal', description: 'Goal details here' }],
    });
  };

  const removeGoal = (index: number) => {
    const updated = [...(data.futureGoals || [])];
    updated.splice(index, 1);
    setData({ ...data, futureGoals: updated });
  };

  if (loading) {
    return (
      <div style={{ padding: '4rem 0', textAlign: 'center', color: '#71717a' }}>
        <div className="w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p style={{ fontSize: '0.875rem' }}>Loading Vision Section data...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '820px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#38bdf8', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>
          <Sparkles size={16} /> Sections / Corporate Vision
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, color: '#fff', margin: 0 }}>
          Vision Section Editor
        </h1>
        <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginTop: '0.2rem' }}>
          Define corporate long-term vision statements, strategic goals, and future technological paradigms.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
        <div style={{ background: '#09090b', border: '1px solid #1c1c21', borderRadius: 18, padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#d4d4d8', marginBottom: '0.4rem' }}>Vision Section Title</label>
            <input
              type="text"
              required
              value={data.heading}
              onChange={e => setData({ ...data, heading: e.target.value })}
              style={{ width: '100%', background: '#121215', border: '1px solid #22222a', borderRadius: 10, padding: '0.65rem 0.9rem', color: '#fff', fontSize: '0.875rem', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#d4d4d8', marginBottom: '0.4rem' }}>Official Vision Statement</label>
            <textarea
              rows={4}
              required
              value={data.statement}
              onChange={e => setData({ ...data, statement: e.target.value })}
              style={{ width: '100%', background: '#121215', border: '1px solid #22222a', borderRadius: 10, padding: '0.65rem 0.9rem', color: '#fff', fontSize: '0.875rem', outline: 'none', resize: 'vertical' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#d4d4d8', marginBottom: '0.4rem' }}>Strategic Roadmap Direction</label>
            <textarea
              rows={3}
              value={data.strategicDirection || ''}
              onChange={e => setData({ ...data, strategicDirection: e.target.value })}
              style={{ width: '100%', background: '#121215', border: '1px solid #22222a', borderRadius: 10, padding: '0.65rem 0.9rem', color: '#fff', fontSize: '0.875rem', outline: 'none', resize: 'vertical' }}
            />
          </div>
        </div>

        {/* Future Goals */}
        <div style={{ background: '#09090b', border: '1px solid #1c1c21', borderRadius: 18, padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 600, color: '#fff', margin: 0 }}>
              Pillars & Future Strategic Goals
            </h3>
            <button
              type="button"
              onClick={addGoal}
              style={{ background: '#121215', border: '1px solid #22222a', color: '#38bdf8', padding: '0.4rem 0.8rem', borderRadius: 8, fontSize: '0.775rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
            >
              <Plus size={14} /> Add Strategic Goal
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {data.futureGoals?.map((goal, idx) => (
              <div key={idx} style={{ background: '#121215', border: '1px solid #1c1c21', borderRadius: 10, padding: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input
                    type="text"
                    value={goal.title}
                    onChange={e => {
                      const updated = [...(data.futureGoals || [])];
                      updated[idx].title = e.target.value;
                      setData({ ...data, futureGoals: updated });
                    }}
                    placeholder="Goal Title"
                    style={{ flex: 1, background: '#09090b', border: '1px solid #22222a', borderRadius: 8, padding: '0.45rem 0.75rem', color: '#fff', fontSize: '0.85rem', fontWeight: 600, outline: 'none' }}
                  />
                  <button
                    type="button"
                    onClick={() => removeGoal(idx)}
                    style={{ background: 'rgba(239, 68, 68, 0.1)', border: 'none', color: '#f87171', padding: '0.45rem', borderRadius: 8, cursor: 'pointer' }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <input
                  type="text"
                  value={goal.description}
                  onChange={e => {
                    const updated = [...(data.futureGoals || [])];
                    updated[idx].description = e.target.value;
                    setData({ ...data, futureGoals: updated });
                  }}
                  placeholder="Detailed description..."
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
            <Save size={16} /> {saving ? 'Saving...' : 'Save Vision Section'}
          </button>
        </div>
      </form>
    </div>
  );
}
