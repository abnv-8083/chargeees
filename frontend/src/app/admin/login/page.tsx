'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { showToast } from '@/lib/toast';
import { Lock, Mail, ArrowRight, ShieldCheck, Eye, EyeOff, Sparkles } from 'lucide-react';

export default function AdminLoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast.error('Please provide both email and password.');
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      showToast.success('Authenticated successfully! Redirecting to dashboard...');
    } catch (err: any) {
      showToast.error(err.message || 'Invalid administrator email or password.');
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
      {/* Background Grid Pattern */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />

      <div style={{
        width: '100%',
        maxWidth: '440px',
        background: 'rgba(9, 9, 11, 0.95)',
        backdropFilter: 'blur(16px)',
        border: '1px solid #1c1c21',
        borderRadius: '24px',
        padding: '2.5rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 30px rgba(56, 189, 248, 0.08)',
        position: 'relative',
        zIndex: 10
      }}>
        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: '2.25rem' }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'inline-block' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', fontWeight: 700, color: '#fff' }}>
              Charg<span style={{ color: '#38bdf8' }}>Ease</span>
            </span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginTop: '0.5rem', color: '#9ca3af', fontSize: '0.825rem', fontWeight: 500 }}>
            <ShieldCheck size={16} color="#34d399" /> Enterprise CMS Login Portal
          </div>
        </div>

        {/* Form */}
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

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#d4d4d8' }}>
                Password
              </label>
              <Link href="/admin/forgot-password" style={{ fontSize: '0.75rem', color: '#38bdf8', textDecoration: 'none', fontWeight: 500 }}>
                Forgot Password?
              </Link>
            </div>
            <div style={{ position: 'relative' }}>
              <Lock size={17} color="#71717a" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••"
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

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '0.75rem',
              width: '100%',
              background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
              border: 'none',
              color: '#fff',
              padding: '0.85rem',
              borderRadius: 12,
              fontSize: '0.9rem',
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 14px rgba(56, 189, 248, 0.4)',
              transition: 'all 0.2s ease',
            }}
          >
            {loading ? 'Authenticating...' : (
              <>
                Sign In to Dashboard <ArrowRight size={17} />
              </>
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.75rem', borderTop: '1px solid #1c1c21', paddingTop: '1.25rem' }}>
          <Link href="/" style={{ color: '#71717a', fontSize: '0.8rem', textDecoration: 'none', transition: 'color 0.2s ease' }}>
            ← Back to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
}
