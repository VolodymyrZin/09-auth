export type NoteTag =
  | 'Work'
  | 'Personal'
  | 'Meeting'
  | 'Shopping'
  | 'Ideas'
  | 'Travel'
  | 'Finance'
  | 'Health'
  | 'Important'
  | 'Todo';
export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  userId?: string;
  tag: NoteTag;
}

export interface CreateNotePayload {
  title: string;
  content: string;
  tag: NoteTag;
}

export interface FetchNotesParams {
  search?: string;
  tag?: NoteTag;
  page?: number;
  perPage?: number;
  sortBy?: 'created' | 'updated';
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}
