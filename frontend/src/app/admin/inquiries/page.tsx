'use client';
import React, { useEffect, useState } from 'react';
import { fetchAllInquiriesAdmin, updateInquiryAdmin, replyInquiryAdmin, deleteInquiryAdmin } from '@/lib/api';
import { showToast } from '@/lib/toast';
import {
  Inbox, Mail, Trash2, CheckCircle2, AlertCircle, X, Search, Filter,
  Send, Phone, Building, Clock, Eye, Sparkles, User, MessageSquare
} from 'lucide-react';

interface Inquiry {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  inquiryType: string;
  message: string;
  status: 'unread' | 'read' | 'replied' | 'archived';
  replyMessage?: string;
  repliedAt?: string;
  createdAt?: string;
}

export default function InquiriesManagerPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);

  const loadInquiries = async () => {
    setLoading(true);
    try {
      const res = await fetchAllInquiriesAdmin();
      const list = Array.isArray(res) ? res : res?.data || [];
      setInquiries(list);
      if (selectedInquiry) {
        const updated = list.find((i: Inquiry) => i._id === selectedInquiry._id);
        if (updated) setSelectedInquiry(updated);
      }
    } catch (e) {
      setInquiries([]);
      showToast.error('Failed to load client inquiries inbox.');
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
        // quiet fail
      }
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInquiry || !replyText.trim()) {
      showToast.error('Please compose a reply message.');
      return;
    }
    setSending(true);
    try {
      await replyInquiryAdmin(selectedInquiry._id, replyText);
      showToast.success(`Reply transmitted to ${selectedInquiry.email}!`);
      loadInquiries();
    } catch (err: any) {
      showToast.error(err.message || 'Failed to send reply.');
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete inquiry from "${name}"?`)) return;
    try {
      await deleteInquiryAdmin(id);
      showToast.success('Inquiry record purged.');
      if (selectedInquiry?._id === id) setSelectedInquiry(null);
      loadInquiries();
    } catch (err: any) {
      showToast.error(err.message || 'Failed to delete inquiry.');
    }
  };

  const handleUpdateStatus = async (id: string, status: Inquiry['status']) => {
    try {
      await updateInquiryAdmin(id, { status });
      showToast.success(`Inquiry marked as ${status}.`);
      loadInquiries();
    } catch (err: any) {
      showToast.error(err.message || 'Failed to update status.');
    }
  };

  const filteredInquiries = inquiries.filter(inq => {
    const matchStatus = filterStatus === 'ALL' || inq.status === filterStatus;
    const matchSearch =
      !searchQuery ||
      inq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inq.company && inq.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
      inq.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  const unreadCount = inquiries.filter(i => i.status === 'unread').length;

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.25rem', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#fbbf24', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>
            <Inbox size={16} /> Lead Inquiries Portal
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>
            Client Inquiries & Communication
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Review business leads, customer messages, partnership requests, and dispatch email replies.
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div style={{ background: '#09090b', border: '1px solid #1c1c21', borderRadius: 16, padding: '1rem 1.25rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
          {['ALL', 'unread', 'read', 'replied', 'archived'].map(st => {
            const count = st === 'ALL' ? inquiries.length : inquiries.filter(i => i.status === st).length;
            const active = filterStatus === st;
            return (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                style={{
                  background: active ? 'rgba(251, 191, 36, 0.15)' : '#121215',
                  color: active ? '#fbbf24' : '#a1a1aa',
                  border: active ? '1px solid rgba(251, 191, 36, 0.3)' : '1px solid #1c1c21',
                  padding: '0.45rem 0.85rem',
                  borderRadius: 8,
                  fontSize: '0.775rem',
                  fontWeight: active ? 600 : 500,
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <span>{st === 'ALL' ? 'All Messages' : st}</span>
                <span style={{ fontSize: '0.675rem', background: active ? '#fbbf24' : '#22222a', color: active ? '#000' : '#888', padding: '0.1rem 0.4rem', borderRadius: 10, fontWeight: 700 }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div style={{ position: 'relative', minWidth: '240px' }}>
          <Search size={15} color="#71717a" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search inquiries..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              background: '#121215',
              border: '1px solid #1c1c21',
              borderRadius: 8,
              padding: '0.45rem 0.85rem 0.45rem 2.3rem',
              color: '#fff',
              fontSize: '0.8125rem',
              outline: 'none',
            }}
          />
        </div>
      </div>

      {/* Split Inbox Layout */}
      {loading ? (
        <div style={{ padding: '4rem 0', textAlign: 'center', color: '#71717a' }}>
          <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p style={{ fontSize: '0.875rem' }}>Fetching incoming messages...</p>
        </div>
      ) : filteredInquiries.length === 0 ? (
        <div style={{ background: '#09090b', border: '1px dashed #22222a', borderRadius: 16, padding: '4rem 1.5rem', textAlign: 'center', color: '#71717a' }}>
          <Inbox size={40} style={{ margin: '0 auto 0.75rem', opacity: 0.5 }} />
          <p style={{ fontSize: '1rem', fontWeight: 600, color: '#e4e4e7', margin: '0 0 0.25rem' }}>No inquiries found</p>
          <p style={{ fontSize: '0.825rem', margin: 0 }}>There are no messages matching your status filter or search query.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '1.5rem', alignItems: 'start' }} className="inquiry-split">
          {/* Inbox Feed Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {filteredInquiries.map(inq => {
              const isSelected = selectedInquiry?._id === inq._id;
              const isUnread = inq.status === 'unread';
              return (
                <div
                  key={inq._id}
                  onClick={() => handleOpenDetails(inq)}
                  style={{
                    background: isSelected ? 'rgba(251, 191, 36, 0.08)' : '#09090b',
                    border: `1px solid ${isSelected ? 'rgba(251, 191, 36, 0.35)' : isUnread ? 'rgba(248, 113, 113, 0.3)' : '#1c1c21'}`,
                    borderLeft: `4px solid ${isUnread ? '#f87171' : inq.status === 'replied' ? '#34d399' : '#38bdf8'}`,
                    borderRadius: 14,
                    padding: '1rem 1.15rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.925rem', color: '#fff' }}>{inq.name}</span>
                    <span
                      style={{
                        fontSize: '0.65rem',
                        padding: '0.15rem 0.5rem',
                        borderRadius: 6,
                        background: isUnread ? 'rgba(248, 113, 113, 0.15)' : inq.status === 'replied' ? 'rgba(52, 211, 153, 0.15)' : '#121215',
                        color: isUnread ? '#f87171' : inq.status === 'replied' ? '#34d399' : '#a1a1aa',
                        textTransform: 'uppercase',
                        fontWeight: 700,
                      }}
                    >
                      {inq.status}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.775rem', color: '#38bdf8', marginBottom: '0.4rem', fontWeight: 500 }}>
                    {inq.email} {inq.company ? `• ${inq.company}` : ''}
                  </div>

                  <p style={{ fontSize: '0.8125rem', color: '#9ca3af', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.4 }}>
                    <strong style={{ color: '#d4d4d8' }}>[{inq.inquiryType || 'General'}]:</strong> {inq.message}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Detailed View / Reply Panel */}
          {selectedInquiry ? (
            <div style={{ background: '#09090b', border: '1px solid #1c1c21', borderRadius: 18, padding: '1.75rem', position: 'sticky', top: '80px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', borderBottom: '1px solid #1c1c21', paddingBottom: '1rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#fbbf24', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
                    {selectedInquiry.inquiryType || 'General Inquiry'}
                  </span>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 700, color: '#fff', margin: '0.2rem 0 0' }}>
                    {selectedInquiry.name}
                  </h2>
                </div>

                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <button
                    onClick={() => handleDelete(selectedInquiry._id, selectedInquiry.name)}
                    title="Delete Inquiry"
                    style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.25)', color: '#f87171', padding: '0.45rem', borderRadius: 8, cursor: 'pointer', display: 'flex' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Inquiry Metadata */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', background: '#121215', border: '1px solid #1c1c21', borderRadius: 12, padding: '1rem', marginBottom: '1.25rem', fontSize: '0.8rem', color: '#a1a1aa' }}>
                <div>
                  <span style={{ color: '#71717a', display: 'block', fontSize: '0.725rem' }}>Email Address</span>
                  <strong style={{ color: '#fff' }}>{selectedInquiry.email}</strong>
                </div>
                <div>
                  <span style={{ color: '#71717a', display: 'block', fontSize: '0.725rem' }}>Company / Organization</span>
                  <strong style={{ color: '#fff' }}>{selectedInquiry.company || 'N/A'}</strong>
                </div>
                <div>
                  <span style={{ color: '#71717a', display: 'block', fontSize: '0.725rem' }}>Phone Contact</span>
                  <strong style={{ color: '#fff' }}>{selectedInquiry.phone || 'N/A'}</strong>
                </div>
                <div>
                  <span style={{ color: '#71717a', display: 'block', fontSize: '0.725rem' }}>Received Date</span>
                  <strong style={{ color: '#fff' }}>
                    {selectedInquiry.createdAt ? new Date(selectedInquiry.createdAt).toLocaleString() : 'Recent'}
                  </strong>
                </div>
              </div>

              {/* Message Content */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#71717a', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.4rem' }}>
                  Client Message Body
                </label>
                <div style={{ background: '#121215', border: '1px solid #1c1c21', borderRadius: 12, padding: '1.1rem', color: '#e4e4e7', fontSize: '0.875rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                  {selectedInquiry.message}
                </div>
              </div>

              {/* Reply Form */}
              <form onSubmit={handleSendReply} style={{ borderTop: '1px solid #1c1c21', paddingTop: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#d4d4d8', marginBottom: '0.4rem' }}>
                  Compose Executive Email Response
                </label>
                <textarea
                  rows={4}
                  required
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  placeholder={`Write your response to ${selectedInquiry.name}...`}
                  style={{ width: '100%', background: '#121215', border: '1px solid #22222a', borderRadius: 10, padding: '0.75rem 0.9rem', color: '#fff', fontSize: '0.85rem', outline: 'none', resize: 'vertical', marginBottom: '1rem' }}
                />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '0.35rem' }}>
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(selectedInquiry._id, 'archived')}
                      style={{ background: '#121215', border: '1px solid #22222a', color: '#a1a1aa', padding: '0.45rem 0.75rem', borderRadius: 8, fontSize: '0.75rem', cursor: 'pointer' }}
                    >
                      Archive Message
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={sending}
                    style={{
                      background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)',
                      border: 'none',
                      color: '#000',
                      padding: '0.6rem 1.25rem',
                      borderRadius: 10,
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      cursor: sending ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                    }}
                  >
                    <Send size={15} /> {sending ? 'Transmitting...' : 'Send Email Reply'}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div style={{ background: '#09090b', border: '1px dashed #22222a', borderRadius: 18, padding: '4rem 1.5rem', textAlign: 'center', color: '#71717a' }}>
              <MessageSquare size={36} style={{ margin: '0 auto 0.6rem', opacity: 0.5 }} />
              <p style={{ fontSize: '0.9rem', fontWeight: 500, margin: 0 }}>Select an inquiry from the inbox feed to review details.</p>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        @media (max-width: 900px) {
          .inquiry-split { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
