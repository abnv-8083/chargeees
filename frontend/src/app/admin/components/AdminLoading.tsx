'use client';
import React from 'react';
import { Loader2 } from 'lucide-react';

interface AdminLoadingProps {
  text?: string;
  fullPage?: boolean;
}

export default function AdminLoading({ text = 'Loading...', fullPage = false }: AdminLoadingProps) {
  const content = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        padding: fullPage ? '6rem 2rem' : '3rem 2rem',
        color: '#52525b',
      }}
    >
      <Loader2
        size={28}
        style={{
          color: '#38bdf8',
          animation: 'spin 1s linear infinite',
        }}
      />
      <p style={{ fontSize: '0.875rem', fontWeight: 500, color: '#71717a', margin: 0 }}>
        {text}
      </p>

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );

  if (fullPage) {
    return (
      <div
        style={{
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {content}
      </div>
    );
  }

  return content;
}
