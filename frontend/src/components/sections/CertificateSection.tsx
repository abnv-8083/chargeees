'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award, Search, CheckCircle2, AlertCircle, Eye, Download,
  Copy, Check, X, ShieldCheck, FileSearch, UserCheck,
  Calendar, Building2, Hash, ArrowRight, RefreshCw, Lock,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { searchCertificateByNumber, claimCertificate, getUserCertificates } from '@/lib/api';
import type { CertificateData } from '@/lib/types';

/* ─── tiny helpers ───────────────────────────────────────────────────────── */
const fmt = (d: string) =>
  new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

/* ─── Step guide data ────────────────────────────────────────────────────── */
const STEPS = [
  { icon: <Hash size={20} />,        num: '01', title: 'Enter Certificate No.',  desc: 'Type your certificate number in the search box above.' },
  { icon: <FileSearch size={20} />,  num: '02', title: 'Verify Instantly',        desc: 'Our system fetches the official record in seconds.' },
  { icon: <Eye size={20} />,         num: '03', title: 'Preview & Download',      desc: 'View the certificate online or download the original file.' },
  { icon: <UserCheck size={20} />,   num: '04', title: 'Link to Your Profile',    desc: 'Optionally add it to your personal profile for future access.' },
];

/* ─── Status badge ───────────────────────────────────────────────────────── */
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string; border: string }> = {
    active:  { bg: 'rgba(34,197,94,0.12)',  color: '#22c55e', border: 'rgba(34,197,94,0.3)'  },
    revoked: { bg: 'rgba(239,68,68,0.12)',  color: '#ef4444', border: 'rgba(239,68,68,0.3)'  },
    expired: { bg: 'rgba(234,179,8,0.12)',  color: '#eab308', border: 'rgba(234,179,8,0.3)'  },
  };
  const s = map[status] || map.active;
  return (
    <span style={{ padding: '0.3rem 0.85rem', borderRadius: 100, fontSize: '0.72rem', fontWeight: 700,
      letterSpacing: '0.06em', textTransform: 'uppercase', background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
      ● {status}
    </span>
  );
}

/* ─── Preview modal ──────────────────────────────────────────────────────── */
function PreviewModal({ cert, onClose }: { cert: CertificateData; onClose: () => void }) {
  const isImage = cert.fileType === 'image' || /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(cert.fileUrl);
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.93)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999, padding: '1rem' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.94, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94, y: 10 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        onClick={e => e.stopPropagation()}
        style={{ background: '#0a0a0a', border: '1px solid var(--gray-800)', borderRadius: 20,
          width: '100%', maxWidth: 900, height: '88vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
      >
        {/* header */}
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--gray-800)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--white)' }}>{cert.title}</h3>
            <code style={{ fontSize: '0.75rem', color: 'var(--gray-500)', fontFamily: 'monospace' }}>{cert.certificateNumber}</code>
          </div>
          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
            <a href={cert.fileUrl} target="_blank" rel="noopener noreferrer" download
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'var(--white)',
                color: 'var(--black)', padding: '0.5rem 1rem', borderRadius: 8,
                textDecoration: 'none', fontSize: '0.8rem', fontWeight: 700 }}>
              <Download size={14} /> Download
            </a>
            <button onClick={onClose}
              style={{ background: 'var(--gray-900)', border: '1px solid var(--gray-800)',
                color: 'var(--gray-400)', borderRadius: 8, width: 36, height: 36,
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <X size={16} />
            </button>
          </div>
        </div>
        {/* body */}
        <div style={{ flex: 1, background: '#050505', display: 'flex', alignItems: 'center',
          justifyContent: 'center', padding: '1.5rem', overflow: 'auto' }}>
          {isImage
            ? <img src={cert.fileUrl} alt={cert.title}
                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: 12 }} />
            : <iframe src={cert.fileUrl} style={{ width: '100%', height: '100%', border: 'none', borderRadius: 10 }}
                title="Certificate Document" />}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Main section ───────────────────────────────────────────────────────── */
export default function CertificateSection() {
  const { user, openAuthModal } = useAuth();

  const [certNum, setCertNum]         = useState('');
  const [result, setResult]           = useState<any | null>(null);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState('');
  const [claiming, setClaiming]       = useState(false);
  const [claimOk, setClaimOk]         = useState('');
  const [myCerts, setMyCerts]         = useState<CertificateData[]>([]);
  const [certsLoading, setCertsLoading] = useState(false);
  const [preview, setPreview]         = useState<CertificateData | null>(null);
  const [copied, setCopied]           = useState<string | null>(null);

  useEffect(() => {
    if (user) loadMy(); else setMyCerts([]);
  }, [user]);

  const loadMy = async () => {
    setCertsLoading(true);
    try { setMyCerts(await getUserCertificates()); }
    catch { /* silent */ }
    finally { setCertsLoading(false); }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setClaimOk(''); setResult(null);
    if (!certNum.trim()) { setError('Please enter a certificate number.'); return; }
    setLoading(true);
    try { setResult(await searchCertificateByNumber(certNum.trim())); }
    catch (err: any) { setError(err.message || 'No certificate found with that number.'); }
    finally { setLoading(false); }
  };

  const handleClaim = async () => {
    if (!user) { openAuthModal('login'); return; }
    if (!result) return;
    setClaiming(true); setError('');
    try {
      await claimCertificate(result.certificateNumber);
      setClaimOk('Certificate linked to your profile successfully!');
      setResult(null); setCertNum('');
      loadMy();
    } catch (err: any) { setError(err.message || 'Failed to link certificate.'); }
    finally { setClaiming(false); }
  };

  const copy = (val: string) => {
    navigator.clipboard.writeText(val);
    setCopied(val);
    setTimeout(() => setCopied(null), 2000);
  };

  /* ── render ── */
  return (
    <section id="certificate" className="section-py"
      style={{ background: 'var(--black)', position: 'relative', borderTop: '1px solid var(--gray-900)' }}
      data-cursor-color="#22c55e">

      {/* subtle grid bg */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, opacity: 0.018,
        backgroundImage: 'linear-gradient(var(--gray-800) 1px, transparent 1px), linear-gradient(90deg, var(--gray-800) 1px, transparent 1px)',
        backgroundSize: '48px 48px', pointerEvents: 'none' }} />

      <div className="section-container" style={{ position: 'relative' }}>

        {/* ── Portal header ── */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ textAlign: 'center', marginBottom: 'clamp(2.5rem, 5vw, 4rem)' }}>

          {/* Official badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            border: '1px solid var(--gray-800)', borderRadius: 100,
            padding: '0.4rem 1rem', marginBottom: '1.25rem',
            background: 'rgba(255,255,255,0.03)' }}>
            <ShieldCheck size={14} style={{ color: 'var(--gray-400)' }} />
            <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-grotesk)', fontWeight: 600,
              letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--gray-400)' }}>
              Official Certificate Portal
            </span>
          </div>

          <h2 className="heading-xl" style={{ marginBottom: '1rem' }}>
            Certificate <em>Verification</em>
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--gray-500)', maxWidth: 560,
            margin: '0 auto', lineHeight: 1.7 }}>
            Verify the authenticity of any certificate issued by ChargEase instantly.
            No account required to search and download.
          </p>
        </motion.div>

        {/* ── Search portal card ── */}
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          style={{ maxWidth: 780, margin: '0 auto clamp(3rem, 6vw, 5rem)' }}>

          <div style={{ background: 'var(--gray-900)', border: '1px solid var(--gray-800)',
            borderRadius: 20, overflow: 'hidden' }}>

            {/* card header bar */}
            <div style={{ background: 'var(--white)', padding: '1rem 1.75rem',
              display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Award size={20} style={{ color: 'var(--black)', flexShrink: 0 }} />
              <div>
                <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700,
                  fontFamily: 'var(--font-grotesk)', color: 'var(--black)' }}>
                  Certificate Verification System
                </p>
                <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--gray-600)' }}>
                  Enter a valid certificate number to retrieve the official document
                </p>
              </div>
            </div>

            {/* search body */}
            <div style={{ padding: '2rem 1.75rem' }}>
              <form onSubmit={handleSearch}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600,
                  color: 'var(--gray-400)', letterSpacing: '0.06em', textTransform: 'uppercase',
                  marginBottom: '0.6rem', fontFamily: 'var(--font-grotesk)' }}>
                  Certificate Number
                </label>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 240, position: 'relative' }}>
                    <Search size={16} style={{ position: 'absolute', left: '1rem',
                      top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-600)' }} />
                    <input
                      type="text"
                      placeholder="e.g. CERT-2026-1234"
                      value={certNum}
                      onChange={e => setCertNum(e.target.value.toUpperCase())}
                      style={{ width: '100%', padding: '0.85rem 1rem 0.85rem 2.75rem',
                        background: 'var(--black)', border: '1px solid var(--gray-800)',
                        borderRadius: 10, color: 'var(--white)', fontSize: '0.9rem',
                        fontFamily: 'var(--font-grotesk)', fontWeight: 600,
                        outline: 'none', boxSizing: 'border-box',
                        letterSpacing: '0.04em' }}
                    />
                  </div>
                  <button type="submit" disabled={loading}
                    style={{ padding: '0.85rem 1.75rem', background: 'var(--white)',
                      color: 'var(--black)', border: 'none', borderRadius: 10,
                      fontWeight: 700, fontSize: '0.875rem', cursor: loading ? 'not-allowed' : 'pointer',
                      display: 'flex', alignItems: 'center', gap: '0.5rem',
                      opacity: loading ? 0.7 : 1, whiteSpace: 'nowrap',
                      fontFamily: 'var(--font-grotesk)' }}>
                    {loading
                      ? <><RefreshCw size={15} style={{ animation: 'spin 1s linear infinite' }} /> Searching…</>
                      : <><Search size={15} /> Verify Certificate</>}
                  </button>
                </div>
              </form>

              {/* info hint */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem',
                marginTop: '1rem', padding: '0.65rem 1rem',
                background: 'rgba(255,255,255,0.03)', border: '1px solid var(--gray-800)',
                borderRadius: 8 }}>
                <Lock size={13} style={{ color: 'var(--gray-600)', flexShrink: 0 }} />
                <p style={{ margin: 0, fontSize: '0.775rem', color: 'var(--gray-600)', lineHeight: 1.5 }}>
                  Certificate numbers follow the format <code style={{ color: 'var(--gray-400)',
                    background: 'var(--gray-900)', padding: '0.1rem 0.4rem', borderRadius: 4,
                    fontFamily: 'monospace' }}>CERT-YYYY-XXXX</code>.
                  All data is secured and tamper-proof.
                </p>
              </div>

              {/* error */}
              <AnimatePresence>
                {error && (
                  <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem',
                      background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
                      color: '#f87171', padding: '0.85rem 1rem', borderRadius: 10,
                      fontSize: '0.85rem', marginTop: '1rem' }}>
                    <AlertCircle size={16} /> {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* claim success */}
              <AnimatePresence>
                {claimOk && (
                  <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem',
                      background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)',
                      color: '#4ade80', padding: '0.85rem 1rem', borderRadius: 10,
                      fontSize: '0.85rem', marginTop: '1rem' }}>
                    <CheckCircle2 size={16} /> {claimOk}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── Result card (inside portal card) ── */}
            <AnimatePresence>
              {result && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
                  <div style={{ margin: '0 1.75rem 1.75rem',
                    border: '1px solid var(--gray-700)', borderRadius: 14,
                    overflow: 'hidden', background: 'var(--black)' }}>

                    {/* result header */}
                    <div style={{ padding: '1.25rem 1.5rem',
                      borderBottom: '1px solid var(--gray-800)',
                      display: 'flex', justifyContent: 'space-between',
                      alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                      <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
                        <div style={{ width: 48, height: 48, borderRadius: 12,
                          background: 'var(--gray-900)', border: '1px solid var(--gray-800)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: 'var(--gray-300)', flexShrink: 0 }}>
                          <Award size={24} />
                        </div>
                        <div>
                          <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700,
                            color: 'var(--white)', marginBottom: '0.3rem' }}>{result.title}</h3>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <code style={{ fontSize: '0.8rem', fontFamily: 'monospace',
                              color: 'var(--gray-400)', background: 'var(--gray-900)',
                              padding: '0.15rem 0.5rem', borderRadius: 5 }}>
                              {result.certificateNumber}
                            </code>
                            <button onClick={() => copy(result.certificateNumber)}
                              style={{ background: 'none', border: 'none',
                                color: copied === result.certificateNumber ? '#4ade80' : 'var(--gray-600)',
                                cursor: 'pointer', padding: 2 }}>
                              {copied === result.certificateNumber
                                ? <Check size={13} />
                                : <Copy size={13} />}
                            </button>
                          </div>
                        </div>
                      </div>
                      <StatusBadge status={result.status} />
                    </div>

                    {/* meta grid */}
                    <div style={{ display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                      gap: 0, borderBottom: '1px solid var(--gray-800)' }}>
                      {[
                        { icon: <Building2 size={13} />, label: 'Issued By',   value: result.issuer },
                        { icon: <Calendar  size={13} />, label: 'Issue Date',  value: fmt(result.issueDate) },
                        { icon: <FileSearch size={13} />, label: 'Format',     value: result.fileType?.toUpperCase() },
                        ...(result.expiryDate ? [{ icon: <Calendar size={13} />, label: 'Expiry', value: fmt(result.expiryDate) }] : []),
                      ].map((row, i) => (
                        <div key={i} style={{ padding: '0.85rem 1.25rem',
                          borderRight: i < 2 ? '1px solid var(--gray-800)' : 'none' }}>
                          <p style={{ margin: 0, fontSize: '0.7rem', fontFamily: 'var(--font-grotesk)',
                            fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase',
                            color: 'var(--gray-600)', display: 'flex', alignItems: 'center',
                            gap: '0.3rem', marginBottom: '0.3rem' }}>
                            {row.icon} {row.label}
                          </p>
                          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--white)', fontWeight: 600 }}>
                            {row.value}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* description */}
                    {result.description && (
                      <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--gray-800)' }}>
                        <p style={{ margin: 0, fontSize: '0.825rem', color: 'var(--gray-500)', lineHeight: 1.65 }}>
                          {result.description}
                        </p>
                      </div>
                    )}

                    {/* actions */}
                    <div style={{ padding: '1rem 1.5rem',
                      display: 'flex', flexWrap: 'wrap', gap: '0.65rem',
                      justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                        <button onClick={() => setPreview(result)}
                          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem',
                            background: 'var(--gray-900)', border: '1px solid var(--gray-700)',
                            color: 'var(--white)', padding: '0.6rem 1.1rem', borderRadius: 8,
                            fontSize: '0.825rem', fontWeight: 600, cursor: 'pointer' }}>
                          <Eye size={15} /> Preview
                        </button>
                        <a href={result.fileUrl} target="_blank" rel="noopener noreferrer" download
                          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem',
                            background: 'var(--white)', border: 'none',
                            color: 'var(--black)', padding: '0.6rem 1.1rem', borderRadius: 8,
                            fontSize: '0.825rem', fontWeight: 700, textDecoration: 'none' }}>
                          <Download size={15} /> Download
                        </a>
                      </div>

                      {result.isClaimedByMe ? (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem',
                          color: '#4ade80', fontSize: '0.825rem', fontWeight: 600 }}>
                          <CheckCircle2 size={16} /> Added to Your Profile
                        </span>
                      ) : result.isClaimedByOthers ? (
                        <span style={{ fontSize: '0.8rem', color: 'var(--gray-600)' }}>
                          Already claimed by another account
                        </span>
                      ) : (
                        <button onClick={handleClaim} disabled={claiming}
                          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem',
                            background: 'transparent', border: '1px solid var(--gray-600)',
                            color: 'var(--white)', padding: '0.6rem 1.1rem', borderRadius: 8,
                            fontSize: '0.825rem', fontWeight: 600,
                            cursor: claiming ? 'not-allowed' : 'pointer',
                            opacity: claiming ? 0.7 : 1 }}>
                          <UserCheck size={15} />
                          {claiming ? 'Linking…' : 'Add to My Profile'}
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* ── How it works ── */}
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.05 }}
          style={{ marginBottom: 'clamp(3rem, 6vw, 5rem)' }}>
          <p className="label-sm" style={{ textAlign: 'center', marginBottom: '2rem' }}>
            How It Works
          </p>
          <div style={{ display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1px', background: 'var(--gray-800)',
            border: '1px solid var(--gray-800)', borderRadius: 16, overflow: 'hidden' }}>
            {STEPS.map((step, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.6 }}
                style={{ background: 'var(--black)', padding: '1.75rem 1.5rem',
                  display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10,
                    border: '1px solid var(--gray-800)', background: 'var(--gray-900)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--gray-400)' }}>
                    {step.icon}
                  </div>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem',
                    fontWeight: 700, color: 'var(--gray-800)', lineHeight: 1 }}>
                    {step.num}
                  </span>
                </div>
                <div>
                  <h4 style={{ margin: '0 0 0.35rem', fontSize: '0.9rem', fontWeight: 700,
                    color: 'var(--white)', fontFamily: 'var(--font-grotesk)' }}>{step.title}</h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--gray-500)', lineHeight: 1.6 }}>
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── My Certificates (logged-in) ── */}
        {user && (
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem',
              paddingTop: '2.5rem', borderTop: '1px solid var(--gray-800)' }}>
              <div>
                <p className="label-sm" style={{ marginBottom: '0.3rem' }}>Your Portfolio</p>
                <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 'clamp(1.2rem, 2.5vw, 1.75rem)',
                  fontWeight: 700, color: 'var(--white)' }}>My Certificates</h3>
              </div>
              {myCerts.length > 0 && (
                <span style={{ padding: '0.3rem 0.85rem', background: 'var(--gray-900)',
                  border: '1px solid var(--gray-800)', borderRadius: 100,
                  fontSize: '0.75rem', fontWeight: 700, color: 'var(--gray-400)',
                  fontFamily: 'var(--font-grotesk)' }}>
                  {myCerts.length} Certificate{myCerts.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>

            {certsLoading ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--gray-600)', fontSize: '0.875rem' }}>
                <RefreshCw size={20} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 0.75rem' }} />
                <p style={{ margin: 0 }}>Loading your certificates…</p>
              </div>
            ) : myCerts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 2rem',
                border: '1px solid var(--gray-800)', borderRadius: 16,
                background: 'var(--gray-900)' }}>
                <Award size={40} style={{ color: 'var(--gray-700)', margin: '0 auto 1rem' }} />
                <p style={{ margin: '0 0 0.4rem', fontSize: '0.95rem', fontWeight: 600, color: 'var(--white)' }}>
                  No certificates linked yet
                </p>
                <p style={{ margin: 0, fontSize: '0.825rem', color: 'var(--gray-600)' }}>
                  Search for a certificate number above and click "Add to My Profile"
                </p>
              </div>
            ) : (
              <div style={{ display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '1rem' }}>
                {myCerts.map(cert => (
                  <motion.div key={cert._id}
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                    style={{ background: 'var(--gray-900)', border: '1px solid var(--gray-800)',
                      borderRadius: 16, overflow: 'hidden',
                      display: 'flex', flexDirection: 'column' }}>
                    {/* top accent line */}
                    <div style={{ height: 3, background: cert.status === 'active'
                      ? 'linear-gradient(90deg, var(--white), var(--gray-500))'
                      : 'var(--gray-800)' }} />
                    <div style={{ padding: '1.25rem', flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between',
                        alignItems: 'flex-start', marginBottom: '0.85rem' }}>
                        <div style={{ width: 38, height: 38, borderRadius: 10,
                          background: 'var(--black)', border: '1px solid var(--gray-800)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: 'var(--gray-500)' }}>
                          <Award size={18} />
                        </div>
                        <StatusBadge status={cert.status} />
                      </div>
                      <h4 style={{ margin: '0 0 0.4rem', fontSize: '0.95rem', fontWeight: 700,
                        color: 'var(--white)' }}>{cert.title}</h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem',
                        marginBottom: '0.5rem' }}>
                        <code style={{ fontSize: '0.75rem', fontFamily: 'monospace',
                          color: 'var(--gray-500)', background: 'var(--black)',
                          padding: '0.15rem 0.45rem', borderRadius: 4 }}>
                          {cert.certificateNumber}
                        </code>
                        <button onClick={() => copy(cert.certificateNumber)}
                          style={{ background: 'none', border: 'none',
                            color: copied === cert.certificateNumber ? '#4ade80' : 'var(--gray-600)',
                            cursor: 'pointer', padding: 2 }}>
                          {copied === cert.certificateNumber ? <Check size={12} /> : <Copy size={12} />}
                        </button>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem',
                        fontSize: '0.775rem', color: 'var(--gray-600)' }}>
                        <Calendar size={12} />
                        {fmt(cert.issueDate)}
                        <span style={{ color: 'var(--gray-800)' }}>·</span>
                        <Building2 size={12} />
                        {cert.issuer}
                      </div>
                    </div>
                    {/* actions */}
                    <div style={{ padding: '0.85rem 1.25rem',
                      borderTop: '1px solid var(--gray-800)',
                      display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => setPreview(cert)}
                        style={{ flex: 1, display: 'flex', alignItems: 'center',
                          justifyContent: 'center', gap: '0.35rem',
                          background: 'var(--black)', border: '1px solid var(--gray-800)',
                          color: 'var(--white)', padding: '0.55rem', borderRadius: 8,
                          fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}>
                        <Eye size={13} /> Preview
                      </button>
                      <a href={cert.fileUrl} target="_blank" rel="noopener noreferrer" download
                        style={{ flex: 1, display: 'flex', alignItems: 'center',
                          justifyContent: 'center', gap: '0.35rem',
                          background: 'var(--white)', color: 'var(--black)',
                          padding: '0.55rem', borderRadius: 8,
                          fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none' }}>
                        <Download size={13} /> Download
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* not logged in — prompt */}
        {!user && (
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={{ marginTop: '0.5rem', padding: '1.5rem 2rem',
              border: '1px solid var(--gray-800)', borderRadius: 14,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              flexWrap: 'wrap', gap: '1rem', background: 'var(--gray-900)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Lock size={18} style={{ color: 'var(--gray-500)', flexShrink: 0 }} />
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--gray-400)' }}>
                <strong style={{ color: 'var(--white)' }}>Have a certificate?</strong>{' '}
                Sign in to link it to your profile and access it anytime.
              </p>
            </div>
            <button onClick={() => openAuthModal('login')}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem',
                background: 'var(--white)', color: 'var(--black)', border: 'none',
                padding: '0.6rem 1.25rem', borderRadius: 8,
                fontSize: '0.825rem', fontWeight: 700, cursor: 'pointer',
                whiteSpace: 'nowrap' }}>
              Sign In <ArrowRight size={14} />
            </button>
          </motion.div>
        )}
      </div>

      {/* Preview modal */}
      <AnimatePresence>
        {preview && <PreviewModal cert={preview} onClose={() => setPreview(null)} />}
      </AnimatePresence>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </section>
  );
}
