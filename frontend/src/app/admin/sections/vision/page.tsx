'use client';
import React, { useEffect, useState } from 'react';
import { fetchVision, updateVisionSection } from '@/lib/api';
import type { VisionData } from '@/lib/types';
import { Save, CheckCircle2, AlertCircle, Sparkles, Plus, Trash2 } from 'lucide-react';

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
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchVision()
      .then((res: any) => { if (res) setData(res); })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await updateVisionSection(data);
      setMessage({ type: 'success', text: 'Vision section updated successfully!' });
      setTimeout(() => setMessage(null), 4000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update vision section.' });
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

  if (loading) return <div style={{ padding: '2rem', color: '#888' }}>Loading Vision Section data...</div>;

  return (
    <div style={{ maxWidth: '900px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#888', fontSize: '0.8125rem', marginBottom: '0.3rem' }}>
          <Sparkles size={14} /> Sections / Vision
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, color: '#fff' }}>
          Vision Section Editor
        </h1>
        <p style={{ color: '#888', fontSize: '0.875rem' }}>
          Configure company vision statement, strategic directions, and future goals.
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
        <div style={{ background: '#121212', border: '1px solid #222', borderRadius: 16, padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', color: '#aaa', marginBottom: '0.4rem', fontWeight: 500 }}>Vision Heading</label>
            <input
              type="text"
              value={data.heading}
              onChange={e => setData({ ...data, heading: e.target.value })}
              style={{ width: '100%', background: '#181818', border: '1px solid #2c2c2c', borderRadius: 8, padding: '0.75rem 1rem', color: '#fff', fontSize: '0.9rem' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', color: '#aaa', marginBottom: '0.4rem', fontWeight: 500 }}>Vision Statement (Large Quote Reveal)</label>
            <textarea
              rows={4}
              value={data.statement}
              onChange={e => setData({ ...data, statement: e.target.value })}
              style={{ width: '100%', background: '#181818', border: '1px solid #2c2c2c', borderRadius: 8, padding: '0.75rem 1rem', color: '#fff', fontSize: '0.9rem' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', color: '#aaa', marginBottom: '0.4rem', fontWeight: 500 }}>Strategic Direction Summary</label>
            <textarea
              rows={3}
              value={data.strategicDirection}
              onChange={e => setData({ ...data, strategicDirection: e.target.value })}
              style={{ width: '100%', background: '#181818', border: '1px solid #2c2c2c', borderRadius: 8, padding: '0.75rem 1rem', color: '#fff', fontSize: '0.9rem' }}
            />
          </div>
        </div>

        {/* Future Goals Card */}
        <div style={{ background: '#121212', border: '1px solid #222', borderRadius: 16, padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1f1f1f', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', margin: 0 }}>Future Strategic Goals</h3>
            <button
              type="button"
              onClick={addGoal}
              style={{ background: '#242424', color: '#fff', border: '1px solid #333', borderRadius: 6, padding: '0.4rem 0.8rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer' }}
            >
              <Plus size={14} /> Add Goal
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {(data.futureGoals || []).map((g, i) => (
              <div key={i} style={{ background: '#181818', border: '1px solid #282828', borderRadius: 10, padding: '1.25rem', display: 'grid', gridTemplateColumns: '1fr 2fr auto', gap: '1rem', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="Goal Title"
                  value={g.title}
                  onChange={e => {
                    const updated = [...(data.futureGoals || [])];
                    updated[i].title = e.target.value;
                    setData({ ...data, futureGoals: updated });
                  }}
                  style={{ background: '#121212', border: '1px solid #2c2c2c', borderRadius: 6, padding: '0.6rem', color: '#fff', fontSize: '0.85rem' }}
                />
                <input
                  type="text"
                  placeholder="Goal Description"
                  value={g.description}
                  onChange={e => {
                    const updated = [...(data.futureGoals || [])];
                    updated[i].description = e.target.value;
                    setData({ ...data, futureGoals: updated });
                  }}
                  style={{ background: '#121212', border: '1px solid #2c2c2c', borderRadius: 6, padding: '0.6rem', color: '#fff', fontSize: '0.85rem' }}
                />
                <button
                  type="button"
                  onClick={() => removeGoal(i)}
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
            <Save size={16} /> {saving ? 'Saving Changes...' : 'Save Vision Section'}
          </button>
        </div>
      </form>
    </div>
  );
}
