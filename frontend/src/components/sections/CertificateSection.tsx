'use client';
import React, { useState, useEffect } from 'react';
import {
  Award, Search, CheckCircle2, AlertCircle, Eye, Download, Copy, Check,
  Sparkles, FileText, Lock, ArrowRight, RefreshCw, X
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import {
  searchCertificateByNumber, claimCertificate, getUserCertificates
} from '@/lib/api';
import type { CertificateData } from '@/lib/types';

export default function CertificateSection() {
  const { user, openAuthModal } = useAuth();

  // Search & Claim state
  const [searchCertNum, setSearchCertNum] = useState('');
  const [searchedCert, setSearchedCert] = useState<any | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [claimSubmitting, setClaimSubmitting] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState('');

  // User certificates
  const [myCertificates, setMyCertificates] = useState<CertificateData[]>([]);
  const [certsLoading, setCertsLoading] = useState(false);

  // UI state
  const [previewCert, setPreviewCert] = useState<CertificateData | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadMyCertificates();
    } else {
      setMyCertificates([]);
    }
  }, [user]);

  const loadMyCertificates = async () => {
    setCertsLoading(true);
    try {
      const certs = await getUserCertificates();
      setMyCertificates(certs);
    } catch (err) {
      console.error(err);
    } finally {
      setCertsLoading(false);
    }
  };

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError('');
    setClaimSuccess('');
    setSearchedCert(null);

    if (!searchCertNum.trim()) {
      setSearchError('Please enter a certificate number.');
      return;
    }

    setSearchLoading(true);
    try {
      const data = await searchCertificateByNumber(searchCertNum);
      setSearchedCert(data);
    } catch (err: any) {
      setSearchError(err.message || 'No certificate found with that certificate number.');
    } finally {
      setSearchLoading(false);
    }
  };

  const handleClaim = async () => {
    if (!user) {
      openAuthModal('login');
      return;
    }

    if (!searchedCert) return;

    setClaimSubmitting(true);
    setSearchError('');
    try {
      await claimCertificate(searchedCert.certificateNumber);
      setClaimSuccess('Certificate added to your profile successfully! 🎉');
      setSearchedCert(null);
      setSearchCertNum('');
      loadMyCertificates();
    } catch (err: any) {
      setSearchError(err.message || 'Failed to claim certificate.');
    } finally {
      setClaimSubmitting(false);
    }
  };

  const handleCopyNumber = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedId(num);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section id="certificate" className="section-padding" style={{ background: '#07090e', position: 'relative' }}>
      <div className="section-container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3rem' }}>
          <span className="badge-tag" style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', borderColor: 'rgba(56, 189, 248, 0.2)' }}>
            Official Credentials
          </span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3.25rem)', fontWeight: 700, margin: '0.75rem 0 1rem', letterSpacing: '-0.02em', color: '#fff' }}>
            Certificate Verification
          </h2>
          <p style={{ color: 'var(--gray-400)', fontSize: '1rem', lineHeight: 1.6, margin: 0 }}>
            No login required! Enter any <strong>Certificate Number</strong> (e.g. <code>CERT-2026-8912</code>) below to verify, preview, and download the official certificate document.
          </p>
        </div>

        {/* Search Box Card */}
        <div style={{ background: 'linear-gradient(180deg, #0e1320 0%, #090c15 100%)', border: '1px solid #1e293b', borderRadius: 24, padding: '2.5rem 2rem', maxWidth: '750px', margin: '0 auto 3rem', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
              <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input
                type="text"
                placeholder="Enter Certificate Number (e.g. CERT-2026-1049)"
                value={searchCertNum}
                onChange={e => setSearchCertNum(e.target.value.toUpperCase())}
                style={{
                  width: '100%', padding: '0.9rem 1rem 0.9rem 3rem',
                  background: '#04060a', border: '1px solid #26334d', borderRadius: 14,
                  color: '#38bdf8', fontFamily: 'monospace', fontWeight: 600, fontSize: '1rem', outline: 'none'
                }}
              />
            </div>
            <button
              type="submit"
              disabled={searchLoading}
              style={{
                padding: '0.9rem 2rem', background: 'linear-gradient(135deg, #0284c7, #2563eb)',
                color: '#fff', border: 'none', borderRadius: 14, fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem',
                display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 16px rgba(2, 132, 199, 0.4)'
              }}
            >
              {searchLoading ? 'Searching...' : 'Verify Certificate'}
            </button>
          </form>

          {/* Feedback Messages */}
          {searchError && (
            <div style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid #f8717144', padding: '0.85rem 1.2rem', borderRadius: 12, color: '#f87171', fontSize: '0.9rem', marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={18} /> {searchError}
            </div>
          )}

          {claimSuccess && (
            <div style={{ background: 'rgba(74,222,128,0.12)', border: '1px solid #4ade8044', padding: '0.85rem 1.2rem', borderRadius: 12, color: '#4ade80', fontSize: '0.9rem', marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={18} /> {claimSuccess}
            </div>
          )}

          {/* Searched Certificate Result Card */}
          {searchedCert && (
            <div style={{ marginTop: '1.75rem', background: '#0b111e', border: '1px solid #1e293b', borderRadius: 18, padding: '1.75rem', animation: 'fadeIn 0.25s ease' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ padding: '0.75rem', background: '#1e3a8a', borderRadius: 14, color: '#60a5fa' }}>
                    <Award size={32} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.25rem', color: '#fff' }}>{searchedCert.title}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <code style={{ color: '#38bdf8', background: '#0f172a', padding: '0.2rem 0.6rem', borderRadius: 6, fontSize: '0.85rem', fontFamily: 'monospace' }}>
                        {searchedCert.certificateNumber}
                      </code>
                      <button
                        onClick={() => handleCopyNumber(searchedCert.certificateNumber)}
                        title="Copy Certificate Number"
                        style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: 2 }}
                      >
                        {copiedId === searchedCert.certificateNumber ? <Check size={14} style={{ color: '#4ade80' }} /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>
                </div>

                <span style={{
                  padding: '0.35rem 0.85rem', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700,
                  background: searchedCert.status === 'active' ? 'rgba(74, 222, 128, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  color: searchedCert.status === 'active' ? '#4ade80' : '#f87171',
                  border: `1px solid ${searchedCert.status === 'active' ? 'rgba(74, 222, 128, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
                }}>
                  {searchedCert.status.toUpperCase()}
                </span>
              </div>

              {searchedCert.description && (
                <p style={{ fontSize: '0.875rem', color: '#94a3b8', margin: '0 0 1.25rem', lineHeight: 1.5 }}>
                  {searchedCert.description}
                </p>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.85rem', background: '#060a12', padding: '1rem', borderRadius: 12, fontSize: '0.825rem', color: '#cbd5e1', marginBottom: '1.5rem' }}>
                <div><strong style={{ color: '#64748b' }}>Issuer:</strong> {searchedCert.issuer}</div>
                <div><strong style={{ color: '#64748b' }}>Issue Date:</strong> {new Date(searchedCert.issueDate).toLocaleDateString()}</div>
                <div><strong style={{ color: '#64748b' }}>Format:</strong> {searchedCert.fileType.toUpperCase()}</div>
              </div>

              {/* Action Buttons: Preview, Direct Download (No Login Required), and Add to Profile */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => setPreviewCert(searchedCert)}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#1e293b', border: '1px solid #334155', color: '#fff', padding: '0.6rem 1rem', borderRadius: 10, fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
                  >
                    <Eye size={16} /> Preview Document
                  </button>
                  <a
                    href={searchedCert.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#2563eb', border: 'none', color: '#fff', padding: '0.6rem 1.1rem', borderRadius: 10, fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}
                  >
                    <Download size={16} /> Download
                  </a>
                </div>

                {searchedCert.isClaimedByMe ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#4ade80', fontSize: '0.85rem', fontWeight: 600 }}>
                    <CheckCircle2 size={18} /> In Your Profile
                  </span>
                ) : searchedCert.isClaimedByOthers ? (
                  <span style={{ color: '#f87171', fontSize: '0.85rem' }}>
                    Claimed ({searchedCert.claimedUser?.email || 'User'})
                  </span>
                ) : (
                  <button
                    onClick={handleClaim}
                    disabled={claimSubmitting}
                    style={{
                      padding: '0.6rem 1.35rem', background: 'linear-gradient(135deg, #16a34a, #15803d)',
                      color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem',
                      display: 'flex', alignItems: 'center', gap: '0.4rem', boxShadow: '0 4px 12px rgba(22, 163, 74, 0.3)'
                    }}
                  >
                    <CheckCircle2 size={16} /> {claimSubmitting ? 'Linking...' : 'Add to My Profile'}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User's Claimed Certificates Grid (Visible when logged in) */}
        {user && myCertificates.length > 0 && (
          <div style={{ marginTop: '3rem', paddingTop: '2.5rem', borderTop: '1px solid #1e293b' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Award style={{ color: '#38bdf8' }} size={24} />
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, color: '#fff' }}>My Claimed Certificates</h3>
              </div>
              <span style={{ background: '#1e293b', padding: '0.25rem 0.75rem', borderRadius: 20, fontSize: '0.8rem', color: '#38bdf8', fontWeight: 600 }}>
                {myCertificates.length} Linked
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
              {myCertificates.map(cert => (
                <div
                  key={cert._id}
                  style={{
                    background: 'linear-gradient(145deg, #0e131f 0%, #07090f 100%)',
                    border: '1px solid #1e293b', borderRadius: 18, padding: '1.25rem',
                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.3)', position: 'relative', overflow: 'hidden'
                  }}
                >
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, #38bdf8, #2563eb)' }} />

                  <div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <div style={{ width: 38, height: 38, borderRadius: 10, background: '#1e3a8a33', border: '1px solid #2563eb44', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Award size={20} />
                      </div>
                      <span style={{
                        padding: '0.2rem 0.5rem', borderRadius: 10, fontSize: '0.7rem', fontWeight: 700,
                        background: cert.status === 'active' ? 'rgba(74,222,128,0.15)' : 'rgba(239,68,68,0.15)',
                        color: cert.status === 'active' ? '#4ade80' : '#f87171'
                      }}>
                        {cert.status.toUpperCase()}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 0.3rem', color: '#fff' }}>
                      {cert.title}
                    </h4>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.6rem' }}>
                      <code style={{ background: '#0f172a', padding: '0.15rem 0.45rem', borderRadius: 4, color: '#38bdf8', fontSize: '0.75rem', fontWeight: 600, fontFamily: 'monospace' }}>
                        {cert.certificateNumber}
                      </code>
                      <button
                        onClick={() => handleCopyNumber(cert.certificateNumber)}
                        style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: 2 }}
                      >
                        {copiedId === cert.certificateNumber ? <Check size={14} style={{ color: '#4ade80' }} /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '0.85rem', borderTop: '1px solid #1e293b', marginTop: '0.75rem' }}>
                    <button
                      onClick={() => setPreviewCert(cert)}
                      style={{ flex: 1, padding: '0.5rem', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#fff', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}
                    >
                      <Eye size={14} /> Preview
                    </button>
                    <a
                      href={cert.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      style={{ padding: '0.5rem 0.8rem', background: '#2563eb', border: 'none', borderRadius: 8, color: '#fff', fontSize: '0.78rem', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}
                    >
                      <Download size={14} /> Download
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Preview File Modal */}
      {previewCert && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999999, padding: '1.5rem'
        }}>
          <div style={{
            background: '#0d111a', border: '1px solid #1e293b', borderRadius: 20,
            width: '100%', maxWidth: '850px', height: '82vh', display: 'flex', flexDirection: 'column', color: '#fff', overflow: 'hidden'
          }}>
            <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700 }}>{previewCert.title}</h3>
                <span style={{ fontSize: '0.78rem', color: '#38bdf8', fontFamily: 'monospace' }}>{previewCert.certificateNumber}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <a
                  href={previewCert.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  style={{ background: '#2563eb', color: '#fff', padding: '0.4rem 0.8rem', borderRadius: 6, textDecoration: 'none', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                >
                  <Download size={14} /> Download File
                </a>
                <button onClick={() => setPreviewCert(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                  <X size={22} />
                </button>
              </div>
            </div>
            <div style={{ flex: 1, background: '#05070c', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', overflow: 'auto' }}>
              {previewCert.fileType === 'image' || previewCert.fileUrl.match(/\.(jpg|jpeg|png|webp|gif|svg)$/i) ? (
                <img src={previewCert.fileUrl} alt={previewCert.title} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: 10 }} />
              ) : (
                <iframe src={previewCert.fileUrl} style={{ width: '100%', height: '100%', border: 'none', borderRadius: 10 }} title="Certificate Document" />
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
