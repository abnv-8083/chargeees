'use client';
import React, { useEffect, useState } from 'react';
import { fetchHero, updateHeroSection } from '@/lib/api';
import type { HeroData } from '@/lib/types';
import { Save, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export default function HeroSectionEditorPage() {
  const [data, setData] = useState<HeroData>({
    companyName: 'ChargEase',
    tagline: 'Powering the Future of Business',
    introduction: 'We deliver cutting-edge solutions that transform industries and accelerate growth through innovation, precision, and excellence.',
    primaryCTA: { label: 'Our Projects', link: '#projects' },
    secondaryCTA: { label: 'Get in Touch', link: '#contact' },
    backgroundType: 'particles',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchHero()
      .then((res: any) => { if (res) setData(res); })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await updateHeroSection(data);
      setMessage({ type: 'success', text: 'Hero section updated successfully!' });
      setTimeout(() => setMessage(null), 4000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update hero section.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '2rem', color: '#888' }}>Loading Hero Section data...</div>;
  }

  return (
    <div style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#888', fontSize: '0.8125rem', marginBottom: '0.3rem' }}>
          <Sparkles size={14} /> Sections / Hero
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, color: '#fff' }}>
          Hero Section Editor
        </h1>
        <p style={{ color: '#888', fontSize: '0.875rem' }}>
          Configure the main headline, introduction text, buttons, and background effects for the landing page hero.
        </p>
      </div>

      {message && (
        <div style={{
          background: message.type === 'success' ? 'rgba(74, 222, 128, 0.1)' : 'rgba(255, 107, 107, 0.1)',
          border: `1px solid ${message.type === 'success' ? 'rgba(74, 222, 128, 0.3)' : 'rgba(255, 107, 107, 0.3)'}`,
          color: message.type === 'success' ? '#4ade80' : '#ff6b6b',
          padding: '1rem 1.25rem',
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          marginBottom: '1.5rem',
          fontSize: '0.875rem',
        }}>
          {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ background: '#121212', border: '1px solid #222', borderRadius: 16, padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.8125rem', color: '#aaa', marginBottom: '0.4rem', fontWeight: 500 }}>
            Company Name / Badge Label
          </label>
          <input
            type="text"
            value={data.companyName}
            onChange={e => setData({ ...data, companyName: e.target.value })}
            required
            style={{ width: '100%', background: '#181818', border: '1px solid #2c2c2c', borderRadius: 8, padding: '0.75rem 1rem', color: '#fff', fontSize: '0.9rem' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8125rem', color: '#aaa', marginBottom: '0.4rem', fontWeight: 500 }}>
            Hero Main Headline (Tagline)
          </label>
          <input
            type="text"
            value={data.tagline}
            onChange={e => setData({ ...data, tagline: e.target.value })}
            required
            style={{ width: '100%', background: '#181818', border: '1px solid #2c2c2c', borderRadius: 8, padding: '0.75rem 1rem', color: '#fff', fontSize: '0.9rem' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8125rem', color: '#aaa', marginBottom: '0.4rem', fontWeight: 500 }}>
            Introduction Paragraph
          </label>
          <textarea
            rows={4}
            value={data.introduction}
            onChange={e => setData({ ...data, introduction: e.target.value })}
            required
            style={{ width: '100%', background: '#181818', border: '1px solid #2c2c2c', borderRadius: 8, padding: '0.75rem 1rem', color: '#fff', fontSize: '0.9rem', fontFamily: 'inherit' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', color: '#aaa', marginBottom: '0.4rem', fontWeight: 500 }}>
              Primary Button Label
            </label>
            <input
              type="text"
              value={data.primaryCTA.label}
              onChange={e => setData({ ...data, primaryCTA: { ...data.primaryCTA, label: e.target.value } })}
              required
              style={{ width: '100%', background: '#181818', border: '1px solid #2c2c2c', borderRadius: 8, padding: '0.75rem 1rem', color: '#fff', fontSize: '0.9rem' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', color: '#aaa', marginBottom: '0.4rem', fontWeight: 500 }}>
              Primary Button Link Target
            </label>
            <input
              type="text"
              value={data.primaryCTA.link}
              onChange={e => setData({ ...data, primaryCTA: { ...data.primaryCTA, link: e.target.value } })}
              required
              style={{ width: '100%', background: '#181818', border: '1px solid #2c2c2c', borderRadius: 8, padding: '0.75rem 1rem', color: '#fff', fontSize: '0.9rem' }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', color: '#aaa', marginBottom: '0.4rem', fontWeight: 500 }}>
              Secondary Button Label
            </label>
            <input
              type="text"
              value={data.secondaryCTA.label}
              onChange={e => setData({ ...data, secondaryCTA: { ...data.secondaryCTA, label: e.target.value } })}
              required
              style={{ width: '100%', background: '#181818', border: '1px solid #2c2c2c', borderRadius: 8, padding: '0.75rem 1rem', color: '#fff', fontSize: '0.9rem' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', color: '#aaa', marginBottom: '0.4rem', fontWeight: 500 }}>
              Secondary Button Link Target
            </label>
            <input
              type="text"
              value={data.secondaryCTA.link}
              onChange={e => setData({ ...data, secondaryCTA: { ...data.secondaryCTA, link: e.target.value } })}
              required
              style={{ width: '100%', background: '#181818', border: '1px solid #2c2c2c', borderRadius: 8, padding: '0.75rem 1rem', color: '#fff', fontSize: '0.9rem' }}
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8125rem', color: '#aaa', marginBottom: '0.4rem', fontWeight: 500 }}>
            Background Interactive Effect
          </label>
          <select
            value={data.backgroundType}
            onChange={e => setData({ ...data, backgroundType: e.target.value as any })}
            style={{ width: '100%', background: '#181818', border: '1px solid #2c2c2c', borderRadius: 8, padding: '0.75rem 1rem', color: '#fff', fontSize: '0.9rem' }}
          >
            <option value="particles">Interactive Node Particle Canvas (Recommended)</option>
            <option value="gradient">Subtle Grayscale Radial Gradient</option>
            <option value="image">Static Background Image</option>
          </select>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid #1f1f1f' }}>
          <button
            type="submit"
            disabled={saving}
            style={{ background: '#fff', color: '#000', border: 'none', padding: '0.75rem 1.5rem', borderRadius: 8, fontSize: '0.9rem', fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: saving ? 0.7 : 1 }}
          >
            <Save size={16} /> {saving ? 'Saving Changes...' : 'Save Hero Section'}
          </button>
        </div>
      </form>
    </div>
  );
}
