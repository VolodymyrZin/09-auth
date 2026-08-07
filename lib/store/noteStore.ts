// lib/store/noteStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type DraftNote = {
  title: string;
  content: string;
  tag: string;
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
