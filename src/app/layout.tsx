import type { Metadata, Viewport } from 'next';
import { Inter, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Sauma Arena — Platform Manajemen Turnamen Olahraga & Live Score',
  description:
    'Sistem manajemen turnamen terpadu untuk panitia, peserta, dan penonton. Dilengkapi 7 tab publik, papan klasemen, live score, dan penilaian best supporter.',
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
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0D9748',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} ${plusJakarta.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-[var(--bg-page)] text-[var(--text-main)] font-[var(--font-sans)] antialiased transition-colors duration-150">
        {children}
      </body>
    </html>
  );
}
