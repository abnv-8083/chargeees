'use client';
import React, { useEffect, useState, useCallback } from 'react';
import {
  fetchAllProjectsAdmin, createProjectAdmin, updateProjectAdmin,
  deleteProjectAdmin, addProjectGalleryAdmin,
} from '@/lib/api';
import { showToast } from '@/lib/toast';
import type { ProjectData } from '@/lib/types';
import { AdminModal, ConfirmDialog, AdminLoading } from '@/app/admin/components';
import { adminInput, adminTextarea, adminSelect, adminLabel, adminBtn } from '@/app/admin/components/adminStyles';
import {
  Plus, Edit2, Trash2, Briefcase, Star, Search, Filter,
  Image as ImageIcon, Upload, Loader2,
} from 'lucide-react';

const CATEGORIES = ['ALL', 'Architecture & Infrastructure', 'Digital Ecosystems', 'Corporate Transformation', 'AI & Machine Learning', 'Consulting & Strategy'];

export default function ProjectsManagerPage() {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [galleryModalOpen, setGalleryModalOpen] = useState<ProjectData | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ProjectData | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '', slug: '', description: '',
    category: 'Architecture & Infrastructure',
    status: 'completed' as 'ongoing' | 'completed' | 'upcoming' | 'on-hold',
    completionDate: '2024', client: '', featured: false, tags: '',
  });
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [galleryFile, setGalleryFile] = useState<File | null>(null);
  const [galleryPreview, setGalleryPreview] = useState<string | null>(null);
  const [galleryCaption, setGalleryCaption] = useState('');

  const loadProjects = async () => {
    setLoading(true);
    try {
      const res = await fetchAllProjectsAdmin();
      setProjects(Array.isArray(res) ? res : res?.data || []);
    } catch { setProjects([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadProjects(); }, []);

  const openCreate = () => {
    setEditingId(null);
    setFormData({
      title: '', slug: '', description: '',
      category: 'Architecture & Infrastructure',
      status: 'completed', completionDate: '2024', client: '',
      featured: false, tags: 'Innovation, Enterprise, Scalable',
    });
    setCoverFile(null);
    setCoverPreview(null);
    setModalOpen(true);
  };

  const openEdit = (proj: ProjectData) => {
    setEditingId(proj._id);
    setFormData({
      title: proj.title || '', slug: proj.slug || '',
      description: proj.description || '',
      category: proj.category || 'Architecture & Infrastructure',
      status: proj.status || 'completed',
      completionDate: proj.completionDate || '', client: proj.client || '',
      featured: Boolean(proj.featured),
      tags: proj.tags?.join(', ') || '',
    });
    setCoverFile(null);
    setCoverPreview(proj.coverImage || null);
    setModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteProjectAdmin(deleteTarget._id);
      showToast.success('Project deleted', `"${deleteTarget.title}" has been removed.`);
      setDeleteTarget(null);
      loadProjects();
    } catch (err: any) {
      showToast.error('Delete failed', err.message || 'Could not delete project.');
    } finally { setDeleting(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = new FormData();
      payload.append('title', formData.title);
      payload.append('slug', formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
      payload.append('description', formData.description);
      payload.append('category', formData.category);
      payload.append('status', formData.status);
      if (formData.completionDate) payload.append('completionDate', formData.completionDate);
      if (formData.client) payload.append('client', formData.client);
      payload.append('featured', String(formData.featured));
      payload.append('tags', JSON.stringify(formData.tags.split(',').map(t => t.trim()).filter(Boolean)));
      if (coverFile) payload.append('coverImage', coverFile);

      if (editingId) {
        await updateProjectAdmin(editingId, payload);
        showToast.success('Project updated', 'Changes saved successfully.');
      } else {
        await createProjectAdmin(payload);
        showToast.success('Project published', 'New case study is now live.');
      }
      setModalOpen(false);
      loadProjects();
    } catch (err: any) {
      showToast.error('Save failed', err.message || 'Could not save project.');
    } finally { setSaving(false); }
  };

  const handleAddGalleryImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryModalOpen || !galleryFile) return;
    setSaving(true);
    try {
      const payload = new FormData();
      payload.append('file', galleryFile);
      if (galleryCaption) payload.append('caption', galleryCaption);
      await addProjectGalleryAdmin(galleryModalOpen._id, payload);
      showToast.success('Image attached', 'Gallery image added successfully.');
      setGalleryModalOpen(null);
      setGalleryFile(null);
      setGalleryPreview(null);
      setGalleryCaption('');
      loadProjects();
    } catch (err: any) {
      showToast.error('Upload failed', err.message || 'Could not attach gallery image.');
    } finally { setSaving(false); }
  };

  const filteredProjects = projects.filter(p => {
    const matchCat = filterCategory === 'ALL' || p.category === filterCategory;
    const matchSearch = !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, color: '#fafafa', marginBottom: '0.4rem' }}>
            Projects & Case Studies
          </h1>
          <p style={{ color: '#71717a', fontSize: '0.875rem' }}>
            Manage published work, client case studies, and project galleries.
          </p>
        </div>
        <button onClick={openCreate} style={adminBtn.primary()}>
          <Plus size={16} /> Publish New Project
        </button>
      </div>

      {/* Filter & Search */}
      <div style={{ background: '#09090b', border: '1px solid #18181b', borderRadius: 12, padding: '0.85rem 1rem', display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
          <Filter size={14} color="#52525b" />
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setFilterCategory(cat)} style={{
              background: filterCategory === cat ? '#fafafa' : '#18181b',
              color: filterCategory === cat ? '#000' : '#71717a',
              border: 'none', padding: '0.35rem 0.7rem', borderRadius: 6,
              fontSize: '0.75rem', fontWeight: filterCategory === cat ? 600 : 400, cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}>
              {cat === 'ALL' ? 'All' : cat}
            </button>
          ))}
        </div>
        <div style={{ position: 'relative', width: '220px' }}>
          <Search size={14} style={{ position: 'absolute', left: '0.7rem', top: '50%', transform: 'translateY(-50%)', color: '#52525b' }} />
          <input type="text" placeholder="Search projects..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            style={{ width: '100%', background: '#0d0d0f', border: '1px solid #27272a', borderRadius: 8, padding: '0.45rem 0.75rem 0.45rem 2rem', color: '#fafafa', fontSize: '0.8rem' }} />
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <AdminLoading text="Loading project portfolio..." />
      ) : filteredProjects.length === 0 ? (
        <div style={{ background: '#09090b', border: '1px dashed #27272a', borderRadius: 16, padding: '4rem 2rem', textAlign: 'center' }}>
          <Briefcase size={40} style={{ margin: '0 auto 1rem', color: '#3f3f46' }} />
          <h3 style={{ color: '#fafafa', fontSize: '1.1rem', marginBottom: '0.5rem' }}>No projects found</h3>
          <p style={{ color: '#71717a', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Create your first case study to get started.</p>
          <button onClick={openCreate} style={adminBtn.primary()}>Publish First Project</button>
        </div>
      ) : (
        <div style={{ background: '#09090b', border: '1px solid #18181b', borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#0d0d0f', borderBottom: '1px solid #18181b' }}>
                  {['Project Details', 'Category', 'Status', 'Gallery', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '0.85rem 1rem', fontSize: '0.7rem', color: '#52525b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', ...(h === 'Actions' ? { textAlign: 'right' as const } : {}) }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((proj, i) => (
                  <tr key={proj._id || i} style={{ borderBottom: '1px solid #18181b', transition: 'background 0.1s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#0d0d0f'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: 44, height: 44, borderRadius: 8, background: '#18181b', overflow: 'hidden', flexShrink: 0, border: '1px solid #27272a' }}>
                          {proj.coverImage
                            ? <img src={proj.coverImage} alt={proj.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3f3f46' }}><Briefcase size={18} /></div>}
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fafafa', margin: 0 }}>{proj.title}</h4>
                            {proj.featured && <Star size={12} color="#facc15" fill="#facc15" />}
                          </div>
                          <p style={{ fontSize: '0.7rem', color: '#52525b', margin: 0 }}>/{proj.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{ fontSize: '0.7rem', background: '#18181b', color: '#a1a1aa', padding: '0.2rem 0.55rem', borderRadius: 5, fontWeight: 500 }}>{proj.category}</span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                        <span style={{ fontSize: '0.7rem', color: proj.status === 'completed' ? '#4ade80' : '#facc15', fontWeight: 600, textTransform: 'uppercase' }}>
                          {proj.status} ({proj.completionDate || 'N/A'})
                        </span>
                        <span style={{ fontSize: '0.7rem', color: '#52525b' }}>{proj.client || 'Internal'}</span>
                      </div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.8rem', color: '#71717a' }}>{(proj.gallery || []).length}</span>
                        <button onClick={() => { setGalleryFile(null); setGalleryPreview(null); setGalleryCaption(''); setGalleryModalOpen(proj); }} style={adminBtn.ghost}>
                          <ImageIcon size={12} /> Attach
                        </button>
                      </div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <button onClick={() => openEdit(proj)} style={adminBtn.ghost}><Edit2 size={13} /> Edit</button>
                        <button onClick={() => setDeleteTarget(proj)} style={adminBtn.danger}><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Project Modal */}
      <AdminModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Edit Project' : 'Publish New Project'}
        subtitle="Case study details and cover image"
        icon={<Briefcase size={18} />}
        maxWidth="720px"
        footer={
          <>
            <button onClick={() => setModalOpen(false)} style={adminBtn.secondary()}>Cancel</button>
            <button onClick={handleSubmit} disabled={saving} style={adminBtn.primary(saving)}>
              {saving && <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />}
              {saving ? 'Saving...' : 'Save Project'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.85rem' }}>
            <div>
              <label style={adminLabel}>Project Title</label>
              <input type="text" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} style={adminInput} />
            </div>
            <div>
              <label style={adminLabel}>Category</label>
              <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} style={adminSelect}>
                {CATEGORIES.filter(c => c !== 'ALL').map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.85rem' }}>
            <div>
              <label style={adminLabel}>Status</label>
              <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value as any })} style={adminSelect}>
                <option value="completed">Completed</option>
                <option value="ongoing">Ongoing</option>
                <option value="upcoming">Upcoming</option>
                <option value="on-hold">On-Hold</option>
              </select>
            </div>
            <div>
              <label style={adminLabel}>Year / Date</label>
              <input type="text" placeholder="e.g. 2024" value={formData.completionDate} onChange={e => setFormData({ ...formData, completionDate: e.target.value })} style={adminInput} />
            </div>
            <div>
              <label style={adminLabel}>Client</label>
              <input type="text" placeholder="e.g. Fortune 500 Bank" value={formData.client} onChange={e => setFormData({ ...formData, client: e.target.value })} style={adminInput} />
            </div>
          </div>

          <div>
            <label style={adminLabel}>Project Overview</label>
            <textarea rows={4} required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} style={adminTextarea} />
          </div>

          <div>
            <label style={adminLabel}>Tags (comma-separated)</label>
            <input type="text" placeholder="Enterprise, Scalable, AI" value={formData.tags} onChange={e => setFormData({ ...formData, tags: e.target.value })} style={adminInput} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <input type="checkbox" id="featured" checked={formData.featured} onChange={e => setFormData({ ...formData, featured: e.target.checked })} style={{ width: 16, height: 16, accentColor: '#38bdf8' }} />
            <label htmlFor="featured" style={{ fontSize: '0.85rem', color: '#d4d4d8', fontWeight: 500, cursor: 'pointer' }}>Featured Project</label>
          </div>

          {/* Cover Image Upload */}
          <div>
            <label style={adminLabel}>Cover Image</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: 72, height: 54, borderRadius: 8, background: '#18181b', border: '1px solid #27272a', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {coverPreview
                  ? <img src={coverPreview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <ImageIcon size={20} color="#3f3f46" />}
              </div>
              <label style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#0d0d0f', border: '1px dashed #3f3f46', borderRadius: 8, padding: '0.6rem 0.85rem', cursor: 'pointer', fontSize: '0.8rem', color: '#71717a', transition: 'border-color 0.15s' }}>
                <Upload size={14} />
                {coverFile ? coverFile.name : 'Click to upload JPG, PNG, WEBP'}
                <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={e => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  setCoverFile(f);
                  setCoverPreview(URL.createObjectURL(f));
                }} style={{ display: 'none' }} />
              </label>
            </div>
          </div>
        </form>
      </AdminModal>

      {/* Gallery Image Modal */}
      <AdminModal
        open={!!galleryModalOpen}
        onClose={() => { setGalleryModalOpen(null); setGalleryFile(null); setGalleryPreview(null); setGalleryCaption(''); }}
        title={`Attach Media${galleryModalOpen ? ` to "${galleryModalOpen.title}"` : ''}`}
        icon={<ImageIcon size={18} />}
        maxWidth="480px"
        footer={
          <>
            <button onClick={() => { setGalleryModalOpen(null); setGalleryFile(null); setGalleryPreview(null); setGalleryCaption(''); }} style={adminBtn.secondary()}>Cancel</button>
            <button onClick={handleAddGalleryImage} disabled={saving || !galleryFile} style={adminBtn.primary(saving)}>
              {saving ? 'Uploading...' : 'Attach to Gallery'}
            </button>
          </>
        }
      >
        <form onSubmit={handleAddGalleryImage} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={adminLabel}>Select Image</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: 64, height: 48, borderRadius: 8, background: '#18181b', border: '1px solid #27272a', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {galleryPreview
                  ? <img src={galleryPreview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <ImageIcon size={18} color="#3f3f46" />}
              </div>
              <label style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#0d0d0f', border: '1px dashed #3f3f46', borderRadius: 8, padding: '0.6rem 0.85rem', cursor: 'pointer', fontSize: '0.8rem', color: '#71717a' }}>
                <Upload size={14} />
                {galleryFile ? galleryFile.name : 'Click to upload image'}
                <input type="file" required accept="image/jpeg,image/png,image/webp,image/gif" onChange={e => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  setGalleryFile(f);
                  setGalleryPreview(URL.createObjectURL(f));
                }} style={{ display: 'none' }} />
              </label>
            </div>
          </div>
          <div>
            <label style={adminLabel}>Caption (Optional)</label>
            <input type="text" placeholder="e.g. Interior control room view" value={galleryCaption} onChange={e => setGalleryCaption(e.target.value)} style={adminInput} />
          </div>
        </form>
      </AdminModal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Project"
        description={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone and will remove all associated gallery images.`}
        confirmLabel="Delete Project"
        loading={deleting}
      />

      <style jsx>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
