'use client';
import React, { useState, useEffect } from 'react';
import {
  Award, Plus, Search, Trash2, Eye, Download, FileText, CheckCircle2,
  AlertCircle, RefreshCw, X, Copy, Check, Calendar, UserCheck, Shield, Sparkles
} from 'lucide-react';
import {
  adminGetCertificates, adminCreateCertificate, adminDeleteCertificate,
  adminUpdateCertificate, adminGetUsers
} from '@/lib/api';
import type { CertificateData, UserData } from '@/lib/types';
import { showToast } from '@/lib/toast';

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
      showToast.error('Failed to load certificates library.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCertNumber = () => {
    const year = new Date().getFullYear();
    const rand = Math.floor(1000 + Math.random() * 9000);
    const num = `CERT-${year}-${rand}`;
    setFormCertNumber(num);
    showToast.info(`Generated number: ${num}`);
  };

  const handleCopyCertNum = (certNum: string, id: string) => {
    navigator.clipboard.writeText(certNum);
    setCopiedId(id);
    showToast.success(`Copied ${certNum} to clipboard!`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formTitle.trim()) {
      showToast.error('Please provide a certificate title.');
      return;
    }

    if (!formFile) {
      showToast.error('Please upload a PDF or Image certificate document.');
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
      showToast.success('Certificate issued successfully!');
      setModalOpen(false);
      resetForm();
      loadData();
    } catch (err: any) {
      showToast.error(err.message || 'Failed to issue certificate.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete / revoke certificate: "${title}"?`)) return;
    try {
      await adminDeleteCertificate(id);
      showToast.success('Certificate revoked and deleted successfully.');
      loadData();
    } catch (err: any) {
      showToast.error(err.message || 'Failed to delete certificate.');
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.25rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#fbbf24', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>
            <Award size={16} /> Verifiable Records
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, margin: 0, color: '#fff', letterSpacing: '-0.02em' }}>
            Certificates & Compliance Registry
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#9ca3af', margin: '0.2rem 0 0' }}>
            Issue verified certificates to clients, upload PDF documents, and audit compliance credentials.
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            handleGenerateCertNumber();
            setModalOpen(true);
          }}
          style={{
            background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)',
            color: '#000',
            border: 'none',
            padding: '0.7rem 1.3rem',
            borderRadius: 10,
            fontSize: '0.875rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 4px 14px rgba(251, 191, 36, 0.35)',
            transition: 'all 0.2s ease',
          }}
        >
          <Plus size={18} /> Issue New Certificate
        </button>
      </div>

      {/* Search & Status Filter Bar */}
      <div style={{ background: '#09090b', border: '1px solid #1c1c21', borderRadius: 16, padding: '1rem 1.25rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
          <Search size={16} color="#71717a" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search by certificate #, title, recipient, or issuer..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%',
              background: '#121215',
              border: '1px solid #1c1c21',
              borderRadius: 10,
              padding: '0.55rem 0.85rem 0.55rem 2.4rem',
              color: '#fff',
              fontSize: '0.85rem',
              outline: 'none',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: '#71717a' }}>Status:</span>
          {['', 'active', 'expired', 'revoked'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              style={{
                background: statusFilter === st ? 'rgba(251, 191, 36, 0.15)' : '#121215',
                color: statusFilter === st ? '#fbbf24' : '#a1a1aa',
                border: statusFilter === st ? '1px solid rgba(251, 191, 36, 0.3)' : '1px solid #1c1c21',
                padding: '0.45rem 0.85rem',
                borderRadius: 8,
                fontSize: '0.775rem',
                fontWeight: statusFilter === st ? 600 : 500,
                cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              {st === '' ? 'All Statuses' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Certificates Cards Grid */}
      {loading ? (
        <div style={{ padding: '4rem 0', textAlign: 'center', color: '#71717a' }}>
          <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p style={{ fontSize: '0.875rem' }}>Loading certificate database...</p>
        </div>
      ) : filteredCertificates.length === 0 ? (
        <div style={{ background: '#09090b', border: '1px dashed #22222a', borderRadius: 16, padding: '4rem 1.5rem', textAlign: 'center', color: '#71717a' }}>
          <Award size={40} style={{ margin: '0 auto 0.75rem', opacity: 0.5 }} />
          <p style={{ fontSize: '1rem', fontWeight: 600, color: '#e4e4e7', margin: '0 0 0.25rem' }}>No certificates match your query</p>
          <p style={{ fontSize: '0.825rem', margin: 0 }}>Click "Issue New Certificate" to create a new verified document.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))', gap: '1.5rem' }}>
          {filteredCertificates.map(cert => (
            <div
              key={cert._id}
              style={{
                background: '#09090b',
                border: '1px solid #1c1c21',
                borderRadius: 16,
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.2s ease, border-color 0.2s ease',
              }}
              className="cert-card"
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#121215', border: '1px solid #22222a', padding: '0.35rem 0.75rem', borderRadius: 8 }}>
                    <span style={{ fontSize: '0.775rem', fontFamily: 'monospace', fontWeight: 600, color: '#fbbf24' }}>
                      {cert.certificateNumber}
                    </span>
                    <button
                      onClick={() => handleCopyCertNum(cert.certificateNumber, cert._id)}
                      title="Copy Certificate Number"
                      style={{ background: 'transparent', border: 'none', color: '#a1a1aa', cursor: 'pointer', display: 'flex', padding: 0 }}
                    >
                      {copiedId === cert._id ? <Check size={13} color="#34d399" /> : <Copy size={13} />}
                    </button>
                  </div>

                  <span
                    style={{
                      fontSize: '0.675rem',
                      padding: '0.2rem 0.6rem',
                      borderRadius: 6,
                      background: cert.status === 'active' ? 'rgba(52, 211, 153, 0.15)' : cert.status === 'expired' ? 'rgba(248, 113, 113, 0.15)' : '#1c1c21',
                      color: cert.status === 'active' ? '#34d399' : cert.status === 'expired' ? '#f87171' : '#a1a1aa',
                      textTransform: 'uppercase',
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                    }}
                  >
                    {cert.status}
                  </span>
                </div>

                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 700, color: '#fff', margin: '0 0 0.4rem' }}>
                  {cert.title}
                </h3>
                {cert.description && (
                  <p style={{ fontSize: '0.825rem', color: '#9ca3af', margin: '0 0 1rem', lineHeight: 1.5 }}>
                    {cert.description}
                  </p>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.8rem', color: '#a1a1aa', margin: '1rem 0' }}>
                  {cert.user && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <UserCheck size={14} color="#38bdf8" />
                      <span>Issued To: <strong style={{ color: '#fff' }}>{cert.user.name}</strong> ({cert.user.email})</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Calendar size={14} color="#71717a" />
                    <span>Issued Date: {cert.issueDate ? new Date(cert.issueDate).toLocaleDateString() : 'N/A'}</span>
                  </div>
                  {cert.issuer && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Shield size={14} color="#71717a" />
                      <span>Issuer: {cert.issuer}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div style={{ borderTop: '1px solid #1c1c21', paddingTop: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                {cert.fileUrl ? (
                  <a
                    href={cert.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#121215', border: '1px solid #22222a', color: '#38bdf8', padding: '0.4rem 0.85rem', borderRadius: 8, fontSize: '0.775rem', fontWeight: 500, textDecoration: 'none' }}
                  >
                    <FileText size={14} /> View File
                  </a>
                ) : (
                  <span style={{ fontSize: '0.75rem', color: '#52525b' }}>No File Attached</span>
                )}

                <button
                  onClick={() => handleDelete(cert._id, cert.title)}
                  style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.25)', color: '#f87171', padding: '0.4rem 0.75rem', borderRadius: 8, fontSize: '0.775rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                >
                  <Trash2 size={13} /> Revoke
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#09090b', border: '1px solid #27272a', borderRadius: 20, width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 700, color: '#fff', margin: 0 }}>
                Issue Official Certificate
              </h2>
              <button onClick={() => setModalOpen(false)} style={{ background: '#18181b', border: 'none', color: '#a1a1aa', padding: '0.4rem', borderRadius: 8, cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#d4d4d8', marginBottom: '0.4rem' }}>Certificate Title *</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  placeholder="e.g. Certified Enterprise Infrastructure Compliance"
                  style={{ width: '100%', background: '#121215', border: '1px solid #22222a', borderRadius: 10, padding: '0.65rem 0.9rem', color: '#fff', fontSize: '0.875rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#d4d4d8', marginBottom: '0.4rem' }}>Certificate Number</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    required
                    value={formCertNumber}
                    onChange={e => setFormCertNumber(e.target.value)}
                    placeholder="CERT-2026-XXXX"
                    style={{ flex: 1, background: '#121215', border: '1px solid #22222a', borderRadius: 10, padding: '0.65rem 0.9rem', color: '#fff', fontSize: '0.875rem', fontFamily: 'monospace', outline: 'none' }}
                  />
                  <button
                    type="button"
                    onClick={handleGenerateCertNumber}
                    style={{ background: '#1c1c21', border: '1px solid #282830', color: '#fbbf24', padding: '0.65rem 1rem', borderRadius: 10, fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <Sparkles size={14} /> Auto-Generate
                  </button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#d4d4d8', marginBottom: '0.4rem' }}>Assign Recipient User</label>
                  <select
                    value={formUser}
                    onChange={e => setFormUser(e.target.value)}
                    style={{ width: '100%', background: '#121215', border: '1px solid #22222a', borderRadius: 10, padding: '0.65rem 0.9rem', color: '#fff', fontSize: '0.875rem', outline: 'none' }}
                  >
                    <option value="">General (No User Assigned)</option>
                    {users.map(u => (
                      <option key={u._id} value={u._id}>
                        {u.name} ({u.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#d4d4d8', marginBottom: '0.4rem' }}>Issuing Organization</label>
                  <input
                    type="text"
                    value={formIssuer}
                    onChange={e => setFormIssuer(e.target.value)}
                    placeholder="ChargEase"
                    style={{ width: '100%', background: '#121215', border: '1px solid #22222a', borderRadius: 10, padding: '0.65rem 0.9rem', color: '#fff', fontSize: '0.875rem', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#d4d4d8', marginBottom: '0.4rem' }}>Issue Date</label>
                  <input
                    type="date"
                    value={formIssueDate}
                    onChange={e => setFormIssueDate(e.target.value)}
                    style={{ width: '100%', background: '#121215', border: '1px solid #22222a', borderRadius: 10, padding: '0.65rem 0.9rem', color: '#fff', fontSize: '0.875rem', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#d4d4d8', marginBottom: '0.4rem' }}>Expiration Date (Optional)</label>
                  <input
                    type="date"
                    value={formExpiryDate}
                    onChange={e => setFormExpiryDate(e.target.value)}
                    style={{ width: '100%', background: '#121215', border: '1px solid #22222a', borderRadius: 10, padding: '0.65rem 0.9rem', color: '#fff', fontSize: '0.875rem', outline: 'none' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#d4d4d8', marginBottom: '0.4rem' }}>Description & Scope</label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={e => setFormDescription(e.target.value)}
                  placeholder="Details regarding verified credentials, project scope, or compliance criteria..."
                  style={{ width: '100%', background: '#121215', border: '1px solid #22222a', borderRadius: 10, padding: '0.65rem 0.9rem', color: '#fff', fontSize: '0.875rem', outline: 'none', resize: 'vertical' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#d4d4d8', marginBottom: '0.4rem' }}>Certificate File (PDF or Image) *</label>
                <input
                  type="file"
                  required
                  accept="application/pdf,image/*"
                  onChange={e => setFormFile(e.target.files?.[0] || null)}
                  style={{ width: '100%', background: '#121215', border: '1px solid #22222a', borderRadius: 10, padding: '0.6rem', color: '#a1a1aa', fontSize: '0.8rem' }}
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
                  disabled={submitting}
                  style={{ background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)', border: 'none', color: '#000', padding: '0.65rem 1.4rem', borderRadius: 10, fontSize: '0.85rem', fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer' }}
                >
                  {submitting ? 'Issuing...' : 'Issue Certificate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
