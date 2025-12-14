import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllBookCategories,
  createBookCategory,
  updateBookCategory,
  deleteBookCategory,
} from "@/services/book-category";
import { toast } from "sonner";

export function useCategories(searchTerm: string, page: number, pageSize: number) {
  const queryClient = useQueryClient();

  const categoriesQuery = useQuery({
    queryKey: ["categories", page, pageSize,searchTerm],
    queryFn: () => getAllBookCategories(searchTerm,page, pageSize),
  });

  const createMutation = useMutation({
    mutationFn: createBookCategory,
    onSuccess: () => {
      toast.success("Category created");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: () => toast.error("Failed to create category"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: any) => updateBookCategory(id, data),
    onSuccess: () => {
      toast.success("Category updated");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: () => toast.error("Failed to update category"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBookCategory,
    onSuccess: () => {
      toast.success("Category deleted");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: () => toast.error("Failed to delete category"),
  });

  return {
    categoriesQuery,
    createMutation,
    updateMutation,
    deleteMutation,
  };
}
