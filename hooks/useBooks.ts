import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllBooks, searchBooksByTitle, createBook, searchBooksByAuthor, updateBookCategories, updateBookAuthors } from "@/services/book";
import { toast } from "sonner";

export function useBooks(page: number, pageSize: number, title: string = "", author: string = "", categoryName: string ="",isbn: string ="" ) {
  const queryClient = useQueryClient();

  // Query lấy books (có search)
  const booksQuery = useQuery({
  queryKey: [
    "books",
    page,
    pageSize,
    categoryName,
    isbn,
    title,
    author,
  ],
  queryFn: () => {
    return getAllBooks(
      page,
      pageSize,
      categoryName?.trim() || undefined,
      isbn?.trim() || undefined,
      title?.trim() || undefined,
      author?.trim() || undefined
    );
  },
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
