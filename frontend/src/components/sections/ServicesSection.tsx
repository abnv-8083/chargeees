'use client';
import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import {
  Target,
  Search,
  Users,
  Code2,
  FlaskConical,
  TrendingUp,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';
import Parallax from '@/components/ui/Parallax';
import type { ServiceData } from '@/lib/types';

const WORKFLOW_STEPS = [
  {
    id: '01',
    title: 'Problem Identification',
    description:
      'We begin by deeply understanding your challenge — mapping pain points, defining objectives, and aligning stakeholders on a shared problem statement before any solution is designed.',
    icon: Target,
    color: '#3b82f6',      // blue
    gradFrom: 'rgba(59,130,246,0.18)',
    gradTo: 'rgba(59,130,246,0.04)',
    borderColor: 'rgba(59,130,246,0.35)',
    glowColor: 'rgba(59,130,246,0.25)',
    highlight: 'var(--blue-400)',
  },
  {
    id: '02',
    title: 'Research and Feasibility Analysis',
    description:
      'Our analysts conduct comprehensive market research, competitive benchmarking, and technical feasibility studies to validate the approach and surface any risk factors early.',
    icon: Search,
    color: '#8b5cf6',      // purple
    gradFrom: 'rgba(139,92,246,0.18)',
    gradTo: 'rgba(139,92,246,0.04)',
    borderColor: 'rgba(139,92,246,0.35)',
    glowColor: 'rgba(139,92,246,0.25)',
    highlight: 'var(--purple-400)',
  },
  {
    id: '03',
    title: 'Initial Team Formation and Department Coordination',
    description:
      'We assemble a cross-functional team — strategists, engineers, designers, and domain experts — and establish clear communication channels across all departments to ensure cohesion.',
    icon: Users,
    color: '#f59e0b',      // amber
    gradFrom: 'rgba(245,158,11,0.18)',
    gradTo: 'rgba(245,158,11,0.04)',
    borderColor: 'rgba(245,158,11,0.35)',
    glowColor: 'rgba(245,158,11,0.25)',
    highlight: '#f59e0b',
  },
  {
    id: '04',
    title: 'Project Development and Implementation',
    description:
      'Using agile sprints and iterative delivery, we build, integrate, and deploy the solution — maintaining transparency through regular reviews, demos, and stakeholder check-ins.',
    icon: Code2,
    color: '#3b82f6',      // blue
    gradFrom: 'rgba(59,130,246,0.18)',
    gradTo: 'rgba(59,130,246,0.04)',
    borderColor: 'rgba(59,130,246,0.35)',
    glowColor: 'rgba(59,130,246,0.25)',
    highlight: 'var(--blue-400)',
  },
  {
    id: '05',
    title: 'Testing, Trial Run, and Evaluation',
    description:
      'Rigorous QA, user acceptance testing, and real-world trial runs validate performance, security, and usability — with every defect tracked and resolved before sign-off.',
    icon: FlaskConical,
    color: '#10b981',      // emerald
    gradFrom: 'rgba(16,185,129,0.18)',
    gradTo: 'rgba(16,185,129,0.04)',
    borderColor: 'rgba(16,185,129,0.35)',
    glowColor: 'rgba(16,185,129,0.25)',
    highlight: '#10b981',
  },
  {
    id: '06',
    title: 'Revenue Model Development and Project Handover',
    description:
      'We co-create a sustainable revenue model, complete full documentation, train your teams, and conduct a smooth handover — positioning your project for long-term operational success.',
    icon: TrendingUp,
    color: '#ec4899',      // pink
    gradFrom: 'rgba(236,72,153,0.18)',
    gradTo: 'rgba(236,72,153,0.04)',
    borderColor: 'rgba(236,72,153,0.35)',
    glowColor: 'rgba(236,72,153,0.25)',
    highlight: 'var(--pink-400)',
  },
];

function WorkflowStep({
  step,
  index,
  total,
}: {
  step: (typeof WORKFLOW_STEPS)[number];
  index: number;
  total: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const Icon = step.icon;
  const isLast = index === total - 1;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
      className="workflow-step-row"
      style={{ flexDirection: index % 2 === 0 ? 'row' : 'row-reverse' }}
    >
      {/* Step Card */}
      <div
        className="workflow-step-card"
        style={{
          background: `linear-gradient(145deg, ${step.gradFrom} 0%, ${step.gradTo} 100%)`,
          border: `1px solid ${step.borderColor}`,
          boxShadow: `0 20px 50px -15px ${step.glowColor}, 0 0 0 1px rgba(255,255,255,0.03)`,
        }}
        data-cursor-hover
      >
        {/* Glow blob */}
        <div
          className="workflow-card-glow"
          style={{ background: `radial-gradient(circle, ${step.glowColor} 0%, transparent 70%)` }}
        />

        <div className="workflow-step-top">
          <div
            className="workflow-step-icon"
            style={{
              background: `${step.gradFrom}`,
              border: `1px solid ${step.borderColor}`,
              color: step.color,
            }}
          >
            <Icon size={22} />
          </div>

          <span
            className="workflow-step-num"
            style={{ color: step.color, borderColor: step.borderColor, background: `${step.gradFrom}` }}
          >
            {step.id}
          </span>
        </div>

        <h3 className="workflow-step-title" style={{ color: 'var(--white)' }}>
          {step.title}
        </h3>
        <p className="workflow-step-desc">{step.description}</p>

        {/* Bottom accent bar */}
        <div className="workflow-card-accent" style={{ background: step.color }} />
      </div>

      {/* Connector Column */}
      <div className="workflow-connector-col">
        <div className="workflow-node" style={{ background: step.color, boxShadow: `0 0 24px ${step.glowColor}` }}>
          <Icon size={18} color="#fff" />
        </div>
        {!isLast && (
          <div className="workflow-line" style={{ background: `linear-gradient(180deg, ${step.color} 0%, ${WORKFLOW_STEPS[index + 1].color} 100%)` }} />
        )}
        {!isLast && (
          <div
            className="workflow-chevron"
            style={{ color: WORKFLOW_STEPS[index + 1].color }}
          >
            <ChevronRight size={16} />
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function ServicesSection({ data: _data }: { data?: ServiceData[] }) {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const orbY = useTransform(scrollYProgress, [0, 1], [80, -80]);

  return (
    <section
      ref={sectionRef}
      id="services"
      className="section-py workflow-section"
      data-cursor-color="#8b5cf6"
    >
      {/* Background orb */}
      <Parallax speed={0.1}>
        <motion.div
          style={{ y: orbY }}
          className="floating-orb workflow-orb"
        />
      </Parallax>

      <div className="section-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="workflow-header"
        >
          <p className="label-sm" style={{ marginBottom: '1rem' }}>
            How We Work
          </p>
          <h2 className="heading-xl" style={{ marginBottom: '1.25rem' }}>
            Project Development{' '}
            <span className="gradient-text">Workflow</span>
          </h2>
          <p className="body-lg" style={{ maxWidth: 620 }}>
            A structured process from{' '}
            <strong style={{ color: 'var(--white)' }}>Problem to Revenue</strong> — every ChargEase project moves through
            research, planning, development, testing, and revenue generation before long-term operation.
          </p>
        </motion.div>

        {/* Core Principle Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="workflow-principle"
        >
          <div className="workflow-principle-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
          <div>
            <span className="workflow-principle-label">Core Principle</span>
            <p className="workflow-principle-text">
              Every ChargEase project moves through research, planning, development, testing, and revenue generation before long-term operation.
            </p>
          </div>
        </motion.div>

        {/* Workflow Steps */}
        <div className="workflow-steps-container">
          {WORKFLOW_STEPS.map((step, i) => (
            <WorkflowStep key={step.id} step={step} index={i} total={WORKFLOW_STEPS.length} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="workflow-cta"
        >
          <p className="body-md" style={{ marginBottom: '1.5rem' }}>
            Ready to start your project with ChargEase?
          </p>
          <button
            onClick={() => {
              const el = document.getElementById('inquiry');
              if (el) {
                const y = el.getBoundingClientRect().top + window.scrollY - 80;
                window.scrollTo({ top: y, behavior: 'smooth' });
              }
            }}
            className="btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.85rem 2rem' }}
          >
            Start Your Project <ArrowRight size={16} />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
