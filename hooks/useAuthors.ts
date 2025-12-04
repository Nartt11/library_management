// hooks/useAuthors.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllAuthors,
  createAuthor,
  updateAuthor,
  deleteAuthor,
} from "@/services/author";
import { toast } from "sonner";

export function useAuthors(page: number, pageSize: number) {
  const queryClient = useQueryClient();

  // GET LIST
  const authorsQuery = useQuery({
    queryKey: ["authors", page, pageSize],
    queryFn: () => getAllAuthors(page, pageSize),
  });

  // CREATE
  const createMutation = useMutation({
    mutationFn: createAuthor,
    onSuccess: () => {
      toast.success("Author created");
      queryClient.invalidateQueries({ queryKey: ["authors"] });
    },
    onError: () => toast.error("Failed to create author"),
  });

  // UPDATE
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: any) => updateAuthor(id, data),
    onSuccess: () => {
      toast.success("Author updated");
      queryClient.invalidateQueries({ queryKey: ["authors"] });
    },
    onError: () => toast.error("Failed to update author"),
  });

  // DELETE
  const deleteMutation = useMutation({
    mutationFn: deleteAuthor,
    onSuccess: () => {
      toast.success("Author deleted");
      queryClient.invalidateQueries({ queryKey: ["authors"] });
    },
    onError: () => toast.error("Failed to delete author"),
  });

  return {
    authorsQuery,
    createMutation,
    updateMutation,
    deleteMutation,
  };
}
