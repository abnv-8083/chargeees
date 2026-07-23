'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { submitInquiry } from '@/lib/api';
import { Send, CheckCircle } from 'lucide-react';

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
      <div className="floating-orb" style={{ width: 500, height: 500, background: '#fff', top: '50%', right: '-10%', transform: 'translateY(-50%)' }} />

      <div className="section-container">
        <div className="inquiry-form-wrapper">
          {/* Left — Info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="label-sm" style={{ marginBottom: '1rem' }}>Let's Talk</p>
            <h2 className="heading-xl" style={{ marginBottom: '1.5rem' }}>Send an Inquiry</h2>
            <p className="body-lg" style={{ marginBottom: '3rem' }}>Have a project in mind, or want to explore how ChargEase can help your business? Fill in the form and our team will get back to you promptly.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {[
                { label: 'Response Time', value: 'Within 24 hours' },
                { label: 'Consultation', value: 'First session is complimentary' },
                { label: 'Confidentiality', value: 'All inquiries are kept strictly confidential' },
              ].map((item, i) => (
                <div key={i} style={{ paddingBottom: '1.5rem', borderBottom: '1px solid var(--gray-800)' }}>
                  <p className="label-sm" style={{ marginBottom: '0.25rem' }}>{item.label}</p>
                  <p style={{ fontSize: '0.9375rem', color: 'var(--white)', fontFamily: 'var(--font-grotesk)' }}>{item.value}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
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
                  <h3 className="heading-md" style={{ color: 'var(--white)', marginBottom: '0.75rem' }}>Inquiry Sent!</h3>
                  <p className="body-md" style={{ marginBottom: '2rem', maxWidth: 360, textAlign: 'center' }}>
                    Thank you for reaching out. We've received your inquiry and will get back to you within 24 hours. A confirmation has been sent to your email.
                  </p>
                  <button className="btn-outline" onClick={() => setSuccess(false)}>Send Another</button>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={onSubmit} noValidate>
                  <div className="form-grid">
                    {/* Name */}
                    <div className="form-group">
                      <input id="inquiry-name" name="name" type="text" className="form-input" placeholder="Name" value={form.name} onChange={onChange} required aria-required="true" autoComplete="name" />
                      <label htmlFor="inquiry-name" className="form-label">Full Name *</label>
                      <div className="form-line" />
                    </div>
                    {/* Company */}
                    <div className="form-group">
                      <input id="inquiry-company" name="companyName" type="text" className="form-input" placeholder="Company" value={form.companyName} onChange={onChange} autoComplete="organization" />
                      <label htmlFor="inquiry-company" className="form-label">Company Name</label>
                      <div className="form-line" />
                    </div>
                    {/* Email */}
                    <div className="form-group">
                      <input id="inquiry-email" name="email" type="email" className="form-input" placeholder="Email" value={form.email} onChange={onChange} required aria-required="true" autoComplete="email" />
                      <label htmlFor="inquiry-email" className="form-label">Email Address *</label>
                      <div className="form-line" />
                    </div>
                    {/* Phone */}
                    <div className="form-group">
                      <input id="inquiry-phone" name="phone" type="tel" className="form-input" placeholder="Phone" value={form.phone} onChange={onChange} autoComplete="tel" />
                      <label htmlFor="inquiry-phone" className="form-label">Phone Number</label>
                      <div className="form-line" />
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="form-group">
                    <input id="inquiry-subject" name="subject" type="text" className="form-input" placeholder="Subject" value={form.subject} onChange={onChange} required aria-required="true" />
                    <label htmlFor="inquiry-subject" className="form-label">Subject *</label>
                    <div className="form-line" />
                  </div>

                  {/* Inquiry Type */}
                  <div className="form-group">
                    <select id="inquiry-type" name="inquiryType" className="form-input" value={form.inquiryType} onChange={onChange} aria-label="Inquiry Type">
                      {INQUIRY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <label htmlFor="inquiry-type" className="form-label" style={{ top: '-0.5rem', fontSize: '0.72rem', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--gray-400)' }}>Inquiry Type</label>
                    <div className="form-line" />
                  </div>

                  {/* Message */}
                  <div className="form-group">
                    <textarea id="inquiry-message" name="message" className="form-input" placeholder="Message" value={form.message} onChange={onChange} required aria-required="true" rows={5} />
                    <label htmlFor="inquiry-message" className="form-label">Message *</label>
                    <div className="form-line" />
                  </div>

                  {/* Error */}
                  {error && (
                    <p style={{ color: '#ff6b6b', fontSize: '0.875rem', marginBottom: '1rem', fontFamily: 'var(--font-grotesk)' }}>{error}</p>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={loading}
                    style={{ width: '100%', justifyContent: 'center', padding: '1rem', fontSize: '0.9rem', opacity: loading ? 0.7 : 1 }}
                    id="inquiry-submit"
                  >
                    {loading ? 'Sending...' : (
                      <><Send size={16} /> Send Inquiry</>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
