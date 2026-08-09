import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';

import './globals.css';

import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import TanStackProvider from '@/components/TanStackProvider/TanStackProvider';
import AuthProvider from '@/components/AuthProvider/AuthProvider';

export const metadata: Metadata = {
  title: {
    default: 'NoteHub',
    template: '%s | NoteHub',
  },
  description: 'NoteHub - excellent web application for managing notes',

  openGraph: {
    title: 'NoteHub',
    description: 'NoteHub - excellent web application for managing notes',
    url: 'https://notehub.com',
    siteName: 'NoteHub',
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        width: 1200,
        height: 630,
        alt: 'NoteHub Application',
      },
    ],
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'NoteHub',
    description: 'NoteHub - excellent web application for managing notes',
    images: ['https://ac.goit.global/fullstack/react/notehub-og-meta.jpg'],
  },
};

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-roboto',
  display: 'swap',
});

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <TanStackProvider>
          <AuthProvider>
            <Header />
            {children}
            <Footer />
            {modal}
          </AuthProvider>
        </TanStackProvider>
      </body>
    </html>
  );
}
