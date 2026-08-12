'use client';
import React, { useEffect, useState } from 'react';
import { fetchAllInquiriesAdmin, updateInquiryAdmin, replyInquiryAdmin, deleteInquiryAdmin } from '@/lib/api';
import { Inbox, Mail, Trash2, CheckCircle2, AlertCircle, X, Search, Filter, Send, Download, Phone, Building, Eye, FolderOpen } from 'lucide-react';

interface Inquiry {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  companyName?: string;
  subject?: string;
  inquiryType: string;
  message: string;
  status: 'unread' | 'read' | 'replied' | 'archived';
  replyMessage?: string;
  repliedAt?: string;
  createdAt?: string;
}

/** If the subject is "Project Inquiry: XYZ", extract "XYZ" */
function extractProjectName(subject?: string): string | null {
  if (!subject) return null;
  const match = subject.match(/^Project Inquiry:\s*(.+)$/i);
  return match ? match[1].trim() : null;
}

export default function InquiriesManagerPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterType, setFilterType] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [replyText, setReplyText] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadInquiries = async () => {
    setLoading(true);
    try {
      const res = await fetchAllInquiriesAdmin();
      setInquiries(Array.isArray(res) ? res : res?.data || []);
    } catch (e) {
      setInquiries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInquiries();
  }, []);

  const handleOpenDetails = async (inq: Inquiry) => {
    setSelectedInquiry(inq);
    setReplyText(inq.replyMessage || '');
    if (inq.status === 'unread') {
      try {
        await updateInquiryAdmin(inq._id, { status: 'read' });
        loadInquiries();
      } catch (e) {
        // ignore
      }
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInquiry || !replyText.trim()) return;
    setSaving(true);
    setMessage(null);
    try {
      await replyInquiryAdmin(selectedInquiry._id, replyText);
      setMessage({ type: 'success', text: `Reply sent successfully to ${selectedInquiry.email}!` });
      setSelectedInquiry(null);
      setReplyText('');
      loadInquiries();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to send reply.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete inquiry from ${name}?`)) return;
    try {
      await deleteInquiryAdmin(id);
      setMessage({ type: 'success', text: 'Inquiry deleted successfully.' });
      if (selectedInquiry?._id === id) setSelectedInquiry(null);
      loadInquiries();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to delete inquiry.' });
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateInquiryAdmin(id, { status: newStatus });
      if (selectedInquiry?._id === id) setSelectedInquiry({ ...selectedInquiry, status: newStatus as any });
      loadInquiries();
    } catch (e) {
      // ignore
    }
  };

  const handleExportCSV = () => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const token = localStorage.getItem('token');
    window.open(`${API_URL}/inquiries/export?token=${token}`, '_blank');
  };

  const filteredInquiries = inquiries.filter(inq => {
    const matchStatus = filterStatus === 'ALL' || inq.status === filterStatus;
    const matchType = filterType === 'ALL' || inq.inquiryType === filterType;
    const companyVal = inq.companyName || inq.company || '';
    const matchSearch = !searchQuery ||
      inq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (companyVal && companyVal.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (inq.subject && inq.subject.toLowerCase().includes(searchQuery.toLowerCase())) ||
      inq.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchType && matchSearch;
  });

  const STATUS_TABS = ['ALL', 'unread', 'read', 'replied'];
  const TYPE_TABS = ['ALL', 'Project', 'General', 'Partnership', 'Career', 'Media', 'Support', 'Other'];

  const projectCount = inquiries.filter(i => i.inquiryType === 'Project').length;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, color: '#fff', marginBottom: '0.4rem' }}>
            Client Inquiries & Communication Inbox
          </h1>
          <p style={{ color: '#888', fontSize: '0.875rem' }}>
            Manage contact form submissions, consultation requests, status tracking, and direct email dispatching.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {projectCount > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.35)', borderRadius: 8, padding: '0.5rem 0.85rem', fontSize: '0.8rem', color: '#a78bfa', fontWeight: 600 }}>
              <FolderOpen size={14} />
              {projectCount} Project {projectCount === 1 ? 'Inquiry' : 'Inquiries'}
            </div>
          )}
          <button
            onClick={handleExportCSV}
            style={{ background: '#1c1c1c', border: '1px solid #333', color: '#fff', padding: '0.75rem 1.25rem', borderRadius: 8, fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      {message && (
        <div style={{
          background: message.type === 'success' ? 'rgba(74, 222, 128, 0.1)' : 'rgba(255, 107, 107, 0.1)',
          border: `1px solid ${message.type === 'success' ? 'rgba(74, 222, 128, 0.3)' : 'rgba(255, 107, 107, 0.3)'}`,
          color: message.type === 'success' ? '#4ade80' : '#ff6b6b',
          padding: '1rem 1.25rem',
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          marginBottom: '1.5rem',
          fontSize: '0.875rem',
        }}>
          {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div style={{ background: '#121212', border: '1px solid #222', borderRadius: 12, padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {/* Row 1: Status + Search */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <Filter size={16} color="#888" />
            <span style={{ fontSize: '0.8rem', color: '#888', marginRight: '0.4rem' }}>Status:</span>
            {STATUS_TABS.map(st => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                style={{
                  background: filterStatus === st ? '#fff' : '#1c1c1c',
                  color: filterStatus === st ? '#000' : '#aaa',
                  border: 'none',
                  padding: '0.4rem 0.85rem',
                  borderRadius: 6,
                  fontSize: '0.75rem',
                  fontWeight: filterStatus === st ? 600 : 400,
                  textTransform: 'capitalize',
                  cursor: 'pointer',
                }}
              >
                {st === 'ALL' ? 'All Messages' : st}
              </button>
            ))}
          </div>
          <div style={{ position: 'relative', width: '280px' }}>
            <Search size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
            <input
              type="text"
              placeholder="Search by name, email, project..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ width: '100%', background: '#181818', border: '1px solid #2c2c2c', borderRadius: 8, padding: '0.45rem 1rem 0.45rem 2.2rem', color: '#fff', fontSize: '0.8rem' }}
            />
          </div>
        </div>
        {/* Row 2: Type filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8rem', color: '#888', marginRight: '0.4rem' }}>Type:</span>
          {TYPE_TABS.map(tp => (
            <button
              key={tp}
              onClick={() => setFilterType(tp)}
              style={{
                background: filterType === tp
                  ? (tp === 'Project' ? 'rgba(139,92,246,0.8)' : '#fff')
                  : (tp === 'Project' ? 'rgba(139,92,246,0.12)' : '#1c1c1c'),
                color: filterType === tp
                  ? (tp === 'Project' ? '#fff' : '#000')
                  : (tp === 'Project' ? '#a78bfa' : '#aaa'),
                border: tp === 'Project' ? '1px solid rgba(139,92,246,0.4)' : 'none',
                padding: '0.3rem 0.75rem',
                borderRadius: 6,
                fontSize: '0.75rem',
                fontWeight: filterType === tp ? 600 : 400,
                cursor: 'pointer',
              }}
            >
              {tp === 'ALL' ? 'All Types' : tp}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#888' }}>Loading communication inbox...</div>
      ) : filteredInquiries.length === 0 ? (
        <div style={{ background: '#121212', border: '1px solid #222', borderRadius: 16, padding: '4rem 2rem', textAlign: 'center' }}>
          <Inbox size={44} style={{ margin: '0 auto 1rem', color: '#555' }} />
          <h3 style={{ color: '#fff', marginBottom: '0.5rem' }}>No inquiries matching criteria</h3>
          <p style={{ color: '#888', fontSize: '0.875rem' }}>All incoming client messages and consultation requests will appear here.</p>
        </div>
      ) : (
        <div style={{ background: '#121212', border: '1px solid #222', borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#181818', borderBottom: '1px solid #222' }}>
                  <th style={{ padding: '1rem', fontSize: '0.75rem', color: '#888', fontWeight: 600, textTransform: 'uppercase' }}>Sender Details</th>
                  <th style={{ padding: '1rem', fontSize: '0.75rem', color: '#888', fontWeight: 600, textTransform: 'uppercase' }}>Subject / Message Preview</th>
                  <th style={{ padding: '1rem', fontSize: '0.75rem', color: '#888', fontWeight: 600, textTransform: 'uppercase' }}>Date / Time</th>
                  <th style={{ padding: '1rem', fontSize: '0.75rem', color: '#888', fontWeight: 600, textTransform: 'uppercase' }}>Status</th>
                  <th style={{ padding: '1rem', fontSize: '0.75rem', color: '#888', fontWeight: 600, textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInquiries.map((inq, i) => {
                  const isProject = inq.inquiryType === 'Project';
                  const projectName = extractProjectName(inq.subject);
                  const companyVal = inq.companyName || inq.company;
                  return (
                    <tr
                      key={inq._id || i}
                      onClick={() => handleOpenDetails(inq)}
                      style={{
                        borderBottom: '1px solid #1f1f1f',
                        background: isProject
                          ? 'rgba(139,92,246,0.04)'
                          : inq.status === 'unread' ? 'rgba(255, 107, 107, 0.04)' : 'transparent',
                        cursor: 'pointer',
                        transition: 'background 0.15s ease',
                        borderLeft: isProject ? '3px solid rgba(139,92,246,0.5)' : '3px solid transparent',
                      }}
                    >
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: inq.status === 'unread' ? 700 : 500, fontSize: '0.9rem', color: '#fff' }}>
                            {inq.name}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: '#888' }}>{inq.email}</span>
                          {companyVal && <span style={{ fontSize: '0.7rem', color: '#666' }}>🏢 {companyVal}</span>}
                        </div>
                      </td>
                      <td style={{ padding: '1rem', maxWidth: '360px' }}>
                        <div>
                          {/* Inquiry type badge */}
                          <span style={{
                            fontSize: '0.7rem',
                            background: isProject ? 'rgba(139,92,246,0.2)' : '#222',
                            color: isProject ? '#a78bfa' : '#ccc',
                            padding: '0.15rem 0.45rem',
                            borderRadius: 4,
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            marginRight: '0.4rem',
                            border: isProject ? '1px solid rgba(139,92,246,0.3)' : 'none',
                          }}>
                            {isProject ? '📁 Project' : (inq.inquiryType || 'General')}
                          </span>

                          {/* Project name pill — shown when subject has "Project Inquiry: X" */}
                          {isProject && projectName && (
                            <span style={{
                              fontSize: '0.7rem',
                              background: 'rgba(139,92,246,0.1)',
                              color: '#c4b5fd',
                              padding: '0.15rem 0.5rem',
                              borderRadius: 4,
                              fontWeight: 500,
                              border: '1px solid rgba(139,92,246,0.2)',
                            }}>
                              {projectName}
                            </span>
                          )}

                          <p style={{ fontSize: '0.8rem', color: inq.status === 'unread' ? '#ddd' : '#aaa', margin: '0.4rem 0 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {inq.message}
                          </p>
                        </div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ fontSize: '0.75rem', color: '#888' }}>
                          {inq.createdAt ? new Date(inq.createdAt).toLocaleDateString() : 'Recent'}
                        </span>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{
                          fontSize: '0.7rem',
                          padding: '0.2rem 0.55rem',
                          borderRadius: 6,
                          background: inq.status === 'unread' ? 'rgba(255,107,107,0.2)' : inq.status === 'replied' ? 'rgba(74,222,128,0.2)' : '#222',
                          color: inq.status === 'unread' ? '#ff6b6b' : inq.status === 'replied' ? '#4ade80' : '#aaa',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                        }}>
                          {inq.status}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right' }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                          <button
                            onClick={() => handleOpenDetails(inq)}
                            style={{ background: '#242424', color: '#fff', border: '1px solid #333', padding: '0.4rem 0.7rem', borderRadius: 6, fontSize: '0.75rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                          >
                            <Eye size={13} /> View / Reply
                          </button>
                          <button
                            onClick={() => handleDelete(inq._id, inq.name)}
                            style={{ background: 'transparent', color: '#ff6b6b', border: '1px solid rgba(255,107,107,0.3)', padding: '0.4rem 0.55rem', borderRadius: 6, fontSize: '0.75rem', cursor: 'pointer' }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Inquiry Details & Reply Modal */}
      {selectedInquiry && (() => {
        const isProject = selectedInquiry.inquiryType === 'Project';
        const projectName = extractProjectName(selectedInquiry.subject);
        const companyVal = selectedInquiry.companyName || selectedInquiry.company;
        return (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <div style={{ background: '#121212', border: `1px solid ${isProject ? 'rgba(139,92,246,0.4)' : '#282828'}`, borderRadius: 16, width: '100%', maxWidth: '680px', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>

              {/* Modal Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', borderBottom: '1px solid #1f1f1f', paddingBottom: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
                    <span style={{
                      fontSize: '0.7rem',
                      background: isProject ? 'rgba(139,92,246,0.2)' : '#242424',
                      color: isProject ? '#a78bfa' : '#aaa',
                      padding: '0.2rem 0.5rem',
                      borderRadius: 4,
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      border: isProject ? '1px solid rgba(139,92,246,0.35)' : 'none',
                    }}>
                      {isProject ? '📁 Project Inquiry' : (selectedInquiry.inquiryType || 'General Inquiry')}
                    </span>
                    {isProject && projectName && (
                      <span style={{ fontSize: '0.8rem', background: 'rgba(139,92,246,0.12)', color: '#c4b5fd', padding: '0.2rem 0.6rem', borderRadius: 6, border: '1px solid rgba(139,92,246,0.25)', fontWeight: 500 }}>
                        {projectName}
                      </span>
                    )}
                  </div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#fff', marginBottom: 0 }}>
                    {selectedInquiry.name}
                  </h3>
                  {isProject && projectName && (
                    <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.2rem' }}>
                      Inquiring about: <span style={{ color: '#c4b5fd' }}>{projectName}</span>
                    </p>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <select
                    value={selectedInquiry.status}
                    onChange={e => handleStatusChange(selectedInquiry._id, e.target.value)}
                    style={{ background: '#181818', border: '1px solid #333', borderRadius: 6, padding: '0.35rem 0.6rem', color: '#fff', fontSize: '0.75rem', fontWeight: 600 }}
                  >
                    <option value="unread">Status: UNREAD</option>
                    <option value="read">Status: READ</option>
                    <option value="replied">Status: REPLIED</option>
                  </select>
                  <button onClick={() => setSelectedInquiry(null)} style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer' }}>
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Contact Metadata */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', background: '#181818', padding: '1.25rem', borderRadius: 12, marginBottom: '1.5rem', border: '1px solid #222' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#888', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.2rem' }}>
                    <Mail size={13} /> Email Address
                  </span>
                  <a href={`mailto:${selectedInquiry.email}`} style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 600, textDecoration: 'none' }}>
                    {selectedInquiry.email}
                  </a>
                </div>
                {selectedInquiry.phone && (
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#888', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.2rem' }}>
                      <Phone size={13} /> Contact Number
                    </span>
                    <a href={`tel:${selectedInquiry.phone}`} style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 600, textDecoration: 'none' }}>
                      {selectedInquiry.phone}
                    </a>
                  </div>
                )}
                {companyVal && (
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#888', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.2rem' }}>
                      <Building size={13} /> Organization
                    </span>
                    <span style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 600 }}>{companyVal}</span>
                  </div>
                )}
                {isProject && projectName && (
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#888', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.2rem' }}>
                      <FolderOpen size={13} /> Project
                    </span>
                    <span style={{ fontSize: '0.85rem', color: '#c4b5fd', fontWeight: 600 }}>{projectName}</span>
                  </div>
                )}
              </div>

              {/* Message Box */}
              <div style={{ marginBottom: '2rem' }}>
                <label style={{ fontSize: '0.8rem', color: '#aaa', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Full Client Message Details</label>
                <div style={{ background: '#161616', border: `1px solid ${isProject ? 'rgba(139,92,246,0.2)' : '#242424'}`, borderRadius: 10, padding: '1.25rem', color: '#e5e5e5', fontSize: '0.9rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                  {selectedInquiry.message}
                </div>
              </div>

              {/* Reply Section */}
              <form onSubmit={handleSendReply} style={{ borderTop: '1px solid #1f1f1f', paddingTop: '1.5rem' }}>
                <label style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                  <Send size={15} /> Dispatch Direct Response via Email
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder={`Write your professional reply to ${selectedInquiry.name}${isProject && projectName ? ` regarding "${projectName}"` : ''}...`}
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  style={{ width: '100%', background: '#181818', border: '1px solid #2c2c2c', borderRadius: 8, padding: '0.75rem 1rem', color: '#fff', fontSize: '0.85rem', fontFamily: 'inherit', marginBottom: '1rem' }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                  <button type="button" onClick={() => setSelectedInquiry(null)} style={{ background: 'transparent', border: '1px solid #333', color: '#aaa', padding: '0.65rem 1.25rem', borderRadius: 8, cursor: 'pointer' }}>
                    Close
                  </button>
                  <button type="submit" disabled={saving} style={{ background: '#fff', color: '#000', border: 'none', padding: '0.65rem 1.5rem', borderRadius: 8, fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Send size={14} /> {saving ? 'Dispatching Reply...' : 'Send Reply'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
