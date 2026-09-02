'use client';
import React, { useEffect, useState } from 'react';
import { fetchAllServicesAdmin, createServiceAdmin, updateServiceAdmin, deleteServiceAdmin } from '@/lib/api';
import { showToast } from '@/lib/toast';
import type { ServiceData } from '@/lib/types';
import { AdminModal, ConfirmDialog, AdminLoading } from '@/app/admin/components';
import { adminInput, adminTextarea, adminSelect, adminLabel, adminBtn } from '@/app/admin/components/adminStyles';
import {
  Plus, Edit2, Trash2, Layers, Zap, Target, Globe, Shield,
  Users, Database, BarChart, Lightbulb, Loader2,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ReactNode> = {
  target: <Target size={20} />, zap: <Zap size={20} />, globe: <Globe size={20} />,
  shield: <Shield size={20} />, users: <Users size={20} />, layers: <Layers size={20} />,
  database: <Database size={20} />, barchart: <BarChart size={20} />, lightbulb: <Lightbulb size={20} />,
};

export default function ServicesManagerPage() {
  const [services, setServices] = useState<ServiceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ServiceData | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [formData, setFormData] = useState({
    name: '', description: '', icon: 'zap',
    features: ['High-performance execution', 'Scalable architecture'],
    learnMoreLink: '#contact',
  });

  const loadServices = async () => {
    setLoading(true);
    try {
      const data = await fetchAllServicesAdmin();
      setServices(Array.isArray(data) ? data : data?.data || []);
    } catch { setServices([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadServices(); }, []);

  const openCreate = () => {
    setEditingId(null);
    setFormData({ name: '', description: '', icon: 'zap', features: ['High-performance execution', 'Enterprise security'], learnMoreLink: '#contact' });
    setModalOpen(true);
  };

  const openEdit = (srv: ServiceData) => {
    setEditingId(srv._id);
    setFormData({
      name: srv.name || '', description: srv.description || '', icon: srv.icon || 'zap',
      features: srv.features?.length ? [...srv.features] : [''],
      learnMoreLink: srv.learnMoreLink || '#contact',
    });
    setModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteServiceAdmin(deleteTarget._id);
      showToast.success('Service deleted', `"${deleteTarget.name}" has been removed.`);
      setDeleteTarget(null);
      loadServices();
    } catch (err: any) {
      showToast.error('Delete failed', err.message || 'Could not delete service.');
    } finally { setDeleting(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...formData, features: formData.features.filter(f => f.trim() !== '') };
      if (editingId) {
        await updateServiceAdmin(editingId, payload);
        showToast.success('Service updated', 'Changes saved successfully.');
      } else {
        await createServiceAdmin(payload);
        showToast.success('Service created', 'New service added to catalog.');
      }
      setModalOpen(false);
      loadServices();
    } catch (err: any) {
      showToast.error('Save failed', err.message || 'Could not save service.');
    } finally { setSaving(false); }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, color: '#fafafa', marginBottom: '0.4rem' }}>Services & Solutions</h1>
          <p style={{ color: '#71717a', fontSize: '0.875rem' }}>Manage core capabilities, feature lists, and icon badges.</p>
        </div>
        <button onClick={openCreate} style={adminBtn.primary()}><Plus size={16} /> Add New Service</button>
      </div>

      {loading ? (
        <AdminLoading text="Loading services..." />
      ) : services.length === 0 ? (
        <div style={{ background: '#09090b', border: '1px dashed #27272a', borderRadius: 16, padding: '4rem 2rem', textAlign: 'center' }}>
          <Layers size={40} style={{ margin: '0 auto 1rem', color: '#3f3f46' }} />
          <h3 style={{ color: '#fafafa', marginBottom: '0.5rem' }}>No services published</h3>
          <p style={{ color: '#71717a', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Add your company's first service offering.</p>
          <button onClick={openCreate} style={adminBtn.primary()}>Add First Service</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
          {services.map((srv, i) => (
            <div key={srv._id || i} style={{ background: '#09090b', border: '1px solid #18181b', borderRadius: 14, padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'border-color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#27272a'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#18181b'}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.85rem' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: '#18181b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fafafa', border: '1px solid #27272a' }}>
                    {ICON_MAP[srv.icon?.toLowerCase()] || <Zap size={18} />}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#fafafa', margin: 0 }}>{srv.name}</h3>
                    <span style={{ fontSize: '0.7rem', color: '#3f3f46' }}>icon: {srv.icon}</span>
                  </div>
                </div>
                <p style={{ fontSize: '0.85rem', color: '#71717a', lineHeight: 1.5, marginBottom: '1rem' }}>{srv.description}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '1.25rem' }}>
                  {(srv.features || []).map((feat, fi) => (
                    <div key={fi} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#d4d4d8' }}>
                      <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#52525b' }} />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.85rem', borderTop: '1px solid #18181b' }}>
                <span style={{ fontSize: '0.7rem', color: '#3f3f46' }}>{srv.learnMoreLink}</span>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <button onClick={() => openEdit(srv)} style={adminBtn.ghost}><Edit2 size={12} /> Edit</button>
                  <button onClick={() => setDeleteTarget(srv)} style={adminBtn.danger}><Trash2 size={12} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AdminModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Edit Service' : 'Add New Service'}
        subtitle="Service capability details and feature list"
        icon={<Layers size={18} />}
        maxWidth="620px"
        footer={
          <>
            <button onClick={() => setModalOpen(false)} style={adminBtn.secondary()}>Cancel</button>
            <button onClick={handleSubmit} disabled={saving} style={adminBtn.primary(saving)}>
              {saving && <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />}
              {saving ? 'Saving...' : 'Save Service'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.85rem' }}>
            <div>
              <label style={adminLabel}>Service Name</label>
              <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} style={adminInput} />
            </div>
            <div>
              <label style={adminLabel}>Icon Key</label>
              <select value={formData.icon} onChange={e => setFormData({ ...formData, icon: e.target.value })} style={adminSelect}>
                {Object.keys(ICON_MAP).map(iconKey => <option key={iconKey} value={iconKey}>{iconKey.toUpperCase()}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label style={adminLabel}>Description</label>
            <textarea rows={3} required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} style={adminTextarea} />
          </div>
          <div>
            <label style={adminLabel}>Learn More Link</label>
            <input type="text" value={formData.learnMoreLink} onChange={e => setFormData({ ...formData, learnMoreLink: e.target.value })} style={adminInput} />
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label style={adminLabel}>Key Features</label>
              <button type="button" onClick={() => setFormData({ ...formData, features: [...formData.features, ''] })} style={{ ...adminBtn.ghost, fontSize: '0.75rem', padding: '0.2rem 0.55rem' }}>+ Add Feature</button>
            </div>
            {formData.features.map((feat, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <input type="text" value={feat} onChange={e => { const updated = [...formData.features]; updated[i] = e.target.value; setFormData({ ...formData, features: updated }); }} style={{ ...adminInput, flex: 1 }} />
                <button type="button" onClick={() => { const updated = [...formData.features]; updated.splice(i, 1); setFormData({ ...formData, features: updated }); }} style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer' }}>
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </form>
      </AdminModal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Service"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This cannot be undone.`}
        confirmLabel="Delete Service"
        loading={deleting}
      />

      <style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
