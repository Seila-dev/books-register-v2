import { Book } from "@/types/bookData";
import { useApi } from "../useApi";
import { useQuery } from "@tanstack/react-query";

export function useBookById(id: string) {
  const api = useApi();

  return useQuery<Book, Error>({
    queryKey: ['book', id],
    queryFn: async () => {
      const res = await api.get<Book>(`/books/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
}