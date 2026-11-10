'use client';
import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import type { ProjectData } from '@/lib/types';
import {
  X,
  ExternalLink,
  Search,
  Calendar,
  Tag,
  Send,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Info,
  ArrowUpRight,
  Building2,
  Sparkles,
  Layers,
  Orbit,
} from 'lucide-react';
import { submitInquiry } from '@/lib/api';
import CircularGallery from '@/components/ui/CircularGallery';

const FALLBACK_PROJECTS: ProjectData[] = [
  // ── 1. Ongoing Projects (Shown 1st by default!) ──
  {
    _id: 'proj-on-1',
    title: 'Aurora Analytics Engine',
    slug: 'aurora-analytics',
    description: 'Next-generation AI-powered business intelligence suite providing predictive insights, real-time demand forecasting, and automated anomaly detection across operations.',
    category: 'Data & Analytics',
    status: 'ongoing',
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80',
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
    coverImage: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1000&q=80',
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
    coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80',
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
    coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1000&q=80',
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
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=80',
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
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80',
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
    coverImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1000&q=80',
    gallery: [],
    tags: ['Healthcare', 'Cloud Native', 'High Availability'],
    featured: false,
    client: 'Global Health Network',
  },
  {
    _id: 'proj-comp-4',
    title: 'OmniVanguard Threat Intelligence',
    slug: 'omnivanguard-threat',
    description: 'Autonomous cyber defense system integrating behavioral anomaly heuristics and automated incident remediation for financial networks.',
    category: 'Security',
    status: 'completed',
    completionDate: '2024-01-15',
    coverImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1000&q=80',
    gallery: [],
    tags: ['Cybersecurity', 'Autonomous Defense', 'SOC Automation'],
    featured: false,
    client: 'Sovereign Wealth Fund',
  },
];

const BG_COLORS = [
  'linear-gradient(135deg, #18182e 0%, #0d0d1a 100%)',
  'linear-gradient(135deg, #1a162b 0%, #0c0a18 100%)',
  'linear-gradient(135deg, #111e2e 0%, #080f1a 100%)',
  'linear-gradient(135deg, #24142a 0%, #0f0815 100%)',
  'linear-gradient(135deg, #181828 0%, #090914 100%)',
  'linear-gradient(135deg, #1a202c 0%, #0a0d14 100%)',
];

type InquiryFormState = {
  name: string;
  email: string;
  phone: string;
  companyName: string;
  message: string;
};

function ProjectModal({
  project,
  initialTab = 'details',
  onClose,
}: {
  project: ProjectData;
  initialTab?: 'details' | 'inquiry';
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState<'details' | 'inquiry'>(initialTab);
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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="modal-content"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
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
                    {project.tags && project.tags.length > 0 && (
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
                {project.gallery && project.gallery.length > 0 && (
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

function ProjectStackCard({
  project,
  index,
  total,
  onSelect,
}: {
  project: ProjectData;
  index: number;
  total: number;
  onSelect: (p: ProjectData, tab?: 'details' | 'inquiry') => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Track the scroll of this card relative to viewport
  const { scrollYProgress: enterProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'start start'],
  });

  // Track the exit/stack progression as user scrolls past this card
  const { scrollYProgress: exitProgress } = useScroll({
    target: cardRef,
    offset: ['start start', 'end start'],
  });

  const isLast = index === total - 1;
  const targetScale = total <= 1 || isLast ? 1 : Math.max(0.92, 1 - (total - index - 1) * 0.025);

  const scale = useTransform(exitProgress, [0, 1], [1, targetScale]);
  const opacity = useTransform(exitProgress, [0, 0.7, 1], [1, 0.96, isLast ? 1 : 0.75]);
  const brightness = useTransform(exitProgress, [0, 1], [1, isLast ? 1 : 0.68]);
  const filter = useTransform(brightness, b => `brightness(${b})`);

  // Parallax on image inside card
  const imageY = useTransform(enterProgress, [0, 1], [-20, 20]);

  // Stepped sticky offset so cards create stacked tab edges
  const topOffset = Math.min(index * 16, 48);

  const formattedDate = project.completionDate
    ? new Date(project.completionDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : null;

  return (
    <motion.div
      ref={cardRef}
      className="project-stack-card-wrapper"
      style={{
        top: `calc(88px + ${topOffset}px)`,
        zIndex: index + 1,
        marginBottom: isLast ? '1rem' : '4.5rem',
        scale,
        opacity,
        filter,
      }}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="project-stack-card" data-cursor-hover>
        <div className="project-card-glow" />

        {/* Card Top Metadata Strip */}
        <div className="project-card-topbar">
          <div className="project-card-topbar-left">
            <span className="project-index-pill">0{index + 1}</span>
            <span className={`status-badge status-${project.status}`}>
              {project.status === 'ongoing' ? (
                <>
                  <span className="live-pulse-dot" style={{ width: 6, height: 6 }} /> Ongoing
                </>
              ) : (
                <>
                  <CheckCircle2 size={12} /> Completed
                </>
              )}
            </span>
            <span className="tag">{project.category}</span>
          </div>

          <div className="project-card-topbar-right">
            {project.client && (
              <span className="project-meta-item">
                <Building2 size={13} style={{ color: 'var(--purple-400)' }} />
                <span>{project.client}</span>
              </span>
            )}
            {formattedDate && (
              <span className="project-meta-item">
                <Calendar size={13} style={{ color: 'var(--purple-400)' }} />
                <span>{formattedDate}</span>
              </span>
            )}
          </div>
        </div>

        {/* Card Body */}
        <div className="project-card-body">
          {/* Info Column */}
          <div className="project-info-col">
            <h3 className="project-title">{project.title}</h3>
            <p className="project-description">{project.description}</p>

            {project.tags && project.tags.length > 0 && (
              <div className="project-tags-list">
                {project.tags.map((tag, tIdx) => (
                  <span key={tIdx} className="project-tag-pill">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <div className="project-actions-row">
              <button
                type="button"
                onClick={() => onSelect(project, 'details')}
                className="project-btn-primary"
                aria-label={`View details for ${project.title}`}
              >
                <span>Explore Project</span>
                <ArrowUpRight size={16} />
              </button>

              {project.status === 'ongoing' && (
                <button
                  type="button"
                  onClick={() => onSelect(project, 'inquiry')}
                  className="project-btn-secondary"
                  aria-label={`Inquire about ${project.title}`}
                >
                  <MessageSquare size={14} />
                  <span>Inquire Now</span>
                </button>
              )}
            </div>
          </div>

          {/* Media Column */}
          <div
            className="project-media-col"
            onClick={() => onSelect(project, 'details')}
            role="button"
            tabIndex={0}
            aria-label={`View details for ${project.title}`}
            onKeyDown={e => e.key === 'Enter' && onSelect(project, 'details')}
          >
            {project.coverImage ? (
              <motion.div style={{ y: imageY, width: '100%', height: '115%', position: 'relative' }}>
                <Image
                  src={project.coverImage}
                  alt={project.title}
                  fill
                  className="project-media-image"
                  sizes="(max-width: 960px) 100vw, 50vw"
                />
              </motion.div>
            ) : (
              <div
                className="project-media-art"
                style={{
                  background: BG_COLORS[index % BG_COLORS.length],
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', zIndex: 1 }}>
                  <span
                    className="tag"
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'var(--white)',
                    }}
                  >
                    {project.category}
                  </span>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid rgba(255,255,255,0.1)',
                    }}
                  >
                    <Sparkles size={16} style={{ color: 'var(--purple-400)' }} />
                  </div>
                </div>

                {/* Decorative Initial Watermark */}
                <div
                  style={{
                    position: 'absolute',
                    right: '1.5rem',
                    bottom: '-1rem',
                    pointerEvents: 'none',
                    userSelect: 'none',
                    opacity: 0.08,
                    fontFamily: 'var(--font-display)',
                    fontSize: '9rem',
                    fontWeight: 900,
                    color: 'var(--white)',
                    lineHeight: 1,
                  }}
                >
                  {project.title.charAt(0)}
                </div>

                <div style={{ zIndex: 1 }}>
                  <p
                    style={{
                      fontSize: '0.75rem',
                      color: 'rgba(255,255,255,0.6)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      marginBottom: '0.25rem',
                    }}
                  >
                    Featured Initiative
                  </p>
                  <p
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.25rem',
                      fontWeight: 700,
                      color: 'var(--white)',
                      margin: 0,
                    }}
                  >
                    {project.title}
                  </p>
                </div>
              </div>
            )}

            <div className="project-media-badge">
              <ExternalLink size={13} />
              <span>Explore Case Study</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function ProjectsSection({ data }: { data?: ProjectData[]; categories?: string[] }) {
  const [projects, setProjects] = useState<ProjectData[]>(data && data.length > 0 ? data : FALLBACK_PROJECTS);
  const [statusTab, setStatusTab] = useState<'all' | 'ongoing' | 'completed'>('all');
  const [activeFilter, setActiveFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'gallery' | 'stack'>('gallery');
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [selected, setSelected] = useState<ProjectData | null>(null);
  const [modalTab, setModalTab] = useState<'details' | 'inquiry'>('details');

  // Keep synced if data prop updates
  useEffect(() => {
    if (data && data.length > 0) {
      setProjects(data);
    }
  }, [data]);

  const ongoingCount = useMemo(() => projects.filter(p => p.status === 'ongoing').length, [projects]);
  const completedCount = useMemo(() => projects.filter(p => p.status === 'completed').length, [projects]);

  const categories = useMemo(() => {
    return ['All', ...Array.from(new Set(projects.map(p => p.category)))];
  }, [projects]);

  const filtered = useMemo(() => {
    let result = projects;
    if (statusTab !== 'all') {
      result = result.filter(p => p.status === statusTab);
    }
    if (activeFilter !== 'All') {
      result = result.filter(p => p.category === activeFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        p =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.tags && p.tags.some(t => t.toLowerCase().includes(q))) ||
          (p.client && p.client.toLowerCase().includes(q))
      );
    }
    return result;
  }, [projects, statusTab, activeFilter, search]);

  useEffect(() => {
    setActiveProjectIndex(0);
  }, [statusTab, activeFilter, search]);

  const galleryItems = useMemo(() => {
    return filtered.map((project, idx) => ({
      image: project.coverImage || `https://picsum.photos/seed/${project._id || idx}/1000/750`,
      text: project.title,
      description: project.description,
      alt: project.title,
    }));
  }, [filtered]);

  const activeProject = filtered.length > 0
    ? filtered[activeProjectIndex % filtered.length] || filtered[0]
    : undefined;

  const handleSelect = (project: ProjectData, tab: 'details' | 'inquiry' = 'details') => {
    setSelected(project);
    setModalTab(tab);
  };

  return (
    <section id="projects" className="section-py" data-cursor-color="#818cf8">
      <div className="section-container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="projects-header"
        >
          <div className="projects-header-top">
            <div>
              <p className="label-sm" style={{ marginBottom: '0.75rem' }}>
                Our Portfolio
              </p>
              <h2 className="heading-xl">Featured Projects</h2>
            </div>

            <div className="search-wrapper">
              <Search size={15} className="search-icon" />
              <input
                type="search"
                placeholder="Search projects by title, tag, client..."
                className="search-input"
                value={search}
                onChange={e => setSearch(e.target.value)}
                aria-label="Search projects"
              />
            </div>
          </div>

          {/* Session Tabs: All / Ongoing / Completed */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem' }}>
            <div className="project-tabs-container" role="tablist" aria-label="Project status filter">
              <button
                type="button"
                role="tab"
                aria-selected={statusTab === 'all'}
                className={`project-tab-btn ${statusTab === 'all' ? 'active' : ''}`}
                onClick={() => setStatusTab('all')}
              >
                {statusTab === 'all' && (
                  <motion.div
                    layoutId="activeProjectSessionTab"
                    className="project-tab-indicator"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.55 }}
                  />
                )}
                <span>All Projects</span>
                <span className="project-tab-count">{projects.length}</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={statusTab === 'ongoing'}
                className={`project-tab-btn ${statusTab === 'ongoing' ? 'active' : ''}`}
                onClick={() => setStatusTab('ongoing')}
              >
                {statusTab === 'ongoing' && (
                  <motion.div
                    layoutId="activeProjectSessionTab"
                    className="project-tab-indicator"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.55 }}
                  />
                )}
                <span className="live-pulse-dot" />
                <span>Ongoing</span>
                <span className="project-tab-count">{ongoingCount}</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={statusTab === 'completed'}
                className={`project-tab-btn ${statusTab === 'completed' ? 'active' : ''}`}
                onClick={() => setStatusTab('completed')}
              >
                {statusTab === 'completed' && (
                  <motion.div
                    layoutId="activeProjectSessionTab"
                    className="project-tab-indicator"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.55 }}
                  />
                )}
                <CheckCircle2 size={14} style={{ color: statusTab === 'completed' ? '#fff' : 'var(--purple-400)' }} />
                <span>Completed</span>
                <span className="project-tab-count">{completedCount}</span>
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              {/* View Switcher: 3D Gallery vs Scroll Stack */}
              <div
                className="project-tabs-container"
                style={{ marginBottom: 0, padding: '0.25rem' }}
                role="group"
                aria-label="Project showcase view mode"
              >
                <button
                  type="button"
                  onClick={() => setViewMode('gallery')}
                  className={`project-tab-btn ${viewMode === 'gallery' ? 'active' : ''}`}
                  style={{ padding: '0.45rem 1rem', fontSize: '0.8rem', gap: '0.4rem' }}
                >
                  {viewMode === 'gallery' && (
                    <motion.div
                      layoutId="activeProjectViewMode"
                      className="project-tab-indicator"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                  <Orbit size={14} />
                  <span>3D Gallery</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('stack')}
                  className={`project-tab-btn ${viewMode === 'stack' ? 'active' : ''}`}
                  style={{ padding: '0.45rem 1rem', fontSize: '0.8rem', gap: '0.4rem' }}
                >
                  {viewMode === 'stack' && (
                    <motion.div
                      layoutId="activeProjectViewMode"
                      className="project-tab-indicator"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                  <Layers size={14} />
                  <span>Scroll Stack</span>
                </button>
              </div>

              <div className="projects-count-indicator">
                <span className="projects-pulse-dot" />
                <span>
                  Showing {filtered.length} of {projects.length} Projects
                </span>
              </div>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="projects-meta-bar">
            <div className="projects-filters" role="group" aria-label="Project category filters">
              {categories.map(cat => {
                const count =
                  cat === 'All'
                    ? (statusTab === 'all' ? projects.length : projects.filter(p => p.status === statusTab).length)
                    : projects.filter(p => (statusTab === 'all' || p.status === statusTab) && p.category === cat).length;
                return (
                  <button
                    key={cat}
                    className={`filter-btn ${activeFilter === cat ? 'active' : ''}`}
                    onClick={() => setActiveFilter(cat)}
                    aria-pressed={activeFilter === cat}
                  >
                    {cat} <span style={{ opacity: 0.7, fontSize: '0.75rem', marginLeft: '0.35rem' }}>({count})</span>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Projects Display: CircularGallery (default) or Scroll Trigger Stack */}
        {filtered.length > 0 && viewMode === 'gallery' && (
          <div style={{ width: '100%' }}>
            <div style={{ height: '600px', position: 'relative', width: '100%' }}>
              <CircularGallery
                items={galleryItems}
                bend={3}
                textColor="#ffffff"
                borderRadius={0.05}
                scrollEase={0.05}
                itemSize={0.78}
                itemAspect={1.25}
                fadeEdges={0.14}
                openOnClick={false}
                onItemClick={(_item, index) => {
                  const p = filtered[index];
                  if (p) handleSelect(p, 'details');
                }}
                onActiveChange={(index) => {
                  setActiveProjectIndex(index);
                }}
              />
            </div>

            {/* Active Centered Project Bar */}
            {activeProject && (
              <motion.div
                key={activeProject._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1.25rem',
                  margin: '1.25rem auto 0',
                  padding: '1.25rem 1.75rem',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(139, 92, 246, 0.25)',
                  borderRadius: 18,
                  backdropFilter: 'blur(16px)',
                  maxWidth: 920,
                }}
              >
                <div style={{ flex: '1 1 320px', minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                    <span className={`status-badge status-${activeProject.status}`}>
                      {activeProject.status === 'ongoing' ? (
                        <>
                          <span className="live-pulse-dot" style={{ width: 6, height: 6 }} /> Ongoing
                        </>
                      ) : (
                        <>
                          <CheckCircle2 size={12} /> Completed
                        </>
                      )}
                    </span>
                    <span className="tag">{activeProject.category}</span>
                    {activeProject.client && (
                      <span style={{ fontSize: '0.78rem', color: 'var(--gray-400)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Building2 size={12} style={{ color: 'var(--purple-400)' }} />
                        {activeProject.client}
                      </span>
                    )}
                  </div>
                  <h3 style={{ margin: '0 0 0.35rem', fontSize: '1.2rem', fontWeight: 700, color: 'var(--white)', fontFamily: 'var(--font-display)' }}>
                    {activeProject.title}
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--gray-400)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {activeProject.description}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => handleSelect(activeProject, 'details')}
                    className="project-btn-primary"
                  >
                    <span>Explore Project</span>
                    <ArrowUpRight size={16} />
                  </button>

                  {activeProject.status === 'ongoing' && (
                    <button
                      type="button"
                      onClick={() => handleSelect(activeProject, 'inquiry')}
                      className="project-btn-secondary"
                    >
                      <MessageSquare size={14} />
                      <span>Inquire Now</span>
                    </button>
                  )}
                </div>
              </motion.div>
            )}

            <p style={{ fontSize: '0.78rem', color: 'var(--gray-500)', marginTop: '1rem', textAlign: 'center', fontFamily: 'var(--font-grotesk)' }}>
              Drag or scroll horizontally to explore projects • Click any card to inspect full details
            </p>
          </div>
        )}

        {filtered.length > 0 && viewMode === 'stack' && (
          <div className="projects-stack">
            {filtered.map((project, i) => (
              <ProjectStackCard
                key={project._id || i}
                project={project}
                index={i}
                total={filtered.length}
                onSelect={handleSelect}
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ textAlign: 'center', padding: '6rem 2rem', color: 'var(--gray-500)' }}
          >
            <div
              style={{
                display: 'inline-flex',
                padding: '1rem',
                borderRadius: '50%',
                background: 'rgba(139, 92, 246, 0.1)',
                marginBottom: '1rem',
              }}
            >
              <Search size={28} style={{ color: 'var(--purple-400)' }} />
            </div>
            <h3 className="heading-md" style={{ color: 'var(--white)', marginBottom: '0.5rem' }}>
              No projects found
            </h3>
            <p className="body-md" style={{ marginBottom: '1.5rem' }}>
              No projects match &ldquo;{search || activeFilter}&rdquo;. Try another search term or reset filters.
            </p>
            <button
              onClick={() => {
                setSearch('');
                setActiveFilter('All');
                setStatusTab('all');
              }}
              className="project-btn-secondary"
              style={{ margin: '0 auto' }}
            >
              Reset Filters
            </button>
          </motion.div>
        )}
      </div>

      {/* Project Modal */}
      {selected && (
        <ProjectModal
          project={selected}
          initialTab={modalTab}
          onClose={() => setSelected(null)}
        />
      )}
    </section>
  );
}
