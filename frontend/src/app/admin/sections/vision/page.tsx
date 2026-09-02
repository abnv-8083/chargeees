'use client';
import React, { useEffect, useState } from 'react';
import { fetchVision, updateVisionSection } from '@/lib/api';
import { showToast } from '@/lib/toast';
import type { VisionData } from '@/lib/types';
import { AdminLoading } from '@/app/admin/components';
import { adminInput, adminTextarea, adminLabel, adminBtn } from '@/app/admin/components/adminStyles';
import { Save, Sparkles, Plus, Trash2, Loader2 } from 'lucide-react';

const FALLBACK_VISION: VisionData = {
  heading: 'Pioneering the Digital Frontier',
  statement: 'To be the global catalyst for intelligent enterprise transformation.',
  futureGoals: [
    { title: 'AI-Native Architectures', description: 'Embedding autonomous intelligence into enterprise systems.' },
    { title: 'Zero-Latency Ecosystems', description: 'Building hyper-connected, real-time data infrastructure.' },
    { title: 'Sustainable Innovation', description: 'Creating green, energy-efficient cloud computing paradigms.' },
  ],
  strategicDirection: 'Our roadmap centers on autonomous enterprise infrastructure and deep vertical AI integration.',
};

export default function VisionSectionEditorPage() {
  const [data, setData] = useState<VisionData>(FALLBACK_VISION);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchVision().then((res: any) => { if (res) setData(res); }).finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateVisionSection(data);
      showToast.success('Vision section saved', 'Changes are now live.');
    } catch (err: any) {
      showToast.error('Save failed', err.message || 'Could not save vision section.');
    } finally { setSaving(false); }
  };

  if (loading) return <AdminLoading text="Loading Vision section..." fullPage />;

  return (
    <div style={{ maxWidth: '900px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#52525b', fontSize: '0.75rem', marginBottom: '0.3rem' }}>
          <Sparkles size={13} /> Sections / Vision
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, color: '#fafafa' }}>Vision Section Editor</h1>
        <p style={{ color: '#71717a', fontSize: '0.875rem' }}>Configure vision statement, strategic directions, and future goals.</p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ background: '#09090b', border: '1px solid #18181b', borderRadius: 16, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div><label style={adminLabel}>Heading</label><input type="text" value={data.heading} onChange={e => setData({ ...data, heading: e.target.value })} style={adminInput} /></div>
          <div><label style={adminLabel}>Vision Statement</label><textarea rows={4} value={data.statement} onChange={e => setData({ ...data, statement: e.target.value })} style={adminTextarea} /></div>
          <div><label style={adminLabel}>Strategic Direction</label><textarea rows={3} value={data.strategicDirection} onChange={e => setData({ ...data, strategicDirection: e.target.value })} style={adminTextarea} /></div>
        </div>

        <div style={{ background: '#09090b', border: '1px solid #18181b', borderRadius: 16, padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #18181b', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fafafa', margin: 0 }}>Future Goals</h3>
            <button type="button" onClick={() => setData({ ...data, futureGoals: [...(data.futureGoals || []), { title: 'New Goal', description: 'Details' }] })} style={adminBtn.ghost}><Plus size={14} /> Add Goal</button>
          </div>
          {(data.futureGoals || []).map((g, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto', gap: '0.75rem', alignItems: 'center', marginBottom: '0.75rem' }}>
              <input type="text" placeholder="Goal Title" value={g.title} onChange={e => { const u = [...(data.futureGoals || [])]; u[i].title = e.target.value; setData({ ...data, futureGoals: u }); }} style={adminInput} />
              <input type="text" placeholder="Description" value={g.description} onChange={e => { const u = [...(data.futureGoals || [])]; u[i].description = e.target.value; setData({ ...data, futureGoals: u }); }} style={adminInput} />
              <button type="button" onClick={() => { const u = [...(data.futureGoals || [])]; u.splice(i, 1); setData({ ...data, futureGoals: u }); }} style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer' }}><Trash2 size={15} /></button>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.5rem' }}>
          <button type="submit" disabled={saving} style={adminBtn.primary(saving)}>
            {saving && <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />}
            <Save size={15} /> {saving ? 'Saving...' : 'Save Vision'}
          </button>
        </div>
      </form>

      <style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
