'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import type { ProjectData } from '@/lib/types';
import { X, ExternalLink, Search, Calendar, Tag } from 'lucide-react';

const FALLBACK_PROJECTS: ProjectData[] = [
  { _id: '1', title: 'Nexus Platform', slug: 'nexus', description: 'A comprehensive B2B SaaS platform connecting 500+ enterprises globally with seamless workflow automation and real-time analytics.', category: 'Technology', status: 'completed', completionDate: '2024-03-01', coverImage: '', gallery: [], tags: ['SaaS', 'Enterprise'], featured: true, client: 'Enterprise Client' },
  { _id: '2', title: 'Meridian Initiative', slug: 'meridian', description: 'Large-scale digital transformation project for a Fortune 500 financial institution, reducing operational costs by 40%.', category: 'Consulting', status: 'completed', completionDate: '2023-11-01', coverImage: '', gallery: [], tags: ['Finance', 'Digital'], featured: true, client: 'Fortune 500' },
  { _id: '3', title: 'Aurora Analytics', slug: 'aurora', description: 'Next-generation business intelligence suite providing predictive insights across supply chain, marketing, and operations.', category: 'Data & Analytics', status: 'ongoing', coverImage: '', gallery: [], tags: ['Analytics', 'AI'], featured: false, client: '' },
  { _id: '4', title: 'Helix Infrastructure', slug: 'helix', description: 'Cloud-native infrastructure modernization for a global healthcare network, serving 2M+ patients across 8 countries.', category: 'Technology', status: 'completed', completionDate: '2024-06-01', coverImage: '', gallery: [], tags: ['Cloud', 'Healthcare'], featured: false, client: 'Global Healthcare' },
  { _id: '5', title: 'Zenith Expansion', slug: 'zenith', description: 'Market entry and expansion strategy for a leading European tech company entering the North American market.', category: 'Strategy', status: 'ongoing', coverImage: '', gallery: [], tags: ['Strategy', 'Markets'], featured: false, client: 'European Tech Co.' },
  { _id: '6', title: 'Catalyst Program', slug: 'catalyst', description: 'Accelerator program empowering 50 emerging startups with mentorship, funding access, and strategic partnerships.', category: 'Innovation', status: 'upcoming', coverImage: '', gallery: [], tags: ['Startups', 'Mentorship'], featured: false, client: '' },
];

const BG_COLORS = [
  'linear-gradient(135deg, #111 0%, #1a1a1a 100%)',
  'linear-gradient(135deg, #0d0d0d 0%, #161616 100%)',
  'linear-gradient(135deg, #141414 0%, #1c1c1c 100%)',
  'linear-gradient(135deg, #0a0a0a 0%, #171717 100%)',
  'linear-gradient(135deg, #111 0%, #0d0d0d 100%)',
  'linear-gradient(135deg, #161616 0%, #111 100%)',
];

function ProjectModal({ project, onClose }: { project: ProjectData; onClose: () => void }) {
  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="modal-content"
          initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          onClick={e => e.stopPropagation()}
        >
          {/* Modal Header Image */}
          <div style={{ aspectRatio: '16/7', position: 'relative', background: BG_COLORS[0], borderRadius: '24px 24px 0 0', overflow: 'hidden' }}>
            {project.coverImage ? (
              <Image src={project.coverImage} alt={project.title} fill style={{ objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, var(--gray-800), var(--gray-900))' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '4rem', fontWeight: 700, color: 'var(--gray-700)' }}>{project.title[0]}</span>
              </div>
            )}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.9) 100%)' }} />
            <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--white)' }}>
              <X size={18} />
            </button>
            <div style={{ position: 'absolute', bottom: '1.5rem', left: '2rem', right: '2rem' }}>
              <span className={`status-badge status-${project.status}`} style={{ marginBottom: '0.75rem', display: 'inline-flex' }}>{project.status}</span>
              <h2 className="heading-lg" style={{ color: 'var(--white)' }}>{project.title}</h2>
            </div>
          </div>

          {/* Modal Body */}
          <div style={{ padding: '2.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2.5rem' }}>
              <div>
                <p className="body-lg" style={{ marginBottom: '1.5rem' }}>{project.description}</p>
                {project.tags.length > 0 && (
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {project.tags.map((tag, i) => <span key={i} className="tag">{tag}</span>)}
                  </div>
                )}
              </div>
              <div>
                <div style={{ padding: '1.5rem', border: '1px solid var(--gray-800)', borderRadius: 12 }}>
                  {[
                    { label: 'Category', value: project.category, icon: <Tag size={14} /> },
                    { label: 'Status', value: project.status, icon: null },
                    ...(project.client ? [{ label: 'Client', value: project.client, icon: null }] : []),
                    ...(project.completionDate ? [{ label: 'Completed', value: new Date(project.completionDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }), icon: <Calendar size={14} /> }] : []),
                  ].map((row, i) => (
                    <div key={i} style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--gray-800)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--gray-500)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>{row.icon}{row.label}</span>
                      <span style={{ fontSize: '0.875rem', color: 'var(--white)', fontFamily: 'var(--font-grotesk)' }}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Gallery */}
            {project.gallery.length > 0 && (
              <div style={{ marginTop: '2rem' }}>
                <p className="label-sm" style={{ marginBottom: '1rem' }}>Project Gallery</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem' }}>
                  {project.gallery.map((img, i) => (
                    <div key={i} style={{ borderRadius: 8, overflow: 'hidden', aspectRatio: '4/3', background: 'var(--gray-800)' }}>
                      <Image src={img.url} alt={img.caption || `Gallery ${i + 1}`} width={400} height={300} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function ProjectsSection({ data }: { data?: ProjectData[]; categories?: string[] }) {
  const [projects, setProjects] = useState<ProjectData[]>(data || FALLBACK_PROJECTS);
  const [filtered, setFiltered] = useState<ProjectData[]>(data || FALLBACK_PROJECTS);
  const [activeFilter, setActiveFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<ProjectData | null>(null);
  const categories = ['All', ...Array.from(new Set(projects.map(p => p.category)))];

  useEffect(() => {
    let result = projects;
    if (activeFilter !== 'All') result = result.filter(p => p.category === activeFilter);
    if (search) result = result.filter(p => p.title.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase()));
    setFiltered(result);
  }, [activeFilter, search, projects]);

  return (
    <section id="projects" className="section-py" style={{ background: 'var(--gray-900)', position: 'relative' }}>
      <div className="section-container">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }} style={{ marginBottom: '3rem' }}>
          <p className="label-sm" style={{ marginBottom: '1rem' }}>Our Portfolio</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.5rem' }}>
            <h2 className="heading-xl">Featured Projects</h2>
            <div className="search-wrapper">
              <Search size={15} className="search-icon" />
              <input
                type="search"
                placeholder="Search projects..."
                className="search-input"
                value={search}
                onChange={e => setSearch(e.target.value)}
                aria-label="Search projects"
              />
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <div className="projects-filters" role="group" aria-label="Project category filters">
          {categories.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${activeFilter === cat ? 'active' : ''}`}
              onClick={() => setActiveFilter(cat)}
              aria-pressed={activeFilter === cat}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter + search}
            className="projects-grid"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {filtered.map((project, i) => (
              <motion.div
                key={project._id}
                className="project-card"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.06, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => setSelected(project)}
                role="button"
                aria-label={`View project: ${project.title}`}
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && setSelected(project)}
                data-cursor-hover
              >
                {project.coverImage ? (
                  <Image
                    src={project.coverImage}
                    alt={project.title}
                    fill
                    className="project-card-image"
                    style={{ objectFit: 'cover' }}
                    loading="lazy"
                  />
                ) : (
                  <div className="project-card-placeholder" style={{ background: BG_COLORS[i % BG_COLORS.length] }}>
                    <div style={{ marginBottom: 'auto', paddingTop: '1.5rem' }}>
                      <span className="tag">{project.category}</span>
                    </div>
                    <div>
                      <span className={`status-badge status-${project.status}`} style={{ marginBottom: '0.75rem', display: 'inline-flex' }}>{project.status}</span>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--white)', lineHeight: 1.2, marginBottom: '0.5rem' }}>{project.title}</h3>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--gray-500)', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{project.description}</p>
                    </div>
                  </div>
                )}
                <div className="project-card-overlay">
                  <span className={`status-badge status-${project.status}`} style={{ marginBottom: '0.75rem' }}>{project.status}</span>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--white)', lineHeight: 1.2, marginBottom: '0.5rem' }}>{project.title}</h3>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--gray-400)', lineHeight: 1.6 }}>{project.category}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', color: 'var(--gray-400)', fontSize: '0.8rem' }}>
                    <ExternalLink size={14} /> View Details
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--gray-600)' }}>
            <p className="heading-md">No projects found</p>
            <p className="body-md" style={{ marginTop: '0.5rem' }}>Try adjusting your search or filter</p>
          </div>
        )}
      </div>

      {/* Project Modal */}
      {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}
