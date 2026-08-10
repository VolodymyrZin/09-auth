import { cookies } from 'next/headers';
import { api } from './api';
import type { User } from '@/types/user';
import type { AxiosResponse } from 'axios';
import type { Note, FetchNotesParams, FetchNotesResponse } from '@/types/note';

const getCookieHeader = async () => {
  const cookieStore = await cookies();

  return {
    headers: {
      Cookie: cookieStore.toString(),
    },
    withCredentials: true,
  };
};

export const fetchNotes = async (
  params?: FetchNotesParams
): Promise<FetchNotesResponse> => {
  const config = await getCookieHeader();

  const { data } = await api.get<FetchNotesResponse>(`/notes`, {
    ...config,
    params,
  });

  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const config = await getCookieHeader();

  const { data } = await api.get<Note>(`/notes/${id}`, config);

  return data;
};

export const getMe = async (): Promise<User> => {
  const config = await getCookieHeader();

  const { data } = await api.get<User>(`/users/me`, config);

  return data;
};

export const checkSession = async (): Promise<
  AxiosResponse<{ message: string }>
> => {
  const config = await getCookieHeader();

  return api.get<{ message: string }>('/auth/session', config);
};
