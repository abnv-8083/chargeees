'use client';
import React from 'react';
import { AlertTriangle, Trash2, Info } from 'lucide-react';
import AdminModal from './AdminModal';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
  loading?: boolean;
}

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  variant = 'danger',
  loading = false,
}: ConfirmDialogProps) {
  const variantStyles = {
    danger: {
      iconBg: 'rgba(239,68,68,0.12)',
      iconBorder: 'rgba(239,68,68,0.3)',
      iconColor: '#f87171',
      btnBg: 'linear-gradient(135deg, #dc2626, #b91c1c)',
      btnHover: '#ef4444',
      icon: <Trash2 size={18} />,
    },
    warning: {
      iconBg: 'rgba(234,179,8,0.12)',
      iconBorder: 'rgba(234,179,8,0.3)',
      iconColor: '#facc15',
      btnBg: 'linear-gradient(135deg, #d97706, #b45309)',
      btnHover: '#f59e0b',
      icon: <AlertTriangle size={18} />,
    },
    info: {
      iconBg: 'rgba(56,189,248,0.12)',
      iconBorder: 'rgba(56,189,248,0.3)',
      iconColor: '#38bdf8',
      btnBg: '#fff',
      btnHover: '#e4e4e7',
      icon: <Info size={18} />,
    },
  };

  const vs = variantStyles[variant];

  return (
    <AdminModal
      open={open}
      onClose={onClose}
      title={title}
      icon={vs.icon}
      maxWidth="440px"
      footer={
        <>
          <button
            onClick={onClose}
            disabled={loading}
            style={{
              background: '#1c1c1f',
              border: '1px solid #27272a',
              color: '#a1a1aa',
              padding: '0.6rem 1.25rem',
              borderRadius: 10,
              fontSize: '0.85rem',
              fontWeight: 500,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            style={{
              background: vs.btnBg,
              color: variant === 'info' ? '#000' : '#fff',
              border: 'none',
              padding: '0.6rem 1.5rem',
              borderRadius: 10,
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.15s ease',
            }}
          >
            {loading && (
              <div
                style={{
                  width: 14,
                  height: 14,
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#fff',
                  borderRadius: '50%',
                  animation: 'spin 0.6s linear infinite',
                }}
              />
            )}
            {confirmLabel}
          </button>
        </>
      }
    >
      <p style={{ fontSize: '0.9rem', color: '#a1a1aa', lineHeight: 1.6, margin: 0 }}>
        {description}
      </p>

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </AdminModal>
  );
}
