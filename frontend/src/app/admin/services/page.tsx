'use client';
import React, { useEffect, useState } from 'react';
import { fetchAllServicesAdmin, createServiceAdmin, updateServiceAdmin, deleteServiceAdmin } from '@/lib/api';
import type { ServiceData } from '@/lib/types';
import { Plus, Edit2, Trash2, Layers, CheckCircle2, AlertCircle, X, Zap, Target, Globe, Shield, Users, Database, BarChart, Lightbulb } from 'lucide-react';

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
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: 'zap',
    features: ['High-performance execution', 'Scalable architecture'],
    learnMoreLink: '#contact',
  });

  const loadServices = async () => {
    setLoading(true);
    try {
      const data = await fetchAllServicesAdmin();
      setServices(Array.isArray(data) ? data : data?.data || []);
    } catch (e) {
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      name: '',
      description: '',
      icon: 'zap',
      features: ['High-performance execution', 'Enterprise security protocols'],
      learnMoreLink: '#contact',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (srv: ServiceData) => {
    setEditingId(srv._id);
    setFormData({
      name: srv.name || '',
      description: srv.description || '',
      icon: srv.icon || 'zap',
      features: srv.features?.length ? [...srv.features] : [''],
      learnMoreLink: srv.learnMoreLink || '#contact',
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete service "${name}"?`)) return;
    try {
      await deleteServiceAdmin(id);
      setMessage({ type: 'success', text: 'Service deleted successfully.' });
      loadServices();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to delete service.' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const payload = {
        ...formData,
        features: formData.features.filter(f => f.trim() !== ''),
      };
      if (editingId) {
        await updateServiceAdmin(editingId, payload);
        setMessage({ type: 'success', text: 'Service updated successfully.' });
      } else {
        await createServiceAdmin(payload);
        setMessage({ type: 'success', text: 'New service created successfully.' });
      }
      setModalOpen(false);
      loadServices();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to save service.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, color: '#fff', marginBottom: '0.4rem' }}>
            Services & Solutions Catalog
          </h1>
          <p style={{ color: '#888', fontSize: '0.875rem' }}>
            Manage core corporate capabilities, feature bullet lists, and icon badges displayed on the Services grid.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          style={{ background: '#fff', color: '#000', border: 'none', padding: '0.75rem 1.25rem', borderRadius: 8, fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <Plus size={16} /> Add New Service
        </button>
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

      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#888' }}>Loading services catalog...</div>
      ) : services.length === 0 ? (
        <div style={{ background: '#121212', border: '1px solid #222', borderRadius: 16, padding: '4rem 2rem', textAlign: 'center' }}>
          <Layers size={44} style={{ margin: '0 auto 1rem', color: '#555' }} />
          <h3 style={{ color: '#fff', marginBottom: '0.5rem' }}>No services published</h3>
          <p style={{ color: '#888', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Start adding your company's core solutions and offerings.</p>
          <button onClick={handleOpenCreate} style={{ background: '#fff', color: '#000', border: 'none', padding: '0.65rem 1.25rem', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>
            Add First Service
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {services.map((srv, i) => (
            <div key={srv._id || i} style={{ background: '#121212', border: '1px solid #222', borderRadius: 16, padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1rem' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: '#1c1c1c', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                    {ICON_MAP[srv.icon?.toLowerCase()] || <Zap size={20} />}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', margin: 0 }}>{srv.name}</h3>
                    <span style={{ fontSize: '0.75rem', color: '#666' }}>Icon: {srv.icon}</span>
                  </div>
                </div>

                <p style={{ fontSize: '0.85rem', color: '#aaa', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                  {srv.description}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1.5rem' }}>
                  {(srv.features || []).map((feat, fi) => (
                    <div key={fi} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#ddd' }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#fff' }} />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid #1f1f1f' }}>
                <span style={{ fontSize: '0.75rem', color: '#666' }}>Link: {srv.learnMoreLink}</span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleOpenEdit(srv)}
                    style={{ background: '#242424', color: '#fff', border: '1px solid #333', padding: '0.45rem 0.75rem', borderRadius: 6, fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                  >
                    <Edit2 size={13} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(srv._id, srv.name)}
                    style={{ background: 'transparent', color: '#ff6b6b', border: '1px solid rgba(255,107,107,0.3)', padding: '0.45rem 0.6rem', borderRadius: 6, fontSize: '0.75rem', cursor: 'pointer' }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#121212', border: '1px solid #282828', borderRadius: 16, width: '100%', maxWidth: '640px', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #1f1f1f', paddingBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', margin: 0 }}>
                {editingId ? 'Edit Service Capability' : 'Add New Service Capability'}
              </h3>
              <button onClick={() => setModalOpen(false)} style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '0.3rem' }}>Service Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    style={{ width: '100%', background: '#181818', border: '1px solid #2c2c2c', borderRadius: 8, padding: '0.65rem', color: '#fff', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '0.3rem' }}>Icon Key</label>
                  <select
                    value={formData.icon}
                    onChange={e => setFormData({ ...formData, icon: e.target.value })}
                    style={{ width: '100%', background: '#181818', border: '1px solid #2c2c2c', borderRadius: 8, padding: '0.65rem', color: '#fff', fontSize: '0.85rem' }}
                  >
                    {Object.keys(ICON_MAP).map(iconKey => (
                      <option key={iconKey} value={iconKey}>{iconKey.toUpperCase()}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '0.3rem' }}>Service Description</label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  style={{ width: '100%', background: '#181818', border: '1px solid #2c2c2c', borderRadius: 8, padding: '0.65rem', color: '#fff', fontSize: '0.85rem', fontFamily: 'inherit' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '0.3rem' }}>Learn More Target Anchor / URL</label>
                <input
                  type="text"
                  value={formData.learnMoreLink}
                  onChange={e => setFormData({ ...formData, learnMoreLink: e.target.value })}
                  style={{ width: '100%', background: '#181818', border: '1px solid #2c2c2c', borderRadius: 8, padding: '0.65rem', color: '#fff', fontSize: '0.85rem' }}
                />
              </div>

              {/* Features List */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <label style={{ fontSize: '0.8rem', color: '#aaa', fontWeight: 600 }}>Key Capability Features</label>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, features: [...formData.features, ''] })}
                    style={{ background: '#222', color: '#fff', border: 'none', borderRadius: 4, padding: '0.2rem 0.5rem', fontSize: '0.75rem', cursor: 'pointer' }}
                  >
                    + Add Feature
                  </button>
                </div>
                {formData.features.map((feat, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <input
                      type="text"
                      value={feat}
                      onChange={e => {
                        const updated = [...formData.features];
                        updated[i] = e.target.value;
                        setFormData({ ...formData, features: updated });
                      }}
                      style={{ flex: 1, background: '#181818', border: '1px solid #2c2c2c', borderRadius: 6, padding: '0.5rem', color: '#fff', fontSize: '0.85rem' }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...formData.features];
                        updated.splice(i, 1);
                        setFormData({ ...formData, features: updated });
                      }}
                      style={{ background: 'transparent', border: 'none', color: '#ff6b6b', cursor: 'pointer' }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem', borderTop: '1px solid #1f1f1f', paddingTop: '1.25rem' }}>
                <button type="button" onClick={() => setModalOpen(false)} style={{ background: 'transparent', border: '1px solid #333', color: '#aaa', padding: '0.65rem 1.25rem', borderRadius: 8, cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit" disabled={saving} style={{ background: '#fff', color: '#000', border: 'none', padding: '0.65rem 1.5rem', borderRadius: 8, fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer' }}>
                  {saving ? 'Saving...' : 'Save Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
