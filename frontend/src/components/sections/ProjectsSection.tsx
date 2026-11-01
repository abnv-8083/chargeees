'use client';
import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import type { ProjectData } from '@/lib/types';
import {
  X, ExternalLink, Search, Calendar, Tag, Send, CheckCircle2,
  AlertCircle, MessageSquare, Info, Zap, Trophy, Clock, ArrowRight,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { submitInquiry } from '@/lib/api';
import CardSwap, { Card, CardSwapRef } from '@/components/ui/CardSwap';

const FALLBACK_PROJECTS: ProjectData[] = [
  // ── 1. Ongoing Projects (Shown 1st by default!) ──
  {
    _id: 'proj-on-1',
    title: 'Aurora Analytics Engine',
    slug: 'aurora-analytics',
    description: 'Next-generation AI-powered business intelligence suite providing predictive insights, real-time demand forecasting, and automated anomaly detection across operations.',
    category: 'Data & Analytics',
    status: 'ongoing',
    coverImage: '',
    gallery: [],
    tags: ['AI Engine', 'Predictive Analytics', 'Supply Chain', 'Real-Time'],
    featured: true,
    client: 'Global Logistics Consortium',
  },
  {
    _id: 'proj-on-2',
    title: 'PulseGrid Smart EV Infrastructure',
    slug: 'pulsegrid-ev',
    description: 'Decentralized smart EV charging network with dynamic load balancing, IoT telemetry, solar micro-grid integration, and automated green power distribution.',
    category: 'CleanTech',
    status: 'ongoing',
    coverImage: '',
    gallery: [],
    tags: ['CleanTech', 'EV Infrastructure', 'IoT', 'Smart Grid'],
    featured: true,
    client: 'Clean Energy Alliance',
  },
  {
    _id: 'proj-on-3',
    title: 'Zenith Global Enterprise Scaling',
    slug: 'zenith-expansion',
    description: 'Comprehensive cross-border market entry and enterprise expansion framework, optimizing operational efficiency and cross-regional compliance.',
    category: 'Strategy',
    status: 'ongoing',
    coverImage: '',
    gallery: [],
    tags: ['Enterprise Scale', 'Cross-Border', 'Governance', 'Strategy'],
    featured: false,
    client: 'European Tech Group',
  },
  {
    _id: 'proj-on-4',
    title: 'Hyperion Zero-Trust Cloud Mesh',
    slug: 'hyperion-mesh',
    description: 'Resilient multi-cloud zero-trust networking mesh designed to orchestrate mission-critical containerized microservices with ultra-low latency.',
    category: 'Technology',
    status: 'ongoing',
    coverImage: '',
    gallery: [],
    tags: ['Zero-Trust', 'Edge Computing', 'Cloud Native', 'Security'],
    featured: false,
    client: 'FinTech Infrastructure Corp',
  },

  // ── 2. Completed Projects ──
  {
    _id: 'proj-comp-1',
    title: 'Nexus Platform Ecosystem',
    slug: 'nexus-platform',
    description: 'Enterprise B2B SaaS platform connecting 500+ global enterprises with end-to-end workflow automation, automated reporting, and unified analytics.',
    category: 'Technology',
    status: 'completed',
    completionDate: '2024-03-01',
    coverImage: '',
    gallery: [],
    tags: ['SaaS', 'Workflow Automation', 'Enterprise'],
    featured: true,
    client: 'Fortune 100 Enterprise',
  },
  {
    _id: 'proj-comp-2',
    title: 'Meridian Digital Transformation',
    slug: 'meridian-initiative',
    description: 'End-to-end digital banking transformation for a premier financial institution, modernizing legacy mainframes and reducing operational overhead by 40%.',
    category: 'Consulting',
    status: 'completed',
    completionDate: '2023-11-01',
    coverImage: '',
    gallery: [],
    tags: ['FinTech', 'Core Banking', 'Cost Optimization'],
    featured: true,
    client: 'Meridian Capital Group',
  },
  {
    _id: 'proj-comp-3',
    title: 'Helix Healthcare Infrastructure',
    slug: 'helix-infrastructure',
    description: 'HIPAA-compliant, high-availability cloud infrastructure modernization for a global hospital network serving 2M+ patients across 8 countries.',
    category: 'Technology',
    status: 'completed',
    completionDate: '2024-06-01',
    coverImage: '',
    gallery: [],
    tags: ['Healthcare', 'Cloud Native', 'High Availability'],
    featured: false,
    client: 'Global Health Network',
  },
  {
    _id: 'proj-comp-4',
    title: 'OmniVanguard Threat Intelligence',
    slug: 'omnivanguard-security',
    description: 'Next-gen cybersecurity threat intelligence mesh using machine learning models to identify and neutralize zero-day attack surfaces across hybrid cloud networks.',
    category: 'Data & Analytics',
    status: 'completed',
    completionDate: '2023-08-15',
    coverImage: '',
    gallery: [],
    tags: ['Cybersecurity', 'Machine Learning', 'Zero-Day'],
    featured: false,
    client: 'Aerospace & Defense Partner',
  },
];

const BG_COLORS = [
  'linear-gradient(135deg, #111 0%, #1a1a1a 100%)',
  'linear-gradient(135deg, #0d0d0d 0%, #161616 100%)',
  'linear-gradient(135deg, #141414 0%, #1c1c1c 100%)',
  'linear-gradient(135deg, #0a0a0a 0%, #171717 100%)',
  'linear-gradient(135deg, #111 0%, #0d0d0d 100%)',
  'linear-gradient(135deg, #161616 0%, #111 100%)',
];

type InquiryFormState = {
  name: string;
  email: string;
  phone: string;
  companyName: string;
  message: string;
};

function ProjectModal({ project, onClose }: { project: ProjectData; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'details' | 'inquiry'>('details');
  const [form, setForm] = useState<InquiryFormState>({ name: '', email: '', phone: '', companyName: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitStatus('idle');
    try {
      await submitInquiry({
        name: form.name,
        email: form.email,
        phone: form.phone,
        companyName: form.companyName,
        subject: `Project Inquiry: ${project.title}`,
        inquiryType: 'Project',
        message: form.message,
      });
      setSubmitStatus('success');
      setSubmitMessage('Your inquiry has been sent! We\'ll get back to you soon.');
      setForm({ name: '', email: '', phone: '', companyName: '', message: '' });
    } catch (err: any) {
      setSubmitStatus('error');
      setSubmitMessage(err.message || 'Failed to send inquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'var(--gray-900)',
    border: '1px solid var(--gray-800)',
    borderRadius: 8,
    padding: '0.7rem 1rem',
    color: 'var(--white)',
    fontSize: '0.875rem',
    fontFamily: 'inherit',
    outline: 'none',
    boxSizing: 'border-box',
  };

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
            <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--white)', cursor: 'pointer' }}>
              <X size={18} />
            </button>
            <div style={{ position: 'absolute', bottom: '1.5rem', left: '2rem', right: '2rem' }}>
              <span className={`status-badge status-${project.status}`} style={{ marginBottom: '0.75rem', display: 'inline-flex' }}>{project.status}</span>
              <h2 className="heading-lg" style={{ color: 'var(--white)' }}>{project.title}</h2>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--gray-800)', padding: '0 2.5rem' }}>
            {([
              { id: 'details', label: 'Project Details', icon: <Info size={15} /> },
              ...(project.status === 'ongoing' ? [{ id: 'inquiry' as const, label: 'Send Inquiry', icon: <MessageSquare size={15} /> }] : []),
            ] as const).map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                  padding: '1rem 1.25rem',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: activeTab === tab.id ? '2px solid var(--white)' : '2px solid transparent',
                  color: activeTab === tab.id ? 'var(--white)' : 'var(--gray-500)',
                  fontSize: '0.875rem',
                  fontWeight: activeTab === tab.id ? 600 : 400,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  marginBottom: '-1px',
                }}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* Modal Body */}
          <div style={{ padding: '2.5rem' }}>
            {activeTab === 'details' && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2.5rem' }}>
                  <div>
                    <p className="body-lg" style={{ marginBottom: '1.5rem', textAlign: 'justify' }}>{project.description}</p>
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
                    {/* CTA to inquiry tab — only for ongoing projects */}
                    {project.status === 'ongoing' && (
                      <button
                        onClick={() => setActiveTab('inquiry')}
                        style={{ marginTop: '1rem', width: '100%', background: 'var(--white)', color: 'var(--black)', border: 'none', borderRadius: 8, padding: '0.75rem 1rem', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                      >
                        <MessageSquare size={15} /> Inquire About This Project
                      </button>
                    )}
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
              </>
            )}

            {activeTab === 'inquiry' && (
              <div style={{ maxWidth: '560px', margin: '0 auto' }}>
                <div style={{ marginBottom: '1.75rem' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--white)', marginBottom: '0.4rem' }}>
                    Inquire About: {project.title}
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>
                    Fill in your details and we&apos;ll get back to you about this project.
                  </p>
                </div>

                {submitStatus === 'success' ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{ textAlign: 'center', padding: '3rem 2rem', border: '1px solid rgba(74,222,128,0.3)', borderRadius: 16, background: 'rgba(74,222,128,0.05)' }}
                  >
                    <CheckCircle2 size={48} style={{ color: '#4ade80', margin: '0 auto 1rem' }} />
                    <h4 style={{ color: 'var(--white)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Inquiry Sent!</h4>
                    <p style={{ color: 'var(--gray-400)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>{submitMessage}</p>
                    <button
                      onClick={() => { setSubmitStatus('idle'); setActiveTab('details'); }}
                      style={{ background: 'transparent', border: '1px solid var(--gray-700)', color: 'var(--gray-300)', padding: '0.6rem 1.25rem', borderRadius: 8, fontSize: '0.875rem', cursor: 'pointer' }}
                    >
                      Back to Details
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {submitStatus === 'error' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.3)', borderRadius: 8, padding: '0.75rem 1rem', color: '#ff6b6b', fontSize: '0.875rem' }}>
                        <AlertCircle size={16} /> {submitMessage}
                      </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--gray-400)', marginBottom: '0.4rem', fontWeight: 500 }}>
                          Full Name <span style={{ color: '#ff6b6b' }}>*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          required
                          placeholder="John Smith"
                          value={form.name}
                          onChange={handleFormChange}
                          style={inputStyle}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--gray-400)', marginBottom: '0.4rem', fontWeight: 500 }}>
                          Email Address <span style={{ color: '#ff6b6b' }}>*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          placeholder="john@company.com"
                          value={form.email}
                          onChange={handleFormChange}
                          style={inputStyle}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--gray-400)', marginBottom: '0.4rem', fontWeight: 500 }}>
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          placeholder="+1 (555) 000-0000"
                          value={form.phone}
                          onChange={handleFormChange}
                          style={inputStyle}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--gray-400)', marginBottom: '0.4rem', fontWeight: 500 }}>
                          Company / Organization
                        </label>
                        <input
                          type="text"
                          name="companyName"
                          placeholder="Your Company"
                          value={form.companyName}
                          onChange={handleFormChange}
                          style={inputStyle}
                        />
                      </div>
                    </div>

                    {/* Read-only project reference */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--gray-400)', marginBottom: '0.4rem', fontWeight: 500 }}>
                        Project Reference
                      </label>
                      <input
                        type="text"
                        value={`Project Inquiry: ${project.title}`}
                        readOnly
                        style={{ ...inputStyle, color: 'var(--gray-500)', cursor: 'default', background: 'rgba(255,255,255,0.03)' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--gray-400)', marginBottom: '0.4rem', fontWeight: 500 }}>
                        Your Message <span style={{ color: '#ff6b6b' }}>*</span>
                      </label>
                      <textarea
                        name="message"
                        required
                        rows={5}
                        placeholder={`Tell us what you'd like to know about ${project.title}, or describe a similar project you have in mind...`}
                        value={form.message}
                        onChange={handleFormChange}
                        style={{ ...inputStyle, resize: 'vertical', minHeight: '120px' }}
                      />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', paddingTop: '0.5rem' }}>
                      <button
                        type="button"
                        onClick={() => setActiveTab('details')}
                        style={{ background: 'transparent', border: '1px solid var(--gray-700)', color: 'var(--gray-400)', padding: '0.7rem 1.25rem', borderRadius: 8, fontSize: '0.875rem', cursor: 'pointer' }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        style={{ background: 'var(--white)', color: 'var(--black)', border: 'none', padding: '0.7rem 1.5rem', borderRadius: 8, fontSize: '0.875rem', fontWeight: 600, cursor: submitting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', opacity: submitting ? 0.7 : 1 }}
                      >
                        <Send size={14} /> {submitting ? 'Sending...' : 'Send Inquiry'}
                      </button>
                    </div>
                  </form>
                )}
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
  // User requirement: 2 sessions (ongoing & completed), with ongoing shown 1st
  const [activeTab, setActiveTab] = useState<'ongoing' | 'completed'>('ongoing');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<ProjectData | null>(null);
  const swapRef = useRef<CardSwapRef>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);


  useEffect(() => {
    if (data && data.length > 0) {
      setProjects(data);
    }
  }, [data]);

  // Separate ongoing and completed projects
  const ongoingProjects = useMemo(() => {
    return projects.filter(p => p.status === 'ongoing' || p.status === 'upcoming' || p.status === 'on-hold');
  }, [projects]);

  const completedProjects = useMemo(() => {
    return projects.filter(p => p.status === 'completed');
  }, [projects]);

  // Current session's projects
  const currentTabProjects = activeTab === 'ongoing' ? ongoingProjects : completedProjects;

  // Handle switching between Ongoing and Completed sessions
  const handleTabChange = (tab: 'ongoing' | 'completed') => {
    setActiveTab(tab);
    setCurrentCardIndex(0);
  };

  // Filtered by search query
  const filtered = useMemo(() => {
    let result = currentTabProjects;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        p =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
      );
    }
    return result;
  }, [currentTabProjects, search]);

  return (
    <section id="projects" className="section-py" style={{ background: 'var(--gray-900)', position: 'relative' }} data-cursor-color="#818cf8">
      <div className="section-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: '2.5rem' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.75rem' }}>
            <p className="label-sm" style={{ margin: 0 }}>Our Portfolio</p>
            <span style={{ fontSize: '0.78rem', color: 'var(--gray-500)', fontFamily: 'var(--font-grotesk)' }}>
              Showing {filtered.length} of {currentTabProjects.length} {activeTab === 'ongoing' ? 'Ongoing' : 'Completed'} Projects
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ maxWidth: '680px' }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="heading-xl" style={{ margin: 0 }}>
                    {activeTab === 'ongoing' ? 'Ongoing Projects' : 'Completed Projects'}
                  </h2>
                  <p className="body-md" style={{ color: 'var(--gray-400)', marginTop: '0.5rem' }}>
                    {activeTab === 'ongoing'
                      ? 'Discover the cutting-edge solutions, technology architectures, and enterprise initiatives currently in active development across our engineering teams.'
                      : 'Explore our track record of battle-tested enterprise platforms, digital transformations, and strategic client milestones successfully delivered.'}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="search-wrapper">
              <Search size={15} className="search-icon" />
              <input
                type="search"
                placeholder={`Search ${activeTab} projects...`}
                className="search-input"
                value={search}
                onChange={e => setSearch(e.target.value)}
                aria-label={`Search ${activeTab} projects`}
              />
            </div>
          </div>

          {/* ── 2 Primary Session Tabs (Ongoing & Completed, Ongoing 1st) ── */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
            <div className="project-tabs-container" style={{ marginBottom: 0 }} role="tablist" aria-label="Project status sessions">
              <button
                role="tab"
                id="tab-ongoing"
                aria-selected={activeTab === 'ongoing'}
                aria-controls="panel-ongoing"
                className={`project-tab-btn ${activeTab === 'ongoing' ? 'active' : ''}`}
                onClick={() => handleTabChange('ongoing')}
              >
                {activeTab === 'ongoing' && (
                  <motion.div
                    layoutId="activeProjectTabIndicator"
                    className="project-tab-indicator"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="live-pulse-dot" />
                <Zap size={16} />
                <span>Ongoing Projects</span>
                <span className="project-tab-count">{ongoingProjects.length}</span>
              </button>

              <button
                role="tab"
                id="tab-completed"
                aria-selected={activeTab === 'completed'}
                aria-controls="panel-completed"
                className={`project-tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
                onClick={() => handleTabChange('completed')}
              >
                {activeTab === 'completed' && (
                  <motion.div
                    layoutId="activeProjectTabIndicator"
                    className="project-tab-indicator"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <CheckCircle2 size={16} />
                <span>Completed Projects</span>
                <span className="project-tab-count">{completedProjects.length}</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Swapping Cards Showcase */}
        {filtered.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', marginTop: '0.5rem' }}>
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: 560,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CardSwap
                ref={swapRef}
                key={activeTab + (search ? '-search-' + search : '')}
                width={500}
                height={350}
                cardDistance={55}
                verticalDistance={65}
                depth={85}
                skewAmount={5}
                delay={4200}
                autoplay={true}
                pauseOnHover={true}
                draggable={true}
                visibleCards={Math.min(4, filtered.length)}
                onChange={(idx) => setCurrentCardIndex(idx)}
                onCardClick={(idx) => {
                  if (filtered[idx]) setSelected(filtered[idx]);
                }}
              >
                {filtered.map((project, i) => (
                  <Card
                    key={project._id}
                    onClick={() => setSelected(project)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                      position: 'relative',
                      overflow: 'hidden',
                      cursor: 'pointer',
                    }}
                  >
                    {/* Background image or gradient */}
                    {project.coverImage ? (
                      <Image
                        src={project.coverImage}
                        alt={project.title}
                        fill
                        style={{ objectFit: 'cover' }}
                        draggable={false}
                      />
                    ) : (
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: BG_COLORS[i % BG_COLORS.length],
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <span
                          style={{
                            opacity: 0.08,
                            fontSize: '9rem',
                            fontWeight: 900,
                            fontFamily: 'var(--font-display)',
                            color: '#ffffff',
                            userSelect: 'none',
                          }}
                        >
                          {project.title[0]}
                        </span>
                      </div>
                    )}

                    {/* Gradient Overlay for high readability */}
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background:
                          'linear-gradient(180deg, rgba(8,8,16,0.78) 0%, rgba(8,8,16,0.25) 30%, rgba(8,8,16,0.92) 75%, rgba(8,8,16,0.98) 100%)',
                        pointerEvents: 'none',
                      }}
                    />

                    {/* Card Content */}
                    <div
                      style={{
                        position: 'relative',
                        zIndex: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                        padding: '1.4rem',
                        boxSizing: 'border-box',
                      }}
                    >
                      {/* Top Bar */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: 'auto' }}>
                        {project.status === 'ongoing' ? (
                          <span className="status-badge status-ongoing" style={{ backdropFilter: 'blur(8px)', background: 'rgba(59,130,246,0.2)' }}>
                            <span className="live-pulse-dot" style={{ width: 6, height: 6 }} /> Ongoing Development
                          </span>
                        ) : (
                          <span className="status-badge status-completed" style={{ backdropFilter: 'blur(8px)', background: 'rgba(139,92,246,0.2)' }}>
                            <CheckCircle2 size={12} /> Completed
                          </span>
                        )}

                        {project.completionDate && project.status === 'completed' ? (
                          <span style={{ fontSize: '0.72rem', color: 'var(--gray-300)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: 'rgba(0,0,0,0.4)', padding: '0.2rem 0.6rem', borderRadius: 100, border: '1px solid rgba(255,255,255,0.1)' }}>
                            <Calendar size={11} /> {new Date(project.completionDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) !== 'Invalid Date' ? new Date(project.completionDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : project.completionDate}
                          </span>
                        ) : project.tags?.[0] ? (
                          <span className="tag" style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.15)', color: 'var(--gray-300)' }}>
                            {project.tags[0]}
                          </span>
                        ) : null}
                      </div>

                      {/* Bottom Info & Actions */}
                      <div style={{ marginTop: 'auto' }}>
                        <h3
                          style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '1.35rem',
                            fontWeight: 700,
                            color: 'var(--white)',
                            lineHeight: 1.25,
                            marginBottom: '0.4rem',
                          }}
                        >
                          {project.title}
                        </h3>
                        <p
                          style={{
                            fontSize: '0.8rem',
                            color: 'var(--gray-300)',
                            lineHeight: 1.45,
                            marginBottom: '0.9rem',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {project.description}
                        </p>

                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '0.5rem',
                            paddingTop: '0.6rem',
                            borderTop: '1px solid rgba(255,255,255,0.1)',
                          }}
                        >
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelected(project);
                            }}
                            style={{
                              background: 'rgba(255,255,255,0.1)',
                              border: '1px solid rgba(255,255,255,0.2)',
                              borderRadius: 8,
                              padding: '0.45rem 0.85rem',
                              color: 'var(--white)',
                              fontSize: '0.78rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              transition: 'all 0.2s',
                            }}
                          >
                            <ExternalLink size={13} /> View Details
                          </button>

                          {project.status === 'ongoing' && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelected(project);
                              }}
                              style={{
                                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                                border: 'none',
                                borderRadius: 8,
                                padding: '0.45rem 0.85rem',
                                color: 'var(--white)',
                                fontSize: '0.78rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                boxShadow: '0 2px 10px rgba(59,130,246,0.35)',
                              }}
                            >
                              <MessageSquare size={13} /> Inquire
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </CardSwap>
            </div>

            {/* Swapping Controls Bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem',
                marginTop: '1.25rem',
                padding: '0.45rem 1rem',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(139, 92, 246, 0.2)',
                borderRadius: 100,
                backdropFilter: 'blur(10px)',
              }}
            >
              <button
                type="button"
                onClick={() => swapRef.current?.prev()}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '50%',
                  width: 34,
                  height: 34,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--white)',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
                aria-label="Previous card"
              >
                <ChevronLeft size={16} />
              </button>

              <span style={{ fontSize: '0.8rem', color: 'var(--gray-300)', fontFamily: 'var(--font-grotesk)', minWidth: 60, textAlign: 'center' }}>
                {filtered.length > 0 ? (currentCardIndex % filtered.length) + 1 : 0} / {filtered.length}
              </span>

              <button
                type="button"
                onClick={() => swapRef.current?.next()}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '50%',
                  width: 34,
                  height: 34,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--white)',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
                aria-label="Next card"
              >
                <ChevronRight size={16} />
              </button>


            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--gray-500)', marginTop: '0.6rem', textAlign: 'center' }}>
              Drag or fling the card to swap • Click to view full details
            </p>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '4.5rem 1.5rem', color: 'var(--gray-500)', border: '1px dashed rgba(139,92,246,0.25)', borderRadius: 18, marginTop: '1.5rem', background: 'rgba(255,255,255,0.015)' }}>
            <p className="heading-md" style={{ color: 'var(--white)', marginBottom: '0.5rem' }}>
              No {activeTab === 'ongoing' ? 'ongoing' : 'completed'} projects found
            </p>
            <p className="body-md" style={{ color: 'var(--gray-400)', maxWidth: '440px', margin: '0 auto 1.5rem' }}>
              We couldn&apos;t find any {activeTab} projects matching your current search.
            </p>
            {search && (
              <button
                onClick={() => setSearch('')}
                style={{ background: 'var(--grad-primary)', border: 'none', color: 'var(--white)', padding: '0.6rem 1.4rem', borderRadius: 100, fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 18px rgba(139,92,246,0.4)' }}
              >
                Clear Search
              </button>
            )}
          </div>
        )}
      </div>

      {/* Project Modal */}
      {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}
