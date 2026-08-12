'use client';
import React, { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { adminResetPassword } from '@/lib/api';
import { showToast } from '@/lib/toast';
import { Lock, CheckCircle, Eye, EyeOff, ShieldCheck } from 'lucide-react';

export default function ResetPasswordPage({ params }: { params: Promise<{ token: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      showToast.error('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      showToast.error('Password must be at least 6 characters long.');
      return;
    }
    setLoading(true);
    try {
      await adminResetPassword(resolvedParams.token, password);
      setSuccess(true);
      showToast.success('Password updated successfully! Redirecting to login...');
      setTimeout(() => router.push('/admin/login'), 2500);
    } catch (err: any) {
      showToast.error(err.message || 'Token is invalid or has expired.');
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
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, color: '#fff', margin: '0 0 0.5rem' }}>
          Set New Password
        </h1>
        <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginBottom: '2rem', lineHeight: 1.5 }}>
          Create a new secure credentials password for your administrator account.
        </p>

        {success ? (
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(52, 211, 153, 0.15)', border: '1px solid rgba(52, 211, 153, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
              <CheckCircle size={28} color="#34d399" />
            </div>
            <h3 style={{ color: '#fff', fontSize: '1.15rem', fontWeight: 700, margin: '0 0 0.5rem' }}>Password Updated!</h3>
            <p style={{ color: '#9ca3af', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '1.75rem' }}>
              Your admin credentials have been reset. Redirecting to login page...
            </p>
            <Link
              href="/admin/login"
              style={{ display: 'inline-block', background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)', color: '#fff', textDecoration: 'none', padding: '0.7rem 1.4rem', borderRadius: 10, fontSize: '0.85rem', fontWeight: 700 }}
            >
              Go to Login Now
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#d4d4d8', marginBottom: '0.45rem' }}>
                New Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={17} color="#71717a" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="At least 6 characters..."
                  style={{
                    width: '100%',
                    background: '#121215',
                    border: '1px solid #22222a',
                    borderRadius: 12,
                    padding: '0.75rem 2.5rem 0.75rem 2.5rem',
                    color: '#fff',
                    fontSize: '0.875rem',
                    outline: 'none',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '0.9rem', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: '#71717a', cursor: 'pointer', display: 'flex' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#d4d4d8', marginBottom: '0.45rem' }}>
                Confirm New Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={17} color="#71717a" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password..."
                  style={{
                    width: '100%',
                    background: '#121215',
                    border: '1px solid #22222a',
                    borderRadius: 12,
                    padding: '0.75rem 2.5rem 0.75rem 2.5rem',
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
              {loading ? 'Updating Password...' : 'Save New Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
