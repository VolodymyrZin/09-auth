'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api/clientApi';
import css from './NotePreview.module.css';

interface NotePreviewProps {
  id: string;
}

export default function NotePreview({ id }: NotePreviewProps) {
  const {
    data: note,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Failed to load note.</p>;
  if (!note) return null;

  return (
    <div className={css.container}>
      <h2>{note.title}</h2>
      <p>
        <strong>Tag:</strong> {note.tag}
      </p>
      <p>{note.content}</p>
      <p>
        <small>
          Created at: {new Date(note.createdAt).toLocaleDateString()}
        </small>
      </p>
    </div>
  );
}
