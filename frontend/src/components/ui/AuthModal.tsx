'use client';
import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, AlertCircle, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { adminLogin, clientRegister } from '@/lib/api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
  onSuccess?: (user: any, token: string) => void;
}

export default function AuthModal({ isOpen, onClose, initialMode = 'login', onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (mode === 'register') {
        if (!name.trim()) {
          setError('Please provide your full name.');
          setLoading(false);
          return;
        }
        const res = await clientRegister(name, email, password);
        if (res.token && res.user) {
          localStorage.setItem('token', res.token);
          setSuccessMsg('Account created successfully! Logging you in...');
          setTimeout(() => {
            if (onSuccess) onSuccess(res.user, res.token);
            onClose();
            resetForm();
          }, 800);
        }
      } else {
        const res = await adminLogin(email, password);
        // Note: backend sendTokenResponse returns { token, user: { id, name, email, role } }
        const userData = res.user || res.data;
        if (res.token && userData) {
          localStorage.setItem('token', res.token);
          setSuccessMsg('Logged in successfully!');
          setTimeout(() => {
            if (onSuccess) onSuccess(userData, res.token);
            onClose();
            resetForm();
          }, 600);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setError('');
    setSuccessMsg('');
  };

  return (
    <div
      className="auth-modal"
      style={{
        position: 'fixed', inset: 0, zIndex: 99999,
        background: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="auth-modal-card"
        style={{
          background: 'linear-gradient(145deg, #0d111a 0%, #06080e 100%)',
          border: '1px solid #1e293b', borderRadius: 24, width: '100%', maxWidth: '440px',
          padding: '2rem', color: '#fff', boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
          position: 'relative', overflow: 'hidden', animation: 'modalFadeIn 0.25s ease-out'
        }}
      >
        {/* Top Accent Line */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, #38bdf8, #3b82f6, #6366f1)' }} />

        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '1.25rem', right: '1.25rem',
            background: '#161e2e', border: '1px solid #28364f', color: '#94a3b8',
            width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'all 0.2s ease'
          }}
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            width: 52, height: 52, borderRadius: 16, background: '#172554', border: '1px solid #1e40af55',
            color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.85rem'
          }}>
            <Lock size={24} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 0.35rem', letterSpacing: '-0.01em' }}>
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0 }}>
            {mode === 'login' ? 'Log in to access your certificates & profile' : 'Sign up to manage and claim your certificates'}
          </p>
        </div>

        {/* Mode Toggle Switch */}
        <div style={{ display: 'flex', background: '#090d16', border: '1px solid #1e293b', padding: 4, borderRadius: 12, marginBottom: '1.5rem' }}>
          <button
            type="button"
            onClick={() => { setMode('login'); setError(''); setSuccessMsg(''); }}
            style={{
              flex: 1, padding: '0.55rem', border: 'none', borderRadius: 8,
              fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s ease',
              background: mode === 'login' ? '#1e293b' : 'transparent',
              color: mode === 'login' ? '#fff' : '#64748b',
            }}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(''); setSuccessMsg(''); }}
            style={{
              flex: 1, padding: '0.55rem', border: 'none', borderRadius: 8,
              fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s ease',
              background: mode === 'register' ? '#1e293b' : 'transparent',
              color: mode === 'register' ? '#fff' : '#64748b',
            }}
          >
            Register
          </button>
        </div>

        {/* Feedback Alerts */}
        {error && (
          <div style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid #f8717144', padding: '0.75rem 1rem', borderRadius: 10, color: '#f87171', fontSize: '0.85rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {successMsg && (
          <div style={{ background: 'rgba(74,222,128,0.12)', border: '1px solid #4ade8044', padding: '0.75rem 1rem', borderRadius: 10, color: '#4ade80', fontSize: '0.85rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={16} /> {successMsg}
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {mode === 'register' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.35rem', fontWeight: 500 }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <UserIcon size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  style={{
                    width: '100%', padding: '0.75rem 1rem 0.75rem 2.6rem',
                    background: '#090d16', border: '1px solid #1e293b', borderRadius: 10,
                    color: '#fff', fontSize: '0.875rem', outline: 'none'
                  }}
                />
              </div>
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.35rem', fontWeight: 500 }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
              <input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={{
                  width: '100%', padding: '0.75rem 1rem 0.75rem 2.6rem',
                  background: '#090d16', border: '1px solid #1e293b', borderRadius: 10,
                  color: '#fff', fontSize: '0.875rem', outline: 'none'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.35rem', fontWeight: 500 }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={{
                  width: '100%', padding: '0.75rem 1rem 0.75rem 2.6rem',
                  background: '#090d16', border: '1px solid #1e293b', borderRadius: 10,
                  color: '#fff', fontSize: '0.875rem', outline: 'none'
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '0.85rem', background: 'linear-gradient(135deg, #0284c7, #2563eb)',
              color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              marginTop: '0.5rem', boxShadow: '0 4px 16px rgba(37,99,235,0.4)', opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Processing...' : mode === 'login' ? 'Log In' : 'Create Account'}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        <style jsx global>{`
          @keyframes modalFadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
        `}</style>
      </div>
    </div>
  );
}
