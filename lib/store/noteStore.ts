import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { NoteTag } from '@/types/note';

export type DraftNote = {
  title: string;
  content: string;
  tag: NoteTag;
};

const initialDraft: DraftNote = {
  title: '',
  content: '',
  tag: 'Todo',
};

type NoteDraftStore = {
  draft: DraftNote;
  setDraft: (note: DraftNote) => void;
  clearDraft: () => void;
};

export const useNoteStore = create<NoteDraftStore>()(
  persist(
    set => ({
      draft: initialDraft,

      setDraft: note =>
        set({
          draft: note,
        }),

      clearDraft: () =>
        set({
          draft: initialDraft,
        }),
    }),
    {
      name: 'note-draft',
      partialize: state => ({
        draft: state.draft,
      }),
    }
  )
);
