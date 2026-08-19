'use client';
import React, { useEffect, useState } from 'react';
import { fetchAllFoundersAdmin, createFounderAdmin, updateFounderAdmin, deleteFounderAdmin } from '@/lib/api';
import type { FounderData } from '@/lib/types';
import {
  Plus, Edit2, Trash2, Users, CheckCircle2, AlertCircle,
  X, Linkedin, Twitter, Instagram, Globe, Upload, ImageIcon,
} from 'lucide-react';

/* ─── tiny shared input style ─────────────────────────────────────────────── */
const inp: React.CSSProperties = {
  width: '100%', background: '#181818', border: '1px solid #2c2c2c',
  borderRadius: 8, padding: '0.65rem 0.85rem', color: '#fff',
  fontSize: '0.85rem', fontFamily: 'inherit', boxSizing: 'border-box',
};

const EMPTY_FORM = {
  type: 'founder' as 'founder' | 'cofounder',
  name: '', title: '', biography: '', experience: '',
  messageFromFounder: '',
  achievements: [''] as string[],
  education: [{ degree: '', institution: '', year: '' }],
  socialLinks: { linkedin: '', twitter: '', instagram: '', facebook: '', website: '' },
};

export default function FoundersManagerPage() {
  const [founders, setFounders] = useState<FounderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [formData, setFormData] = useState({ ...EMPTY_FORM });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  /* filter: 'all' | 'founder' | 'cofounder' */
  const [filter, setFilter] = useState<'all' | 'founder' | 'cofounder'>('all');

  /* ── data ── */
  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchAllFoundersAdmin();
      setFounders(data || []);
    } catch { setFounders([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  /* ── modal helpers ── */
  const openCreate = () => {
    setEditingId(null);
    setFormData({ ...EMPTY_FORM });
    setImageFile(null);
    setImagePreview(null);
    setModalOpen(true);
  };

  const openEdit = (f: FounderData) => {
    setEditingId(f._id);
    setFormData({
      type: f.type || 'founder',
      name: f.name || '',
      title: f.title || '',
      biography: f.biography || '',
      experience: f.experience || '',
      messageFromFounder: f.messageFromFounder || '',
      achievements: f.achievements?.length ? [...f.achievements] : [''],
      education: f.education?.length
        ? f.education.map(e => ({ degree: e.degree || '', institution: e.institution || '', year: e.year || '' }))
        : [{ degree: '', institution: '', year: '' }],
      socialLinks: {
        linkedin: f.socialLinks?.linkedin || '',
        twitter: f.socialLinks?.twitter || '',
        instagram: f.socialLinks?.instagram || '',
        facebook: f.socialLinks?.facebook || '',
        website: f.socialLinks?.website || '',
      },
    });
    setImageFile(null);
    setImagePreview(f.profileImage || null);
    setModalOpen(true);
  };

  const closeModal = () => { setModalOpen(false); setImageFile(null); setImagePreview(null); };

  /* ── image pick ── */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  /* ── delete ── */
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete ${name}? This cannot be undone.`)) return;
    try {
      await deleteFounderAdmin(id);
      setMessage({ type: 'success', text: `${name} deleted.` });
      load();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to delete.' });
    }
  };

  /* ── save ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const fd = new FormData();
      fd.append('type', formData.type);
      fd.append('name', formData.name);
      fd.append('title', formData.title);
      fd.append('biography', formData.biography);
      fd.append('experience', formData.experience);
      fd.append('messageFromFounder', formData.messageFromFounder);
      fd.append('achievements', JSON.stringify(formData.achievements.filter(a => a.trim())));
      fd.append('education', JSON.stringify(formData.education.filter(e => e.degree.trim())));
      fd.append('socialLinks', JSON.stringify(formData.socialLinks));
      if (imageFile) fd.append('profileImage', imageFile);

      if (editingId) {
        await updateFounderAdmin(editingId, fd);
        setMessage({ type: 'success', text: 'Profile updated.' });
      } else {
        await createFounderAdmin(fd);
        setMessage({ type: 'success', text: 'Profile created.' });
      }
      closeModal();
      load();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to save profile.' });
    } finally { setSaving(false); }
  };

  /* ── filtered list ── */
  const visible = filter === 'all' ? founders : founders.filter(f => f.type === filter);

  /* ── counts ── */
  const founderCount = founders.filter(f => f.type === 'founder').length;
  const cofounderCount = founders.filter(f => f.type === 'cofounder').length;

  /* ════════════════════════════════════════════════════════════════════════ */
  return (
    <div>
      {/* ── header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, color: '#fff', marginBottom: '0.4rem' }}>
            Founders & Executive Team
          </h1>
          <p style={{ color: '#888', fontSize: '0.875rem' }}>
            Manage founder and co-founder profiles, biographies, achievements, and photos.
          </p>
        </div>
        <button onClick={openCreate} style={{ background: '#fff', color: '#000', border: 'none', padding: '0.75rem 1.25rem', borderRadius: 8, fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Plus size={16} /> Add Profile
        </button>
      </div>

      {/* ── alert banner ── */}
      {message && (
        <div style={{
          background: message.type === 'success' ? 'rgba(74,222,128,0.1)' : 'rgba(255,107,107,0.1)',
          border: `1px solid ${message.type === 'success' ? 'rgba(74,222,128,0.3)' : 'rgba(255,107,107,0.3)'}`,
          color: message.type === 'success' ? '#4ade80' : '#ff6b6b',
          padding: '0.9rem 1.25rem', borderRadius: 12, display: 'flex', alignItems: 'center',
          gap: '0.6rem', marginBottom: '1.5rem', fontSize: '0.875rem',
        }}>
          {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          {message.text}
          <button onClick={() => setMessage(null)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}><X size={16} /></button>
        </div>
      )}

      {/* ── stats + filter tabs ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {([
          { key: 'all', label: `All (${founders.length})` },
          { key: 'founder', label: `Founders (${founderCount})` },
          { key: 'cofounder', label: `Co-Founders (${cofounderCount})` },
        ] as const).map(tab => (
          <button key={tab.key} onClick={() => setFilter(tab.key)} style={{
            background: filter === tab.key ? '#fff' : '#1c1c1c',
            color: filter === tab.key ? '#000' : '#aaa',
            border: 'none', padding: '0.45rem 1rem', borderRadius: 6,
            fontSize: '0.8rem', fontWeight: filter === tab.key ? 700 : 400, cursor: 'pointer',
          }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── grid ── */}
      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#888' }}>Loading team members…</div>
      ) : visible.length === 0 ? (
        <div style={{ background: '#121212', border: '1px solid #222', borderRadius: 16, padding: '4rem 2rem', textAlign: 'center' }}>
          <Users size={44} style={{ margin: '0 auto 1rem', color: '#555' }} />
          <h3 style={{ color: '#fff', marginBottom: '0.5rem' }}>No profiles yet</h3>
          <p style={{ color: '#888', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Add the first founder or co-founder profile.</p>
          <button onClick={openCreate} style={{ background: '#fff', color: '#000', border: 'none', padding: '0.65rem 1.25rem', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>
            Add First Profile
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {visible.map(f => (
            <FounderCard key={f._id} founder={f} onEdit={() => openEdit(f)} onDelete={() => handleDelete(f._id, f.name)} />
          ))}
        </div>
      )}

      {/* ── modal ── */}
      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', overflowY: 'auto' }}>
          <div style={{ background: '#121212', border: '1px solid #282828', borderRadius: 16, width: '100%', maxWidth: '740px', padding: '2rem', margin: 'auto' }}>

            {/* modal header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1f1f1f', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', margin: 0 }}>
                {editingId ? 'Edit Profile' : 'Add New Profile'}
              </h3>
              <button onClick={closeModal} style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>

              {/* row 1: type + name */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: '#aaa', marginBottom: '0.35rem' }}>Role Type</label>
                  <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value as any })} style={inp}>
                    <option value="founder">Founder / CEO</option>
                    <option value="cofounder">Co-Founder / Executive</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: '#aaa', marginBottom: '0.35rem' }}>Full Name <span style={{ color: '#f87' }}>*</span></label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} style={inp} />
                </div>
              </div>

              {/* row 2: title + experience */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: '#aaa', marginBottom: '0.35rem' }}>Title <span style={{ color: '#f87' }}>*</span></label>
                  <input type="text" required placeholder="e.g. Chief Executive Officer" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} style={inp} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: '#aaa', marginBottom: '0.35rem' }}>Experience</label>
                  <input type="text" placeholder="e.g. 15+ Years" value={formData.experience} onChange={e => setFormData({ ...formData, experience: e.target.value })} style={inp} />
                </div>
              </div>

              {/* biography */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#aaa', marginBottom: '0.35rem' }}>Biography <span style={{ color: '#f87' }}>*</span></label>
                <textarea required rows={3} value={formData.biography} onChange={e => setFormData({ ...formData, biography: e.target.value })} style={{ ...inp, resize: 'vertical', minHeight: 80 }} />
              </div>

              {/* quote */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#aaa', marginBottom: '0.35rem' }}>Quote / Message from Founder</label>
                <textarea rows={2} value={formData.messageFromFounder} onChange={e => setFormData({ ...formData, messageFromFounder: e.target.value })} style={{ ...inp, resize: 'vertical' }} />
              </div>

              {/* photo upload */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#aaa', marginBottom: '0.5rem' }}>Profile Photo</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {/* preview */}
                  <div style={{ width: 72, height: 72, borderRadius: 10, background: '#1a1a1a', border: '1px solid #2c2c2c', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {imagePreview
                      ? <img src={imagePreview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <ImageIcon size={26} color="#444" />}
                  </div>
                  <label style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#181818', border: '1px dashed #3a3a3a', borderRadius: 8, padding: '0.65rem 1rem', cursor: 'pointer', fontSize: '0.82rem', color: '#aaa' }}>
                    <Upload size={15} />
                    {imageFile ? imageFile.name : 'Click to upload JPG, PNG, WEBP (max 10 MB)'}
                    <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleImageChange} style={{ display: 'none' }} />
                  </label>
                </div>
              </div>

              {/* achievements */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <label style={{ fontSize: '0.78rem', color: '#aaa', fontWeight: 600 }}>Achievements</label>
                  <button type="button" onClick={() => setFormData({ ...formData, achievements: [...formData.achievements, ''] })}
                    style={{ background: '#222', color: '#fff', border: 'none', borderRadius: 4, padding: '0.2rem 0.55rem', fontSize: '0.75rem', cursor: 'pointer' }}>
                    + Add
                  </button>
                </div>
                {formData.achievements.map((ach, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.45rem' }}>
                    <input type="text" value={ach} placeholder={`Achievement ${i + 1}`}
                      onChange={e => { const a = [...formData.achievements]; a[i] = e.target.value; setFormData({ ...formData, achievements: a }); }}
                      style={{ ...inp, flex: 1 }} />
                    <button type="button" onClick={() => { const a = [...formData.achievements]; a.splice(i, 1); setFormData({ ...formData, achievements: a }); }}
                      style={{ background: 'transparent', border: 'none', color: '#ff6b6b', cursor: 'pointer', flexShrink: 0 }}>
                      <X size={15} />
                    </button>
                  </div>
                ))}
              </div>

              {/* education */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <label style={{ fontSize: '0.78rem', color: '#aaa', fontWeight: 600 }}>Education</label>
                  <button type="button" onClick={() => setFormData({ ...formData, education: [...formData.education, { degree: '', institution: '', year: '' }] })}
                    style={{ background: '#222', color: '#fff', border: 'none', borderRadius: 4, padding: '0.2rem 0.55rem', fontSize: '0.75rem', cursor: 'pointer' }}>
                    + Add
                  </button>
                </div>
                {formData.education.map((edu, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr auto', gap: '0.5rem', marginBottom: '0.45rem', alignItems: 'center' }}>
                    <input type="text" placeholder="Degree" value={edu.degree}
                      onChange={e => { const ed = [...formData.education]; ed[i] = { ...ed[i], degree: e.target.value }; setFormData({ ...formData, education: ed }); }}
                      style={inp} />
                    <input type="text" placeholder="Institution" value={edu.institution}
                      onChange={e => { const ed = [...formData.education]; ed[i] = { ...ed[i], institution: e.target.value }; setFormData({ ...formData, education: ed }); }}
                      style={inp} />
                    <input type="text" placeholder="Year" value={edu.year}
                      onChange={e => { const ed = [...formData.education]; ed[i] = { ...ed[i], year: e.target.value }; setFormData({ ...formData, education: ed }); }}
                      style={inp} />
                    <button type="button" onClick={() => { const ed = [...formData.education]; ed.splice(i, 1); setFormData({ ...formData, education: ed }); }}
                      style={{ background: 'transparent', border: 'none', color: '#ff6b6b', cursor: 'pointer' }}>
                      <X size={15} />
                    </button>
                  </div>
                ))}
              </div>

              {/* social links */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#aaa', fontWeight: 600, marginBottom: '0.5rem' }}>Social Links</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  {(['linkedin', 'twitter', 'instagram', 'website'] as const).map(key => (
                    <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#181818', border: '1px solid #2c2c2c', borderRadius: 8, padding: '0 0.75rem' }}>
                      <span style={{ color: '#555', flexShrink: 0 }}>
                        {key === 'linkedin' ? <Linkedin size={14} /> : key === 'twitter' ? <Twitter size={14} /> : key === 'instagram' ? <Instagram size={14} /> : <Globe size={14} />}
                      </span>
                      <input type="url" placeholder={key.charAt(0).toUpperCase() + key.slice(1)} value={(formData.socialLinks as any)[key]}
                        onChange={e => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, [key]: e.target.value } })}
                        style={{ ...inp, border: 'none', padding: '0.65rem 0', background: 'transparent' }} />
                    </div>
                  ))}
                </div>
              </div>

              {/* footer */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #1f1f1f' }}>
                <button type="button" onClick={closeModal} style={{ background: 'transparent', border: '1px solid #333', color: '#aaa', padding: '0.65rem 1.25rem', borderRadius: 8, cursor: 'pointer', fontSize: '0.875rem' }}>
                  Cancel
                </button>
                <button type="submit" disabled={saving} style={{ background: '#fff', color: '#000', border: 'none', padding: '0.65rem 1.5rem', borderRadius: 8, fontWeight: 700, fontSize: '0.875rem', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
                  {saving ? 'Saving…' : editingId ? 'Save Changes' : 'Create Profile'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Founder card component ──────────────────────────────────────────────── */
function FounderCard({ founder: f, onEdit, onDelete }: { founder: FounderData; onEdit: () => void; onDelete: () => void }) {
  const isFounder = f.type === 'founder';
  return (
    <div style={{ background: '#121212', border: '1px solid #1e1e1e', borderRadius: 14, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* top: photo + name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem 1.25rem 1rem' }}>
        <div style={{ width: 60, height: 60, borderRadius: 10, background: '#1f1f1f', border: '1px solid #2a2a2a', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {f.profileImage
            ? <img src={f.profileImage} alt={f.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <Users size={24} color="#555" />}
        </div>
        <div style={{ minWidth: 0 }}>
          <span style={{ display: 'inline-block', fontSize: '0.62rem', padding: '0.15rem 0.5rem', borderRadius: 4, background: isFounder ? 'rgba(255,255,255,0.12)' : '#222', color: isFounder ? '#fff' : '#aaa', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
            {isFounder ? 'Founder' : 'Co-Founder'}
          </span>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{f.name}</h3>
          <p style={{ fontSize: '0.75rem', color: '#777', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{f.title}</p>
        </div>
      </div>

      {/* bio */}
      <p style={{ fontSize: '0.8rem', color: '#888', lineHeight: 1.55, margin: '0 1.25rem 1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {f.biography || <span style={{ color: '#555', fontStyle: 'italic' }}>No biography added yet.</span>}
      </p>

      {/* achievements preview */}
      {f.achievements?.length > 0 && (
        <div style={{ margin: '0 1.25rem 1rem', display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
          {f.achievements.slice(0, 2).map((a, i) => (
            <span key={i} style={{ fontSize: '0.68rem', background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#bbb', padding: '0.2rem 0.5rem', borderRadius: 4, maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a}</span>
          ))}
          {f.achievements.length > 2 && (
            <span style={{ fontSize: '0.68rem', color: '#666', padding: '0.2rem 0.3rem' }}>+{f.achievements.length - 2} more</span>
          )}
        </div>
      )}

      {/* social icons */}
      {f.socialLinks && Object.values(f.socialLinks).some(Boolean) && (
        <div style={{ display: 'flex', gap: '0.5rem', padding: '0 1.25rem 1rem' }}>
          {f.socialLinks.linkedin && <a href={f.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: '#555' }}><Linkedin size={14} /></a>}
          {f.socialLinks.twitter && <a href={f.socialLinks.twitter} target="_blank" rel="noopener noreferrer" style={{ color: '#555' }}><Twitter size={14} /></a>}
          {f.socialLinks.instagram && <a href={f.socialLinks.instagram} target="_blank" rel="noopener noreferrer" style={{ color: '#555' }}><Instagram size={14} /></a>}
          {f.socialLinks.website && <a href={f.socialLinks.website} target="_blank" rel="noopener noreferrer" style={{ color: '#555' }}><Globe size={14} /></a>}
        </div>
      )}

      {/* footer actions */}
      <div style={{ marginTop: 'auto', padding: '0.85rem 1.25rem', background: '#161616', borderTop: '1px solid #1f1f1f', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.7rem', color: '#444', fontFamily: 'monospace' }}>ID …{f._id.slice(-6)}</span>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={onEdit} style={{ background: '#242424', color: '#fff', border: '1px solid #333', padding: '0.4rem 0.75rem', borderRadius: 6, fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Edit2 size={12} /> Edit
          </button>
          <button onClick={onDelete} style={{ background: 'transparent', color: '#ff6b6b', border: '1px solid rgba(255,107,107,0.3)', padding: '0.4rem 0.55rem', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <Trash2 size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
