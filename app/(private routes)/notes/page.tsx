import type { Metadata } from 'next';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

import { fetchNotes } from '@/lib/api/serverApi';
import NotesClient from './NotesClient';

export const metadata: Metadata = {
  title: 'Notes | NoteHub',
  description: 'Manage your notes in NoteHub',
};

export default async function NotesPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', { search: '', page: 1, tag: '' }],
    queryFn: () =>
      fetchNotes({
        search: '',
        page: 1,
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient />
    </HydrationBoundary>
  );
}
