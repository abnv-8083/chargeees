'use client';
import React, { useEffect, useState } from 'react';
import { fetchMission, updateMissionSection } from '@/lib/api';
import type { MissionData } from '@/lib/types';
import { Save, CheckCircle2, AlertCircle, Sparkles, Plus, Trash2 } from 'lucide-react';

const FALLBACK_MISSION: MissionData = {
  heading: 'Our Operational Mandate',
  statement: 'We commit our engineering mastery and design excellence to empowering client success across every digital touchpoint.',
  commitments: [
    { title: 'Uncompromising Quality', description: 'Zero-defect architecture backed by rigorous automated validation.' },
    { title: 'Rapid Deployment', description: 'Accelerating time-to-market via modular, reusable systems.' },
    { title: 'Client-Centric Co-Creation', description: 'Deep collaboration ensuring precise business alignment.' },
  ],
  objectives: [
    'Achieve 99.999% uptime for all deployed client infrastructures.',
    'Reduce enterprise cloud computing overhead by an average of 40%.',
    'Set new global benchmarks for interface speed and accessibility.',
  ],
  customerFirst: 'At ChargEase, client success is our sole metric of achievement. Every architecture decision and design iteration is directly tied to measurable business impact.',
};

export default function MissionSectionEditorPage() {
  const [data, setData] = useState<MissionData>(FALLBACK_MISSION);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchMission()
      .then((res: any) => { if (res) setData(res); })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await updateMissionSection(data);
      setMessage({ type: 'success', text: 'Mission section updated successfully!' });
      setTimeout(() => setMessage(null), 4000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update mission section.' });
    } finally {
      setSaving(false);
    }
  };

  const addCommitment = () => {
    setData({
      ...data,
      commitments: [...(data.commitments || []), { title: 'New Commitment', description: 'Commitment details' }],
    });
  };

  const removeCommitment = (index: number) => {
    const updated = [...(data.commitments || [])];
    updated.splice(index, 1);
    setData({ ...data, commitments: updated });
  };

  const addObjective = () => {
    setData({
      ...data,
      objectives: [...(data.objectives || []), 'New strategic objective item'],
    });
  };

  const removeObjective = (index: number) => {
    const updated = [...(data.objectives || [])];
    updated.splice(index, 1);
    setData({ ...data, objectives: updated });
  };

  if (loading) return <div style={{ padding: '2rem', color: '#888' }}>Loading Mission Section data...</div>;

  return (
    <div style={{ maxWidth: '900px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#888', fontSize: '0.8125rem', marginBottom: '0.3rem' }}>
          <Sparkles size={14} /> Sections / Mission
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, color: '#fff' }}>
          Mission Section Editor
        </h1>
        <p style={{ color: '#888', fontSize: '0.875rem' }}>
          Configure mission statement, commitments array, strategic objectives list, and customer guarantee.
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
            <label style={{ display: 'block', fontSize: '0.8125rem', color: '#aaa', marginBottom: '0.4rem', fontWeight: 500 }}>Mission Heading</label>
            <input
              type="text"
              value={data.heading}
              onChange={e => setData({ ...data, heading: e.target.value })}
              style={{ width: '100%', background: '#181818', border: '1px solid #2c2c2c', borderRadius: 8, padding: '0.75rem 1rem', color: '#fff', fontSize: '0.9rem' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', color: '#aaa', marginBottom: '0.4rem', fontWeight: 500 }}>Mission Statement</label>
            <textarea
              rows={3}
              value={data.statement}
              onChange={e => setData({ ...data, statement: e.target.value })}
              style={{ width: '100%', background: '#181818', border: '1px solid #2c2c2c', borderRadius: 8, padding: '0.75rem 1rem', color: '#fff', fontSize: '0.9rem' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', color: '#aaa', marginBottom: '0.4rem', fontWeight: 500 }}>Customer-First Guarantee Paragraph</label>
            <textarea
              rows={3}
              value={data.customerFirst}
              onChange={e => setData({ ...data, customerFirst: e.target.value })}
              style={{ width: '100%', background: '#181818', border: '1px solid #2c2c2c', borderRadius: 8, padding: '0.75rem 1rem', color: '#fff', fontSize: '0.9rem' }}
            />
          </div>
        </div>

        {/* Commitments Card */}
        <div style={{ background: '#121212', border: '1px solid #222', borderRadius: 16, padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1f1f1f', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', margin: 0 }}>Core Commitments</h3>
            <button
              type="button"
              onClick={addCommitment}
              style={{ background: '#242424', color: '#fff', border: '1px solid #333', borderRadius: 6, padding: '0.4rem 0.8rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer' }}
            >
              <Plus size={14} /> Add Commitment
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {(data.commitments || []).map((c, i) => (
              <div key={i} style={{ background: '#181818', border: '1px solid #282828', borderRadius: 10, padding: '1.25rem', display: 'grid', gridTemplateColumns: '1fr 2fr auto', gap: '1rem', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="Commitment Title"
                  value={c.title}
                  onChange={e => {
                    const updated = [...(data.commitments || [])];
                    updated[i].title = e.target.value;
                    setData({ ...data, commitments: updated });
                  }}
                  style={{ background: '#121212', border: '1px solid #2c2c2c', borderRadius: 6, padding: '0.6rem', color: '#fff', fontSize: '0.85rem' }}
                />
                <input
                  type="text"
                  placeholder="Commitment Description"
                  value={c.description}
                  onChange={e => {
                    const updated = [...(data.commitments || [])];
                    updated[i].description = e.target.value;
                    setData({ ...data, commitments: updated });
                  }}
                  style={{ background: '#121212', border: '1px solid #2c2c2c', borderRadius: 6, padding: '0.6rem', color: '#fff', fontSize: '0.85rem' }}
                />
                <button
                  type="button"
                  onClick={() => removeCommitment(i)}
                  style={{ background: 'transparent', border: 'none', color: '#ff6b6b', cursor: 'pointer', padding: '0.4rem' }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Objectives Card */}
        <div style={{ background: '#121212', border: '1px solid #222', borderRadius: 16, padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1f1f1f', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', margin: 0 }}>Strategic Objectives Checklist</h3>
            <button
              type="button"
              onClick={addObjective}
              style={{ background: '#242424', color: '#fff', border: '1px solid #333', borderRadius: 6, padding: '0.4rem 0.8rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer' }}
            >
              <Plus size={14} /> Add Objective
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {(data.objectives || []).map((obj, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ color: '#888', fontWeight: 600, fontSize: '0.85rem', width: '24px' }}>{i + 1}.</span>
                <input
                  type="text"
                  value={obj}
                  onChange={e => {
                    const updated = [...(data.objectives || [])];
                    updated[i] = e.target.value;
                    setData({ ...data, objectives: updated });
                  }}
                  style={{ flex: 1, background: '#181818', border: '1px solid #282828', borderRadius: 6, padding: '0.6rem 0.8rem', color: '#fff', fontSize: '0.85rem' }}
                />
                <button
                  type="button"
                  onClick={() => removeObjective(i)}
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
            <Save size={16} /> {saving ? 'Saving Changes...' : 'Save Mission Section'}
          </button>
        </div>
      </form>
    </div>
  );
}
