'use client';
import { motion } from 'framer-motion';
import type { ServiceData } from '@/lib/types';
import { Target, Zap, Code, BarChart2, Lightbulb, Globe, Shield, Users, ArrowRight, Layers, Database, TrendingUp } from 'lucide-react';

const ICON_MAP: Record<string, React.ReactNode> = {
  Target: <Target size={22} />, Zap: <Zap size={22} />, Code: <Code size={22} />,
  BarChart: <BarChart2 size={22} />, Lightbulb: <Lightbulb size={22} />, Globe: <Globe size={22} />,
  Shield: <Shield size={22} />, Users: <Users size={22} />, Layers: <Layers size={22} />,
  Database: <Database size={22} />, TrendingUp: <TrendingUp size={22} />,
};

const FALLBACK_SERVICES: ServiceData[] = [
  { _id: '1', name: 'Strategic Consulting', description: 'Comprehensive business strategy development tailored to your organization\'s unique goals and market position.', icon: 'Target', features: [], learnMoreLink: '#' },
  { _id: '2', name: 'Digital Transformation', description: 'End-to-end digital transformation services that modernize operations, enhance efficiency, and unlock new revenue streams.', icon: 'Zap', features: [], learnMoreLink: '#' },
  { _id: '3', name: 'Technology Solutions', description: 'Custom software and technology solutions designed to solve complex business challenges at enterprise scale.', icon: 'Code', features: [], learnMoreLink: '#' },
  { _id: '4', name: 'Data & Analytics', description: 'Advanced data analytics and business intelligence solutions that turn raw data into actionable strategic insights.', icon: 'BarChart', features: [], learnMoreLink: '#' },
  { _id: '5', name: 'Innovation Labs', description: 'Dedicated innovation and R&D services to help your organization stay ahead of disruption and lead in your industry.', icon: 'Lightbulb', features: [], learnMoreLink: '#' },
  { _id: '6', name: 'Global Partnerships', description: 'Building strategic alliances and partnership frameworks that accelerate global expansion and market penetration.', icon: 'Globe', features: [], learnMoreLink: '#' },
];

export default function ServicesSection({ data }: { data?: ServiceData[] }) {
  const services = data || FALLBACK_SERVICES;

  return (
    <section id="services" className="section-py" style={{ background: 'var(--black)', position: 'relative' }}>
      <div className="floating-orb" style={{ width: 600, height: 600, background: '#fff', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />

      <div className="section-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: 'clamp(3rem, 6vw, 6rem)', maxWidth: 640 }}
        >
          <p className="label-sm" style={{ marginBottom: '1rem' }}>What We Do</p>
          <h2 className="heading-xl" style={{ marginBottom: '1.5rem' }}>Our Services</h2>
          <p className="body-lg">Comprehensive solutions across every dimension of business growth and transformation.</p>
        </motion.div>

        {/* Services Grid */}
        <div className="services-grid">
          {services.map((service, i) => (
            <motion.div
              key={service._id}
              className="service-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              data-cursor-hover
            >
              <div className="service-icon">
                {ICON_MAP[service.icon] || <Zap size={22} />}
              </div>
              <h3 className="heading-md" style={{ color: 'var(--white)', marginBottom: '0.875rem' }}>{service.name}</h3>
              <p className="body-md" style={{ marginBottom: '2rem' }}>{service.description}</p>
              {service.features.length > 0 && (
                <ul style={{ listStyle: 'none', padding: 0, marginBottom: '1.5rem' }}>
                  {service.features.slice(0, 3).map((f, fi) => (
                    <li key={fi} style={{ fontSize: '0.8125rem', color: 'var(--gray-500)', padding: '0.25rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--gray-600)', flexShrink: 0 }} />
                      {f}
                    </li>
                  ))}
                </ul>
              )}
              <a
                href={service.learnMoreLink}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', fontFamily: 'var(--font-grotesk)', fontWeight: 600, color: 'var(--white)', textDecoration: 'none', marginTop: 'auto', transition: 'gap 0.2s ease' }}
                className="service-learn-more"
              >
                Learn More <ArrowRight size={14} />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
