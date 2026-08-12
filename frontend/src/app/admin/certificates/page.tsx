'use client';
import React, { useState, useEffect } from 'react';
import {
  Award, Plus, Search, Trash2, Eye, Download, FileText, CheckCircle2,
  AlertCircle, RefreshCw, X, Copy, Check, Calendar, UserCheck, Shield
} from 'lucide-react';
import {
  adminGetCertificates, adminCreateCertificate, adminDeleteCertificate,
  adminUpdateCertificate, adminGetUsers
} from '@/lib/api';
import type { CertificateData, UserData } from '@/lib/types';

export default function AdminCertificatesPage() {
  const [certificates, setCertificates] = useState<CertificateData[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [previewCert, setPreviewCert] = useState<CertificateData | null>(null);

  // Form State
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

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [certRes, userRes] = await Promise.all([
        adminGetCertificates(),
        adminGetUsers().catch(() => []),
      ]);
      setCertificates(certRes);
      setUsers(userRes);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCertNumber = () => {
    const year = new Date().getFullYear();
    const rand = Math.floor(1000 + Math.random() * 9000);
    setFormCertNumber(`CERT-${year}-${rand}`);
  };

  const handleCopyNumber = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedId(num);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formTitle.trim()) {
      setError('Please provide a certificate title.');
      return;
    }

    if (!formFile) {
      setError('Please upload a PDF or Image certificate file.');
      return;
    }

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
      setModalOpen(false);
      resetForm();
      loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to create certificate.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete / revoke this certificate?')) return;
    try {
      await adminDeleteCertificate(id);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete certificate');
    }
  };

  const resetForm = () => {
    setFormTitle('');
    setFormCertNumber('');
    setFormUser('');
    setFormIssuer('ChargEase');
    setFormIssueDate(new Date().toISOString().split('T')[0]);
    setFormExpiryDate('');
    setFormDescription('');
    setFormFile(null);
    setError('');
  };

  const filteredCertificates = certificates.filter(c => {
    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.certificateNumber.toLowerCase().includes(search.toLowerCase()) ||
      (c.user && c.user.name.toLowerCase().includes(search.toLowerCase())) ||
      c.issuer.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0, color: '#fff' }}>
            Certificates Management
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#888', margin: '0.25rem 0 0' }}>
            Issue certificates to clients and upload files directly to AWS S3 storage.
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            handleGenerateCertNumber();
            setModalOpen(true);
          }}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
            color: '#fff', border: 'none', padding: '0.65rem 1.25rem',
            borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
          }}
        >
          <Plus size={18} /> Issue New Certificate
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', background: '#121212', padding: '1rem', borderRadius: 12, border: '1px solid #222' }}>
        <div style={{ flex: 1, minWidth: 240, position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
          <input
            type="text"
            placeholder="Search by title, certificate #, client, issuer..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', padding: '0.6rem 0.75rem 0.6rem 2.5rem',
              background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 8,
              color: '#fff', fontSize: '0.875rem', outline: 'none',
            }}
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          style={{
            padding: '0.6rem 1rem', background: '#1a1a1a', border: '1px solid #2a2a2a',
            borderRadius: 8, color: '#fff', fontSize: '0.875rem', outline: 'none', cursor: 'pointer'
          }}
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="revoked">Revoked</option>
          <option value="expired">Expired</option>
        </select>
      </div>

      {/* Certificate Table */}
      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#888' }}>
          <RefreshCw size={24} className="animate-spin" style={{ margin: '0 auto 0.5rem' }} />
          <p>Loading Certificates...</p>
        </div>
      ) : filteredCertificates.length === 0 ? (
        <div style={{ padding: '3rem', textAlign: 'center', background: '#121212', borderRadius: 12, border: '1px dashed #2a2a2a' }}>
          <Award size={40} style={{ color: '#444', margin: '0 auto 0.75rem' }} />
          <h3 style={{ color: '#fff', fontSize: '1.1rem', margin: '0 0 0.25rem' }}>No Certificates Found</h3>
          <p style={{ color: '#666', fontSize: '0.85rem' }}>Issue a new certificate to get started.</p>
        </div>
      ) : (
        <div style={{ background: '#121212', borderRadius: 12, border: '1px solid #222', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: '#181818', color: '#888', borderBottom: '1px solid #222' }}>
                <th style={{ padding: '0.85rem 1rem' }}>Certificate Info</th>
                <th style={{ padding: '0.85rem 1rem' }}>Cert #</th>
                <th style={{ padding: '0.85rem 1rem' }}>Assigned Client</th>
                <th style={{ padding: '0.85rem 1rem' }}>Issue / Expiry Date</th>
                <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCertificates.map((cert) => (
                <tr key={cert._id} style={{ borderBottom: '1px solid #1a1a1a' }}>
                  {/* Title & File Type */}
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{
                        padding: '0.5rem', background: '#1a273a', border: '1px solid #2563eb33',
                        borderRadius: 8, color: '#60a5fa', display: 'flex'
                      }}>
                        <Award size={20} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: '#fff' }}>{cert.title}</div>
                        <div style={{ fontSize: '0.75rem', color: '#888' }}>Issuer: {cert.issuer}</div>
                      </div>
                    </div>
                  </td>

                  {/* Cert Number */}
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <code style={{ background: '#1c1c1c', padding: '0.2rem 0.5rem', borderRadius: 4, color: '#38bdf8', fontSize: '0.8rem', fontWeight: 600 }}>
                        {cert.certificateNumber}
                      </code>
                      <button
                        onClick={() => handleCopyNumber(cert.certificateNumber)}
                        title="Copy Certificate Number"
                        style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', padding: 2 }}
                      >
                        {copiedId === cert.certificateNumber ? <Check size={14} style={{ color: '#4ade80' }} /> : <Copy size={14} />}
                      </button>
                    </div>
                  </td>

                  {/* Client User */}
                  <td style={{ padding: '1rem' }}>
                    {cert.user ? (
                      <div>
                        <div style={{ color: '#fff', fontWeight: 500 }}>{cert.user.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#888' }}>{cert.user.email}</div>
                      </div>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: '#eab308', background: '#3f2d04', padding: '0.2rem 0.5rem', borderRadius: 12 }}>
                        Unclaimed (Search & Claimable)
                      </span>
                    )}
                  </td>

                  {/* Dates */}
                  <td style={{ padding: '1rem', color: '#aaa', fontSize: '0.8125rem' }}>
                    <div>Issued: {new Date(cert.issueDate).toLocaleDateString()}</div>
                    {cert.expiryDate && (
                      <div style={{ fontSize: '0.75rem', color: '#666' }}>
                        Exp: {new Date(cert.expiryDate).toLocaleDateString()}
                      </div>
                    )}
                  </td>

                  {/* Status Badge */}
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      padding: '0.25rem 0.6rem', borderRadius: 12, fontSize: '0.75rem', fontWeight: 600,
                      background: cert.status === 'active' ? 'rgba(74, 222, 128, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                      color: cert.status === 'active' ? '#4ade80' : '#f87171',
                      border: `1px solid ${cert.status === 'active' ? 'rgba(74, 222, 128, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                    }}>
                      {cert.status.toUpperCase()}
                    </span>
                  </td>

                  {/* Actions */}
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <button
                        onClick={() => setPreviewCert(cert)}
                        title="Preview File"
                        style={{ background: '#1c1c1c', border: '1px solid #333', color: '#fff', padding: '0.4rem', borderRadius: 6, cursor: 'pointer' }}
                      >
                        <Eye size={16} />
                      </button>
                      <a
                        href={cert.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        title="Download S3 File"
                        style={{ background: '#1c1c1c', border: '1px solid #333', color: '#60a5fa', padding: '0.4rem', borderRadius: 6, display: 'inline-flex' }}
                      >
                        <Download size={16} />
                      </a>
                      <button
                        onClick={() => handleDelete(cert._id)}
                        title="Delete Certificate"
                        style={{ background: '#2c1515', border: '1px solid #4a1d1d', color: '#f87171', padding: '0.4rem', borderRadius: 6, cursor: 'pointer' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal: Issue Certificate */}
      {modalOpen && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem'
        }}>
          <div style={{
            background: '#121212', border: '1px solid #2a2a2a', borderRadius: 16,
            width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', padding: '1.5rem', color: '#fff'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #222', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Award style={{ color: '#3b82f6' }} size={22} />
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Issue New Certificate</h2>
              </div>
              <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {error && (
              <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid #f87171', padding: '0.75rem', borderRadius: 8, color: '#f87171', fontSize: '0.85rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertCircle size={16} /> {error}
              </div>
            )}

            <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Title */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', color: '#aaa', marginBottom: '0.35rem', fontWeight: 500 }}>Certificate Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Certified EV Infrastructure Specialist"
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.65rem', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 8, color: '#fff', fontSize: '0.875rem' }}
                />
              </div>

              {/* Certificate Number */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', color: '#aaa', marginBottom: '0.35rem', fontWeight: 500 }}>Certificate Number</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    placeholder="CERT-2026-XXXX"
                    value={formCertNumber}
                    onChange={e => setFormCertNumber(e.target.value.toUpperCase())}
                    style={{ flex: 1, padding: '0.65rem', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 8, color: '#38bdf8', fontFamily: 'monospace', fontWeight: 600, fontSize: '0.875rem' }}
                  />
                  <button
                    type="button"
                    onClick={handleGenerateCertNumber}
                    style={{ padding: '0.65rem 1rem', background: '#222', border: '1px solid #333', color: '#aaa', borderRadius: 8, fontSize: '0.8rem', cursor: 'pointer' }}
                  >
                    Auto Generate
                  </button>
                </div>
              </div>

              {/* User Selection (Optional) */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', color: '#aaa', marginBottom: '0.35rem', fontWeight: 500 }}>
                  Assign to Client (Optional)
                </label>
                <select
                  value={formUser}
                  onChange={e => setFormUser(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 8, color: '#fff', fontSize: '0.875rem' }}
                >
                  <option value="">Leave Unassigned (Search & Claimable by Cert #)</option>
                  {users.map(u => (
                    <option key={u._id} value={u._id}>
                      {u.name} ({u.email})
                    </option>
                  ))}
                </select>
                <p style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.25rem' }}>
                  If unassigned, the client can search using the Certificate # on their profile to claim it.
                </p>
              </div>

              {/* Issuer & Dates */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', color: '#aaa', marginBottom: '0.35rem', fontWeight: 500 }}>Issuer Organization</label>
                  <input
                    type="text"
                    value={formIssuer}
                    onChange={e => setFormIssuer(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 8, color: '#fff', fontSize: '0.875rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', color: '#aaa', marginBottom: '0.35rem', fontWeight: 500 }}>Issue Date</label>
                  <input
                    type="date"
                    value={formIssueDate}
                    onChange={e => setFormIssueDate(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 8, color: '#fff', fontSize: '0.875rem' }}
                  />
                </div>
              </div>

              {/* File Upload (PDF or Image to AWS S3) */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', color: '#aaa', marginBottom: '0.35rem', fontWeight: 500 }}>
                  Certificate File (PDF or Image) *
                </label>
                <input
                  type="file"
                  accept="application/pdf,image/*"
                  onChange={e => setFormFile(e.target.files ? e.target.files[0] : null)}
                  required
                  style={{ width: '100%', padding: '0.5rem', background: '#1a1a1a', border: '1px dashed #3b82f666', borderRadius: 8, color: '#ccc', fontSize: '0.85rem' }}
                />
                <p style={{ fontSize: '0.75rem', color: '#3b82f6', marginTop: '0.25rem' }}>
                  ☁️ Uploads to AWS S3 bucket storage.
                </p>
              </div>

              {/* Description */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', color: '#aaa', marginBottom: '0.35rem', fontWeight: 500 }}>Description / Notes</label>
                <textarea
                  rows={3}
                  placeholder="Optional details or achievements summary..."
                  value={formDescription}
                  onChange={e => setFormDescription(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 8, color: '#fff', fontSize: '0.875rem' }}
                />
              </div>

              {/* Submit Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  style={{ padding: '0.65rem 1.25rem', background: '#222', border: '1px solid #333', color: '#ccc', borderRadius: 8, cursor: 'pointer', fontSize: '0.875rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    padding: '0.65rem 1.5rem', background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                    color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem',
                    opacity: submitting ? 0.7 : 1
                  }}
                >
                  {submitting ? 'Uploading to S3...' : 'Issue Certificate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview File Modal */}
      {previewCert && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1.5rem'
        }}>
          <div style={{
            background: '#121212', border: '1px solid #2a2a2a', borderRadius: 16,
            width: '100%', maxWidth: '800px', height: '80vh', display: 'flex', flexDirection: 'column', color: '#fff', overflow: 'hidden'
          }}>
            <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #222', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>{previewCert.title}</h3>
                <span style={{ fontSize: '0.75rem', color: '#38bdf8' }}>{previewCert.certificateNumber}</span>
              </div>
              <button onClick={() => setPreviewCert(null)} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}>
                <X size={22} />
              </button>
            </div>
            <div style={{ flex: 1, background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', overflow: 'auto' }}>
              {previewCert.fileType === 'image' || previewCert.fileUrl.match(/\.(jpg|jpeg|png|webp|gif|svg)$/i) ? (
                <img src={previewCert.fileUrl} alt={previewCert.title} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: 8 }} />
              ) : (
                <iframe src={previewCert.fileUrl} style={{ width: '100%', height: '100%', border: 'none', borderRadius: 8 }} title="Certificate Document PDF" />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
