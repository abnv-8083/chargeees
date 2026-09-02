'use client';
import React, { useEffect, useState } from 'react';
import { fetchHero, updateHeroSection } from '@/lib/api';
import type { HeroData } from '@/lib/types';
import { showToast } from '@/lib/toast';
import {
  Save, Sparkles, Type, AlignLeft, MousePointerClick,
  Layers, Eye, ArrowRight, ExternalLink, RefreshCw, Zap,
} from 'lucide-react';

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: '#0d0d0f',
  border: '1px solid #222228',
  borderRadius: 10,
  padding: '0.7rem 1rem',
  color: '#f4f4f5',
  fontSize: '0.875rem',
  outline: 'none',
  fontFamily: 'inherit',
  transition: 'border-color 0.2s ease',
  boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.775rem',
  fontWeight: 600,
  color: '#71717a',
  marginBottom: '0.45rem',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
};

const hintStyle: React.CSSProperties = {
  fontSize: '0.72rem',
  color: '#52525b',
  marginTop: '0.35rem',
};

function SectionCard({
  icon, label, accent = '#38bdf8', children,
}: {
  icon: React.ReactNode;
  label: string;
  accent?: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{
      background: '#09090b',
      border: '1px solid #18181b',
      borderRadius: 16,
      overflow: 'hidden',
    }}>
      {/* Card Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        padding: '0.9rem 1.4rem',
        borderBottom: '1px solid #18181b',
        background: '#0d0d0f',
      }}>
        <span style={{
          width: 30, height: 30, borderRadius: 8,
          background: `${accent}18`,
          border: `1px solid ${accent}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: accent, flexShrink: 0,
        }}>
          {icon}
        </span>
        <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#e4e4e7' }}>{label}</span>
      </div>
      {/* Card Body */}
      <div style={{ padding: '1.4rem', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
        {children}
      </div>
    </div>
  );
}

function Field({
  label, hint, children, counter,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  counter?: React.ReactNode;
}) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
        <label style={labelStyle}>{label}</label>
        {counter}
      </div>
      {children}
      {hint && <p style={hintStyle}>{hint}</p>}
    </div>
  );
}

function CharCounter({ value, max }: { value: string; max: number }) {
  const len = value.length;
  const color = len > max ? '#f87171' : len > max * 0.8 ? '#fbbf24' : '#3f3f46';
  return (
    <span style={{ fontSize: '0.72rem', fontWeight: 600, color }}>{len}/{max}</span>
  );
}

const BG_OPTIONS = [
  { value: 'particles', label: 'Particle Canvas', description: 'Interactive animated nodes', icon: '✦' },
  { value: 'gradient', label: 'Radial Gradient', description: 'Subtle grayscale glow effect', icon: '◎' },
  { value: 'image', label: 'Static Image', description: 'Custom background image', icon: '▣' },
];

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
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    fetchHero()
      .then((res: any) => { if (res) setData(res); })
      .catch(() => showToast.error('Failed to load Hero section.'))
      .finally(() => setLoading(false));
  }, []);

  const update = (patch: Partial<HeroData>) => {
    setData(prev => ({ ...prev, ...patch }));
    setDirty(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateHeroSection(data);
      showToast.success('Hero section saved!', 'Changes are now live on the landing page.');
      setDirty(false);
    } catch (err: any) {
      showToast.error(err.message || 'Failed to save hero section.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '5rem 0', gap: '1rem', color: '#52525b' }}>
        <div className="w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
        <span style={{ fontSize: '0.875rem' }}>Loading Hero Section…</span>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '860px', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>

      {/* ── Page Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#38bdf8', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem' }}>
            <Sparkles size={14} /> Sections / Hero
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.875rem', fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>
            Hero Section Editor
          </h1>
          <p style={{ color: '#52525b', fontSize: '0.875rem', marginTop: '0.3rem' }}>
            Configure the main headline, introduction text, CTAs and background for the landing page hero.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {dirty && (
            <span style={{ fontSize: '0.75rem', color: '#fbbf24', background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.25)', padding: '0.3rem 0.7rem', borderRadius: 20, fontWeight: 600 }}>
              Unsaved changes
            </span>
          )}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: '#71717a', textDecoration: 'none', background: '#0d0d0f', border: '1px solid #222228', padding: '0.45rem 0.9rem', borderRadius: 8 }}
          >
            <ExternalLink size={13} /> Preview Live
          </a>
        </div>
      </div>

      {/* ── Live Preview Strip ── */}
      <div style={{
        background: 'linear-gradient(135deg, #0c1726 0%, #091322 50%, #0a0f1e 100%)',
        border: '1px solid #1e3a5f',
        borderRadius: 14,
        padding: '1.5rem 2rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 50%, rgba(56,189,248,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#38bdf8', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.85rem' }}>
          <Eye size={12} /> Live Preview
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
          <span style={{ background: 'rgba(56,189,248,0.12)', border: '1px solid rgba(56,189,248,0.25)', color: '#38bdf8', fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.65rem', borderRadius: 20 }}>
            {data.companyName || '—'}
          </span>
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 700, color: '#fff', margin: '0 0 0.4rem', lineHeight: 1.3, maxWidth: '560px' }}>
          {data.tagline || <span style={{ color: '#3f3f46' }}>Your tagline will appear here…</span>}
        </h2>
        <p style={{ fontSize: '0.825rem', color: '#6b7280', margin: '0 0 1rem', maxWidth: '520px', lineHeight: 1.6 }}>
          {data.introduction || <span style={{ color: '#3f3f46' }}>Introduction paragraph…</span>}
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <span style={{ background: 'linear-gradient(135deg, #38bdf8, #0284c7)', color: '#fff', fontSize: '0.775rem', fontWeight: 600, padding: '0.45rem 1rem', borderRadius: 8, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            {data.primaryCTA.label || 'Primary CTA'} <ArrowRight size={13} />
          </span>
          <span style={{ background: 'transparent', border: '1px solid #334155', color: '#94a3b8', fontSize: '0.775rem', fontWeight: 500, padding: '0.45rem 1rem', borderRadius: 8 }}>
            {data.secondaryCTA.label || 'Secondary CTA'}
          </span>
        </div>
      </div>

      {/* ── Form ── */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

        {/* Identity */}
        <SectionCard icon={<Type size={15} />} label="Brand Identity" accent="#38bdf8">
          <Field
            label="Company Name / Badge Label"
            hint="Displayed as the badge above the headline on the live page."
            counter={<CharCounter value={data.companyName} max={40} />}
          >
            <input
              type="text"
              required
              value={data.companyName}
              onChange={e => update({ companyName: e.target.value })}
              placeholder="e.g. ChargEase"
              style={inputStyle}
            />
          </Field>
        </SectionCard>

        {/* Content */}
        <SectionCard icon={<AlignLeft size={15} />} label="Headline & Introduction" accent="#a78bfa">
          <Field
            label="Hero Main Headline (Tagline)"
            hint="Prominent headline. Keep it punchy — ideally under 60 characters."
            counter={<CharCounter value={data.tagline} max={80} />}
          >
            <input
              type="text"
              required
              value={data.tagline}
              onChange={e => update({ tagline: e.target.value })}
              placeholder="e.g. Powering the Future of Business"
              style={inputStyle}
            />
          </Field>

          <Field
            label="Introduction Paragraph"
            hint="Supporting copy below the headline. 1–3 sentences recommended."
            counter={<CharCounter value={data.introduction} max={300} />}
          >
            <textarea
              rows={4}
              value={data.introduction}
              onChange={e => update({ introduction: e.target.value })}
              placeholder="Describe what your company does and who it serves…"
              style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
            />
          </Field>
        </SectionCard>

        {/* CTAs */}
        <SectionCard icon={<MousePointerClick size={15} />} label="Call-to-Action Buttons" accent="#34d399">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Field label="Primary Button — Label">
              <input
                type="text"
                required
                value={data.primaryCTA.label}
                onChange={e => update({ primaryCTA: { ...data.primaryCTA, label: e.target.value } })}
                placeholder="e.g. Explore Our Work"
                style={inputStyle}
              />
            </Field>
            <Field label="Primary Button — Link / Anchor" hint="Use a URL or anchor like #projects">
              <input
                type="text"
                required
                value={data.primaryCTA.link}
                onChange={e => update({ primaryCTA: { ...data.primaryCTA, link: e.target.value } })}
                placeholder="#projects"
                style={inputStyle}
              />
            </Field>
          </div>

          <div style={{ height: 1, background: '#18181b' }} />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Field label="Secondary Button — Label">
              <input
                type="text"
                value={data.secondaryCTA.label}
                onChange={e => update({ secondaryCTA: { ...data.secondaryCTA, label: e.target.value } })}
                placeholder="e.g. Get in Touch"
                style={inputStyle}
              />
            </Field>
            <Field label="Secondary Button — Link / Anchor">
              <input
                type="text"
                value={data.secondaryCTA.link}
                onChange={e => update({ secondaryCTA: { ...data.secondaryCTA, link: e.target.value } })}
                placeholder="#contact"
                style={inputStyle}
              />
            </Field>
          </div>
        </SectionCard>

        {/* Background */}
        <SectionCard icon={<Layers size={15} />} label="Background Effect" accent="#fbbf24">
          <Field label="Select Background Type" hint="Controls the animated or static visual behind the hero content.">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
              {BG_OPTIONS.map(opt => {
                const active = data.backgroundType === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => update({ backgroundType: opt.value as HeroData['backgroundType'] })}
                    style={{
                      background: active ? 'rgba(251,191,36,0.08)' : '#0d0d0f',
                      border: `1px solid ${active ? 'rgba(251,191,36,0.4)' : '#222228'}`,
                      borderRadius: 10,
                      padding: '0.85rem 0.75rem',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ fontSize: '1.25rem', marginBottom: '0.35rem' }}>{opt.icon}</div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: active ? '#fbbf24' : '#e4e4e7', marginBottom: '0.15rem' }}>{opt.label}</div>
                    <div style={{ fontSize: '0.7rem', color: '#52525b', lineHeight: 1.4 }}>{opt.description}</div>
                    {active && (
                      <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#fbbf24', fontSize: '0.7rem', fontWeight: 700 }}>
                        <Zap size={10} /> Active
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </Field>
        </SectionCard>

        {/* Save Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#09090b',
          border: '1px solid #18181b',
          borderRadius: 14,
          padding: '1rem 1.4rem',
        }}>
          <p style={{ fontSize: '0.8rem', color: '#3f3f46', margin: 0 }}>
            Changes are reflected immediately on the live site after saving.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button
              type="button"
              onClick={() => { setDirty(false); setLoading(true); fetchHero().then((res: any) => { if (res) setData(res); }).finally(() => setLoading(false)); }}
              title="Discard changes"
              style={{ background: '#0d0d0f', border: '1px solid #222228', color: '#71717a', padding: '0.6rem', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              <RefreshCw size={15} />
            </button>
            <button
              type="submit"
              disabled={saving}
              style={{
                background: saving ? '#0c2d45' : 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
                color: '#fff',
                border: 'none',
                padding: '0.65rem 1.5rem',
                borderRadius: 10,
                fontSize: '0.875rem',
                fontWeight: 700,
                cursor: saving ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: saving ? 'none' : '0 4px 14px rgba(56, 189, 248, 0.3)',
                transition: 'all 0.2s ease',
                opacity: saving ? 0.7 : 1,
              }}
            >
              <Save size={15} /> {saving ? 'Saving…' : 'Save Hero Section'}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}
