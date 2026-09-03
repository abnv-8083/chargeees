import {
  fetchHero, fetchAbout, fetchVision, fetchMission,
  fetchFounders, fetchCoFounders, fetchProjects,
  fetchServices, fetchSettings,
} from '@/lib/api';
import ClientPage from './ClientPage';

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
