'use client';
import React, { useEffect, useState } from 'react';
import { fetchHero, updateHeroSection } from '@/lib/api';
import type { HeroData } from '@/lib/types';
import { showToast } from '@/lib/toast';
import { Save, Sparkles } from 'lucide-react';

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

  useEffect(() => {
    fetchHero()
      .then((res: any) => { if (res) setData(res); })
      .catch(() => showToast.error('Failed to load Hero section content.'))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateHeroSection(data);
      showToast.success('Hero section updated successfully!');
    } catch (err: any) {
      showToast.error(err.message || 'Failed to update hero section.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '4rem 0', textAlign: 'center', color: '#71717a' }}>
        <div className="w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p style={{ fontSize: '0.875rem' }}>Loading Hero Section data...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '820px' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#38bdf8', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>
            <Sparkles size={16} /> Sections / Landing Hero
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, color: '#fff', margin: 0 }}>
            Hero Section Editor
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Configure main headline, introduction tagline, action button links, and particle background options.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ background: '#09090b', border: '1px solid #1c1c21', borderRadius: 18, padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#d4d4d8', marginBottom: '0.4rem' }}>Company Display Name</label>
          <input
            type="text"
            required
            value={data.companyName}
            onChange={e => setData({ ...data, companyName: e.target.value })}
            style={{ width: '100%', background: '#121215', border: '1px solid #22222a', borderRadius: 10, padding: '0.65rem 0.9rem', color: '#fff', fontSize: '0.875rem', outline: 'none' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#d4d4d8', marginBottom: '0.4rem' }}>Main Tagline / Headline</label>
          <input
            type="text"
            required
            value={data.tagline}
            onChange={e => setData({ ...data, tagline: e.target.value })}
            style={{ width: '100%', background: '#121215', border: '1px solid #22222a', borderRadius: 10, padding: '0.65rem 0.9rem', color: '#fff', fontSize: '0.875rem', outline: 'none' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#d4d4d8', marginBottom: '0.4rem' }}>Hero Introduction Text</label>
          <textarea
            rows={4}
            required
            value={data.introduction}
            onChange={e => setData({ ...data, introduction: e.target.value })}
            style={{ width: '100%', background: '#121215', border: '1px solid #22222a', borderRadius: 10, padding: '0.65rem 0.9rem', color: '#fff', fontSize: '0.875rem', outline: 'none', resize: 'vertical' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#d4d4d8', marginBottom: '0.4rem' }}>Primary CTA Button Label</label>
            <input
              type="text"
              value={data.primaryCTA?.label || ''}
              onChange={e => setData({ ...data, primaryCTA: { ...data.primaryCTA!, label: e.target.value } })}
              style={{ width: '100%', background: '#121215', border: '1px solid #22222a', borderRadius: 10, padding: '0.65rem 0.9rem', color: '#fff', fontSize: '0.875rem', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#d4d4d8', marginBottom: '0.4rem' }}>Primary CTA Target Link</label>
            <input
              type="text"
              value={data.primaryCTA?.link || ''}
              onChange={e => setData({ ...data, primaryCTA: { ...data.primaryCTA!, link: e.target.value } })}
              style={{ width: '100%', background: '#121215', border: '1px solid #22222a', borderRadius: 10, padding: '0.65rem 0.9rem', color: '#fff', fontSize: '0.875rem', outline: 'none' }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#d4d4d8', marginBottom: '0.4rem' }}>Secondary CTA Button Label</label>
            <input
              type="text"
              value={data.secondaryCTA?.label || ''}
              onChange={e => setData({ ...data, secondaryCTA: { ...data.secondaryCTA!, label: e.target.value } })}
              style={{ width: '100%', background: '#121215', border: '1px solid #22222a', borderRadius: 10, padding: '0.65rem 0.9rem', color: '#fff', fontSize: '0.875rem', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#d4d4d8', marginBottom: '0.4rem' }}>Secondary CTA Target Link</label>
            <input
              type="text"
              value={data.secondaryCTA?.link || ''}
              onChange={e => setData({ ...data, secondaryCTA: { ...data.secondaryCTA!, link: e.target.value } })}
              style={{ width: '100%', background: '#121215', border: '1px solid #22222a', borderRadius: 10, padding: '0.65rem 0.9rem', color: '#fff', fontSize: '0.875rem', outline: 'none' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #1c1c21', paddingTop: '1.25rem', marginTop: '0.5rem' }}>
          <button
            type="submit"
            disabled={saving}
            style={{
              background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
              color: '#fff',
              border: 'none',
              padding: '0.7rem 1.5rem',
              borderRadius: 10,
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: saving ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 14px rgba(56, 189, 248, 0.35)',
            }}
          >
            <Save size={16} /> {saving ? 'Saving...' : 'Save Hero Section'}
          </button>
        </div>
      </form>
    </div>
  );
}
