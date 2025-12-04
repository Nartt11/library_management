import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllBooks, createBook  } from "@/services/book";
import { toast } from "sonner";

export function useBooks(page: number, pageSize: number) {
  const queryClient = useQueryClient();

  const booksQuery = useQuery({
    queryKey: ["books", page, pageSize],
    queryFn: () => getAllBooks(page, pageSize),
  });

  const createMutation = useMutation({
    mutationFn: createBook,
    onSuccess: () => {
      toast.success("Book created");
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
    onError: () => toast.error("Failed to create book"),
  });




  return {
    booksQuery,
    createMutation,
  };
}
