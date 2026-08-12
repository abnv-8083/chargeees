'use client';
import React, { useEffect, useState } from 'react';
import { fetchAllServicesAdmin, createServiceAdmin, updateServiceAdmin, deleteServiceAdmin } from '@/lib/api';
import type { ServiceData } from '@/lib/types';
import { showToast } from '@/lib/toast';
import {
  Plus, Edit2, Trash2, Layers, CheckCircle2, AlertCircle, X, Zap, Target,
  Globe, Shield, Users, Database, BarChart, Lightbulb, Check
} from 'lucide-react';

const ICON_MAP: Record<string, React.ReactNode> = {
  target: <Target size={20} />,
  zap: <Zap size={20} />,
  globe: <Globe size={20} />,
  shield: <Shield size={20} />,
  users: <Users size={20} />,
  layers: <Layers size={20} />,
  database: <Database size={20} />,
  barchart: <BarChart size={20} />,
  lightbulb: <Lightbulb size={20} />,
};

export default function ServicesManagerPage() {
  const [services, setServices] = useState<ServiceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

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
      showToast.error('Failed to load services data.');
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
    if (!window.confirm(`Are you sure you want to delete service "${name}"?`)) return;
    try {
      await deleteServiceAdmin(id);
      showToast.success(`Service "${name}" deleted successfully.`);
      loadServices();
    } catch (err: any) {
      showToast.error(err.message || 'Failed to delete service.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const cleanFeatures = formData.features.map(f => f.trim()).filter(Boolean);
      const payload = {
        ...formData,
        features: cleanFeatures,
      };

      if (editingId) {
        await updateServiceAdmin(editingId, payload);
        showToast.success('Service updated successfully!');
      } else {
        await createServiceAdmin(payload);
        showToast.success('New service created successfully!');
      }
      setModalOpen(false);
      loadServices();
    } catch (err: any) {
      showToast.error(err.message || 'Failed to save service.');
    } finally {
      setSaving(false);
    }
  };

  const handleFeatureChange = (index: number, val: string) => {
    const next = [...formData.features];
    next[index] = val;
    setFormData({ ...formData, features: next });
  };

  const handleAddFeatureField = () => {
    setFormData({ ...formData, features: [...formData.features, ''] });
  };

  const handleRemoveFeatureField = (index: number) => {
    const next = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: next });
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.25rem', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#a855f7', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>
            <Layers size={16} /> Services Architecture
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>
            Core Service Offerings
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Configure solutions, key value drivers, dynamic icon representations, and feature bullet points.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          style={{
            background: 'linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)',
            color: '#fff',
            border: 'none',
            padding: '0.7rem 1.3rem',
            borderRadius: 10,
            fontSize: '0.875rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 4px 14px rgba(168, 85, 247, 0.35)',
            transition: 'all 0.2s ease',
          }}
        >
          <Plus size={18} /> Add New Service
        </button>
      </div>

      {/* Services Grid */}
      {loading ? (
        <div style={{ padding: '4rem 0', textAlign: 'center', color: '#71717a' }}>
          <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p style={{ fontSize: '0.875rem' }}>Loading service offerings...</p>
        </div>
      ) : services.length === 0 ? (
        <div style={{ background: '#09090b', border: '1px dashed #22222a', borderRadius: 16, padding: '4rem 1.5rem', textAlign: 'center', color: '#71717a' }}>
          <Layers size={40} style={{ margin: '0 auto 0.75rem', opacity: 0.5 }} />
          <p style={{ fontSize: '1rem', fontWeight: 600, color: '#e4e4e7', margin: '0 0 0.25rem' }}>No services published yet</p>
          <p style={{ fontSize: '0.825rem', margin: 0 }}>Click "Add New Service" to create your first offering.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {services.map(srv => (
            <div
              key={srv._id}
              style={{
                background: '#09090b',
                border: '1px solid #1c1c21',
                borderRadius: 16,
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
              }}
              className="service-card"
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(168, 85, 247, 0.12)', border: '1px solid rgba(168, 85, 247, 0.25)', color: '#c084fc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {ICON_MAP[srv.icon] || <Zap size={20} />}
                  </div>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button
                      onClick={() => handleOpenEdit(srv)}
                      style={{ background: '#121215', border: '1px solid #22222a', color: '#d4d4d8', padding: '0.4rem 0.65rem', borderRadius: 8, fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                    >
                      <Edit2 size={13} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(srv._id, srv.name)}
                      style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.25)', color: '#f87171', padding: '0.4rem 0.65rem', borderRadius: 8, fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, color: '#fff', margin: '0 0 0.5rem' }}>
                  {srv.name}
                </h3>
                <p style={{ fontSize: '0.825rem', color: '#9ca3af', margin: '0 0 1.25rem', lineHeight: 1.5 }}>
                  {srv.description}
                </p>

                {/* Features List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginBottom: '1.25rem' }}>
                  {srv.features?.map((feat, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.8rem', color: '#d4d4d8' }}>
                      <Check size={14} color="#34d399" style={{ marginTop: '0.15rem', flexShrink: 0 }} />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ borderTop: '1px solid #1c1c21', paddingTop: '0.85rem', fontSize: '0.75rem', color: '#71717a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>CTA Target: {srv.learnMoreLink || '#contact'}</span>
                <span style={{ color: '#c084fc', fontWeight: 600 }}>Active</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#09090b', border: '1px solid #27272a', borderRadius: 20, width: '100%', maxWidth: '580px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 700, color: '#fff', margin: 0 }}>
                {editingId ? 'Edit Service Details' : 'Create New Service'}
              </h2>
              <button onClick={() => setModalOpen(false)} style={{ background: '#18181b', border: 'none', color: '#a1a1aa', padding: '0.4rem', borderRadius: 8, cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#d4d4d8', marginBottom: '0.4rem' }}>Service Title *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Turnkey EV Charging Infrastructure"
                  style={{ width: '100%', background: '#121215', border: '1px solid #22222a', borderRadius: 10, padding: '0.65rem 0.9rem', color: '#fff', fontSize: '0.875rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#d4d4d8', marginBottom: '0.4rem' }}>Select Representational Icon</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem' }}>
                  {Object.keys(ICON_MAP).map(key => (
                    <button
                      type="button"
                      key={key}
                      onClick={() => setFormData({ ...formData, icon: key })}
                      style={{
                        background: formData.icon === key ? 'rgba(168, 85, 247, 0.2)' : '#121215',
                        border: formData.icon === key ? '1px solid #c084fc' : '1px solid #22222a',
                        color: formData.icon === key ? '#c084fc' : '#a1a1aa',
                        padding: '0.6rem',
                        borderRadius: 10,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {ICON_MAP[key]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#d4d4d8', marginBottom: '0.4rem' }}>Description *</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Executive summary of the technical service and client value proposition..."
                  style={{ width: '100%', background: '#121215', border: '1px solid #22222a', borderRadius: 10, padding: '0.65rem 0.9rem', color: '#fff', fontSize: '0.875rem', outline: 'none', resize: 'vertical' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#d4d4d8' }}>Key Features & Highlights</label>
                  <button
                    type="button"
                    onClick={handleAddFeatureField}
                    style={{ background: 'transparent', border: 'none', color: '#c084fc', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                  >
                    + Add Bullet Item
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {formData.features.map((feat, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <input
                        type="text"
                        value={feat}
                        onChange={e => handleFeatureChange(idx, e.target.value)}
                        placeholder={`Feature #${idx + 1}`}
                        style={{ flex: 1, background: '#121215', border: '1px solid #22222a', borderRadius: 8, padding: '0.55rem 0.8rem', color: '#fff', fontSize: '0.825rem', outline: 'none' }}
                      />
                      {formData.features.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveFeatureField(idx)}
                          style={{ background: 'rgba(239,68,68,0.1)', border: 'none', color: '#f87171', padding: '0.55rem', borderRadius: 8, cursor: 'pointer' }}
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#d4d4d8', marginBottom: '0.4rem' }}>CTA Anchor Link</label>
                <input
                  type="text"
                  value={formData.learnMoreLink}
                  onChange={e => setFormData({ ...formData, learnMoreLink: e.target.value })}
                  placeholder="#contact"
                  style={{ width: '100%', background: '#121215', border: '1px solid #22222a', borderRadius: 10, padding: '0.65rem 0.9rem', color: '#fff', fontSize: '0.875rem', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem', borderTop: '1px solid #1c1c21', paddingTop: '1.25rem' }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  style={{ background: '#121215', border: '1px solid #22222a', color: '#a1a1aa', padding: '0.65rem 1.25rem', borderRadius: 10, fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{ background: 'linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)', border: 'none', color: '#fff', padding: '0.65rem 1.4rem', borderRadius: 10, fontSize: '0.85rem', fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer' }}
                >
                  {saving ? 'Saving...' : editingId ? 'Update Service' : 'Create Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
