import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllPublishers,
  createPublisher,
  updatePublisher,
  deletePublisher,
} from "@/services/publisher";
import { toast } from "sonner";

export function usePublishers(page: number, pageSize: number) {
  const queryClient = useQueryClient();

  const publishersQuery = useQuery({
    queryKey: ["publishers", page, pageSize],
    queryFn: () => getAllPublishers(page, pageSize),
  });

  const createMutation = useMutation({
    mutationFn: createPublisher,
    onSuccess: () => {
      toast.success("Publisher created");
      queryClient.invalidateQueries({ queryKey: ["publishers"] });
    },
    onError: () => toast.error("Failed to create publisher"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: any) => updatePublisher(id, data),
    onSuccess: () => {
      toast.success("Publisher updated");
      queryClient.invalidateQueries({ queryKey: ["publishers"] });
    },
    onError: () => toast.error("Failed to update publisher"),
  });

  const deleteMutation = useMutation({
    mutationFn: deletePublisher,
    onSuccess: () => {
      toast.success("Publisher deleted");
      queryClient.invalidateQueries({ queryKey: ["publishers"] });
    },
    onError: () => toast.error("Failed to delete publisher"),
  });

  return {
    publishersQuery,
    createMutation,
    updateMutation,
    deleteMutation,
  };
}
