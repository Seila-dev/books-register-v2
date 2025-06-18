import { useQuery } from '@tanstack/react-query';
import { Note } from '@/types/noteData';
import { useApi } from '../useApi';

export function useNotesByBook(bookId: string) {
  const api = useApi();

  return useQuery<Note[], Error>({
    queryKey: ['notes', 'book', bookId],
    queryFn: async () => {
      const res = await api.get<Note[]>(`/notes/book/${bookId}`);
      return res.data;
    },
    enabled: !!bookId,
  });
}
