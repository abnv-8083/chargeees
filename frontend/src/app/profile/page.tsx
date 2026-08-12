'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Award, Search, CheckCircle2, AlertCircle, Eye, Download, Copy, Check,
  User, Mail, LogOut, ArrowLeft, ShieldCheck, Sparkles, FileText, Lock, KeyRound
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import {
  searchCertificateByNumber, claimCertificate, getUserCertificates,
  adminLogin, clientRegister, adminGetMe, fetchSettings
} from '@/lib/api';
import type { CertificateData, UserData, SiteSettings } from '@/lib/types';

export default function UserProfilePage() {
  const { user, loading, logout, openAuthModal, refreshUser } = useAuth();

  // Login / Register Form State
  const [isRegistering, setIsRegistering] = useState(false);
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSubmitting, setAuthSubmitting] = useState(false);

  // Certificates state
  const [myCertificates, setMyCertificates] = useState<CertificateData[]>([]);
  const [certsLoading, setCertsLoading] = useState(false);

  // Search / Claim state
  const [searchCertNum, setSearchCertNum] = useState('');
  const [searchedCert, setSearchedCert] = useState<any | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [claimSubmitting, setClaimSubmitting] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState('');

  // UI state
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [previewCert, setPreviewCert] = useState<CertificateData | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings().then(res => setSettings(res)).catch(() => null);
  }, []);

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

  // Handle Login / Register Submit
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSubmitting(true);

    try {
      if (isRegistering) {
        const res = await clientRegister(authName, authEmail, authPassword);
        if (res.token && res.user) {
          localStorage.setItem('token', res.token);
          await refreshUser();
          loadMyCertificates();
        }
      } else {
        const res = await adminLogin(authEmail, authPassword);
        if (res.token) {
          localStorage.setItem('token', res.token);
          await refreshUser();
          loadMyCertificates();
        }
      }
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed. Please check your details.');
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    setMyCertificates([]);
    setSearchedCert(null);
  };

  // Search Certificate by Number
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
      setSearchError(err.message || 'No certificate found with that number.');
    } finally {
      setSearchLoading(false);
    }
  };

  // Claim Certificate
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
    <div style={{ minHeight: '100vh', background: '#050505', color: '#fff', fontFamily: 'var(--font-inter, sans-serif)' }}>
      <Navbar settings={settings || undefined} />

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '7rem 1.5rem 4rem' }}>
        {/* Top Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
          <div>
            <Link
              href="/"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#888', textDecoration: 'none', fontSize: '0.85rem', marginBottom: '0.5rem' }}
            >
              <ArrowLeft size={16} /> Back to Home
            </Link>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
              Client Profile & <span style={{ background: 'linear-gradient(135deg, #38bdf8, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Certificates</span>
            </h1>
          </div>

          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#111', padding: '0.6rem 1.2rem', borderRadius: 50, border: '1px solid #222' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem' }}>
                {user.name ? user.name[0].toUpperCase() : 'U'}
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#fff' }}>{user.name}</div>
                <div style={{ fontSize: '0.75rem', color: '#888' }}>{user.email}</div>
              </div>
              <button
                onClick={handleLogout}
                title="Logout"
                style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: '0.4rem', marginLeft: '0.5rem' }}
              >
                <LogOut size={18} />
              </button>
            </div>
          )}
        </div>

        {/* Auth Section if unauthenticated */}
        {loading ? (
          <div style={{ padding: '4rem 0', textAlign: 'center', color: '#888' }}>Loading profile...</div>
        ) : !user ? (
          <div style={{ background: '#0e0e11', border: '1px solid #1f1f28', borderRadius: 20, padding: '2.5rem 2rem', maxWidth: '480px', margin: '0 auto 3rem', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: '#182235', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', border: '1px solid #2563eb33' }}>
                <Lock size={28} />
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 0.5rem' }}>
                {isRegistering ? 'Create Client Account' : 'Client Login'}
              </h2>
              <p style={{ fontSize: '0.875rem', color: '#888', margin: 0 }}>
                {isRegistering ? 'Sign up to manage and view your certificates' : 'Log in to access your issued certificates'}
              </p>
            </div>

            {authError && (
              <div style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid #f8717144', padding: '0.75rem', borderRadius: 10, color: '#f87171', fontSize: '0.85rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertCircle size={16} /> {authError}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {isRegistering && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '0.35rem' }}>Full Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={authName}
                    onChange={e => setAuthName(e.target.value)}
                    required
                    style={{ width: '100%', padding: '0.75rem 1rem', background: '#16161a', border: '1px solid #2a2a35', borderRadius: 10, color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                  />
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '0.35rem' }}>Email Address</label>
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={authEmail}
                  onChange={e => setAuthEmail(e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.75rem 1rem', background: '#16161a', border: '1px solid #2a2a35', borderRadius: 10, color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '0.35rem' }}>Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={authPassword}
                  onChange={e => setAuthPassword(e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.75rem 1rem', background: '#16161a', border: '1px solid #2a2a35', borderRadius: 10, color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>

              <button
                type="submit"
                disabled={authSubmitting}
                style={{
                  padding: '0.85rem', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer',
                  marginTop: '0.5rem', boxShadow: '0 8px 20px rgba(37,99,235,0.3)', opacity: authSubmitting ? 0.7 : 1
                }}
              >
                {authSubmitting ? 'Please wait...' : isRegistering ? 'Create Account' : 'Log In'}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #1a1a24', fontSize: '0.85rem', color: '#888' }}>
              {isRegistering ? 'Already have an account?' : "Don't have an account yet?"}{' '}
              <button
                onClick={() => { setIsRegistering(!isRegistering); setAuthError(''); }}
                style={{ background: 'none', border: 'none', color: '#38bdf8', fontWeight: 600, cursor: 'pointer' }}
              >
                {isRegistering ? 'Log In' : 'Sign Up'}
              </button>
            </div>
          </div>
        ) : null}

        {/* Section 1: Public Search & Verification (No Login Required) */}
        <section style={{ background: 'linear-gradient(180deg, #0e111a 0%, #080a10 100%)', border: '1px solid #1d2538', borderRadius: 24, padding: '2.5rem', marginBottom: '3rem', boxShadow: '0 20px 50px rgba(0,0,0,0.4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <div style={{ padding: '0.5rem', background: '#1e3a8a33', borderRadius: 10, color: '#38bdf8' }}>
              <Sparkles size={22} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Certificate Search & Verification</h2>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.75rem' }}>
            No login required! Enter any <strong>Certificate Number</strong> (e.g. <code>CERT-2026-8912</code>) below to verify, preview, and download the official certificate document.
          </p>

          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', maxWidth: '650px', marginBottom: '1.5rem' }}>
            <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input
                type="text"
                placeholder="Enter Certificate Number (e.g. CERT-2026-1049)"
                value={searchCertNum}
                onChange={e => setSearchCertNum(e.target.value.toUpperCase())}
                style={{
                  width: '100%', padding: '0.85rem 1rem 0.85rem 2.8rem',
                  background: '#07090e', border: '1px solid #26334d', borderRadius: 12,
                  color: '#38bdf8', fontFamily: 'monospace', fontWeight: 600, fontSize: '0.95rem', outline: 'none'
                }}
              />
            </div>
            <button
              type="submit"
              disabled={searchLoading}
              style={{
                padding: '0.85rem 1.75rem', background: 'linear-gradient(135deg, #0284c7, #2563eb)',
                color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem',
                display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)'
              }}
            >
              {searchLoading ? 'Searching...' : 'Search & Verify'}
            </button>
          </form>

          {/* Feedback Messages */}
          {searchError && (
            <div style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid #f8717144', padding: '0.85rem 1.2rem', borderRadius: 12, color: '#f87171', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', maxWidth: '650px' }}>
              <AlertCircle size={18} /> {searchError}
            </div>
          )}

          {claimSuccess && (
            <div style={{ background: 'rgba(74,222,128,0.12)', border: '1px solid #4ade8044', padding: '0.85rem 1.2rem', borderRadius: 12, color: '#4ade80', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', maxWidth: '650px' }}>
              <CheckCircle2 size={18} /> {claimSuccess}
            </div>
          )}

          {/* Searched Certificate Result Card */}
          {searchedCert && (
            <div style={{ marginTop: '1.5rem', background: '#0b111e', border: '1px solid #1e293b', borderRadius: 16, padding: '1.5rem', maxWidth: '650px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ padding: '0.75rem', background: '#1e3a8a', borderRadius: 12, color: '#60a5fa' }}>
                    <Award size={28} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 0.2rem', color: '#fff' }}>{searchedCert.title}</h3>
                    <code style={{ color: '#38bdf8', background: '#0f172a', padding: '0.15rem 0.5rem', borderRadius: 4, fontSize: '0.8rem' }}>
                      {searchedCert.certificateNumber}
                    </code>
                  </div>
                </div>

                <span style={{
                  padding: '0.3rem 0.75rem', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700,
                  background: searchedCert.status === 'active' ? 'rgba(74, 222, 128, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  color: searchedCert.status === 'active' ? '#4ade80' : '#f87171',
                  border: `1px solid ${searchedCert.status === 'active' ? 'rgba(74, 222, 128, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
                }}>
                  {searchedCert.status.toUpperCase()}
                </span>
              </div>

              {searchedCert.description && (
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '0 0 1rem', lineHeight: 1.5 }}>
                  {searchedCert.description}
                </p>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem', background: '#070c16', padding: '0.85rem', borderRadius: 10, fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '1.25rem' }}>
                <div><strong style={{ color: '#64748b' }}>Issuer:</strong> {searchedCert.issuer}</div>
                <div><strong style={{ color: '#64748b' }}>Issued On:</strong> {new Date(searchedCert.issueDate).toLocaleDateString()}</div>
                <div><strong style={{ color: '#64748b' }}>Document:</strong> {searchedCert.fileType.toUpperCase()}</div>
              </div>

              {/* Action Buttons: Preview, Download (No Login Required), and Add to Profile */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => setPreviewCert(searchedCert)}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#1e293b', border: '1px solid #334155', color: '#fff', padding: '0.55rem 0.9rem', borderRadius: 8, fontSize: '0.85rem', cursor: 'pointer' }}
                  >
                    <Eye size={16} /> Preview
                  </button>
                  <a
                    href={searchedCert.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#2563eb', border: 'none', color: '#fff', padding: '0.55rem 0.9rem', borderRadius: 8, fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}
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
                      padding: '0.55rem 1.25rem', background: 'linear-gradient(135deg, #16a34a, #15803d)',
                      color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem',
                      display: 'flex', alignItems: 'center', gap: '0.4rem', boxShadow: '0 4px 12px rgba(22, 163, 74, 0.3)'
                    }}
                  >
                    <CheckCircle2 size={16} /> {claimSubmitting ? 'Linking...' : 'Add to My Profile'}
                  </button>
                )}
              </div>
            </div>
          )}
        </section>

        {/* Section 2: My Certificates Grid */}
        {user && (
          <section>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Award style={{ color: '#38bdf8' }} size={24} />
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>My Issued Certificates</h2>
              </div>
              <span style={{ background: '#1e293b', padding: '0.25rem 0.75rem', borderRadius: 20, fontSize: '0.8rem', color: '#38bdf8', fontWeight: 600 }}>
                {myCertificates.length} {myCertificates.length === 1 ? 'Certificate' : 'Certificates'}
              </span>
            </div>

            {certsLoading ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: '#888' }}>Loading your certificates...</div>
            ) : myCertificates.length === 0 ? (
              <div style={{ background: '#0b0c10', border: '1px dashed #1f2430', borderRadius: 20, padding: '4rem 2rem', textAlign: 'center' }}>
                <Award size={48} style={{ color: '#334155', margin: '0 auto 1rem' }} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 0.5rem', color: '#fff' }}>No Certificates Linked Yet</h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
                  Search for your certificate number above to claim and add your issued certificates to your profile.
                </p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                {myCertificates.map(cert => (
                  <div
                    key={cert._id}
                    style={{
                      background: 'linear-gradient(145deg, #0e131f 0%, #07090f 100%)',
                      border: '1px solid #1e293b', borderRadius: 20, padding: '1.5rem',
                      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                      transition: 'all 0.25s ease', boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                      position: 'relative', overflow: 'hidden'
                    }}
                  >
                    {/* Top Glow Accent */}
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, #38bdf8, #2563eb)' }} />

                    <div>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <div style={{ width: 44, height: 44, borderRadius: 12, background: '#1e3a8a33', border: '1px solid #2563eb44', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Award size={24} />
                        </div>
                        <span style={{
                          padding: '0.2rem 0.6rem', borderRadius: 12, fontSize: '0.7rem', fontWeight: 700,
                          background: cert.status === 'active' ? 'rgba(74,222,128,0.15)' : 'rgba(239,68,68,0.15)',
                          color: cert.status === 'active' ? '#4ade80' : '#f87171'
                        }}>
                          {cert.status.toUpperCase()}
                        </span>
                      </div>

                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.4rem', color: '#fff' }}>
                        {cert.title}
                      </h3>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
                        <code style={{ background: '#0f172a', padding: '0.2rem 0.5rem', borderRadius: 6, color: '#38bdf8', fontSize: '0.8rem', fontWeight: 600, fontFamily: 'monospace' }}>
                          {cert.certificateNumber}
                        </code>
                        <button
                          onClick={() => handleCopyNumber(cert.certificateNumber)}
                          title="Copy Certificate Number"
                          style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: 2 }}
                        >
                          {copiedId === cert.certificateNumber ? <Check size={14} style={{ color: '#4ade80' }} /> : <Copy size={14} />}
                        </button>
                      </div>

                      {cert.description && (
                        <p style={{ fontSize: '0.825rem', color: '#94a3b8', margin: '0 0 1rem', lineHeight: 1.4 }}>
                          {cert.description}
                        </p>
                      )}

                      <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        <div>Issued by: <strong style={{ color: '#cbd5e1' }}>{cert.issuer}</strong></div>
                        <div>Date: <strong style={{ color: '#cbd5e1' }}>{new Date(cert.issueDate).toLocaleDateString()}</strong></div>
                      </div>
                    </div>

                    {/* Bottom Buttons */}
                    <div style={{ display: 'flex', gap: '0.6rem', paddingTop: '1rem', borderTop: '1px solid #1e293b' }}>
                      <button
                        onClick={() => setPreviewCert(cert)}
                        style={{ flex: 1, padding: '0.6rem', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#fff', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                      >
                        <Eye size={15} /> View File
                      </button>
                      <a
                        href={cert.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        style={{ padding: '0.6rem 0.9rem', background: '#2563eb', border: 'none', borderRadius: 8, color: '#fff', fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                      >
                        <Download size={15} /> Download
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      {/* Embedded File Preview Modal */}
      {previewCert && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1.5rem'
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
                  <Download size={14} /> Download PDF/Image
                </a>
                <button onClick={() => setPreviewCert(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                  <ArrowLeft size={22} />
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

      <Footer settings={settings || undefined} />
    </div>
  );
}
