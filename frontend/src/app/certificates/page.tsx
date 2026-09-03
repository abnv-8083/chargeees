'use client';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CertificateSection from '@/components/sections/CertificateSection';
import { fetchSettings } from '@/lib/api';
import type { SiteSettings } from '@/lib/types';

export default function CertificatesPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    fetchSettings().then(setSettings).catch(() => null);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--black)' }}>
      <Navbar settings={settings || undefined} />
      <main style={{ paddingTop: '5rem' }}>
        <CertificateSection />
      </main>
      <Footer settings={settings || undefined} />
    </div>
  );
}
