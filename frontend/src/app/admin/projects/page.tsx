'use client';
import React, { useEffect, useState } from 'react';
import { fetchAllProjectsAdmin, createProjectAdmin, updateProjectAdmin, deleteProjectAdmin, addProjectGalleryAdmin } from '@/lib/api';
import type { ProjectData } from '@/lib/types';
import { Plus, Edit2, Trash2, Briefcase, CheckCircle2, AlertCircle, X, Image as ImageIcon, Star, Filter, Search } from 'lucide-react';

export default function ProjectsManagerPage() {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [galleryModalOpen, setGalleryModalOpen] = useState<ProjectData | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    category: 'Architecture & Infrastructure',
    status: 'completed' as 'ongoing' | 'completed' | 'upcoming' | 'on-hold',
    completionDate: '2024',
    client: '',
    featured: false,
    tags: '',
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
    } catch (e) {
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      title: '',
      slug: '',
      description: '',
      category: 'Architecture & Infrastructure',
      status: 'completed',
      completionDate: '2024',
      client: '',
      featured: false,
      tags: 'Innovation, Enterprise, Scalable',
    });
    setCoverFile(null);
    setCoverPreview(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (proj: ProjectData) => {
    setEditingId(proj._id);
    setFormData({
      title: proj.title || '',
      slug: proj.slug || '',
      description: proj.description || '',
      category: proj.category || 'Architecture & Infrastructure',
      status: proj.status || 'completed',
      completionDate: proj.completionDate || '',
      client: proj.client || '',
      featured: Boolean(proj.featured),
      tags: proj.tags?.join(', ') || '',
    });
    setCoverFile(null);
    setCoverPreview(proj.coverImage || null);
    setModalOpen(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete project: "${title}"?`)) return;
    try {
      await deleteProjectAdmin(id);
      setMessage({ type: 'success', text: 'Project deleted successfully.' });
      loadProjects();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to delete project.' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

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

      const tagsArray = formData.tags.split(',').map(t => t.trim()).filter(Boolean);
      payload.append('tags', JSON.stringify(tagsArray));

      if (coverFile) {
        payload.append('coverImage', coverFile);
      }

      if (editingId) {
        await updateProjectAdmin(editingId, payload);
        setMessage({ type: 'success', text: 'Project updated successfully.' });
      } else {
        await createProjectAdmin(payload);
        setMessage({ type: 'success', text: 'New project published successfully.' });
      }
      setModalOpen(false);
      loadProjects();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to save project.' });
    } finally {
      setSaving(false);
    }
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
      setMessage({ type: 'success', text: 'Gallery image attached successfully!' });
      setGalleryModalOpen(null);
      setGalleryFile(null);
      setGalleryPreview(null);
      setGalleryCaption('');
      loadProjects();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to attach gallery image.' });
    } finally {
      setSaving(false);
    }
  };

  const filteredProjects = projects.filter(p => {
    const matchCat = filterCategory === 'ALL' || p.category === filterCategory;
    const matchSearch = !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const CATEGORIES = ['ALL', 'Architecture & Infrastructure', 'Digital Ecosystems', 'Corporate Transformation', 'AI & Machine Learning', 'Consulting & Strategy'];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, color: '#fff', marginBottom: '0.4rem' }}>
            Projects & Case Studies Portfolio
          </h1>
          <p style={{ color: '#888', fontSize: '0.875rem' }}>
            Manage published work, client case studies, category classifications, and project galleries.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          style={{ background: '#fff', color: '#000', border: 'none', padding: '0.75rem 1.25rem', borderRadius: 8, fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <Plus size={16} /> Publish New Project
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

      {/* Filter & Search Bar */}
      <div style={{ background: '#121212', border: '1px solid #222', borderRadius: 12, padding: '1rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Filter size={16} color="#888" />
          <span style={{ fontSize: '0.8rem', color: '#888', marginRight: '0.5rem' }}>Category:</span>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              style={{
                background: filterCategory === cat ? '#fff' : '#1c1c1c',
                color: filterCategory === cat ? '#000' : '#aaa',
                border: 'none',
                padding: '0.4rem 0.75rem',
                borderRadius: 6,
                fontSize: '0.75rem',
                fontWeight: filterCategory === cat ? 600 : 400,
                cursor: 'pointer',
              }}
            >
              {cat === 'ALL' ? 'All Categories' : cat}
            </button>
          ))}
        </div>
        <div style={{ position: 'relative', width: '260px' }}>
          <Search size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ width: '100%', background: '#181818', border: '1px solid #2c2c2c', borderRadius: 8, padding: '0.45rem 1rem 0.45rem 2.2rem', color: '#fff', fontSize: '0.8rem' }}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#888' }}>Loading project portfolio...</div>
      ) : filteredProjects.length === 0 ? (
        <div style={{ background: '#121212', border: '1px solid #222', borderRadius: 16, padding: '4rem 2rem', textAlign: 'center' }}>
          <Briefcase size={44} style={{ margin: '0 auto 1rem', color: '#555' }} />
          <h3 style={{ color: '#fff', marginBottom: '0.5rem' }}>No matching projects found</h3>
          <p style={{ color: '#888', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Try choosing a different category or create your first project.</p>
          <button onClick={handleOpenCreate} style={{ background: '#fff', color: '#000', border: 'none', padding: '0.65rem 1.25rem', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>
            Publish First Project
          </button>
        </div>
      ) : (
        <div style={{ background: '#121212', border: '1px solid #222', borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#181818', borderBottom: '1px solid #222' }}>
                  <th style={{ padding: '1rem', fontSize: '0.75rem', color: '#888', fontWeight: 600, textTransform: 'uppercase' }}>Project Details</th>
                  <th style={{ padding: '1rem', fontSize: '0.75rem', color: '#888', fontWeight: 600, textTransform: 'uppercase' }}>Category</th>
                  <th style={{ padding: '1rem', fontSize: '0.75rem', color: '#888', fontWeight: 600, textTransform: 'uppercase' }}>Status & Client</th>
                  <th style={{ padding: '1rem', fontSize: '0.75rem', color: '#888', fontWeight: 600, textTransform: 'uppercase' }}>Gallery</th>
                  <th style={{ padding: '1rem', fontSize: '0.75rem', color: '#888', fontWeight: 600, textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((proj, i) => (
                  <tr key={proj._id || i} style={{ borderBottom: '1px solid #1f1f1f' }}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        <div style={{ width: 48, height: 48, borderRadius: 8, background: '#1f1f1f', overflow: 'hidden', flexShrink: 0, border: '1px solid #333' }}>
                          {proj.coverImage ? (
                            <img src={proj.coverImage} alt={proj.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}><Briefcase size={20} /></div>
                          )}
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#fff', margin: 0 }}>{proj.title}</h4>
                            {proj.featured && <span title="Featured Project" style={{ display: 'inline-flex' }}><Star size={13} color="#facc15" fill="#facc15" /></span>}
                          </div>
                          <p style={{ fontSize: '0.75rem', color: '#888', margin: 0 }}>/{proj.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ fontSize: '0.75rem', background: '#222', color: '#fff', padding: '0.25rem 0.6rem', borderRadius: 6, fontWeight: 500 }}>
                        {proj.category}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        <span style={{ fontSize: '0.75rem', color: proj.status === 'completed' ? '#4ade80' : '#facc15', fontWeight: 600, textTransform: 'uppercase' }}>
                          {proj.status} ({proj.completionDate || 'N/A'})
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#888' }}>{proj.client || 'Internal / Confidential'}</span>
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.8rem', color: '#ccc' }}>{(proj.gallery || []).length} items</span>
                        <button
                          onClick={() => setGalleryModalOpen(proj)}
                          title="Upload image to project gallery"
                          style={{ background: '#242424', color: '#fff', border: '1px solid #333', padding: '0.35rem 0.6rem', borderRadius: 6, fontSize: '0.7rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                        >
                          <ImageIcon size={12} /> + Attach
                        </button>
                      </div>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleOpenEdit(proj)}
                          style={{ background: '#242424', color: '#fff', border: '1px solid #333', padding: '0.45rem 0.75rem', borderRadius: 6, fontSize: '0.75rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                        >
                          <Edit2 size={13} /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(proj._id, proj.title)}
                          style={{ background: 'transparent', color: '#ff6b6b', border: '1px solid rgba(255,107,107,0.3)', padding: '0.45rem 0.6rem', borderRadius: 6, fontSize: '0.75rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Project Modal */}
      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#121212', border: '1px solid #282828', borderRadius: 16, width: '100%', maxWidth: '750px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #1f1f1f', paddingBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', margin: 0 }}>
                {editingId ? 'Edit Project / Case Study' : 'Publish New Case Study'}
              </h3>
              <button onClick={() => setModalOpen(false)} style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '0.3rem' }}>Project Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    style={{ width: '100%', background: '#181818', border: '1px solid #2c2c2c', borderRadius: 8, padding: '0.65rem', color: '#fff', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '0.3rem' }}>Category</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    style={{ width: '100%', background: '#181818', border: '1px solid #2c2c2c', borderRadius: 8, padding: '0.65rem', color: '#fff', fontSize: '0.85rem' }}
                  >
                    {CATEGORIES.filter(c => c !== 'ALL').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '0.3rem' }}>Status</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                    style={{ width: '100%', background: '#181818', border: '1px solid #2c2c2c', borderRadius: 8, padding: '0.65rem', color: '#fff', fontSize: '0.85rem' }}
                  >
                    <option value="completed">Completed</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="on-hold">On-Hold</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '0.3rem' }}>Year / Date</label>
                  <input
                    type="text"
                    placeholder="e.g. 2024"
                    value={formData.completionDate}
                    onChange={e => setFormData({ ...formData, completionDate: e.target.value })}
                    style={{ width: '100%', background: '#181818', border: '1px solid #2c2c2c', borderRadius: 8, padding: '0.65rem', color: '#fff', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '0.3rem' }}>Client / Partner</label>
                  <input
                    type="text"
                    placeholder="e.g. Fortune 500 Bank"
                    value={formData.client}
                    onChange={e => setFormData({ ...formData, client: e.target.value })}
                    style={{ width: '100%', background: '#181818', border: '1px solid #2c2c2c', borderRadius: 8, padding: '0.65rem', color: '#fff', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '0.3rem' }}>Detailed Project Overview & Outcomes</label>
                <textarea
                  rows={4}
                  required
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  style={{ width: '100%', background: '#181818', border: '1px solid #2c2c2c', borderRadius: 8, padding: '0.65rem', color: '#fff', fontSize: '0.85rem', fontFamily: 'inherit' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '0.3rem' }}>Tags (comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Enterprise, Scalable, Neural Networks"
                  value={formData.tags}
                  onChange={e => setFormData({ ...formData, tags: e.target.value })}
                  style={{ width: '100%', background: '#181818', border: '1px solid #2c2c2c', borderRadius: 8, padding: '0.65rem', color: '#fff', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={e => setFormData({ ...formData, featured: e.target.checked })}
                  style={{ width: 16, height: 16 }}
                />
                <label htmlFor="featured" style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 500, cursor: 'pointer' }}>
                  Mark as Featured Project on Portfolio Showcase
                </label>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '0.5rem' }}>Cover Image</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: 80, height: 60, borderRadius: 8, background: '#1a1a1a', border: '1px solid #2c2c2c', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {coverPreview
                      ? <img src={coverPreview} alt="cover preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <ImageIcon size={22} color="#444" />}
                  </div>
                  <label style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#181818', border: '1px dashed #3a3a3a', borderRadius: 8, padding: '0.65rem 1rem', cursor: 'pointer', fontSize: '0.82rem', color: '#aaa' }}>
                    <ImageIcon size={14} />
                    {coverFile ? coverFile.name : 'Click to upload JPG, PNG, WEBP (max 20 MB)'}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={e => {
                        const f = e.target.files?.[0];
                        if (!f) return;
                        setCoverFile(f);
                        setCoverPreview(URL.createObjectURL(f));
                      }}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem', borderTop: '1px solid #1f1f1f', paddingTop: '1.25rem' }}>
                <button type="button" onClick={() => setModalOpen(false)} style={{ background: 'transparent', border: '1px solid #333', color: '#aaa', padding: '0.65rem 1.25rem', borderRadius: 8, cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit" disabled={saving} style={{ background: '#fff', color: '#000', border: 'none', padding: '0.65rem 1.5rem', borderRadius: 8, fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer' }}>
                  {saving ? 'Saving...' : 'Save Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Attach Gallery Image Modal */}
      {galleryModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#121212', border: '1px solid #282828', borderRadius: 16, width: '100%', maxWidth: '480px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', margin: 0 }}>
                Attach Media to "{galleryModalOpen.title}"
              </h3>
              <button onClick={() => setGalleryModalOpen(null)} style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddGalleryImage} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '0.5rem' }}>Select Image File</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: 80, height: 60, borderRadius: 8, background: '#1a1a1a', border: '1px solid #2c2c2c', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {galleryPreview
                      ? <img src={galleryPreview} alt="gallery preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <ImageIcon size={22} color="#444" />}
                  </div>
                  <label style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#181818', border: '1px dashed #3a3a3a', borderRadius: 8, padding: '0.65rem 1rem', cursor: 'pointer', fontSize: '0.82rem', color: '#aaa' }}>
                    <ImageIcon size={14} />
                    {galleryFile ? galleryFile.name : 'Click to upload image (JPG, PNG, WEBP)'}
                    <input
                      type="file"
                      required
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={e => {
                        const f = e.target.files?.[0];
                        if (!f) return;
                        setGalleryFile(f);
                        setGalleryPreview(URL.createObjectURL(f));
                      }}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '0.3rem' }}>Caption (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Interior control room view"
                  value={galleryCaption}
                  onChange={e => setGalleryCaption(e.target.value)}
                  style={{ width: '100%', background: '#181818', border: '1px solid #2c2c2c', borderRadius: 8, padding: '0.65rem', color: '#fff', fontSize: '0.85rem' }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => { setGalleryModalOpen(null); setGalleryFile(null); setGalleryPreview(null); setGalleryCaption(''); }} style={{ background: 'transparent', border: '1px solid #333', color: '#aaa', padding: '0.5rem 1rem', borderRadius: 6, cursor: 'pointer', fontSize: '0.85rem' }}>
                  Cancel
                </button>
                <button type="submit" disabled={saving || !galleryFile} style={{ background: '#fff', color: '#000', border: 'none', padding: '0.5rem 1.25rem', borderRadius: 6, fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', fontSize: '0.85rem' }}>
                  {saving ? 'Uploading...' : 'Attach to Gallery'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
