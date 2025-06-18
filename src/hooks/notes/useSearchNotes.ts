import { Note } from "@/types/noteData";
import { useQuery } from "@tanstack/react-query";
import { useApi } from "../useApi";

export function useSearchNotes(search: string) {
  const api = useApi();

  return useQuery<Note[], Error>({
    queryKey: ['notes', 'search', search],
    queryFn: async () => {
      const res = await api.get<Note[]>(`/notes?search=${encodeURIComponent(search)}`);
      return res.data;
    },
    enabled: !!search,
  });
}