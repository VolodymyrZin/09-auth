import type { Metadata } from 'next';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

import { fetchNoteById } from '@/lib/api/serverApi';
import NoteDetailsClient from './NoteDetailsClient';

interface NoteDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: NoteDetailsPageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const note = await fetchNoteById(id);

    return {
      title: `${note.title} | NoteHub`,
      description: note.content.slice(0, 100),
    };
  } catch {
    return {
      title: 'Note Details | NoteHub',
      description: 'Note details page',
    };
  }
}

export default async function NoteDetailsPage({
  params,
}: NoteDetailsPageProps) {
  const { id } = await params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}
