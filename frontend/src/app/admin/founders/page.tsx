'use client';
import React, { useEffect, useState } from 'react';
import { fetchAllFoundersAdmin, createFounderAdmin, updateFounderAdmin, deleteFounderAdmin } from '@/lib/api';
import { showToast } from '@/lib/toast';
import type { FounderData } from '@/lib/types';
import { AdminModal, ConfirmDialog, AdminLoading } from '@/app/admin/components';
import { adminInput, adminTextarea, adminLabel, adminBtn } from '@/app/admin/components/adminStyles';
import {
  Plus, Edit2, Trash2, Users, Upload, ImageIcon,
  Linkedin, Twitter, Instagram, Globe, Loader2,
} from 'lucide-react';

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
  const [deleteTarget, setDeleteTarget] = useState<FounderData | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [formData, setFormData] = useState({ ...EMPTY_FORM });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'founder' | 'cofounder'>('all');

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchAllFoundersAdmin();
      setFounders(data || []);
    } catch { setFounders([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

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
      name: f.name || '', title: f.title || '', biography: f.biography || '',
      experience: f.experience || '', messageFromFounder: f.messageFromFounder || '',
      achievements: f.achievements?.length ? [...f.achievements] : [''],
      education: f.education?.length
        ? f.education.map(e => ({ degree: e.degree || '', institution: e.institution || '', year: e.year || '' }))
        : [{ degree: '', institution: '', year: '' }],
      socialLinks: {
        linkedin: f.socialLinks?.linkedin || '', twitter: f.socialLinks?.twitter || '',
        instagram: f.socialLinks?.instagram || '', facebook: f.socialLinks?.facebook || '',
        website: f.socialLinks?.website || '',
      },
    });
    setImageFile(null);
    setImagePreview(f.profileImage || null);
    setModalOpen(true);
  };

  const closeModal = () => { setModalOpen(false); setImageFile(null); setImagePreview(null); };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteFounderAdmin(deleteTarget._id);
      showToast.success('Profile deleted', `${deleteTarget.name} has been removed.`);
      setDeleteTarget(null);
      load();
    } catch (err: any) {
      showToast.error('Delete failed', err.message || 'Could not delete profile.');
    } finally { setDeleting(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
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
        showToast.success('Profile updated', 'Changes saved successfully.');
      } else {
        await createFounderAdmin(fd);
        showToast.success('Profile created', 'New team member added.');
      }
      closeModal();
      load();
    } catch (err: any) {
      showToast.error('Save failed', err.message || 'Could not save profile.');
    } finally { setSaving(false); }
  };

  const visible = filter === 'all' ? founders : founders.filter(f => f.type === filter);
  const founderCount = founders.filter(f => f.type === 'founder').length;
  const cofounderCount = founders.filter(f => f.type === 'cofounder').length;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, color: '#fafafa', marginBottom: '0.4rem' }}>Founders & Executive Team</h1>
          <p style={{ color: '#71717a', fontSize: '0.875rem' }}>Manage founder and co-founder profiles, biographies, and photos.</p>
        </div>
        <button onClick={openCreate} style={adminBtn.primary()}><Plus size={16} /> Add Profile</button>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {([
          { key: 'all' as const, label: `All (${founders.length})` },
          { key: 'founder' as const, label: `Founders (${founderCount})` },
          { key: 'cofounder' as const, label: `Co-Founders (${cofounderCount})` },
        ]).map(tab => (
          <button key={tab.key} onClick={() => setFilter(tab.key)} style={{
            background: filter === tab.key ? '#fafafa' : '#18181b',
            color: filter === tab.key ? '#000' : '#71717a',
            border: 'none', padding: '0.4rem 0.85rem', borderRadius: 6,
            fontSize: '0.8rem', fontWeight: filter === tab.key ? 700 : 400, cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}>{tab.label}</button>
        ))}
      </div>

      {loading ? (
        <AdminLoading text="Loading team members..." />
      ) : visible.length === 0 ? (
        <div style={{ background: '#09090b', border: '1px dashed #27272a', borderRadius: 16, padding: '4rem 2rem', textAlign: 'center' }}>
          <Users size={40} style={{ margin: '0 auto 1rem', color: '#3f3f46' }} />
          <h3 style={{ color: '#fafafa', marginBottom: '0.5rem' }}>No profiles yet</h3>
          <p style={{ color: '#71717a', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Add the first founder or co-founder profile.</p>
          <button onClick={openCreate} style={adminBtn.primary()}>Add First Profile</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {visible.map(f => (
            <FounderCard key={f._id} founder={f} onEdit={() => openEdit(f)} onDelete={() => setDeleteTarget(f)} />
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <AdminModal
        open={modalOpen}
        onClose={closeModal}
        title={editingId ? 'Edit Profile' : 'Add New Profile'}
        subtitle="Team member details and social links"
        icon={<Users size={18} />}
        maxWidth="720px"
        footer={
          <>
            <button onClick={closeModal} style={adminBtn.secondary()}>Cancel</button>
            <button onClick={handleSubmit} disabled={saving} style={adminBtn.primary(saving)}>
              {saving && <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />}
              {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Create Profile'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0.85rem' }}>
            <div>
              <label style={adminLabel}>Role Type</label>
              <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value as any })} style={{ ...adminInput, cursor: 'pointer' }}>
                <option value="founder">Founder / CEO</option>
                <option value="cofounder">Co-Founder / Executive</option>
              </select>
            </div>
            <div>
              <label style={adminLabel}>Full Name <span style={{ color: '#f87171' }}>*</span></label>
              <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} style={adminInput} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.85rem' }}>
            <div>
              <label style={adminLabel}>Title <span style={{ color: '#f87171' }}>*</span></label>
              <input type="text" required placeholder="e.g. Chief Executive Officer" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} style={adminInput} />
            </div>
            <div>
              <label style={adminLabel}>Experience</label>
              <input type="text" placeholder="e.g. 15+ Years" value={formData.experience} onChange={e => setFormData({ ...formData, experience: e.target.value })} style={adminInput} />
            </div>
          </div>

          <div>
            <label style={adminLabel}>Biography <span style={{ color: '#f87171' }}>*</span></label>
            <textarea required rows={3} value={formData.biography} onChange={e => setFormData({ ...formData, biography: e.target.value })} style={adminTextarea} />
          </div>

          <div>
            <label style={adminLabel}>Quote / Message</label>
            <textarea rows={2} value={formData.messageFromFounder} onChange={e => setFormData({ ...formData, messageFromFounder: e.target.value })} style={adminTextarea} />
          </div>

          {/* Photo Upload */}
          <div>
            <label style={adminLabel}>Profile Photo</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: 64, height: 64, borderRadius: 10, background: '#18181b', border: '1px solid #27272a', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {imagePreview
                  ? <img src={imagePreview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <ImageIcon size={24} color="#3f3f46" />}
              </div>
              <label style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#0d0d0f', border: '1px dashed #3f3f46', borderRadius: 8, padding: '0.6rem 0.85rem', cursor: 'pointer', fontSize: '0.8rem', color: '#71717a' }}>
                <Upload size={14} />
                {imageFile ? imageFile.name : 'Click to upload JPG, PNG, WEBP'}
                <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={e => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setImageFile(file);
                  setImagePreview(URL.createObjectURL(file));
                }} style={{ display: 'none' }} />
              </label>
            </div>
          </div>

          {/* Achievements */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label style={adminLabel}>Achievements</label>
              <button type="button" onClick={() => setFormData({ ...formData, achievements: [...formData.achievements, ''] })} style={{ ...adminBtn.ghost, fontSize: '0.75rem', padding: '0.2rem 0.55rem' }}>+ Add</button>
            </div>
            {formData.achievements.map((ach, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <input type="text" value={ach} placeholder={`Achievement ${i + 1}`} onChange={e => { const a = [...formData.achievements]; a[i] = e.target.value; setFormData({ ...formData, achievements: a }); }} style={{ ...adminInput, flex: 1 }} />
                <button type="button" onClick={() => { const a = [...formData.achievements]; a.splice(i, 1); setFormData({ ...formData, achievements: a }); }} style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer', padding: '0.4rem' }}>
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          {/* Education */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label style={adminLabel}>Education</label>
              <button type="button" onClick={() => setFormData({ ...formData, education: [...formData.education, { degree: '', institution: '', year: '' }] })} style={{ ...adminBtn.ghost, fontSize: '0.75rem', padding: '0.2rem 0.55rem' }}>+ Add</button>
            </div>
            {formData.education.map((edu, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr auto', gap: '0.5rem', marginBottom: '0.4rem', alignItems: 'center' }}>
                <input type="text" placeholder="Degree" value={edu.degree} onChange={e => { const ed = [...formData.education]; ed[i] = { ...ed[i], degree: e.target.value }; setFormData({ ...formData, education: ed }); }} style={adminInput} />
                <input type="text" placeholder="Institution" value={edu.institution} onChange={e => { const ed = [...formData.education]; ed[i] = { ...ed[i], institution: e.target.value }; setFormData({ ...formData, education: ed }); }} style={adminInput} />
                <input type="text" placeholder="Year" value={edu.year} onChange={e => { const ed = [...formData.education]; ed[i] = { ...ed[i], year: e.target.value }; setFormData({ ...formData, education: ed }); }} style={adminInput} />
                <button type="button" onClick={() => { const ed = [...formData.education]; ed.splice(i, 1); setFormData({ ...formData, education: ed }); }} style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer' }}><Trash2 size={14} /></button>
              </div>
            ))}
          </div>

          {/* Social Links */}
          <div>
            <label style={adminLabel}>Social Links</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              {(['linkedin', 'twitter', 'instagram', 'website'] as const).map(key => (
                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#0d0d0f', border: '1px solid #27272a', borderRadius: 8, padding: '0 0.75rem' }}>
                  <span style={{ color: '#3f3f46', flexShrink: 0 }}>
                    {key === 'linkedin' ? <Linkedin size={14} /> : key === 'twitter' ? <Twitter size={14} /> : key === 'instagram' ? <Instagram size={14} /> : <Globe size={14} />}
                  </span>
                  <input type="text" placeholder={key.charAt(0).toUpperCase() + key.slice(1)} value={(formData.socialLinks as any)[key]} onChange={e => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, [key]: e.target.value } })}
                    style={{ ...adminInput, border: 'none', padding: '0.65rem 0', background: 'transparent' }} />
                </div>
              ))}
            </div>
          </div>
        </form>
      </AdminModal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Profile"
        description={`Are you sure you want to delete ${deleteTarget?.name}'s profile? This cannot be undone.`}
        confirmLabel="Delete Profile"
        loading={deleting}
      />

      <style jsx>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

/* Founder Card */
function FounderCard({ founder: f, onEdit, onDelete }: { founder: FounderData; onEdit: () => void; onDelete: () => void }) {
  const isFounder = f.type === 'founder';
  return (
    <div style={{ background: '#09090b', border: '1px solid #18181b', borderRadius: 14, overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'border-color 0.15s' }}
      onMouseEnter={e => e.currentTarget.style.borderColor = '#27272a'}
      onMouseLeave={e => e.currentTarget.style.borderColor = '#18181b'}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', padding: '1.15rem 1.15rem 0.85rem' }}>
        <div style={{ width: 52, height: 52, borderRadius: 10, background: '#18181b', border: '1px solid #27272a', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {f.profileImage
            ? <img src={f.profileImage} alt={f.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <Users size={22} color="#3f3f46" />}
        </div>
        <div style={{ minWidth: 0 }}>
          <span style={{ display: 'inline-block', fontSize: '0.6rem', padding: '0.15rem 0.45rem', borderRadius: 4, background: isFounder ? 'rgba(255,255,255,0.08)' : '#18181b', color: isFounder ? '#d4d4d8' : '#71717a', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.25rem', border: '1px solid #27272a' }}>
            {isFounder ? 'Founder' : 'Co-Founder'}
          </span>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fafafa', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{f.name}</h3>
          <p style={{ fontSize: '0.7rem', color: '#52525b', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{f.title}</p>
        </div>
      </div>

      <p style={{ fontSize: '0.8rem', color: '#71717a', lineHeight: 1.5, margin: '0 1.15rem 0.85rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {f.biography || <span style={{ color: '#3f3f46', fontStyle: 'italic' }}>No biography added.</span>}
      </p>

      {f.achievements?.length > 0 && (
        <div style={{ margin: '0 1.15rem 0.85rem', display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
          {f.achievements.slice(0, 2).map((a, i) => (
            <span key={i} style={{ fontSize: '0.65rem', background: '#18181b', border: '1px solid #27272a', color: '#a1a1aa', padding: '0.15rem 0.45rem', borderRadius: 4, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a}</span>
          ))}
          {f.achievements.length > 2 && <span style={{ fontSize: '0.65rem', color: '#3f3f46', padding: '0.15rem 0.25rem' }}>+{f.achievements.length - 2}</span>}
        </div>
      )}

      {f.socialLinks && Object.values(f.socialLinks).some(Boolean) && (
        <div style={{ display: 'flex', gap: '0.5rem', padding: '0 1.15rem 0.85rem' }}>
          {f.socialLinks.linkedin && <a href={f.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: '#3f3f46' }}><Linkedin size={14} /></a>}
          {f.socialLinks.twitter && <a href={f.socialLinks.twitter} target="_blank" rel="noopener noreferrer" style={{ color: '#3f3f46' }}><Twitter size={14} /></a>}
          {f.socialLinks.instagram && <a href={f.socialLinks.instagram} target="_blank" rel="noopener noreferrer" style={{ color: '#3f3f46' }}><Instagram size={14} /></a>}
          {f.socialLinks.website && <a href={f.socialLinks.website} target="_blank" rel="noopener noreferrer" style={{ color: '#3f3f46' }}><Globe size={14} /></a>}
        </div>
      )}

      <div style={{ marginTop: 'auto', padding: '0.75rem 1.15rem', background: '#0d0d0f', borderTop: '1px solid #18181b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.65rem', color: '#27272a', fontFamily: 'monospace' }}>ID ...{f._id.slice(-6)}</span>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <button onClick={onEdit} style={adminBtn.ghost}><Edit2 size={12} /> Edit</button>
          <button onClick={onDelete} style={adminBtn.danger}><Trash2 size={12} /></button>
        </div>
      </div>
    </div>
  );
}
