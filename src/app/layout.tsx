import type { Metadata, Viewport } from 'next';
import { Inter, Teko, Bebas_Neue, Barlow_Condensed } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const teko = Teko({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-teko',
  display: 'swap',
});

const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-bebas',
  display: 'swap',
});

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-barlow-condensed',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Sauma Arena',
  description:
    'Sistem manajemen turnamen terpadu untuk panitia, peserta, dan penonton. Dilengkapi portal publik, papan klasemen, live score, dan penilaian best supporter.',
  keywords: [
    'Sauma Arena',
    'Turnamen Futsal SD MI',
    'Milad Matsanega Futsal Competition',
    'MMFC I',
    'Live Score Futsal',
    'Klasemen MMFC I',
    'Best Supporter',
  ],
  authors: [{ name: 'Sauma Arena Team' }],
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', sizes: '192x192', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-icon.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#1D63B8',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${inter.variable} ${teko.variable} ${bebasNeue.variable} ${barlowCondensed.variable}`}
    >
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.png" type="image/png" sizes="192x192" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
      </head>
      <body className="min-h-screen bg-[var(--bg-page)] text-[var(--text-main)] font-[var(--font-sans)] antialiased transition-colors duration-150">
        {children}
      </body>
    </html>
  );
}
