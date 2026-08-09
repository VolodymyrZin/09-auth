import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from '@tanstack/react-query';

import { fetchNotes } from '@/lib/api';
import NotesClient from './Notes.client';
import { Metadata } from 'next';

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tagValue = slug?.[0] || 'all';
  const filterTitle = tagValue === 'all' ? 'All Notes' : `Notes: ${tagValue}`;
  const filterDescription =
    tagValue === 'all'
      ? 'Browse all notes in NoteHub'
      : `Browse notes filtered by tag: ${tagValue}`;
  return {
    title: `${filterTitle} | NoteHub`,
    description: filterDescription,
    openGraph: {
      title: `${filterTitle} | NoteHub`,
      description: filterDescription,
      url: `https://notehub.com/notes/filter/${slug?.join('/') || 'all'}`,
      siteName: 'NoteHub',
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: filterTitle,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${filterTitle} | NoteHub`,
      description: filterDescription,
      images: ['https://ac.goit.global/fullstack/react/notehub-og-meta.jpg'],
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;

  const tag = slug?.[0] === 'all' ? undefined : slug?.[0];

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', tag, 1, ''],
    queryFn: () =>
      fetchNotes({
        tag,
        page: 1,
        search: '',
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}
