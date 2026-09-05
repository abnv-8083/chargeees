'use client';
import React, { useEffect, useState } from 'react';
import { fetchAllGalleryAdmin, createGalleryItemAdmin, updateGalleryItemAdmin, deleteGalleryItemAdmin } from '@/lib/api';
import { showToast } from '@/lib/toast';
import type { GalleryItemData } from '@/lib/types';
import { AdminModal, ConfirmDialog, AdminLoading } from '@/app/admin/components';
import { adminInput, adminSelect, adminLabel, adminBtn } from '@/app/admin/components/adminStyles';
import { Plus, Trash2, Pencil, Image as ImageIcon, Video, FileText, Filter, Upload, Loader2 } from 'lucide-react';

const folders = ['ALL', 'Corporate', 'Architecture', 'Events', 'Team', 'Projects'];

export default function GalleryManagerPage() {
  const [items, setItems] = useState<GalleryItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFolder, setSelectedFolder] = useState('ALL');
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItemData | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<GalleryItemData | null>(null);
  const [deleting, setDeleting] = useState(false);

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
    } catch { setItems([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadGallery(); }, []);

  const openCreateModal = () => {
    resetForm();
    setEditingItem(null);
    setModalOpen(true);
  };

  const openEditModal = (item: GalleryItemData) => {
    setEditingItem(item);
    setFile(null);
    setFilePreview(item.url || null);
    setTitle(item.title || '');
    setFolder(item.folder || 'Corporate');
    setType((item.type as any) || 'image');
    setCaption(item.caption || '');
    setTags(Array.isArray(item.tags) ? item.tags.join(', ') : item.tags || '');
    setModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteGalleryItemAdmin(deleteTarget._id);
      showToast.success('Media deleted', `"${deleteTarget.title}" has been removed.`);
      setDeleteTarget(null);
      loadGallery();
    } catch (err: any) {
      showToast.error('Delete failed', err.message || 'Could not delete media.');
    } finally { setDeleting(false); }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem && !file) {
      showToast.error('File required', 'Please select a file to upload.');
      return;
    }
    setSaving(true);
    try {
      const payload = new FormData();
      if (file) payload.append('file', file);
      payload.append('title', title || (file ? file.name : 'Untitled'));
      payload.append('folder', folder);
      payload.append('type', type);
      payload.append('caption', caption);
      payload.append('tags', JSON.stringify(tags.split(',').map(t => t.trim()).filter(Boolean)));

      if (editingItem) {
        await updateGalleryItemAdmin(editingItem._id, payload);
        showToast.success('Media updated', `"${title}" asset updated successfully.`);
      } else {
        await createGalleryItemAdmin(payload);
        showToast.success('Media uploaded', 'New asset added to gallery.');
      }
      setModalOpen(false);
      resetForm();
      loadGallery();
    } catch (err: any) {
      showToast.error(editingItem ? 'Update failed' : 'Upload failed', err.message || 'Action failed.');
    } finally { setSaving(false); }
  };

  const resetForm = () => {
    setFile(null);
    setFilePreview(null);
    setTitle('');
    setCaption('');
    setTags('');
    setFolder('Corporate');
    setType('image');
    setEditingItem(null);
  };

  const filteredItems = items.filter(it => selectedFolder === 'ALL' || it.folder?.toLowerCase() === selectedFolder.toLowerCase());

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, color: '#fafafa', marginBottom: '0.4rem' }}>Media Gallery</h1>
          <p style={{ color: '#71717a', fontSize: '0.875rem' }}>Centralized media repository for images, videos, and documents.</p>
        </div>
        <button onClick={openCreateModal} style={adminBtn.primary()}><Plus size={16} /> Upload Media</button>
      </div>

      {/* Folder Filters */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <Filter size={14} color="#52525b" style={{ marginRight: '0.25rem' }} />
        {folders.map(f => (
          <button key={f} onClick={() => setSelectedFolder(f)} style={{
            background: selectedFolder === f ? '#fafafa' : '#18181b',
            color: selectedFolder === f ? '#000' : '#71717a',
            border: 'none', padding: '0.35rem 0.75rem', borderRadius: 6,
            fontSize: '0.75rem', fontWeight: selectedFolder === f ? 600 : 400, cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}>{f === 'ALL' ? 'All' : f}</button>
        ))}
      </div>

      {loading ? (
        <AdminLoading text="Loading media library..." />
      ) : filteredItems.length === 0 ? (
        <div style={{ background: '#09090b', border: '1px dashed #27272a', borderRadius: 16, padding: '4rem 2rem', textAlign: 'center' }}>
          <ImageIcon size={40} style={{ margin: '0 auto 1rem', color: '#3f3f46' }} />
          <h3 style={{ color: '#fafafa', marginBottom: '0.5rem' }}>No media in this folder</h3>
          <p style={{ color: '#71717a', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Upload your first asset to get started.</p>
          <button onClick={openCreateModal} style={adminBtn.primary()}>Upload Now</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
          {filteredItems.map((item, i) => (
            <div key={item._id || i} style={{ background: '#09090b', border: '1px solid #18181b', borderRadius: 14, overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'border-color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#27272a'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#18181b'}>
              <div>
                <div style={{ position: 'relative', height: '170px', background: '#0d0d0f', overflow: 'hidden' }}>
                  {item.type === 'video' ? (
                    <video src={item.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted loop playsInline />
                  ) : item.type === 'pdf' ? (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#52525b' }}><FileText size={36} /></div>
                  ) : (
                    <img src={item.url} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  )}
                  <div style={{ position: 'absolute', top: '0.5rem', left: '0.5rem', background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)', padding: '0.15rem 0.45rem', borderRadius: 4, fontSize: '0.6rem', color: '#d4d4d8', fontWeight: 600, textTransform: 'uppercase' }}>
                    {item.folder || 'General'}
                  </div>
                </div>
                <div style={{ padding: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.2rem' }}>
                    {item.type === 'video' ? <Video size={13} color="#facc15" /> : item.type === 'pdf' ? <FileText size={13} color="#f87171" /> : <ImageIcon size={13} color="#4ade80" />}
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fafafa', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</h4>
                  </div>
                  {item.caption && <p style={{ fontSize: '0.7rem', color: '#52525b', margin: 0, lineHeight: 1.4 }}>{item.caption}</p>}
                </div>
              </div>
              <div style={{ padding: '0.65rem 0.85rem', background: '#0d0d0f', borderTop: '1px solid #18181b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.65rem', color: '#3f3f46', textTransform: 'uppercase' }}>{item.type}</span>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <button onClick={() => openEditModal(item)} style={adminBtn.secondary()}><Pencil size={11} /> Edit</button>
                  <button onClick={() => setDeleteTarget(item)} style={adminBtn.danger}><Trash2 size={11} /> Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      <AdminModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? 'Edit Media Asset' : 'Upload Media'}
        subtitle={editingItem ? 'Update metadata or replace media file' : 'Add a new asset to the gallery'}
        icon={<ImageIcon size={18} />}
        maxWidth="520px"
        footer={
          <>
            <button onClick={() => setModalOpen(false)} style={adminBtn.secondary()}>Cancel</button>
            <button type="button" onClick={handleSave} disabled={saving || (!editingItem && !file)} style={adminBtn.primary(saving)}>
              {saving && <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />}
              {saving ? (editingItem ? 'Saving...' : 'Uploading...') : (editingItem ? 'Save Changes' : 'Upload Media')}
            </button>
          </>
        }
      >
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* File upload / replacement */}
          <div>
            <label style={adminLabel}>{editingItem ? 'Replace File (Optional)' : 'Select File'}</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {filePreview && (
                <div style={{ width: 56, height: 42, borderRadius: 6, background: '#18181b', border: '1px solid #27272a', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {type === 'video' ? <Video size={16} color="#facc15" /> : type === 'pdf' ? <FileText size={16} color="#f87171" /> : <img src={filePreview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                </div>
              )}
              <label style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#0d0d0f', border: '1px dashed #3f3f46', borderRadius: 8, padding: '0.6rem 0.85rem', cursor: 'pointer', fontSize: '0.8rem', color: '#71717a' }}>
                <Upload size={14} />
                {file ? file.name : editingItem ? 'Click to replace image, video, or PDF' : 'Click to upload image, video, or PDF'}
                <input type="file" required={!editingItem} accept="image/*,video/*,application/pdf" onChange={e => {
                  const f = e.target.files?.[0];
                  if (f) {
                    setFile(f);
                    if (f.type.startsWith('video/')) { setType('video'); setFilePreview(null); }
                    else if (f.type === 'application/pdf') { setType('pdf'); setFilePreview(null); }
                    else { setType('image'); setFilePreview(URL.createObjectURL(f)); }
                    if (!title) setTitle(f.name.split('.')[0]);
                  }
                }} style={{ display: 'none' }} />
              </label>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.85rem' }}>
            <div>
              <label style={adminLabel}>Title</label>
              <input type="text" required value={title} onChange={e => setTitle(e.target.value)} style={adminInput} />
            </div>
            <div>
              <label style={adminLabel}>Type</label>
              <select value={type} onChange={e => setType(e.target.value as any)} style={adminSelect}>
                <option value="image">Image</option>
                <option value="video">Video</option>
                <option value="pdf">Document</option>
              </select>
            </div>
          </div>
          <div>
            <label style={adminLabel}>Folder</label>
            <select value={folder} onChange={e => setFolder(e.target.value)} style={adminSelect}>
              {folders.filter(f => f !== 'ALL').map(fo => <option key={fo} value={fo}>{fo}</option>)}
            </select>
          </div>
          <div>
            <label style={adminLabel}>Caption</label>
            <input type="text" placeholder="Optional description" value={caption} onChange={e => setCaption(e.target.value)} style={adminInput} />
          </div>
          <div>
            <label style={adminLabel}>Tags (comma-separated)</label>
            <input type="text" placeholder="Corporate, Design, HQ" value={tags} onChange={e => setTags(e.target.value)} style={adminInput} />
          </div>
        </form>
      </AdminModal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Media"
        description={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmLabel="Delete Media"
        loading={deleting}
      />

      <style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
