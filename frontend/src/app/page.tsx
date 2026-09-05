import {
  fetchHero, fetchAbout, fetchVision, fetchMission,
  fetchFounders, fetchCoFounders, fetchProjects,
  fetchServices, fetchSettings,
} from '@/lib/api';
import ClientPage from './ClientPage';

// Ensure dynamic server rendering on every request so admin changes reflect immediately
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  // Fetch all data in parallel
  const [hero, about, vision, mission, founders, cofounders, projectsRes, services, settings] = await Promise.all([
    fetchHero(),
    fetchAbout(),
    fetchVision(),
    fetchMission(),
    fetchFounders(),
    fetchCoFounders(),
    fetchProjects(),
    fetchServices(),
    fetchSettings(),
  ]);

  return (
    <ClientPage
      hero={hero}
      about={about}
      vision={vision}
      mission={mission}
      founders={founders}
      cofounders={cofounders}
      projects={projectsRes?.data || []}
      services={services}
      settings={settings}
    />
  );
}
