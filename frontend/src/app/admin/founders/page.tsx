'use client';
import React, { useEffect, useState } from 'react';
import { fetchAllFoundersAdmin, createFounderAdmin, updateFounderAdmin, deleteFounderAdmin } from '@/lib/api';
import type { FounderData } from '@/lib/types';
import { showToast } from '@/lib/toast';
import {
  Plus, Edit2, Trash2, Users, CheckCircle2, AlertCircle, X,
  Award, BookOpen, Globe, Linkedin, Twitter, Sparkles
} from 'lucide-react';

export default function FoundersManagerPage() {
  const [founders, setFounders] = useState<FounderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

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
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const loadFounders = async () => {
    setLoading(true);
    try {
      const data = await fetchAllFoundersAdmin();
      setFounders(data || []);
    } catch (e) {
      setFounders([]);
      showToast.error('Failed to load leadership team profile data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFounders();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

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
    setImagePreview(null);
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
    setImagePreview(founder.profileImage || null);
    setModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove executive profile: "${name}"?`)) return;
    try {
      await deleteFounderAdmin(id);
      showToast.success(`Executive profile "${name}" deleted successfully.`);
      loadFounders();
    } catch (err: any) {
      showToast.error(err.message || 'Failed to delete executive profile.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = new FormData();
      payload.append('type', formData.type);
      payload.append('name', formData.name);
      payload.append('title', formData.title);
      payload.append('biography', formData.biography);
      if (formData.experience) payload.append('experience', formData.experience);
      if (formData.messageFromFounder) payload.append('messageFromFounder', formData.messageFromFounder);

      const cleanAchievements = formData.achievements.filter(Boolean);
      payload.append('achievements', JSON.stringify(cleanAchievements));

      const cleanEdu = formData.education.filter(e => e.degree || e.institution);
      payload.append('education', JSON.stringify(cleanEdu));

      payload.append('socialLinks', JSON.stringify(formData.socialLinks));

      if (imageFile) {
        payload.append('image', imageFile);
      }

      if (editingId) {
        await updateFounderAdmin(editingId, payload);
        showToast.success('Executive profile updated successfully!');
      } else {
        await createFounderAdmin(payload);
        showToast.success('New executive profile published successfully!');
      }
      setModalOpen(false);
      loadFounders();
    } catch (err: any) {
      showToast.error(err.message || 'Failed to save executive profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.25rem', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#c084fc', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>
            <Users size={16} /> Leadership Registry
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>
            Founders & Executive Team
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Manage leadership profiles, founder vision statements, achievements, and social channels.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          style={{
            background: 'linear-gradient(135deg, #c084fc 0%, #9333ea 100%)',
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
            boxShadow: '0 4px 14px rgba(192, 132, 252, 0.35)',
            transition: 'all 0.2s ease',
          }}
        >
          <Plus size={18} /> Add Executive Profile
        </button>
      </div>

      {/* Founders Grid */}
      {loading ? (
        <div style={{ padding: '4rem 0', textAlign: 'center', color: '#71717a' }}>
          <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p style={{ fontSize: '0.875rem' }}>Loading leadership profiles...</p>
        </div>
      ) : founders.length === 0 ? (
        <div style={{ background: '#09090b', border: '1px dashed #22222a', borderRadius: 16, padding: '4rem 1.5rem', textAlign: 'center', color: '#71717a' }}>
          <Users size={40} style={{ margin: '0 auto 0.75rem', opacity: 0.5 }} />
          <p style={{ fontSize: '1rem', fontWeight: 600, color: '#e4e4e7', margin: '0 0 0.25rem' }}>No leadership profiles registered</p>
          <p style={{ fontSize: '0.825rem', margin: 0 }}>Click "Add Executive Profile" to add founder details.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {founders.map(founder => (
            <div
              key={founder._id}
              style={{
                background: '#09090b',
                border: '1px solid #1c1c21',
                borderRadius: 18,
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.2s ease, border-color 0.2s ease',
              }}
              className="founder-card"
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#121215', border: '2px solid #27272a', overflow: 'hidden', flexShrink: 0 }}>
                    {founder.profileImage ? (
                      <img src={founder.profileImage} alt={founder.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#71717a', fontWeight: 700, fontSize: '1.25rem' }}>
                        {founder.name?.charAt(0) || 'F'}
                      </div>
                    )}
                  </div>
                  <div>
                    <span style={{ fontSize: '0.675rem', background: 'rgba(192, 132, 252, 0.15)', color: '#c084fc', border: '1px solid rgba(192, 132, 252, 0.3)', padding: '0.15rem 0.55rem', borderRadius: 6, fontWeight: 700, textTransform: 'uppercase', display: 'inline-block', marginBottom: '0.2rem' }}>
                      {founder.type}
                    </span>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 700, color: '#fff', margin: 0 }}>
                      {founder.name}
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: '#38bdf8', margin: 0, fontWeight: 500 }}>
                      {founder.title}
                    </p>
                  </div>
                </div>

                <p style={{ fontSize: '0.825rem', color: '#9ca3af', margin: '0 0 1rem', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {founder.biography}
                </p>

                {founder.achievements && founder.achievements.length > 0 && (
                  <div style={{ marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.725rem', color: '#71717a', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>Key Milestones</span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                      {founder.achievements.slice(0, 3).map((ach, idx) => (
                        <span key={idx} style={{ background: '#121215', border: '1px solid #1c1c21', color: '#d4d4d8', padding: '0.2rem 0.55rem', borderRadius: 6, fontSize: '0.725rem' }}>
                          • {ach}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ borderTop: '1px solid #1c1c21', paddingTop: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: '0.5rem', color: '#71717a' }}>
                  {founder.socialLinks?.linkedin && <Linkedin size={15} color="#38bdf8" />}
                  {founder.socialLinks?.twitter && <Twitter size={15} color="#38bdf8" />}
                  {founder.socialLinks?.website && <Globe size={15} color="#38bdf8" />}
                </div>

                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <button
                    onClick={() => handleOpenEdit(founder)}
                    style={{ background: '#121215', border: '1px solid #22222a', color: '#fff', padding: '0.4rem 0.65rem', borderRadius: 8, fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                  >
                    <Edit2 size={13} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(founder._id, founder.name)}
                    style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.25)', color: '#f87171', padding: '0.4rem 0.65rem', borderRadius: 8, fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#09090b', border: '1px solid #27272a', borderRadius: 20, width: '100%', maxWidth: '620px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 700, color: '#fff', margin: 0 }}>
                {editingId ? 'Edit Executive Profile' : 'Add Executive Profile'}
              </h2>
              <button onClick={() => setModalOpen(false)} style={{ background: '#18181b', border: 'none', color: '#a1a1aa', padding: '0.4rem', borderRadius: 8, cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#d4d4d8', marginBottom: '0.4rem' }}>Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Dr. Alex Mercer"
                    style={{ width: '100%', background: '#121215', border: '1px solid #22222a', borderRadius: 10, padding: '0.65rem 0.9rem', color: '#fff', fontSize: '0.875rem', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#d4d4d8', marginBottom: '0.4rem' }}>Executive Role / Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Chief Executive Officer & Co-Founder"
                    style={{ width: '100%', background: '#121215', border: '1px solid #22222a', borderRadius: 10, padding: '0.65rem 0.9rem', color: '#fff', fontSize: '0.875rem', outline: 'none' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#d4d4d8', marginBottom: '0.4rem' }}>Profile Image Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ width: '100%', background: '#121215', border: '1px solid #22222a', borderRadius: 10, padding: '0.5rem', color: '#a1a1aa', fontSize: '0.8rem' }}
                />
                {imagePreview && (
                  <div style={{ marginTop: '0.75rem', width: 64, height: 64, borderRadius: '50%', overflow: 'hidden', border: '1px solid #27272a' }}>
                    <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#d4d4d8', marginBottom: '0.4rem' }}>Executive Biography *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.biography}
                  onChange={e => setFormData({ ...formData, biography: e.target.value })}
                  placeholder="Professional trajectory, domain expertise, and strategic leadership role..."
                  style={{ width: '100%', background: '#121215', border: '1px solid #22222a', borderRadius: 10, padding: '0.65rem 0.9rem', color: '#fff', fontSize: '0.875rem', outline: 'none', resize: 'vertical' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#d4d4d8', marginBottom: '0.4rem' }}>Message from Founder (Optional)</label>
                <textarea
                  rows={3}
                  value={formData.messageFromFounder}
                  onChange={e => setFormData({ ...formData, messageFromFounder: e.target.value })}
                  placeholder="Quote or personal vision statement highlighted on the website..."
                  style={{ width: '100%', background: '#121215', border: '1px solid #22222a', borderRadius: 10, padding: '0.65rem 0.9rem', color: '#fff', fontSize: '0.875rem', outline: 'none', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#d4d4d8', marginBottom: '0.4rem' }}>LinkedIn Profile URL</label>
                  <input
                    type="text"
                    value={formData.socialLinks.linkedin}
                    onChange={e => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, linkedin: e.target.value } })}
                    placeholder="https://linkedin.com/in/..."
                    style={{ width: '100%', background: '#121215', border: '1px solid #22222a', borderRadius: 10, padding: '0.65rem 0.9rem', color: '#fff', fontSize: '0.85rem', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#d4d4d8', marginBottom: '0.4rem' }}>Twitter / X URL</label>
                  <input
                    type="text"
                    value={formData.socialLinks.twitter}
                    onChange={e => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, twitter: e.target.value } })}
                    placeholder="https://x.com/..."
                    style={{ width: '100%', background: '#121215', border: '1px solid #22222a', borderRadius: 10, padding: '0.65rem 0.9rem', color: '#fff', fontSize: '0.85rem', outline: 'none' }}
                  />
                </div>
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
                  style={{ background: 'linear-gradient(135deg, #c084fc 0%, #9333ea 100%)', border: 'none', color: '#fff', padding: '0.65rem 1.4rem', borderRadius: 10, fontSize: '0.85rem', fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer' }}
                >
                  {saving ? 'Saving...' : editingId ? 'Update Profile' : 'Publish Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
