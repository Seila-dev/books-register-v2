import { Book } from "@/types/bookData";
import { useApi } from "../useApi";
import { useQuery } from "@tanstack/react-query";

export function useBooksByCategory(categoryId: string) {
  const api = useApi();

  return useQuery<Book[], Error>({
    queryKey: ['books', 'category', categoryId],
    queryFn: async () => {
      const res = await api.get<Book[]>(`/books/category/${categoryId}`);
      return res.data;
    },
    enabled: !!categoryId,
  });
}