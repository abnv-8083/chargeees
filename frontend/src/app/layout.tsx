import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import PageTransition from '@/components/ui/PageTransition';

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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;0,900;1,700&family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AuthProvider>
          <PageTransition>
            {children}
          </PageTransition>
        </AuthProvider>
      </body>
    </html>
  );
}
