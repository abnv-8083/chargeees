'use client';
import React, { useEffect, useState } from 'react';
import { fetchMission, updateMissionSection } from '@/lib/api';
import { showToast } from '@/lib/toast';
import type { MissionData } from '@/lib/types';
import { AdminLoading } from '@/app/admin/components';
import { adminInput, adminTextarea, adminLabel, adminBtn } from '@/app/admin/components/adminStyles';
import { Save, Sparkles, Plus, Trash2, Loader2 } from 'lucide-react';

const FALLBACK_MISSION: MissionData = {
  heading: 'Our Operational Mandate',
  statement: 'We commit our engineering mastery and design excellence to empowering client success.',
  commitments: [
    { title: 'Uncompromising Quality', description: 'Zero-defect architecture backed by rigorous automated validation.' },
    { title: 'Rapid Deployment', description: 'Accelerating time-to-market via modular, reusable systems.' },
    { title: 'Client-Centric Co-Creation', description: 'Deep collaboration ensuring precise business alignment.' },
  ],
  objectives: [
    'Achieve 99.999% uptime for all deployed client infrastructures.',
    'Reduce enterprise cloud computing overhead by 40%.',
    'Set new global benchmarks for interface speed and accessibility.',
  ],
  customerFirst: 'At ChargEase, client success is our sole metric of achievement.',
};

export default function MissionSectionEditorPage() {
  const [data, setData] = useState<MissionData>(FALLBACK_MISSION);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchMission().then((res: any) => { if (res) setData(res); }).finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateMissionSection(data);
      showToast.success('Mission section saved', 'Changes are now live.');
    } catch (err: any) {
      showToast.error('Save failed', err.message || 'Could not save mission section.');
    } finally { setSaving(false); }
  };

  if (loading) return <AdminLoading text="Loading Mission section..." fullPage />;

  return (
    <div style={{ maxWidth: '900px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#52525b', fontSize: '0.75rem', marginBottom: '0.3rem' }}>
          <Sparkles size={13} /> Sections / Mission
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, color: '#fafafa' }}>Mission Section Editor</h1>
        <p style={{ color: '#71717a', fontSize: '0.875rem' }}>Configure mission statement, commitments, and strategic objectives.</p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ background: '#09090b', border: '1px solid #18181b', borderRadius: 16, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div><label style={adminLabel}>Heading</label><input type="text" value={data.heading} onChange={e => setData({ ...data, heading: e.target.value })} style={adminInput} /></div>
          <div><label style={adminLabel}>Mission Statement</label><textarea rows={3} value={data.statement} onChange={e => setData({ ...data, statement: e.target.value })} style={adminTextarea} /></div>
          <div><label style={adminLabel}>Customer-First Guarantee</label><textarea rows={3} value={data.customerFirst} onChange={e => setData({ ...data, customerFirst: e.target.value })} style={adminTextarea} /></div>
        </div>

        {/* Commitments */}
        <div style={{ background: '#09090b', border: '1px solid #18181b', borderRadius: 16, padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #18181b', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fafafa', margin: 0 }}>Commitments</h3>
            <button type="button" onClick={() => setData({ ...data, commitments: [...(data.commitments || []), { title: 'New Commitment', description: 'Details' }] })} style={adminBtn.ghost}><Plus size={14} /> Add</button>
          </div>
          {(data.commitments || []).map((c, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto', gap: '0.75rem', alignItems: 'center', marginBottom: '0.75rem' }}>
              <input type="text" placeholder="Title" value={c.title} onChange={e => { const u = [...(data.commitments || [])]; u[i].title = e.target.value; setData({ ...data, commitments: u }); }} style={adminInput} />
              <input type="text" placeholder="Description" value={c.description} onChange={e => { const u = [...(data.commitments || [])]; u[i].description = e.target.value; setData({ ...data, commitments: u }); }} style={adminInput} />
              <button type="button" onClick={() => { const u = [...(data.commitments || [])]; u.splice(i, 1); setData({ ...data, commitments: u }); }} style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer' }}><Trash2 size={15} /></button>
            </div>
          ))}
        </div>

        {/* Objectives */}
        <div style={{ background: '#09090b', border: '1px solid #18181b', borderRadius: 16, padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #18181b', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fafafa', margin: 0 }}>Strategic Objectives</h3>
            <button type="button" onClick={() => setData({ ...data, objectives: [...(data.objectives || []), 'New objective'] })} style={adminBtn.ghost}><Plus size={14} /> Add</button>
          </div>
          {(data.objectives || []).map((obj, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <span style={{ color: '#52525b', fontWeight: 600, fontSize: '0.8rem', width: '22px' }}>{i + 1}.</span>
              <input type="text" value={obj} onChange={e => { const u = [...(data.objectives || [])]; u[i] = e.target.value; setData({ ...data, objectives: u }); }} style={{ ...adminInput, flex: 1 }} />
              <button type="button" onClick={() => { const u = [...(data.objectives || [])]; u.splice(i, 1); setData({ ...data, objectives: u }); }} style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer' }}><Trash2 size={15} /></button>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.5rem' }}>
          <button type="submit" disabled={saving} style={adminBtn.primary(saving)}>
            {saving && <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />}
            <Save size={15} /> {saving ? 'Saving...' : 'Save Mission'}
          </button>
        </div>
      </form>

      <style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
