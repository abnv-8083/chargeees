'use client';
import React, { useEffect, useState } from 'react';
import { fetchAllGalleryAdmin, createGalleryItemAdmin, deleteGalleryItemAdmin } from '@/lib/api';
import type { GalleryItemData } from '@/lib/types';
import { showToast } from '@/lib/toast';
import {
  Plus, Trash2, Image as ImageIcon, Video, FileText, CheckCircle2,
  AlertCircle, X, Filter, Upload, Sparkles, Tag, Eye
} from 'lucide-react';

export default function GalleryManagerPage() {
  const [items, setItems] = useState<GalleryItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFolder, setSelectedFolder] = useState('ALL');
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewMedia, setPreviewMedia] = useState<GalleryItemData | null>(null);

  // Form State
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [folder, setFolder] = useState('Corporate');
  const [type, setType] = useState<'image' | 'video' | 'pdf'>('image');
  const [caption, setCaption] = useState('');
  const [tags, setTags] = useState('');

  const loadGallery = async () => {
    setLoading(true);
    try {
      const res = await fetchAllGalleryAdmin();
      setItems(Array.isArray(res) ? res : res?.data || []);
    } catch (e) {
      setItems([]);
      showToast.error('Failed to load media showcase.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGallery();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      if (selected.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => setFilePreview(reader.result as string);
        reader.readAsDataURL(selected);
      } else {
        setFilePreview(null);
      }
    }
  };

  const handleDelete = async (id: string, itemTitle: string) => {
    if (!window.confirm(`Are you sure you want to delete media "${itemTitle}"?`)) return;
    try {
      await deleteGalleryItemAdmin(id);
      showToast.success(`Media item "${itemTitle}" deleted successfully.`);
      loadGallery();
    } catch (err: any) {
      showToast.error(err.message || 'Failed to delete media.');
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      showToast.error('Please select a file to upload.');
      return;
    }
    setSaving(true);
    try {
      const payload = new FormData();
      payload.append('file', file);
      payload.append('title', title || file.name);
      payload.append('folder', folder);
      payload.append('type', type);
      if (caption) payload.append('caption', caption);
      if (tags) {
        const tagsArr = tags.split(',').map(t => t.trim()).filter(Boolean);
        payload.append('tags', JSON.stringify(tagsArr));
      }

      await createGalleryItemAdmin(payload);
      showToast.success('Media asset uploaded successfully!');
      setModalOpen(false);
      setFile(null);
      setFilePreview(null);
      setTitle('');
      setCaption('');
      setTags('');
      loadGallery();
    } catch (err: any) {
      showToast.error(err.message || 'Failed to upload media asset.');
    } finally {
      setSaving(false);
    }
  };

  const FOLDERS = ['ALL', 'Corporate', 'EV Charging', 'Architecture', 'Infrastructure', 'Press'];

  const filteredItems = items.filter(i => selectedFolder === 'ALL' || i.folder === selectedFolder);

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.25rem', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#34d399', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>
            <ImageIcon size={16} /> Asset Repository
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>
            Media & Gallery Showcase
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            High-resolution photography, video assets, project captures, and media archives.
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          style={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
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
            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
            transition: 'all 0.2s ease',
          }}
        >
          <Upload size={18} /> Upload Media Asset
        </button>
      </div>

      {/* Filter Bar */}
      <div style={{ background: '#09090b', border: '1px solid #1c1c21', borderRadius: 16, padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.75rem' }}>
        <Filter size={15} color="#71717a" style={{ marginRight: '0.25rem' }} />
        {FOLDERS.map(f => (
          <button
            key={f}
            onClick={() => setSelectedFolder(f)}
            style={{
              background: selectedFolder === f ? 'rgba(52, 211, 153, 0.15)' : '#121215',
              color: selectedFolder === f ? '#34d399' : '#a1a1aa',
              border: selectedFolder === f ? '1px solid rgba(52, 211, 153, 0.3)' : '1px solid #1c1c21',
              padding: '0.45rem 0.85rem',
              borderRadius: 8,
              fontSize: '0.775rem',
              fontWeight: selectedFolder === f ? 600 : 500,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {f === 'ALL' ? 'All Collections' : f}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      {loading ? (
        <div style={{ padding: '4rem 0', textAlign: 'center', color: '#71717a' }}>
          <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p style={{ fontSize: '0.875rem' }}>Loading media showcase...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div style={{ background: '#09090b', border: '1px dashed #22222a', borderRadius: 16, padding: '4rem 1.5rem', textAlign: 'center', color: '#71717a' }}>
          <ImageIcon size={40} style={{ margin: '0 auto 0.75rem', opacity: 0.5 }} />
          <p style={{ fontSize: '1rem', fontWeight: 600, color: '#e4e4e7', margin: '0 0 0.25rem' }}>No media items found in this collection</p>
          <p style={{ fontSize: '0.825rem', margin: 0 }}>Click "Upload Media Asset" to add new photos or videos.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
          {filteredItems.map(item => (
            <div
              key={item._id}
              style={{
                background: '#09090b',
                border: '1px solid #1c1c21',
                borderRadius: 16,
                overflow: 'hidden',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s ease, border-color 0.2s ease',
              }}
              className="gallery-card"
            >
              {/* Media Thumbnail Container */}
              <div style={{ height: '200px', background: '#121215', position: 'relative', overflow: 'hidden' }}>
                {item.url ? (
                  <img src={item.url} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#52525b' }}>
                    <ImageIcon size={36} />
                  </div>
                )}

                <div style={{ position: 'absolute', top: '0.65rem', left: '0.65rem', display: 'flex', gap: '0.35rem' }}>
                  <span style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)', color: '#34d399', border: '1px solid rgba(52,211,153,0.3)', padding: '0.15rem 0.5rem', borderRadius: 6, fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase' }}>
                    {item.folder || 'General'}
                  </span>
                </div>

                <div style={{ position: 'absolute', top: '0.65rem', right: '0.65rem', display: 'flex', gap: '0.35rem' }}>
                  <button
                    onClick={() => handleDelete(item._id, item.title)}
                    title="Delete Media"
                    style={{ background: 'rgba(239, 68, 68, 0.85)', backdropFilter: 'blur(4px)', border: 'none', color: '#fff', padding: '0.35rem', borderRadius: 6, cursor: 'pointer', display: 'flex' }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {/* Title & Caption */}
              <div style={{ padding: '1rem' }}>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 600, color: '#fff', margin: '0 0 0.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.title}
                </h4>
                {item.caption && (
                  <p style={{ fontSize: '0.775rem', color: '#9ca3af', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.caption}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#09090b', border: '1px solid #27272a', borderRadius: 20, width: '100%', maxWidth: '520px', padding: '2rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 700, color: '#fff', margin: 0 }}>
                Upload Media Asset
              </h2>
              <button onClick={() => setModalOpen(false)} style={{ background: '#18181b', border: 'none', color: '#a1a1aa', padding: '0.4rem', borderRadius: 8, cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#d4d4d8', marginBottom: '0.4rem' }}>Media File *</label>
                <input
                  type="file"
                  required
                  accept="image/*,video/*,application/pdf"
                  onChange={handleFileChange}
                  style={{ width: '100%', background: '#121215', border: '1px solid #22222a', borderRadius: 10, padding: '0.6rem', color: '#a1a1aa', fontSize: '0.8rem' }}
                />
                {filePreview && (
                  <div style={{ marginTop: '0.75rem', height: '140px', borderRadius: 10, overflow: 'hidden', border: '1px solid #27272a' }}>
                    <img src={filePreview} alt="Upload Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#d4d4d8', marginBottom: '0.4rem' }}>Asset Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Executive Headquarters Architecture"
                  style={{ width: '100%', background: '#121215', border: '1px solid #22222a', borderRadius: 10, padding: '0.65rem 0.9rem', color: '#fff', fontSize: '0.875rem', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#d4d4d8', marginBottom: '0.4rem' }}>Collection / Folder</label>
                  <select
                    value={folder}
                    onChange={e => setFolder(e.target.value)}
                    style={{ width: '100%', background: '#121215', border: '1px solid #22222a', borderRadius: 10, padding: '0.65rem 0.9rem', color: '#fff', fontSize: '0.875rem', outline: 'none' }}
                  >
                    {FOLDERS.filter(f => f !== 'ALL').map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#d4d4d8', marginBottom: '0.4rem' }}>Media Type</label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value as any)}
                    style={{ width: '100%', background: '#121215', border: '1px solid #22222a', borderRadius: 10, padding: '0.65rem 0.9rem', color: '#fff', fontSize: '0.875rem', outline: 'none' }}
                  >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                    <option value="pdf">PDF Document</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#d4d4d8', marginBottom: '0.4rem' }}>Caption / Subtitle</label>
                <input
                  type="text"
                  value={caption}
                  onChange={e => setCaption(e.target.value)}
                  placeholder="Optional brief description for lightbox caption..."
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
                  style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', border: 'none', color: '#fff', padding: '0.65rem 1.4rem', borderRadius: 10, fontSize: '0.85rem', fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer' }}
                >
                  {saving ? 'Uploading...' : 'Upload Media Asset'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
