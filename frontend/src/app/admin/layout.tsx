import React from 'react';
import AdminShell from './AdminShell';

export const metadata = {
  title: 'ChargEase Admin Dashboard — CMS Panel',
  description: 'Secure enterprise content management dashboard for ChargEase.',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminShell>
      {children}
    </AdminShell>
  );
}
