'use client';
import React, { useEffect, useState } from 'react';
import { fetchAllGalleryAdmin, createGalleryItemAdmin, deleteGalleryItemAdmin } from '@/lib/api';
import type { GalleryItemData } from '@/lib/types';
import { Plus, Trash2, Image as ImageIcon, Video, FileText, CheckCircle2, AlertCircle, X, Filter } from 'lucide-react';

export default function GalleryManagerPage() {
  const [items, setItems] = useState<GalleryItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFolder, setSelectedFolder] = useState('ALL');
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form State
  const [file, setFile] = useState<File | null>(null);
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGallery();
  }, []);

  const handleDelete = async (id: string, itemTitle: string) => {
    if (!confirm(`Are you sure you want to delete media "${itemTitle}"?`)) return;
    try {
      await deleteGalleryItemAdmin(id);
      setMessage({ type: 'success', text: 'Media item deleted successfully.' });
      loadGallery();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to delete media.' });
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setSaving(true);
    setMessage(null);
    try {
      const payload = new FormData();
      payload.append('file', file);
      payload.append('title', title || file.name);
      payload.append('folder', folder);
      payload.append('type', type);
      if (caption) payload.append('caption', caption);

      const tagsArray = tags.split(',').map(t => t.trim()).filter(Boolean);
      payload.append('tags', JSON.stringify(tagsArray));

      await createGalleryItemAdmin(payload);
      setMessage({ type: 'success', text: 'New media item uploaded successfully!' });
      setModalOpen(false);
      setFile(null);
      setTitle('');
      setCaption('');
      setTags('');
      loadGallery();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to upload media item.' });
    } finally {
      setSaving(false);
    }
  };

  const folders = ['ALL', 'Corporate', 'Architecture', 'Events', 'Team', 'Projects'];
  const filteredItems = items.filter(it => selectedFolder === 'ALL' || it.folder?.toLowerCase() === selectedFolder.toLowerCase());

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, color: '#fff', marginBottom: '0.4rem' }}>
            Media Gallery & Asset Library
          </h1>
          <p style={{ color: '#888', fontSize: '0.875rem' }}>
            Centralized Cloudinary media repository for corporate images, video reels, and architectural blueprints.
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          style={{ background: '#fff', color: '#000', border: 'none', padding: '0.75rem 1.25rem', borderRadius: 8, fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <Plus size={16} /> Upload New Media
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

      {/* Folder Filter Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        <Filter size={16} color="#888" style={{ marginRight: '0.4rem' }} />
        {folders.map(f => (
          <button
            key={f}
            onClick={() => setSelectedFolder(f)}
            style={{
              background: selectedFolder === f ? '#fff' : '#171717',
              color: selectedFolder === f ? '#000' : '#aaa',
              border: 'none',
              padding: '0.45rem 0.85rem',
              borderRadius: 6,
              fontSize: '0.8rem',
              fontWeight: selectedFolder === f ? 600 : 400,
              cursor: 'pointer',
            }}
          >
            {f === 'ALL' ? 'All Folders' : f}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#888' }}>Loading asset library...</div>
      ) : filteredItems.length === 0 ? (
        <div style={{ background: '#121212', border: '1px solid #222', borderRadius: 16, padding: '4rem 2rem', textAlign: 'center' }}>
          <ImageIcon size={44} style={{ margin: '0 auto 1rem', color: '#555' }} />
          <h3 style={{ color: '#fff', marginBottom: '0.5rem' }}>No media assets in this folder</h3>
          <p style={{ color: '#888', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Upload your first high-resolution corporate asset.</p>
          <button onClick={() => setModalOpen(true)} style={{ background: '#fff', color: '#000', border: 'none', padding: '0.65rem 1.25rem', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>
            Upload Media Now
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
          {filteredItems.map((item, i) => (
            <div key={item._id || i} style={{ background: '#121212', border: '1px solid #222', borderRadius: 14, overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ position: 'relative', height: '180px', background: '#181818', overflow: 'hidden' }}>
                  {item.type === 'video' ? (
                    <video src={item.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted loop playsInline />
                  ) : item.type === 'pdf' ? (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
                      <FileText size={44} />
                    </div>
                  ) : (
                    <img src={item.url} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  )}
                  <div style={{ position: 'absolute', top: '0.6rem', left: '0.6rem', background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)', padding: '0.2rem 0.5rem', borderRadius: 4, fontSize: '0.65rem', color: '#fff', fontWeight: 600, textTransform: 'uppercase' }}>
                    {item.folder || 'General'}
                  </div>
                </div>

                <div style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
                    {item.type === 'video' ? <Video size={14} color="#facc15" /> : item.type === 'pdf' ? <FileText size={14} color="#ff6b6b" /> : <ImageIcon size={14} color="#4ade80" />}
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.title}
                    </h4>
                  </div>
                  {item.caption && <p style={{ fontSize: '0.75rem', color: '#888', margin: 0, lineHeight: 1.4 }}>{item.caption}</p>}
                </div>
              </div>

              <div style={{ padding: '0.75rem 1rem', background: '#161616', borderTop: '1px solid #1f1f1f', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: '#666', textTransform: 'uppercase' }}>{item.type}</span>
                <button
                  onClick={() => handleDelete(item._id, item.title)}
                  style={{ background: 'transparent', color: '#ff6b6b', border: '1px solid rgba(255,107,107,0.3)', padding: '0.35rem 0.6rem', borderRadius: 6, fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                >
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#121212', border: '1px solid #282828', borderRadius: 16, width: '100%', maxWidth: '540px', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #1f1f1f', paddingBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', margin: 0 }}>Upload Asset to Gallery</h3>
              <button onClick={() => setModalOpen(false)} style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '0.3rem' }}>Select Asset File</label>
                <input
                  type="file"
                  required
                  accept="image/*,video/*,application/pdf"
                  onChange={e => {
                    const f = e.target.files?.[0];
                    if (f) {
                      setFile(f);
                      if (!title) setTitle(f.name.split('.')[0]);
                      if (f.type.startsWith('video/')) setType('video');
                      else if (f.type === 'application/pdf') setType('pdf');
                      else setType('image');
                    }
                  }}
                  style={{ width: '100%', background: '#181818', border: '1px solid #2c2c2c', borderRadius: 8, padding: '0.65rem', color: '#fff', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '0.3rem' }}>Asset Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    style={{ width: '100%', background: '#181818', border: '1px solid #2c2c2c', borderRadius: 8, padding: '0.65rem', color: '#fff', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '0.3rem' }}>Asset Type</label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value as any)}
                    style={{ width: '100%', background: '#181818', border: '1px solid #2c2c2c', borderRadius: 8, padding: '0.65rem', color: '#fff', fontSize: '0.85rem' }}
                  >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                    <option value="pdf">Document (PDF)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '0.3rem' }}>Target Folder</label>
                <select
                  value={folder}
                  onChange={e => setFolder(e.target.value)}
                  style={{ width: '100%', background: '#181818', border: '1px solid #2c2c2c', borderRadius: 8, padding: '0.65rem', color: '#fff', fontSize: '0.85rem' }}
                >
                  {folders.filter(f => f !== 'ALL').map(fo => (
                    <option key={fo} value={fo}>{fo}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '0.3rem' }}>Caption / Description</label>
                <input
                  type="text"
                  placeholder="e.g. Headquarters architectural blueprint view"
                  value={caption}
                  onChange={e => setCaption(e.target.value)}
                  style={{ width: '100%', background: '#181818', border: '1px solid #2c2c2c', borderRadius: 8, padding: '0.65rem', color: '#fff', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '0.3rem' }}>Tags (comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Headquarters, Corporate, Design"
                  value={tags}
                  onChange={e => setTags(e.target.value)}
                  style={{ width: '100%', background: '#181818', border: '1px solid #2c2c2c', borderRadius: 8, padding: '0.65rem', color: '#fff', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem', borderTop: '1px solid #1f1f1f', paddingTop: '1.25rem' }}>
                <button type="button" onClick={() => setModalOpen(false)} style={{ background: 'transparent', border: '1px solid #333', color: '#aaa', padding: '0.65rem 1.25rem', borderRadius: 8, cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit" disabled={saving || !file} style={{ background: '#fff', color: '#000', border: 'none', padding: '0.65rem 1.5rem', borderRadius: 8, fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer' }}>
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
