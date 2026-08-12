'use client';
import React, { useEffect, useState } from 'react';
import { fetchMission, updateMissionSection } from '@/lib/api';
import type { MissionData } from '@/lib/types';
import { showToast } from '@/lib/toast';
import { Save, Sparkles, Plus, Trash2 } from 'lucide-react';

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

  useEffect(() => {
    fetchMission()
      .then((res: any) => { if (res) setData(res); })
      .catch(() => showToast.error('Failed to load Mission section data.'))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateMissionSection(data);
      showToast.success('Mission section updated successfully!');
    } catch (err: any) {
      showToast.error(err.message || 'Failed to update mission section.');
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

  if (loading) {
    return (
      <div style={{ padding: '4rem 0', textAlign: 'center', color: '#71717a' }}>
        <div className="w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p style={{ fontSize: '0.875rem' }}>Loading Mission Section data...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '820px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#38bdf8', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>
          <Sparkles size={16} /> Sections / Mission Mandate
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, color: '#fff', margin: 0 }}>
          Mission Section Editor
        </h1>
        <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginTop: '0.2rem' }}>
          Configure operational commitments, quantitative performance targets, and customer-first principles.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
        <div style={{ background: '#09090b', border: '1px solid #1c1c21', borderRadius: 18, padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#d4d4d8', marginBottom: '0.4rem' }}>Mission Section Heading</label>
            <input
              type="text"
              required
              value={data.heading}
              onChange={e => setData({ ...data, heading: e.target.value })}
              style={{ width: '100%', background: '#121215', border: '1px solid #22222a', borderRadius: 10, padding: '0.65rem 0.9rem', color: '#fff', fontSize: '0.875rem', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#d4d4d8', marginBottom: '0.4rem' }}>Official Mission Statement</label>
            <textarea
              rows={4}
              required
              value={data.statement}
              onChange={e => setData({ ...data, statement: e.target.value })}
              style={{ width: '100%', background: '#121215', border: '1px solid #22222a', borderRadius: 10, padding: '0.65rem 0.9rem', color: '#fff', fontSize: '0.875rem', outline: 'none', resize: 'vertical' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#d4d4d8', marginBottom: '0.4rem' }}>Customer First Statement</label>
            <textarea
              rows={3}
              value={data.customerFirst || ''}
              onChange={e => setData({ ...data, customerFirst: e.target.value })}
              style={{ width: '100%', background: '#121215', border: '1px solid #22222a', borderRadius: 10, padding: '0.65rem 0.9rem', color: '#fff', fontSize: '0.875rem', outline: 'none', resize: 'vertical' }}
            />
          </div>
        </div>

        {/* Commitments Card */}
        <div style={{ background: '#09090b', border: '1px solid #1c1c21', borderRadius: 18, padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 600, color: '#fff', margin: 0 }}>
              Pillars & Commitments
            </h3>
            <button
              type="button"
              onClick={addCommitment}
              style={{ background: '#121215', border: '1px solid #22222a', color: '#38bdf8', padding: '0.4rem 0.8rem', borderRadius: 8, fontSize: '0.775rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
            >
              <Plus size={14} /> Add Commitment
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {data.commitments?.map((com, idx) => (
              <div key={idx} style={{ background: '#121215', border: '1px solid #1c1c21', borderRadius: 10, padding: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input
                    type="text"
                    value={com.title}
                    onChange={e => {
                      const updated = [...(data.commitments || [])];
                      updated[idx].title = e.target.value;
                      setData({ ...data, commitments: updated });
                    }}
                    placeholder="Commitment Title"
                    style={{ flex: 1, background: '#09090b', border: '1px solid #22222a', borderRadius: 8, padding: '0.45rem 0.75rem', color: '#fff', fontSize: '0.85rem', fontWeight: 600, outline: 'none' }}
                  />
                  <button
                    type="button"
                    onClick={() => removeCommitment(idx)}
                    style={{ background: 'rgba(239, 68, 68, 0.1)', border: 'none', color: '#f87171', padding: '0.45rem', borderRadius: 8, cursor: 'pointer' }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <input
                  type="text"
                  value={com.description}
                  onChange={e => {
                    const updated = [...(data.commitments || [])];
                    updated[idx].description = e.target.value;
                    setData({ ...data, commitments: updated });
                  }}
                  placeholder="Commitment details..."
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
            <Save size={16} /> {saving ? 'Saving...' : 'Save Mission Section'}
          </button>
        </div>
      </form>
    </div>
  );
}
