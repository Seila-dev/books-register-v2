import { useQuery } from '@tanstack/react-query';
import { Note } from '@/types/noteData';
import { useApi } from '../useApi';

export function useNoteById(id: string) {
  const api = useApi();

  return useQuery<Note, Error>({
    queryKey: ['note', id],
    queryFn: async () => {
      const res = await api.get<Note>(`/notes/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
}