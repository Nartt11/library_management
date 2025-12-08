import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllBooks, searchBooksByTitle, createBook, searchBooksByAuthor, updateBookCategories, updateBookAuthors } from "@/services/book";
import { toast } from "sonner";

export function useBooks(page: number, pageSize: number, title: string = "", author: string = "") {
  const queryClient = useQueryClient();

  // Query lấy books (có search)
  const booksQuery = useQuery({
    queryKey: ["books", page, pageSize, title, author],
    queryFn: ({ queryKey }) => {
      const [_k, p, ps, t, a] = queryKey as [string, number, number, string, string];
      const trimmedTitle = (t || "").trim();
      const trimmedAuthor = (a || "").trim();

      if (trimmedTitle !== "") {
        return searchBooksByTitle(trimmedTitle, p, ps);
      }
      if (trimmedAuthor !== "") {
        return searchBooksByAuthor(trimmedAuthor, p, ps);
      }
      return getAllBooks(p, ps);
    },
    // keepPrivateData: true,
  });


  // Mutation create book
  const createMutation = useMutation({
    mutationFn: createBook,
    onSuccess: () => {
      toast.success("Book created");
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
    onError: () => toast.error("Failed to create book"),
  });
  // Mutation update book categories
const updateCategoriesMutation = useMutation({
  mutationFn: ({ id, categoryIds }: any) => updateBookCategories(id, categoryIds),
  onSuccess: () => {
    toast.success("Book categories updated");
    queryClient.invalidateQueries({ queryKey: ["books"] });
  },
  onError: () => toast.error("Failed to update book categories"),
});

// Mutation update book authors
const updateAuthorsMutation = useMutation({
  mutationFn: ({ id, authorIds }: any) => updateBookAuthors(id, authorIds),
  onSuccess: () => {
    toast.success("Book authors updated");
    queryClient.invalidateQueries({ queryKey: ["books"] });
  },
  onError: () => toast.error("Failed to update book authors"),
});

  return {
  booksQuery,
  createMutation,
  updateCategoriesMutation,
  updateAuthorsMutation,
};
}
