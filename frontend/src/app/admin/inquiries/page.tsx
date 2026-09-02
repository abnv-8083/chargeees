'use client';
import React, { useEffect, useState } from 'react';
import { fetchAllInquiriesAdmin, updateInquiryAdmin, replyInquiryAdmin, deleteInquiryAdmin } from '@/lib/api';
import { showToast } from '@/lib/toast';
import { AdminModal, ConfirmDialog, AdminLoading } from '@/app/admin/components';
import { adminInput, adminSelect, adminLabel, adminBtn } from '@/app/admin/components/adminStyles';
import { Inbox, Mail, Trash2, Search, Filter, Send, Phone, Building, Eye, FolderOpen, Loader2, X } from 'lucide-react';

interface Inquiry {
  _id: string; name: string; email: string; phone?: string; company?: string;
  companyName?: string; subject?: string; inquiryType: string; message: string;
  status: 'unread' | 'read' | 'replied' | 'archived';
  replyMessage?: string; repliedAt?: string; createdAt?: string;
}

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
  const [deleteTarget, setDeleteTarget] = useState<Inquiry | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadInquiries = async () => {
    setLoading(true);
    try {
      const res = await fetchAllInquiriesAdmin();
      setInquiries(Array.isArray(res) ? res : res?.data || []);
    } catch { setInquiries([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadInquiries(); }, []);

  const handleOpenDetails = async (inq: Inquiry) => {
    setSelectedInquiry(inq);
    setReplyText(inq.replyMessage || '');
    if (inq.status === 'unread') {
      try {
        await updateInquiryAdmin(inq._id, { status: 'read' });
        loadInquiries();
      } catch { /* ignore */ }
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInquiry || !replyText.trim()) return;
    setSaving(true);
    try {
      await replyInquiryAdmin(selectedInquiry._id, replyText);
      showToast.success('Reply sent', `Response dispatched to ${selectedInquiry.email}`);
      setSelectedInquiry(null);
      setReplyText('');
      loadInquiries();
    } catch (err: any) {
      showToast.error('Reply failed', err.message || 'Could not send reply.');
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteInquiryAdmin(deleteTarget._id);
      showToast.success('Inquiry deleted', `Message from ${deleteTarget.name} removed.`);
      if (selectedInquiry?._id === deleteTarget._id) setSelectedInquiry(null);
      setDeleteTarget(null);
      loadInquiries();
    } catch (err: any) {
      showToast.error('Delete failed', err.message || 'Could not delete inquiry.');
    } finally { setDeleting(false); }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateInquiryAdmin(id, { status: newStatus });
      if (selectedInquiry?._id === id) setSelectedInquiry({ ...selectedInquiry, status: newStatus as any });
      loadInquiries();
    } catch { /* ignore */ }
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
    const matchSearch = !searchQuery || inq.name.toLowerCase().includes(searchQuery.toLowerCase()) || inq.email.toLowerCase().includes(searchQuery.toLowerCase()) || (companyVal && companyVal.toLowerCase().includes(searchQuery.toLowerCase())) || (inq.subject && inq.subject.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchStatus && matchType && matchSearch;
  });

  const STATUS_TABS = ['ALL', 'unread', 'read', 'replied'];
  const TYPE_TABS = ['ALL', 'Project', 'General', 'Partnership', 'Career', 'Support', 'Other'];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, color: '#fafafa', marginBottom: '0.4rem' }}>Client Inquiries</h1>
          <p style={{ color: '#71717a', fontSize: '0.875rem' }}>Manage contact submissions, replies, and status tracking.</p>
        </div>
        <button onClick={handleExportCSV} style={adminBtn.secondary()}>
          <Mail size={15} /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div style={{ background: '#09090b', border: '1px solid #18181b', borderRadius: 12, padding: '0.85rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
            <Filter size={14} color="#52525b" />
            {STATUS_TABS.map(st => (
              <button key={st} onClick={() => setFilterStatus(st)} style={{
                background: filterStatus === st ? '#fafafa' : '#18181b',
                color: filterStatus === st ? '#000' : '#71717a',
                border: 'none', padding: '0.3rem 0.7rem', borderRadius: 6,
                fontSize: '0.75rem', fontWeight: filterStatus === st ? 600 : 400, textTransform: 'capitalize', cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}>{st === 'ALL' ? 'All' : st}</button>
            ))}
          </div>
          <div style={{ position: 'relative', width: '240px' }}>
            <Search size={14} style={{ position: 'absolute', left: '0.65rem', top: '50%', transform: 'translateY(-50%)', color: '#52525b' }} />
            <input type="text" placeholder="Search name, email..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              style={{ width: '100%', background: '#0d0d0f', border: '1px solid #27272a', borderRadius: 8, padding: '0.4rem 0.75rem 0.4rem 2rem', color: '#fafafa', fontSize: '0.8rem' }} />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
          {TYPE_TABS.map(tp => (
            <button key={tp} onClick={() => setFilterType(tp)} style={{
              background: filterType === tp ? (tp === 'Project' ? 'rgba(139,92,246,0.8)' : '#fafafa') : (tp === 'Project' ? 'rgba(139,92,246,0.08)' : '#18181b'),
              color: filterType === tp ? (tp === 'Project' ? '#fff' : '#000') : (tp === 'Project' ? '#a78bfa' : '#71717a'),
              border: tp === 'Project' ? '1px solid rgba(139,92,246,0.3)' : 'none',
              padding: '0.25rem 0.65rem', borderRadius: 6,
              fontSize: '0.7rem', fontWeight: filterType === tp ? 600 : 400, cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}>{tp === 'ALL' ? 'All Types' : tp}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <AdminLoading text="Loading inquiries..." />
      ) : filteredInquiries.length === 0 ? (
        <div style={{ background: '#09090b', border: '1px dashed #27272a', borderRadius: 16, padding: '4rem 2rem', textAlign: 'center' }}>
          <Inbox size={40} style={{ margin: '0 auto 1rem', color: '#3f3f46' }} />
          <h3 style={{ color: '#fafafa', marginBottom: '0.5rem' }}>No inquiries found</h3>
          <p style={{ color: '#71717a', fontSize: '0.875rem' }}>Client messages will appear here.</p>
        </div>
      ) : (
        <div style={{ background: '#09090b', border: '1px solid #18181b', borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#0d0d0f', borderBottom: '1px solid #18181b' }}>
                  {['Sender', 'Message Preview', 'Date', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '0.85rem 1rem', fontSize: '0.7rem', color: '#52525b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', ...(h === 'Actions' ? { textAlign: 'right' as const } : {}) }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredInquiries.map((inq, i) => {
                  const isProject = inq.inquiryType === 'Project';
                  const projectName = extractProjectName(inq.subject);
                  const companyVal = inq.companyName || inq.company;
                  return (
                    <tr key={inq._id || i} onClick={() => handleOpenDetails(inq)} style={{
                      borderBottom: '1px solid #18181b', cursor: 'pointer', transition: 'background 0.1s',
                      background: isProject ? 'rgba(139,92,246,0.03)' : inq.status === 'unread' ? 'rgba(239,68,68,0.03)' : 'transparent',
                      borderLeft: isProject ? '3px solid rgba(139,92,246,0.4)' : '3px solid transparent',
                    }}
                      onMouseEnter={e => e.currentTarget.style.background = '#0d0d0f'}
                      onMouseLeave={e => e.currentTarget.style.background = isProject ? 'rgba(139,92,246,0.03)' : inq.status === 'unread' ? 'rgba(239,68,68,0.03)' : 'transparent'}>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: inq.status === 'unread' ? 700 : 500, fontSize: '0.85rem', color: '#fafafa' }}>{inq.name}</span>
                          <span style={{ fontSize: '0.7rem', color: '#52525b' }}>{inq.email}</span>
                          {companyVal && <span style={{ fontSize: '0.65rem', color: '#3f3f46' }}>{companyVal}</span>}
                        </div>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', maxWidth: '340px' }}>
                        <span style={{ fontSize: '0.65rem', background: isProject ? 'rgba(139,92,246,0.15)' : '#18181b', color: isProject ? '#a78bfa' : '#71717a', padding: '0.1rem 0.4rem', borderRadius: 4, fontWeight: 600, textTransform: 'uppercase' }}>
                          {isProject ? 'Project' : (inq.inquiryType || 'General')}
                        </span>
                        {isProject && projectName && <span style={{ fontSize: '0.65rem', background: 'rgba(139,92,246,0.08)', color: '#c4b5fd', padding: '0.1rem 0.4rem', borderRadius: 4, marginLeft: '0.35rem' }}>{projectName}</span>}
                        <p style={{ fontSize: '0.8rem', color: inq.status === 'unread' ? '#d4d4d8' : '#71717a', margin: '0.35rem 0 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{inq.message}</p>
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span style={{ fontSize: '0.7rem', color: '#52525b' }}>{inq.createdAt ? new Date(inq.createdAt).toLocaleDateString() : 'Recent'}</span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span style={{ fontSize: '0.65rem', padding: '0.15rem 0.5rem', borderRadius: 5, background: inq.status === 'unread' ? 'rgba(239,68,68,0.15)' : inq.status === 'replied' ? 'rgba(74,222,128,0.15)' : '#18181b', color: inq.status === 'unread' ? '#f87171' : inq.status === 'replied' ? '#4ade80' : '#71717a', fontWeight: 700, textTransform: 'uppercase' }}>{inq.status}</span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem' }}>
                          <button onClick={() => handleOpenDetails(inq)} style={adminBtn.ghost}><Eye size={12} /> View</button>
                          <button onClick={() => setDeleteTarget(inq)} style={adminBtn.danger}><Trash2 size={12} /></button>
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

      {/* Inquiry Detail Modal */}
      {selectedInquiry && (() => {
        const isProject = selectedInquiry.inquiryType === 'Project';
        const projectName = extractProjectName(selectedInquiry.subject);
        const companyVal = selectedInquiry.companyName || selectedInquiry.company;
        return (
          <AdminModal
            open={true}
            onClose={() => setSelectedInquiry(null)}
            title={selectedInquiry.name}
            subtitle={isProject && projectName ? `Inquiring about: ${projectName}` : selectedInquiry.inquiryType || 'General Inquiry'}
            icon={<Mail size={18} />}
            maxWidth="640px"
            footer={
              <>
                <button onClick={() => setSelectedInquiry(null)} style={adminBtn.secondary()}>Close</button>
                <button onClick={handleSendReply} disabled={saving || !replyText.trim()} style={adminBtn.primary(saving)}>
                  {saving && <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />}
                  <Send size={14} /> {saving ? 'Sending...' : 'Send Reply'}
                </button>
              </>
            }
          >
            {/* Metadata */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.85rem', background: '#0d0d0f', padding: '1rem', borderRadius: 10, marginBottom: '1.25rem', border: '1px solid #18181b' }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: '#52525b', display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.15rem' }}><Mail size={11} /> Email</span>
                <a href={`mailto:${selectedInquiry.email}`} style={{ fontSize: '0.85rem', color: '#fafafa', fontWeight: 600, textDecoration: 'none' }}>{selectedInquiry.email}</a>
              </div>
              {selectedInquiry.phone && <div>
                <span style={{ fontSize: '0.7rem', color: '#52525b', display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.15rem' }}><Phone size={11} /> Phone</span>
                <span style={{ fontSize: '0.85rem', color: '#fafafa', fontWeight: 600 }}>{selectedInquiry.phone}</span>
              </div>}
              {companyVal && <div>
                <span style={{ fontSize: '0.7rem', color: '#52525b', display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.15rem' }}><Building size={11} /> Organization</span>
                <span style={{ fontSize: '0.85rem', color: '#fafafa', fontWeight: 600 }}>{companyVal}</span>
              </div>}
              <div>
                <span style={{ fontSize: '0.7rem', color: '#52525b', display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.15rem' }}>Status</span>
                <select value={selectedInquiry.status} onChange={e => handleStatusChange(selectedInquiry._id, e.target.value)} style={{ ...adminInput, padding: '0.4rem 0.6rem', fontSize: '0.8rem' }}>
                  <option value="unread">Unread</option>
                  <option value="read">Read</option>
                  <option value="replied">Replied</option>
                </select>
              </div>
            </div>

            {/* Message */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={adminLabel}>Message</label>
              <div style={{ background: '#0d0d0f', border: '1px solid #18181b', borderRadius: 10, padding: '1rem', color: '#d4d4d8', fontSize: '0.9rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                {selectedInquiry.message}
              </div>
            </div>

            {/* Reply */}
            <div>
              <label style={{ ...adminLabel, color: '#d4d4d8', display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Send size={13} /> Reply</label>
              <textarea rows={4} required placeholder={`Write a reply to ${selectedInquiry.name}...`} value={replyText} onChange={e => setReplyText(e.target.value)}
                style={{ ...adminInput, resize: 'vertical', minHeight: 100, lineHeight: 1.5 }} />
            </div>
          </AdminModal>
        );
      })()}

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Inquiry"
        description={`Delete the inquiry from "${deleteTarget?.name}"? This cannot be undone.`}
        confirmLabel="Delete Inquiry"
        loading={deleting}
      />

      <style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
