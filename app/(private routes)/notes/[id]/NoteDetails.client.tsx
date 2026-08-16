'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import Link from 'next/link';

import { fetchNoteById } from '@/lib/api/clientApi';

import css from './NoteDetailsClient.module.css';

export default function NoteDetailsClient() {
  const { id } = useParams<{
    id: string;
  }>();

  const {
    data: note,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    enabled: Boolean(id),
  });

  if (isLoading) {
    return <p>Loading, please wait...</p>;
  }

  if (isError || !note) {
    return <p>Something went wrong.</p>;
  }

  return (
    <main className={css.container}>
      <div className={css.item}>
        <div className={css.header}>
          <h1 className={css.title}>{note.title}</h1>
        </div>

        <p className={css.tag}>{note.tag}</p>

        <p className={css.content}>{note.content}</p>

        <p className={css.date}>
          {note.createdAt ? new Date(note.createdAt).toLocaleDateString() : ''}
        </p>

        <Link href="/notes/filter/all" className={css.backButton}>
          Back to Notes
        </Link>
      </div>
    </main>
  );
}
