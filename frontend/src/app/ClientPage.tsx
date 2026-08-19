'use client';
import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import VisionSection from '@/components/sections/VisionSection';
import MissionSection from '@/components/sections/MissionSection';
import { FounderSection, CoFounderSection } from '@/components/sections/FounderSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import ServicesSection from '@/components/sections/ServicesSection';
import GallerySection from '@/components/sections/GallerySection';
import CertificateSection from '@/components/sections/CertificateSection';
import InquirySection from '@/components/sections/InquirySection';
import ContactSection from '@/components/sections/ContactSection';
import Footer from '@/components/Footer';
import type { HeroData, AboutData, VisionData, MissionData, FounderData, ProjectData, ServiceData, GalleryItemData, SiteSettings } from '@/lib/types';

// Client-only components
const CustomCursor = dynamic(() => import('@/components/ui/CustomCursor'), { ssr: false });
const LoadingScreen = dynamic(() => import('@/components/ui/LoadingScreen'), { ssr: false });
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
  gallery: GalleryItemData[];
  settings: SiteSettings | null;
};

export default function ClientPage({ hero, about, vision, mission, founders, cofounders, projects, services, gallery, settings }: Props) {
  return (
    <>
      <LoadingScreen />
      <CustomCursor />
      <ScrollProgress />
      <Navbar settings={settings || undefined} />
      <main>
        <HeroSection data={hero || undefined} />
        <div className="divider" />
        <AboutSection data={about || undefined} />
        <div className="divider" />
        <VisionSection data={vision || undefined} />
        <div className="divider" />
        <MissionSection data={mission || undefined} />
        <div className="divider" />
        <FounderSection data={[...(founders.length > 0 ? founders : []), ...(cofounders.length > 0 ? cofounders : [])].length > 0 ? [...founders, ...cofounders] : undefined} />
        <div className="divider" />
        <ProjectsSection data={projects.length > 0 ? projects : undefined} />
        <div className="divider" />
        <ServicesSection data={services.length > 0 ? services : undefined} />
        <div className="divider" />
        <GallerySection data={gallery.length > 0 ? gallery : undefined} />
        <div className="divider" />
        <CertificateSection />
        <div className="divider" />
        <InquirySection />
        <div className="divider" />
        <ContactSection settings={settings || undefined} />
      </main>
      <Footer settings={settings || undefined} />
    </>
  );
}
