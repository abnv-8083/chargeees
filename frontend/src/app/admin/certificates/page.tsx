'use client';
import React, { useState, useEffect } from 'react';
import { Award, Plus, Search, Trash2, Eye, Download, RefreshCw, X, Copy, Check, Loader2, Upload } from 'lucide-react';
import { adminGetCertificates, adminCreateCertificate, adminDeleteCertificate, adminGetUsers } from '@/lib/api';
import { showToast } from '@/lib/toast';
import type { CertificateData, UserData } from '@/lib/types';
import { AdminModal, ConfirmDialog, AdminLoading } from '@/app/admin/components';
import { adminInput, adminLabel, adminBtn } from '@/app/admin/components/adminStyles';

export default function AdminCertificatesPage() {
  const [certificates, setCertificates] = useState<CertificateData[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [previewCert, setPreviewCert] = useState<CertificateData | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CertificateData | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [formTitle, setFormTitle] = useState('');
  const [formCertNumber, setFormCertNumber] = useState('');
  const [formUser, setFormUser] = useState('');
  const [formIssuer, setFormIssuer] = useState('ChargEase');
  const [formIssueDate, setFormIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [formExpiryDate, setFormExpiryDate] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formFile, setFormFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [certRes, userRes] = await Promise.all([adminGetCertificates(), adminGetUsers().catch(() => [])]);
      setCertificates(certRes); setUsers(userRes);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  const handleGenerateCertNumber = () => {
    setFormCertNumber(`CERT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
  };

  const handleCopyNumber = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedId(num);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const resetForm = () => {
    setFormTitle(''); setFormCertNumber(''); setFormUser(''); setFormIssuer('ChargEase');
    setFormIssueDate(new Date().toISOString().split('T')[0]); setFormExpiryDate('');
    setFormDescription(''); setFormFile(null); setError('');
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!formTitle.trim()) { setError('Please provide a certificate title.'); return; }
    if (!formFile) { setError('Please upload a certificate file.'); return; }
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', formTitle);
      formData.append('certificateNumber', formCertNumber);
      if (formUser) formData.append('user', formUser);
      formData.append('issuer', formIssuer);
      formData.append('issueDate', formIssueDate);
      if (formExpiryDate) formData.append('expiryDate', formExpiryDate);
      formData.append('description', formDescription);
      formData.append('file', formFile);
      await adminCreateCertificate(formData);
      showToast.success('Certificate issued', `"${formTitle}" has been created.`);
      setModalOpen(false);
      resetForm();
      loadData();
    } catch (err: any) {
      showToast.error('Issue failed', err.message || 'Could not create certificate.');
    } finally { setSubmitting(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminDeleteCertificate(deleteTarget._id);
      showToast.success('Certificate deleted', 'Certificate has been revoked.');
      setDeleteTarget(null);
      loadData();
    } catch (err: any) {
      showToast.error('Delete failed', err.message || 'Could not delete certificate.');
    } finally { setDeleting(false); }
  };

  const filteredCertificates = certificates.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.certificateNumber.toLowerCase().includes(search.toLowerCase()) || (c.user && c.user.name.toLowerCase().includes(search.toLowerCase())) || c.issuer.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0, color: '#fafafa' }}>Certificates</h1>
          <p style={{ fontSize: '0.875rem', color: '#71717a', margin: '0.25rem 0 0' }}>Issue and manage client certificates.</p>
        </div>
        <button onClick={() => { resetForm(); handleGenerateCertNumber(); setModalOpen(true); }} style={adminBtn.primary()}>
          <Plus size={16} /> Issue Certificate
        </button>
      </div>

      {/* Search & Filter */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', background: '#09090b', padding: '0.85rem 1rem', borderRadius: 12, border: '1px solid #18181b' }}>
        <div style={{ flex: 1, minWidth: 220, position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '0.65rem', top: '50%', transform: 'translateY(-50%)', color: '#52525b' }} />
          <input type="text" placeholder="Search title, cert #, client..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '0.55rem 0.75rem 0.55rem 2.2rem', background: '#0d0d0f', border: '1px solid #27272a', borderRadius: 8, color: '#fafafa', fontSize: '0.85rem' }} />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ padding: '0.55rem 0.85rem', background: '#0d0d0f', border: '1px solid #27272a', borderRadius: 8, color: '#fafafa', fontSize: '0.85rem', cursor: 'pointer' }}>
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="revoked">Revoked</option>
          <option value="expired">Expired</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <AdminLoading text="Loading certificates..." />
      ) : filteredCertificates.length === 0 ? (
        <div style={{ padding: '3rem', textAlign: 'center', background: '#09090b', borderRadius: 12, border: '1px dashed #27272a' }}>
          <Award size={36} style={{ color: '#3f3f46', margin: '0 auto 0.75rem' }} />
          <h3 style={{ color: '#fafafa', fontSize: '1.1rem', margin: '0 0 0.25rem' }}>No Certificates</h3>
          <p style={{ color: '#52525b', fontSize: '0.85rem' }}>Issue your first certificate to get started.</p>
        </div>
      ) : (
        <div style={{ background: '#09090b', borderRadius: 12, border: '1px solid #18181b', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: '#0d0d0f', color: '#52525b', borderBottom: '1px solid #18181b' }}>
                <th style={{ padding: '0.8rem 1rem', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Certificate</th>
                <th style={{ padding: '0.8rem 1rem', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Cert #</th>
                <th style={{ padding: '0.8rem 1rem', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Client</th>
                <th style={{ padding: '0.8rem 1rem', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Dates</th>
                <th style={{ padding: '0.8rem 1rem', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Status</th>
                <th style={{ padding: '0.8rem 1rem', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCertificates.map(cert => (
                <tr key={cert._id} style={{ borderBottom: '1px solid #18181b', transition: 'background 0.1s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#0d0d0f'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <div style={{ padding: '0.4rem', background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.2)', borderRadius: 8, color: '#38bdf8', display: 'flex' }}><Award size={18} /></div>
                      <div>
                        <div style={{ fontWeight: 600, color: '#fafafa' }}>{cert.title}</div>
                        <div style={{ fontSize: '0.7rem', color: '#52525b' }}>Issuer: {cert.issuer}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <code style={{ background: '#0d0d0f', padding: '0.15rem 0.45rem', borderRadius: 4, color: '#38bdf8', fontSize: '0.8rem', fontWeight: 600 }}>{cert.certificateNumber}</code>
                      <button onClick={() => handleCopyNumber(cert.certificateNumber)} style={{ background: 'none', border: 'none', color: '#52525b', cursor: 'pointer', padding: 2 }}>
                        {copiedId === cert.certificateNumber ? <Check size={13} style={{ color: '#4ade80' }} /> : <Copy size={13} />}
                      </button>
                    </div>
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    {cert.user ? <div><div style={{ color: '#fafafa', fontWeight: 500 }}>{cert.user.name}</div><div style={{ fontSize: '0.7rem', color: '#52525b' }}>{cert.user.email}</div></div> :
                      <span style={{ fontSize: '0.7rem', color: '#eab308', background: 'rgba(234,179,8,0.08)', padding: '0.15rem 0.45rem', borderRadius: 10 }}>Unclaimed</span>}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: '#71717a', fontSize: '0.8rem' }}>
                    <div>Issued: {new Date(cert.issueDate).toLocaleDateString()}</div>
                    {cert.expiryDate && <div style={{ fontSize: '0.7rem', color: '#3f3f46' }}>Exp: {new Date(cert.expiryDate).toLocaleDateString()}</div>}
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span style={{ padding: '0.2rem 0.5rem', borderRadius: 10, fontSize: '0.7rem', fontWeight: 600, background: cert.status === 'active' ? 'rgba(74,222,128,0.12)' : 'rgba(239,68,68,0.12)', color: cert.status === 'active' ? '#4ade80' : '#f87171', border: `1px solid ${cert.status === 'active' ? 'rgba(74,222,128,0.25)' : 'rgba(239,68,68,0.25)'}` }}>
                      {cert.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.4rem' }}>
                      <button onClick={() => setPreviewCert(cert)} style={adminBtn.iconBtn} title="Preview"><Eye size={14} /></button>
                      <a href={cert.fileUrl} target="_blank" rel="noopener noreferrer" download style={{ ...adminBtn.iconBtn, color: '#38bdf8', textDecoration: 'none' }} title="Download"><Download size={14} /></a>
                      <button onClick={() => setDeleteTarget(cert)} style={{ ...adminBtn.iconBtn, borderColor: 'rgba(248,113,113,0.25)', color: '#f87171' }} title="Delete"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Issue Certificate Modal */}
      <AdminModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Issue New Certificate"
        subtitle="Create and upload a new certificate"
        icon={<Award size={18} />}
        maxWidth="580px"
        footer={
          <>
            <button onClick={() => setModalOpen(false)} style={adminBtn.secondary()}>Cancel</button>
            <button onClick={handleCreateSubmit} disabled={submitting} style={adminBtn.primary(submitting)}>
              {submitting && <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />}
              {submitting ? 'Uploading...' : 'Issue Certificate'}
            </button>
          </>
        }
      >
        {error && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', padding: '0.6rem 0.85rem', borderRadius: 8, color: '#f87171', fontSize: '0.8rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            {error}
          </div>
        )}
        <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          <div>
            <label style={adminLabel}>Certificate Title *</label>
            <input type="text" placeholder="e.g. EV Infrastructure Specialist" value={formTitle} onChange={e => setFormTitle(e.target.value)} required style={adminInput} />
          </div>
          <div>
            <label style={adminLabel}>Certificate Number</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input type="text" placeholder="CERT-2026-XXXX" value={formCertNumber} onChange={e => setFormCertNumber(e.target.value.toUpperCase())}
                style={{ ...adminInput, flex: 1, color: '#38bdf8', fontFamily: 'monospace', fontWeight: 600 }} />
              <button type="button" onClick={handleGenerateCertNumber} style={{ ...adminBtn.secondary(), whiteSpace: 'nowrap', padding: '0.6rem 0.85rem', fontSize: '0.8rem' }}>Auto</button>
            </div>
          </div>
          <div>
            <label style={adminLabel}>Assign to Client (Optional)</label>
            <select value={formUser} onChange={e => setFormUser(e.target.value)} style={{ ...adminInput, cursor: 'pointer' }}>
              <option value="">Unclaimed (Claimable by Cert #)</option>
              {users.map(u => <option key={u._id} value={u._id}>{u.name} ({u.email})</option>)}
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
            <div>
              <label style={adminLabel}>Issuer</label>
              <input type="text" value={formIssuer} onChange={e => setFormIssuer(e.target.value)} style={adminInput} />
            </div>
            <div>
              <label style={adminLabel}>Issue Date</label>
              <input type="date" value={formIssueDate} onChange={e => setFormIssueDate(e.target.value)} style={adminInput} />
            </div>
          </div>
          <div>
            <label style={adminLabel}>Certificate File (PDF or Image) *</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <label style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#0d0d0f', border: '1px dashed rgba(56,189,248,0.3)', borderRadius: 8, padding: '0.6rem 0.85rem', cursor: 'pointer', fontSize: '0.8rem', color: '#71717a' }}>
                <Upload size={14} style={{ color: '#38bdf8' }} />
                {formFile ? formFile.name : 'Click to upload PDF or image'}
                <input type="file" accept="application/pdf,image/*" required onChange={e => setFormFile(e.target.files ? e.target.files[0] : null)} style={{ display: 'none' }} />
              </label>
            </div>
          </div>
          <div>
            <label style={adminLabel}>Description / Notes</label>
            <textarea rows={3} placeholder="Optional details..." value={formDescription} onChange={e => setFormDescription(e.target.value)} style={{ ...adminInput, resize: 'vertical', minHeight: 70 }} />
          </div>
        </form>
      </AdminModal>

      {/* Preview Modal */}
      {previewCert && (
        <div onClick={() => setPreviewCert(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(6px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#111113', border: '1px solid #27272a', borderRadius: 16, width: '100%', maxWidth: '800px', height: '80vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #18181b', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div><h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#fafafa' }}>{previewCert.title}</h3><span style={{ fontSize: '0.75rem', color: '#38bdf8' }}>{previewCert.certificateNumber}</span></div>
              <button onClick={() => setPreviewCert(null)} style={{ ...adminBtn.iconBtn, background: '#18181b', border: '1px solid #27272a', color: '#a1a1aa' }}><X size={18} /></button>
            </div>
            <div style={{ flex: 1, background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', overflow: 'auto' }}>
              {previewCert.fileType === 'image' || previewCert.fileUrl.match(/\.(jpg|jpeg|png|webp|gif|svg)$/i)
                ? <img src={previewCert.fileUrl} alt={previewCert.title} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: 8 }} />
                : <iframe src={previewCert.fileUrl} style={{ width: '100%', height: '100%', border: 'none', borderRadius: 8 }} title="Certificate" />}
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Revoke Certificate"
        description={`Are you sure you want to revoke "${deleteTarget?.title}"? This cannot be undone.`}
        confirmLabel="Revoke"
        loading={deleting}
      />

      <style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}


