'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { adminForgotPassword } from '@/lib/api';
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError('');
    try {
      await adminForgotPassword(email);
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Unable to send password reset email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem', background: '#0a0a0a' }}>
      <div style={{ width: '100%', maxWidth: '420px', background: '#0d0d0d', border: '1px solid #222', borderRadius: '20px', padding: '2.5rem' }}>
        <Link href="/admin/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#888', textDecoration: 'none', fontSize: '0.8125rem', marginBottom: '1.5rem' }}>
          <ArrowLeft size={14} /> Back to Login
        </Link>

        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, color: 'var(--white)', marginBottom: '0.5rem' }}>
          Reset Password
        </h1>
        <p style={{ fontSize: '0.875rem', color: '#888', marginBottom: '2rem' }}>
          Enter your admin email address and we'll send you instructions to reset your password.
        </p>

        {error && (
          <div style={{ background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.3)', color: '#ff6b6b', padding: '0.8rem 1rem', borderRadius: '10px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <CheckCircle size={44} color="#4ade80" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Check your inbox</h3>
            <p style={{ color: '#888', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              If an account exists for <b>{email}</b>, you will receive password reset instructions shortly.
            </p>
            <button
              onClick={() => { setSubmitted(false); setEmail(''); }}
              style={{ background: '#222', color: '#fff', border: 'none', padding: '0.7rem 1.5rem', borderRadius: 8, cursor: 'pointer', fontSize: '0.85rem' }}
            >
              Try another email
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label htmlFor="email" style={{ display: 'block', fontSize: '0.8125rem', color: '#aaa', marginBottom: '0.4rem', fontWeight: 500 }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
                <input
                  id="email"
                  type="email"
                  placeholder="admin@chargeease.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  style={{ width: '100%', background: '#151515', border: '1px solid #282828', borderRadius: '10px', padding: '0.75rem 1rem 0.75rem 2.8rem', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', background: '#fff', color: '#000', border: 'none', borderRadius: '10px', padding: '0.85rem', fontSize: '0.9rem', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Sending...' : 'Send Reset Instructions'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
