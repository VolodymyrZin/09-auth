'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { deleteNote, fetchNotes } from '@/lib/api/clientApi';
import Loader from '@/components/Loader/Loader';

import css from './NotesClient.module.css';
import { NoteTag } from '@/types/note';

const TAGS: NoteTag[] = [
  'Work',
  'Personal',
  'Meeting',
  'Shopping',
  'Ideas',
  'Travel',
  'Finance',
  'Health',
  'Important',
  'Todo',
];

export default function NotesClient() {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [tag, setTag] = useState<NoteTag | ''>('');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', { search, page, tag }],
    queryFn: () =>
      fetchNotes({
        search,
        page,
        ...(tag ? { tag } : {}),
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNote,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['notes'],
      });
    },
  });

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handleTagChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTag(event.target.value as NoteTag | '');
    setPage(1);
  };

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <p className={css.error}>Failed to load notes.</p>;
  }

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <main className={css.mainContent}>
      <div className={css.toolbar}>
        <input
          type="text"
          placeholder="Search notes..."
          value={search}
          onChange={handleSearchChange}
          className={css.searchInput}
        />

        <select
          value={tag}
          onChange={handleTagChange}
          className={css.selectTag}
        >
          <option value="">All tags</option>

          {TAGS.map(tagName => (
            <option key={tagName} value={tagName}>
              {tagName}
            </option>
          ))}
        </select>

        <Link href="/notes/action/create" className={css.createButton}>
          Create Note
        </Link>
      </div>

      {notes.length > 0 ? (
        <div className={css.grid}>
          {notes.map(note => (
            <div key={note.id} className={css.noteCard}>
              <h2 className={css.title}>{note.title}</h2>

              <p className={css.content}>{note.content}</p>

              <span className={css.tag}>{note.tag}</span>

              <div className={css.actions}>
                <Link href={`/notes/${note.id}`} className={css.viewButton}>
                  View
                </Link>

                <button
                  type="button"
                  onClick={() => deleteMutation.mutate(note.id)}
                  className={css.deleteButton}
                  disabled={deleteMutation.isPending}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className={css.empty}>No notes found.</p>
      )}

      {totalPages > 1 && (
        <div className={css.pagination}>
          <button
            type="button"
            disabled={page === 1}
            onClick={() => setPage(current => Math.max(current - 1, 1))}
            className={css.pageButton}
          >
            Prev
          </button>

          <span className={css.pageInfo}>
            {page} / {totalPages}
          </span>

          <button
            type="button"
            disabled={page === totalPages}
            onClick={() => setPage(current => current + 1)}
            className={css.pageButton}
          >
            Next
          </button>
        </div>
      )}
    </main>
  );
}
