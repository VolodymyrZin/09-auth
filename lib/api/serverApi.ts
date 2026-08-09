import { cookies } from 'next/headers';
import axios from 'axios';
import type { User } from '@/types/user';
import type { Note, FetchNotesParams, FetchNotesResponse } from '@/types/note';

const baseURL = process.env.NEXT_PUBLIC_API_URL + '/api';

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

  const { data } = await axios.get<FetchNotesResponse>(`${baseURL}/notes`, {
    ...config,
    params,
  });

  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const config = await getCookieHeader();

  const { data } = await axios.get<Note>(`${baseURL}/notes/${id}`, config);

  return data;
};

export const getMe = async (): Promise<User> => {
  const config = await getCookieHeader();

  const { data } = await axios.get<User>(`${baseURL}/users/me`, config);

  return data;
};

export const checkSession = async (): Promise<{ message: string }> => {
  const config = await getCookieHeader();

  const { data } = await axios.get<{ message: string }>(
    `${baseURL}/auth/session`,
    config
  );

  return data;
};
