import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api/serverApi';
import NotesClient from './Notes.client';
import { Metadata } from 'next';
import { NoteTag } from '@/types/note';

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
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;

  const tag = slug?.[0] === 'all' ? undefined : (slug?.[0] as NoteTag);

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', { search: '', page: 1, tag: tag ?? '' }],
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
