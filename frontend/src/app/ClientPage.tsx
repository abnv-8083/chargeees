'use client';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import { FounderSection, CoFounderSection } from '@/components/sections/FounderSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import ServicesSection from '@/components/sections/ServicesSection';
import InquirySection from '@/components/sections/InquirySection';
import ContactSection from '@/components/sections/ContactSection';
import Footer from '@/components/Footer';
import GallerySection from '@/components/sections/GallerySection';
import type {
  HeroData, AboutData, VisionData, MissionData,
  FounderData, ProjectData, ServiceData, SiteSettings, GalleryItemData,
} from '@/lib/types';

import LoadingScreen from '@/components/ui/LoadingScreen';

const CustomCursor  = dynamic(() => import('@/components/ui/CustomCursor'),  { ssr: false });
const ScrollProgress = dynamic(() => import('@/components/ui/ScrollProgress'), { ssr: false });

type Props = {
  hero: HeroData | null;
  about: AboutData | null;
  vision: VisionData | null;
  mission: MissionData | null;
  founders: FounderData[];
  cofounders: FounderData[];
  projects: ProjectData[];
  services: ServiceData[];
  settings: SiteSettings | null;
  gallery: GalleryItemData[];
};

export default function ClientPage({
  hero, about, vision, mission,
  founders, cofounders, projects, services, settings, gallery,
}: Props) {
  const allFounders = [...founders, ...cofounders];
  const [isLoaded, setIsLoaded] = useState(false);

  // Safety fallback: ensure hero starts even if loader completes abnormally
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  // Auto-scroll to anchor hash when arriving from other pages (e.g. /#projects, /#inquiry, /#contact)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const id = window.location.hash.slice(1);
      const timer = setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          const offset = 80;
          const y = el.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 400);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <>
      <LoadingScreen onComplete={() => setIsLoaded(true)} />
      <CustomCursor />
      <ScrollProgress />
      <div style={{ opacity: isLoaded ? 1 : 0, transition: 'opacity 0.4s ease' }}>
        <Navbar settings={settings || undefined} />
        <main>
          <HeroSection data={hero || undefined} isLoaded={isLoaded} />
          <div className="divider" />

          {/* About — includes Vision & Mission tabs inside */}
          <AboutSection
            data={about || undefined}
            vision={vision || undefined}
            mission={mission || undefined}
          />
          <div className="divider" />

          {/* Founders */}
          <FounderSection data={allFounders.length > 0 ? allFounders : undefined} />
          <div className="divider" />

          <ProjectsSection data={projects.length > 0 ? projects : undefined} />
          <div className="divider" />
          <ServicesSection data={services.length > 0 ? services : undefined} />
          <div className="divider" />
          <GallerySection data={gallery.length > 0 ? gallery : undefined} />
          <div className="divider" />
          <InquirySection />
          <div className="divider" />
          <ContactSection settings={settings || undefined} />
        </main>
        <Footer settings={settings || undefined} />
      </div>
    </>
  );
}
