'use client';
import React, { useEffect, useState } from 'react';
import { fetchAllProjectsAdmin, createProjectAdmin, updateProjectAdmin, deleteProjectAdmin, addProjectGalleryAdmin } from '@/lib/api';
import type { ProjectData } from '@/lib/types';
import { showToast } from '@/lib/toast';
import {
  Plus, Edit2, Trash2, Briefcase, CheckCircle2, AlertCircle, X,
  Image as ImageIcon, Star, Filter, Search, Calendar, Tag, User, Sparkles
} from 'lucide-react';

export default function ProjectsManagerPage() {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [galleryModalOpen, setGalleryModalOpen] = useState<ProjectData | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

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
  const [galleryCaption, setGalleryCaption] = useState('');

  const loadProjects = async () => {
    setLoading(true);
    try {
      const res = await fetchAllProjectsAdmin();
      setProjects(Array.isArray(res) ? res : res?.data || []);
    } catch (e) {
      setProjects([]);
      showToast.error('Failed to load portfolio projects.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setCoverPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

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
    if (!window.confirm(`Are you sure you want to delete project: "${title}"?`)) return;

    try {
      await deleteProjectAdmin(id);
      showToast.success(`Project "${title}" deleted successfully.`);
      loadProjects();
    } catch (err: any) {
      showToast.error(err.message || 'Failed to delete project.');
    }
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

      const tagsArray = formData.tags.split(',').map(t => t.trim()).filter(Boolean);
      payload.append('tags', JSON.stringify(tagsArray));

      if (coverFile) {
        payload.append('coverImage', coverFile);
      }

      if (editingId) {
        await updateProjectAdmin(editingId, payload);
        showToast.success('Project updated successfully!');
      } else {
        await createProjectAdmin(payload);
        showToast.success('New project published successfully!');
      }
      setModalOpen(false);
      loadProjects();
    } catch (err: any) {
      showToast.error(err.message || 'Failed to save project.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddGalleryImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryModalOpen || !galleryFile) {
      showToast.error('Please select a file to attach.');
      return;
    }
    setSaving(true);
    try {
      const payload = new FormData();
      payload.append('file', galleryFile);
      if (galleryCaption) payload.append('caption', galleryCaption);
      await addProjectGalleryAdmin(galleryModalOpen._id, payload);
      showToast.success('Gallery image attached successfully!');
      setGalleryModalOpen(null);
      setGalleryFile(null);
      setGalleryCaption('');
      loadProjects();
    } catch (err: any) {
      showToast.error(err.message || 'Failed to attach gallery image.');
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
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.25rem', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#38bdf8', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>
            <Briefcase size={16} /> Portfolio Manager
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>
            Projects & Case Studies
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Manage published work, client case studies, category classifications, and gallery photos.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          style={{
            background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
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
            boxShadow: '0 4px 14px rgba(56, 189, 248, 0.35)',
            transition: 'all 0.2s ease',
          }}
        >
          <Plus size={18} /> Publish New Project
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div style={{ background: '#09090b', border: '1px solid #1c1c21', borderRadius: 16, padding: '1rem 1.25rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
          <Filter size={15} color="#71717a" style={{ marginRight: '0.2rem' }} />
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              style={{
                background: filterCategory === cat ? 'rgba(56, 189, 248, 0.15)' : '#121215',
                color: filterCategory === cat ? '#38bdf8' : '#a1a1aa',
                border: filterCategory === cat ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid #1c1c21',
                padding: '0.45rem 0.85rem',
                borderRadius: 8,
                fontSize: '0.775rem',
                fontWeight: filterCategory === cat ? 600 : 500,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {cat === 'ALL' ? 'All Categories' : cat}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', minWidth: '240px' }}>
          <Search size={15} color="#71717a" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              background: '#121215',
              border: '1px solid #1c1c21',
              borderRadius: 8,
              padding: '0.45rem 0.85rem 0.45rem 2.3rem',
              color: '#fff',
              fontSize: '0.8125rem',
              outline: 'none',
            }}
          />
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div style={{ padding: '4rem 0', textAlign: 'center', color: '#71717a' }}>
          <div className="w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p style={{ fontSize: '0.875rem' }}>Loading portfolio projects...</p>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div style={{ background: '#09090b', border: '1px dashed #22222a', borderRadius: 16, padding: '4rem 1.5rem', textAlign: 'center', color: '#71717a' }}>
          <Briefcase size={40} style={{ margin: '0 auto 0.75rem', opacity: 0.5 }} />
          <p style={{ fontSize: '1rem', fontWeight: 600, color: '#e4e4e7', margin: '0 0 0.25rem' }}>No projects match your filter</p>
          <p style={{ fontSize: '0.825rem', margin: 0 }}>Try clearing your search query or category selection.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {filteredProjects.map(proj => (
            <div
              key={proj._id}
              style={{
                background: '#09090b',
                border: '1px solid #1c1c21',
                borderRadius: 16,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
              }}
              className="project-card"
            >
              {/* Cover Image Header */}
              <div style={{ height: '180px', width: '100%', position: 'relative', background: '#121215', overflow: 'hidden' }}>
                {proj.coverImage ? (
                  <img src={proj.coverImage} alt={proj.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#52525b', gap: '0.4rem' }}>
                    <ImageIcon size={32} />
                    <span style={{ fontSize: '0.75rem' }}>No Cover Uploaded</span>
                  </div>
                )}

                <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  <span style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)', color: '#38bdf8', border: '1px solid rgba(56,189,248,0.3)', padding: '0.2rem 0.55rem', borderRadius: 6, fontSize: '0.675rem', fontWeight: 700, textTransform: 'uppercase' }}>
                    {proj.category}
                  </span>
                  {proj.featured && (
                    <span style={{ background: 'rgba(251,191,36,0.2)', backdropFilter: 'blur(6px)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.4)', padding: '0.2rem 0.55rem', borderRadius: 6, fontSize: '0.675rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                      <Star size={10} fill="#fbbf24" /> Featured
                    </span>
                  )}
                </div>

                <span style={{ position: 'absolute', bottom: '0.75rem', right: '0.75rem', background: 'rgba(0,0,0,0.85)', color: proj.status === 'completed' ? '#34d399' : '#fbbf24', padding: '0.2rem 0.55rem', borderRadius: 6, fontSize: '0.675rem', fontWeight: 700, textTransform: 'uppercase' }}>
                  {proj.status}
                </span>
              </div>

              {/* Card Body */}
              <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 700, color: '#fff', margin: '0 0 0.4rem' }}>
                    {proj.title}
                  </h3>
                  <p style={{ fontSize: '0.825rem', color: '#9ca3af', margin: '0 0 1rem', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {proj.description}
                  </p>

                  {/* Meta Tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.25rem' }}>
                    {proj.tags?.map((t, idx) => (
                      <span key={idx} style={{ background: '#121215', border: '1px solid #1c1c21', color: '#a1a1aa', padding: '0.15rem 0.5rem', borderRadius: 6, fontSize: '0.7rem' }}>
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions Footer */}
                <div style={{ borderTop: '1px solid #1c1c21', paddingTop: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <button
                    onClick={() => setGalleryModalOpen(proj)}
                    style={{ background: '#121215', border: '1px solid #22222a', color: '#d4d4d8', padding: '0.4rem 0.75rem', borderRadius: 8, fontSize: '0.75rem', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <ImageIcon size={14} color="#38bdf8" /> Gallery ({proj.gallery?.length || 0})
                  </button>

                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button
                      onClick={() => handleOpenEdit(proj)}
                      style={{ background: '#18181b', border: '1px solid #27272a', color: '#fff', padding: '0.4rem 0.65rem', borderRadius: 8, fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                    >
                      <Edit2 size={13} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(proj._id, proj.title)}
                      style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.25)', color: '#f87171', padding: '0.4rem 0.65rem', borderRadius: 8, fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Project Modal */}
      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#09090b', border: '1px solid #27272a', borderRadius: 20, width: '100%', maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 700, color: '#fff', margin: 0 }}>
                {editingId ? 'Edit Project Details' : 'Publish New Project'}
              </h2>
              <button onClick={() => setModalOpen(false)} style={{ background: '#18181b', border: 'none', color: '#a1a1aa', padding: '0.4rem', borderRadius: 8, cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#d4d4d8', marginBottom: '0.4rem' }}>Project Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Next-Gen EV Charging Network"
                  style={{ width: '100%', background: '#121215', border: '1px solid #22222a', borderRadius: 10, padding: '0.65rem 0.9rem', color: '#fff', fontSize: '0.875rem', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#d4d4d8', marginBottom: '0.4rem' }}>Category</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    style={{ width: '100%', background: '#121215', border: '1px solid #22222a', borderRadius: 10, padding: '0.65rem 0.9rem', color: '#fff', fontSize: '0.875rem', outline: 'none' }}
                  >
                    {CATEGORIES.filter(c => c !== 'ALL').map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#d4d4d8', marginBottom: '0.4rem' }}>Status</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                    style={{ width: '100%', background: '#121215', border: '1px solid #22222a', borderRadius: 10, padding: '0.65rem 0.9rem', color: '#fff', fontSize: '0.875rem', outline: 'none' }}
                  >
                    <option value="completed">Completed</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="on-hold">On Hold</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#d4d4d8', marginBottom: '0.4rem' }}>Description & Overview *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed summary of the project scope, technical solutions delivered, and client impact..."
                  style={{ width: '100%', background: '#121215', border: '1px solid #22222a', borderRadius: 10, padding: '0.65rem 0.9rem', color: '#fff', fontSize: '0.875rem', outline: 'none', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#d4d4d8', marginBottom: '0.4rem' }}>Client Name</label>
                  <input
                    type="text"
                    value={formData.client}
                    onChange={e => setFormData({ ...formData, client: e.target.value })}
                    placeholder="e.g. EnergyCorp Global"
                    style={{ width: '100%', background: '#121215', border: '1px solid #22222a', borderRadius: 10, padding: '0.65rem 0.9rem', color: '#fff', fontSize: '0.875rem', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#d4d4d8', marginBottom: '0.4rem' }}>Completion Date / Year</label>
                  <input
                    type="text"
                    value={formData.completionDate}
                    onChange={e => setFormData({ ...formData, completionDate: e.target.value })}
                    placeholder="e.g. Q3 2025"
                    style={{ width: '100%', background: '#121215', border: '1px solid #22222a', borderRadius: 10, padding: '0.65rem 0.9rem', color: '#fff', fontSize: '0.875rem', outline: 'none' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#d4d4d8', marginBottom: '0.4rem' }}>Tags (comma-separated)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={e => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="EV Charging, Smart Grid, Hardware, Cloud API"
                  style={{ width: '100%', background: '#121215', border: '1px solid #22222a', borderRadius: 10, padding: '0.65rem 0.9rem', color: '#fff', fontSize: '0.875rem', outline: 'none' }}
                />
              </div>

              {/* Cover Photo Upload Preview */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#d4d4d8', marginBottom: '0.4rem' }}>Cover Banner Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverFileChange}
                  style={{ width: '100%', background: '#121215', border: '1px solid #22222a', borderRadius: 10, padding: '0.5rem', color: '#a1a1aa', fontSize: '0.8rem' }}
                />
                {coverPreview && (
                  <div style={{ marginTop: '0.75rem', height: '120px', borderRadius: 10, overflow: 'hidden', border: '1px solid #27272a' }}>
                    <img src={coverPreview} alt="Cover Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.5rem 0' }}>
                <input
                  type="checkbox"
                  id="featured-check"
                  checked={formData.featured}
                  onChange={e => setFormData({ ...formData, featured: e.target.checked })}
                  style={{ width: 16, height: 16, accentColor: '#38bdf8', cursor: 'pointer' }}
                />
                <label htmlFor="featured-check" style={{ fontSize: '0.85rem', color: '#fff', cursor: 'pointer', fontWeight: 500 }}>
                  Feature this project on landing page showcase
                </label>
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
                  style={{ background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)', border: 'none', color: '#fff', padding: '0.65rem 1.4rem', borderRadius: 10, fontSize: '0.85rem', fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer' }}
                >
                  {saving ? 'Saving...' : editingId ? 'Update Project' : 'Publish Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Gallery File Modal */}
      {galleryModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#09090b', border: '1px solid #27272a', borderRadius: 20, width: '100%', maxWidth: '480px', padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 700, color: '#fff', margin: 0 }}>
                Add Gallery Media to "{galleryModalOpen.title}"
              </h3>
              <button onClick={() => setGalleryModalOpen(null)} style={{ background: '#18181b', border: 'none', color: '#a1a1aa', padding: '0.4rem', borderRadius: 8, cursor: 'pointer' }}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddGalleryImage} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#d4d4d8', marginBottom: '0.4rem' }}>Select Image File *</label>
                <input
                  type="file"
                  accept="image/*"
                  required
                  onChange={e => setGalleryFile(e.target.files?.[0] || null)}
                  style={{ width: '100%', background: '#121215', border: '1px solid #22222a', borderRadius: 10, padding: '0.5rem', color: '#a1a1aa', fontSize: '0.8rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#d4d4d8', marginBottom: '0.4rem' }}>Caption / Label</label>
                <input
                  type="text"
                  value={galleryCaption}
                  onChange={e => setGalleryCaption(e.target.value)}
                  placeholder="e.g. On-site installation architecture"
                  style={{ width: '100%', background: '#121215', border: '1px solid #22222a', borderRadius: 10, padding: '0.65rem 0.9rem', color: '#fff', fontSize: '0.85rem', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setGalleryModalOpen(null)}
                  style={{ background: '#121215', border: '1px solid #22222a', color: '#a1a1aa', padding: '0.6rem 1.1rem', borderRadius: 10, fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{ background: '#38bdf8', border: 'none', color: '#000', padding: '0.6rem 1.25rem', borderRadius: 10, fontSize: '0.85rem', fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer' }}
                >
                  {saving ? 'Uploading...' : 'Upload Media'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
