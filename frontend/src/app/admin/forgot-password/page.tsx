'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { adminForgotPassword } from '@/lib/api';
import { showToast } from '@/lib/toast';
import { Mail, ArrowLeft, CheckCircle, ShieldCheck } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await adminForgotPassword(email);
      setSubmitted(true);
      showToast.success('Password reset link sent! Check your inbox.');
    } catch (err: any) {
      showToast.error(err.message || 'Unable to send password reset email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
      background: 'radial-gradient(circle at 50% 20%, #0e1726 0%, #050505 80%)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />

      <div style={{
        width: '100%',
        maxWidth: '440px',
        background: 'rgba(9, 9, 11, 0.95)',
        backdropFilter: 'blur(16px)',
        border: '1px solid #1c1c21',
        borderRadius: '24px',
        padding: '2.5rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
        position: 'relative',
        zIndex: 10
      }}>
        <Link href="/admin/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#38bdf8', textDecoration: 'none', fontSize: '0.825rem', fontWeight: 500, marginBottom: '1.75rem' }}>
          <ArrowLeft size={15} /> Back to Login
        </Link>

        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, color: '#fff', margin: '0 0 0.5rem' }}>
          Forgot Password
        </h1>
        <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginBottom: '2rem', lineHeight: 1.5 }}>
          Enter your registered admin email address to receive secure password recovery instructions.
        </p>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(52, 211, 153, 0.15)', border: '1px solid rgba(52, 211, 153, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
              <CheckCircle size={28} color="#34d399" />
            </div>
            <h3 style={{ color: '#fff', fontSize: '1.15rem', fontWeight: 700, margin: '0 0 0.5rem' }}>Check Your Email</h3>
            <p style={{ color: '#9ca3af', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '1.75rem' }}>
              If an account exists for <strong style={{ color: '#fff' }}>{email}</strong>, password reset instructions have been dispatched.
            </p>
            <button
              onClick={() => { setSubmitted(false); setEmail(''); }}
              style={{ background: '#121215', border: '1px solid #22222a', color: '#fff', padding: '0.7rem 1.4rem', borderRadius: 10, cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}
            >
              Try Another Email
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#d4d4d8', marginBottom: '0.45rem' }}>
                Admin Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={17} color="#71717a" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@chargeease.com"
                  style={{
                    width: '100%',
                    background: '#121215',
                    border: '1px solid #22222a',
                    borderRadius: 12,
                    padding: '0.75rem 0.9rem 0.75rem 2.5rem',
                    color: '#fff',
                    fontSize: '0.875rem',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: '0.5rem',
                width: '100%',
                background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
                border: 'none',
                color: '#fff',
                padding: '0.85rem',
                borderRadius: 12,
                fontSize: '0.9rem',
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 14px rgba(56, 189, 248, 0.4)',
                transition: 'all 0.2s ease',
              }}
            >
              {loading ? 'Sending Instructions...' : 'Send Password Reset Link'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
