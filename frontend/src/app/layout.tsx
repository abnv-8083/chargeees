import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import PageTransition from '@/components/ui/PageTransition';
import ScrollProgress from '@/components/ui/ScrollProgress';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

export const metadata: Metadata = {
  title: 'ChargEase — Powering the Future of Business',
  description: 'ChargEase delivers cutting-edge solutions that transform industries and accelerate growth through innovation, precision, and excellence.',
  keywords: ['ChargEase', 'business solutions', 'consulting', 'innovation', 'digital transformation'],
  authors: [{ name: 'ChargEase' }],
  openGraph: {
    type: 'website',
    title: 'ChargEase — Powering the Future of Business',
    description: 'ChargEase delivers cutting-edge solutions that transform industries and accelerate growth.',
    siteName: 'ChargEase',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ChargEase — Powering the Future of Business',
    description: 'ChargEase delivers cutting-edge solutions that transform industries.',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png' },
    ],
    shortcut: '/favicon.png',
    apple: '/apple-touch-icon.png',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#000000',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AuthProvider>
          <PageTransition>
            {children}
          </PageTransition>
          <ScrollProgress />
        </AuthProvider>
      </body>
    </html>
  );
}
