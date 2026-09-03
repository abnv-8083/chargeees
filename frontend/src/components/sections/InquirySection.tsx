'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { submitInquiry } from '@/lib/api';
import { Send, CheckCircle } from 'lucide-react';
import Parallax from '@/components/ui/Parallax';
import RevealText from '@/components/ui/RevealText';

const INQUIRY_TYPES = ['General', 'Partnership', 'Project', 'Career', 'Media', 'Support', 'Other'];

const INITIAL_STATE = {
  name: '', companyName: '', email: '', phone: '',
  subject: '', inquiryType: 'General', message: '',
};

export default function InquirySection() {
  const [form, setForm] = useState(INITIAL_STATE);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) {
      setError('Please fill in all required fields.'); return;
    }
    setLoading(true); setError('');
    try {
      await submitInquiry(form);
      setSuccess(true);
      setForm(INITIAL_STATE);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <section id="inquiry" className="section-py" style={{ background: 'var(--black)', position: 'relative' }}>
      <Parallax speed={0.12}><div className="floating-orb" style={{ width: 500, height: 500, background: '#fff', top: '50%', right: '-10%', transform: 'translateY(-50%)' }} /></Parallax>

      <div className="section-container" style={{ maxWidth: 680, margin: '0 auto' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{ textAlign: 'center', marginBottom: 'clamp(2rem, 4vw, 3rem)' }}
        >
          <p className="label-sm" style={{ marginBottom: '0.75rem' }}>Let's Talk</p>
          <RevealText as="h2" className="heading-xl" style={{ marginBottom: '0.75rem' }} delay={0.1}>Send an Inquiry</RevealText>
          <p className="body-lg" style={{ maxWidth: 480, margin: '0 auto' }}>
            Have a project in mind? Fill in the form and we'll get back to you within 24 hours.
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success"
                className="success-animation"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="success-check">
                  <CheckCircle size={36} color="white" />
                </div>
                <h3 className="heading-md" style={{ color: 'var(--white)', marginBottom: '0.5rem' }}>Inquiry Sent!</h3>
                <p className="body-md" style={{ marginBottom: '1.5rem', maxWidth: 360, textAlign: 'center' }}>
                  Thank you for reaching out. We'll get back to you within 24 hours.
                </p>
                <button className="btn-outline" onClick={() => setSuccess(false)}>Send Another</button>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={onSubmit} noValidate>
                <div className="form-grid">
                  <div className="form-group">
                    <input id="inq-name" name="name" type="text" className="form-input" placeholder="Name" value={form.name} onChange={onChange} required aria-required="true" autoComplete="name" />
                    <label htmlFor="inq-name" className="form-label">Full Name *</label>
                    <div className="form-line" />
                  </div>
                  <div className="form-group">
                    <input id="inq-email" name="email" type="email" className="form-input" placeholder="Email" value={form.email} onChange={onChange} required aria-required="true" autoComplete="email" />
                    <label htmlFor="inq-email" className="form-label">Email Address *</label>
                    <div className="form-line" />
                  </div>
                </div>

                <div className="form-group">
                  <input id="inq-subject" name="subject" type="text" className="form-input" placeholder="Subject" value={form.subject} onChange={onChange} required aria-required="true" />
                  <label htmlFor="inq-subject" className="form-label">Subject *</label>
                  <div className="form-line" />
                </div>

                <div className="form-group">
                  <select id="inq-type" name="inquiryType" className="form-input" value={form.inquiryType} onChange={onChange} aria-label="Inquiry Type">
                    {INQUIRY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <label htmlFor="inq-type" className="form-label" style={{ top: '-0.5rem', fontSize: '0.72rem', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--gray-400)' }}>Inquiry Type</label>
                  <div className="form-line" />
                </div>

                <div className="form-group">
                  <textarea id="inq-message" name="message" className="form-input" placeholder="Message" value={form.message} onChange={onChange} required aria-required="true" rows={4} />
                  <label htmlFor="inq-message" className="form-label">Message *</label>
                  <div className="form-line" />
                </div>

                {error && (
                  <p style={{ color: '#ff6b6b', fontSize: '0.85rem', marginBottom: '1rem', fontFamily: 'var(--font-grotesk)' }}>{error}</p>
                )}

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                  style={{ width: '100%', justifyContent: 'center', padding: '0.9rem', fontSize: '0.875rem', opacity: loading ? 0.7 : 1 }}
                >
                  {loading ? 'Sending...' : (
                    <><Send size={15} /> Send Inquiry</>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
