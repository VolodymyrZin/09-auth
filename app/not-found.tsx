import Link from 'next/link';
import css from './not-found.module.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 - Page Not Found | NoteHub',
  description: 'Sorry, the page you are looking for does not exist on NoteHub.',
  openGraph: {
    title: '404 - Page Not Found | NoteHub',
    description:
      'Sorry, the page you are looking for does not exist on NoteHub.',
    url: 'https://notehub.com/404',
    siteName: 'NoteHub',
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        width: 1200,
        height: 630,
        alt: 'Page Not Found',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '404 - Page Not Found | NoteHub',
    description:
      'Sorry, the page you are looking for does not exist on NoteHub.',
    images: ['https://ac.goit.global/fullstack/react/notehub-og-meta.jpg'],
  },
};

export default function NotFound() {
  return (
    <div className={css.container}>
      <h1 className={css.title}>404 - Page not found</h1>
      <p className={css.description}>
        Sorry, the page you are looking for does not exist.
      </p>
      <Link href="/" className={css.link}>
        Go back home
      </Link>
    </div>
  );
}
