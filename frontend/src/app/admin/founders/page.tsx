'use client';
import React, { useEffect, useState } from 'react';
import { fetchAllFoundersAdmin, createFounderAdmin, updateFounderAdmin, deleteFounderAdmin } from '@/lib/api';
import type { FounderData } from '@/lib/types';
import { Plus, Edit2, Trash2, Users, CheckCircle2, AlertCircle, X, Award, BookOpen, Globe } from 'lucide-react';

export default function FoundersManagerPage() {
  const [founders, setFounders] = useState<FounderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    type: 'founder' as 'founder' | 'cofounder',
    name: '',
    title: '',
    biography: '',
    experience: '',
    messageFromFounder: '',
    achievements: [''] as string[],
    education: [{ degree: '', institution: '', year: '' }],
    socialLinks: { linkedin: '', twitter: '', instagram: '', facebook: '', website: '' },
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const loadFounders = async () => {
    setLoading(true);
    try {
      const data = await fetchAllFoundersAdmin();
      setFounders(data || []);
    } catch (e) {
      setFounders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFounders();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      type: 'founder',
      name: '',
      title: '',
      biography: '',
      experience: '15+ Years',
      messageFromFounder: '',
      achievements: ['Key executive leadership achievement'],
      education: [{ degree: 'B.S. Engineering', institution: 'MIT', year: '2010' }],
      socialLinks: { linkedin: '', twitter: '', instagram: '', facebook: '', website: '' },
    });
    setImageFile(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (founder: FounderData) => {
    setEditingId(founder._id);
    setFormData({
      type: founder.type || 'founder',
      name: founder.name || '',
      title: founder.title || '',
      biography: founder.biography || '',
      experience: founder.experience || '',
      messageFromFounder: founder.messageFromFounder || '',
      achievements: founder.achievements?.length ? [...founder.achievements] : [''],
      education: founder.education?.length ? [...founder.education] : [{ degree: '', institution: '', year: '' }],
      socialLinks: {
        linkedin: founder.socialLinks?.linkedin || '',
        twitter: founder.socialLinks?.twitter || '',
        instagram: founder.socialLinks?.instagram || '',
        facebook: founder.socialLinks?.facebook || '',
        website: founder.socialLinks?.website || '',
      },
    });
    setImageFile(null);
    setModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;
    try {
      await deleteFounderAdmin(id);
      setMessage({ type: 'success', text: 'Profile deleted successfully.' });
      loadFounders();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to delete profile.' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const payload = new FormData();
      payload.append('type', formData.type);
      payload.append('name', formData.name);
      payload.append('title', formData.title);
      payload.append('biography', formData.biography);
      payload.append('experience', formData.experience);
      payload.append('messageFromFounder', formData.messageFromFounder);
      payload.append('achievements', JSON.stringify(formData.achievements.filter(a => a.trim() !== '')));
      payload.append('education', JSON.stringify(formData.education.filter(e => e.degree.trim() !== '')));
      payload.append('socialLinks', JSON.stringify(formData.socialLinks));

      if (imageFile) {
        payload.append('profileImage', imageFile);
      }

      if (editingId) {
        await updateFounderAdmin(editingId, payload);
        setMessage({ type: 'success', text: 'Profile updated successfully.' });
      } else {
        await createFounderAdmin(payload);
        setMessage({ type: 'success', text: 'New founder profile created successfully.' });
      }
      setModalOpen(false);
      loadFounders();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to save founder profile.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, color: '#fff', marginBottom: '0.4rem' }}>
            Founders & Executive Team
          </h1>
          <p style={{ color: '#888', fontSize: '0.875rem' }}>
            Manage founder and co-founder profiles, biographies, milestones, and headshot photography.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          style={{ background: '#fff', color: '#000', border: 'none', padding: '0.75rem 1.25rem', borderRadius: 8, fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <Plus size={16} /> Add Executive Profile
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
        <div style={{ padding: '3rem', textAlign: 'center', color: '#888' }}>Loading executive team members...</div>
      ) : founders.length === 0 ? (
        <div style={{ background: '#121212', border: '1px solid #222', borderRadius: 16, padding: '4rem 2rem', textAlign: 'center' }}>
          <Users size={44} style={{ margin: '0 auto 1rem', color: '#555' }} />
          <h3 style={{ color: '#fff', marginBottom: '0.5rem' }}>No profiles recorded</h3>
          <p style={{ color: '#888', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Get started by creating the Founder or Co-Founder profile.</p>
          <button onClick={handleOpenCreate} style={{ background: '#fff', color: '#000', border: 'none', padding: '0.65rem 1.25rem', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>
            Add First Profile
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {founders.map((f, i) => (
            <div key={i} style={{ background: '#121212', border: '1px solid #222', borderRadius: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div style={{ width: 64, height: 64, borderRadius: 12, background: '#1f1f1f', overflow: 'hidden', flexShrink: 0, border: '1px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {f.profileImage ? (
                      <img src={f.profileImage} alt={f.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <Users size={28} color="#666" />
                    )}
                  </div>
                  <div>
                    <span style={{ fontSize: '0.65rem', padding: '0.15rem 0.5rem', borderRadius: 4, background: f.type === 'founder' ? '#fff' : '#222', color: f.type === 'founder' ? '#000' : '#aaa', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                      {f.type === 'founder' ? 'Founder & CEO' : 'Co-Founder'}
                    </span>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#fff', marginTop: '0.3rem', marginBottom: 0 }}>{f.name}</h3>
                    <p style={{ fontSize: '0.8rem', color: '#888', margin: 0 }}>{f.title}</p>
                  </div>
                </div>

                <p style={{ fontSize: '0.8125rem', color: '#aaa', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', margin: 0 }}>
                  {f.biography}
                </p>
              </div>

              <div style={{ padding: '1rem 1.5rem', background: '#161616', borderTop: '1px solid #1f1f1f', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: '#666' }}>ID: {f._id.slice(-6)}</span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleOpenEdit(f)}
                    style={{ background: '#242424', color: '#fff', border: '1px solid #333', padding: '0.45rem 0.75rem', borderRadius: 6, fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                  >
                    <Edit2 size={13} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(f._id, f.name)}
                    style={{ background: 'transparent', color: '#ff6b6b', border: '1px solid rgba(255,107,107,0.3)', padding: '0.45rem 0.6rem', borderRadius: 6, fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
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
          <div style={{ background: '#121212', border: '1px solid #282828', borderRadius: 16, width: '100%', maxWidth: '720px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #1f1f1f', paddingBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', margin: 0 }}>
                {editingId ? 'Edit Profile' : 'Add New Executive Profile'}
              </h3>
              <button onClick={() => setModalOpen(false)} style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '0.3rem' }}>Profile Role Type</label>
                  <select
                    value={formData.type}
                    onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                    style={{ width: '100%', background: '#181818', border: '1px solid #2c2c2c', borderRadius: 8, padding: '0.65rem', color: '#fff', fontSize: '0.85rem' }}
                  >
                    <option value="founder">Founder & CEO</option>
                    <option value="cofounder">Co-Founder / Executive</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '0.3rem' }}>Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    style={{ width: '100%', background: '#181818', border: '1px solid #2c2c2c', borderRadius: 8, padding: '0.65rem', color: '#fff', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '0.3rem' }}>Executive Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chief Executive Officer & Founder"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    style={{ width: '100%', background: '#181818', border: '1px solid #2c2c2c', borderRadius: 8, padding: '0.65rem', color: '#fff', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '0.3rem' }}>Years Experience</label>
                  <input
                    type="text"
                    placeholder="e.g. 15+ Years"
                    value={formData.experience}
                    onChange={e => setFormData({ ...formData, experience: e.target.value })}
                    style={{ width: '100%', background: '#181818', border: '1px solid #2c2c2c', borderRadius: 8, padding: '0.65rem', color: '#fff', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '0.3rem' }}>Executive Biography</label>
                <textarea
                  rows={3}
                  required
                  value={formData.biography}
                  onChange={e => setFormData({ ...formData, biography: e.target.value })}
                  style={{ width: '100%', background: '#181818', border: '1px solid #2c2c2c', borderRadius: 8, padding: '0.65rem', color: '#fff', fontSize: '0.85rem', fontFamily: 'inherit' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '0.3rem' }}>Personal Quote / Message from Founder</label>
                <textarea
                  rows={2}
                  value={formData.messageFromFounder}
                  onChange={e => setFormData({ ...formData, messageFromFounder: e.target.value })}
                  style={{ width: '100%', background: '#181818', border: '1px solid #2c2c2c', borderRadius: 8, padding: '0.65rem', color: '#fff', fontSize: '0.85rem', fontFamily: 'inherit' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '0.3rem' }}>Headshot Profile Image (Upload)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => e.target.files?.[0] && setImageFile(e.target.files[0])}
                  style={{ width: '100%', background: '#181818', border: '1px solid #2c2c2c', borderRadius: 8, padding: '0.65rem', color: '#fff', fontSize: '0.85rem' }}
                />
              </div>

              {/* Achievements */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <label style={{ fontSize: '0.8rem', color: '#aaa', fontWeight: 600 }}>Key Career Achievements</label>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, achievements: [...formData.achievements, ''] })}
                    style={{ background: '#222', color: '#fff', border: 'none', borderRadius: 4, padding: '0.2rem 0.5rem', fontSize: '0.75rem', cursor: 'pointer' }}
                  >
                    + Add Achievement
                  </button>
                </div>
                {formData.achievements.map((ach, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <input
                      type="text"
                      value={ach}
                      onChange={e => {
                        const updated = [...formData.achievements];
                        updated[i] = e.target.value;
                        setFormData({ ...formData, achievements: updated });
                      }}
                      style={{ flex: 1, background: '#181818', border: '1px solid #2c2c2c', borderRadius: 6, padding: '0.5rem', color: '#fff', fontSize: '0.85rem' }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...formData.achievements];
                        updated.splice(i, 1);
                        setFormData({ ...formData, achievements: updated });
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
                  {saving ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
